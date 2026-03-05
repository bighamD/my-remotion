import "./index.css";
import { Composition } from "remotion";
import { OpenClawTutorial, openClawSchema } from "./OpenClawTutorial";
import {
  OpenClawArchitecture,
  openClawArchitectureSchema,
} from "./OpenClawArchitecture";
import { OpenClawComplete, openClawCompleteSchema } from "./OpenClawComplete";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OpenClawTutorial"
        component={OpenClawTutorial}
        durationInFrames={2430}
        fps={30}
        width={1920}
        height={1080}
        schema={openClawSchema}
        defaultProps={{
          backgroundColor: "#0F0F1A",
          cardBg: "#1A1A2E",
          accentColor: "#FF5A36",
          textColor: "#E0E0E0",
          secondaryTextColor: "#A0A0B0",
        }}
      />
      <Composition
        id="OpenClawArchitecture"
        component={OpenClawArchitecture}
        durationInFrames={3300}
        fps={30}
        width={1920}
        height={1080}
        schema={openClawArchitectureSchema}
        defaultProps={{
          backgroundColor: "#0F0F1A",
          cardBg: "#1A1A2E",
          accentColor: "#FF5A36",
          textColor: "#E0E0E0",
          secondaryTextColor: "#A0A0B0",
        }}
      />
      <Composition
        id="OpenClawComplete"
        component={OpenClawComplete}
        durationInFrames={5730}
        fps={30}
        width={1920}
        height={1080}
        schema={openClawCompleteSchema}
        defaultProps={{
          backgroundColor: "#0F0F1A",
          cardBg: "#1A1A2E",
          accentColor: "#FF5A36",
          textColor: "#E0E0E0",
          secondaryTextColor: "#A0A0B0",
        }}
      />
    </>
  );
};
