# 深空制图仪 · DEEP SPACE CARTOGRAPH

> 手控地球 · 第一号 —— 用 Three.js 打造的深空地球可视化大屏，支持手势隔空操控。

**在线体验**：https://kingrsw.github.io/deep-space-cartograph/

复刻自抖音「没烫头」的 vibe coding 作品，全程 AI 协作完成。

## ✨ 功能

### 🌍 真实地球
- NASA 蓝色大理石白天卫星贴图 + 夜景城市灯光贴图 + 独立漂移云层
- 昼夜分界线（晨昏带暖橙大气辉光）、南北极极光点幕、太阳光晕
- 轨道卫星编队、航线弧光、地面观测站网格

### 🖐️ 手势控制（MediaPipe Hands，本地模型，离线可用）
| 手势 | 效果 |
|------|------|
| 单手移动 | 旋转地球（方位角 / 俯仰角跟随） |
| 拇指捏合食指 | 触发随机事件 |
| 握拳 | 切换城市聚光 |
| 双手开合 | 缩放地球 |

### 🛰️ 卫星街景
- 持续放大贴近地表或**双击地球**进入街道级测绘
- ArcGIS World Imagery 真实卫星影像，z17 / z18 / z19 三级瓦片
- 街景内可继续缩放，滚轮拉远 / ESC / 点击提示条退出

### ⚡ 随机事件
流星雨、彗星掠过、城市过载、信号风暴、太阳耀斑 —— 每 16~32 秒随机触发，事件卡 + 遥测读数联动波动。

### 🔍 交互与实时数据
- 点击城市弹出信息卡：坐标、当地时间、**Open-Meteo 实时天气**、**OpenSky 空域航班**
- 搜索框定位 18 个城市，地球最短角旋转 + 相机俯仰插值
- 程序化音效（WebAudio 合成，无外部音频文件）：环境低鸣垫 + 事件音效

### 📱 移动端
手机浏览器访问同一地址即可用，双指快速轻点等效双击下钻。

## 🚀 本地运行

```bash
# 方式一：双击「启动.command」（自动起本地服务器并打开浏览器）

# 方式二：手动
python3 -m http.server 8642
# 打开 http://localhost:8642/
```

> ⚠️ 手势摄像头需要安全上下文（HTTPS 或 localhost），直接双击 `index.html` 以 file:// 打开时手势功能不可用，但其余功能正常。

### 单文件版

```bash
node build.js   # 生成 深空制图仪.html（约 3.8MB，贴图与脚本全部内联）
```

单文件版可拷到任意位置双击打开，无需任何依赖。

## 📁 结构

```
├── index.html          # 页面与 UI
├── app.js              # 核心逻辑（场景 / 手势 / 街景 / 事件 / 数据）
├── build.js            # 单文件构建脚本
├── 启动.command        # macOS 一键启动本地服务器
└── lib/
    ├── three.min.js    # Three.js (UMD)
    ├── OrbitControls.umd.js
    ├── tex/            # NASA 白天 / 夜景 / 云层贴图
    └── hands/          # MediaPipe Hands 本地模型与 wasm
```

## 📄 License

贴图素材来自 NASA Visible Earth / Blue Marble，手势识别基于 MediaPipe（Apache-2.0），三维渲染基于 Three.js（MIT）。本项目代码 WTFPL。
