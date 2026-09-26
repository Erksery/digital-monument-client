import styles from "./index.module.scss";
import { Block } from "@/components/ui/block/Block";

import { ImageGrid } from "./ImageGrid";
import { refreshFetch } from "@/api/refreshFetch";
import { useQuery } from "@tanstack/react-query";

import { QueryProvider } from "@/components/providers/QueryProvider";
import type { ProfileId, ProfileResponse } from "../../types";

const GalleryContent = ({ profileId }: ProfileId) => {
  const { data: profile } = useQuery<ProfileResponse>({
    queryKey: ["profile", `${profileId}`],
    queryFn: async () => {
      const res = await refreshFetch(`/api/profiles/${profileId}`);
      return res.json();
    },
    retry: false,
    enabled: !!profileId,
  });

  if (profile?.is_premium === false) {
    return null;
  }
  return (
    <Block title="Фотогалерея">
      {profile && <ImageGrid images={profile.photoGallery} />}
    </Block>
  );
};

export const Gallery = ({ profileId }: ProfileId) => {
  return (
    <QueryProvider>
      <GalleryContent profileId={profileId} />
    </QueryProvider>
  );
};
