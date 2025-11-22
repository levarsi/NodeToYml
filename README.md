# NodeToYml

NodeToYml 是一个现代化的 Web 应用程序，旨在将各种代理节点配置转换为兼容 Clash Verge 的 YAML 文件。它拥有基于 Vue 3 和 Naive UI 构建的流畅、用户友好的界面。
![alt text](image.png)

## 功能特性

- **多协议支持**：无缝解析和转换以下协议的链接：
  - VMess (`vmess://`)
  - VLESS (`vless://`)
  - Trojan (`trojan://`)
  - Shadowsocks (`ss://`)
  - TUIC (`tuic://`)
  - Hysteria2 (`hysteria2://`, `hy2://`)
- **兼容 Clash Verge**：生成可直接用于 Clash Verge 的标准 YAML 配置。
- **智能去重**：自动检测并处理重复的节点名称，防止配置冲突。
- **现代化 UI**：使用 Naive UI 和 Lucide 图标设计的简洁响应式界面。
- **本地处理**：所有解析和转换逻辑均在浏览器本地运行，确保隐私和速度。

## 技术栈

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Naive UI](https://www.naiveui.com/) - Vue 3 组件库
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML 解析器和生成器
- [Lucide Vue Next](https://lucide.dev/) - 美观一致的图标库

## 快速开始

### 先决条件

- Node.js (建议版本 16.0 或更高)
- npm 或 yarn

### 安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/levarsi/NodeToYml.git
   cd NodeToYml
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

### 开发

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`（或终端中显示的 URL）。

### 构建

构建生产版本：

```bash
npm run build
```

构建产物将存储在 `dist/` 目录中。

### 预览构建

> [!WARNING] > **不能直接双击打开 `dist/index.html`！** 由于浏览器的 CORS 安全策略，通过 `file://` 协议无法加载 JavaScript 模块，页面会显示空白。

**推荐方法：使用 Vite 预览服务器**

```bash
npm run preview
```

然后在浏览器中访问 `http://localhost:4173` （或终端中显示的 URL）

要停止预览服务器，在终端中按 `Ctrl+C`

**其他预览方法：**

1. 使用 Python 简单服务器：

   ```bash
   cd dist
   python -m http.server 8080
   ```

   访问 `http://localhost:8080`

2. 使用 npx serve：

   ```bash
   npx serve dist
   ```

3. 部署到 Vercel/Netlify（推荐用于生产环境）- 参见下文部署章节

## 部署到 Vercel

本项目已配置好 Vercel 部署，只需几步即可上线：

### 方法一：通过 Vercel Dashboard（推荐）

1. 访问 [Vercel](https://vercel.com/) 并登录（可使用 GitHub 账号）
2. 点击 "Add New Project"
3. 导入您的 GitHub 仓库
4. Vercel 会自动检测到这是一个 Vite 项目并配置好构建设置
5. 点击 "Deploy" 开始部署

### 方法二：通过 Vercel CLI

1. 安装 Vercel CLI：

   ```bash
   npm install -g vercel
   ```

2. 在项目目录中运行：

   ```bash
   vercel
   ```

3. 按照提示完成部署

### 自动部署

将代码推送到 GitHub 后，Vercel 会自动：

- 检测到新的提交
- 自动构建和部署
- 为每个分支生成预览 URL
- 主分支自动部署到生产环境

## 部署到 Netlify

本项目也支持部署到 Netlify：

### 方法一：通过 Netlify Dashboard（推荐）

1. 访问 [Netlify](https://www.netlify.com/) 并登录（可使用 GitHub 账号）
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub 并授权访问您的仓库
4. 选择 NodeToYml 仓库
5. Netlify 会自动检测构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击 "Deploy site"

### 方法二：通过 Netlify CLI

1. 安装 Netlify CLI：

   ```bash
   npm install -g netlify-cli
   ```

2. 登录 Netlify：

   ```bash
   netlify login
   ```

3. 在项目目录中运行：

   ```bash
   netlify init
   ```

4. 部署：
   ```bash
   netlify deploy --prod
   ```

### 自动部署

配置完成后，Netlify 会自动：

- 监测 GitHub 仓库的提交
- 自动构建和部署
- 为每个 Pull Request 生成预览部署
- 主分支自动部署到生产环境

## 使用指南

1. **输入链接**：将您的代理节点链接（每行一个）粘贴到输入区域。
2. **转换**：点击转换按钮处理链接。
3. **获取结果**：应用程序将生成兼容 Clash 的 YAML 配置。您可以将其复制到剪贴板或下载为文件。

## 许可证

[MIT](LICENSE)
