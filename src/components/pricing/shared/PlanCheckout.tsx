import { useMemo, useState, type ReactNode } from "react";
import styles from "./index.module.scss";
import { CloudPaymentsProvider } from "@/components/providers/PaymentsProvider";
import { PaymentButton } from "./PaymentButton";
import { Check } from "lucide-react";

export interface Policy {
  id: string;
  parts: {
    text: string;
    href?: string;
  }[];
}

interface CheckoutProps {
  policies: Policy[];
}

export function PlanCheckout({ policies }: CheckoutProps) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const allChecked = useMemo(
    () => policies.every((policy) => checks[policy.id]),
    [checks],
  );

  const toggle = (id: string) =>
    setChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  return (
    <div className={styles.checkout}>
      <div className={styles.checkout_card}>
        <p className={styles.checkout_title}>Подтверждения</p>
        <div className={styles.policy_list}>
          {policies.map((policy) => (
            <div key={policy.id} className={styles.policy_item}>
              <input
                type="checkbox"
                id={`policy-${policy.id}`}
                checked={!!checks[policy.id]}
                onChange={() => toggle(policy.id)}
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
                    <a
                      key={i}
                      href={part.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {part.text}
                    </a>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>{" "}
      </div>

      <CloudPaymentsProvider>
        <PaymentButton allChecked={allChecked} />
      </CloudPaymentsProvider>
    </div>
  );
}
