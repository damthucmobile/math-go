# Structure — Cấu trúc thư mục và vai trò chính

- `app/` — Next.js App Router: public site `(site)` và `admin` route group, kèm layouts, pages, loading, error handlers.
- `app/api/` — Route handlers (REST-style) cho auth, cms, media, settings.
- `app/components/` — Block editor, BlockRenderer, ComponentRenderer, UI primitives (Oatmeal).
- `lib/` — Logic core: `cms.ts`, `auth.ts`, `media.ts`, `sanitize.ts`, `file-lock.ts`, `deploy-*`.
- `data/` — JSON content files (homepage.json, pages.json, posts.json, components.json, media.json, settings.json). Tạo tự động bởi `scripts/seed-data.js` nếu thiếu.
- `public/uploads/` — media uploads local.
- `pages.json` — schema/config cho các bảng CMS (định nghĩa fields và loại content).

### Component sections

Thư mục `app/components/ComponentRenderer/sections/` chứa các section tái sử dụng (Hero, CTA, Pricing, FAQs...). Các trang public tham chiếu tới các component này qua ID trong dữ liệu bảng `components`.
