import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { refreshFetch } from "@/api/refreshFetch";
import { notifications } from "@mantine/notifications";
import type { FeedbackType, VisibilityType } from "../types";

interface UserProfileCardProps {
  profileId: string;
}

const visibility: Record<VisibilityType, string> = {
  selected: "Выбранные пользователи",
  public: "Публичный",
  private: "Приватный",
};

export const useProfileCard = ({ profileId }: UserProfileCardProps) => {
  const queryClient = useQueryClient();
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const { data: feedback } = useQuery<FeedbackType[]>({
    queryKey: ["feedback", "pending", profileId],
    queryFn: async () => {
      const res = await refreshFetch(`/api/comments/${profileId}`);

      if (!res.ok) {
        throw new Error("Не удалось загрузить комментарии");
      }

      return res.json();
    },
    enabled: !!profileId,
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await refreshFetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isApproved: true,
        }),
      });
      if (!res.ok) throw new Error("Ошибка при одобрении комментария");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedback", "pending", profileId],
      });

      queryClient.invalidateQueries({
        queryKey: ["feedback", profileId],
      });

      queryClient.invalidateQueries({
        queryKey: ["profiles"],
      });

      notifications.show({
        title: "Одобрено",
        message: "Комментарий успешно опубликован",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Ошибка",
        message: error.message,
        color: "red",
      });
    },
  });

  const parseVisibility = (data: VisibilityType | undefined) => {
    return data ? visibility[data] : "Неизвестно";
  };

  return {
    commentsExpanded,
    setCommentsExpanded,
    approveMutation,
    feedback,
    parseVisibility,
  };
};
