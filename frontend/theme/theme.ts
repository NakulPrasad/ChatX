/**
 * @description contains the config for mantine theme
 */

import {
    createTheme,
    MantineColorsTuple,
    MantineTheme,
    rem,
    ThemeIcon,
  } from "@mantine/core";
  import "./fonts/ProximaNova.css";
  
  const orangeShades: MantineColorsTuple = [
    "#fff0e4",
    "#ffe0cf",
    "#fac0a1",
    "#f69e6e",
    "#f28043",
    "#f06e27",
    "#f06418",
    "#d6530c",
    "#bf4906",
    "#a73c00",
  ];
  
  const whiteShades: MantineColorsTuple = [
    "#f5f5f5",
    "#e7e7e7",
    "#cdcdcd",
    "#b2b2b2",
    "#9a9a9a",
    "#8b8b8b",
    "#848484",
    "#717171",
    "#656565",
    "#575757",
  ];
  
  export const theme = createTheme({
    fontFamily: "ProximaNova, Arial, sans-serif",
    colors: {
      orange: orangeShades,
      white: whiteShades,
    },
    primaryColor: "orange",
    primaryShade: { light: 6, dark: 4 },
    headings: {
      fontWeight: rem(600),
      sizes: {
        h1: {
          fontSize: rem(48),
          fontWeight: "700",
          lineHeight: "1.3",
        },
        h2: {
          fontSize: rem(40),
          fontWeight: "700",
          lineHeight: "1.35",
        },
        h3: {
          fontSize: rem(32),
          fontWeight: "600",
          lineHeight: "1.4",
        },
        h4: {
          fontSize: rem(24),
          fontWeight: "600",
          lineHeight: "1.45",
        },
        h5: {
          fontSize: rem(20),
          fontWeight: "600",
          lineHeight: "1.5",
        },
        h6: {
          fontSize: rem(18),
          fontWeight: "600",
          lineHeight: "1.6",
        },
      },
    },
    fontSizes: {
      xs: rem(12),
      sm: rem(14),
      md: rem(16),
      lg: rem(20),
      xl: rem(24),
    },
    lineHeights: {
      xs: "1.3",
      sm: "1.4",
      md: "1.5",
      lg: "1.6",
      xl: "1.7",
    },
    spacing: {
      xs: rem(4),
      sm: rem(8),
      md: rem(16),
      lg: rem(24),
      xl: rem(32),
    },
    breakpoints: {
      xs: "480",
      sm: "768",
      md: "1024",
      lg: "1280",
      xl: "1440",
    },
    shadows: {
      xs: "0 1px 3px rgba(0, 0, 0, 0.1)",
      sm: "0 2px 6px rgba(0, 0, 0, 0.1)",
      md: "0 4px 12px rgba(0, 0, 0, 0.1)",
      lg: "0 8px 24px rgba(0, 0, 0, 0.1)",
      xl: "0 12px 48px rgba(0, 0, 0, 0.1)",
    },
    focusRing: "auto",
    cursorType: "pointer",
    defaultRadius: "md",
    components: {
      ThemeIcon: {
        styles:(theme:MantineTheme)=>({
          root:{
            p : theme.spacing.xs,
          }
        })
      },
      Container: {
        styles: (theme: MantineTheme) => ({
          root: {
            maxWidth: theme.other.containerWidths.xxl,
            maxHeight: theme.other.containerHeights.xxl,
            overflow: "auto", // Default size for largest screens
            padding: rem(16),
          },
        }),
      },
      Button: {
        styles: (theme: any) => ({
          root: {
            fontWeight: 600,
            textTransform: "uppercase",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            "&:hover": {
              backgroundColor: theme.fn.darken(theme.colors.orange[6], 0.1),
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          },
        }),
      },
    },
    other: {
      fontWeights: {
        regular: 400,
        bold: 700,
        extraBold: 900,
      },
      containerHeights: {
        xxs: rem(200),
        xs: rem(300),
        sm: rem(400),
        md: rem(500),
        lg: rem(600),
        xl: rem(700),
        xxl: rem(800),
      },
      containerWidths: {
        xxs: rem(300),
        xs: rem(400),
        sm: rem(500),
        md: rem(600),
        lg: rem(700),
        xl: rem(800),
        xxl: rem(900),
      },
    },
  });
  