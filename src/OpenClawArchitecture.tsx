import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  Sequence,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const openClawArchitectureSchema = z.object({
  backgroundColor: zColor(),
  cardBg: zColor(),
  accentColor: zColor(),
  textColor: zColor(),
  secondaryTextColor: zColor(),
});

// ============================================
// 场景 1: 整体架构概览（基于 1.html）
// ============================================

const OverallArchitectureScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  // 模块组件
  const ModuleBox: React.FC<{
    icon: string;
    title: string;
    color: string;
    frame: number;
    delay: number;
    x: number;
    y: number;
  }> = ({ icon, title, color, frame, delay, x, y }) => {
    const opacity = spring({
      frame: frame - delay,
      fps: 30,
      config: { damping: 20, stiffness: 100 },
    });
    const scale = spring({
      frame: frame - delay,
      fps: 30,
      config: { damping: 25, stiffness: 100 },
    });

    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          minWidth: "120px",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            filter: `drop-shadow(0 4px 16px ${color}66)`,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color,
          }}
        >
          {title}
        </div>
      </div>
    );
  };

  // 箭头组件
  const Arrow: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    delay: number;
  }> = ({ x1, y1, x2, y2, delay }) => {
    const progress = interpolate(frame - delay, [0, 30], [0, 1], {
      extrapolateRight: "clamp",
    });
    const opacity = spring({ frame: frame - delay, fps: 30 });

    return (
      <g opacity={opacity}>
        <defs>
          <marker
            id={`arrow-main-${x1}-${y1}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="rgba(255,255,255,0.2)" />
          </marker>
        </defs>
        <line
          x1={x1}
          y1={y1}
          x2={x1 + (x2 - x1) * progress}
          y2={y1 + (y2 - y1) * progress}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          markerEnd={`url(#arrow-main-${x1}-${y1})`}
        />
      </g>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        background: "radial-gradient(circle, #2c2c2c 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          // border: "4px solid rgba(255,255,255,0.2)",
          // padding: "60px",
          // borderRadius: "16px",
          // background: "rgba(18,18,18,0.9)",
          // boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* 标题 */}
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: textColor,
            margin: "0 0 80px 0",
            opacity: titleOpacity,
            textAlign: "center",
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
            minHeight: "65px",
          }}
        >
          {(() => {
            const title = "OpenClaw 核心组成";
            const typeStartFrame = 5;
            const durationPerChar = 3;
            const charsToShow = Math.max(
              0,
              Math.min(
                title.length,
                Math.floor((frame - typeStartFrame) / durationPerChar),
              ),
            );
            return (
              <span>
                <span style={{ color: accentColor }}>
                  {title.substring(0, charsToShow).split(" ")[0]}
                </span>
                {charsToShow > 8 && title.substring(8, charsToShow)}
              </span>
            );
          })()}
        </h1>

        <div style={{ display: "flex", gap: "60px" }}>
          {/* 左侧：OpenClaw 核心区 */}
          <div
            style={{
              flex: "0 0 280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "2px solid rgba(255,255,255,0.2)",
              paddingRight: "40px",
            }}
          >
            <div
              style={{
                fontSize: "120px",
                marginBottom: "24px",
                filter: "drop-shadow(0 8px 32px rgba(255,90,54,0.4))",
              }}
            >
              🖥️
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  color: accentColor,
                  marginBottom: "8px",
                  letterSpacing: "-0.02em",
                }}
              >
                OpenClaw
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                AI 私人助理
              </div>
            </div>
          </div>

          {/* 右侧：模块架构图 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingLeft: "20px",
              position: "relative",
              height: "500px",
            }}
          >
            {/* 第一行：Gateway → Agent → Skills → Channels */}
            <ModuleBox
              icon="🚪"
              title="Gateway"
              color="white"
              frame={frame}
              delay={20}
              x={0}
              y={0}
            />
            <ModuleBox
              icon="🤖"
              title="Agent"
              color="white"
              frame={frame}
              delay={30}
              x={280}
              y={0}
            />
            <ModuleBox
              icon="💼"
              title="Skills"
              color="#EAB308"
              frame={frame}
              delay={40}
              x={560}
              y={0}
            />
            <ModuleBox
              icon="📡"
              title="Channels"
              color="#22C55E"
              frame={frame}
              delay={50}
              x={840}
              y={0}
            />

            {/* 第二行：Nodes → Memory → Heartbeat → Cron */}
            <ModuleBox
              icon="🌐"
              title="Nodes"
              color="#34D399"
              frame={frame}
              delay={60}
              x={0}
              y={250}
            />
            <ModuleBox
              icon="🧠"
              title="Memory"
              color="#A78BFA"
              frame={frame}
              delay={70}
              x={280}
              y={250}
            />
            <ModuleBox
              icon="💓"
              title="Heartbeat"
              color="#F472B6"
              frame={frame}
              delay={80}
              x={560}
              y={250}
            />
            <ModuleBox
              icon="⏰"
              title="Cron"
              color="#9333EA"
              frame={frame}
              delay={90}
              x={840}
              y={250}
            />

            {/* 箭头连接 */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {/* 第一行箭头 */}
              <Arrow x1={140} y1={70} x2={270} y2={70} delay={25} />
              <Arrow x1={420} y1={70} x2={550} y2={70} delay={35} />
              <Arrow x1={700} y1={70} x2={830} y2={70} delay={45} />

              {/* 第二行箭头 */}
              <Arrow x1={140} y1={320} x2={270} y2={320} delay={65} />
              <Arrow x1={420} y1={320} x2={550} y2={320} delay={75} />
              <Arrow x1={700} y1={320} x2={830} y2={320} delay={85} />
            </svg>
          </div>
        </div>

        {/* 底部说明 */}
        <div
          style={{
            marginTop: "80px",
            paddingTop: "40px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
            opacity: spring({ frame: frame - 110, fps: 30 }),
          }}
        >
          <div style={{ fontSize: "36px", lineHeight: 1.5 }}>
            <span style={{ color: "#EAB308", fontWeight: 700 }}>
              主动执行任务原理：
            </span>
            <span
              style={{
                fontWeight: 300,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              多模块协同响应
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 场景 2: Gateway 网关核心（基于 gateway.html）
// ============================================

const GatewayScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const gatewayFunctions = [
    {
      title: "身份验证",
      icon: "📋",
      color: "#FF4444",
      desc: "验证用户身份",
      delay: 40,
    },
    {
      title: "连接管理",
      icon: "🔗",
      color: "#00CC66",
      desc: "管理连接状态",
      delay: 50,
    },
    {
      title: "多用户隔离",
      icon: "🔄",
      color: "#3399FF",
      desc: "用户数据隔离",
      delay: 60,
    },
    {
      title: "请求路由",
      icon: "➡️",
      color: "#00CC66",
      desc: "路由到目标模块",
      delay: 70,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 60px",
        background: "radial-gradient(circle, #2c2c2c 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* 标题 */}
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: "#FF4444",
          margin: "0 0 16px 0",
          opacity: titleOpacity,
          textAlign: "center",
          textShadow: "0 0 30px rgba(255,68,68,0.5)",
          minHeight: "70px",
        }}
      >
        {(() => {
          const title = "Gateway: 所有请求的第一站";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 50px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "40px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "身份验证", color: "#FF4444", bold: true },
            { text: "、", color: textColor },
            { text: "请求路由", color: "#00CC66", bold: true },
            { text: "、", color: textColor },
            { text: "多用户隔离", color: "#3399FF", bold: true },
          ];

          const typeStartFrame = 10;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      {/* 主内容区：使用 flexbox 而不是 absolute */}
      <div
        style={{
          display: "flex",
          gap: "60px",
          width: "100%",
          maxWidth: "1600px",
          flex: 1,
          alignItems: "center",
        }}
      >
        {/* 左侧：用户请求入口 */}
        <div
          style={{
            flex: "0 0 420px",
            opacity: spring({ frame: frame - 20, fps: 30 }),
            transform: `scale(${spring({ frame: frame - 20, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              padding: "60px 40px",
              background: "rgba(255,255,255,0.08)",
              border: "5px solid rgba(255,255,255,0.4)",
              borderRadius: "28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ fontSize: "96px", marginBottom: "24px" }}>🖥️</div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: textColor,
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              用户请求入口
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
              }}
            >
              网页 / 手机 / 聊天软件
            </div>
          </div>
        </div>

        {/* 中间箭头 */}
        <div
          style={{
            flex: "0 0 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: spring({ frame: frame - 30, fps: 30 }),
          }}
        >
          <div
            style={{
              fontSize: "56px",
              color: "#FFAA00",
              transform: `scale(${interpolate(frame - 30, [0, 20], [0.5, 1], { extrapolateRight: "clamp" })})`,
            }}
          >
            ➡️
          </div>
        </div>

        {/* 右侧：Gateway 四个功能模块 */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "20px",
          }}
        >
          {gatewayFunctions.map((func) => (
            <div
              key={func.title}
              style={{
                opacity: spring({ frame: frame - func.delay, fps: 30 }),
                transform: `scale(${spring({ frame: frame - func.delay, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
                transformOrigin: "center center",
              }}
            >
              <div
                style={{
                  padding: "20px 16px",
                  background: `${func.color}22`,
                  border: `3px solid ${func.color}`,
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  minHeight: "130px",
                  justifyContent: "center",
                  boxShadow: `0 6px 24px ${func.color}44`,
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {func.icon}
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: func.color,
                    marginBottom: "6px",
                    textAlign: "center",
                  }}
                >
                  {func.title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.7)",
                    textAlign: "center",
                  }}
                >
                  {func.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部警告 */}
      <div
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          opacity: spring({ frame: frame - 90, fps: 30 }),
          transform: `translateY(${interpolate(frame - 90, [-20, 0], [30, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "20px 40px",
            background: "rgba(255,68,68,0.15)",
            border: "3px solid #FF4444",
            borderRadius: "20px",
          }}
        >
          <div style={{ fontSize: "36px" }}>🚫</div>
          <div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#FF4444",
                marginBottom: "6px",
              }}
            >
              无Gateway: 系统无法识别用户指令
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              所有请求必须通过Gateway进行身份验证和路由
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 场景 3: Agent 智能代理系统
// ============================================

const AgentScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const llmProviders = [
    { name: "OpenAI", icon: "🤖", color: "#10B981" },
    { name: "DeepSeek", icon: "🐳", color: "#3B82F6" },
    { name: "Qwen", icon: "🐍", color: "#F59E0B" },
  ];

  const agentFeatures = [
    {
      icon: "💬",
      title: "理解用户意图",
      desc: "理解用户意图",
      color: "#10B981",
    },
    { icon: "🎯", title: "任务规划", desc: "复杂任务分解", color: "#3B82F6" },
    {
      icon: "💭",
      title: "上下文记忆",
      desc: "持久化对话历史",
      color: "#F59E0B",
    },
    { icon: "🔧", title: "工具调用", desc: "扩展能力边界", color: "#10B981" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 16px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "70px",
        }}
      >
        {(() => {
          const title = "Agent: 智能代理";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 60px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "40px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "LLM", color: "#10B981", bold: true },
            { text: "驱动，", color: textColor },
            { text: "理解意图", color: "#3B82F6", bold: true },
            { text: "并", color: textColor },
            { text: "执行任务", color: "#F59E0B", bold: true },
          ];

          const typeStartFrame = 18;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      <div
        style={{
          display: "flex",
          gap: "80px",
          width: "100%",
          maxWidth: "1400px",
        }}
      >
        {/* 左侧：LLM 提供商 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: textColor,
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            支持的 LLM
          </div>
          {llmProviders.map((provider, index) => (
            <div
              key={index}
              style={{
                marginBottom: "28px",
                opacity: spring({ frame: frame - 20 - index * 10, fps: 30 }),
                transform: `translateX(${interpolate(frame - 20 - index * 10, [-50, 0], [50, 0], { extrapolateRight: "clamp" })}px)`,
              }}
            >
              <div
                style={{
                  background: `${provider.color}22`,
                  border: `3px solid ${provider.color}`,
                  borderRadius: "16px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <span style={{ fontSize: "40px" }}>{provider.icon}</span>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: provider.color,
                  }}
                >
                  {provider.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：Agent 特性 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: textColor,
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            核心能力
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {agentFeatures.map((feature, index) => (
              <div
                key={index}
                style={{
                  opacity: spring({ frame: frame - 50 - index * 8, fps: 30 }),
                  transform: `scale(${spring({ frame: frame - 50 - index * 8, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
                  transformOrigin: "center center",
                }}
              >
                <div
                  style={{
                    background: `${feature.color}22`,
                    border: `3px solid ${feature.color}`,
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    minHeight: "140px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 32px ${feature.color}44`,
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                    {feature.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: feature.color,
                      marginBottom: "6px",
                    }}
                  >
                    {feature.title}
                  </div>
                  <div
                    style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
                  >
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 场景 4: Skills 技能系统
// ============================================

const SkillsScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const skills = [
    { name: "浏览器", icon: "🌐", desc: "自动化操作", color: "#3B82F6" },
    { name: "文件系统", icon: "📁", desc: "读写管理", color: "#10B981" },
    { name: "API 调用", icon: "🔌", desc: "外部集成", color: "#F59E0B" },
    { name: "代码执行", icon: "⚡", desc: "沙箱运行", color: "#EF4444" },
    { name: "数据库", icon: "🗄️", desc: "数据存储", color: "#8B5CF6" },
    { name: "自定义", icon: "🔧", desc: "扩展开发", color: "#EC4899" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 16px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "70px",
        }}
      >
        {(() => {
          const title = "Skills: 技能系统";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 60px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "40px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "Agent", color: "#3B82F6", bold: true },
            { text: "决定做什么，", color: textColor },
            { text: "Skills", color: "#F59E0B", bold: true },
            { text: "决定怎么做", color: textColor },
          ];

          const typeStartFrame = 10;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          height: "700px",
        }}
      >
        {/* 中心 Agent */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${spring({
              frame: frame - 20,
              fps: 30,
              config: { damping: 25, stiffness: 100 },
            })})`,
            width: "220px",
            height: "220px",
            opacity: spring({ frame: frame - 20, fps: 30 }),
            background: `${accentColor}22`,
            border: `4px solid ${accentColor}`,
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 16px 64px ${accentColor}44`,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "72px", marginBottom: "12px" }}>🤖</div>
          <div
            style={{ fontSize: "26px", fontWeight: 700, color: accentColor }}
          >
            Agent
          </div>
        </div>

        {/* Skills 圆形排列 */}
        {skills.map((skill, index) => {
          const angle = (index * 60 - 90) * (Math.PI / 180);
          const radius = 300;
          const centerX = 600;
          const centerY = 350;
          const x = centerX + Math.cos(angle) * radius - 80;
          const y = centerY + Math.sin(angle) * radius - 80;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                opacity: spring({
                  frame: frame - 40 - index * 8,
                  fps: 30,
                }),
                transform: `scale(${spring({
                  frame: frame - 40 - index * 8,
                  fps: 30,
                  config: { damping: 25, stiffness: 100 },
                })})`,
                transformOrigin: "center center",
                zIndex: 5,
              }}
            >
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  background: `${skill.color}22`,
                  border: `3px solid ${skill.color}`,
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 32px ${skill.color}44`,
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                  {skill.icon}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: skill.color,
                    marginBottom: "4px",
                  }}
                >
                  {skill.name}
                </div>
                <div
                  style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
                >
                  {skill.desc}
                </div>
              </div>
            </div>
          );
        })}

        {/* 连接线 */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {skills.map((skill, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const progress = interpolate(
              frame - 100 - index * 3,
              [0, 30],
              [0, 1],
              { extrapolateRight: "clamp" },
            );
            const opacity = spring({
              frame: frame - 100 - index * 3,
              fps: 30,
            });
            // 减去模块半径，让连接线接近模块边缘但不重叠太多
            const maxRadius = 300 - 120;
            const radius = maxRadius * progress;
            const centerX = 600;
            const centerY = 350;
            const x2 = centerX + Math.cos(angle) * radius;
            const y2 = centerY + Math.sin(angle) * radius;

            return (
              <g key={index} opacity={opacity}>
                <defs>
                  <marker
                    id={`arrow-skills-${index}`}
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill={skill.color} />
                  </marker>
                </defs>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke={skill.color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd={`url(#arrow-skills-${index})`}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ============================================
// 场景 5: Channels 渠道层
// ============================================

const ChannelsScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const channels = [
    { name: "网页", icon: "🌐", color: "#EF4444" },
    { name: "短信", icon: "📱", color: "#10B981" },
    { name: "Telegram", icon: "✈️", color: "#3B82F6" },
    { name: "飞书", icon: "🚀", color: "#F59E0B" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 16px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "70px",
        }}
      >
        {(() => {
          const title = "Channels: 沟通热线";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 70px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "40px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "网页", color: "#EF4444", bold: true },
            { text: "、", color: textColor },
            { text: "短信", color: "#10B981", bold: true },
            { text: "、", color: textColor },
            { text: "Telegram", color: "#3B82F6", bold: true },
            { text: "、", color: textColor },
            { text: "飞书", color: "#F59E0B", bold: true },
            { text: "多渠道", color: textColor },
            { text: "统一接入", color: "#A78BFA", bold: true },
          ];

          const typeStartFrame = 20;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      {/* 渠道图标 */}
      <div
        style={{
          display: "flex",
          gap: "50px",
          marginBottom: "60px",
          width: "100%",
          maxWidth: "1400px",
          justifyContent: "center",
        }}
      >
        {channels.map((channel, index) => (
          <div
            key={index}
            style={{
              opacity: spring({
                frame: frame - 20 - index * 10,
                fps: 30,
              }),
              transform: `scale(${spring({
                frame: frame - 20 - index * 10,
                fps: 30,
                config: { damping: 25, stiffness: 100 },
              })})`,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: "160px",
                height: "160px",
                background: `${channel.color}22`,
                border: `4px solid ${channel.color}`,
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 32px ${channel.color}44`,
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                {channel.icon}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: channel.color,
                }}
              >
                {channel.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 箭头 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
          opacity: spring({ frame: frame - 70, fps: 30 }),
        }}
      >
        <div style={{ fontSize: "56px" }}>⬇️</div>
      </div>

      {/* 中间转换框 */}
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          opacity: spring({ frame: frame - 80, fps: 30 }),
          transform: `scale(${spring({
            frame: frame - 80,
            fps: 30,
            config: { damping: 25, stiffness: 100 },
          })})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            background: `${accentColor}22`,
            border: `3px solid ${accentColor}`,
            borderRadius: "16px",
            padding: "28px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              color: accentColor,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            消息统一转换成系统能理解的格式
          </div>
        </div>

        {/* 输出说明 */}
        <div
          style={{
            textAlign: "center",
            opacity: spring({ frame: frame - 100, fps: 30 }),
          }}
        >
          <div
            style={{
              fontSize: "26px",
              color: "#10B981",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            ✓ 指令准确送达 Agent
          </div>
          <div style={{ fontSize: "18px", color: textColor }}>
            换通信方式不换助理，依然听懂指令
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 场景 6: Nodes 节点系统
// ============================================

const NodesScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  // 设备场景
  const deviceScenarios = [
    {
      title: "本地电脑场景",
      icon: "💻",
      desc: "个人电脑上运行节点，本地化服务",
      devices: ["🖥️ 桌面应用", "📁 本地文件", "⚙️ 系统控制"],
      color: "#3B82F6",
    },
    {
      title: "服务器场景",
      icon: "🖥️",
      desc: "服务器集群部署，稳定可靠",
      devices: ["🔧 运维管理", "📊 监控告警", "🔄 自动化部署"],
      color: "#10B981",
    },
    {
      title: "云主机场景",
      icon: "☁️",
      desc: "云端弹性部署，按需扩展",
      devices: ["🚀 弹性伸缩", "💰 成本优化", "🌍 全球分发"],
      color: "#F59E0B",
    },
  ];

  // 技术特性
  const techFeatures = [
    { icon: "🔌", title: "插件化架构", desc: "轻松添加新设备支持" },
    { icon: "🔄", title: "自动重连", desc: "网络中断自动恢复" },
    { icon: "⚡", title: "低延迟", desc: "毫秒级响应速度" },
    { icon: "🛡️", title: "安全隔离", desc: "每个节点独立运行" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 70px",
        background:
          "linear-gradient(135deg, rgba(30,30,40,0.9) 0%, rgba(20,20,30,0.95) 100%)",
      }}
    >
      {/* 标题 - 打字机效果 */}
      <div style={{ textAlign: "center", marginBottom: "45px" }}>
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: accentColor,
            margin: "0 0 12px 0",
            opacity: titleOpacity,
            minHeight: "65px",
          }}
        >
          {(() => {
            const title = "Nodes: 助理的眼睛和手，真正干活的";
            const typeStartFrame = 5;
            const durationPerChar = 3;
            const charsToShow = Math.max(
              0,
              Math.min(
                title.length,
                Math.floor((frame - typeStartFrame) / durationPerChar),
              ),
            );
            return title.substring(0, charsToShow);
          })()}
        </h1>
        <h3
          style={{
            fontSize: "28px",
            fontWeight: 600,
            margin: "0",
            opacity: titleOpacity,
            minHeight: "40px",
          }}
        >
          {/* 打字机效果 */}
          {(() => {
            const parts = [
              { text: "本地电脑", color: "#3B82F6", bold: true },
              { text: "、", color: textColor },
              { text: "服务器", color: "#10B981", bold: true },
              { text: "、", color: textColor },
              { text: "云主机", color: "#F59E0B", bold: true },
              { text: "，让助理", color: textColor },
              { text: "无处不在", color: "#34D399", bold: true },
            ];

            const typeStartFrame = 20;
            const durationPerChar = 2;

            const result = [];
            let totalChars = 0;

            for (const part of parts) {
              const partEnd = totalChars + part.text.length;
              const charsToShow = Math.max(
                0,
                Math.min(
                  part.text.length,
                  Math.floor((frame - typeStartFrame) / durationPerChar) -
                    totalChars,
                ),
              );

              if (charsToShow > 0) {
                result.push(
                  <span
                    key={totalChars}
                    style={{
                      color: part.color,
                      fontWeight: part.bold ? 700 : 400,
                    }}
                  >
                    {part.text.substring(0, charsToShow)}
                  </span>,
                );
              }

              totalChars = partEnd;
              if (
                Math.floor((frame - typeStartFrame) / durationPerChar) <=
                totalChars
              ) {
                break;
              }
            }

            return result.length > 0 ? result : <span>&nbsp;</span>;
          })()}
        </h3>
      </div>

      {/* 设备场景展示 */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          maxWidth: "1300px",
          marginBottom: "40px",
        }}
      >
        {deviceScenarios.map((scenario, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              opacity: spring({ frame: frame - 30 - index * 12, fps: 30 }),
              transform: `translateY(${interpolate(frame - 30 - index * 12, [-30, 0], [40, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
            <div
              style={{
                background: `${scenario.color}15`,
                border: `3px solid ${scenario.color}`,
                borderRadius: "20px",
                padding: "28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: `0 8px 32px ${scenario.color}40`,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <div style={{ fontSize: "56px", marginBottom: "10px" }}>
                  {scenario.icon}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: scenario.color,
                    marginBottom: "8px",
                  }}
                >
                  {scenario.title}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.4,
                  }}
                >
                  {scenario.desc}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "auto",
                }}
              >
                {scenario.devices.map((device, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "15px",
                      color: textColor,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>
                      {device.split(" ")[0]}
                    </span>
                    <span>{device.split(" ").slice(1).join(" ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部信息区域 */}
      <div
        style={{
          display: "flex",
          gap: "28px",
          width: "100%",
          maxWidth: "1300px",
          opacity: spring({ frame: frame - 80, fps: 30 }),
        }}
      >
        {/* 左侧：技术特性 */}
        <div
          style={{
            flex: 1,
            background: "rgba(245, 158, 11, 0.1)",
            border: "3px solid #F59E0B",
            borderRadius: "16px",
            padding: "22px 26px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#F59E0B",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "26px" }}>⚙️</span>
            核心技术特性
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {techFeatures.map((feature, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "20px", lineHeight: 1 }}>
                  {feature.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: textColor,
                      marginBottom: "3px",
                    }}
                  >
                    {feature.title}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：系统架构流程 */}
        <div
          style={{
            flex: 1,
            background: "rgba(59, 130, 246, 0.1)",
            border: "3px solid #3B82F6",
            borderRadius: "16px",
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#3B82F6",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "26px" }}>🏗️</span>
            系统架构流程
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {[
              { label: "Nodes", icon: "🌐", color: "#34D399" },
              { label: "Agent", icon: "🤖", color: "#3B82F6" },
              { label: "智能决策", icon: "🧠", color: "#A78BFA" },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    flex: 1,
                    background: `${step.color}20`,
                    border: `2px solid ${step.color}`,
                    borderRadius: "12px",
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "6px" }}>
                    {step.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: step.color,
                    }}
                  >
                    {step.label}
                  </div>
                </div>
                {i < 2 && (
                  <div
                    style={{
                      fontSize: "24px",
                      color: "#3B82F6",
                      fontWeight: 700,
                    }}
                  >
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div
            style={{
              marginTop: "14px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Nodes 负责执行，Agent 负责决策，协同实现智能化
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 场景 7: Memory 记忆系统
// ============================================

const MemoryScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const memoryTypes = [
    {
      title: "短期记忆",
      icon: "💭",
      desc: "当前对话上下文",
      color: "#3B82F6",
    },
    {
      title: "长期记忆",
      icon: "🗄️",
      desc: "持久化存储，Memory.md",
      color: "#10B981",
    },
    {
      title: "向量存储",
      icon: "🔍",
      desc: "语义搜索（Vector Memory / RAG）",
      color: "#F59E0B",
    },
    {
      title: "知识图谱",
      icon: "🕸️",
      desc: "关系网络",
      color: "#8B5CF6",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 16px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "70px",
        }}
      >
        {(() => {
          const title = "Memory: 记忆系统";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 60px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "40px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "短期记忆", color: "#3B82F6", bold: true },
            { text: "、", color: textColor },
            { text: "长期记忆", color: "#10B981", bold: true },
            { text: "、", color: textColor },
            { text: "向量存储", color: "#A78BFA", bold: true },
            { text: "，让", color: textColor },
            { text: "Agent", color: "#F59E0B", bold: true },
            { text: "拥有", color: textColor },
            { text: "持久化能力", color: "#EC4899", bold: true },
          ];

          const typeStartFrame = 18;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      {/* 记忆类型 */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1400px",
          marginBottom: "50px",
        }}
      >
        {memoryTypes.map((memory, index) => (
          <div
            key={index}
            style={{
              opacity: spring({ frame: frame - 20 - index * 10, fps: 30 }),
              transform: `scale(${spring({ frame: frame - 20 - index * 10, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: "260px",
                padding: "28px",
                background: `${memory.color}22`,
                border: `3px solid ${memory.color}`,
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: `0 8px 32px ${memory.color}44`,
              }}
            >
              <div style={{ fontSize: "56px", marginBottom: "18px" }}>
                {memory.icon}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: memory.color,
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {memory.title}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {memory.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 连接线 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "900px",
          marginBottom: "50px",
          opacity: spring({ frame: frame - 60, fps: 30 }),
        }}
      >
        <svg
          style={{
            width: "100%",
            height: "60px",
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2].map((index) => {
            const progress = interpolate(
              frame - 70 - index * 5,
              [0, 30],
              [0, 1],
              { extrapolateRight: "clamp" },
            );
            const segmentWidth = 250;
            const startX = 130 + index * (segmentWidth + 40);
            const endX = startX + segmentWidth * progress;

            return (
              <line
                key={index}
                x1={startX}
                y1={30}
                x2={endX}
                y2={30}
                stroke={accentColor}
                strokeWidth="3"
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>
      </div>

      {/* 底部环形流程图 */}
      <div
        style={{
          opacity: spring({ frame: frame - 90, fps: 30 }),
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: textColor,
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          🧠 记忆系统工作流程
        </div>

        {/* 环形流程 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "650px",
          }}
        >
          {(() => {
            const flowSteps = [
              {
                step: 1,
                title: "用户提问",
                icon: "❓",
                color: "#3B82F6",
                desc: "接收用户输入",
              },
              {
                step: 2,
                title: "检查短期",
                icon: "💭",
                color: "#10B981",
                desc: "当前上下文",
              },
              {
                step: 3,
                title: "查询长期",
                icon: "🗄️",
                color: "#F59E0B",
                desc: "memory.md",
              },
              {
                step: 4,
                title: "向量搜索",
                icon: "🔍",
                color: "#8B5CF6",
                desc: "相关知识",
              },
              {
                step: 5,
                title: "知识图谱",
                icon: "🕸️",
                color: "#EC4899",
                desc: "结构关系",
              },
              {
                step: 6,
                title: "组合推理",
                icon: "🧩",
                color: "#EF4444",
                desc: "信息整合",
              },
              {
                step: 7,
                title: "生成结果",
                icon: "✨",
                color: "#14B8A6",
                desc: "输出回答",
              },
              {
                step: 8,
                title: "更新记忆",
                icon: "💾",
                color: "#6366F1",
                desc: "持久化存储",
              },
            ];

            const centerX = 500;
            const centerY = 325;
            const radius = 220;

            return (
              <>
                {/* SVG 连接线 */}
                <svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <defs>
                    <linearGradient
                      id="flowGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: accentColor,
                          stopOpacity: 0.3,
                        }}
                      />
                      <stop
                        offset="50%"
                        style={{
                          stopColor: accentColor,
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: accentColor,
                          stopOpacity: 0.3,
                        }}
                      />
                    </linearGradient>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 5, 0 10"
                        fill={accentColor}
                        opacity={0.8}
                      />
                    </marker>
                  </defs>

                  {flowSteps.map((step, index) => {
                    const currentAngle = (index * 45 - 90) * (Math.PI / 180);
                    const nextAngle = ((index + 1) * 45 - 90) * (Math.PI / 180);

                    const x1 = centerX + Math.cos(currentAngle) * radius;
                    const y1 = centerY + Math.sin(currentAngle) * radius;
                    const x2 = centerX + Math.cos(nextAngle) * radius;
                    const y2 = centerY + Math.sin(nextAngle) * radius;

                    // 计算控制点，使线条弯曲
                    const controlRadius = radius * 1.3;
                    const cpX = centerX + Math.cos(currentAngle + 45 * (Math.PI / 180) / 2) * controlRadius;
                    const cpY = centerY + Math.sin(currentAngle + 45 * (Math.PI / 180) / 2) * controlRadius;

                    const progress = interpolate(frame - 100 - index * 5, [0, 40], [0, 1], {
                      extrapolateRight: "clamp",
                    });

                    // 计算当前进度下的点位置
                    const t = progress;
                    const invT = 1 - t;
                    const currentX = invT * invT * x1 + 2 * invT * t * cpX + t * t * x2;
                    const currentY = invT * invT * y1 + 2 * invT * t * cpY + t * t * y2;

                    const opacity = spring({
                      frame: frame - 100 - index * 5,
                      fps: 30,
                    });

                    return (
                      <g key={index}>
                        {/* 弯曲连接线 */}
                        <path
                          d={`M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`}
                          stroke="url(#flowGradient)"
                          strokeWidth="2"
                          fill="none"
                          opacity={opacity * 0.4}
                          strokeDasharray="8,4"
                        />

                        {/* 流动动画 */}
                        <circle
                          r="4"
                          fill={step.color}
                          opacity={opacity}
                        >
                          <animateMotion
                            dur={`${3 + index * 0.5}s`}
                            repeatCount="indefinite"
                            path={`M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`}
                          />
                        </circle>

                        {/* 箭头 */}
                        <line
                          x1={x2}
                          y1={y2}
                          x2={x2 - 10}
                          y2={y2 - 10}
                          stroke={accentColor}
                          strokeWidth="2"
                          opacity={opacity * 0.6}
                          markerEnd="url(#arrowhead)"
                          transform={`rotate(${45 + index * 45}, ${x2}, ${y2})`}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* 节点 */}
                {flowSteps.map((step, index) => {
                  const angle = (index * 45 - 90) * (Math.PI / 180);
                  const x = centerX + Math.cos(angle) * radius;
                  const y = centerY + Math.sin(angle) * radius;

                  return (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        transform: "translate(-50%, -50%)",
                        opacity: spring({
                          frame: frame - 100 - index * 3,
                          fps: 30,
                        }),
                        transformOrigin: "center center",
                      }}
                    >
                      <div
                        style={{
                          width: "130px",
                          background: `${step.color}20`,
                          border: `3px solid ${step.color}`,
                          borderRadius: "16px",
                          padding: "12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          boxShadow: `0 8px 24px ${step.color}40`,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-12px",
                            background: step.color,
                            color: "white",
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: 800,
                            boxShadow: `0 4px 12px ${step.color}60`,
                          }}
                        >
                          {step.step}
                        </div>
                        <div style={{ fontSize: "36px", marginBottom: "6px" }}>
                          {step.icon}
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: step.color,
                            marginBottom: "3px",
                            textAlign: "center",
                          }}
                        >
                          {step.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.65)",
                            textAlign: "center",
                          }}
                        >
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 中心标题 */}
                <div
                  style={{
                    position: "absolute",
                    left: centerX,
                    top: centerY,
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    opacity: spring({ frame: frame - 90, fps: 30 }),
                  }}
                >
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "8px",
                      filter: "drop-shadow(0 0 20px rgba(167, 139, 250, 0.6))",
                    }}
                  >
                    🔄
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: textColor,
                      marginBottom: "4px",
                    }}
                  >
                    循环增强
                  </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                    每次交互都会优化记忆
                      </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

// ============================================
// 场景 8: Heartbeat 健康检查
// ============================================

const HeartbeatScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const heartbeatScale = interpolate(frame % 60, [0, 30], [1, 1.1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 16px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "70px",
        }}
      >
        {(() => {
          const title = "Heartbeat: 健康检查";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 80px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "40px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "实时监控", color: "#F472B6", bold: true },
            { text: "、", color: textColor },
            { text: "故障告警", color: "#EF4444", bold: true },
            { text: "、", color: textColor },
            { text: "自动恢复", color: "#10B981", bold: true },
            { text: "，确保服务", color: textColor },
            { text: "稳定运行", color: "#3B82F6", bold: true },
          ];

          const typeStartFrame = 20;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
        {/* 心跳动画 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div
            style={{
              fontSize: "120px",
              transform: `scale(${heartbeatScale})`,
              opacity: spring({ frame: frame - 20, fps: 30 }),
              filter: "drop-shadow(0 8px 32px rgba(244, 114, 182, 0.6))",
            }}
          >
            💓
          </div>

          {/* 状态指标 */}
          <div
            style={{
              width: "100%",
              opacity: spring({ frame: frame - 40, fps: 30 }),
            }}
          >
            {[
              { label: "系统运行时间", value: "99.9%", color: "#10B981" },
              { label: "节点健康度", value: "100%", color: "#3B82F6" },
              { label: "响应时间", value: "< 100ms", color: "#F59E0B" },
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  opacity: spring({ frame: frame - 50 - index * 10, fps: 30 }),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "18px", color: textColor }}>
                    {metric.label}
                  </span>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: metric.color,
                    }}
                  >
                    {metric.value}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: index === 2 ? "90%" : "100%",
                      height: "100%",
                      background: metric.color,
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部特性 */}
      <div
        style={{
          marginTop: "60px",
          display: "flex",
          gap: "24px",
          opacity: spring({ frame: frame - 100, fps: 30 }),
        }}
      >
        {["自动告警", "故障恢复", "性能监控", "日志记录"].map((feature) => (
          <div
            key={feature}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "18px",
              color: textColor,
              fontWeight: 600,
            }}
          >
            ✓ {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 场景 9: Cron 定时任务
// ============================================

const CronScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const cronExamples = [
    { time: "0 9 * * 1-5", desc: "工作日早上9点", icon: "🌅" },
    { time: "0 */6 * * *", desc: "每6小时", icon: "⏰" },
    { time: "0 0 * * 0", desc: "每周日午夜", icon: "📅" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 16px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "70px",
        }}
      >
        {(() => {
          const title = "Cron: 定时任务";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>
      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 60px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "40px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "Cron", color: "#A78BFA", bold: true },
            { text: "表达式配置，", color: textColor },
            { text: "定时触发", color: "#10B981", bold: true },
            { text: "，让", color: textColor },
            { text: "Agent", color: "#F59E0B", bold: true },
            { text: "主动工作", color: "#3B82F6", bold: true },
          ];

          const typeStartFrame = 16;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      <div style={{ width: "100%", maxWidth: "1000px" }}>
        {/* Cron 表达式示例 */}
        <div style={{ marginBottom: "60px" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: textColor,
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Cron 表达式示例
          </div>
          {cronExamples.map((example, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                opacity: spring({ frame: frame - 20 - index * 10, fps: 30 }),
                transform: `translateX(${interpolate(frame - 20 - index * 10, [-50, 0], [50, 0], { extrapolateRight: "clamp" })}px)`,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <span style={{ fontSize: "40px" }}>{example.icon}</span>
                <code
                  style={{
                    flex: 1,
                    fontSize: "20px",
                    color: "#A78BFA",
                    fontFamily: "monospace",
                    fontWeight: 600,
                  }}
                >
                  {example.time}
                </code>
                <span
                  style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)" }}
                >
                  {example.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 使用场景 */}
        <div
          style={{
            opacity: spring({ frame: frame - 60, fps: 30 }),
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: textColor,
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            典型使用场景
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {[
              { icon: "📊", title: "数据报表", desc: "每日自动生成" },
              { icon: "🔔", title: "提醒通知", desc: "定时发送" },
              { icon: "🧹", title: "系统清理", desc: "定期维护" },
              { icon: "🔄", title: "数据同步", desc: "自动更新" },
            ].map((scenario, index) => (
              <div
                key={index}
                style={{
                  background: `${accentColor}11`,
                  border: `2px solid ${accentColor}`,
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <span style={{ fontSize: "36px" }}>{scenario.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: textColor,
                      marginBottom: "4px",
                    }}
                  >
                    {scenario.title}
                  </div>
                  <div
                    style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
                  >
                    {scenario.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 场景 10: 总结
// ============================================

const SummaryScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const modules = [
    { name: "Gateway", icon: "🚪", desc: "网关核心" },
    { name: "Agent", icon: "🤖", desc: "智能代理" },
    { name: "Skills", icon: "💼", desc: "技能工具" },
    { name: "Channels", icon: "📡", desc: "消息渠道" },
    { name: "Nodes", icon: "🌐", desc: "分布式节点" },
    { name: "Memory", icon: "🧠", desc: "记忆系统" },
    { name: "Heartbeat", icon: "💓", desc: "健康检查" },
    { name: "Cron", icon: "⏰", desc: "定时任务" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 40px 0",
          opacity: titleOpacity,
          textAlign: "center",
          minHeight: "80px",
        }}
      >
        {(() => {
          const title = "OpenClaw 完整架构";
          const typeStartFrame = 5;
          const durationPerChar = 3;
          const charsToShow = Math.max(
            0,
            Math.min(
              title.length,
              Math.floor((frame - typeStartFrame) / durationPerChar),
            ),
          );
          return title.substring(0, charsToShow);
        })()}
      </h1>

      <h3
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 80px 0",
          opacity: spring({ frame: frame - 20, fps: 30 }),
          textAlign: "center",
          lineHeight: 1.6,
          minHeight: "48px",
        }}
      >
        {/* 打字机效果 */}
        {(() => {
          const parts = [
            { text: "Gateway", color: "#FF4444", bold: true },
            { text: "、", color: textColor },
            { text: "Agent", color: "#3B82F6", bold: true },
            { text: "、", color: textColor },
            { text: "Skills", color: "#F59E0B", bold: true },
            { text: "等", color: textColor },
            { text: "八大模块", color: "#A78BFA", bold: true },
            { text: "协同工作，打造", color: textColor },
            { text: "强大的", color: "#10B981", bold: true },
            { text: "AI 助理系统", color: "#F472B6", bold: true },
          ];

          const typeStartFrame = 20;
          const durationPerChar = 2;

          const result = [];
          let totalChars = 0;

          for (const part of parts) {
            const partEnd = totalChars + part.text.length;
            const charsToShow = Math.max(
              0,
              Math.min(
                part.text.length,
                Math.floor((frame - typeStartFrame) / durationPerChar) -
                  totalChars,
              ),
            );

            if (charsToShow > 0) {
              result.push(
                <span
                  key={totalChars}
                  style={{
                    color: part.color,
                    fontWeight: part.bold ? 700 : 400,
                  }}
                >
                  {part.text.substring(0, charsToShow)}
                </span>,
              );
            }

            totalChars = partEnd;
            if (
              Math.floor((frame - typeStartFrame) / durationPerChar) <=
              totalChars
            ) {
              break;
            }
          }

          return result.length > 0 ? result : <span>&nbsp;</span>;
        })()}
      </h3>

      {/* 模块网格 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "30px",
          width: "100%",
          maxWidth: "1200px",
          marginBottom: "80px",
        }}
      >
        {modules.map((module, index) => (
          <div
            key={index}
            style={{
              opacity: spring({ frame: frame - 40 - index * 8, fps: 30 }),
              transform: `scale(${spring({ frame: frame - 40 - index * 8, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                background: `${accentColor}22`,
                border: `3px solid ${accentColor}`,
                borderRadius: "16px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "180px",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>
                {module.icon}
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: accentColor,
                  marginBottom: "8px",
                }}
              >
                {module.name}
              </div>
              <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>
                {module.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部号召 */}
      <div
        style={{
          opacity: spring({ frame: frame - 120, fps: 30 }),
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: textColor,
            marginBottom: "24px",
          }}
        >
          🚀 开始构建你的 AI 助理
        </div>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
          {[
            { text: "📚 查看文档", color: "#3B82F6" },
            { text: "💻 GitHub", color: "#10B981" },
            { text: "💬 加入社区", color: "#F59E0B" },
          ].map((btn) => (
            <div
              key={btn.text}
              style={{
                background: `${btn.color}22`,
                border: `3px solid ${btn.color}`,
                borderRadius: "16px",
                padding: "16px 32px",
                fontSize: "20px",
                fontWeight: 700,
                color: btn.color,
              }}
            >
              {btn.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// 主组件
// ============================================

export const OpenClawArchitecture: React.FC<
  z.infer<typeof openClawArchitectureSchema>
> = ({
  backgroundColor,
  cardBg, // eslint-disable-line @typescript-eslint/no-unused-vars
  accentColor,
  textColor,
  secondaryTextColor, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const frame = useCurrentFrame();
  const SCENE_DURATION = 300; // 10 seconds per scene

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      {/* Scene 1: 整体架构概览 */}
      <Sequence durationInFrames={SCENE_DURATION}>
        <OverallArchitectureScene
          frame={frame}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 2: Gateway 网关核心 */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <GatewayScene
          frame={frame - SCENE_DURATION}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 3: Agent 智能代理 */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <AgentScene
          frame={frame - SCENE_DURATION * 2}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 4: Skills 技能系统 */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SkillsScene
          frame={frame - SCENE_DURATION * 3}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 5: Channels 渠道层 */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <ChannelsScene
          frame={frame - SCENE_DURATION * 4}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 6: Nodes 节点系统 */}
      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION}>
        <NodesScene
          frame={frame - SCENE_DURATION * 5}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 7: Memory 记忆系统 */}
      <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION}>
        <MemoryScene
          frame={frame - SCENE_DURATION * 6}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 8: Heartbeat 健康检查 */}
      <Sequence from={SCENE_DURATION * 7} durationInFrames={SCENE_DURATION}>
        <HeartbeatScene
          frame={frame - SCENE_DURATION * 7}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 9: Cron 定时任务 */}
      <Sequence from={SCENE_DURATION * 8} durationInFrames={SCENE_DURATION}>
        <CronScene
          frame={frame - SCENE_DURATION * 8}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 10: 总结 */}
      <Sequence from={SCENE_DURATION * 9} durationInFrames={SCENE_DURATION}>
        <SummaryScene
          frame={frame - SCENE_DURATION * 9}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
