import { refreshFetch } from "@/api/refreshFetch";
import { QueryProvider } from "@/components/providers/QueryProvider";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { useQuery } from "@tanstack/react-query";
import type { FeedbackType } from "../profile/types";
import { Block } from "@/components/ui/block/Block";
import { FeedbackList } from "./FeedbackList";

const MyFeedbackListContent = () => {
  const { data: feedback } = useQuery<FeedbackType[]>({
    queryKey: ["feedback", "my"],
    queryFn: async () => {
      const res = await refreshFetch(`/api/comments/my`);
      return res.json();
    },

    retry: false,
  });
  return (
    <Block title="Ваши комментарии" style={{ marginTop: 40 }}>
      <FeedbackList feedback={feedback} edit />
    </Block>
  );
};

export const MyFeedbackList = () => {
  return (
    <QueryProvider>
      <AppWrapper>
        <MyFeedbackListContent />
      </AppWrapper>
    </QueryProvider>
  );
};
