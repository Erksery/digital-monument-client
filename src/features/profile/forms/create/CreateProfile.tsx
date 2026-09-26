import dayjs from "dayjs";
import "dayjs/locale/ru";
import styles from "./index.module.scss";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Loader,
  MultiSelect,
  Overlay,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
  Text,
  SegmentedControl,
  Anchor,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { QueryProvider } from "@/components/providers/QueryProvider";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { ArrayField } from "./ArrayField";
import { GalleryUpload } from "./GalleryUpload";
import { AvatarUpload } from "./AvatarUpload";
import CreateEditor from "./CreateEditor";

import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCreateProfile } from "./hooks/useCreateProfile";
import { Notifications } from "@mantine/notifications";
import type { ProfileResponse, ProfileTariff } from "../../types";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { Block } from "@/components/ui/block/Block";
import { usePremiumAccess } from "./hooks/usePremiumAccess";
import { PolicyList } from "@/components/ui/policy/list/PolicyList";
import { FREE_POLICIES, PREMIUM_POLICIES } from "@/policies";

dayjs.extend(customParseFormat);
dayjs.locale("ru");

const inputSize = "md";

const customDateParser = (value: string) => {
  if (!value) return null;
  const parsed = dayjs(value, "DD.MM.YYYY", true);
  return parsed.isValid() ? parsed.toDate() : null;
};

interface CreateProfileProps {
  initialData?: ProfileResponse;
}

function CreateProfileContent({ initialData }: CreateProfileProps) {
  const [newChild, setNewChild] = useState("");
  const [newAward, setNewAward] = useState("");
  const [tariff, setTariff] = useState<ProfileTariff>("free");
  const [policiesAccepted, setPoliciesAccepted] = useState(false);

  const editorRef = useRef<MDXEditorMethods>(null);

  const {
    mutation,
    form,
    isAvatarProcessing,
    isGalleryProcessing,
    addArrayItem,
    handleDropAvatar,
    handleDropGallery,
    handleSubmit,
    removeArrayItem,
    isFetching,
    search,
    setSearch,
    options,
    allowedUsersOptions,
    editorsOptions,
  } = useCreateProfile({
    tariff,
    initialData,
    policiesAccepted,
  });

  const { data: premiumAccess } = usePremiumAccess();

  const isEditMode = !!initialData;

  useEffect(() => {
    if (!isEditMode) return;

    setTariff(initialData.is_premium ? "premium" : "free");
  }, [isEditMode, initialData]);

  useEffect(() => {
    if (initialData?.contentMarkdown && editorRef.current) {
      editorRef.current.setMarkdown(initialData.contentMarkdown);
    }
  }, [initialData?.contentMarkdown]);

  const hasPremiumAccess = premiumAccess?.available;
  const isPremium = tariff === "premium";

  return (
    <AppWrapper>
      <div className={styles.main_container}>
        <Notifications position="top-right" zIndex={1000} />
        <Paper p={30} className={styles.paper}>
          <div className={styles.container}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                {!isEditMode && (
                  <SegmentedControl
                    fullWidth
                    radius="md"
                    size="md"
                    value={tariff}
                    onChange={(value) => setTariff(value as ProfileTariff)}
                    data={[
                      {
                        value: "free",
                        label: "Бесплатный",
                      },
                      {
                        value: "premium",
                        label: "Премиум",
                      },
                      {
                        value: "monument",
                        label: "Монумент",
                      },
                    ]}
                  />
                )}

                <Box pos="relative" w={"100%"}>
                  {!isEditMode && isPremium && !hasPremiumAccess && (
                    <Overlay
                      blur={20}
                      radius="md"
                      opacity={0.8}
                      zIndex={6}
                      className={styles.premium_overlay}
                    >
                      <Stack h="100%" justify="start" align="center">
                        <Title order={3} mt={250}>
                          Премиум профиль
                        </Title>

                        <Text ta="center" maw={420}>
                          Раздел доступен после покупки Premium. Получите
                          расширенную биографию, фотогалерею, редакторов,
                          настройки приватности и другие функции.
                        </Text>

                        <Anchor href="/prices/premium">
                          <Button size="md" color="gold">
                            Купить Premium
                          </Button>
                        </Anchor>
                      </Stack>
                    </Overlay>
                  )}

                  <Block title="Главное фото" className={styles.block} />

                  <AvatarUpload
                    avatar={
                      form.values.avatar instanceof File
                        ? URL.createObjectURL(form.values.avatar)
                        : form.values.avatar
                    }
                    loading={isAvatarProcessing}
                    onDrop={handleDropAvatar}
                    onRemove={() => form.setFieldValue("avatar", "")}
                  />

                  <Block title="Основная информация" className={styles.block} />
                  <TextInput
                    required
                    size={inputSize}
                    label="ФИО"
                    placeholder="Иванов Иван Иванович"
                    {...form.getInputProps("fullName")}
                  />

                  <Grid mt={5}>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <DateInput
                        required
                        size={inputSize}
                        label="Дата рождения"
                        placeholder="Выберите дату"
                        valueFormat="DD.MM.YYYY"
                        locale="ru"
                        dateParser={customDateParser}
                        {...form.getInputProps("birthDate")}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <DateInput
                        required
                        size={inputSize}
                        label="Дата смерти"
                        placeholder="Выберите дату"
                        valueFormat="DD.MM.YYYY"
                        locale="ru"
                        dateParser={customDateParser}
                        {...form.getInputProps("deathDate")}
                      />
                    </Grid.Col>
                  </Grid>

                  {isPremium && (
                    <>
                      <Block
                        title="Дополнительная информация"
                        className={styles.block}
                      />
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Место рождения"
                            placeholder="г. Москва"
                            {...form.getInputProps("birthPlace")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Гражданство"
                            placeholder="РФ"
                            {...form.getInputProps("citizenship")}
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid mt={5}>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Место захоронения"
                            placeholder="Троекуровское кладбище"
                            {...form.getInputProps("deathPlace")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Точный адрес захоронения"
                            placeholder="ул. Озерная, вл. 47, участок 4"
                            {...form.getInputProps("burialAddress")}
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid mt={5}>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Широта"
                            description="Получите координаты на Яндекс картах"
                            placeholder="55.65923"
                            {...form.getInputProps("burialLatitude")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Долгота"
                            description="Получите координаты на Яндекс картах"
                            placeholder="37.44711"
                            {...form.getInputProps("burialLongitude")}
                          />
                        </Grid.Col>
                      </Grid>

                      <Block title="Семья" className={styles.block} />
                      <TextInput
                        mb={5}
                        size={inputSize}
                        label="Супруг(а)"
                        placeholder="Иванова Анна"
                        {...form.getInputProps("spouse")}
                      />
                      <ArrayField
                        title="Дети"
                        placeholder="Имя ребенка"
                        value={newChild}
                        items={form.values.children || []}
                        onChange={setNewChild}
                        onAdd={() =>
                          addArrayItem("children", newChild, () =>
                            setNewChild(""),
                          )
                        }
                        onRemove={(index) => removeArrayItem("children", index)}
                      />

                      <Block
                        title="Деятельность и достижения"
                        className={styles.block}
                      />
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ArrayField
                            title="Награды и достижения"
                            placeholder="Название награды"
                            value={newAward}
                            items={form.values.awards || []}
                            onChange={setNewAward}
                            onAdd={() =>
                              addArrayItem("awards", newAward, () =>
                                setNewAward(""),
                              )
                            }
                            onRemove={(index) =>
                              removeArrayItem("awards", index)
                            }
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Род деятельности"
                            placeholder="Ученый, инженер"
                            {...form.getInputProps("occupation")}
                          />
                        </Grid.Col>
                      </Grid>

                      <Textarea
                        size={inputSize}
                        label="Образование"
                        placeholder="Опишите полученное образование..."
                        minRows={2}
                        {...form.getInputProps("education")}
                      />

                      <Block title="Цитата" className={styles.block} />
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Цитата"
                            placeholder="Жизнь прекрасна"
                            {...form.getInputProps("quote")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            size={inputSize}
                            label="Автор цитаты"
                            placeholder="Иван Иванов"
                            {...form.getInputProps("quoteAuthor")}
                          />
                        </Grid.Col>
                      </Grid>

                      <Block title="Фотогалерея" className={styles.block} />
                      <GalleryUpload
                        gallery={form.values.photoGallery}
                        loading={isGalleryProcessing}
                        onDrop={handleDropGallery}
                        onRemove={(index) =>
                          form.setFieldValue(
                            "photoGallery",
                            form.values.photoGallery.filter(
                              (_, i) => i !== index,
                            ),
                          )
                        }
                      />

                      <Block title="Биография" className={styles.block} />
                      <CreateEditor
                        ref={editorRef}
                        key="biography-editor"
                        initialText={initialData?.contentMarkdown || ""}
                        readOnly={false}
                        className={styles.md_editor}
                        onChange={(value) => {
                          form.setFieldValue("contentMarkdown", value);
                        }}
                      />

                      <Block
                        title="Настройки доступа"
                        className={styles.block}
                      />

                      <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <Select
                            label="Видимость профиля"
                            description="Выберите кому будет доступна возможность просматривать данный профиль"
                            data={[
                              {
                                value: "public",
                                label: "Публичный (виден всем)",
                              },
                              {
                                value: "private",
                                label: "Приватный (только для меня)",
                              },
                              {
                                value: "selected",
                                label: "Выбранным пользователям",
                              },
                            ]}
                            size={inputSize}
                            {...form.getInputProps("visibility.type")}
                          />

                          {form.values.visibility?.type === "selected" && (
                            <Stack mt="md">
                              <MultiSelect
                                label="Разрешенный доступ"
                                placeholder="Введите имя пользователя"
                                description="Выберите пользователей для которых будет открыта возможность просматривать профиль"
                                size="md"
                                searchable
                                searchValue={search}
                                onSearchChange={setSearch}
                                data={allowedUsersOptions}
                                value={form.values.visibility.allowedUserIds}
                                onChange={(value) => {
                                  form.setFieldValue(
                                    "visibility.allowedUserIds",
                                    value,
                                  );

                                  const updatedUsers = value.map((id) => {
                                    const existing =
                                      form.values.visibility.allowedUsers?.find(
                                        (u) => u.userId === id,
                                      );
                                    if (existing) return existing;

                                    const foundInOptions = options.find(
                                      (opt) => opt.value === id,
                                    );
                                    return {
                                      userId: id,
                                      login: foundInOptions?.label ?? id,
                                    };
                                  });
                                  form.setFieldValue(
                                    "visibility.allowedUsers",
                                    updatedUsers,
                                  );
                                }}
                                rightSection={
                                  isFetching ? <Loader size="xs" /> : null
                                }
                              />
                            </Stack>
                          )}
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <Stack>
                            <MultiSelect
                              label="Соавторы / редакторы"
                              description="Укажите имя редактора и выберите его из списка, доступна множественная выборка"
                              placeholder="Введите имя пользователя"
                              size="md"
                              searchable
                              searchValue={search}
                              onSearchChange={setSearch}
                              data={editorsOptions}
                              value={form.values.editorUserIds}
                              onChange={(value) => {
                                form.setFieldValue("editorUserIds", value);

                                const updatedEditors = value.map((id) => {
                                  const existing = form.values.editors?.find(
                                    (e: any) => e.userId === id,
                                  );
                                  if (existing) return existing;

                                  const foundInOptions = options.find(
                                    (opt) => opt.value === id,
                                  );
                                  return {
                                    userId: id,
                                    login: foundInOptions?.label ?? id,
                                  };
                                });
                                form.setFieldValue("editors", updatedEditors);
                              }}
                              rightSection={
                                isFetching ? <Loader size="xs" /> : null
                              }
                            />
                          </Stack>
                        </Grid.Col>
                      </Grid>
                    </>
                  )}

                  <div className={styles.policies_list}>
                    {isEditMode ? (
                      <Button
                        type="submit"
                        color="gold"
                        size="md"
                        mt="xl"
                        w="100%"
                        loading={mutation.isPending}
                      >
                        Сохранить изменения
                      </Button>
                    ) : (
                      <PolicyList
                        policies={isPremium ? PREMIUM_POLICIES : FREE_POLICIES}
                        onAllCheckedChange={setPoliciesAccepted}
                      >
                        {({ allChecked }) => (
                          <Button
                            disabled={!allChecked}
                            type="submit"
                            color="gold"
                            size="md"
                            mt="xl"
                            w="100%"
                            loading={mutation.isPending}
                          >
                            Создать профиль
                          </Button>
                        )}
                      </PolicyList>
                    )}
                  </div>
                </Box>
              </Stack>
            </form>
          </div>
        </Paper>
      </div>
    </AppWrapper>
  );
}

export const CreateProfile = ({ initialData }: CreateProfileProps) => {
  return (
    <QueryProvider>
      <CreateProfileContent initialData={initialData} />
    </QueryProvider>
  );
};
