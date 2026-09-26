import styles from "./index.module.scss";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import type { ProfileResponse } from "../types";
import { SimpleGrid, Text, Group, Stack, Modal, Button } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { QueryProvider } from "@/components/providers/QueryProvider";

import { ProfilesSkeleton } from "./ProfilesListSkeleton";
import { ProfileCard } from "../card/ProfilesCard";
import { Block } from "@/components/ui/block/Block";
import { UserX } from "lucide-react";

export interface ProfileComment {
  id: string;
  text: string;
  authorName: string;
  isApproved: boolean;
  createdAt: string;
}

interface ProfileListProps {
  userId: string | undefined;
}

interface DeleteTarget {
  id: string;
  fullName: string;
}

const ProfilesListContent = ({ userId }: ProfileListProps) => {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const { data, isLoading } = useQuery<ProfileResponse[]>({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      const res = await refreshFetch(`/api/profiles?userId=${userId}`);
      return res.json();
    },
    retry: false,
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await refreshFetch(`/api/profiles/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Ошибка при удалении профиля");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["premium-access"],
      });

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

  const handleDeleteRequest = (id: string, fullName: string) => {
    setDeleteTarget({ id, fullName });
  };

  if (isLoading) return <ProfilesSkeleton />;

  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <UserX size={72} />
        <Text ta="center" mt="xl">
          Вы еще не создавали профили
        </Text>
        <a href="/profile/create">
          <Button>Создать профиль</Button>
        </a>
      </div>
    );
  }

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
            Вы уверены, что хотите удалить профиль{" "}
            <strong>{deleteTarget?.fullName}</strong>? Это действие необратимо.
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

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="xl">
        {data.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onDeleteRequest={handleDeleteRequest}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export const ProfilesList = ({ userId }: ProfileListProps) => {
  return (
    <QueryProvider>
      <AppWrapper>
        <Notifications position="top-right" zIndex={1000} />
        <Block title="Созданные профили" style={{ marginTop: 40 }}>
          <ProfilesListContent userId={userId} />
        </Block>
      </AppWrapper>
    </QueryProvider>
  );
};
