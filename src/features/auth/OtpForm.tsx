import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { PinInput, Button } from "@mantine/core";
import { ShieldCheck } from "lucide-react";
import { Notifications, notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { QueryProvider } from "@/components/providers/QueryProvider";

interface OtpFormProps {
  userId: string;
  email?: string;
}

const OtpFormContent = ({ userId, email }: OtpFormProps) => {
  const [resendCooldown, setResendCooldown] = useState(60);

  const form = useForm({
    initialValues: {
      code: "",
    },

    validate: {
      code: (value) => (value.length !== 6 ? "Введите 6-значный код" : null),
    },
  });

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const verifyMutation = useMutation({
    mutationFn: async (otpData: typeof form.values) => {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code: otpData.code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.message || "Неверный код подтверждения");
      }

      return response.json();
    },

    onSuccess: (data) => {
      notifications.show({
        title: data?.message || "Код подтвержден!",
        message: "Верификация успешно завершена.",
        color: "green",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    },

    onError: (error) => {
      notifications.show({
        title: "Ошибка",
        message: error.message || "Неверный код подтверждения",
        color: "red",
      });

      form.setFieldError("code", error.message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.message || "Не удалось отправить новый код");
      }

      return response.json();
    },

    onSuccess: (data) => {
      setResendCooldown(60);
      form.setFieldValue("code", "");

      notifications.show({
        title: "Код отправлен",
        message: data?.message || "Новый код подтверждения отправлен",
        color: "green",
      });
    },

    onError: (error) => {
      notifications.show({
        title: "Ошибка",
        message: error.message || "Не удалось отправить новый код",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    verifyMutation.mutate(values);
  };

  const handleResend = () => {
    if (resendCooldown > 0 || resendMutation.isPending) {
      return;
    }

    resendMutation.mutate();
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_header}>
          <div className={styles.icon_container}>
            <ShieldCheck size={26} />
          </div>

          <h2 className={styles.title}>
            <span className={styles.gold}>подтверждение</span> аккаунта
          </h2>

          <p className={styles.subtitle}>
            Мы отправили код подтверждения
            {email && (
              <>
                {" "}
                на <strong>{email}</strong>
              </>
            )}
          </p>
        </div>

        <AppWrapper>
          <Notifications position="top-right" zIndex={1000} />

          <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
            <div className={styles.otp_container}>
              <PinInput
                length={6}
                size="lg"
                type="number"
                oneTimeCode
                placeholder=""
                autoFocus
                classNames={{
                  root: styles.otp,
                  input: styles.otp_input,
                }}
                {...form.getInputProps("code")}
              />

              {form.errors.code && (
                <div className={styles.error}>{form.errors.code}</div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              color="gold"
              fullWidth
              mt="md"
              loading={verifyMutation.isPending}
              leftSection={<ShieldCheck size={20} color="black" />}
              classNames={{
                root: styles.submit_button,
                label: styles.submit_label,
                loader: styles.submit_loader,
              }}
            >
              Подтвердить
            </Button>
          </form>

          <div className={styles.resend_container}>
            <span>Не получили код?</span>

            {resendCooldown > 0 ? (
              <span className={styles.resend_timer}>
                Отправить повторно через {resendCooldown} сек.
              </span>
            ) : (
              <button
                type="button"
                className={styles.resend_button}
                onClick={handleResend}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending
                  ? "Отправка..."
                  : "Отправить повторно"}
              </button>
            )}
          </div>

          <div className={styles.login_container}>
            <a onClick={() => window.history.back()}>
              Вернуться к <span className={styles.gold}>регистрации</span>
            </a>
          </div>
        </AppWrapper>
      </div>
    </div>
  );
};

export const OtpForm = ({ userId, email }: OtpFormProps) => {
  return (
    <QueryProvider>
      <OtpFormContent userId={userId} email={email} />
    </QueryProvider>
  );
};
