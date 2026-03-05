import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  staticFile,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { IntroConceptScene } from "./OpenClawArchitecture";

export const openClawSchema = z.object({
  backgroundColor: zColor(),
  cardBg: zColor(),
  accentColor: zColor(),
  textColor: zColor(),
  secondaryTextColor: zColor(),
});

const sceneBackground = {
  background:
    "radial-gradient(circle at 50% 20%, rgba(255, 90, 54, 0.14) 0%, rgba(15, 15, 26, 0.1) 45%, rgba(15, 15, 26, 0.95) 100%), radial-gradient(circle, #2c2c2c 1px, transparent 1px)",
  backgroundSize: "100% 100%, 30px 30px",
} as const;

const SceneShell: React.FC<{ children: React.ReactNode; padding?: string }> = ({
  children,
  padding = "0 100px",
}) => {
  return (
    <div
      style={{
        ...sceneBackground,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding,
      }}
    >
      {children}
    </div>
  );
};

const SceneTitle: React.FC<{
  title: string;
  subtitle: string;
  accentColor: string;
  textColor: string;
}> = ({ title, subtitle, accentColor, textColor }) => {
  return (
    <>
      <h2
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 18px 0",
          textAlign: "center",
          textShadow: `0 0 30px ${accentColor}44`,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "24px",
          color: textColor,
          margin: "0 0 52px 0",
          textAlign: "center",
          opacity: 0.78,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>
    </>
  );
};

// 特性卡片组件
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  color: string;
  frame: number;
  delay: number;
  cardBg: string;
  textColor: string;
}> = ({ icon, title, description, color, frame, delay, cardBg, textColor }) => {
  const cardOpacity = spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 20, stiffness: 100 },
  });

  const cardTranslateY = interpolate(frame - delay, [0, 30], [50, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translateY(${cardTranslateY}px)`,
        background: `linear-gradient(145deg, ${cardBg}EE 0%, rgba(22, 22, 36, 0.95) 100%)`,
        borderRadius: "20px",
        padding: "32px",
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.35), 0 0 30px ${color}22`,
        border: `1px solid ${color}55`,
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          minWidth: "60px",
          textAlign: "center",
          filter: `drop-shadow(0 4px 12px ${color}55)`,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color,
            margin: "0 0 12px 0",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "18px",
            color: textColor,
            margin: 0,
            lineHeight: 1.6,
            opacity: 0.8,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// 步骤指示器
const StepIndicator: React.FC<{
  step: number;
  total: number;
  accentColor: string;
}> = ({ step, total, accentColor }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "36px",
        alignItems: "center",
        padding: "12px 18px",
        borderRadius: "999px",
        border: `1px solid ${accentColor}55`,
        background: "rgba(15, 15, 26, 0.65)",
        boxShadow: `0 0 24px ${accentColor}22`,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === step - 1 ? "48px" : "16px",
            height: "16px",
            borderRadius: "8px",
            backgroundColor: i < step ? accentColor : `${accentColor}33`,
            boxShadow: i < step ? `0 0 10px ${accentColor}66` : "none",
          }}
        />
      ))}
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: accentColor,
          marginLeft: "12px",
        }}
      >
        {step}/{total}
      </div>
    </div>
  );
};

// macOS 终端窗口标题栏
const TerminalHeader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#FF5F57",
        }}
      />
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#FEBC2E",
        }}
      />
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#28C840",
        }}
      />
    </div>
  );
};

// 终端命令组件
const TerminalCommand: React.FC<{
  command: string;
  output?: string;
  frame: number;
  delay: number;
  accentColor: string;
  textColor: string;
  outputTypewriter?: boolean;
  outputCharsPerFrame?: number;
  commandCharsPerFrame?: number;
  outputFontSize?: number;
  outputLineHeight?: number;
  outputPadding?: string;
}> = ({
  command,
  output,
  frame,
  delay,
  accentColor,
  textColor,
  outputTypewriter = false,
  outputCharsPerFrame = 2.8,
  commandCharsPerFrame = 0.5,
  outputFontSize = 19,
  outputLineHeight = 1.6,
  outputPadding = "18px 24px",
}) => {
  const cmdOpacity = spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 20, stiffness: 100 },
  });

  const cmdCharCount = Math.min(
    Math.floor((frame - delay) * commandCharsPerFrame),
    command.length,
  );

  const outputOpacity = output
    ? interpolate(frame - delay - command.length * 2 - 30, [0, 30], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;

  const outputRevealStart = delay + command.length * 2 + 30;
  const outputTypedLength =
    output && outputTypewriter
      ? Math.max(
          0,
          Math.min(
            output.length,
            Math.floor((frame - outputRevealStart) * outputCharsPerFrame),
          ),
        )
      : (output?.length ?? 0);
  const outputText =
    output && outputTypewriter ? output.slice(0, outputTypedLength) : output;

  return (
    <div style={{ opacity: cmdOpacity, marginBottom: "20px" }}>
      <div
        style={{
          background: "rgba(18, 18, 30, 0.92)",
          borderRadius: "14px",
          padding: "24px 28px",
          fontFamily:
            "'SF Mono', 'Monaco', 'Inconsolata', 'Menlo', 'Consolas', monospace",
          fontSize: "22px",
          border: `1px solid ${accentColor}44`,
          boxShadow: `0 10px 35px rgba(0, 0, 0, 0.45), 0 0 24px ${accentColor}1F, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
        }}
      >
        <TerminalHeader />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <span
            style={{
              color: accentColor,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            ➜
          </span>
          <span
            style={{
              color: textColor,
              flex: 1,
            }}
          >
            {command.slice(0, cmdCharCount)}
            {cmdCharCount < command.length && (
              <span style={{ opacity: frame % 10 < 5 ? 1 : 0 }}>▋</span>
            )}
          </span>
        </div>
      </div>
      {output && outputOpacity > 0 && (
        <div
          style={{
            marginTop: "12px",
            padding: outputPadding,
            fontFamily:
              "'SF Mono', 'Monaco', 'Inconsolata', 'Menlo', 'Consolas', monospace",
            fontSize: `${outputFontSize}px`,
            color: textColor,
            opacity: outputOpacity * 0.85,
            whiteSpace: "pre-wrap",
            lineHeight: outputLineHeight,
            background: "rgba(20, 20, 34, 0.88)",
            borderRadius: "10px",
            border: `1px solid ${accentColor}2A`,
          }}
        >
          {outputText}
          {outputTypewriter && outputText.length < (output?.length ?? 0) ? (
            <span style={{ opacity: frame % 10 < 5 ? 1 : 0 }}>▋</span>
          ) : null}
        </div>
      )}
    </div>
  );
};

// 场景 2: OpenClaw 解决了什么问题
const WhatProblemsOpenClawSolvesScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
  cardBg: string;
}> = ({ frame, accentColor, textColor, cardBg }) => {
  const subtitlePrefix = "大模型越来越强，但";
  const subtitleTyped = "“无法自动干活”";
  const subtitleRevealProgress = interpolate(frame, [12, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showCursor = frame % 12 < 6;

  const pulse = 0.82 + Math.sin(frame / 12) * 0.18;
  const leftFloat = Math.sin(frame / 20) * 4;
  const rightFloat = Math.sin(frame / 22 + 1.3) * 4;

  const leftOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 20, stiffness: 120 },
  });

  const rightOpacity = spring({
    frame: frame - 10,
    fps: 30,
    config: { damping: 20, stiffness: 120 },
  });

  const bottomOpacity = spring({
    frame: frame - 24,
    fps: 30,
    config: { damping: 18, stiffness: 100 },
  });

  const sweepX = interpolate(frame % 90, [0, 89], [-40, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <h2
        style={{
          fontSize: "60px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 14px 0",
          textAlign: "center",
          textShadow: `0 0 30px ${accentColor}44`,
        }}
      >
        OpenClaw解决了什么问题？
      </h2>
      <p
        style={{
          fontSize: "30px",
          margin: "0 0 42px 0",
          textAlign: "center",
          lineHeight: 1.5,
          fontWeight: 600,
          color: "#D9D9EE",
        }}
      >
        {subtitlePrefix}
        <span
          style={{
            marginLeft: "8px",
            color: "#FFC06A",
            textShadow: "0 0 16px rgba(255, 192, 106, 0.45)",
            display: "inline-block",
            position: "relative",
            paddingRight: "12px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              clipPath: `inset(0 ${100 - subtitleRevealProgress * 100}% 0 0)`,
            }}
          >
            {subtitleTyped}
          </span>
          {showCursor ? (
            <span
              style={{
                color: accentColor,
                position: "absolute",
                left: `${subtitleRevealProgress * 100}%`,
                top: 0,
                transform: "translateX(2px)",
              }}
            >
              ▋
            </span>
          ) : null}
        </span>
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "26px",
        }}
      >
        <div
          style={{
            opacity: leftOpacity,
            transform: `translateY(${interpolate(frame, [0, 24], [28, 0], {
              extrapolateRight: "clamp",
            }) + leftFloat}px)`,
            borderRadius: "24px",
            border: "2px solid rgba(255, 138, 101, 0.45)",
            background: `linear-gradient(160deg, ${cardBg}EE 0%, rgba(25, 20, 24, 0.96) 100%)`,
            boxShadow: `0 10px 34px rgba(0, 0, 0, 0.35), 0 0 ${24 + pulse * 10}px rgba(255, 138, 101, 0.16)`,
            padding: "30px",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "#FFB4A2",
              marginBottom: "14px",
            }}
          >
            普通 ChatGPT / Claude / 豆包 限制
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              color: textColor,
              fontSize: "24px",
              lineHeight: 1.45,
            }}
          >
            {[
              "不能持续运行",
              "没有长期记忆",
              "不能主动执行系统命令",
              "你问一句，它答一句。",
              "你关掉对话，它就没了",
            ].map((item, index) => {
              const itemOpacity = spring({
                frame: frame - 8 - index * 4,
                fps: 30,
                config: { damping: 18, stiffness: 110 },
              });
              return (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    opacity: itemOpacity,
                    transform: `translateX(${interpolate(
                      itemOpacity,
                      [0, 1],
                      [28, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    )}px)`,
                  }}
                >
                  <span style={{ color: "#FF8A65" }}>•</span>
                  <span
                    style={{
                      color:
                        item.includes("持续运行") ||
                        item.includes("长期记忆") ||
                        item.includes("执行系统命令")
                          ? "#FFD3C4"
                          : textColor,
                    }}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            opacity: rightOpacity,
            transform: `translateY(${interpolate(frame - 10, [0, 24], [28, 0], {
              extrapolateRight: "clamp",
            }) + rightFloat}px)`,
            borderRadius: "24px",
            border: `2px solid ${accentColor}66`,
            background:
              "linear-gradient(160deg, rgba(35, 28, 26, 0.95) 0%, rgba(18, 18, 30, 0.98) 100%)",
            boxShadow: `0 10px 34px rgba(0, 0, 0, 0.35), 0 0 ${30 + pulse * 12}px ${accentColor}33`,
            padding: "30px",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              fontWeight: 800,
              color: accentColor,
              marginBottom: "8px",
            }}
          >
            OpenClaw
          </div>
          <div
            style={{
              fontSize: "22px",
              color: textColor,
              opacity: 0.86,
              marginBottom: "14px",
            }}
          >
            更像是你养的一台 AI 机器人
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 14px",
              fontSize: "22px",
              color: textColor,
              lineHeight: 1.4,
            }}
          >
            {[
              "一直在线",
              "定时工作",
              "自己巡逻",
              "同时控制多台电脑",
              "根据记忆调整行为",
              "空闲时自我优化",
            ].map((item, index) => {
              const itemOpacity = spring({
                frame: frame - 14 - index * 3,
                fps: 30,
                config: { damping: 18, stiffness: 110 },
              });
              return (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: "8px",
                    opacity: itemOpacity,
                    transform: `translateY(${interpolate(
                      itemOpacity,
                      [0, 1],
                      [16, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    )}px)`,
                  }}
                >
                  <span style={{ color: accentColor }}>✓</span>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          opacity: bottomOpacity,
          transform: `translateY(${interpolate(frame - 24, [0, 20], [18, 0], {
            extrapolateRight: "clamp",
          })}px)`,
          width: "100%",
          maxWidth: "1500px",
          borderRadius: "16px",
          border: `1px solid ${accentColor}66`,
          background: "rgba(20, 20, 30, 0.82)",
          padding: "20px 26px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          fontSize: "28px",
          color: textColor,
          lineHeight: 1.45,
          boxShadow: `0 0 26px ${accentColor}22`,
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          解决
          <span style={{ color: "#FFCB7A", fontWeight: 800 }}>
            “AI 不能持续运行”
          </span>
          、
          <span style={{ color: accentColor, fontWeight: 800 }}>
            “不能跨系统协作”
          </span>
          、
          <span style={{ color: "#9FDBFF", fontWeight: 800 }}>
            “不能调度任务”
          </span>
          的问题
        </div>
        <div
          style={{
            position: "absolute",
            left: `${sweepX}%`,
            top: 0,
            width: "24%",
            height: "100%",
            transform: "skewX(-18deg)",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            zIndex: 1,
          }}
        />
      </div>
    </SceneShell>
  );
};

// 场景 3: OpenClaw 能做什么（案例占位）
const WhatCanOpenClawDoScene: React.FC<{
  frame: number;
  accentColor: string;
  cardBg: string;
  textColor: string;
}> = ({ frame, accentColor, cardBg, textColor }) => {
  const cards = [
    {
      title: "我的案例",
      subtitle: "这里展示你的真实业务落地案例",
      color: "#10B981",
      delay: 0,
    },
    {
      title: "社区案例",
      subtitle: "社区里优秀的 OpenClaw 实践",
      color: "#3B82F6",
      delay: 12,
    },
  ];

  return (
    <SceneShell>
      <SceneTitle
        title="openclaw能做什么"
        subtitle="真实落地案例与社区实践"
        accentColor={accentColor}
        textColor={textColor}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1460px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "28px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              opacity: spring({
                frame: frame - card.delay,
                fps: 30,
                config: { damping: 20, stiffness: 100 },
              }),
              transform: `translateY(${interpolate(
                frame - card.delay,
                [0, 24],
                [24, 0],
                { extrapolateRight: "clamp" },
              )}px)`,
              minHeight: "420px",
              borderRadius: "24px",
              border: `2px solid ${card.color}66`,
              background: `linear-gradient(145deg, ${cardBg}EE 0%, rgba(17, 18, 30, 0.96) 100%)`,
              boxShadow: `0 12px 36px rgba(0, 0, 0, 0.35), 0 0 34px ${card.color}22`,
              display: "flex",
              flexDirection: "column",
              padding: "30px",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: card.color,
                marginBottom: "10px",
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontSize: "20px",
                color: textColor,
                opacity: 0.82,
                marginBottom: "28px",
                lineHeight: 1.5,
              }}
            >
              {card.subtitle}
            </div>

            {card.title === "我的案例" ? (
              <div
                style={{
                  flex: 1,
                  borderRadius: "18px",
                  border: `2px solid ${card.color}66`,
                  background: `linear-gradient(180deg, ${card.color}14 0%, rgba(255,255,255,0.02) 100%)`,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(20, 26, 38, 0.72)",
                    padding: "14px 14px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#86EFAC",
                      marginBottom: "6px",
                      letterSpacing: "0.4px",
                    }}
                  >
                    CASE 01
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: textColor,
                      marginBottom: "6px",
                    }}
                  >
                    系统瘦身助手
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.45,
                      color: "rgba(224,224,224,0.82)",
                    }}
                  >
                    每天定时自动分类整理散乱脏文件，并执行磁盘清理。
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(20, 26, 38, 0.72)",
                    padding: "14px 14px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#93C5FD",
                      marginBottom: "6px",
                      letterSpacing: "0.4px",
                    }}
                  >
                    CASE 02
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: textColor,
                      marginBottom: "6px",
                    }}
                  >
                    热点内容自动发布
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.45,
                      color: "rgba(224,224,224,0.82)",
                    }}
                  >
                    每天定时抓取openclaw社区热点，AI 润色并结合本地 ComfyUI
                    出图，自动发布到社区。
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(20, 26, 38, 0.72)",
                    padding: "14px 14px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#FCD34D",
                      marginBottom: "6px",
                      letterSpacing: "0.4px",
                    }}
                  >
                    CASE 03
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: textColor,
                      marginBottom: "6px",
                    }}
                  >
                    每日 7 点热点推送
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.45,
                      color: "rgba(224,224,224,0.82)",
                    }}
                  >
                    每天 7 点定时推送国内外热点科技新闻。
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  borderRadius: "18px",
                  border: `2px solid ${card.color}66`,
                  background: `linear-gradient(180deg, ${card.color}14 0%, rgba(255,255,255,0.02) 100%)`,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  {
                    id: "CASE A",
                    title: "多渠道 AI 客服",
                    desc: "统一 WhatsApp / Instagram / Email / Google Reviews，7x24 自动回复。",
                  },
                  {
                    id: "CASE B",
                    title: "电话语音个人助理",
                    desc: "通过电话/SMS 访问 OpenClaw，免手动操作完成日常事务。",
                  },
                  {
                    id: "CASE C",
                    title: "会议纪要自动执行",
                    desc: "把会议转录整理成 Action Items，并自动同步 Jira/Linear/Todoist。",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(20, 26, 38, 0.72)",
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#93C5FD",
                        marginBottom: "5px",
                        letterSpacing: "0.4px",
                      }}
                    >
                      {item.id}
                    </div>
                    <div
                      style={{
                        fontSize: "23px",
                        fontWeight: 800,
                        color: textColor,
                        marginBottom: "5px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        lineHeight: 1.4,
                        color: "rgba(224,224,224,0.82)",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: "2px",
                    fontSize: "13px",
                    lineHeight: 1.35,
                    color: "rgba(224,224,224,0.58)",
                    borderTop: "1px dashed rgba(147,197,253,0.35)",
                    paddingTop: "8px",
                    wordBreak: "break-all",
                  }}
                >
                  来源:{" "}
                  <a
                    href="https://github.com/hesamsheikh/awesome-openclaw-usecases"
                    style={{
                      color: "#60A5FA",
                      textDecoration: "underline",
                    }}
                  >
                    https://github.com/hesamsheikh/awesome-openclaw-usecases
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SceneShell>
  );
};

// 场景 2: 核心特性
const FeaturesScene: React.FC<{
  frame: number;
  accentColor: string;
  cardBg: string;
  textColor: string;
}> = ({ frame, accentColor, cardBg, textColor }) => {
  const roadmap = [
    {
      icon: "①",
      title: "环境检查",
      description: "确认 Node.js 与网络环境，确保后续安装和守护进程启动稳定。",
      color: "#3B82F6",
    },
    {
      icon: "②",
      title: "CLI 安装",
      description: "安装 OpenClaw CLI 并验证命令可用，为自动化操作准备入口。",
      color: "#10B981",
    },
    {
      icon: "③",
      title: "Onboarding 配置",
      description: "一次性完成模型认证、网关参数和渠道接入配置。",
      color: "#A78BFA",
    },
    {
      icon: "④",
      title: "联调验证",
      description: "查看 Gateway 状态并发送首条消息，闭环验证系统已可用。",
      color: "#F59E0B",
    },
  ];

  return (
    <SceneShell>
      <SceneTitle
        title="15 分钟部署路线图"
        subtitle="这一段聚焦“怎么落地”，不是“有什么能力”"
        accentColor={accentColor}
        textColor={textColor}
      />

      <div
        style={{
          display: "flex",
          gap: "14px",
          marginBottom: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["准备环境", "安装工具", "完成配置", "发送验证消息"].map((label) => (
          <div
            key={label}
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              fontWeight: 700,
              color: accentColor,
              border: `1px solid ${accentColor}66`,
              borderRadius: "999px",
              background: "rgba(20, 20, 34, 0.78)",
              boxShadow: `0 0 18px ${accentColor}1E`,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        {roadmap.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            {...feature}
            frame={frame}
            delay={index * 10}
            cardBg={cardBg}
            textColor={textColor}
          />
        ))}
      </div>
    </SceneShell>
  );
};

// 场景 3: 安装步骤
const InstallScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
  step: number;
}> = ({ frame, accentColor, textColor, step }) => {
  const commandSpacing = step === 1 ? 120 : step === 2 ? 130 : 300;
  // 根据步骤返回不同的命令
  const getCommands = () => {
    if (step === 1) {
      return [
        {
          command: "node -v",
          output:
            "v20.12.2\n⚠️ 当前版本低于要求\n\nOpenClaw 官方要求: Node.js 22+\n文档: docs.openclaw.ai/install/node",
          outputTypewriter: true,
          outputCharsPerFrame: 5.2,
          commandCharsPerFrame: 1.2,
        },
        {
          command: "brew install node && node -v",
          output:
            "==> Installing node...\n==> node 22.13.1 installed\nv22.13.1 ✓\n环境满足 OpenClaw 最低要求 (Node.js 22+)",
          outputTypewriter: true,
          outputCharsPerFrame: 5.6,
          commandCharsPerFrame: 1.25,
        },
      ];
    }
    if (step === 2) {
      return [
        {
          command: "npm install -g @openclaw/cli",
          output:
            "正在检查 npm 版本...\nnpm 10.9.2 ✓\n\n正在下载 @openclaw/cli...\n\n[######################]   50.0%\n" +
            "[###########################]  75.0%\n" +
            "[######################################] 100.0%\n\n" +
            "✓ OpenClaw CLI 安装成功\n" +
            "✓ 位置: /usr/local/bin/openclaw\n" +
            "✓ 版本: 2.4.1\n" +
            "✓ 添加到 PATH 环境变量",
          outputTypewriter: true,
          outputCharsPerFrame: 4.2,
        },
        {
          command: "openclaw --version",
          output: "OpenClaw CLI v2.4.1\n安装验证通过！",
        },
      ];
    }
    if (step === 3) {
      return [
        {
          command: "openclaw onboard --install-daemon",
          output:
            "OpenClaw Onboarding Wizard\n\n" +
            "[1/6] Model & Auth\n" +
            "  Provider: Anthropic\n" +
            "  Default model: Claude Sonnet\n" +
            "  ✓ API key validated\n\n" +
            "[2/6] Workspace\n" +
            "  Path: ~/.openclaw/workspace\n" +
            "  ✓ bootstrap files created\n\n" +
            "[3/6] Gateway\n" +
            "  Port: 18789\n" +
            "  Bind: loopback\n" +
            "  Auth: Token (auto-generated)\n" +
            "  ✓ config saved\n\n" +
            "[4/6] Channels\n" +
            "  Enabled: Telegram\n" +
            "  ✓ bot token verified\n\n" +
            "[5/6] Daemon\n" +
            "  Install: launchd user service\n" +
            "  ✓ service started\n\n" +
            "[6/6] Health Check\n" +
            "  ✓ Gateway healthy\n" +
            "  ✓ Dashboard ready: http://127.0.0.1:18789/\n\n" +
            "Done. Continue with:\n" +
            "  openclaw gateway status\n" +
            "  openclaw dashboard\n",
          outputTypewriter: true,
          outputCharsPerFrame: 9,
        },
      ];
    }
    return [];
  };

  const commands = getCommands();

  return (
    <SceneShell padding="0 80px">
      <StepIndicator step={step} total={5} accentColor={accentColor} />
      <SceneTitle
        title={
          step === 1
            ? "Node.js 环境检查"
            : step === 2
              ? "安装 OpenClaw"
              : "运行配置向导"
        }
        subtitle={
          step === 1
            ? "先满足 Node.js 22+，再进入 OpenClaw 安装流程"
            : step === 2
              ? "使用官方脚本快速安装"
              : "配置认证、网关和渠道"
        }
        accentColor={accentColor}
        textColor={textColor}
      />

      <div style={{ width: "100%", maxWidth: "1600px" }}>
        {commands.map((cmd, index) => (
          <TerminalCommand
            key={index}
            {...cmd}
            frame={frame}
            delay={"delay" in cmd ? cmd.delay : index * commandSpacing}
            accentColor={accentColor}
            textColor={textColor}
            outputFontSize={step === 3 ? 15 : 19}
            outputLineHeight={step === 3 ? 1.35 : 1.6}
            outputPadding={step === 3 ? "14px 18px" : "18px 24px"}
          />
        ))}
      </div>
    </SceneShell>
  );
};

// 场景 4: Gateway 和 Dashboard
const GatewayScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const subtitleFullText = "检查网关状态并打开控制面板";
  const subtitleStartFrame = 12;
  const subtitleCharsPerFrame = 2.2;
  const subtitleCharCount = Math.max(
    0,
    Math.min(
      subtitleFullText.length,
      Math.floor((frame - subtitleStartFrame) * subtitleCharsPerFrame),
    ),
  );
  const subtitleText = subtitleFullText.slice(0, subtitleCharCount);

  const commands = [
    {
      command: "openclaw gateway status",
      output:
        "状态: 运行中 ✓\n端口: 18789\n绑定: loopback\n运行时间: 2小时34分\n活跃会话: 3",
      outputTypewriter: true,
      outputCharsPerFrame: 4.8,
      delay: 0,
    },
    {
      command: "openclaw dashboard",
      output:
        "正在打开控制面板...\n✓ 控制面板: http://127.0.0.1:18789/\n✓ 浏览器已打开\n\n现在可以与你的 AI Agent 聊天了！",
      outputTypewriter: true,
      outputCharsPerFrame: 5.2,
      delay: 130,
    },
  ];

  return (
    <SceneShell padding="0 120px">
      <StepIndicator step={4} total={5} accentColor={accentColor} />
      <SceneTitle
        title="开始使用 OpenClaw"
        subtitle={`${subtitleText}${subtitleCharCount < subtitleFullText.length && frame % 10 < 5 ? "▋" : ""}`}
        accentColor={accentColor}
        textColor={textColor}
      />

      <div style={{ width: "100%", maxWidth: "1000px" }}>
        {commands.map((cmd, index) => (
          <TerminalCommand
            key={index}
            {...cmd}
            frame={frame}
            delay={"delay" in cmd ? cmd.delay : index * 240}
            accentColor={accentColor}
            textColor={textColor}
          />
        ))}
      </div>
    </SceneShell>
  );
};

// 场景 5: 发送测试消息
const MessageScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const bubbles = [
    {
      role: "user" as const,
      text: "二等兵甘，把电脑截图发给我",
      delay: 20,
    },
    {
      role: "agent" as const,
      text: "报告长官，已经完成截图, 请长官验收",
      delay: 60,
      imageSrc: staticFile("screenshots/macos-terminal-real.png"),
    },
    {
      role: "user" as const,
      text: "这是我的个人画像，你可以快速认识我",
      delay: 108,
    },
    {
      role: "agent" as const,
      text: "报告长官，我会快速阅读你的个人画像，并为你提供服务",
      delay: 148,
    },
  ];

  return (
    <SceneShell padding="0 70px">
      <StepIndicator step={5} total={5} accentColor={accentColor} />
      <SceneTitle
        title="发送测试消息"
        subtitle="在 WebUI 聊天面板里直接对话并查看执行结果"
        accentColor={accentColor}
        textColor={textColor}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          height: "650px",
          borderRadius: "20px",
          border: `1px solid ${accentColor}44`,
          background:
            "linear-gradient(145deg, rgba(14, 17, 30, 0.96) 0%, rgba(10, 13, 24, 0.98) 100%)",
          boxShadow: `0 14px 40px rgba(0,0,0,0.45), 0 0 30px ${accentColor}22`,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "250px",
            borderRight: `1px solid ${accentColor}22`,
            background: "rgba(18, 22, 36, 0.65)",
            padding: "20px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: textColor,
              opacity: 0.9,
              fontWeight: 700,
            }}
          >
            OPENCLAW
          </div>
          {["聊天", "概览", "渠道", "实例", "会话", "日志"].map(
            (item, index) => (
              <div
                key={item}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  color: item === "聊天" ? "#fff" : "rgba(224,224,224,0.72)",
                  background:
                    item === "聊天" ? `${accentColor}30` : "transparent",
                  border:
                    item === "聊天"
                      ? `1px solid ${accentColor}66`
                      : "1px solid transparent",
                  opacity: spring({ frame: frame - index * 4, fps: 30 }),
                }}
              >
                {item}
              </div>
            ),
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: "50px",
              borderBottom: `1px solid ${accentColor}1F`,
              background: "rgba(12, 15, 25, 0.95)",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "6px", marginRight: "2px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#FF5F57",
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#FEBC2E",
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#28C840",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                height: "30px",
                borderRadius: "8px",
                border: `1px solid ${accentColor}30`,
                background: "rgba(28, 34, 50, 0.88)",
                color: "rgba(224,224,224,0.86)",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                fontFamily:
                  "'SF Mono', 'Monaco', 'Inconsolata', 'Menlo', 'Consolas', monospace",
              }}
            >
              http://127.0.0.1:18789/chat
            </div>
          </div>

          <div
            style={{
              height: "66px",
              borderBottom: `1px solid ${accentColor}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              background: "rgba(15, 18, 28, 0.82)",
            }}
          >
            <div
              style={{ fontSize: "20px", fontWeight: 700, color: textColor }}
            >
              聊天
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#86EFAC",
                border: "1px solid rgba(134,239,172,0.4)",
                borderRadius: "999px",
                padding: "6px 12px",
                background: "rgba(34,197,94,0.12)",
              }}
            >
              健康状态 正常
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {bubbles.map((bubble, index) => {
              const bubbleOpacity = spring({
                frame: frame - bubble.delay,
                fps: 30,
                config: { damping: 20, stiffness: 100 },
              });
              const xOffset =
                bubble.role === "user"
                  ? interpolate(frame - bubble.delay, [0, 20], [36, 0], {
                      extrapolateRight: "clamp",
                    })
                  : interpolate(frame - bubble.delay, [0, 20], [-36, 0], {
                      extrapolateRight: "clamp",
                    });
              const isUser = bubble.role === "user";

              return (
                <div
                  key={`${bubble.text}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    opacity: bubbleOpacity,
                    transform: `translateX(${xOffset}px)`,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "72%",
                      borderRadius: "14px",
                      padding: "14px 16px",
                      fontSize: "18px",
                      lineHeight: 1.45,
                      color: isUser ? "#FFEDE8" : textColor,
                      background: isUser
                        ? `linear-gradient(135deg, ${accentColor}4D 0%, rgba(255,90,54,0.2) 100%)`
                        : "rgba(32, 38, 58, 0.92)",
                      border: isUser
                        ? `1px solid ${accentColor}88`
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isUser
                        ? `0 0 20px ${accentColor}2A`
                        : "0 8px 24px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div>{bubble.text}</div>
                    {"imageSrc" in bubble ? (
                      <div
                        style={{
                          marginTop: "12px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(0,0,0,0.25)",
                        }}
                      >
                        <Img
                          src={bubble.imageSrc as string}
                          style={{
                            width: "56%",
                            maxWidth: "420px",
                            maxHeight: "180px",
                            objectFit: "contain",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              height: "88px",
              borderTop: `1px solid ${accentColor}22`,
              padding: "16px 20px",
              background: "rgba(15, 18, 28, 0.8)",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "12px",
                border: `1px solid ${accentColor}44`,
                background: "rgba(20, 24, 38, 0.86)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                color: "rgba(224,224,224,0.55)",
                fontSize: "16px",
              }}
            >
              <span>Message（支持多渠道对话）</span>
              <span
                style={{
                  color: "#fff",
                  background: `${accentColor}AA`,
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontWeight: 700,
                }}
              >
                Send
              </span>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// 场景 6: 结束
const OutroScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const opacity = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <SceneShell>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            marginBottom: "32px",
          }}
        >
          🚀
        </div>

        <h2
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: accentColor,
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          准备就绪！
        </h2>

        <p
          style={{
            fontSize: "28px",
            color: textColor,
            margin: "0 0 48px 0",
            textAlign: "center",
            opacity: 0.8,
            lineHeight: 1.6,
          }}
        >
          开始使用 OpenClaw 构建 AI 驱动工作流
        </p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            {
              text: "📚 文档: docs.openclaw.ai",
              url: "https://docs.openclaw.ai",
            },
            {
              text: "💻 GitHub: github.com/openclaw",
              url: "https://github.com/openclaw",
            },
            { text: "💬 社区 Discord", url: "#" },
          ].map((link) => (
            <div
              key={link.text}
              style={{
                background: "rgba(20, 20, 34, 0.75)",
                border: `1px solid ${accentColor}66`,
                borderRadius: "14px",
                padding: "16px 24px",
                fontSize: "20px",
                fontWeight: 600,
                color: accentColor,
                boxShadow: `0 0 24px ${accentColor}26`,
              }}
            >
              {link.text}
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

export const OpenClawTutorial: React.FC<z.infer<typeof openClawSchema>> = ({
  backgroundColor,
  cardBg,
  accentColor,
  textColor,
  secondaryTextColor, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      {/* Scene 1: IntroConcept from architecture (0-180 frames, 6 seconds) */}
      <Sequence durationInFrames={180}>
        <IntroConceptScene
          frame={frame}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 2: What problems does OpenClaw solve? (180-360 frames, 6 seconds) */}
      <Sequence from={180} durationInFrames={180}>
        <WhatProblemsOpenClawSolvesScene
          frame={frame - 180}
          accentColor={accentColor}
          textColor={textColor}
          cardBg={cardBg}
        />
      </Sequence>

      {/* Scene 3: What can OpenClaw do? (360-540 frames, 6 seconds) */}
      <Sequence from={360} durationInFrames={180}>
        <WhatCanOpenClawDoScene
          frame={frame - 360}
          accentColor={accentColor}
          cardBg={cardBg}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 4: Features (540-720 frames, 6 seconds) */}
      <Sequence from={540} durationInFrames={180}>
        <FeaturesScene
          frame={frame - 540}
          accentColor={accentColor}
          cardBg={cardBg}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 5: Install - Step 1 (720-1050 frames, 11 seconds) */}
      <Sequence from={720} durationInFrames={330}>
        <InstallScene
          frame={frame - 720}
          accentColor={accentColor}
          textColor={textColor}
          step={1}
        />
      </Sequence>

      {/* Scene 6: Install - Step 2 (1050-1440 frames, 13 seconds) */}
      <Sequence from={1050} durationInFrames={390}>
        <InstallScene
          frame={frame - 1050}
          accentColor={accentColor}
          textColor={textColor}
          step={2}
        />
      </Sequence>

      {/* Scene 7: Install - Step 3 (1440-1740 frames, 10 seconds) */}
      <Sequence from={1440} durationInFrames={300}>
        <InstallScene
          frame={frame - 1440}
          accentColor={accentColor}
          textColor={textColor}
          step={3}
        />
      </Sequence>

      {/* Scene 8: Gateway (1740-2010 frames, 9 seconds) */}
      <Sequence from={1740} durationInFrames={270}>
        <GatewayScene
          frame={frame - 1740}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 9: Message (2010-2280 frames, 9 seconds) */}
      <Sequence from={2010} durationInFrames={270}>
        <MessageScene
          frame={frame - 2010}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 10: Outro (2280-2430 frames, 5 seconds) */}
      <Sequence from={2280} durationInFrames={150}>
        <OutroScene
          frame={frame - 2280}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
