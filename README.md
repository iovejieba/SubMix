# SubMix

 一个强大的代理订阅链接转换器，将单独的代理订阅链接转换为 Mihomo 内核 YAML 配置文件

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/YoungLee-coder/SubMix)
[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Pages-orange?style=for-the-badge&logo=cloudflare)](https://dash.cloudflare.com/?to=/:account/pages/new)

## ✨ 功能特性

- 🔄 **多协议支持**：VLESS、Hysteria、Hysteria2、Shadowsocks、SS2022、Trojan
- 🎯 **智能解析**：自动解析节点链接并生成标准 YAML 配置
- 🌐 **节点转换 API**：类似 Sub Converter，支持通过 URL 参数直接转换节点链接
- 🎨 **现代化界面**：基于 shadcn/ui 的美观界面，支持深色模式
- 📝 **节点管理**：可视化编辑、排序、删除节点
- 🛡️ **完整规则集**：基于 @Loyalsoldier/clash-rules 的高质量规则
- ⚡ **一键操作**：快速生成、复制、下载配置文件
- 🏗️ **模块化架构**：易于扩展和维护的协议配置系统

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
pnpm start
```

### 一键部署

点击上方的部署按钮，即可快速部署到 Vercel 或 Cloudflare Pages。

## 📖 使用方法

### 可视化界面

1. **添加节点**：在左侧输入框粘贴订阅链接，选择单个或批量模式
2. **管理节点**：编辑节点信息，调整排序，删除不需要的节点
3. **配置路由**：选择白名单或黑名单模式
4. **生成配置**：系统自动生成完整的 Mihomo YAML 配置
5. **导出使用**：复制或下载配置文件到您的代理客户端

### 节点转换 API

SubMix 提供了类似 Sub Converter 的节点转换接口，可以直接通过 URL 参数传入单个或多个节点链接，返回 Mihomo 配置文件。

**接口地址：** `/api/sub`

**请求方式：** GET

**查询参数：**

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `url` | string | ✅ | - | 单个节点链接（可传入多个 url 参数） |
| `urls` | string | ❌ | - | 多个节点链接，用 `\|` 分隔 |
| `type` | string | ❌ | `full` | 配置类型：`simple`（简化版）或 `full`（完整版） |
| `mode` | string | ❌ | `whitelist` | 路由模式：`whitelist`（白名单）或 `blacklist`（黑名单） |

**使用示例：**

```bash
# 单个节点
https://your-domain.com/api/sub?url=vless://uuid@server:port?...

# 多个节点（多个 url 参数）
https://your-domain.com/api/sub?url=vless://xxx&url=ss://yyy&url=trojan://zzz

# 多个节点（urls 参数，用 | 分隔）
https://your-domain.com/api/sub?urls=vless://xxx|ss://yyy|trojan://zzz

# 简化版配置
https://your-domain.com/api/sub?url=vless://xxx&type=simple

# 黑名单模式
https://your-domain.com/api/sub?url=vless://xxx&mode=blacklist

# 组合使用
https://your-domain.com/api/sub?url=vless://xxx&url=ss://yyy&type=simple&mode=blacklist
```

**在 Mihomo 客户端中使用：**

直接将转换后的 URL 作为订阅链接添加到您的 Mihomo 客户端（如 Clash Verge、Clash Meta 等）：

```
https://your-domain.com/api/sub?url=节点链接1&url=节点链接2
```

**特性说明：**

- ✅ 支持传入单个或多个节点链接
- ✅ 支持多种代理协议（VLESS、Hysteria、Hysteria2、Shadowsocks、Trojan）
- ✅ 自动生成完整的规则集配置（基于 Loyalsoldier/clash-rules）
- ✅ 支持白名单和黑名单两种路由模式
- ✅ 返回标准的 YAML 格式配置文件

## 🔧 支持的协议格式

### VLESS
```
vless://uuid@server:port?type=ws&security=tls&flow=xtls-rprx-vision&fp=chrome#name
```
支持 TCP/WebSocket/HTTP/HTTP2/gRPC 传输，TLS/REALITY 加密，流控等高级功能

### Hysteria
```
hysteria://auth@server:port?protocol=udp&up=30&down=200&obfs=obfs_str#name
```
支持 UDP/WeChat-Video/FakeTCP 协议，带宽控制，混淆等功能

### Hysteria2
```
hysteria2://password@server:port?obfs=salamander&sni=domain#name
```
支持混淆、端口跳跃、brutal 速率控制等高级配置

### Shadowsocks
```
ss://method:password@server:port#name
```
支持各种加密方法：AES-256-GCM、ChaCha20-Poly1305、插件等

### SS2022
```
ss://2022-blake3-aes-128-gcm:password@server:port#name
```
支持新一代 Shadowsocks 2022 协议和 BLAKE3 加密

### Trojan
```
trojan://password@server:port?type=ws&path=/path&sni=domain#name
```
支持 WebSocket、gRPC 传输协议，REALITY、SS-AEAD 等高级功能

## ⚙️ 配置说明

### 代理组
- 🚀 **手动切换**：手动选择节点
- ♻️ **自动选择**：基于延迟自动选择
- 🔯 **故障转移**：主节点故障时自动切换
- 🔮 **负载均衡**：多节点负载平衡

### 路由模式
- **白名单模式**（推荐）：未匹配规则的流量走代理
- **黑名单模式**：只有指定流量走代理

### 规则集
基于 @Loyalsoldier/clash-rules，包含广告拦截、分流规则、GeoIP 数据等完整功能

## 🛠️ 技术栈

- **前端**：Next.js 15 (Turbopack) + TypeScript + Tailwind CSS
- **UI 组件**：shadcn/ui + Radix UI + Lucide Icons
- **状态管理**：React Hooks + Custom Hooks
- **协议解析**：模块化解析器架构
- **配置生成**：YAML 格式输出 (js-yaml)
- **代码质量**：ESLint + TypeScript 严格模式

## 🏗️ 项目架构

### 📁 目录结构

```
SubMix/
├── 📁 app/                           # Next.js App Router
│   ├── 📁 api/
│   │   ├── convert/route.ts          # 配置转换 API
│   │   ├── proxy-config/route.ts     # 协议配置 API
│   │   ├── sub/route.ts              # 节点转换 API (类似 Sub Converter)
│   │   └── subscription/route.ts     # 订阅配置存储 API
│   ├── page.tsx                      # 主页面
│   ├── layout.tsx                    # 根布局
│   └── globals.css                   # 全局样式
├── 📁 components/                    # React 组件
│   ├── 📁 proxy/                     # 代理相关组件
│   │   ├── AddNodeCard.tsx           # 添加节点卡片
│   │   ├── NodeListCard.tsx          # 节点列表卡片
│   │   ├── EditNodeDialog.tsx        # 节点编辑对话框
│   │   ├── ConfigOptionsCard.tsx     # 配置选项卡片
│   │   ├── ConfigOutputCard.tsx      # 配置输出卡片
│   │   └── ProtocolSupportCard.tsx   # 协议支持说明卡片
│   └── 📁 ui/                        # shadcn/ui 基础组件
├── 📁 hooks/                         # 自定义 Hooks
│   ├── useProxyManagement.ts         # 代理管理 Hook
│   ├── useConfigGeneration.ts        # 配置生成 Hook
│   └── useEditConfig.ts              # 编辑配置 Hook
├── 📁 lib/                          # 核心库
│   ├── 📁 protocol-configs/          # 🔥 协议配置模块（新架构）
│   │   ├── 📁 base/                  # 基础库
│   │   │   ├── common-fields.ts      # 公共字段定义
│   │   │   ├── field-groups.ts       # 字段分组配置
│   │   │   └── field-types.ts        # 字段类型和选项
│   │   ├── 📁 protocols/             # 协议配置文件
│   │   │   ├── vless.config.ts       # VLESS 协议配置
│   │   │   ├── hysteria.config.ts    # Hysteria 协议配置
│   │   │   ├── hysteria2.config.ts   # Hysteria2 协议配置
│   │   │   ├── shadowsocks.config.ts # Shadowsocks 协议配置
│   │   │   └── trojan.config.ts      # Trojan 协议配置
│   │   ├── generator.ts              # 配置生成器
│   │   └── index.ts                  # 统一导出
│   ├── 📁 parsers/                   # 协议解析器
│   │   ├── base.ts                   # 解析器基类和接口
│   │   ├── vless.ts                  # VLESS 解析器
│   │   ├── hysteria.ts               # Hysteria 解析器
│   │   ├── hysteria2.ts              # Hysteria2 解析器
│   │   ├── shadowsocks.ts            # Shadowsocks 解析器
│   │   └── trojan.ts                 # Trojan 解析器
│   ├── proxy-parser.ts               # 解析器入口
│   ├── mihomo-config.ts              # Mihomo 配置生成器
│   └── utils.ts                      # 工具函数
├── 📁 types/                        # TypeScript 类型定义
│   └── proxy.ts                      # 代理相关类型
├── 📁 utils/                        # 工具模块
│   └── protocolUtils.ts              # 协议工具函数
└── 📁 public/                       # 静态资源
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⚠️ 免责声明

本工具仅用于学习和测试目的，请遵守当地法律法规。


## 🙏 鸣谢

- [Mihomo](https://github.com/MetaCubeX/mihomo) - 强大的代理内核
- [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) - 高质量规则集
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的 UI 组件库
- [Next.js](https://nextjs.org/) - 现代化的 React 框架