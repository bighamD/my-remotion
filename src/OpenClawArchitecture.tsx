import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  Sequence,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { GatewayScene } from "./GatewayScene";

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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

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
    const opacity = spring({ frame: frame - delay, fps: 30, config: { damping: 20, stiffness: 100 } });
    const scale = spring({ frame: frame - delay, fps: 30, config: { damping: 25, stiffness: 100 } });

    return (
      <div style={{
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
      }}>
        <div style={{
          fontSize: "56px",
          filter: `drop-shadow(0 4px 16px ${color}66)`,
        }}>
          {icon}
        </div>
        <div style={{
          fontSize: "20px",
          fontWeight: 600,
          color,
        }}>
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
    const progress = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: "clamp" });
    const opacity = spring({ frame: frame - delay, fps: 30 });

    return (
      <g opacity={opacity}>
        <defs>
          <marker id={`arrow-main-${x1}-${y1}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
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
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px",
      background: "radial-gradient(circle, #2c2c2c 1px, transparent 1px)",
      backgroundSize: "30px 30px",
    }}>
      <div style={{
        maxWidth: "1400px",
        width: "100%",
        border: "4px solid rgba(255,255,255,0.2)",
        padding: "60px",
        borderRadius: "16px",
        background: "rgba(18,18,18,0.9)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}>
        {/* 标题 */}
        <h1 style={{
          fontSize: "52px",
          fontWeight: 800,
          color: textColor,
          margin: "0 0 80px 0",
          opacity: titleOpacity,
          textAlign: "center",
          textShadow: "0 0 20px rgba(255,255,255,0.3)",
        }}>
          一次看懂 <span style={{ color: accentColor }}>OpenClaw</span> 是怎么自动干活的
        </h1>

        <div style={{ display: "flex", gap: "60px" }}>
          {/* 左侧：OpenClaw 核心区 */}
          <div style={{
            flex: "0 0 280px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "2px solid rgba(255,255,255,0.2)",
            paddingRight: "40px",
          }}>
            <div style={{
              fontSize: "120px",
              marginBottom: "24px",
              filter: "drop-shadow(0 8px 32px rgba(255,90,54,0.4))",
            }}>
              🖥️
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "48px",
                fontWeight: 800,
                color: accentColor,
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}>
                OpenClaw
              </div>
              <div style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.5)",
              }}>
                AI 私人助理
              </div>
            </div>
          </div>

          {/* 右侧：模块架构图 */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: "20px",
            position: "relative",
            height: "500px",
          }}>
            {/* 第一行：Gateway → Agent → Skills → Channels */}
            <ModuleBox icon="🚪" title="Gateway" color="white" frame={frame} delay={20} x={0} y={0} />
            <ModuleBox icon="🤖" title="Agent" color="white" frame={frame} delay={30} x={280} y={0} />
            <ModuleBox icon="💼" title="Skills" color="#EAB308" frame={frame} delay={40} x={560} y={0} />
            <ModuleBox icon="📡" title="Channels" color="#22C55E" frame={frame} delay={50} x={840} y={0} />

            {/* 第二行：Nodes → Memory → Heartbeat → Cron */}
            <ModuleBox icon="🌐" title="Nodes" color="#34D399" frame={frame} delay={60} x={0} y={250} />
            <ModuleBox icon="🧠" title="Memory" color="#A78BFA" frame={frame} delay={70} x={280} y={250} />
            <ModuleBox icon="💓" title="Heartbeat" color="#F472B6" frame={frame} delay={80} x={560} y={250} />
            <ModuleBox icon="⏰" title="Cron" color="#9333EA" frame={frame} delay={90} x={840} y={250} />

            {/* 箭头连接 */}
            <svg style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}>
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
        <div style={{
          marginTop: "80px",
          paddingTop: "40px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
          opacity: spring({ frame: frame - 110, fps: 30 }),
        }}>
          <div style={{ fontSize: "36px", lineHeight: 1.5 }}>
            <span style={{ color: "#EAB308", fontWeight: 700 }}>主动执行任务原理：</span>
            <span style={{ fontWeight: 300, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)" }}>
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
// GatewayScene 组件已移至 src/GatewayScene.tsx

// ============================================
// 场景 3: Agent 智能代理系统
// ============================================

const AgentScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const llmProviders = [
    { name: "Claude", icon: "🧠", color: "#8B5CF6" },
    { name: "GPT-4", icon: "🤖", color: "#10B981" },
    { name: "Gemini", icon: "💎", color: "#3B82F6" },
  ];

  const agentFeatures = [
    { icon: "💭", title: "上下文记忆", desc: "持久化对话历史" },
    { icon: "🎯", title: "任务规划", desc: "复杂任务分解" },
    { icon: "🔧", title: "工具调用", desc: "扩展能力边界" },
    { icon: "🛡️", title: "安全防护", desc: "权限与审计" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "56px", fontWeight: 800, color: accentColor, margin: "0 0 16px 0", opacity: titleOpacity, textAlign: "center" }}>
        Agent: 智能代理
      </h1>
      <p style={{ fontSize: "24px", color: textColor, margin: "0 0 60px 0", opacity: titleOpacity, textAlign: "center" }}>
        强大的 LLM 驱动，理解并执行复杂任务
      </p>

      <div style={{ display: "flex", gap: "80px", width: "100%", maxWidth: "1400px" }}>
        {/* 左侧：LLM 提供商 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: textColor, marginBottom: "30px", textAlign: "center" }}>
            支持的 LLM
          </div>
          {llmProviders.map((provider, index) => (
            <div key={index} style={{
              marginBottom: "20px",
              opacity: spring({ frame: frame - 20 - index * 10, fps: 30 }),
              transform: `translateX(${interpolate(frame - 20 - index * 10, [-50, 0], [50, 0], { extrapolateRight: "clamp" })}px)`,
            }}>
              <div style={{
                background: `${provider.color}22`,
                border: `3px solid ${provider.color}`,
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}>
                <span style={{ fontSize: "40px" }}>{provider.icon}</span>
                <span style={{ fontSize: "24px", fontWeight: 700, color: provider.color }}>
                  {provider.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：Agent 特性 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: textColor, marginBottom: "30px", textAlign: "center" }}>
            核心能力
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {agentFeatures.map((feature, index) => (
              <div key={index} style={{
                opacity: spring({ frame: frame - 50 - index * 8, fps: 30 }),
                transform: `scale(${spring({ frame: frame - 50 - index * 8, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
                transformOrigin: "center center",
              }}>
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                  minHeight: "140px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>{feature.icon}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: textColor, marginBottom: "6px" }}>
                    {feature.title}
                  </div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const skills = [
    { name: "浏览器", icon: "🌐", desc: "自动化操作", color: "#3B82F6" },
    { name: "文件系统", icon: "📁", desc: "读写管理", color: "#10B981" },
    { name: "API 调用", icon: "🔌", desc: "外部集成", color: "#F59E0B" },
    { name: "代码执行", icon: "⚡", desc: "沙箱运行", color: "#EF4444" },
    { name: "数据库", icon: "🗄️", desc: "数据存储", color: "#8B5CF6" },
    { name: "自定义", icon: "🔧", desc: "扩展开发", color: "#EC4899" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "56px", fontWeight: 800, color: accentColor, margin: "0 0 16px 0", opacity: titleOpacity, textAlign: "center" }}>
        Skills: 技能系统
      </h1>
      <p style={{ fontSize: "24px", color: textColor, margin: "0 0 60px 0", opacity: titleOpacity, textAlign: "center" }}>
        扩展 Agent 能力，连接真实世界
      </p>

      <div style={{ position: "relative", width: "100%", maxWidth: "1200px" }}>
        {/* 中心 Agent */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${spring({ frame: frame - 20, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
          width: "200px",
          height: "200px",
          opacity: spring({ frame: frame - 20, fps: 30 }),
          background: `${accentColor}22`,
          border: `4px solid ${accentColor}`,
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 16px 64px ${accentColor}44`,
        }}>
          <div style={{ fontSize: "64px", marginBottom: "12px" }}>🤖</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: accentColor }}>Agent</div>
        </div>

        {/* Skills 圆形排列 */}
        {skills.map((skill, index) => {
          const angle = (index * 60 - 90) * (Math.PI / 180);
          const radius = 280;
          const x = 600 + Math.cos(angle) * radius - 100;
          const y = 200 + Math.sin(angle) * radius - 60;

          return (
            <div key={index} style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: spring({ frame: frame - 40 - index * 8, fps: 30 }),
              transform: `scale(${spring({ frame: frame - 40 - index * 8, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
              transformOrigin: "center center",
            }}>
              <div style={{
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
              }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>{skill.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: skill.color, marginBottom: "4px" }}>
                  {skill.name}
                </div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                  {skill.desc}
                </div>
              </div>
            </div>
          );
        })}

        {/* 连接线 */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {skills.map((skill, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const progress = interpolate(
              frame - 100 - index * 3,
              [0, 30],
              [0, 1],
              { extrapolateRight: "clamp" }
            );
            const opacity = spring({ frame: frame - 100 - index * 3, fps: 30 });
            const radius = 200 * progress;
            const x2 = 600 + Math.cos(angle) * radius;
            const y2 = 200 + Math.sin(angle) * radius;

            return (
              <g key={index} opacity={opacity}>
                <defs>
                  <marker id={`arrow-skills-${index}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill={skill.color} />
                  </marker>
                </defs>
                <line
                  x1={600}
                  y1={200}
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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const channels = [
    { name: "网页", icon: "💬", color: "#EF4444", x: 200, y: 200 },
    { name: "WhatsApp", icon: "📱", color: "#10B981", x: 450, y: 200 },
    { name: "Telegram", icon: "✈️", color: "#3B82F6", x: 700, y: 200 },
    { name: "飞书", icon: "🚀", color: "#F59E0B", x: 950, y: 200 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "56px", fontWeight: 800, color: accentColor, margin: "0 0 16px 0", opacity: titleOpacity, textAlign: "center" }}>
        Channels: 沟通热线
      </h1>
      <p style={{ fontSize: "24px", color: textColor, margin: "0 0 60px 0", opacity: titleOpacity, textAlign: "center" }}>
        多渠道消息统一接入
      </p>

      <div style={{ position: "relative", width: "100%", maxWidth: "1200px", height: "450px" }}>
        {/* 渠道图标 */}
        {channels.map((channel, index) => (
          <div key={index} style={{
            position: "absolute",
            left: channel.x,
            top: channel.y,
            opacity: spring({ frame: frame - 20 - index * 10, fps: 30 }),
            transform: `scale(${spring({ frame: frame - 20 - index * 10, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
            transformOrigin: "center center",
          }}>
            <div style={{
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
            }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>{channel.icon}</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: channel.color }}>{channel.name}</div>
            </div>
          </div>
        ))}

        {/* 中间转换框 */}
        <div style={{
          position: "absolute",
          left: 400,
          top: 400,
          width: "450px",
          height: "100px",
          opacity: spring({ frame: frame - 80, fps: 30 }),
          transform: `scale(${spring({ frame: frame - 80, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
          transformOrigin: "center center",
          background: `${accentColor}22`,
          border: `3px solid ${accentColor}`,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ fontSize: "20px", color: accentColor, fontWeight: 600, textAlign: "center" }}>
            消息统一转换成系统能理解的格式
          </div>
        </div>

        {/* 箭头 */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {channels.map((channel, index) => {
            const progress = interpolate(
              frame - 60 - index * 5,
              [0, 30],
              [0, 1],
              { extrapolateRight: "clamp" }
            );
            const opacity = spring({ frame: frame - 60 - index * 5, fps: 30 });

            return (
              <g key={index} opacity={opacity}>
                <defs>
                  <marker id={`arrow-channels-${index}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#FBBF24" />
                  </marker>
                </defs>
                <line
                  x1={channel.x + 80}
                  y1={360}
                  x2={channel.x + 80 + (500 - (channel.x + 80)) * progress}
                  y2={400}
                  stroke="#FBBF24"
                  strokeWidth="3"
                  markerEnd={`url(#arrow-channels-${index})`}
                />
              </g>
            );
          })}
        </svg>

        {/* 输出说明 */}
        <div style={{
          position: "absolute",
          left: 400,
          top: 530,
          width: "450px",
          textAlign: "center",
          opacity: spring({ frame: frame - 100, fps: 30 }),
        }}>
          <div style={{ fontSize: "24px", color: "#10B981", fontWeight: 700, marginBottom: "12px" }}>
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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const nodeTypes = [
    { title: "Worker 节点", icon: "⚙️", desc: "执行任务", color: "#34D399" },
    { title: "Scheduler 节点", icon: "📋", desc: "任务调度", color: "#60A5FA" },
    { title: "Monitor 节点", icon: "📊", desc: "监控状态", color: "#F472B6" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "56px", fontWeight: 800, color: accentColor, margin: "0 0 16px 0", opacity: titleOpacity, textAlign: "center" }}>
        Nodes: 分布式节点
      </h1>
      <p style={{ fontSize: "24px", color: textColor, margin: "0 0 60px 0", opacity: titleOpacity, textAlign: "center" }}>
        可扩展的分布式计算架构
      </p>

      <div style={{ display: "flex", gap: "60px", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "1200px" }}>
        {nodeTypes.map((node, index) => (
          <div key={index} style={{
            opacity: spring({ frame: frame - 20 - index * 15, fps: 30 }),
            transform: `scale(${spring({ frame: frame - 20 - index * 15, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
            transformOrigin: "center center",
          }}>
            <div style={{
              width: "280px",
              padding: "32px",
              background: `${node.color}22`,
              border: `4px solid ${node.color}`,
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: `0 12px 48px ${node.color}55`,
            }}>
              <div style={{ fontSize: "72px", marginBottom: "20px" }}>{node.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: node.color, marginBottom: "12px" }}>
                {node.title}
              </div>
              <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)" }}>
                {node.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部特性 */}
      <div style={{
        marginTop: "80px",
        display: "flex",
        gap: "24px",
        opacity: spring({ frame: frame - 80, fps: 30 }),
      }}>
        {["负载均衡", "故障转移", "动态扩展", "健康检查"].map((feature) => (
          <div key={feature} style={{
            background: "rgba(255,255,255,0.05)",
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: "12px",
            padding: "12px 24px",
            fontSize: "18px",
            color: textColor,
            fontWeight: 600,
          }}>
            ✓ {feature}
          </div>
        ))}
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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const memoryTypes = [
    { title: "短期记忆", icon: "💭", desc: "当前对话上下文", color: "#3B82F6", x: 100, y: 150 },
    { title: "长期记忆", icon: "🗄️", desc: "持久化存储", color: "#10B981", x: 400, y: 150 },
    { title: "向量存储", icon: "🔍", desc: "语义搜索", color: "#F59E0B", x: 700, y: 150 },
    { title: "知识图谱", icon: "🕸️", desc: "关系网络", color: "#8B5CF6", x: 1000, y: 150 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "56px", fontWeight: 800, color: accentColor, margin: "0 0 16px 0", opacity: titleOpacity, textAlign: "center" }}>
        Memory: 记忆系统
      </h1>
      <p style={{ fontSize: "24px", color: textColor, margin: "0 0 60px 0", opacity: titleOpacity, textAlign: "center" }}>
        让 Agent 拥有持久化记忆能力
      </p>

      <div style={{ position: "relative", width: "100%", maxWidth: "1300px", height: "350px" }}>
        {/* 记忆类型 */}
        {memoryTypes.map((memory, index) => (
          <div key={index} style={{
            position: "absolute",
            left: memory.x,
            top: memory.y,
            opacity: spring({ frame: frame - 20 - index * 10, fps: 30 }),
            transform: `scale(${spring({ frame: frame - 20 - index * 10, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
            transformOrigin: "center center",
          }}>
            <div style={{
              width: "240px",
              padding: "24px",
              background: `${memory.color}22`,
              border: `3px solid ${memory.color}`,
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: `0 8px 32px ${memory.color}44`,
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>{memory.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: memory.color, marginBottom: "8px", textAlign: "center" }}>
                {memory.title}
              </div>
              <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                {memory.desc}
              </div>
            </div>
          </div>
        ))}

        {/* 连接线 */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {[0, 1, 2].map((index) => {
            const progress = interpolate(
              frame - 60 - index * 5,
              [0, 30],
              [0, 1],
              { extrapolateRight: "clamp" }
            );
            const opacity = spring({ frame: frame - 60 - index * 5, fps: 30 });
            const x1 = memoryTypes[index].x + 240;
            const x2 = memoryTypes[index + 1].x;
            const xEnd = x1 + (x2 - x1) * progress;

            return (
              <line
                key={index}
                x1={x1}
                y1={200}
                x2={xEnd}
                y2={200}
                stroke={accentColor}
                strokeWidth="3"
                strokeDasharray="5,5"
                opacity={opacity}
              />
            );
          })}
        </svg>

        {/* 底部特性 */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          opacity: spring({ frame: frame - 90, fps: 30 }),
        }}>
          {["自动整理", "智能检索", "过期清理", "加密存储"].map((feature) => (
            <div key={feature} style={{
              background: `${accentColor}22`,
              border: `2px solid ${accentColor}`,
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "16px",
              fontWeight: 600,
              color: accentColor,
            }}>
              {feature}
            </div>
          ))}
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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const heartbeatScale = interpolate(
    frame % 60,
    [0, 30],
    [1, 1.1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "56px", fontWeight: 800, color: accentColor, margin: "0 0 16px 0", opacity: titleOpacity, textAlign: "center" }}>
        Heartbeat: 健康检查
      </h1>
      <p style={{ fontSize: "24px", color: textColor, margin: "0 0 80px 0", opacity: titleOpacity, textAlign: "center" }}>
        实时监控系统状态，确保服务稳定运行
      </p>

      <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
        {/* 心跳动画 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
        }}>
          <div style={{
            fontSize: "120px",
            transform: `scale(${heartbeatScale})`,
            opacity: spring({ frame: frame - 20, fps: 30 }),
            filter: "drop-shadow(0 8px 32px rgba(244, 114, 182, 0.6))",
          }}>
            💓
          </div>

          {/* 状态指标 */}
          <div style={{
            width: "100%",
            opacity: spring({ frame: frame - 40, fps: 30 }),
          }}>
            {[
              { label: "系统运行时间", value: "99.9%", color: "#10B981" },
              { label: "节点健康度", value: "100%", color: "#3B82F6" },
              { label: "响应时间", value: "< 100ms", color: "#F59E0B" },
            ].map((metric, index) => (
              <div key={index} style={{
                marginBottom: "20px",
                opacity: spring({ frame: frame - 50 - index * 10, fps: 30 }),
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}>
                  <span style={{ fontSize: "18px", color: textColor }}>{metric.label}</span>
                  <span style={{ fontSize: "24px", fontWeight: 700, color: metric.color }}>{metric.value}</span>
                </div>
                <div style={{
                  width: "100%",
                  height: "8px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: index === 2 ? "90%" : "100%",
                    height: "100%",
                    background: metric.color,
                    borderRadius: "4px",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部特性 */}
      <div style={{
        marginTop: "60px",
        display: "flex",
        gap: "24px",
        opacity: spring({ frame: frame - 100, fps: 30 }),
      }}>
        {["自动告警", "故障恢复", "性能监控", "日志记录"].map((feature) => (
          <div key={feature} style={{
            background: "rgba(255,255,255,0.05)",
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: "12px",
            padding: "12px 24px",
            fontSize: "18px",
            color: textColor,
            fontWeight: 600,
          }}>
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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const cronExamples = [
    { time: "0 9 * * 1-5", desc: "工作日早上9点", icon: "🌅" },
    { time: "0 */6 * * *", desc: "每6小时", icon: "⏰" },
    { time: "0 0 * * 0", desc: "每周日午夜", icon: "📅" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "56px", fontWeight: 800, color: accentColor, margin: "0 0 16px 0", opacity: titleOpacity, textAlign: "center" }}>
        Cron: 定时任务
      </h1>
      <p style={{ fontSize: "24px", color: textColor, margin: "0 0 60px 0", opacity: titleOpacity, textAlign: "center" }}>
        自动化定时触发，让 Agent 主动工作
      </p>

      <div style={{ width: "100%", maxWidth: "1000px" }}>
        {/* Cron 表达式示例 */}
        <div style={{ marginBottom: "60px" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: textColor, marginBottom: "30px", textAlign: "center" }}>
            Cron 表达式示例
          </div>
          {cronExamples.map((example, index) => (
            <div key={index} style={{
              marginBottom: "20px",
              opacity: spring({ frame: frame - 20 - index * 10, fps: 30 }),
              transform: `translateX(${interpolate(frame - 20 - index * 10, [-50, 0], [50, 0], { extrapolateRight: "clamp" })}px)`,
            }}>
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}>
                <span style={{ fontSize: "40px" }}>{example.icon}</span>
                <code style={{
                  flex: 1,
                  fontSize: "20px",
                  color: "#A78BFA",
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}>
                  {example.time}
                </code>
                <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)" }}>
                  {example.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 使用场景 */}
        <div style={{
          opacity: spring({ frame: frame - 60, fps: 30 }),
        }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: textColor, marginBottom: "30px", textAlign: "center" }}>
            典型使用场景
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[
              { icon: "📊", title: "数据报表", desc: "每日自动生成" },
              { icon: "🔔", title: "提醒通知", desc: "定时发送" },
              { icon: "🧹", title: "系统清理", desc: "定期维护" },
              { icon: "🔄", title: "数据同步", desc: "自动更新" },
            ].map((scenario, index) => (
              <div key={index} style={{
                background: `${accentColor}11`,
                border: `2px solid ${accentColor}`,
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}>
                <span style={{ fontSize: "36px" }}>{scenario.icon}</span>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: textColor, marginBottom: "4px" }}>
                    {scenario.title}
                  </div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
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
  const titleOpacity = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

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
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px" }}>
      <h1 style={{
        fontSize: "64px",
        fontWeight: 800,
        color: accentColor,
        margin: "0 0 40px 0",
        opacity: titleOpacity,
        textAlign: "center",
      }}>
        OpenClaw 完整架构
      </h1>

      <p style={{
        fontSize: "28px",
        color: textColor,
        margin: "0 0 80px 0",
        opacity: spring({ frame: frame - 20, fps: 30 }),
        textAlign: "center",
        lineHeight: 1.6,
      }}>
        八大模块协同工作，打造强大的 AI 助理系统
      </p>

      {/* 模块网格 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "30px",
        width: "100%",
        maxWidth: "1200px",
        marginBottom: "80px",
      }}>
        {modules.map((module, index) => (
          <div key={index} style={{
            opacity: spring({ frame: frame - 40 - index * 8, fps: 30 }),
            transform: `scale(${spring({ frame: frame - 40 - index * 8, fps: 30, config: { damping: 25, stiffness: 100 } })})`,
            transformOrigin: "center center",
          }}>
            <div style={{
              background: `${accentColor}22`,
              border: `3px solid ${accentColor}`,
              borderRadius: "16px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "180px",
              justifyContent: "center",
            }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>{module.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: accentColor, marginBottom: "8px" }}>
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
      <div style={{
        opacity: spring({ frame: frame - 120, fps: 30 }),
        textAlign: "center",
      }}>
        <div style={{ fontSize: "32px", fontWeight: 700, color: textColor, marginBottom: "24px" }}>
          🚀 开始构建你的 AI 助理
        </div>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
          {[
            { text: "📚 查看文档", color: "#3B82F6" },
            { text: "💻 GitHub", color: "#10B981" },
            { text: "💬 加入社区", color: "#F59E0B" },
          ].map((btn) => (
            <div key={btn.text} style={{
              background: `${btn.color}22`,
              border: `3px solid ${btn.color}`,
              borderRadius: "16px",
              padding: "16px 32px",
              fontSize: "20px",
              fontWeight: 700,
              color: btn.color,
            }}>
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
> = ({ backgroundColor, cardBg, accentColor, textColor, secondaryTextColor }) => {
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
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
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
