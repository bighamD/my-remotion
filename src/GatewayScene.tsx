import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  interpolate,
} from "remotion";
import { z } from "zod";

export const gatewaySceneSchema = z.object({
  frame: z.number(),
  backgroundColor: z.string(),
  accentColor: z.string(),
  textColor: z.string(),
});

type GatewaySceneProps = z.infer<typeof gatewaySceneSchema>;

const ServerIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 120"
    className={`chalk-icon ${className}`}
    style={{ width: 120, height: 144 }}
  >
    {/* 服务器机柜 - 手绘风格 */}
    <path
      d="M18,8 L82,8 L87,32 L13,32 Z"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M18,38 L82,38 L87,62 L13,62 Z"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M18,68 L82,68 L87,92 L13,92 Z"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* 状态指示灯 */}
    <circle cx="28" cy="20" r="4" fill="#4CAF50" />
    <circle cx="28" cy="50" r="4" fill="#4CAF50" />
    <circle cx="28" cy="80" r="4" fill="#FF5A36" />
  </svg>
);

const DoorIcon: React.FC<{
  isOpen: boolean;
  className?: string;
}> = ({ isOpen, className = "" }) => {
  const angle = isOpen ? -60 : 0;

  return (
    <svg
      viewBox="0 0 100 120"
      className={`chalk-icon ${className}`}
      style={{ width: 100, height: 120 }}
    >
      {/* 门框 */}
      <path
        d="M10,10 L10,110 L90,110 L90,10"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* 门板 - 带打开动画 */}
      <g
        style={{
          transformOrigin: "10px 60px",
          transform: `rotateY(${angle}deg)`,
        }}
      >
        <path
          d="M15,15 L15,105 L85,105 L85,15"
          fill="rgba(26, 26, 46, 0.8)"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 门把手 */}
        <circle cx="75" cy="60" r="5" fill="white" />
      </g>
    </svg>
  );
};

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

const EntrySection: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = spring({
    frame: Math.max(0, frame - 60),
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const doorOpenProgress = spring({
    frame: Math.max(0, frame - 90),
    fps: 30,
    config: { damping: 20, stiffness: 80 },
  });

  const doorIsOpen = doorOpenProgress > 0.5;

  const slideIn = interpolate(frame, [60, 120], [-100, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        opacity,
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <ServerIcon />
        <DoorIcon isOpen={doorIsOpen} />
      </div>

      <p
        className="chalk-text"
        style={{
          fontSize: 24,
          color: "white",
          textAlign: "center",
          transform: `translateX(${slideIn}px)`,
          marginTop: 16,
        }}
      >
        用户请求入口
        <br />
        网页 / 手机 / 聊天软件
      </p>
    </div>
  );
};

const FunctionalMatrix: React.FC<{ frame: number }> = ({ frame }) => {
  const gridOpacity = spring({
    frame: Math.max(0, frame - 120),
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const modules = [
    { title: "多用户隔离", color: "#4CAF50", delay: 140 },
    { title: "请求路由", color: "#2196F3", delay: 160 },
    { title: "权限验证", color: "#FF9800", delay: 180 },
    { title: "流量控制", color: "#9C27B0", delay: 200 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: 100,
        top: 180,
        width: 500,
        height: 400,
        opacity: gridOpacity,
      }}
    >
      {/* 网格线 - 手绘风格 */}
      <svg
        width="100%"
        height="100%"
        className="chalk-line"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 水平中线 */}
        <line
          x1="0"
          y1="200"
          x2="500"
          y2="200"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 垂直中线 */}
        <line
          x1="250"
          y1="0"
          x2="250"
          y2="400"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 边框 */}
        <rect
          x="0"
          y="0"
          width="500"
          height="400"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* 四个象限 */}
      {modules.map((module, index) => {
        const x = index % 2 === 0 ? 25 : 275;
        const y = index < 2 ? 25 : 225;
        const moduleOpacity = spring({
          frame: Math.max(0, frame - module.delay),
          fps: 30,
          config: { damping: 15, stiffness: 100 },
        });

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 225,
              height: 175,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              opacity: moduleOpacity,
            }}
          >
            <div
              className="chalk-text"
              style={{
                fontSize: 28,
                color: "white",
                textAlign: "center",
                padding: 16,
                border: `2px solid ${module.color}`,
                borderRadius: 8,
                backgroundColor: "rgba(26, 26, 46, 0.6)",
              }}
            >
              {module.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DataFlowLines: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = spring({
    frame: Math.max(0, frame - 180),
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const pathProgress = spring({
    frame: Math.max(0, frame - 180),
    fps: 30,
    config: { damping: 20, stiffness: 80 },
  });

  // 路径动画：绘制线条
  const pathLength = 300;
  const dashOffset = interpolate(pathProgress, [0, 1], [pathLength, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        pointerEvents: "none",
        opacity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <marker
            id="arrowhead-purple"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#9C27B0" />
          </marker>
        </defs>

        {/* 路径 A: 从多用户隔离到模块 */}
        <path
          d="M 350 280 Q 450 350 550 400"
          stroke="#9C27B0"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          markerEnd="url(#arrowhead-purple)"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: dashOffset,
          }}
          className="chalk-line"
        />

        {/* 路径 B: 从模块向下到出口 */}
        <path
          d="M 700 500 L 700 650"
          stroke="#9C27B0"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          markerEnd="url(#arrowhead-purple)"
          style={{
            strokeDasharray: 150,
            strokeDashoffset: interpolate(pathProgress, [0, 1], [150, 0], {
              extrapolateRight: "clamp",
            }),
          }}
          className="chalk-line"
        />
      </svg>

      {/* 出口元素 */}
      <div
        style={{
          position: "absolute",
          left: 660,
          top: 680,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* 窄门 */}
        <svg width="60" height="80" className="chalk-icon">
          <rect
            x="5"
            y="5"
            width="50"
            height="70"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="45" cy="40" r="4" fill="white" />
        </svg>

        {/* 对话气泡 */}
        <svg width="80" height="60" className="chalk-icon">
          <path
            d="M10,10 Q10,5 20,5 L70,5 Q80,5 80,15 L80,40 Q80,50 70,50 L30,50 L15,60 L20,50 L20,50 Q10,50 10,40 Z"
            fill="rgba(184, 169, 201, 0.3)"
            stroke="#B8A9C9"
            strokeWidth="2"
          />
          <text
            x="40"
            y="35"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
          >
            ...
          </text>
        </svg>
      </div>
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
      <EntrySection frame={currentFrame} />
      <FunctionalMatrix frame={currentFrame} />
      <DataFlowLines frame={currentFrame} />
    </AbsoluteFill>
  );
};
