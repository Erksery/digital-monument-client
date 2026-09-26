export interface Policy {
  id: string;
  parts: {
    text: string;
    href?: string;
  }[];
}

export type HeaderLink = {
  path: string;
  label: string;
  Icon: string;
  section: string;
};
