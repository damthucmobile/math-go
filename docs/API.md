# API — Tóm tắt route handlers

Tài liệu ngắn cho developer: liệt kê các Route Handlers chính và mô tả nhanh.

## Route handlers chính

- `app/api/auth/login/route.ts` — POST: xác thực username/password, trả cookie session.
- `app/api/auth/logout/route.ts` — POST: xóa session cookie.
- `app/api/cms/config/route.ts` — GET: trả về cấu hình CMS từ `pages.json`.
- `app/api/cms/[tableId]/route.ts` — GET/POST/PUT/DELETE: CRUD cho mỗi bảng (homepage, pages, posts, components).
- `app/api/media/route.ts` — GET/POST: danh sách media và upload hình; local lưu `public/uploads/` hoặc Vercel Blob khi cấu hình.
- `app/api/settings/route.ts` — GET/POST/PUT: đọc/ghi settings chung.
- `app/api/deploy-status/route.ts` — GET: kiểm tra trạng thái deploy (Vercel API).

## Bảo mật

- Các route mutation (POST/PUT/DELETE) được proxy/validate thông qua `proxy.ts` và `lib/auth*`.
- Có hỗ trợ `Authorization: Bearer <API_SECRET>` cho server-to-server calls.

## Gợi ý mở rộng

- Khi thêm route mới, tuân thủ kiểm tra method rõ ràng và trả lỗi 405 nếu không đúng.
- Sử dụng helper `lib/cms.ts` để đọc/ghi bảng để tận dụng caching và file-lock.
