import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./index.module.scss";

type FAQ = {
  q: string;
  a: string;
};

interface Props {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.faq_list}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.q}
            className={`${styles.faq_item} ${isOpen ? styles.is_open : ""}`}
          >
            <button
              className={styles.faq_button}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className={styles.faq_question}>{faq.q}</span>

              <ChevronDown size={18} className={styles.faq_icon} />
            </button>

            <div
              className={`${styles.faq_content} ${
                isOpen ? styles.content_open : ""
              }`}
            >
              <div className={styles.faq_inner}>
                <div className={styles.faq_divider} />
                <p className={styles.faq_answer}>{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
