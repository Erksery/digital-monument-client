import { QueryProvider } from "@/components/providers/QueryProvider";
import { refreshFetch } from "@/api/refreshFetch";
import { useQuery } from "@tanstack/react-query";
import type { ProfileId, ProfileResponse } from "../../types";
import { CreateProfile } from "../create/CreateProfile";

const UpdateProfileContent = ({ profileId }: ProfileId) => {
  const { data: profile } = useQuery<ProfileResponse>({
    queryKey: ["profile", `${profileId}`],
    queryFn: async () => {
      const res = await refreshFetch(`/api/profiles/${profileId}`);
      return res.json();
    },
    retry: false,
    enabled: !!profileId,
  });
  return <CreateProfile initialData={profile} />;
};

export const UpdateProfile = ({ profileId }: ProfileId) => {
  return (
    <QueryProvider>
      <UpdateProfileContent profileId={profileId} />
    </QueryProvider>
  );
};
