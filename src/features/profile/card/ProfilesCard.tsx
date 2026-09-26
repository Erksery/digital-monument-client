import styles from "./index.module.scss";
import { Pencil, Trash2, MessageSquare, Check } from "lucide-react";
import {
  ActionIcon,
  Avatar,
  Button,
  Collapse,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { parseDateData } from "@/utils/formatDate";
import { useProfileCard } from "./useProfileCard";
import type { ProfileResponse } from "../types";

export const ProfileCard = ({
  profile,
  onDeleteRequest,
}: {
  profile: ProfileResponse;
  onDeleteRequest: (id: string, name: string) => void;
}) => {
  const {
    approveMutation,
    commentsExpanded,
    setCommentsExpanded,
    feedback,
    parseVisibility,
  } = useProfileCard({ profileId: profile.id });

  return (
    <div className={styles.profile_card}>
      <Stack gap="md">
        <Group wrap="nowrap" align="flex-start" justify="space-between">
          <Group wrap="nowrap" align="flex-start">
            <Avatar
              src={profile.avatar}
              alt={profile.fullName}
              size={64}
              radius="xl"
              color="blue"
            >
              {profile.fullName.charAt(0)}
            </Avatar>

            <Stack gap={2}>
              <a
                href={`/profile/${profile.id}`}
                className={styles.profile_link}
              >
                <Text
                  fw={600}
                  size="lg"
                  lh={1.2}
                  className={styles.profile_name}
                >
                  {profile.fullName}
                </Text>
              </a>

              <Text size="sm" className={styles.profile_dates}>
                {parseDateData(profile.birthDate).year} —{" "}
                {parseDateData(profile.deathDate).year}
              </Text>
            </Stack>
          </Group>

          <Group gap={4} wrap="nowrap">
            <a href={`/profile/update/${profile.id}`}>
              <ActionIcon
                variant="subtle"
                color="gold"
                title="Редактировать"
                size="lg"
              >
                <Pencil size={16} />
              </ActionIcon>
            </a>

            <ActionIcon
              variant="subtle"
              color="red"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteRequest(profile.id, profile.fullName);
              }}
              title="Удалить"
              size="lg"
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <div className={styles.divider} />

        <Stack gap={4}>
          <div className={styles.info}>
            <Text span fw={500} className={styles.meta_label}>
              Видимость профиля:
            </Text>
            <Text size="sm" className={styles.meta_text}>
              {parseVisibility(profile.visibilitySettings?.visibility)}
            </Text>
          </div>
          {profile.visibilitySettings?.visibility === "selected" && (
            <div className={styles.info}>
              <Text span fw={500} className={styles.meta_label}>
                Выбранные пользователи:
              </Text>
              <div className={styles.visibility_list}>
                {profile.visibilitySettings?.allowedUsers?.map((user) => (
                  <div key={user.userId} className={styles.visibility_card}>
                    <Text size="sm" className={styles.meta_text}>
                      {user.login}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={styles.info}>
            <Text span fw={500} className={styles.meta_label}>
              Редакторы:
            </Text>
            <div className={styles.visibility_list}>
              <div className={styles.visibility_card}>
                <Text size="sm" className={styles.meta_text}>
                  Вы
                </Text>
              </div>
              {profile.editors?.map((user) => (
                <div key={user.userId} className={styles.visibility_card}>
                  <Text size="sm" className={styles.meta_text}>
                    {user.login}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {profile.birthPlace && (
            <div className={styles.info}>
              <Text span fw={500} className={styles.meta_label}>
                Дата создания:
              </Text>

              <Text size="sm" className={styles.meta_text}>
                {parseDateData(profile.createdAt).dayMonth},{" "}
                {parseDateData(profile.createdAt).year}
              </Text>
            </div>
          )}
          {profile.deathPlace && (
            <div className={styles.info}>
              <Text span fw={500} className={styles.meta_label}>
                Обновлено:
              </Text>
              <Text size="sm" className={styles.meta_text}>
                {parseDateData(profile.updatedAt).dayMonth},{" "}
                {parseDateData(profile.createdAt).year}
              </Text>
            </div>
          )}
        </Stack>

        <div className={styles.comments_toggle_wrapper}>
          <Button
            variant="light"
            color="gray"
            fullWidth
            onClick={() => setCommentsExpanded(!commentsExpanded)}
            rightSection={<MessageSquare size={16} />}
            className={styles.comments_button}
          >
            Неодобренные комментарии ({feedback?.length || 0})
          </Button>
        </div>

        <Collapse expanded={commentsExpanded}>
          <div
            style={{
              paddingTop: "1rem",
              overflow: "hidden",
            }}
          >
            <div className={styles.comments_container}>
              {feedback && feedback.length > 0 ? (
                feedback.map((comment) => (
                  <div
                    key={comment.id}
                    className={`${styles.comment_item} ${
                      !comment.isApproved ? styles.pending : ""
                    }`}
                  >
                    <div className={styles.comment_header}>
                      <div>
                        <span className={styles.comment_author}>
                          {comment.customName
                            ? comment.customName
                            : comment.user.login}
                        </span>
                        <span className={styles.comment_date}>
                          {parseDateData(comment.createdAt).dayMonth}
                        </span>
                      </div>
                      {!comment.isApproved && (
                        <Button
                          size="xs"
                          variant="filled"
                          color="green"
                          leftSection={<Check size={14} />}
                          onClick={() => approveMutation.mutate(comment.id)}
                          loading={
                            approveMutation.isPending &&
                            approveMutation.variables === comment.id
                          }
                        >
                          Одобрить
                        </Button>
                      )}
                    </div>
                    <div className={styles.comment_text}>{comment.text}</div>
                  </div>
                ))
              ) : (
                <Text
                  size="sm"
                  ta="center"
                  className={styles.meta_text}
                  mt="sm"
                >
                  Нет комментариев
                </Text>
              )}
            </div>
          </div>
        </Collapse>
      </Stack>
    </div>
  );
};
