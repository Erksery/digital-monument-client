import { Image } from "@/components/ui/image/Image";
import styles from "./index.module.scss";
import clsx from "clsx";

import { useQuery } from "@tanstack/react-query";
import { refreshFetch } from "@/api/refreshFetch";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { parseDateData } from "@/utils/formatDate";
import type { ProfileId, ProfileResponse } from "../../types";
import { MainBioSkeleton } from "./MainBioSkeleton";

const MainBioContent = ({ profileId }: ProfileId) => {
  const { data: profile, isLoading } = useQuery<ProfileResponse | null>({
    queryKey: ["profile", profileId],
    queryFn: async () => {
      const res = await refreshFetch(`/api/profiles/${profileId}`);

      if (!res.ok) {
        return null;
      }

      return res.json();
    },
    retry: false,
    enabled: !!profileId,
  });

  if (isLoading) {
    return <MainBioSkeleton />;
  }

  if (!profile) {
    return null;
  }

  const bitrh = profile && parseDateData(profile.birthDate);
  const death = profile && parseDateData(profile.deathDate);

  return (
    <div className={styles.root_container}>
      <div className={styles.avatar_container}>
        <Image src={profile?.avatar} alt="avatar" />
      </div>

      <h2 className={styles.name}>{profile?.fullName}</h2>

      <div className={styles.timeline_container}>
        <p className={styles.date}>{bitrh?.dayMonth}</p>
        <div className={clsx(styles.line, styles.line_right)}></div>
        <p className={styles.timeline_text}>
          {bitrh?.year} — {death?.year}
        </p>
        <div className={clsx(styles.line, styles.line_left)}></div>
        <p className={styles.date}>{death?.dayMonth}</p>
      </div>
    </div>
  );
};

export const MainBio = ({ profileId }: ProfileId) => {
  return (
    <QueryProvider>
      <MainBioContent profileId={profileId} />
    </QueryProvider>
  );
};
