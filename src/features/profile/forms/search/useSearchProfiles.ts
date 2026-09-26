import { refreshFetch } from "@/api/refreshFetch";
import type { ProfileResponse } from "../../types";

export interface ProfileFilters {
  fullName?: string;
  birthDate?: string;
  deathDate?: string;
  userId?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export const useSearchProfiles = () => {
  const fetchProfiles = async ({
    pageParam = 1,
    filters,
  }: {
    pageParam: number;
    filters: ProfileFilters;
  }): Promise<ProfileResponse[]> => {
    const limit = 10;
    const searchParams = new URLSearchParams();

    searchParams.append("page", pageParam.toString());
    searchParams.append("limit", limit.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const response = await refreshFetch(
      `/api/profiles?${searchParams.toString()}`,
    );
    if (!response.ok) {
      throw new Error("Ошибка при загрузке профилей");
    }
    return response.json();
  };

  return {
    fetchProfiles,
  };
};
