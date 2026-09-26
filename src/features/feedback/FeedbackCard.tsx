import styles from "./index.module.scss";
import { Appear } from "@/components/ui/appear/Appear";
import { parseDateData } from "@/utils/formatDate";
import type { FeedbackType } from "../profile/types";
import { ActionIcon, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import { Notifications, notifications } from "@mantine/notifications";

interface FeedbackCardProps {
  feedback: FeedbackType;
  edit?: boolean;
}

interface DeleteTarget {
  id: string;
}

export const FeedbackCard = ({ feedback, edit = false }: FeedbackCardProps) => {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await refreshFetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Ошибка при удалении комментария");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "my"] });
      setDeleteTarget(null);
      notifications.show({
        title: data?.message || "Успешно",
        message: "Профиль успешно удален!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Ошибка",
        message: error.message || "Произошла неизвестная ошибка",
        color: "red",
      });
    },
  });

  const handleDeleteRequest = () => {
    setDeleteTarget({ id: feedback.id });
  };

  const authorName = feedback.customName ?? feedback.user?.login ?? "Аноним";
  const avatarLetter = authorName.trim().charAt(0).toUpperCase();

  return (
    <>
      <Modal
        opened={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Подтверждение удаления"
        centered
        overlayProps={{ blur: 3 }}
      >
        <Stack gap="md">
          <Text size="sm">
            Вы уверены, что хотите удалить комментарий? Это действие необратимо.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setDeleteTarget(null)}>
              Отмена
            </Button>
            <Button
              color="red"
              onClick={() => deleteTarget && mutation.mutate(deleteTarget.id)}
              loading={mutation.isPending}
            >
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Appear key={feedback.id}>
        <div className={styles.feedback_item}>
          <div className={styles.header}>
            <div className={styles.person}>
              <div className={styles.avatar}>{avatarLetter}</div>

              <div>
                <h3>{authorName}</h3>
                <p>{feedback.authorRole.toUpperCase()}</p>
              </div>
            </div>

            <p className={styles.date}>
              {parseDateData(feedback.createdAt).dayMonth},{" "}
              {parseDateData(feedback.createdAt).year}
            </p>
          </div>

          <p className={styles.text}>{feedback.text}</p>

          {edit && (
            <Group gap={4} wrap="nowrap">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteRequest();
                }}
                variant="outline"
                color="red"
                title="Удалить"
                size="md"
                leftSection={<Pencil size={16} />}
              >
                Удалить
              </Button>
            </Group>
          )}
        </div>
      </Appear>
    </>
  );
};
