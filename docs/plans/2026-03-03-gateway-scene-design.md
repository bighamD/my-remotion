# Gateway 场景设计文档

**日期**: 2026-03-03
**项目**: Remotion Video - OpenClaw Architecture
**场景**: Gateway 核心功能解析

## 概述

在 OpenClawArchitecture 视频中添加 Gateway 场景作为场景 2，展示 Gateway 作为所有请求第一站的核心功能。场景采用手绘粉笔风格，时长 10 秒（300 帧）。

## 集成方式

- **位置**: OpenClawArchitecture.tsx 场景序列中的场景 2
- **插入位置**: 在场景 1（整体架构概览）之后
- **时长**: 300 帧（10 秒），与其他场景对齐
- **实现方式**: 新增 `GatewayScene` 组件

## 场景布局

```
┌─────────────────────────────────────────────────┐
│  标题: Gateway: 所有请求的第一站                  │
├──────────────────┬──────────────────────────────┤
│  左侧：入口感知区  │  右侧：功能矩阵（四象限）        │
│  ┌────┐    ┌───┐ │  ┌────┬────┐                  │
│  │服务器│  │门│ │  │ Q1 │ Q2 │                  │
│  └────┘    └───┘ │  ├────┼────┤                  │
│                 │  │ Q3 │ Q4 │                  │
│  用户请求入口    │  └────┴────┘                  │
├──────────────────┴──────────────────────────────┤
│  动态流程线 → 出口门 + 对话气泡                   │
│  警示语: 无 Gateway，系统无法识别用户指令         │
└─────────────────────────────────────────────────┘
```

## 组件分解

### 1. 标题层 (帧 0-60)

**内容:**
- 主标题："Gateway: 所有请求的第一站"
- Gateway 文字颜色：粉笔红 (#FF5A36)
- 其余文字颜色：白色 (#FFFFFF)

**样式:**
- 字体：手写感字体（Google Fonts 'Patrick Hand'）
- 特效：text-shadow 模拟粉笔边缘模糊
  ```css
  text-shadow: 0 0 1px rgba(255,255,255,0.8),
               0 0 2px rgba(255,255,255,0.5);
  ```

**动画:**
- 使用 Remotion spring 淡入
- 轻微缩放效果 (scale: 0.95 → 1.0)

### 2. 左侧入口感知区 (帧 60-180)

**图标元素:**
- 服务器机柜：手绘风格，不规则矩形
- 开启的门：带角度的门板，展示内部
- SVG 实现配合 CSS filter: blur(0.5px)

**文字说明:**
- "用户请求入口：网页/手机/聊天软件"

**动画:**
- 门从关闭到打开（transform: rotateY）
- 文字从左侧滑入
- 服务器图标淡入

### 3. 右侧功能矩阵 (帧 120-240)

**布局:**
- 四象限网格，使用白色粉笔线分隔
- 每个象限包含一个功能模块

**样式:**
- SVG 粉笔线条绘制分隔线
- stroke-width: 2-3px
- stroke-linecap: round

**动画:**
- 网格线从左上角绘制延伸
- 四个象限依次淡入（间隔 20 帧）

### 4. 动态流程线 (帧 180-300)

**路径 A:**
- 从"多用户隔离"绿色箭头 → 紫色细线 → 模块

**路径 B:**
- 模块 → 紫色箭头向下 → 出口门

**出口元素:**
- 窄门（带圆拉手）
- 对话气泡（带省略号 "..."）

**动画:**
- SVG stroke-dasharray 实现线条绘制动画
- 箭头沿路径移动
- 出口门和气泡淡入

### 5. 底部警示语 (帧 240-300)

**内容:**
- "无 Gateway，系统无法识别用户指令"

**样式:**
- 颜色：淡紫色 (#B8A9C9)
- 字体：同标题层手写字体

**动画:**
- 底部向上滑入 + 淡入

## 技术实现

### 字体资源

```typescript
// 在 Root.tsx 或 index.css 中引入
import "@fontsource/patrick-hand";
```

### 组件结构

```typescript
// GatewayScene 组件
const GatewayScene: React.FC<{
  frame: number;
  accentColor: string;
  textColor: string;
}> = ({ frame, accentColor, textColor }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F0F1A" }}>
      {/* 1. 标题层 */}
      <TitleLayer frame={frame} />

      {/* 2. 左侧入口区 */}
      <EntrySection frame={frame} />

      {/* 3. 右侧功能矩阵 */}
      <FunctionalMatrix frame={frame} />

      {/* 4. 动态流程线 */}
      <DataFlowLines frame={frame} />

      {/* 5. 底部警示语 */}
      <FooterWarning frame={frame} />
    </AbsoluteFill>
  );
};
```

### SVG 图标示例

```typescript
const ServerIcon = () => (
  <svg viewBox="0 0 100 120" className="chalk-style">
    {/* 服务器机柜 */}
    <path d="M20,10 L80,10 L85,30 L15,30 Z" fill="none" stroke="white" strokeWidth="2" />
    <path d="M20,35 L80,35 L85,55 L15,55 Z" fill="none" stroke="white" strokeWidth="2" />
    <path d="M20,60 L80,60 L85,80 L15,80 Z" fill="none" stroke="white" strokeWidth="2" />
    {/* 机柜细节 */}
    <circle cx="30" cy="20" r="3" fill="#4CAF50" />
    <circle cx="30" cy="45" r="3" fill="#4CAF50" />
    <circle cx="30" cy="70" r="3" fill="#FF5A36" />
  </svg>
);
```

### CSS 样式

```css
.chalk-text {
  font-family: 'Patrick Hand', cursive;
  text-shadow: 0 0 1px rgba(255,255,255,0.8),
               0 0 2px rgba(255,255,255,0.5);
}

.chalk-line {
  filter: blur(0.3px);
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

.chalk-icon {
  filter: drop-shadow(0 0 1px rgba(255,255,255,0.5));
}
```

### 动画时序

| 帧范围 | 元素 | 动画 |
|--------|------|------|
| 0-60 | 标题 | spring 淡入 + 缩放 |
| 60-120 | 左侧图标 | 淡入 |
| 60-180 | 门动画 | 打开动画 |
| 80-140 | 入口文字 | 滑入 |
| 120-180 | 功能矩阵网格 | 线条绘制 |
| 140-240 | 四象限 | 依次淡入 |
| 180-300 | 流程线 | 路径动画 |
| 240-300 | 警示语 | 上滑 + 淡入 |

## 集成步骤

1. **更新 OpenClawArchitecture.tsx**
   - 导入 Google Font（Patrick Hand）
   - 添加 `GatewayScene` 组件
   - 调整 Sequence 顺序，将 Gateway 作为场景 2

2. **添加 CSS 样式**
   - 在 index.css 中添加粉笔样式类

3. **创建子组件**
   - TitleLayer
   - EntrySection
   - FunctionalMatrix
   - DataFlowLines
   - FooterWarning

4. **测试动画**
   - 在 Remotion Studio 中预览
   - 调整时序和缓动参数

## 设计决策

### 为什么选择 SVG + CSS？

- ✅ 纯 CSS 实现手绘效果不够真实
- ✅ 外部图片资源增加加载时间
- ✅ SVG 可缩放，性能好
- ✅ 易于动画和控制

### 为什么场景 2 位置？

- 场景 1 是整体架构概览
- Gateway 是请求的第一站，逻辑上应该在展示具体组件之前
- 为后续详细场景做好铺垫

### 10 秒时长是否足够？

- 大多数元素有重叠的动画时间
- 关键信息都能清晰展示
- 保持与其他场景一致的节奏

## 后续优化

- [ ] 根据实际测试调整动画时序
- [ ] 优化 SVG 路径以获得更好的手绘效果
- [ ] 添加音效（如粉笔书写声）
- [ ] 考虑添加背景粒子效果增强氛围

## 参考资料

- [Remotion 文档](https://www.remotion.dev/docs)
- [SVG 动画技巧](https://css-tricks.com/using-svg/)
- [手绘字体资源](https://fonts.google.com/)
