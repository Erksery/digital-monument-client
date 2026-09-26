import { useQuery } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import type { UserType } from "@/features/user/user.types";

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["users-search", query],

    enabled: query.trim().length > 0,

    queryFn: async (): Promise<UserType[]> => {
      const response = await refreshFetch(
        `/api/users/search?query=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error("Не удалось получить пользователей");
      }

      return response.json();
    },

    staleTime: 60_000,
  });
};
