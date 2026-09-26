import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

export const useLogin = () => {
  const form = useForm({
    initialValues: {
      identifier: "",
      password: "",
    },
    validate: {
      identifier: (value) => {
        if (!value) return "Поле обязательно для заполнения";
        if (value.includes("@")) {
          return /^\S+@\S+$/.test(value) ? null : "Некорректный email";
        }
        return value.length < 3
          ? "Логин должен быть не менее 3 символов"
          : null;
      },
      password: (value) =>
        value.length < 6 ? "Пароль должен быть не менее 6 символов" : null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (loginData: typeof form.values) => {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка при авторизации");
      }
      return response.json();
    },
    onSuccess: (data) => {
      notifications.show({
        title: data?.message || "Успешная авторизация!",
        message: "С возвращением!🌟",
        color: "green",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error) => {
      notifications.show({
        title: "Ошибка",
        message: error.message || "Неверный логин или пароль",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutate(values);
  };

  return {
    handleSubmit,
    form,
    isPending,
  };
};
