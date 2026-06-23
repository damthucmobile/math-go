# Admin — Hướng dẫn nhanh cho developer

## Vị trí

- Giao diện admin: `app/admin/` — layout, sidebar, pages (cms, media, settings, homepage, login).
- Editor client: `app/components/BlockEditor.tsx` và `lib/block-editor-adapter.ts` để tương tác Editor.js.

## Luồng chính

1. Người dùng login tại `app/admin/login/page.tsx` → gọi `app/api/auth/login/route.ts` để nhận cookie session.
2. Các trang admin gọi API mutation (ví dụ lưu bài, upload media) → API kiểm tra session hoặc `API_SECRET`.
3. Khi lưu nội dung, nếu `VERCEL_DEPLOY_HOOK_URL` được cấu hình, `lib/deploy-hook.ts` sẽ trigger deploy.

## Editor.js

- Editor được cấu hình với bộ tools ở `app/components/BlockEditor.tsx` (code, paragraph, header, image, embed, delimiter...).
- Dữ liệu block được chuyển qua `lib/block-editor-adapter.ts` để lưu vào bảng JSON.
- Khi render public site, `app/components/BlockRenderer.tsx` chuyển block thành component React an toàn (sử dụng `lib/sanitize.ts`).

## Media

- Upload local: file lưu vào `public/uploads/` và media record lưu trong `data/media.json`.
- Trên Vercel nếu `BLOB_READ_WRITE_TOKEN` có, lưu lên Vercel Blob (xem `lib/cms-blob.ts`).

## Debugging

- Xem logs server (console) khi gọi API; kiểm tra `SESSION_SECRET` và cookie path khi login thất bại.
