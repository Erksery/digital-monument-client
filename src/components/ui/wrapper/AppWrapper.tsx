import {
  ActionIcon,
  Button,
  Notification,
  InputWrapper,
  MantineProvider,
  Menu,
  Paper,
  PasswordInput,
  TextInput,
  createTheme,
  type MantineColorsTuple,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";

const interFont = '"Inter", system-ui, sans-serif';

const sophisticatedGold: MantineColorsTuple = [
  "#fbf7ed",
  "#f4ebd6",
  "#e9d6ad",
  "#ddc081",
  "#d4ac5c",
  "#c9a455",
  "#be9649",
  "#aa833d",
  "#967333",
  "#836228",
];

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Playfair Display",

  colors: {
    gold: sophisticatedGold,
  },

  components: {
    Paper: Paper.extend({
      styles: {
        root: {
          backgroundColor: "#1a1a1a",
        },
      },
    }),
    Button: Button.extend({
      defaultProps: {
        variant: "default",
      },

      styles: {
        root: {
          fontFamily: interFont,
          fontWeight: 400,
          "--button-font-family": interFont,
        },
        label: {
          fontFamily: interFont,
        },
        inner: {
          fontFamily: interFont,
        },
      },

      vars: (theme, props) => {
        if (props.variant === "default") {
          const colorKey = props.color || "dark";

          return {
            root: {
              "--button-bg": `var(--mantine-color-${colorKey}-7)`,
              "--button-hover": `var(--mantine-color-${colorKey}-6)`,
              "--button-bd": `1px solid var(--mantine-color-${colorKey}-4)`,
              "--button-color": "var(--mantine-color-white)",
            },
          };
        }

        if (props.variant === "outline") {
          const colorKey = props.color || theme.primaryColor;
          return {
            root: {
              "--button-bd": `1px solid var(--mantine-color-${colorKey}-text)`,
              "--button-color": `var(--mantine-color-${colorKey}-text)`,
              "--button-hover": `var(--mantine-color-${colorKey}-light-hover)`,
            },
          };
        }

        return { root: {} };
      },
    }),

    TextInput: TextInput.extend({
      styles: {
        input: {
          backgroundColor: "#242424",
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      styles: {
        input: {
          backgroundColor: "#242424",
        },
      },
    }),

    InputWrapper: InputWrapper.extend({
      styles: {
        label: {
          fontFamily: interFont,
          fontWeight: 400,
        },
        description: {
          fontFamily: interFont,
          fontWeight: 400,
        },
        error: {
          fontFamily: interFont,
        },
      },
    }),

    Menu: Menu.extend({
      styles: {
        dropdown: {
          backgroundColor: "#171717",
          borderColor: "#FFFFFF12",
          borderWidth: 2,
        },
        item: {
          fontFamily: interFont,
          fontWeight: 400,
        },
        itemLabel: {
          fontFamily: interFont,
          fontWeight: 400,
        },
      },
    }),
    Notification: Notification.extend({
      styles: {
        root: {
          backgroundColor: "#161616",
          border: "1px solid rgba(255, 255, 255, 0.07)",
        },
      },
    }),

    ActionIcon: ActionIcon.extend({
      vars: (theme, props) => {
        if (props.variant === "default") {
          const colorKey = props.color || "dark";
          return {
            root: {
              "--ai-bg": `var(--mantine-color-${colorKey}-7)`,
              "--ai-hover": `var(--mantine-color-${colorKey}-6)`,
              "--ai-bd": `1px solid var(--mantine-color-${colorKey}-4)`,
            },
          };
        }
        return { root: {} };
      },
    }),
  },
});

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
