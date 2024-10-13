import { ConfigProviderProps } from "antd";
import { colors } from "./colors";

export const antdTheme: ConfigProviderProps["theme"] = {
  token: {
    fontFamily: "inter",
    colorPrimary: colors.primary.base,
    colorPrimaryHover: colors.primary.hover,
    colorLink: colors.primary.base,
    colorLinkHover: colors.primary.hover,
    colorText: colors.text,
  },
  components: {
    Input: {
      colorFillTertiary: colors.surfaceLight,
      colorFillSecondary: colors.surfaceLight,
      activeBg: colors.surfaceLight,
      activeBorderColor: colors.surfaceLight,
    },
    DatePicker: {
      colorFillTertiary: colors.surfaceLight,
      colorFillSecondary: colors.surfaceLight,
      activeBg: colors.surfaceLight,
      activeBorderColor: colors.surfaceLight,
    },
    Select: {
      colorFillTertiary: colors.surfaceLight,
      colorFillSecondary: colors.surfaceLight,
      selectorBg: colors.surfaceLight,
      colorPrimaryBorder: colors.surfaceLight,
      colorBorder: colors.surfaceLight,
      hoverBorderColor: colors.surfaceLight,
      activeBorderColor: colors.surfaceLight,
    },
    Button: {
      defaultBg: "transparent",
      defaultHoverBg: "transparent",
      defaultActiveBg: "transparent",
      defaultBorderColor: colors.primary.base,
      defaultColor: colors.primary.base,
    },
    Modal: {
      borderRadiusLG: 16,
      titleFontSize: 28,
      titleLineHeight: 2,
      padding: 36,
    },
    Table: {
      colorBgContainer: "transparent",
      rowHoverBg: "transparent",
      headerBg: "transparent",
      borderColor: colors.white,
    },
    Form: {
      labelFontSize: 14,
    },
  },
};
