import styles from "./index.module.scss";
import { refreshFetch } from "@/api/refreshFetch";
import type { UserType } from "@/features/user/user.types";
import { useQuery } from "@tanstack/react-query";
import { QueryProvider } from "../providers/QueryProvider";
import { Menu } from "./Menu";
import { User } from "lucide-react";

interface Props {
  reverse?: boolean;
}

const UserInfoContent = ({ reverse }: Props) => {
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
  });

  return (
    <div className={styles.user} data-reverse={reverse}>
      <div className={styles.info}>
        <label>{user?.login}</label>
        <p>{user?.email}</p>
      </div>
      {reverse ? (
        <div className={styles.trigger}>
          <User size={20} />
        </div>
      ) : (
        <Menu variant="user" />
      )}
    </div>
  );
};

export const UserInfo = ({ reverse }: Props) => {
  return (
    <QueryProvider>
      <UserInfoContent reverse={reverse} />
    </QueryProvider>
  );
};
