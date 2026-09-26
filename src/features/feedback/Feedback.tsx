import styles from "./index.module.scss";
import { Block } from "@/components/ui/block/Block";

import { QueryProvider } from "@/components/providers/QueryProvider";
import type { FeedbackType, ProfileId } from "../profile/types";
import { useQuery } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { useDisclosure } from "@mantine/hooks";
import { CreateFeedback } from "./CreateFeedback";
import { FeedbackList } from "./FeedbackList";

const FeedbackContent = ({ profileId }: ProfileId) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: feedback } = useQuery<FeedbackType[]>({
    queryKey: ["feedback", profileId],
    queryFn: async () => {
      const res = await fetch(`/api/comments?profileId=${profileId}`);
      return res.json();
    },
    enabled: !!profileId,
    retry: false,
  });

  return (
    <>
      <Block title="Слова близких и друзей" style={{ marginTop: 70 }}>
        <FeedbackList feedback={feedback} openCreateModal={open} />
      </Block>

      <CreateFeedback profileId={profileId} opened={opened} onClose={close} />
    </>
  );
};

export const Feedback = ({ profileId }: ProfileId) => {
  return (
    <QueryProvider>
      <AppWrapper>
        <FeedbackContent profileId={profileId} />
      </AppWrapper>
    </QueryProvider>
  );
};
