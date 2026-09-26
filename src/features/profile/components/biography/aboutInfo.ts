import type { ProfileResponse } from "../../types";

interface FieldConfig {
  key: keyof ProfileResponse;
  title: string;
  separator?: string;
}

export const getAboutInfo = (profile: ProfileResponse) => {
  if (!profile) return [];

  const fieldsConfig: FieldConfig[] = [
    { key: "birthPlace", title: "Место рождения" },
    { key: "deathPlace", title: "Место смерти" },
    { key: "spouse", title: "Супруг(а)" },
    { key: "children", title: "Дети", separator: ", " },
    { key: "citizenship", title: "Гражданство" },
    { key: "education", title: "Образование" },
    { key: "occupation", title: "Род деятельности" },
    { key: "awards", title: "Награды, премии и достижения", separator: ", " },
  ];

  return fieldsConfig
    .map((field, index) => {
      const rawValue = profile[field.key];
      let formattedText = "";

      if (Array.isArray(rawValue)) {
        const currentSeparator = field.separator ?? "\n";
        formattedText = rawValue.filter(Boolean).join(currentSeparator);
      } else if (typeof rawValue === "string") {
        formattedText = rawValue;
      }

      return {
        id: index + 1,
        title: field.title,
        text: formattedText.trim(),
        separator: field.separator,
      };
    })
    .filter((item) => item.text.length > 0);
};
