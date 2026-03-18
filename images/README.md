# 图片资源准备指南

本目录需要放置以下图片资源：

## 必需图片

### 1. 头像
- 文件名：`avatar.jpg`
- 尺寸：建议 300x300 像素
- 格式：JPG 或 PNG
- 用途：个人介绍区的头像

### 2. 微信赞赏码
- 文件名：`wechat-qr.jpg`
- 尺寸：建议 200x200 像素
- 格式：JPG 或 PNG
- 用途：支持区的微信赞赏码

## 绘画作品图片

### 命名规则
- 文件名：`artwork1.jpg`, `artwork2.jpg`, `artwork3.jpg`, ...
- 尺寸：任意比例，建议宽度至少 800px
- 格式：JPG 或 PNG
- 用途：纯绘画瀑布流展示

### 数量
根据你的作品数量，修改 `js/main.js` 中的 `artworkData` 数组

## 稿件示例图片

### 命名规则
- 文件名：`commission1.jpg`, `commission2.jpg`, `commission3.jpg`, ...
- 尺寸：
  - 竖向A4：建议 595x842 像素
  - 1:1：建议 400x400 像素
  - 横向A4：建议 842x595 像素
- 格式：JPG 或 PNG
- 用途：稿件展示区横向滑动

### 数量
根据你的稿件数量，修改 `js/main.js` 中的 `commissionData` 数组

## 动画封面图片

### 命名规则
- 文件名：`video-poster1.jpg`, `video-poster2.jpg`, ...
- 尺寸：建议 1280x720 像素 (16:9)
- 格式：JPG 或 PNG
- 用途：动画播放器的封面图

### 数量
与动画视频数量对应，修改 `js/main.js` 中的 `animationData` 数组

## 谷子图片

### 命名规则
- 文件名：`merch1.jpg`, `merch2.jpg`, `merch3.jpg`, ...
- 尺寸：建议 500x500 像素 (1:1)
- 格式：JPG 或 PNG
- 用途：谷子展示区

### 数量
根据谷子数量，修改 `js/main.js` 中的 `merchData` 数组

## 漫画人设图片

### 命名规则
- 文件名：`character1.jpg`, `character2.jpg`, `character3.jpg`, ...
- 尺寸：建议宽度至少 600px
- 格式：JPG 或 PNG
- 用途：漫画人设展示

### 数量
根据角色数量，修改 `js/main.js` 中的 `comicData.characters` 数组

## 漫画页面图片

### 目录结构
```
images/
└── comic/
    └── chapter1/
        ├── page1.jpg
        ├── page2.jpg
        ├── page3.jpg
        └── ...
```

### 命名规则
- 文件名：`page1.jpg`, `page2.jpg`, `page3.jpg`, ...
- 尺寸：建议宽度至少 800px
- 格式：JPG 或 PNG
- 用途：漫画阅读器

### 数量
根据每章的页数，修改 `js/main.js` 中的 `comicData.chapters` 数组

## 资源宣传图片

### 命名规则
- 文件名：`resource1.jpg`, `resource2.jpg`, `resource3.jpg`, ...
- 尺寸：建议 500x500 像素 (1:1)
- 格式：JPG 或 PNG
- 用途：资源下载区

### 数量
根据资源数量，修改 `js/main.js` 中的 `resourceData` 数组

## 图片优化建议

1. **压缩图片**：使用工具如 TinyPNG 或 ImageOptim 压缩图片，减小文件大小
2. **选择合适格式**：
   - 照片类图片使用 JPG
   - 图标、插画使用 PNG
3. **响应式图片**：考虑为不同设备提供不同尺寸的图片
4. **懒加载**：网站已实现懒加载，无需额外配置

## 在线图片压缩工具

- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [ImageOptim](https://imageoptim.com/)

## 临时占位图片

在准备真实图片之前，可以使用以下服务生成占位图片：

- [Placehold.co](https://placehold.co/)
- [Lorem Picsum](https://picsum.photos/)
- [Placeholder.com](https://placeholder.com/)

示例：
```
https://placehold.co/300x300?text=Avatar
https://placehold.co/800x600?text=Artwork+1
https://placehold.co/500x500?text=Merch+1
```
