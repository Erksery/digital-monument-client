import styles from "./index.module.scss";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Group,
  Anchor,
  Text,
} from "@mantine/core";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { Notifications, notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { User, Lock } from "lucide-react";

function LoginFormContent() {
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
    console.log("Login attempt:", values);
    mutate(values);
  };

  return (
    <AppWrapper>
      <Notifications position="top-right" zIndex={1000} />
      <Container size={620} my={40} className={styles.wrapper}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          className={styles.paper}
        >
          <h2 className={styles.title}>Вход в личный кабинет</h2>

          <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
            <TextInput
              label="Логин или email"
              placeholder="your@email.com"
              size="md"
              required
              {...form.getInputProps("identifier")}
              leftSection={<User size={16} />}
            />

            <div>
              <PasswordInput
                label="Пароль"
                placeholder="Ваш пароль"
                required
                mt="md"
                size="md"
                {...form.getInputProps("password")}
                leftSection={<Lock size={16} />}
              />
              <Group justify="flex-end" mt={7}>
                <Anchor
                  href="/forgot-password"
                  size="sm"
                  className={styles.link}
                >
                  Забыли пароль?
                </Anchor>
              </Group>
            </div>

            <Button
              type="submit"
              size="md"
              color="gold"
              fullWidth
              mt="lg"
              loading={isPending}
            >
              Войти
            </Button>
          </form>

          <Text ta="center" mt="xl" size="sm" c="dimmed">
            Впервые у нас?{" "}
            <Anchor href="/register" fw={700} className={styles.link}>
              Создать аккаунт
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </AppWrapper>
  );
}

export function LoginForm() {
  return (
    <QueryProvider>
      <LoginFormContent />
    </QueryProvider>
  );
}
