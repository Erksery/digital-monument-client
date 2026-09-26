import type { AllowedUser, ProfileEditor } from "../../types";

export interface CreateProfileFormValues {
  fullName: string;
  birthDate: Date | null;
  deathDate: Date | null;
  quote: string;
  quoteAuthor: string;
  birthPlace: string;
  deathPlace: string;
  spouse: string;
  citizenship: string;
  education: string;
  occupation: string;
  contentMarkdown: string;
  children: string[];
  awards: string[];
  avatar: File | string;
  photoGallery: (File | string)[];
  burialAddress: string;
  burialLatitude: string;
  burialLongitude: string;
  editors: ProfileEditor[];
  editorUserIds: string[];
  visibility: {
    type: "public" | "private" | "selected";
    allowedUserIds: string[];
    allowedUsers: AllowedUser[] | undefined;
  };
}
