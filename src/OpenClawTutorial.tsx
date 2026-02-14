import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const openClawSchema = z.object({
  backgroundColor: zColor(),
  cardBg: zColor(),
  accentColor: zColor(),
  textColor: zColor(),
  secondaryTextColor: zColor(),
});

// Logo 组件
const Logo: React.FC<{
  frame: number;
}> = ({ frame }) => {
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
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        fontSize: "120px",
        fontWeight: 800,
        background: "linear-gradient(135deg, #FF5A36 0%, #FF8A6B 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.05em",
        marginBottom: "20px",
      }}
    >
      OpenClaw
    </div>
  );
};

// 特性卡片组件
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  frame: number;
  delay: number;
  accentColor: string;
  cardBg: string;
  textColor: string;
}> = ({ icon, title, description, frame, delay, accentColor, cardBg, textColor }) => {
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
        background: cardBg,
        borderRadius: "16px",
        padding: "32px",
        marginBottom: "24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        border: `2px solid ${accentColor}`,
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          minWidth: "60px",
          textAlign: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: accentColor,
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
  frame: number;
  accentColor: string;
}> = ({ step, total, frame, accentColor }) => {
  const progress = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "40px",
        alignItems: "center",
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
            transition: "all 0.3s ease",
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

// 终端命令组件
const TerminalCommand: React.FC<{
  command: string;
  output?: string;
  frame: number;
  delay: number;
  accentColor: string;
  textColor: string;
}> = ({ command, output, frame, delay, accentColor, textColor }) => {
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

  return (
    <div style={{ opacity: cmdOpacity, marginBottom: "20px" }}>
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          borderRadius: "8px",
          padding: "16px 20px",
          fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', monospace",
          fontSize: "16px",
        }}
      >
        <span style={{ color: accentColor, marginRight: "8px" }}>➜</span>
        <span style={{ color: textColor }}>
          {command.slice(0, cmdCharCount)}
          {cmdCharCount < command.length && (
            <span style={{ opacity: frame % 10 < 5 ? 1 : 0 }}>▋</span>
          )}
        </span>
      </div>
      {output && outputOpacity > 0 && (
        <div
          style={{
            marginTop: "12px",
            padding: "16px 20px",
            fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', monospace",
            fontSize: "14px",
            color: textColor,
            opacity: outputOpacity * 0.7,
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
          }}
        >
          {output}
        </div>
      )}
    </div>
  );
};

// 场景 1: 开场介绍
const IntroScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const featuresOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Logo frame={frame} />

      <h1
        style={{
          fontSize: "72px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 24px 0",
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        AI 驱动的智能 Agent 平台
      </h1>

      <p
        style={{
          fontSize: "28px",
          color: textColor,
          margin: "0 0 60px 0",
          opacity: subtitleOpacity,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        下一代 AI 助手，让开发效率倍增
      </p>

      <div
        style={{
          display: "flex",
          gap: "32px",
          opacity: featuresOpacity,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["💬 多渠道聊天", "🤖 智能代理", "🌐 浏览器自动化", "🔌 安全网关"].map(
          (feature) => (
            <div
              key={feature}
              style={{
                background: `${accentColor}22`,
                border: `2px solid ${accentColor}`,
                borderRadius: "12px",
                padding: "16px 24px",
                fontSize: "20px",
                fontWeight: 600,
                color: accentColor,
              }}
            >
              {feature}
            </div>
          )
        )}
      </div>
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
  const features = [
    {
      icon: "💬",
      title: "多渠道支持",
      description:
        "连接 WhatsApp、Telegram、Discord、Slack 等，你的 AI Agent 随处可在",
    },
    {
      icon: "🤖",
      title: "自定义 Agent",
      description:
        "创建具有独特个性、技能和工具访问权限的专用 AI Agent",
    },
    {
      icon: "🌐",
      title: "浏览器自动化",
      description:
        "内置浏览器工具，实现网页抓取、自动化操作和完全控制",
    },
    {
      icon: "🔌",
      title: "安全网关",
      description:
        "自托管网关，完全掌控数据、认证和 Agent 操作",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "0 100px",
      }}
    >
      <h2
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: accentColor,
          margin: "0 0 20px 0",
          textAlign: "center",
        }}
      >
        强大的核心功能
      </h2>

      <p
        style={{
          fontSize: "24px",
          color: textColor,
          margin: "0 0 60px 0",
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        构建 AI 驱动工作流所需的一切
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            {...feature}
            frame={frame}
            delay={index * 10}
            accentColor={accentColor}
            cardBg={cardBg}
            textColor={textColor}
          />
        ))}
      </div>
    </div>
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
          command: "node --version",
          output: "v22.11.0 ✓\nOpenClaw 需要 Node.js 22 或更新版本",
        },
        {
          command: "npm --version",
          output: "11.0.0 ✓\npm 包管理器已就绪",
        },
        {
          command: "echo $SHELL",
          output: "/bin/zsh\nshell 环境检查通过",
        },
      ];
    }
    if (step === 2) {
      return [
        {
          command: "curl -fsSL https://openclaw.ai/install.sh | bash",
          output:
            "正在下载安装程序...\n\n[######################]   50.0%\n" +
            "[###########################]  75.0%\n" +
            "[######################################] 100.0%\n\n" +
            "✓ OpenClaw CLI 安装成功\n" +
            "✓ 位置: /usr/local/bin/openclaw\n" +
            "✓ 版本: 2.4.1\n" +
            "✓ 添加到 PATH 环境变量",
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
            "═══════════════════════════════════════════\n" +
            "    OpenClaw Onboarding Wizard v2.4.1\n" +
            "═══════════════════════════════════════════\n\n" +
            "欢迎使用 OpenClaw！让我们快速配置您的环境 🚀\n\n" +
            "─────────────────────────────────────────────────\n\n" +
            "【步骤 1/4】身份认证配置\n" +
            "─────────────────────────────────────────────────\n\n" +
            "OpenClaw 支持多个 AI 提供商，请选择:\n\n" +
            "  1. Anthropic (Claude Sonnet/Opus)          ⭐ 推荐\n" +
            "  2. OpenAI (GPT-4o/GPT-4o-mini)\n" +
            "  3. Google (Gemini 2.0 Flash/Pro)\n" +
            "  4. 其他兼容提供商\n\n" +
            "您的选择 [1-4]: 1\n\n" +
            "正在连接 Anthropic API...\n" +
            "✓ API 密钥格式验证通过\n" +
            "✓ 可用模型: Claude Sonnet 4.5, Claude Opus 4.5\n" +
            "✓ Anthropic 认证配置成功\n\n" +
            "─────────────────────────────────────────────────\n\n" +
            "【步骤 2/4】网关基础设置\n" +
            "─────────────────────────────────────────────────\n\n" +
            "配置 OpenClaw Gateway 参数:\n\n" +
            "Gateway 端口 [18789]: \n" +
            "绑定地址 [0.0.0.0]: \n" +
            "绑定模式 [loopback/any]: \n" +
            "工作目录 [~/.openclaw]: \n" +
            "\n✓ 使用默认配置 (推荐)\n" +
            "✓ 网关参数已保存到 ~/.openclaw/config.json\n\n" +
            "─────────────────────────────────────────────────\n\n" +
            "【步骤 3/4】渠道连接设置\n" +
            "─────────────────────────────────────────────────\n\n" +
            "OpenClaw 支持以下渠道 (可多选):\n\n" +
            "  [1] WhatsApp      ✅ 最受欢迎\n" +
            "  [2] Telegram      ⚡ 快速设置\n" +
            "  [3] Discord       👥 社区支持\n" +
            "  [4] Slack         💼 工作协作\n" +
            "  [5] iMessage      💬 Apple 生态\n" +
            "  [6] Google Chat    📅 Gmail 集成\n\n" +
            "请选择要启用的渠道 [1-6, 用空格分隔]: 2\n\n" +
            "正在配置 Telegram Bot API...\n" +
            "  Bot Token: ************\n" +
            "✓ Telegram 连接测试成功\n" +
            "✓ Bot @OpenClawAssistant 已就绪\n" +
            "\n💡 提示: 稍后可通过 'openclaw channels add' 添加更多渠道\n\n" +
            "─────────────────────────────────────────────────\n\n" +
            "【步骤 4/4】系统服务安装\n" +
            "─────────────────────────────────────────────────\n\n" +
            "是否安装系统服务？\n" +
            "服务将在系统启动时自动运行 [Y/n]: y\n\n" +
            "检测操作系统: macOS (Darwin 24.6.0)\n" +
            "正在创建 launchd 配置...\n" +
            "✓ 配置文件: ~/Library/LaunchAgents/ai.openclaw.gateway.plist\n" +
            "正在加载服务...\n" +
            "✓ OpenClaw Gateway 服务已启动\n" +
            "✓ 守护进程正在运行 (PID: 12345)\n" +
            "\n正在检查健康状态...\n" +
            "✓ Gateway 响应正常\n" +
            "✓ WebSocket 服务就绪: ws://127.0.0.1:18789\n" +
            "\n═══════════════════════════════════════════\n" +
            "🎉 恭喜！OpenClaw 配置完成！\n" +
            "═══════════════════════════════════════════\n\n" +
            "─────────────────────────────────────────────────\n" +
            "快速开始:\n" +
            "─────────────────────────────────────────────────\n\n" +
            "1. 打开控制面板:\n" +
            "   openclaw dashboard\n" +
            "   或访问: http://127.0.0.1:18789/\n\n" +
            "2. 检查系统状态:\n" +
            "   openclaw gateway status\n\n" +
            "3. 查看日志:\n" +
            "   openclaw logs --follow\n\n" +
            "4. 发送测试消息:\n" +
            "   openclaw message send --target <号码> --message \"你好\"\n\n" +
            "─────────────────────────────────────────────────\n\n" +
            "📚 完整文档: https://docs.openclaw.ai\n" +
            "💻 GitHub: https://github.com/openclaw\n" +
            "💬 社区支持: https://discord.gg/openclaw\n",
        },
      ];
    }
    return [];
  };

  const commands = getCommands();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "0 120px",
      }}
    >
      <StepIndicator step={step} total={5} frame={frame} accentColor={accentColor} />

      <h2
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: accentColor,
          margin: "0 0 16px 0",
          textAlign: "center",
        }}
      >
        {step === 1 && "检查系统环境"}
        {step === 2 && "安装 OpenClaw"}
        {step === 3 && "运行配置向导"}
      </h2>

      <p
        style={{
          fontSize: "20px",
          color: textColor,
          margin: "0 0 40px 0",
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        {step === 1 && "确保 Node.js 环境已准备就绪"}
        {step === 2 && "使用官方脚本快速安装"}
        {step === 3 && "配置认证、网关和渠道"}
      </p>

      <div style={{ width: "100%", maxWidth: "1200px" }}>
        {commands.map((cmd, index) => (
          <TerminalCommand
            key={index}
            {...cmd}
            frame={frame}
            delay={index * 300}
            accentColor={accentColor}
            textColor={textColor}
          />
        ))}
      </div>
    </div>
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "0 120px",
      }}
    >
      <StepIndicator step={4} total={5} frame={frame} accentColor={accentColor} />

      <h2
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: accentColor,
          margin: "0 0 16px 0",
          textAlign: "center",
        }}
      >
        开始使用 OpenClaw
      </h2>

      <p
        style={{
          fontSize: "20px",
          color: textColor,
          margin: "0 0 40px 0",
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        检查网关状态并打开控制面板
      </p>

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
    </div>
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
      command: 'openclaw message send --target +15555550123 --message "你好，我是 OpenClaw"',
      output:
        "正在发送消息...\n\n✓ 消息已发送\n✓ 目标: +15555550123 (WhatsApp)\n✓ 状态: 已送达\n\n试试与你的 AI Agent 聊天吧！",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "0 120px",
      }}
    >
      <StepIndicator step={5} total={5} frame={frame} accentColor={accentColor} />

      <h2
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: accentColor,
          margin: "0 0 16px 0",
          textAlign: "center",
        }}
      >
        发送测试消息
      </h2>

      <p
        style={{
          fontSize: "20px",
          color: textColor,
          margin: "0 0 40px 0",
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        通过命令行向任意渠道发送消息
      </p>

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
    </div>
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
              background: `${accentColor}22`,
              border: `2px solid ${accentColor}`,
              borderRadius: "12px",
              padding: "16px 24px",
              fontSize: "20px",
              fontWeight: 600,
              color: accentColor,
            }}
          >
            {link.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export const OpenClawTutorial: React.FC<z.infer<typeof openClawSchema>> = ({
  backgroundColor,
  cardBg,
  accentColor,
  textColor,
  secondaryTextColor,
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
      {/* Scene 1: Intro (0-180 frames, 6 seconds) */}
      <Sequence from={0} durationInFrames={180}>
        <IntroScene
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

      {/* Scene 3: Install - Step 1 (360-720 frames, 12 seconds) - 延长了 */}
      <Sequence from={360} durationInFrames={360}>
        <InstallScene
          frame={frame - 360}
          accentColor={accentColor}
          textColor={textColor}
          step={1}
        />
      </Sequence>

      {/* Scene 4: Install - Step 2 (720-1200 frames, 16 seconds) - 延长了 */}
      <Sequence from={720} durationInFrames={480}>
        <InstallScene
          frame={frame - 720}
          accentColor={accentColor}
          textColor={textColor}
          step={2}
        />
      </Sequence>

      {/* Scene 5: Install - Step 3 (1200-1920 frames, 24 seconds) - 延长了 */}
      <Sequence from={1200} durationInFrames={720}>
        <InstallScene
          frame={frame - 1200}
          accentColor={accentColor}
          textColor={textColor}
          step={3}
        />
      </Sequence>

      {/* Scene 6: Gateway (1920-2280 frames, 12 seconds) - 延长了 */}
      <Sequence from={1920} durationInFrames={360}>
        <GatewayScene
          frame={frame - 1920}
          accentColor={accentColor}
          textColor={textColor}
        />
      </Sequence>

      {/* Scene 7: Message (2280-2520 frames, 8 seconds) - 新场景 */}
      <Sequence from={2280} durationInFrames={240}>
        <MessageScene
          frame={frame - 2280}
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
