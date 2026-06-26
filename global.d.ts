// Khai báo kiểu cho các file CSS thông thường (side-effect imports)
declare module '*.css';

// Khai báo kiểu cho CSS Modules nếu bạn có dùng
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}