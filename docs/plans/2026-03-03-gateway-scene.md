# Gateway 场景实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 OpenClawArchitecture.tsx 中添加 Gateway 场景（场景 2），展示 Gateway 作为所有请求第一站的核心功能，采用手绘粉笔风格。

**Architecture:** 在 OpenClawArchitecture.tsx 中添加新的 GatewayScene 组件，使用 SVG 图标和 CSS 效果实现手绘粉笔风格。该场景将作为场景 2 插入到现有场景序列中（在场景 1 之后）。

**Tech Stack:** Remotion 4.0.422, React 19, TypeScript, Tailwind CSS v4, SVG + CSS 动画, Google Fonts (Patrick Hand)

---

## Task 1: 添加手写字体资源

**Files:**
- Modify: `src/index.css`
- Run: `pnpm add @fontsource/patrick-hand`

**Step 1: 安装字体包**

Run: `pnpm add @fontsource/patrick-hand`
Expected: Package installed successfully

**Step 2: 在 index.css 中导入字体**

Add to `src/index.css`:

```css
@import "@fontsource/patrick-hand/index.css";

/* 手绘粉笔样式 */
.chalk-text {
  font-family: 'Patrick Hand', cursive;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.8),
               0 0 2px rgba(255, 255, 255, 0.5);
}

.chalk-line {
  filter: blur(0.3px);
}

.chalk-icon {
  filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.5));
}

/* 粉笔红颜色 */
.chalk-red {
  color: #FF5A36;
}

/* 淡紫色 */
.chalk-purple {
  color: #B8A9C9;
}
```

**Step 3: 提交更改**

Run:
```bash
git add src/index.css package.json pnpm-lock.yaml
git commit -m "feat: 添加手写粉笔字体和样式

- 安装 Patrick Hand 字体
- 添加 .chalk-text, .chalk-line, .chalk-icon 样式类
- 添加粉笔红和淡紫色辅助类

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: 创建 GatewayScene 主组件

**Files:**
- Create: `src/GatewayScene.tsx`
- Modify: `src/OpenClawArchitecture.tsx`

**Step 1: 创建 GatewayScene.tsx 文件**

Create `src/GatewayScene.tsx`:

```typescript
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
} from "remotion";
import { z } from "zod";

export const gatewaySceneSchema = z.object({
  backgroundColor: z.string(),
  accentColor: z.string(),
  textColor: z.string(),
});

type GatewaySceneProps = z.infer<typeof gatewaySceneSchema>;

export const GatewayScene: React.FC<GatewaySceneProps> = ({
  backgroundColor,
  accentColor,
  textColor,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* 场景内容将在后续任务中添加 */}
    </AbsoluteFill>
  );
};
```

**Step 2: 在 OpenClawArchitecture.tsx 中导入并使用**

在 `src/OpenClawArchitecture.tsx` 顶部添加导入:

```typescript
import { GatewayScene, gatewaySceneSchema } from "./GatewayScene";
```

在场景序列中添加（找到场景 1 的 Sequence，在其后添加）:

```typescript
// 场景 1: 整体架构概览
<Sequence from={0} durationInFrames={SCENE_DURATION}>
  <OverallArchitectureScene
    frame={frame}
    accentColor={accentColor}
    textColor={textColor}
  />
</Sequence>

// 场景 2: Gateway 核心功能解析
<Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
  <GatewayScene
    frame={frame - SCENE_DURATION}
    accentColor={accentColor}
    textColor={textColor}
  />
</Sequence>

// 后续场景的 from 值需要相应调整...
```

**Step 3: 更新后续场景的 from 值**

将所有后续场景的 `from` 值增加 `SCENE_DURATION`:

```typescript
// 场景 3: 原 scene 2
<Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>

// 场景 4: 原 scene 3
<Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>

// ... 以此类推
```

**Step 4: 在 RemotionRoot 中更新 schema**

修改 `src/Root.tsx` 中的 OpenClawArchitecture schema:

```typescript
import {
  openClawArchitectureSchema,
  GatewayScene,
} from "./OpenClawArchitecture";
```

**Step 5: 提交更改**

Run:
```bash
git add src/GatewayScene.tsx src/OpenClawArchitecture.tsx src/Root.tsx
git commit -m "feat: 添加 GatewayScene 主组件框架

- 创建 GatewayScene 组件文件
- 将 Gateway 场景插入为场景 2
- 更新后续场景的起始帧位置

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: 创建标题层组件

**Files:**
- Modify: `src/GatewayScene.tsx`

**Step 1: 在 GatewayScene.tsx 中添加 TitleLayer 组件**

在 GatewayScene 组件内部添加:

```typescript
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
```

**Step 2: 在 GatewayScene 中使用 TitleLayer**

在 GatewayScene 的 return 中添加:

```typescript
return (
  <AbsoluteFill style={{ backgroundColor }}>
    <TitleLayer frame={frame} accentColor={accentColor} />
  </AbsoluteFill>
);
```

**Step 3: 测试预览**

Run: `pnpm dev`
Expected: 可以在 Remotion Studio 中看到 Gateway 场景，标题从第 0 帧开始淡入并缩放

**Step 4: 提交更改**

Run:
```bash
git add src/GatewayScene.tsx
git commit -m "feat: 添加 Gateway 场景标题层

- 实现带动画的标题组件
- Gateway 文字使用粉笔红，其余为白色
- 添加淡入和缩放动画效果

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: 创建入口感知区组件（左侧）

**Files:**
- Modify: `src/GatewayScene.tsx`

**Step 1: 添加服务器和门的 SVG 图标**

在 GatewayScene.tsx 中添加 SVG 组件:

```typescript
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
```

**Step 2: 创建 EntrySection 组件**

```typescript
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
```

**Step 3: 在 GatewayScene 中添加 EntrySection**

```typescript
return (
  <AbsoluteFill style={{ backgroundColor }}>
    <TitleLayer frame={frame} accentColor={accentColor} />
    <EntrySection frame={frame} />
  </AbsoluteFill>
);
```

**Step 4: 提交更改**

Run:
```bash
git add src/GatewayScene.tsx
git commit -m "feat: 添加入口感知区组件

- 创建手绘风格的服务器和门 SVG 图标
- 实现门的打开动画（rotateY）
- 添加入口说明文字滑入效果

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: 创建功能矩阵组件（右侧四象限）

**Files:**
- Modify: `src/GatewayScene.tsx`

**Step 1: 添加四象限网格和模块组件**

```typescript
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
```

**Step 2: 在 GatewayScene 中添加 FunctionalMatrix**

```typescript
return (
  <AbsoluteFill style={{ backgroundColor }}>
    <TitleLayer frame={frame} accentColor={accentColor} />
    <EntrySection frame={frame} />
    <FunctionalMatrix frame={frame} />
  </AbsoluteFill>
);
```

**Step 3: 提交更改**

Run:
```bash
git add src/GatewayScene.tsx
git commit -m "feat: 添加功能矩阵组件

- 创建四象限网格布局（手绘风格）
- 实现四个功能模块依次淡入
- 每个模块带有不同的颜色标识

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 6: 创建动态流程线组件

**Files:**
- Modify: `src/GatewayScene.tsx`

**Step 1: 添加流程线 SVG 和出口元素**

```typescript
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
```

**Step 2: 在 GatewayScene 中添加 DataFlowLines**

```typescript
return (
  <AbsoluteFill style={{ backgroundColor }}>
    <TitleLayer frame={frame} accentColor={accentColor} />
    <EntrySection frame={frame} />
    <FunctionalMatrix frame={frame} />
    <DataFlowLines frame={frame} />
  </AbsoluteFill>
);
```

**Step 3: 提交更改**

Run:
```bash
git add src/GatewayScene.tsx
git commit -m "feat: 添加动态流程线组件

- 实现紫色流程线的路径绘制动画
- 添加出口门和对话气泡图标
- 从功能矩阵连接到出口的视觉流程

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 7: 创建底部警示语组件

**Files:**
- Modify: `src/GatewayScene.tsx`

**Step 1: 添加 FooterWarning 组件**

```typescript
const FooterWarning: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = spring({
    frame: Math.max(0, frame - 240),
    fps: 30,
    config: { damping: 15, stiffness: 100 },
  });

  const slideUp = interpolate(frame, [240, 280], [100, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="chalk-text chalk-purple"
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${slideUp}px)`,
      }}
    >
      <p
        style={{
          fontSize: 32,
          margin: 0,
          textAlign: "center",
          color: "#B8A9C9",
        }}
      >
        无 Gateway，系统无法识别用户指令
      </p>
    </div>
  );
};
```

**Step 2: 在 GatewayScene 中添加 FooterWarning**

```typescript
return (
  <AbsoluteFill style={{ backgroundColor }}>
    <TitleLayer frame={frame} accentColor={accentColor} />
    <EntrySection frame={frame} />
    <FunctionalMatrix frame={frame} />
    <DataFlowLines frame={frame} />
    <FooterWarning frame={frame} />
  </AbsoluteFill>
);
```

**Step 3: 完整的 GatewayScene 组件**

最终组件应该看起来像这样:

```typescript
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
} from "remotion";
import { z } from "zod";

export const gatewaySceneSchema = z.object({
  backgroundColor: z.string(),
  accentColor: z.string(),
  textColor: z.string(),
});

type GatewaySceneProps = z.infer<typeof gatewaySceneSchema>;

export const GatewayScene: React.FC<GatewaySceneProps> = ({
  backgroundColor,
  accentColor,
  textColor,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <TitleLayer frame={frame} accentColor={accentColor} />
      <EntrySection frame={frame} />
      <FunctionalMatrix frame={frame} />
      <DataFlowLines frame={frame} />
      <FooterWarning frame={frame} />
    </AbsoluteFill>
  );
};
```

**Step 4: 提交更改**

Run:
```bash
git add src/GatewayScene.tsx
git commit -m "feat: 添加底部警示语组件

- 实现淡紫色警示文字
- 添加向上滑入和淡入动画
- 完成 Gateway 场景所有组件

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 8: 测试和优化

**Files:**
- Test: Manual testing in Remotion Studio

**Step 1: 启动开发服务器**

Run: `pnpm dev`
Expected: Remotion Studio 打开

**Step 2: 预览 Gateway 场景**

1. 在左侧面板选择 "OpenClawArchitecture"
2. 拖动时间轴到场景 2（帧 300-600）
3. 播放场景并观察所有动画

**检查项:**
- [ ] 标题在第 0-60 帧淡入并缩放
- [ ] 服务器和门在第 60-180 帧出现
- [ ] 门在第 90-150 帧左右打开
- [ ] 入口文字从左滑入
- [ ] 功能矩阵网格在第 120-180 帧出现
- [ ] 四个模块依次淡入（第 140-200 帧）
- [ ] 流程线在第 180-300 帧绘制
- [ ] 警示语在第 240-300 帧从下向上滑入

**Step 3: 调整动画时序（如果需要）**

如果动画太快或太慢，调整 spring 配置:

```typescript
// 更慢的动画
spring({
  frame,
  fps: 30,
  config: { damping: 20, stiffness: 60 }, // 降低 stiffness
})

// 更快的动画
spring({
  frame,
  fps: 30,
  config: { damping: 10, stiffness: 120 }, // 增加 stiffness
})
```

**Step 4: 渲染测试视频片段**

Run:
```bash
npx remotion render OpenClawArchitecture out/gateway-test.mp4 \
  --sequence-index=1 \
  --frames=300-600 \
  --width=1920 \
  --height=1080
```

Expected: 输出 gateway-test.mp4，时长 10 秒

**Step 5: 验证输出视频**

播放 `out/gateway-test.mp4` 确认:
- [ ] 动画流畅
- [ ] 所有文字清晰可读
- [ ] 颜色符合设计要求
- [ ] 手绘风格效果明显

**Step 6: 提交最终优化**

如果有调整，提交更改:

Run:
```bash
git add src/GatewayScene.tsx
git commit -m "fix: 优化 Gateway 场景动画时序

- 调整 spring 配置以获得更流畅的动画
- 优化文字和图标的时间对齐
- 确保所有动画在 300 帧内完成

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 9: 文档更新和最终提交

**Files:**
- Update: `README.md` (if exists)
- Create: `src/components/GatewayScene/README.md` (optional)

**Step 1: 更新项目 README（如果需要）**

在项目根目录的 README.md 中添加 Gateway 场景说明:

```markdown
## 场景列表

OpenClawArchitecture 包含以下场景：

1. **整体架构概览** - 展示 OpenClaw 的高层架构
2. **Gateway 核心功能解析** - 展示 Gateway 作为请求第一站的功能
3. ... (其他场景)
```

**Step 2: 创建组件文档（可选）**

创建 `src/components/GatewayScene/README.md`:

```markdown
# GatewayScene 组件

Gateway 核心功能解析场景，采用手绘粉笔风格。

## 动画时序

| 帧范围 | 元素 | 动画 |
|--------|------|------|
| 0-60 | 标题 | spring 淡入 + 缩放 |
| 60-180 | 左侧入口区 | 图标淡入 + 门打开 |
| 80-140 | 入口文字 | 滑入 |
| 120-180 | 功能矩阵网格 | 线条绘制 |
| 140-240 | 四象限 | 依次淡入 |
| 180-300 | 流程线 | 路径动画 |
| 240-300 | 警示语 | 上滑 + 淡入 |

## 组件结构

- TitleLayer: 标题层
- EntrySection: 入口感知区（左侧）
- FunctionalMatrix: 功能矩阵（右侧）
- DataFlowLines: 动态流程线
- FooterWarning: 底部警示语
```

**Step 3: 最终 Git 提交**

Run:
```bash
git status
git add .
git commit -m "docs: 完成 Gateway 场景文档

- 更新项目 README 场景列表
- 添加 GatewayScene 组件文档
- 记录动画时序和组件结构

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## 验收标准

完成所有任务后，应该满足以下标准:

1. ✅ Gateway 场景正确显示在 OpenClawArchitecture 的场景 2 位置
2. ✅ 所有动画在 300 帧（10 秒）内完成
3. ✅ 手绘粉笔风格效果明显
4. ✅ 所有文字清晰可读
5. ✅ 流程线动画流畅
6. ✅ 没有控制台错误或警告
7. ✅ 渲染的视频质量良好

## 参考资料

- [Remotion Spring 动画文档](https://www.remotion.dev/docs/spring)
- [Remotion Sequence 文档](https://www.remotion.dev/docs/sequence)
- [SVG Path 动画技巧](https://css-tricks.com/svg-line-animation-works/)
- 设计文档: `docs/plans/2026-03-03-gateway-scene-design.md`
