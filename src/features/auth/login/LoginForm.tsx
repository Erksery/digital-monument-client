import styles from "./index.module.scss";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { User, Lock, LogIn } from "lucide-react";
import { Notifications } from "@mantine/notifications";
import { useLogin } from "./useLogin";

const LoginFormContent = () => {
  const { form, handleSubmit, isPending } = useLogin();
  return (
    <div className={styles.auth_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_header}>
          <div className={styles.icon_container}>
            <LogIn size={26} />
          </div>
          <h2 className={styles.title}>
            <span className={styles.gold}>вход</span> в Личный кабинет
          </h2>

          <p className={styles.subtitle}>
            Введите свои данные, чтобы продолжить работу в системе
          </p>
        </div>

        <AppWrapper>
          <Notifications position="top-right" zIndex={1000} />
          <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
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
              {...form.getInputProps("identifier")}
            />

            <div>
              <PasswordInput
                label="Пароль"
                placeholder="Введите пароль"
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

              <div className={styles.forgot_container}>
                <a href="/forgot-password">
                  <p>Забыли пароль?</p>
                </a>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              color="gold"
              fullWidth
              mt="md"
              loading={isPending}
              classNames={{
                root: styles.submit_button,
                label: styles.submit_label,
                loader: styles.submit_loader,
              }}
            >
              Войти
            </Button>

            <div className={styles.reg_container}>
              Впервые у нас?
              <a href="/register">
                <span className={styles.gold}>Зарегистрируйтесь</span>
              </a>
            </div>
          </form>
        </AppWrapper>
      </div>
    </div>
  );
};

export const LoginForm = () => {
  return (
    <QueryProvider>
      <LoginFormContent />
    </QueryProvider>
  );
};
