import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Anchor,
  Text,
  Stack,
} from "@mantine/core";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import styles from "./index.module.scss";
import { useMutation } from "@tanstack/react-query";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Notifications, notifications } from "@mantine/notifications";
import { AtSign, Lock, User } from "lucide-react";

function RegisterFormContent() {
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

  return (
    <AppWrapper>
      <Notifications position="top-right" zIndex={1000} />
      <Container size={620} className={styles.wrapper}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          className={styles.paper}
        >
          <Title ta="center" order={3} className={styles.title}>
            Регистрация личного кабинета
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
            <Stack gap="md">
              <TextInput
                label="Имя"
                placeholder="Иван Иванов"
                size="md"
                required
                {...form.getInputProps("login")}
                leftSection={<User size={16} />}
              />
              <TextInput
                label="Email"
                placeholder="your@email.com"
                size="md"
                required
                {...form.getInputProps("email")}
                leftSection={<AtSign size={16} />}
              />
              <PasswordInput
                label="Пароль"
                placeholder="Минимум 6 символов"
                required
                size="md"
                {...form.getInputProps("password")}
                leftSection={<Lock size={16} />}
              />
              <PasswordInput
                label="Подтвердите пароль"
                placeholder="Повторите ваш пароль"
                required
                size="md"
                {...form.getInputProps("confirmPassword")}
                leftSection={<Lock size={16} />}
              />

              <Button
                type="submit"
                size="md"
                fullWidth
                mt="md"
                loading={isPending}
              >
                Зарегистрироваться
              </Button>
            </Stack>
          </form>

          <Text ta="center" mt="xl" size="sm" c="dimmed">
            Уже есть аккаунт?{" "}
            <Anchor href="/login" fw={700} className={styles.link}>
              Войти
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </AppWrapper>
  );
}

export function RegisterForm() {
  return (
    <QueryProvider>
      <RegisterFormContent />
    </QueryProvider>
  );
}
