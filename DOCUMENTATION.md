# Simple CMS — Tài liệu dự án

Tài liệu ngắn gọn cho developer (tiếng Việt): tổng quan, cách chạy, cấu trúc thư mục, API chính, admin/editor và quy ước code.

**Quick start**

- Cài dependencies (local dev seed tạo `data/` nếu thiếu):

```bash
npm install
npm run dev
```

Site: http://localhost:3000 — Admin: http://localhost:3000/admin

Xem file cấu hình: [package.json](package.json) · [pages.json](pages.json) · [next.config.ts](next.config.ts)

## Tổng quan kiến trúc

- Next.js 16 (App Router) — route groups `(site)` và `admin`.
- File-based CMS: JSON trong `data/` được cấu hình bởi `pages.json`.
- Admin dùng Editor.js cho body block-based; public site render bằng server components.
- Auth: cookie JWT (thư viện `jose`), proxy bảo vệ route admin và mutation API.

## Biến môi trường quan trọng

- `SESSION_SECRET` — secret ký session cookie (local có default nhưng nên đặt khi deploy).
- `VERCEL_DEPLOY_HOOK_URL` — trigger deploy khi lưu nội dung (tùy chọn).
- `BLOB_READ_WRITE_TOKEN` — dùng trên Vercel để lưu data vào Vercel Blob.
- `API_SECRET` — bearer token cho server-to-server API.

## Tài liệu nhanh các phần chính

- Cấu hình CMS: [pages.json](pages.json)
- Route handlers API: xem `app/api/` (tài liệu chi tiết trong `docs/API.md`)
- Admin UI & Editor: xem `app/admin/` và `app/components/BlockEditor.tsx` (tài liệu chi tiết trong `docs/ADMIN.md`)

## Ghi chú vận hành

- Local dev sử dụng filesystem (`data/*.json`, `public/uploads/`). Trên Vercel chuyển sang Vercel Blob khi `BLOB_READ_WRITE_TOKEN` được set.
- Có cơ chế khóa file để tránh ghi chồng: `lib/file-lock.ts`.

---

Xem chi tiết trong thư mục `docs/` (API, Admin, Structure).
