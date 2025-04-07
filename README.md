# RecruitPro - 招聘管理系统

**RecruitPro 是一个现代化的招聘管理系统**，用于帮助企业高效管理 **候选人、面试安排、招聘进度**，并支持 **AI 简历匹配**

## **项目概述**

- **项目名称**: RecruitPro
- **目标用户**: HR 团队、招聘经理、面试官
- **主要功能**: **候选人管理、面试安排、招聘进度跟踪、AI 简历匹配**
- **技术栈**: **React + NestJS + PostgreSQL + pgvector**
- **部署方式**: **Docker + Kubernetes（支持云端 & 本地部署）**

### 功能模块

- **仪表盘**: 实时查看招聘数据概览
- **候选人管理**: 添加、查看和安排候选人面试
- **面试管理**: 查看和管理活跃面试
- **招聘进度跟踪**: 按阶段查看候选人分布
- **已录用候选人**: 查看已录用候选人信息
- **面试安排**: 集成 Google Calendar API 安排面试
- AI 简历匹配：通过 **pgvector + OpenAI** 计算职位匹配度
- 自动化通知：面试提醒（邮件/短信通知）
- 权限管理（admin/HR/面试官）

### Tech stack

- 前端：React、vite、Typescript、Tailwind、Echart
- 后端：NestJS、postgreSQL，supabase
- DevOps：Docker

### UI 设计规范

#颜色搭配

- 主要 button、重点信息：#007bff
- 背景色：#f8f9fa
- 文字颜色：#343a40
- 成功状态：#28a745
- 失败状态：#dc3545

#组件风格
✅ **使用 Tailwind CSS 进行组件化**  
 ✅ **按钮 & 输入框使用统一的圆角（rounded-lg）**  
 ✅ **响应式布局（支持 PC & 移动端）**

### 数据库设计

**数据表结构**

- 候选人表（candidates）

```
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    experience INT,
    skills TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

```

- 简历表（resumes）

```
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
    embedding VECTOR(1536),  -- AI 语义搜索向量
    created_at TIMESTAMP DEFAULT NOW()
);

```

- 面试安排表（interviews）

```
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
    embedding VECTOR(1536),  -- AI 语义搜索向量
    created_at TIMESTAMP DEFAULT NOW()
);

```

### API 设计

- GET - /api/candidates - 获取候选人列表
- POST - /api/candidates - 添加候选人
- GET - /api/candidates/:id - 获取候选人详情
- POST - /api/resumes/upload - 上传简历
- POST - /api/interviews/schedule - 安排面试
- POST - /api/match - 匹配度计算

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
