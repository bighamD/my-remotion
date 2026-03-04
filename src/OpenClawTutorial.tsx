import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
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

  const cardTranslateY = interpolate(
    frame - delay,
    [0, 30],
    [50, 0],
    { extrapolateRight: "clamp" }
  );

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
    Math.floor((frame - delay) / 2),
    command.length
  );

  const outputOpacity = output
    ? interpolate(
        frame - delay - command.length * 2 - 30,
        [0, 30],
        [0, 1],
        {
          extrapolateRight: "clamp",
        }
      )
    : 0;

  const outputRevealStart = delay + command.length * 2 + 30;
  const outputTypedLength =
    output && outputTypewriter
      ? Math.max(
          0,
          Math.min(
            output.length,
            Math.floor((frame - outputRevealStart) * outputCharsPerFrame)
          )
        )
      : output?.length ?? 0;
  const outputText =
    output && outputTypewriter ? output.slice(0, outputTypedLength) : output;

  return (
    <div style={{ opacity: cmdOpacity, marginBottom: "20px" }}>
      <div
        style={{
          background: "rgba(18, 18, 30, 0.92)",
          borderRadius: "14px",
          padding: "24px 28px",
          fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Menlo', 'Consolas', monospace",
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
            fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Menlo', 'Consolas', monospace",
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
      description:
        "确认 Node.js 与网络环境，确保后续安装和守护进程启动稳定。",
      color: "#3B82F6",
    },
    {
      icon: "②",
      title: "CLI 安装",
      description:
        "安装 OpenClaw CLI 并验证命令可用，为自动化操作准备入口。",
      color: "#10B981",
    },
    {
      icon: "③",
      title: "Onboarding 配置",
      description:
        "一次性完成模型认证、网关参数和渠道接入配置。",
      color: "#A78BFA",
    },
    {
      icon: "④",
      title: "联调验证",
      description:
        "查看 Gateway 状态并发送首条消息，闭环验证系统已可用。",
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
  // 根据步骤返回不同的命令
  const getCommands = () => {
    if (step === 1) {
      return [
        {
          command: "node -v",
          output:
            "v20.12.2\n⚠️ 当前版本低于要求\n\nOpenClaw 官方要求: Node.js 22+\n文档: docs.openclaw.ai/install/node",
        },
        {
          command: "brew install node && node -v",
          output:
            "==> Installing node...\n==> node 22.13.1 installed\nv22.13.1 ✓\n环境满足 OpenClaw 最低要求 (Node.js 22+)",
        },
        {
          command: "npm -v",
          output:
            "10.9.2 ✓\nNode.js 与 npm 均可用，下一步可执行 OpenClaw CLI 安装",
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
        {
          command: "which openclaw",
          output: "/usr/local/bin/openclaw\n✓ 命令行工具已就绪",
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
            delay={index * 300}
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
  const commands = [
    {
      command: "openclaw gateway status",
      output:
        "状态: 运行中 ✓\n端口: 18789\n绑定: loopback\n运行时间: 2小时34分\n活跃会话: 3",
    },
    {
      command: "openclaw dashboard",
      output:
        "正在打开控制面板...\n✓ 控制面板: http://127.0.0.1:18789/\n✓ 浏览器已打开\n\n现在可以与你的 AI Agent 聊天了！",
    },
  ];

  return (
    <SceneShell padding="0 120px">
      <StepIndicator step={4} total={5} accentColor={accentColor} />
      <SceneTitle
        title="开始使用 OpenClaw"
        subtitle="检查网关状态并打开控制面板"
        accentColor={accentColor}
        textColor={textColor}
      />

      <div style={{ width: "100%", maxWidth: "1000px" }}>
        {commands.map((cmd, index) => (
          <TerminalCommand
            key={index}
            {...cmd}
            frame={frame}
            delay={index * 240}
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
  const commands = [
    {
      command: 'openclaw message send --target +8618476697664 --channel imessage --message "长官，飞书通道配置完成！✅ 已成功配对，现在可以在飞书中正常使用了。重复插件也已清理完毕 😎"',
      output:
        "正在发送消息...\n\n✓ 消息已发送\n✓ 目标: +8618476697664 (iMessage)\n✓ 状态: 已送达\n\n试试与你的 AI Agent 聊天吧！",
    },
  ];

  return (
    <SceneShell padding="0 120px">
      <StepIndicator step={5} total={5} accentColor={accentColor} />
      <SceneTitle
        title="发送测试消息"
        subtitle="通过命令行向任意渠道发送消息"
        accentColor={accentColor}
        textColor={textColor}
      />

      <div style={{ width: "100%", maxWidth: "1000px" }}>
        {commands.map((cmd, index) => (
          <TerminalCommand
            key={index}
            {...cmd}
            frame={frame}
            delay={0}
            accentColor={accentColor}
            textColor={textColor}
          />
        ))}
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
          { text: "📚 文档: docs.openclaw.ai", url: "https://docs.openclaw.ai" },
          { text: "💻 GitHub: github.com/openclaw", url: "https://github.com/openclaw" },
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

      {/* Scene 2: Features (180-360 frames, 6 seconds) - 缩短了一半 */}
      <Sequence from={180} durationInFrames={180}>
        <FeaturesScene
          frame={frame - 180}
          accentColor={accentColor}
          cardBg={cardBg}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 3: Install - Step 1 (360-960 frames, 20 seconds) */}
      <Sequence from={360} durationInFrames={600}>
        <InstallScene
          frame={frame - 360}
          accentColor={accentColor}
          textColor={textColor}
          step={1}
        />
      </Sequence>

      {/* Scene 4: Install - Step 2 (960-1440 frames, 16 seconds) */}
      <Sequence from={960} durationInFrames={480}>
        <InstallScene
          frame={frame - 960}
          accentColor={accentColor}
          textColor={textColor}
          step={2}
        />
      </Sequence>

      {/* Scene 5: Install - Step 3 (1440-1800 frames, 12 seconds) */}
      <Sequence from={1440} durationInFrames={360}>
        <InstallScene
          frame={frame - 1440}
          accentColor={accentColor}
          textColor={textColor}
          step={3}
        />
      </Sequence>

      {/* Scene 6: Gateway (1800-2160 frames, 12 seconds) */}
      <Sequence from={1800} durationInFrames={360}>
        <GatewayScene
          frame={frame - 1800}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 7: Message (2160-2520 frames, 12 seconds) */}
      <Sequence from={2160} durationInFrames={360}>
        <MessageScene
          frame={frame - 2160}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 8: Outro (2520-2700 frames, 6 seconds) */}
      <Sequence from={2520} durationInFrames={180}>
        <OutroScene
          frame={frame - 2520}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
