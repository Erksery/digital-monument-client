import { useState, useCallback } from "react";
import {
  ActionIcon,
  Avatar,
  Text,
  Title,
  Modal,
  Button,
  Slider,
  Stack,
  Group,
} from "@mantine/core";
import { Trash, Upload } from "lucide-react";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import styles from "./index.module.scss";

interface AvatarUploadProps {
  avatar: string;
  loading: boolean;
  onDrop: (files: File[]) => void;
  onRemove: () => void;
}

export const AvatarUpload = ({
  avatar,
  loading,
  onDrop,
  onRemove,
}: AvatarUploadProps) => {
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] =
    useState<string>("avatar.jpg");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleDropzoneDrop = (files: FileWithPath[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalFileName(file.name);

      const objectUrl = URL.createObjectURL(file);
      setImageToCrop(objectUrl);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSaveCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      setIsCropping(true);
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);

      const croppedFile = new File([croppedBlob], originalFileName, {
        type: "image/jpeg",
      });

      onDrop([croppedFile]);
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при обрезке изображения:", error);
    } finally {
      setIsCropping(false);
    }
  };

  const handleCloseModal = () => {
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setImageToCrop(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <>
      <div className={styles.avatar_container}>
        <div className={styles.dropZone_container}>
          <Dropzone
            onDrop={handleDropzoneDrop}
            onReject={() => alert("Разрешены только изображения до 5мб")}
            maxSize={5 * 1024 ** 2}
            maxFiles={1}
            accept={IMAGE_MIME_TYPE}
            loading={loading}
            radius="100%"
            p={0}
            className={styles.dropZone}
          >
            {avatar ? (
              <Avatar src={avatar} size={250} radius="100%" />
            ) : (
              <div
                style={{
                  pointerEvents: "none",
                  textAlign: "center",
                  padding: 10,
                }}
              >
                <Dropzone.Idle>
                  <Upload
                    size={24}
                    color="var(--mantine-color-dimmed)"
                    style={{ margin: "0 auto" }}
                  />
                </Dropzone.Idle>
                <Text size="sm" c="dimmed" mt={4} lh={1.2}>
                  Кликните или перетащите фото
                </Text>
              </div>
            )}
          </Dropzone>

          {avatar && !loading && (
            <ActionIcon
              color="red"
              variant="filled"
              radius="xl"
              size="xl"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                zIndex: 10,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <Trash size={20} />
            </ActionIcon>
          )}
        </div>
      </div>

      <Modal
        opened={!!imageToCrop}
        onClose={handleCloseModal}
        title="Редактирование миниатюры"
        size="md"
        centered
      >
        <Stack gap="md">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 300,
              background: "#333",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div>
            <Text size="xs" c="dimmed" mb={4}>
              Масштаб:
            </Text>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              onChange={setZoom}
              label={null}
            />
          </div>

          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={handleCloseModal}
              disabled={isCropping}
            >
              Отмена
            </Button>
            <Button onClick={handleSaveCrop} loading={isCropping}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
