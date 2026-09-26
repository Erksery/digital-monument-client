import styles from "./index.module.scss";
import { ActionIcon, Button, Menu } from "@mantine/core";
import {
  ChevronRight,
  LogIn,
  LogOut,
  User,
  UserPlus,
  UserRoundPlus,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import type { UserType } from "@/features/user/user.types";

interface UserMenuProps {
  user: UserType | undefined;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const queryClient = useQueryClient();

  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      await refreshFetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      window.location.href = "/";
    },
  });
  return (
    <Menu
      width={230}
      position="bottom-end"
      styles={{
        item: {
          fontSize: "15px",
        },
      }}
    >
      <Menu.Target>
        <ActionIcon variant="default" size="xl" style={{ zIndex: 1 }}>
          <User />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {user ? (
          <>
            <a href={`/account/${user.id}`}>
              <Menu.Item
                leftSection={<User size={16} />}
                rightSection={<ChevronRight size={16} color="gray" />}
              >
                Личный кабинет
              </Menu.Item>
            </a>
            <a href={"/profile/create"}>
              <Menu.Item
                leftSection={<UserPlus size={16} />}
                rightSection={<ChevronRight size={16} color="gray" />}
              >
                Создать профиль
              </Menu.Item>
            </a>

            <Menu.Divider />
            <Menu.Item
              onClick={() => handleLogout()}
              color="red"
              leftSection={<LogOut size={16} />}
            >
              Выход из аккаунта
            </Menu.Item>
          </>
        ) : (
          <>
            <a href={"/register"}>
              <Menu.Item leftSection={<LogIn size={16} />} component={Button}>
                Регистрация
              </Menu.Item>
            </a>
            <Menu.Divider />
            <a href={"/login"}>
              <Menu.Item leftSection={<UserRoundPlus size={16} />}>
                Вход
              </Menu.Item>
            </a>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
