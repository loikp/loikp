# 个人作品集网站

这是一个纯静态的个人作品集网站，支持在GitHub Pages和Cloudflare Pages上免费部署。

## 功能特性

- 个人介绍区（含营业平台链接）
- 纯绘画瀑布流展示（支持筛选）
- 稿件展示区（横向滑动+价目表）
- 动画展示区（播放列表）
- 谷子展示区（在售/已售状态）
- 原创漫画展示区（电子书阅读器）
- 资源下载区
- 微信赞赏码
- 响应式设计（支持移动端）
- 深色/浅色主题切换

## 项目结构

```
artist-portfolio/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── main.js        # JavaScript交互
├── images/            # 图片资源
│   ├── avatar.jpg     # 头像
│   ├── wechat-qr.jpg  # 微信赞赏码
│   ├── artwork*.jpg   # 绘画作品
│   ├── commission*.jpg # 稿件示例
│   ├── merch*.jpg     # 谷子图片
│   ├── resource*.jpg  # 资源图片
│   ├── character*.jpg # 漫画人设
│   └── comic/         # 漫画页面
│       └── chapter1/
│           ├── page1.jpg
│           ├── page2.jpg
│           └── ...
├── videos/            # 视频资源
│   └── *.mp4
└── downloads/         # 下载资源
    └── *.zip
```

## 本地预览

1. 克隆或下载项目
2. 使用任意静态服务器预览，例如：

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js (需要安装http-server)
npx http-server

# 使用PHP
php -S localhost:8000
```

3. 在浏览器中访问 `http://localhost:8000`

## 部署到 GitHub Pages

### 方法一：使用 GitHub 网页界面

1. 将项目上传到 GitHub 仓库
2. 进入仓库的 **Settings** 页面
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 下选择 **Deploy from a branch**
5. 选择 **main** 分支和 **/(root)** 目录
6. 点击 **Save**
7. 等待几分钟，网站将部署到 `https://你的用户名.github.io/仓库名`

### 方法二：使用 GitHub CLI

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库
gh repo create artist-portfolio --public --source=. --remote=origin

# 推送到 GitHub
git push -u origin main
```

然后在 GitHub 网页界面按照方法一的步骤配置 Pages。

## 部署到 Cloudflare Pages

### 方法一：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 标签
5. 点击 **Create a project**
6. 选择 **Upload assets**
7. 上传项目文件夹（排除 `node_modules` 等不必要的文件）
8. 点击 **Deploy site**

### 方法二：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
cd artist-portfolio
wrangler pages deploy . --project-name=artist-portfolio
```

### 方法三：连接 Git 仓库

1. 在 Cloudflare Pages 中选择 **Connect to Git**
2. 授权 GitHub 账户
3. 选择你的仓库
4. 配置构建设置：
   - **Framework preset**: None
   - **Build command**: (留空)
   - **Build output directory**: (留空，使用根目录)
5. 点击 **Save and Deploy**

## 自定义内容

### 修改个人信息

编辑 `index.html` 中的以下部分：

```html
<section id="about" class="section">
    <div class="about-text">
        <p>这里填写个人介绍...</p>
        <div class="social-links">
            <!-- 修改营业平台链接 -->
            <a href="https://lofter.com" target="_blank" rel="noopener noreferrer" class="social-link">
                Lofter
            </a>
            <!-- 添加更多平台 -->
        </div>
    </div>
    <div class="about-image">
        <img src="images/avatar.jpg" alt="头像" class="avatar">
    </div>
</section>
```

### 添加绘画作品

编辑 `js/main.js` 中的 `artworkData` 数组：

```javascript
const artworkData = [
    {
        id: 1,
        title: "作品标题",
        date: "2024年1月",
        image: "images/artwork1.jpg",
        tags: ["原创", "角色名"],
        category: "original" // 或 "fanart"
    },
    // 添加更多作品...
];
```

### 添加稿件示例

编辑 `js/main.js` 中的 `commissionData` 数组：

```javascript
const commissionData = [
    {
        id: 1,
        title: "稿件示例",
        image: "images/commission1.jpg",
        ratio: "portrait" // "portrait"(竖向A4), "square"(1:1), "landscape"(横向A4)
    },
    // 添加更多稿件...
];
```

### 修改价目表

编辑 `index.html` 中的价目表部分：

```html
<div class="pricing-table">
    <h3>价目表</h3>
    <table>
        <tbody>
            <tr>
                <td>类型</td>
                <td>价格</td>
                <td>说明</td>
            </tr>
            <!-- 修改或添加行 -->
        </tbody>
    </table>
</div>
```

### 添加动画作品

编辑 `js/main.js` 中的 `animationData` 数组：

```javascript
const animationData = [
    {
        id: 1,
        title: "动画标题",
        video: "videos/animation1.mp4",
        poster: "images/video-poster1.jpg"
    },
    // 添加更多动画...
];
```

### 添加谷子

编辑 `js/main.js` 中的 `merchData` 数组：

```javascript
const merchData = [
    {
        id: 1,
        title: "谷子名称",
        price: "¥50",
        image: "images/merch1.jpg",
        link: "https://购买链接.com",
        sold: false // true 表示已售完
    },
    // 添加更多谷子...
];
```

### 添加漫画

1. 将漫画页面按章节放入 `images/comic/chapter1/` 目录
2. 命名为 `page1.jpg`, `page2.jpg`, ...
3. 编辑 `js/main.js` 中的 `comicData`：

```javascript
const comicData = {
    chapters: [
        {
            id: 1,
            title: "第一章",
            pages: 10 // 总页数
        },
        // 添加更多章节...
    ],
    characters: [
        {
            name: "角色名",
            image: "images/character1.jpg"
        },
        // 添加更多角色...
    ]
};
```

### 添加资源

编辑 `js/main.js` 中的 `resourceData` 数组：

```javascript
const resourceData = [
    {
        id: 1,
        title: "资源名称",
        image: "images/resource1.jpg",
        link: "downloads/resource1.zip"
    },
    // 添加更多资源...
];
```

### 修改微信赞赏码

将你的微信赞赏码图片命名为 `wechat-qr.jpg`，放入 `images/` 目录。

## 主题自定义

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --primary: #6366f1;      /* 主色调 */
    --secondary: #8b5cf6;    /* 次要色调 */
    --background: #ffffff;    /* 背景色 */
    --text: #0f172a;          /* 文字颜色 */
    /* 更多变量... */
}
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT License

## 技术栈

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- 无外部依赖

## 常见问题

### 图片不显示

确保图片路径正确，并且图片文件已上传到正确的目录。

### 主题切换不生效

清除浏览器缓存或检查 `localStorage` 是否被禁用。

### 移动端显示异常

确保在移动设备上使用 HTTPS 访问（GitHub Pages 和 Cloudflare Pages 默认提供 HTTPS）。

### 漫画翻页不工作

检查漫画页面图片是否按正确命名和放置在 `images/comic/chapter1/` 目录中。
