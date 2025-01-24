import Svg, { Path } from "react-native-svg";

import { useTheme } from "~/hooks/useTheme";
import type { Icon } from "./type";

export function Cancel({ size = 24, color }: Icon) {
  const { foreground } = useTheme();
  const usedColor = color ?? foreground;
  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960" fill={usedColor}>
      <Path d="M337.62-298.69 480-441.08l142.38 142.39 38.93-38.93L518.92-480l142.39-142.38-38.93-38.93L480-518.92 337.62-661.31l-38.93 38.93L441.08-480 298.69-337.62l38.93 38.93Zm142.47 190.61q-77.15 0-145.06-29.32-67.92-29.33-118.16-79.6-50.23-50.27-79.51-118.05-29.28-67.79-29.28-144.86 0-77.15 29.32-145.06 29.33-67.92 79.6-118.16 50.27-50.23 118.05-79.51 67.79-29.28 144.86-29.28 77.15 0 145.06 29.32 67.92 29.33 118.16 79.6 50.23 50.27 79.51 118.05 29.28 67.79 29.28 144.86 0 77.15-29.32 145.06-29.33 67.92-79.6 118.16-50.27 50.23-118.05 79.51-67.79 29.28-144.86 29.28Zm-.1-55.96q131.89 0 223.93-92.02 92.04-92.03 92.04-223.93 0-131.89-92.02-223.93-92.03-92.04-223.93-92.04-131.89 0-223.93 92.02-92.04 92.03-92.04 223.93 0 131.89 92.02 223.93 92.03 92.04 223.93 92.04ZM480-480Z" />
    </Svg>
  );
}
