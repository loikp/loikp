# 快速开始指南

## 5分钟快速部署

### 第一步：准备图片

1. 打开 `placeholders.html` 文件
2. 右键保存需要的占位图片到 `images/` 目录
3. 或者直接使用你自己的图片

### 第二步：修改个人信息

编辑 `index.html`，找到 `<section id="about">` 部分：

```html
<p>这里填写个人介绍...</p>
```

替换为你的个人介绍。

修改营业平台链接：

```html
<a href="https://你的链接.com" target="_blank" rel="noopener noreferrer" class="social-link">
    平台名称
</a>
```

### 第三步：添加作品

编辑 `js/main.js`，修改数据数组：

**绘画作品：**
```javascript
const artworkData = [
    {
        id: 1,
        title: "你的作品标题",
        date: "2024年1月",
        image: "images/你的图片.jpg",
        tags: ["原创", "角色名"],
        category: "original"
    }
];
```

**稿件示例：**
```javascript
const commissionData = [
    {
        id: 1,
        title: "稿件标题",
        image: "images/稿件图片.jpg",
        ratio: "portrait" // portrait/square/landscape
    }
];
```

**谷子：**
```javascript
const merchData = [
    {
        id: 1,
        title: "谷子名称",
        price: "¥50",
        image: "images/谷子图片.jpg",
        link: "https://购买链接.com",
        sold: false
    }
];
```

### 第四步：本地预览

```bash
# 进入项目目录
cd artist-portfolio

# 使用 Python 启动本地服务器
python -m http.server 8000

# 或使用 Node.js
npx http-server
```

在浏览器访问：`http://localhost:8000`

### 第五步：部署

#### 选项A：GitHub Pages

1. 创建 GitHub 仓库
2. 上传所有文件
3. 进入 Settings → Pages
4. 选择 main 分支和 /(root) 目录
5. 保存，等待部署完成

#### 选项B：Cloudflare Pages

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 创建 Pages 项目
4. 上传项目文件夹
5. 部署完成

## 常见修改

### 修改主题颜色

编辑 `css/style.css`：

```css
:root {
    --primary: #6366f1;      /* 修改主色调 */
    --secondary: #8b5cf6;    /* 修改次要色调 */
}
```

### 修改价目表

编辑 `index.html`，找到价目表部分：

```html
<tr>
    <td>类型</td>
    <td>价格</td>
    <td>说明</td>
</tr>
```

### 添加漫画章节

1. 创建新目录 `images/comic/chapter2/`
2. 放入页面图片 `page1.jpg`, `page2.jpg` 等
3. 编辑 `js/main.js`：

```javascript
const comicData = {
    chapters: [
        {
            id: 1,
            title: "第一章",
            pages: 10
        },
        {
            id: 2,
            title: "第二章",
            pages: 15
        }
    ]
};
```

### 添加动画

1. 将视频文件放入 `videos/` 目录
2. 编辑 `js/main.js`：

```javascript
const animationData = [
    {
        id: 1,
        title: "动画标题",
        video: "videos/你的视频.mp4",
        poster: "images/封面.jpg"
    }
];
```

## 图片尺寸参考

| 类型 | 推荐尺寸 | 说明 |
|------|---------|------|
| 头像 | 300x300 | 正方形 |
| 微信赞赏码 | 200x200 | 正方形 |
| 绘画作品 | 任意比例 | 宽度至少 800px |
| 稿件-竖向A4 | 595x842 | 竖向 |
| 稿件-1:1 | 400x400 | 正方形 |
| 稿件-横向A4 | 842x595 | 横向 |
| 动画封面 | 1280x720 | 16:9 |
| 谷子 | 500x500 | 正方形 |
| 漫画人设 | 600x800 | 竖向 |
| 漫画页面 | 800x1200 | 竖向 |
| 资源图片 | 500x500 | 正方形 |

## 需要帮助？

查看完整文档：[README.md](README.md)

## 下一步

- 自定义网站样式
- 添加更多作品
- 优化图片大小
- 添加自定义域名
- 配置 SEO 元数据
