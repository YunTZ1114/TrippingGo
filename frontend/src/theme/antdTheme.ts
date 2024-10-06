import { ConfigProviderProps } from "antd";
import { colors } from "./colors";

export const antdTheme: ConfigProviderProps["theme"] = {
  token: {
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
    },
    Button: {
      defaultBorderColor: colors.text,
    },
    Modal: {
      borderRadiusLG: 16,
      titleFontSize: 28,
      titleLineHeight: 2,
      padding: 36,
    },
  },
};
