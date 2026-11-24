# 个人主页 / 作品集

一个纯静态网站，**零依赖、零构建**：三个文件，双击 `index.html` 就能看。
部署到任何静态托管（GitHub Pages / Vercel / Netlify / Cloudflare Pages）都是免费且秒级完成。

---

## 一、本地预览

直接双击 `index.html`，或在文件夹里执行：

```bash
python3 -m http.server 8000
# 然后浏览器打开 http://localhost:8000
```

---

## 二、把内容换成你自己的

全部内容都在 `index.html` 里，用任意文本编辑器（手机可用「记事本」「Acode」「Markor」）打开，
按 `Ctrl+F` 搜索替换即可。建议按这个顺序改：

| 改什么 | 搜什么 | 说明 |
| --- | --- | --- |
| 名字 | `林深` | 出现 5 处（标题、logo、头像、页脚） |
| 邮箱 | `hello@linshen.design` | 出现 3 处（按钮、复制邮箱、mailto） |
| 网站标题 | `<title>` 那行 | 浏览器标签页文字 |
| 一句话介绍 | `独立设计师 / 前端开发者` | Hero 副标题 |
| 数字 | `3+` `12` `20+` `4.9` | Hero 下方的四个数据 |
| 作品 | `潮汐 · 习惯追踪 App` 等 4 张卡 | 标题、描述、标签、链接 |
| 技能 | `95%` `88%` … | 改数字时同步改进度条宽度 |
| 社交链接 | `href="#"` | 替换成你的 GitHub / 微博 / 小红书地址 |

**配色**：只改 `assets/css/style.css` 开头的 `:root` 变量：

```css
--accent: #42e6c8;   /* 主强调色（青绿） */
--accent-2: #6d8bff; /* 渐变第二色（靛蓝） */
--bg: #0a0e14;       /* 背景色 */
```

**换作品封面**：`style.css` 里搜 `.thumb-1::before`，把 `linear-gradient(...)` 换成你自己的图片：

```css
.thumb-1::before {
  background: url("../img/work-1.jpg") center/cover;
}
```

**加/删作品卡片**：在 `index.html` 里复制一整段 `<a class="card reveal">…</a>`，
改标题、描述、标签；`card-num` 改成 05、06。

**删掉某一块**：整段 `<section>` 删掉，并把导航里对应的 `<a href="#xxx">` 也删掉即可。
不需要的 CSS 留着不影响。

---

## 三、发布到公网（三选一）

### 方案 A：GitHub Pages（免费、永久、有 HTTPS）

适合想顺便拥有一个 `https://你的用户名.github.io` 地址。

```bash
cd portfolio
git init
git add .
git commit -m "我的个人主页"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

推送后到仓库页面：**Settings → Pages → Source 选 `main` 分支、`/ (root)` → Save**。
等 1 分钟，访问 `https://你的用户名.github.io/你的仓库名/` 即可。

> 想让地址更短（`https://你的用户名.github.io`），把仓库命名为 `你的用户名.github.io` 就行。

### 方案 B：Netlify Drop（最快，不用命令行）

1. 打开 <https://app.netlify.com/drop>
2. 把整个 `portfolio` 文件夹（或本目录的 zip）拖进页面
3. 几秒后得到一个 `https://随机名.netlify.app` 的地址，可随时改成好记的名字

### 方案 C：Vercel

1. 打开 <https://vercel.com/new>
2. 导入 GitHub 仓库（或直接用 CLI：`npm i -g vercel && vercel`）
3. 框架预设选 **Other**，Build Command 留空，Output Directory 填 `.`
4. Deploy

### 挂自己的域名

- Netlify / Vercel：项目设置里 **Domains** 添加域名，按提示到域名服务商加一条 CNAME 记录
- GitHub Pages：仓库 Settings → Pages → Custom domain，然后在域名服务商加 CNAME
- 一般几分钟生效，托管平台会自动配好免费 HTTPS 证书

---

## 四、文件结构

```
portfolio/
├── index.html              页面结构与全部文字
├── assets/
│   ├── css/style.css       样式（配色、排版、动效）
│   └── js/main.js          交互（主题切换、滚动动画、复制邮箱）
└── README.md               本文件
```

---

## 五、已内置的细节

- 深色 / 浅色主题切换，选择记在浏览器里
- 手机、平板、桌面自适应
- 滚动时元素淡入、顶部进度条、导航变毛玻璃
- 键盘可访问、尊重系统「减少动态效果」设置
- 语义化标签 + meta description，利于搜索收录
- 无框架、无外链依赖，首屏几乎零等待
