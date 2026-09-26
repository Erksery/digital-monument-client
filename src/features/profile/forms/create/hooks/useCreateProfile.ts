import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import type { CreateProfileFormValues } from "../types";
import type { FileWithPath } from "@mantine/dropzone";
import type { ProfileResponse } from "../../../types";
import { refreshFetch } from "@/api/refreshFetch";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useDebouncedValue } from "@mantine/hooks";

interface UseCreateProfileProps {
  tariff: "free" | "premium";
  initialData?: ProfileResponse;
  policiesAccepted?: boolean;
}

const INITIAL_VALUES: CreateProfileFormValues = {
  fullName: "",
  birthDate: null,
  deathDate: null,
  quote: "",
  quoteAuthor: "",
  birthPlace: "",
  deathPlace: "",
  spouse: "",
  citizenship: "",
  education: "",
  occupation: "",
  contentMarkdown: "",
  children: [],
  awards: [],
  avatar: "",
  photoGallery: [],
  burialAddress: "",
  burialLatitude: "",
  burialLongitude: "",
  editors: [],
  editorUserIds: [],
  visibility: {
    type: "public",
    allowedUserIds: [],
    allowedUsers: [],
  },
};

export const useCreateProfile = ({
  initialData,
  policiesAccepted = false,
  tariff,
}: UseCreateProfileProps) => {
  const queryClient = useQueryClient();
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);
  const [isGalleryProcessing, setIsGalleryProcessing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const { data: users = [], isFetching } = useSearchUsers(debouncedSearch);

  const options = users.map((user) => ({
    value: user.id,
    label: user.login,
  }));

  const isEditMode = !!initialData;

  const form = useForm<CreateProfileFormValues>({
    initialValues: INITIAL_VALUES,

    validate: {
      fullName: (value) =>
        value.trim().length < 2 ? "Введите корректное ФИО" : null,

      birthDate: (value) => (value === null ? "Укажите дату рождения" : null),

      ...(tariff === "premium" && {
        contentMarkdown: (value: string) =>
          value.trim().length === 0
            ? "Биография обязательна к заполнению"
            : null,
      }),

      burialLatitude: (value) =>
        value && isNaN(Number(value)) ? "Координаты должны быть числом" : null,

      burialLongitude: (value) =>
        value && isNaN(Number(value)) ? "Координаты должны быть числом" : null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const data = initialData as Omit<
        ProfileResponse,
        "burialLatitude" | "burialLongitude"
      >;

      form.setValues({
        ...INITIAL_VALUES,
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        deathDate: data.deathDate ? new Date(data.deathDate) : null,

        burialLatitude: data.burialCoordinates?.latitude?.toString() ?? "",
        burialLongitude: data.burialCoordinates?.longitude?.toString() ?? "",

        avatar: data.avatar ?? "",
        photoGallery: data.photoGallery ?? [],

        editorUserIds: data.editors?.map((e: any) => e.userId) ?? [],
        editors: data.editors?.map((e: any) => e) ?? [],
        visibility: {
          type: data.visibilitySettings?.visibility ?? "public",
          allowedUserIds:
            data.visibilitySettings?.allowedUsers?.map((u: any) => u.userId) ??
            [],
          allowedUsers:
            data.visibilitySettings?.allowedUsers?.map((u: any) => u) ?? [],
        },
      });
      form.resetDirty();
    }
  }, [initialData]);

  const allowedUsersData =
    form.values.visibility.allowedUsers?.map((user) => ({
      value: user.userId,
      label: user.login ?? user.userId,
    })) ?? [];

  const editorsData =
    form.values.editors?.map((user: any) => ({
      value: user.userId,
      label: user.login ?? user.userId,
    })) ?? [];

  const allowedUsersOptions = [
    ...allowedUsersData,
    ...options.filter(
      (opt) => !allowedUsersData.some((u) => u.value === opt.value),
    ),
  ];

  const editorsOptions = [
    ...editorsData,
    ...options.filter((opt) => !editorsData.some((u) => u.value === opt.value)),
  ];

  const addArrayItem = (key: string, value: string, clear: () => void) => {
    if (!value.trim()) return;
    form.insertListItem(key, value.trim());
    clear();
  };

  const removeArrayItem = (key: string, index: number) => {
    form.removeListItem(key, index);
  };

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      let url: string;
      let method: "POST" | "PATCH";

      if (isEditMode) {
        method = "PATCH";
        url = `/api/profiles/${tariff}/${initialData.id}`;
      } else {
        method = "POST";
        url = `/api/profiles/${tariff}`;
      }

      const response = await refreshFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          isEditMode
            ? "Не удалось обновить данные профиля"
            : "Не удалось создать профиль",
        );
      }

      const savedProfile = await response.json();
      const profileId = savedProfile?.id || initialData?.id;

      const rollbackCreatedProfile = async () => {
        if (!isEditMode && profileId) {
          const response = await refreshFetch(`/api/profiles/${profileId}`, {
            method: "DELETE",
          });

          if (response.ok && tariff === "premium") {
            await queryClient.invalidateQueries({
              queryKey: ["premium-access"],
            });
          }

          if (!response.ok) {
            console.error("Не удалось удалить профиль при откате");
          }
        }
      };

      const avatarFile = form.values.avatar;
      if (avatarFile instanceof File && profileId) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        try {
          const avatarResponse = await refreshFetch(
            `/api/profiles/media/${profileId}`,
            {
              method: "POST",
              body: formData,
            },
          );
          if (!avatarResponse.ok) {
            throw new Error(
              isEditMode
                ? "Данные изменены, но не удалось загрузить новый аватар"
                : "Ошибка загрузки аватара. Создание профиля отменено.",
            );
          }
        } catch (error) {
          await rollbackCreatedProfile();
          throw error;
        }
      }

      const galleryFiles = form.values.photoGallery;
      if (Array.isArray(galleryFiles) && profileId) {
        const newFiles = galleryFiles.filter((file) => file instanceof File);

        if (newFiles.length > 0) {
          const formData = new FormData();
          newFiles.forEach((file) => {
            formData.append("gallery", file);
          });

          try {
            const galleryResponse = await refreshFetch(
              `/api/profiles/gallery/${profileId}`,
              {
                method: "POST",
                body: formData,
              },
            );

            if (!galleryResponse.ok) {
              throw new Error(
                isEditMode
                  ? "Данные изменены, но не удалось обновить фото в галерее"
                  : "Ошибка загрузки галереи. Создание профиля отменено.",
              );
            }
          } catch (error) {
            await rollbackCreatedProfile();
            throw error;
          }
        }
      }

      return savedProfile;
    },

    onSuccess: (data) => {
      if (initialData?.id) {
        queryClient.invalidateQueries({
          queryKey: ["profile", initialData?.id],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["profiles"] });

      if (!isEditMode && tariff === "premium") {
        queryClient.invalidateQueries({
          queryKey: ["premium-access"],
        });
      }

      notifications.show({
        title: isEditMode
          ? "Профиль успешно обновлен!"
          : "Профиль успешно создан!",
        message: isEditMode
          ? "Изменения сохранены"
          : "Перейдите в личный кабинет для просмотра",
        color: "green",
      });

      if (!isEditMode) {
        form.reset();
      }
    },

    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      notifications.show({
        title: isEditMode ? "Внимание" : "Ошибка",
        message: message,
        color: "red",
      });
    },
  });

  const handleDropAvatar = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setIsAvatarProcessing(true);
    try {
      form.setFieldValue("avatar", file);
    } catch {
      notifications.show({
        title: "Ошибка при загрузке аватара",
        message: "Не удалось обработать аватар",
        color: "red",
      });
    } finally {
      setIsAvatarProcessing(false);
    }
  };

  const handleDropGallery = async (files: FileWithPath[]) => {
    setIsGalleryProcessing(true);
    try {
      form.setFieldValue("photoGallery", [
        ...form.values.photoGallery,
        ...files,
      ]);
    } catch {
      notifications.show({
        title: "Ошибка при загрузке фотографий",
        message: "Не удалось обработать фотографии для галереи",
        color: "red",
      });
    } finally {
      setIsGalleryProcessing(false);
    }
  };

  const handleSubmit = (values: CreateProfileFormValues) => {
    const burialCoordinates =
      values.burialLatitude && values.burialLongitude
        ? {
            latitude: Number(values.burialLatitude),
            longitude: Number(values.burialLongitude),
          }
        : null;

    if (tariff === "free") {
      mutation.mutate({
        fullName: values.fullName,
        birthDate: values.birthDate,
        deathDate: values.deathDate,
      });

      return;
    }

    if (!isEditMode && !policiesAccepted) {
      notifications.show({
        title: "Необходимо подтвердить условия",
        message: "Перед созданием профиля необходимо подтвердить все пункты.",
        color: "red",
      });

      return;
    }

    mutation.mutate({
      fullName: values.fullName,
      birthDate: values.birthDate,
      deathDate: values.deathDate,

      quote: values.quote,
      quoteAuthor: values.quoteAuthor,
      birthPlace: values.birthPlace,
      deathPlace: values.deathPlace,
      spouse: values.spouse,
      citizenship: values.citizenship,
      education: values.education,
      occupation: values.occupation,
      contentMarkdown: values.contentMarkdown,
      children: values.children,
      awards: values.awards,

      burialCoordinates,
      burialAddress: values.burialAddress,

      editorUserIds: values.editorUserIds,

      visibility: {
        type: values.visibility.type,
        allowedUserIds: values.visibility.allowedUserIds,
      },
    });
  };

  return {
    mutation,
    form,
    isAvatarProcessing,
    isGalleryProcessing,
    handleDropAvatar,
    handleDropGallery,
    addArrayItem,
    removeArrayItem,
    handleSubmit,
    search,
    setSearch,
    options,
    isFetching,
    allowedUsersOptions,
    editorsOptions,
  };
};
