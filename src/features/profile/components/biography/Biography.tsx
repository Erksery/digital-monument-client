import styles from "./index.module.scss";
import "@mdxeditor/editor/style.css";

import { useState } from "react";
import { Block } from "@/components/ui/block/Block";
import { Button } from "@mantine/core";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import type { ProfileId, ProfileResponse } from "../../types";
import { refreshFetch } from "@/api/refreshFetch";
import { useQuery } from "@tanstack/react-query";

import Editor from "./Editor";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { getAboutInfo } from "./aboutInfo";
import { Quote } from "lucide-react";
import { Appear } from "@/components/ui/appear/Appear";

const BiographyContent = ({ profileId }: ProfileId) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: profile } = useQuery<ProfileResponse>({
    queryKey: ["profile", `${profileId}`],
    queryFn: async () => {
      const res = await refreshFetch(`/api/profiles/${profileId}`);
      return res.json();
    },
    retry: false,
    enabled: !!profileId,
  });

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  if (profile?.is_premium === false) {
    return null;
  }

  return (
    <AppWrapper>
      <Block title="Биография">
        <div className={styles.biography_grid}>
          {profile?.quote && profile?.quote.length > 0 && (
            <div className={styles.left_column}>
              <Appear>
                {profile?.quote && (
                  <div className={styles.epitaph_card}>
                    <Quote size={24} className={styles.quote_icon} />
                    <p className={styles.quote_text}>{profile.quote}</p>
                    {profile.quoteAuthor && (
                      <div className={styles.author_box}>
                        <p className={styles.author_text}>
                          — {profile.quoteAuthor}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Appear>

              <Appear>
                <div className={styles.info_container}>
                  {profile &&
                    getAboutInfo(profile).map((item) => (
                      <div key={item.id} className={styles.item}>
                        <h4>{item.title}</h4>
                        <p className={styles.info_text}>{item.text}</p>
                      </div>
                    ))}
                </div>
              </Appear>
            </div>
          )}

          {profile?.contentMarkdown && profile?.contentMarkdown?.length > 0 && (
            <div className={styles.right_column}>
              <h3 className={styles.main_heading}>История жизненного пути</h3>

              <div className={styles.biography_wrapper}>
                <div className={styles.biography} data-expanded={isExpanded}>
                  {profile && <Editor markdown={profile.contentMarkdown} />}
                </div>

                <Button
                  onClick={toggleExpanded}
                  color="dark"
                  variant="default"
                  className={styles.expanded_button}
                >
                  {!isExpanded ? "Показать ещё" : "Скрыть"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Block>
    </AppWrapper>
  );
};

export const Biography = ({ profileId }: ProfileId) => {
  return (
    <QueryProvider>
      <BiographyContent profileId={profileId} />
    </QueryProvider>
  );
};
