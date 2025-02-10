# RecruitPro - 招聘管理系统

RecruitPro 是一个基于 Vite + React + TypeScript 构建的现代招聘管理系统，旨在帮助招聘团队高效管理候选人、面试流程和招聘进度。

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **编程语言**: TypeScript
- **样式**: Tailwind CSS
- **路由**: React Router
- **数据可视化**: ECharts
- **图标库**: Lucide
- **日期处理**: date-fns

## 功能特性

- **仪表盘**: 实时查看招聘数据概览
- **候选人管理**: 添加、查看和安排候选人面试
- **面试管理**: 查看和管理活跃面试
- **招聘进度跟踪**: 按阶段查看候选人分布
- **已录用候选人**: 查看已录用候选人信息
- **面试安排**: 集成 Google Calendar API 安排面试

## 项目结构

recruitpro/
├── src/
│ ├── components/ # 可复用组件
│ ├── types/ # TypeScript 类型定义
│ ├── App.tsx # 主应用组件
│ ├── main.tsx # 应用入口
│ └── index.css # 全局样式
├── public/ # 静态资源
├── package.json # 项目依赖和脚本
├── vite.config.ts # Vite 配置
├── tailwind.config.js # Tailwind CSS 配置
└── postcss.config.js # PostCSS 配置
