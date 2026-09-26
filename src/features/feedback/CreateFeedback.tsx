import { refreshFetch } from "@/api/refreshFetch";
import { Modal, Stack, Textarea, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateFeedbackModalProps {
  profileId: string | undefined;
  opened: boolean;
  onClose: () => void;
}

interface FormValues {
  text: string;
  authorRole: string;
  customName: string;
}

export const CreateFeedback = ({
  profileId,
  opened,
  onClose,
}: CreateFeedbackModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    initialValues: {
      text: "",
      authorRole: "",
      customName: "",
    },
    validate: {
      text: (value) =>
        value.trim().length < 5
          ? "Комментарий должен быть не менее 5 символов"
          : null,
      authorRole: (value) =>
        !value.trim()
          ? "Укажите, кем вы приходитесь (например: Друг, Коллега)"
          : null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        text: values.text,
        authorRole: values.authorRole,
        customName: values.customName.trim() || undefined,
        profileId,
      };

      const res = await refreshFetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Не удалось отправить комментарий");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", profileId] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Оставить слово памяти"
      centered
    >
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <Stack gap="md">
          <Textarea
            withAsterisk
            label="Ваши воспоминания"
            placeholder="Напишите слова поддержки или историю из жизни..."
            minRows={4}
            maxRows={8}
            autosize
            {...form.getInputProps("text")}
            disabled={mutation.isPending}
          />

          <TextInput
            withAsterisk
            label="Кем вы приходитесь"
            placeholder="Например: Друг, Брат, Коллега"
            {...form.getInputProps("authorRole")}
            disabled={mutation.isPending}
          />

          <TextInput
            label="Отображаемое имя"
            placeholder="Оставьте пустым, чтобы использовать имя аккаунта"
            {...form.getInputProps("customName")}
            disabled={mutation.isPending}
          />

          <Stack
            gap="xs"
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <Button
              variant="subtle"
              color="gray"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Отмена
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Отправить
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
};
