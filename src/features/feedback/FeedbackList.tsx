import styles from "./index.module.scss";
import { MessageCirclePlus } from "lucide-react";
import { Button, Text } from "@mantine/core";
import { FeedbackCard } from "./FeedbackCard";
import type { FeedbackType } from "../profile/types";

interface FeedbackListProps {
  feedback: FeedbackType[] | undefined;
  edit?: boolean;
  openCreateModal?: () => void;
}

export const FeedbackList = ({
  feedback,
  edit = false,
  openCreateModal,
}: FeedbackListProps) => {
  if (!feedback || !Array.isArray(feedback) || feedback.length === 0) {
    return (
      <div className={styles.container}>
        <MessageCirclePlus size={72} />
        <p className={styles.sub_text}>
          {!edit
            ? "Никто еще не оставил свою память. Станьте первым!"
            : "Вы еще не оставляли комментарии"}
        </p>

        {!edit && (
          <Button
            onClick={openCreateModal}
            size="md"
            fullWidth={false}
            classNames={{
              root: styles.button_root,
            }}
          >
            Написать слова памяти
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.feedback}>
      <div className={styles.feedback_container}>
        {feedback &&
          feedback.map((item) => <FeedbackCard feedback={item} edit={edit} />)}
      </div>

      {!edit && (
        <Button
          onClick={openCreateModal}
          size="md"
          classNames={{
            root: styles.button_root,
          }}
        >
          Написать слова памяти
        </Button>
      )}
    </div>
  );
};
