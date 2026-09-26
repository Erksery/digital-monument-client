import styles from "./index.module.scss";
import type { ProfileId, UserId } from "../profile/types";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import type { UserType } from "./user.types";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";

import { Text } from "@mantine/core";
import { usePremiumAccess } from "../profile/forms/create/hooks/usePremiumAccess";
import { Avatar } from "./Avatar";

const UserMainInfoContent = ({ userId }: UserId) => {
  const { data: premiumAccess } = usePremiumAccess();

  const { data: user } = useQuery<UserType>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await refreshFetch("/api/users/me");

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      return res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div>
      <div className={styles.person}>
        <Avatar name={user?.login} size="l" />
        <div className={styles.user_info}>
          <div>
            <h1>{user?.login}</h1>
            <p className={styles.email}>{user?.email}</p>
          </div>

          <div className={styles.priced}>
            <Text>{premiumAccess?.count ?? 0} pr</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserMainInfo = ({ userId }: UserId) => {
  return (
    <QueryProvider>
      <AppWrapper>
        <UserMainInfoContent userId={userId} />
      </AppWrapper>
    </QueryProvider>
  );
};
