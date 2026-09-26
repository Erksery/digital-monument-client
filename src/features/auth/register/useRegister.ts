import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  const form = useForm({
    initialValues: {
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      login: (value) => (value.length < 2 ? "Имя слишком короткое" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Некорректный email"),
      password: (value) =>
        value.length < 6 ? "Пароль должен быть не менее 6 символов" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Пароли не совпадают" : null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      registerData: Omit<typeof form.values, "confirmPassword">,
    ) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка при регистрации");
      }
      return response.json();
    },
    onSuccess: (data) => {
      notifications.show({
        title: data?.message || "Успешная регистрация!",
        message: "На вашу почту отправлен код подтверждения.",
        color: "green",
      });

      setTimeout(() => {
        window.location.href = `/otp?userId=${encodeURIComponent(data.userId)}`;
      }, 1000);
    },
    onError: (error) => {
      const errMsg = error.message.toLowerCase();

      if (errMsg.includes("email")) {
        form.setFieldError("email", "Этот email уже занят");
      } else if (
        errMsg.includes("логин") ||
        errMsg.includes("username") ||
        errMsg.includes("именем")
      ) {
        form.setFieldError("login", "Этот логин уже занят");
      } else {
        form.setFieldError(
          "login",
          error.message || "Сервер недоступен. Попробуйте позже.",
        );
      }
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const { confirmPassword, ...registerData } = values;
    mutate(registerData);
  };

  return {
    form,
    handleSubmit,
    isPending,
  };
};
