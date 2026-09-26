import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import styles from "./index.module.scss";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { User, Lock, UserRoundPlus } from "lucide-react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Notifications } from "@mantine/notifications";
import { useRegister } from "./useRegister";

const RegisterFormContent = () => {
  const { form, handleSubmit, isPending } = useRegister();
  return (
    <div className={styles.auth_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_header}>
          <div className={styles.icon_container}>
            <UserRoundPlus size={26} />
          </div>
          <h2 className={styles.title}>
            <span className={styles.gold}>регистрация</span> Личного кабинета
          </h2>

          <p className={styles.subtitle}>
            Введите свои данные, чтобы продолжить работу в системе
          </p>
        </div>

        <AppWrapper>
          <Notifications position="top-right" zIndex={1000} />
          <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
            <TextInput
              label="Имя"
              placeholder="Иван Иванов"
              size="md"
              required
              leftSection={<User size={16} />}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              {...form.getInputProps("login")}
            />
            <TextInput
              label="Логин или email"
              placeholder="your@email.com"
              size="md"
              required
              leftSection={<User size={20} />}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Пароль"
              placeholder="Минимум 6 символов"
              required
              size="md"
              leftSection={<Lock size={20} />}
              classNames={{
                input: styles.input,
                label: styles.label,
                innerInput: styles.password_input,
                section: styles.section,
              }}
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label="Пароль"
              placeholder="Повторите ваш пароль"
              required
              size="md"
              leftSection={<Lock size={20} />}
              classNames={{
                input: styles.input,
                label: styles.label,
                innerInput: styles.password_input,
                section: styles.section,
              }}
              {...form.getInputProps("confirmPassword")}
            />

            <Button
              type="submit"
              size="lg"
              color="gold"
              fullWidth
              mt="md"
              classNames={{
                root: styles.submit_button,
                label: styles.submit_label,
              }}
              loading={isPending}
            >
              Регистрация
            </Button>

            <div className={styles.reg_container}>
              Уже есть личный кабинет?
              <a href="/login">
                <span className={styles.gold}>Авторизуйтесь</span>
              </a>
            </div>
          </form>
        </AppWrapper>
      </div>
    </div>
  );
};

export const RegisterForm = () => {
  return (
    <QueryProvider>
      <RegisterFormContent />
    </QueryProvider>
  );
};
