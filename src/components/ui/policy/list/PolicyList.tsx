import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import styles from "./index.module.scss";
import type { Policy } from "@/types";

interface PolicyListProps {
  policies: Policy[];
  children?: (state: { allChecked: boolean }) => ReactNode;
  onAllCheckedChange?: (checked: boolean) => void;
}

export function PolicyList({
  policies,
  onAllCheckedChange,
  children,
}: PolicyListProps) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const allChecked = useMemo(
    () => policies.every((policy) => checks[policy.id]),
    [policies, checks],
  );

  const onToggle = (id: string) => {
    setChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    onAllCheckedChange?.(allChecked);
  }, [allChecked, onAllCheckedChange]);

  return (
    <>
      <div className={styles.policy_list}>
        {policies.map((policy) => (
          <div key={policy.id} className={styles.policy_item}>
            <input
              id={`policy-${policy.id}`}
              type="checkbox"
              checked={!!checks[policy.id]}
              onChange={() => onToggle(policy.id)}
              className={styles.hidden_checkbox}
            />

            <label
              htmlFor={`policy-${policy.id}`}
              className={`${styles.checkbox} ${
                checks[policy.id] ? styles.checkbox_checked : ""
              }`}
            >
              {checks[policy.id] && <Check size={14} color="black" />}
            </label>

            <div className={styles.policy_label}>
              {policy.parts.map((part, i) =>
                part.href ? (
                  <a key={i} href={part.href} target="_blank" rel="noreferrer">
                    {part.text}
                  </a>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      {children?.({ allChecked })}
    </>
  );
}
