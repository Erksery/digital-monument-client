import styles from "./index.module.scss";
import {
  TextInput,
  Button,
  Stack,
  ActionIcon,
  Group,
  Text,
  Card,
} from "@mantine/core";

import { Plus, Trash } from "lucide-react";

const inputSize = "md";
interface ArrayFieldProps {
  title: string;
  placeholder: string;
  value: string;
  items: string[];
  onChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const ArrayField = ({
  title,
  placeholder,
  value,
  items,
  onChange,
  onAdd,
  onRemove,
}: ArrayFieldProps) => {
  return (
    <div>
      <Group align="flex-end" mb="sm" gap="xs">
        <TextInput
          size={inputSize}
          label={title}
          placeholder={placeholder}
          style={{ flex: 1 }}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
        />

        <ActionIcon size="xl" color="gold" onClick={onAdd}>
          <Plus />
        </ActionIcon>
      </Group>

      <Stack gap="xs">
        {items.map((item, index) => (
          <Card
            key={index}
            shadow="sm"
            radius="md"
            withBorder
            p="xs"
            className={styles.arrayItem}
          >
            <Group
              justify="space-between"
              align="center"
              style={{ width: "100%" }}
            >
              <Text size="md">{item}</Text>

              <ActionIcon
                size="lg"
                color="red"
                variant="subtle"
                onClick={() => onRemove(index)}
              >
                <Trash size={20} />
              </ActionIcon>
            </Group>
          </Card>
        ))}
      </Stack>
    </div>
  );
};
