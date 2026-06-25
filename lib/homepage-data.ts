import { GraduationCap, BookOpen, Award, Globe, type LucideIcon } from 'lucide-react'

export type ProgramItem = {
  title: string
  description: string
  href: string
  iconName: 'graduation' | 'book' | 'award' | 'globe'
}

export type StatItem = {
  value: string
  label: string
}

export type TestimonialItem = {
  quote: string
  author: string
  role: string
  avatarUrl: string
}

export type HomepageData = {
  hero: {
    badge: string
    headline: string
    subtext: string
    primaryButtonLabel: string
    primaryButtonHref: string
    secondaryButtonLabel: string
    secondaryButtonHref: string
    imageUrl: string
  }
  stats: StatItem[]
  programs: ProgramItem[]
  tutor: {
    name: string
    title: string
    quote: string
    description: string
    imageUrl: string
    stat1Value: string
    stat1Label: string
    stat2Value: string
    stat2Label: string
  }
  testimonials: TestimonialItem[]
  contact: {
    eyebrow: string
    title: string
    subtitle: string
    buttonLabel: string
  }
}

export const defaultHomepageData: HomepageData = {
  hero: {
    badge: 'HỌC TẬP TOÀN DIỆN',
    headline: 'Chinh Phục Môn Toán\nCùng MathGo',
    subtext: 'Gia sư tận tâm, phương pháp hiện đại, giúp học sinh bứt phá điểm số thông qua lộ trình cá nhân hóa.',
    primaryButtonLabel: 'Đăng Ký Học Thử Miễn Phí',
    primaryButtonHref: '#contact',
    secondaryButtonLabel: 'Xem Chương Trình',
    secondaryButtonHref: '#courses',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  stats: [
    { value: '1000+', label: 'Học sinh đã theo học' },
    { value: '10+', label: 'Năm kinh nghiệm giảng dạy' },
    { value: '95%', label: 'Học sinh tiến bộ rõ rệt' },
  ],
  programs: [
    { title: 'Toán Tiểu Học', description: 'Xây dựng nền tảng vững chắc, kích thích tư duy logic và niềm yêu thích môn Toán từ nhỏ.', href: '/curriculum/tieu-hoc', iconName: 'graduation' },
    { title: 'Toán THCS', description: 'Lấy lại gốc nhanh chóng, nâng cao kỹ năng giải quyết vấn đề và chuẩn bị thi vào 10.', href: '/curriculum/trung-hoc', iconName: 'book' },
    { title: 'Toán THPT & Luyện Thi', description: 'Chiến thuật giải đề trắc nghiệm nhanh, bao quát kiến thức và tối ưu hoá điểm số thi Đại học.', href: '/curriculum/trung-hoc-pho-thong', iconName: 'award' },
    { title: 'Toán Quốc Tế', description: 'Chuẩn bị cho các kỳ thi SAT, IGCSE, A-Level với giáo trình chuẩn quốc tế và tư duy chuyên sâu.', href: '/curriculum/toan-quoc-te', iconName: 'globe' },
  ],
  tutor: {
    name: 'Thầy Nguyễn Văn A',
    title: 'Đội Ngũ Giảng Viên',
    quote: 'Môn Toán không khó, cái khó là chưa tìm được chìa khoá để mở cánh cửa tư duy.',
    description: 'Thạc sĩ chuyên ngành Toán học với hơn 15 năm kinh nghiệm luyện thi chuyên. Thầy nổi tiếng với phương pháp giảng dạy trực quan, giúp học sinh nắm vững bản chất thay vì học vẹt công thức.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    stat1Value: '15+',
    stat1Label: 'Năm kinh nghiệm',
    stat2Value: '5000+',
    stat2Label: 'Học sinh đỗ đạt',
  },
  testimonials: [
    { quote: 'Trước đây em rất sợ môn Toán và luôn bị điểm kém. Nhờ sự tận tình của các thầy cô tại MathGo, em đã lấy lại được căn bản và đạt điểm 9.0 trong kỳ thi học kỳ vừa qua.', author: 'Bạn Minh Anh', role: 'Học sinh lớp 12', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { quote: 'Lộ trình học tập cá nhân hoá là điều tôi ưng nhất. Con tôi từ chỗ lười học đã trở nên chủ động và yêu thích việc giải các bài toán khó hơn mỗi ngày.', author: 'Chị Thu Trang', role: 'Phụ huynh học sinh', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  ],
  contact: {
    eyebrow: 'TƯ VẤN MIỄN PHÍ',
    title: 'Tư vấn lộ trình học tập miễn phí',
    subtitle: 'Để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ và hỗ trợ kiểm tra năng lực trong vòng 24h.',
    buttonLabel: 'Gửi Yêu Cầu Tư Vấn',
  },
}

export function parseHomepageData(raw: unknown): Partial<HomepageData> | undefined {
  if (!raw) return undefined
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Partial<HomepageData>
    } catch {
      return undefined
    }
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Partial<HomepageData>
  }
  return undefined
}

export function normalizeHomepageData(raw: Partial<HomepageData> | undefined): HomepageData {
  return {
    hero: { ...defaultHomepageData.hero, ...(raw?.hero ?? {}) },
    stats: Array.isArray(raw?.stats) && raw.stats.length > 0 ? raw.stats : defaultHomepageData.stats,
    programs: Array.isArray(raw?.programs) && raw.programs.length > 0 ? raw.programs : defaultHomepageData.programs,
    tutor: { ...defaultHomepageData.tutor, ...(raw?.tutor ?? {}) },
    testimonials: Array.isArray(raw?.testimonials) && raw.testimonials.length > 0 ? raw.testimonials : defaultHomepageData.testimonials,
    contact: { ...defaultHomepageData.contact, ...(raw?.contact ?? {}) },
  }
}

export const iconMap: Record<ProgramItem['iconName'], LucideIcon> = {
  graduation: GraduationCap,
  book: BookOpen,
  award: Award,
  globe: Globe,
}
