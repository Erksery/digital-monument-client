export type VisibilityType = "public" | "private" | "selected";

export interface AllowedUser {
  userId: string;
  login?: string;
}

export type ProfileTariff = "free" | "premium";

export interface VisibilitySettings {
  id?: string;
  visibility: VisibilityType;
  allowedUsers?: AllowedUser[];
}

export interface ProfileEditor {
  userId: string;
  login?: string;
}

export type ProfileId = {
  profileId: string | undefined;
};

export type UserId = {
  userId: string | undefined;
};

export type UserType = {
  id: string;
  login: string;
  email: string;
};

export interface BurialCoordinates {
  latitude: number;
  longitude: number;
}

export type FeedbackType = {
  id: string;
  text: string;
  authorRole: string;
  customName?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserType;
};

export interface ProfileResponse {
  id: string;
  userId: string;
  avatar: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  quote: string;
  quoteAuthor: string;
  birthPlace: string;
  deathPlace: string;
  spouse: string;
  children: string[];
  citizenship: string;
  education: string;
  occupation: string;
  awards: string[];
  contentMarkdown: string;
  photoGallery: string[];
  condolences: any[];
  burialAddress: string;
  burialCoordinates: BurialCoordinates;

  editors?: ProfileEditor[];
  visibilitySettings?: VisibilitySettings;

  createdAt: string;
  updatedAt: string;

  is_premium?: boolean;
}
