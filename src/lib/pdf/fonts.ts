import path from "path";
import { Font } from "@react-pdf/renderer";

let registered = false;

export const FONT_FAMILY = "Noto Sans JP";

export function ensureFontsRegistered(): void {
  if (registered) return;
  Font.register({
    family: FONT_FAMILY,
    fonts: [
      { src: path.join(process.cwd(), "fonts/NotoSansJP-Regular.ttf"), fontWeight: "normal" },
      { src: path.join(process.cwd(), "fonts/NotoSansJP-Bold.ttf"), fontWeight: "bold" },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
