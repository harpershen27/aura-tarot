# Aura Tarot 灵气塔罗

暗黑神秘风格的塔罗占卜网页。向牌灵提问 → 长按选 3 张牌 → 查看牌义与 AI 灵谕解读。

## 功能

- **向牌灵提问**：输入问题后开始抽牌
- **选牌**：78 张牌三排展示，鼠标长按 1.4 秒选牌，卡牌飞入「过去 / 现在 / 未来」卡槽
- **解读**：展示三张牌的正/逆位释义，并由 DeepSeek 生成综合灵谕
- **重新占卜**：一键重置，回到提问页

## 环境要求

- [Node.js](https://nodejs.org/) 18 或更高版本（推荐 LTS）
- DeepSeek API Key（用于灵谕解读，[注册地址](https://platform.deepseek.com/)）

## 快速开始

### 1. 安装依赖

在项目文件夹中打开终端（PowerShell 或 CMD），运行：

```bash
npm install
```

### 2. 配置 API Key

1. 复制 `.env.local.example` 为 `.env.local`
2. 打开 `.env.local`，将 `你的密钥` 替换为你的 DeepSeek API Key：

```
DEEPSEEK_API_KEY=sk-xxxxxxxx
```

> 没有 API Key 时，单牌解读仍可正常使用，灵谕区会提示配置错误。

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 4. 生产构建（可选）

```bash
npm run build
npm start
```

## 使用说明

1. 在首页输入你想问牌灵的问题
2. 点击「开始抽牌」进入选牌页
3. **按住鼠标左键不放**，在想要的牌上长按约 1.4 秒（会看到发光和进度条）
4. 依次选满 3 张牌后自动进入解读页
5. 阅读单牌释义和底部「灵谕」综合解读
6. 点击「重新占卜」开始新一轮

## 技术栈

- Next.js 15 + React 19
- Tailwind CSS 4
- Framer Motion（动画）
- DeepSeek Chat API（灵谕解读）

## 项目结构

```
├── app/                  # 页面与 API
│   ├── page.tsx          # 主页面（三屏流程）
│   └── api/oracle/       # DeepSeek 灵谕接口
├── components/           # 三个核心屏幕组件
├── data/tarot-deck.json  # 78 张牌中文释义
└── lib/                  # 类型与工具函数
```

## 常见问题

**Q: 长按没反应？**  
A: 请确保用鼠标左键按住卡牌不放，直到底部进度条填满（约 1.4 秒）。

**Q: 灵谕显示 API Key 错误？**  
A: 检查 `.env.local` 是否配置正确，修改后需重启 `npm run dev`。

**Q: 牌义可以离线看吗？**  
A: 可以。单牌解读数据内置在项目中，不依赖网络。灵谕解读需要联网调用 DeepSeek。
