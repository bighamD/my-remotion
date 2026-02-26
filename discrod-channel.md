报告长官！已为您整理好一份清晰的 Discord 通道配置教程 😎

---

## OpenClaw Discord 通道配置教程（新手版）

### 一、前期准备

1. **注册 Discord 账号**（如果没有的话）
2. **安装 Node.js**（OpenClaw 需要）

---

### 二、创建 Discord Bot

#### 1. 进入 Discord 开发者门户

访问：https://discord.com/developers/applications

#### 2. 创建应用

- 点击右上角 **"New Application"**
- 输入应用名称（如：`OpenClaw-Bot`）
- 点击 **"Create"**

#### 3. 创建 Bot

- 左侧菜单点击 **"Bot"**
- 点击 **"Add Bot"** → **"Yes, do it!"**

#### 4. 复制 Bot Token

- 在 **"Build-A-Bot"** 部分，点击 **"Reset Token"**（首次）
- 复制生成的 **Token**（⚠️ 只会显示一次，请立即保存！）

---

### 三、开启必要的权限

在 **Bot** 页面的 **"Privileged Gateway Intents"** 部分，勾选：

- ✅ **Message Content Intent**（必须！否则无法读取消息）
- ✅ **Server Members Intent**（推荐，用于用户查找）

---

### 四、邀请 Bot 到服务器

#### 1. 生成邀请链接

- 左侧菜单点击 **"OAuth2"** → **"URL Generator"**

#### 2. 选择 Scopes（作用域）

- ✅ **bot**
- ✅ **applications.commands**

#### 3. 选择 Bot Permissions（权限）

- ✅ View Channels（查看频道）
- ✅ Send Messages（发送消息）
- ✅ Read Message History（阅读消息历史）
- ✅ Embed Links（嵌入链接）
- ✅ Attach Files（上传文件）
- ✅ Add Reactions（添加表情）

#### 4. 复制生成的链接，在浏览器中打开

- 选择你的服务器
- 点击 **"授权"**

---

### 五、获取必要的 ID

1. **开启开发者模式**
   - Discord 设置 → **Advanced** → **Developer Mode**（开启）

2. **复制 ID**
   - 右键点击服务器名称 → **Copy Server ID**（Guild ID）
   - 右键点击你的用户 → **Copy User ID**（User ID）
   - 右键点击频道（如 `#general`）→ **Copy Channel ID**（Channel ID）

---

### 六、配置 OpenClaw

#### 方法 1：使用环境变量（推荐）

在终端中设置：

```bash
export DISCORD_BOT_TOKEN="你的_Bot_Token"
```

#### 方法 2：使用配置文件

编辑 OpenClaw 配置文件（通常在 `~/.openclaw/config.json`）：

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "你的_Bot_Token",
      dm: {
        enabled: true,
        policy: "pairing", // 新用户需要配对验证
      },
      guilds: {
        你的_Guild_ID: {
          users: ["你的_User_ID"], // 只允许你的 Discord 用户
          channels: {
            你的_Channel_ID: {
              // 指定允许的频道
              allow: true,
              requireMention: true, // 需要 @提及才会响应
            },
          },
        },
      },
    },
  },
}
```

---

### 七、启动 OpenClaw

```bash
openclaw gateway start
```

---

### 八、测试

1. 在配置的 Discord 频道中，**@你的 Bot** 发送消息：

   ```
   @OpenClaw-Bot 你好
   ```

2. 如果是第一次 DM（私聊），Bot 会返回一个配对码，在终端中执行：
   ```bash
   openclaw pairing approve discord <配对码>
   ```

---

### 九、故障排查

#### 问题 1：Bot 连接但不响应

- 确认已开启 **Message Content Intent**
- 确认 Bot 有频道权限
- 检查配置是否正确

#### 问题 2：DM 无法使用

- 检查 `dm.enabled: true`
- 检查是否已通过配对验证

#### 问题 3：频道无响应

- 确认配置了 `guilds` 规则
- 确认频道已加入 allowlist
- 确认是否需要 @提及（`requireMention: true`）

---

### 十、高级配置（可选）

#### 允许所有用户（不推荐生产环境）

```json5
{
  channels: {
    discord: {
      dm: {
        policy: "open",
        allowFrom: ["*"],
      },
    },
  },
}
```

#### 多服务器配置

```json5
{
  channels: {
    discord: {
      guilds: {
        Guild_ID_1: {
          slug: "服务器1",
          requireMention: true,
        },
        Guild_ID_2: {
          slug: "服务器2",
          requireMention: false, // 此服务器不需要 @
        },
      },
    },
  },
}
```

---

### 📚 官方文档链接

- OpenClaw Discord 文档：https://docs.openclaw.ai/channels/discord
- OpenClaw GitHub：https://github.com/openclaw/openclaw

---

### ⚠️ 安全提醒

1. **不要泄露 Bot Token**！这相当于你的密码
2. 只授予必要的权限
3. 在生产环境中使用环境变量存储敏感信息

---

完成！现在你的朋友应该可以按照这个教程配置 Discord 通道了 🎉

需要我进一步解释某个步骤吗，长官？
