import styles from "./index.module.scss";
import {
  ActionIcon,
  Group,
  Text,
  Title,
  SimpleGrid,
  Image,
} from "@mantine/core";
import { ImageIcon, Trash } from "lucide-react";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";

interface GalleryUploadProps {
  gallery: (File | string)[];
  loading: boolean;
  onDrop: (files: FileWithPath[]) => void;
  onRemove: (index: number) => void;
}

export const GalleryUpload = ({
  gallery,
  loading,
  onDrop,
  onRemove,
}: GalleryUploadProps) => {
  return (
    <>
      <Dropzone
        onDrop={onDrop}
        onReject={() => alert("Разрешены только изображения до 8мб")}
        maxSize={8 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        loading={loading}
      >
        <Group
          justify="center"
          gap="xl"
          mih={120}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Idle>
            <ImageIcon size={40} color="var(--mantine-color-dimmed)" />
          </Dropzone.Idle>

          <div>
            <Text size="md">
              Перетащите сюда фотографии для галереи альбома
            </Text>

            <Text size="xs" c="dimmed" mt={4}>
              Можно выбрать несколько файлов сразу
            </Text>
          </div>
        </Group>
      </Dropzone>

      {gallery.length > 0 && (
        <SimpleGrid cols={{ base: 3, sm: 6 }} spacing="md" mt="xs">
          {gallery.map((fileOrUrl, index) => {
            const imageSrc =
              fileOrUrl instanceof File
                ? URL.createObjectURL(fileOrUrl)
                : fileOrUrl;

            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                }}
              >
                <Image
                  src={imageSrc}
                  alt={`Галерея ${index + 1}`}
                  radius="md"
                  h="100%"
                  w="100%"
                  style={{ objectFit: "cover" }}
                />

                <ActionIcon
                  color="red"
                  variant="filled"
                  size="lg"
                  onClick={() => onRemove(index)}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    zIndex: 10,
                  }}
                >
                  <Trash size={18} />
                </ActionIcon>
              </div>
            );
          })}
        </SimpleGrid>
      )}
    </>
  );
};
