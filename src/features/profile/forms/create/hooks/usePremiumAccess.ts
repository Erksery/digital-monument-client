import { useQuery } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";

export interface PremiumAccessResponse {
  available: boolean;
  count: number;
}

export const usePremiumAccess = () => {
  return useQuery({
    queryKey: ["premium-access"],

    queryFn: async (): Promise<PremiumAccessResponse> => {
      const response = await refreshFetch(
        "/api/payments/cloudpayments/premium/access",
      );

      if (!response.ok) {
        throw new Error("Не удалось получить информацию о покупке");
      }

      return response.json();
    },

    staleTime: 60_000,
  });
};
