import type { ThemeConfig } from "antd";

// Note: exact brand hex values vary by source; these are commonly cited for Danske Bank blues.
// Treat as "Danske-inspired" unless you have official brand tokens. :contentReference[oaicite:1]{index=1}
const DANSKE_NAVY = "#003755"; // deep blue
const DANSKE_BLUE = "#009EDC"; // accent blue
const DANSKE_BG = "#F6F7F8"; // cool light grey background
const DANSKE_TEXT = "#0B1F2A"; // near-black with blue tint

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: DANSKE_NAVY,
    colorInfo: DANSKE_BLUE,

    colorBgBase: DANSKE_BG,
    colorTextBase: DANSKE_TEXT,

    borderRadius: 12,
    fontSize: 14,

    // A bit more “airy” like the site
    controlHeight: 40,
  },
  components: {
    Layout: {
      headerBg: "#FFFFFF",
      bodyBg: DANSKE_BG,
    },
    Card: {
      borderRadiusLG: 16,
    },
    Table: {
      borderRadiusLG: 16,
    },
    Button: {
      borderRadius: 999,
    },
    Tag: {
      borderRadiusSM: 999,
    },
    Drawer: {
      // keep it clean and light
    },
  },
};
