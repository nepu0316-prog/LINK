# 親子小日子 — Creator Linktree

親子內容創作者專屬的品牌形象網站 + Linktree 系統，包含完整後台管理。

## 功能特色

- **前台**：文青溫暖日系親子風格，手機優先設計
- **後台**：完整 CMS 管理系統（商品/影片/連結/Banner/個人資料）
- **團購倒數**：自動計時器，支援設定截止日期
- **點擊分析**：追蹤每個連結的點擊次數
- **圖片上傳**：整合 Supabase Storage
- **電子報訂閱**：收集訪客 Email
- **SEO + OG**：完整 Open Graph 設定
- **Google Analytics**：流量追蹤

---

## 快速開始

### 1. 安裝依賴

```bash
cd creator-linktree
npm install
```

### 2. 設定環境變數

```bash
cp .env.local.example .env.local
```

編輯 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=親子小日子
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # 可選
```

### 3. 設定 Supabase

#### 3a. 建立專案
前往 [supabase.com](https://supabase.com) 建立新專案。

#### 3b. 執行資料庫 Schema
在 Supabase Dashboard → SQL Editor，貼上並執行 `supabase/schema.sql` 的全部內容。

#### 3c. 建立 Storage Bucket
在 Supabase Dashboard → Storage，新增 Bucket：

| 設定 | 值 |
|------|-----|
| Bucket Name | `media` |
| Public | ✅ 開啟 |

然後在 Storage → Policies，為 `media` bucket 新增：
- **Policy Name**: `Public read media`
- **Operation**: SELECT
- **Target roles**: anon, authenticated
- **Policy**: `true`

#### 3d. 建立管理員帳號
在 Supabase Dashboard → Authentication → Users → Add user：
- 輸入你的 Email 和密碼
- 這就是後台登入帳號

### 4. 本地執行

```bash
npm run dev
```

開啟 `http://localhost:3000`，前台首頁即可看到。

後台管理：`http://localhost:3000/admin`

---

## 專案結構

```
creator-linktree/
├── app/
│   ├── page.tsx              # 前台首頁
│   ├── admin/
│   │   ├── page.tsx          # 後台儀表板
│   │   ├── login/            # 登入頁
│   │   ├── products/         # 團購商品管理
│   │   ├── videos/           # 影音管理
│   │   ├── links/            # 連結管理
│   │   ├── banners/          # Banner 管理
│   │   └── profile/          # 個人設定
│   └── api/
│       ├── analytics/        # 點擊追蹤 API
│       ├── subscribe/        # 電子報訂閱 API
│       └── auth/callback/    # OAuth 回調
├── components/
│   ├── homepage/             # 前台元件
│   └── admin/                # 後台元件
├── lib/
│   ├── types.ts              # TypeScript 型別
│   ├── supabase.ts           # 瀏覽器 Supabase client
│   ├── supabase-server.ts    # Server Supabase client
│   └── utils.ts              # 工具函式
├── supabase/
│   └── schema.sql            # 資料庫 Schema
└── middleware.ts             # Admin 認證保護
```

---

## 部署到 Vercel

### 方法一：Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### 方法二：GitHub 整合

1. 將專案推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_NAME/creator-linktree.git
   git push -u origin main
   ```

2. 前往 [vercel.com](https://vercel.com) → New Project → Import from GitHub

3. 設定環境變數（與 `.env.local` 相同的 4 個變數）

4. 部署完成！

### 設定自訂網域

在 Vercel Dashboard → Domains 輸入你的域名，然後在 DNS 設定 CNAME 指向 `cname.vercel-dns.com`。

---

## 自訂品牌色

在後台 **個人設定** 頁面可以直接選色或輸入 HEX 色碼，預設提供 5 個暖色系色票。

修改後前台頭像光暈、CTA 按鈕等元素會跟著改變。

---

## 資料庫 Schema 說明

| 資料表 | 用途 |
|--------|------|
| `profiles` | 創作者個人資料（單筆） |
| `products` | 團購商品，支援倒數截止、標籤、原價/特價 |
| `videos` | 影音連結（YouTube/Instagram/TikTok） |
| `links` | Linktree 式連結按鈕 |
| `banners` | 首頁輪播 Banner |
| `categories` | 分類標籤 |
| `email_subscribers` | 電子報訂閱者 |
| `click_analytics` | 點擊行為記錄 |

---

## 常見問題

**Q: 圖片上傳失敗？**
確認 Supabase Storage 的 `media` bucket 已建立並設定為 Public，且 RLS Policy 允許上傳。

**Q: 後台無法登入？**
確認已在 Supabase Authentication → Users 建立帳號，並確認 `.env.local` 的 Supabase URL 和 Anon Key 正確。

**Q: 如何新增 Google Analytics？**
在 `.env.local` 加入 `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`，Vercel 部署時也要加入此環境變數。

**Q: 如何啟用深色模式？**
在後台個人設定開啟「深色模式切換」，前台訪客即可手動切換（需額外實作切換按鈕 UI，目前預設淺色）。
