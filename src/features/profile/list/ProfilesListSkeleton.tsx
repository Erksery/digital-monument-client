import { SimpleGrid, Stack, Skeleton, Group } from "@mantine/core";
// Импортируем стили, чтобы скелет имел те же отступы и размеры, что и реальная карточка
import styles from "./index.module.scss";

export const ProfilesSkeleton = () => {
  return (
    // Приводим брейкпоинты в соответствие с основным списком (lg вместо md)
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="lg" mt="xl">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={styles.profile_card}>
            <Stack gap="md">
              <Group wrap="nowrap" align="flex-start" justify="space-between">
                <Group wrap="nowrap" align="flex-start">
                  {/* Аватар */}
                  <Skeleton height={64} width={64} radius="xl" />

                  {/* Имя и даты жизни */}
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Skeleton height={20} width="80%" radius="sm" mt={4} />
                    <Skeleton height={14} width="45%" radius="sm" mt={4} />
                  </Stack>
                </Group>

                {/* Иконки редактирования и удаления */}
                <Group gap={4} wrap="nowrap">
                  <Skeleton height={34} width={34} radius="sm" />
                  <Skeleton height={34} width={34} radius="sm" />
                </Group>
              </Group>

              {/* Разделитель */}
              <div className={styles.divider} style={{ height: "1px" }} />

              {/* Мета-данные (Дата создания / Обновлено) */}
              <Stack gap={4}>
                <Skeleton height={14} width="60%" radius="sm" />
                <Skeleton height={14} width="55%" radius="sm" />
              </Stack>

              {/* 👇 Кнопка "Комментарии" */}
              <div className={styles.comments_toggle_wrapper}>
                <Skeleton height={36} width="100%" radius="sm" />
              </div>
            </Stack>
          </div>
        ))}
    </SimpleGrid>
  );
};
