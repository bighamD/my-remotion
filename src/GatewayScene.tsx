import {
  AbsoluteFill,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";

export const gatewaySceneSchema = z.object({
  frame: z.number(),
  backgroundColor: z.string(),
  accentColor: z.string(),
  textColor: z.string(),
});

type GatewaySceneProps = z.infer<typeof gatewaySceneSchema>;

export const GatewayScene: React.FC<GatewaySceneProps> = ({
  frame,
  backgroundColor,
  accentColor,
  textColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* 场景内容将在后续任务中添加 */}
    </AbsoluteFill>
  );
};
