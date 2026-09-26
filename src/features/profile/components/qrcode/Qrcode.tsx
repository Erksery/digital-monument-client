import { useState } from "react";
import { Block } from "@/components/ui/block/Block";
import styles from "./index.module.scss";
import { PageQRCode } from "./PageQRCode";
import { Appear } from "@/components/ui/appear/Appear";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import {
  Button,
  Text,
  Box,
  ColorInput,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { Download } from "lucide-react";

type DownloadFormat = "svg" | "png" | "jpg";

export const Qrcode = () => {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#131314");
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("svg");
  const [isDownloading, setIsDownloading] = useState(false);

  const getSvgString = () => {
    const svgElement = document.getElementById("page-qr-code-svg");

    if (!svgElement) {
      throw new Error("Элемент QR-кода не найден");
    }

    const serializer = new XMLSerializer();

    let svgString = serializer.serializeToString(svgElement);
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    if (!svgString.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
      svgString = svgString.replace(
        "<svg",
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
      );
    }

    return svgString;
  };

  const downloadBlob = (blob: Blob, extension: DownloadFormat) => {
    const blobUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = `qr-code-${Date.now()}.${extension}`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(blobUrl);
  };

  const handleDownloadSVG = () => {
    const svgString = getSvgString();

    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    downloadBlob(blob, "svg");
  };

  const handleDownloadRaster = async (format: "png" | "jpg") => {
    const svgString = getSvgString();

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Не удалось загрузить QR-код"));

        image.src = svgUrl;
      });

      const svgElement = document.getElementById("page-qr-code-svg");

      if (!svgElement) {
        throw new Error("Элемент QR-кода не найден");
      }

      const rect = svgElement.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height, 300);
      const scale = 3;

      const canvas = document.createElement("canvas");
      canvas.width = size * scale;
      canvas.height = size * scale;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Не удалось создать Canvas context");
      }

      context.imageSmoothingEnabled = false;
      context.fillStyle = bgColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const mimeType = format === "png" ? "image/png" : "image/jpeg";

      const quality = format === "jpg" ? 0.95 : undefined;

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, mimeType, quality);
      });

      if (!blob) {
        throw new Error("Не удалось сформировать изображение");
      }

      downloadBlob(blob, format);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      if (downloadFormat === "svg") {
        handleDownloadSVG();
      } else {
        await handleDownloadRaster(downloadFormat);
      }
    } catch (error) {
      console.error("Ошибка при скачивании QR-кода:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDescription = {
    svg: "SVG",
    png: "PNG",
    jpg: "JPG",
  };

  return (
    <AppWrapper>
      <Block title="QR-код страницы">
        <Appear>
          <div className={styles.qrcode_container}>
            <div className={styles.container}>
              <PageQRCode bgColor={bgColor} fgColor={fgColor} />

              <Group grow mb="md" mt="md">
                <ColorInput
                  label="Цвет кода"
                  value={fgColor}
                  onChange={setFgColor}
                  disallowInput
                  classNames={{
                    input: styles.input_root,
                  }}
                />

                <ColorInput
                  label="Цвет фона"
                  value={bgColor}
                  onChange={setBgColor}
                  disallowInput
                  classNames={{
                    input: styles.input_root,
                  }}
                />
              </Group>

              <div className={styles.download_container}>
                <Text size="sm" fw={500} className={styles.format_label}>
                  Формат скачивания
                </Text>

                <SegmentedControl
                  fullWidth
                  value={downloadFormat}
                  onChange={(value) =>
                    setDownloadFormat(value as DownloadFormat)
                  }
                  data={[
                    {
                      label: "SVG",
                      value: "svg",
                    },
                    {
                      label: "PNG",
                      value: "png",
                    },
                    {
                      label: "JPG",
                      value: "jpg",
                    },
                  ]}
                  classNames={{
                    root: styles.format_switch,
                  }}
                />

                <Button
                  onClick={handleDownload}
                  loading={isDownloading}
                  size="lg"
                  fullWidth
                  h={60}
                  leftSection={
                    <div className={styles.icon_container}>
                      <Download size={20} />
                    </div>
                  }
                  styles={{
                    inner: {
                      justifyContent: "flex-start",
                    },
                    label: {
                      textAlign: "left",
                    },
                  }}
                  classNames={{
                    root: styles.button_root,
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.2,
                    }}
                  >
                    <Text size="md" fw={500}>
                      Скачать QR-код страницы
                    </Text>

                    <Text size="xs" c="dimmed" fw={400}>
                      Формат скачивания: {formatDescription[downloadFormat]}
                    </Text>
                  </Box>
                </Button>
              </div>
            </div>
          </div>
        </Appear>
      </Block>
    </AppWrapper>
  );
};
