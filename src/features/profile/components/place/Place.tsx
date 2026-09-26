import styles from "./index.module.scss";
import { Block } from "@/components/ui/block/Block";
import { MyMap } from "./Map";
import { QueryProvider } from "@/components/providers/QueryProvider";

import { refreshFetch } from "@/api/refreshFetch";
import { useQuery } from "@tanstack/react-query";
import type { ProfileId, ProfileResponse } from "../../types";

const PlaceContent = ({ profileId }: ProfileId) => {
  const { data: profile } = useQuery<ProfileResponse>({
    queryKey: ["profile", `${profileId}`],
    queryFn: async () => {
      const res = await refreshFetch(`/api/profiles/${profileId}`);
      return res.json();
    },
    retry: false,
    enabled: !!profileId,
  });
  return (
    <Block title="Как найти захоронение">
      <div className={styles.address}>
        <h2>Адрес</h2>
        <div className={styles.address_info}>
          <span>{profile?.burialAddress}</span>
        </div>
      </div>
      {profile && <MyMap coordinates={profile.burialCoordinates} />}
    </Block>
  );
};

export const Place = ({ profileId }: ProfileId) => {
  return (
    <QueryProvider>
      <PlaceContent profileId={profileId} />
    </QueryProvider>
  );
};
