import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { OpenClawTutorial } from "./OpenClawTutorial";
import { OpenClawArchitecture } from "./OpenClawArchitecture";

export const openClawCompleteSchema = z.object({
  backgroundColor: zColor(),
  cardBg: zColor(),
  accentColor: zColor(),
  textColor: zColor(),
  secondaryTextColor: zColor(),
});

const TUTORIAL_DURATION = 2430;
const ARCHITECTURE_DURATION = 3300;

export const OpenClawComplete: React.FC<z.infer<typeof openClawCompleteSchema>> =
  ({
    backgroundColor,
    cardBg,
    accentColor,
    textColor,
    secondaryTextColor,
  }) => {
    return (
      <AbsoluteFill style={{ backgroundColor }}>
        <Sequence durationInFrames={TUTORIAL_DURATION}>
          <OpenClawTutorial
            backgroundColor={backgroundColor}
            cardBg={cardBg}
            accentColor={accentColor}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
          />
        </Sequence>
        <Sequence from={TUTORIAL_DURATION} durationInFrames={ARCHITECTURE_DURATION}>
          <OpenClawArchitecture
            backgroundColor={backgroundColor}
            cardBg={cardBg}
            accentColor={accentColor}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
          />
        </Sequence>
      </AbsoluteFill>
    );
  };
