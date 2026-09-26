import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  CircleQuestionMark,
  Contact,
  Home,
  Info,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu as MenuIcon,
  Plus,
  User,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

import styles from "./index.module.scss";
import type { HeaderLink } from "@/types";
import { UserInfo } from "./UserInfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import { QueryProvider } from "../providers/QueryProvider";
import type { UserType } from "@/features/user/user.types";

interface Props {
  links?: HeaderLink[];
  variant?: "navigation" | "user";
}

const icons: Record<string, LucideIcon> = {
  pricing: LayoutGrid,
  features: Info,
  faq: CircleQuestionMark,
  contacts: Contact,
};

const MenuContent = ({ links = [], variant = "navigation" }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const queryClient = useQueryClient();

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

  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      await refreshFetch("/api/auth/logout", {
        method: "POST",
      });
    },

    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      window.location.href = "/";
    },
  });

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (menuRef.current?.contains(target)) {
        return;
      }

      if (triggerRef.current?.contains(target)) {
        return;
      }

      closeMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    const updateScrollLock = () => {
      const isMobile = window.innerWidth <= 800;

      if (isMobile) {
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
      } else {
        html.style.overflow = previousHtmlOverflow;
        body.style.overflow = previousBodyOverflow;
      }
    };

    updateScrollLock();

    window.addEventListener("resize", updateScrollLock);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;

      window.removeEventListener("resize", updateScrollLock);
    };
  }, [isOpen]);

  const userContent = (
    <>
      {user ? (
        <>
          <a
            href={`/account/${user.id}`}
            onClick={closeMenu}
            className={clsx(styles.link, styles.chevron)}
          >
            <span className={styles.icon}>
              <User size={16} />
              Личный кабинет
            </span>

            <ChevronRight size={16} color="gray" />
          </a>

          <a
            href="/profile/create"
            onClick={closeMenu}
            className={clsx(styles.link, styles.chevron)}
          >
            <span className={styles.icon}>
              <Plus size={16} />
              Создать профиль памяти
            </span>

            <ChevronRight size={16} />
          </a>

          <hr className={styles.line} />

          <button
            type="button"
            onClick={() => handleLogout()}
            className={clsx(styles.link, styles.logout)}
          >
            <LogOut size={16} />
            Выход из аккаунта
          </button>
        </>
      ) : (
        <>
          <a href="/register" onClick={closeMenu} className={styles.link}>
            <UserRoundPlus size={16} />
            Регистрация
          </a>

          <a href="/login" onClick={closeMenu} className={styles.link}>
            <LogIn size={16} />
            Вход
          </a>
        </>
      )}
    </>
  );

  const navigationContent = (
    <>
      {user && (
        <>
          <div className={styles.account}>
            <UserInfo reverse />

            <button
              type="button"
              onClick={() => handleLogout()}
              className={styles.logout_button}
            >
              <LogOut size={14} />
              Выход
            </button>
          </div>

          <a
            href={`/account/${user.id}`}
            onClick={closeMenu}
            className={clsx(styles.link, styles.chevron)}
          >
            <span className={styles.icon}>
              <User size={16} />
              Личный кабинет
            </span>

            <ChevronRight size={16} />
          </a>

          <a
            href="/profile/create"
            onClick={closeMenu}
            className={clsx(styles.link, styles.chevron)}
          >
            <span className={styles.icon}>
              <Plus size={16} />
              Создать профиль памяти
            </span>

            <ChevronRight size={16} />
          </a>

          <hr className={styles.line} />
        </>
      )}

      {!user && (
        <>
          <div className={styles.auth_buttons}>
            <a href="/register" onClick={closeMenu}>
              <UserRoundPlus size={16} />
              Регистрация
            </a>

            <a href="/login" onClick={closeMenu}>
              <LogIn size={16} />
              Вход
            </a>
          </div>

          <hr className={styles.line} />
        </>
      )}

      <div className={styles.links_list}>
        <a href="/" onClick={closeMenu} className={styles.link}>
          <Home size={16} />
          Главная
        </a>

        {links.map((link) => {
          const Icon = icons[link.section];

          return (
            <a
              key={link.section}
              href={link.path || `/#${link.section}`}
              onClick={closeMenu}
              data-section={link.section}
              className={styles.link}
            >
              <Icon size={16} />
              {link.label}
            </a>
          );
        })}
      </div>
    </>
  );

  const content = variant === "user" ? userContent : navigationContent;

  return (
    <div
      ref={menuRef}
      className={clsx(
        styles.menu,
        variant === "navigation" && styles.navigation_menu,
        variant === "user" && styles.user_menu,
      )}
    >
      {variant === "navigation" && (
        <a href="/" className={styles.logo}>
          <h3>Memory Code</h3>
        </a>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={
          variant === "user" ? "Открыть меню пользователя" : "Открыть меню"
        }
      >
        {variant === "user" ? <User size={20} /> : <MenuIcon size={20} />}
      </button>

      <div
        className={clsx(
          styles.dropdown,
          variant === "user" && styles.user_dropdown,
          isOpen && styles.dropdown_open,
        )}
      >
        {content}
      </div>
    </div>
  );
};

export const Menu = ({ links, variant = "navigation" }: Props) => {
  return (
    <QueryProvider>
      <MenuContent links={links} variant={variant} />
    </QueryProvider>
  );
};
