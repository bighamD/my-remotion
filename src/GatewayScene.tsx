import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
} from "remotion";
import { z } from "zod";

export const gatewaySceneSchema = z.object({
  frame: z.number(),
  backgroundColor: z.string(),
  accentColor: z.string(),
  textColor: z.string(),
});

type GatewaySceneProps = z.infer<typeof gatewaySceneSchema>;

const TitleLayer: React.FC<{
  frame: number;
  accentColor: string;
}> = ({ frame, accentColor }) => {
  const opacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 20, stiffness: 100 },
    mass: 0.5,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      <h1
        className="chalk-text"
        style={{
          fontSize: 64,
          fontWeight: 400,
          margin: 0,
          textAlign: "center",
        }}
      >
        <span className="chalk-red" style={{ color: accentColor }}>
          Gateway
        </span>
        : 所有请求的第一站
      </h1>
    </div>
  );
};

export const GatewayScene: React.FC<GatewaySceneProps> = ({
  frame,
  backgroundColor,
  accentColor,
  textColor,
}) => {
  const currentFrame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <TitleLayer frame={currentFrame} accentColor={accentColor} />
    </AbsoluteFill>
  );
};
