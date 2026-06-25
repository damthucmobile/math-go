export type CourseTab = {
  id: string
  label: string
}

export type CourseStat = {
  value: string
  label: string
}

export type CourseCard = {
  title: string
  description: string
  icon: string
  iconBg: string
  borderTop?: string
}

export type CourseColumn = {
  badge: string
  sub: string
  badgeBg: string
  description: string
  points: string[]
}

export type CourseScheduleItem = {
  month: string
  monthLabel?: string
  title: string
  subtitle?: string
  monthClassName?: string
}

export type CourseSidebar = {
  scheduleTitle?: string
  scheduleButtonLabel?: string
  scheduleButtonHref?: string
  scheduleItems?: CourseScheduleItem[]
  personalizedTitle?: string
  personalizedDescription?: string
  personalizedLinkLabel?: string
  personalizedHref?: string
}

export type CourseProgram = {
  id: string
  level: string
  type: 'section-complex' | 'grid-cards' | 'split-columns'
  title: string
  description: string
  image?: string
  badges?: string[]
  content?: string[]
  result?: string[]
  schedule?: string
  rightBadge?: string
  cards?: CourseCard[]
  columns?: CourseColumn[]
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonLabel?: string
  ctaButtonHref?: string
  sidebar?: CourseSidebar
}

export type CoursePageData = {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  primaryButtonLabel: string
  primaryButtonHref: string
  secondaryButtonLabel: string
  secondaryButtonHref: string
  stats: CourseStat[]
  tabs: CourseTab[]
  programs: CourseProgram[]
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function asObjectArray(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
}

export function normalizeCoursePageData(input: Record<string, unknown> | null | undefined): CoursePageData {
  const defaultTabs: CourseTab[] = [
    { id: 'tieu-hoc', label: 'Tiểu Học' },
    { id: 'thcs', label: 'Trung Học Cơ Sở' },
    { id: 'thpt', label: 'Trung Học Phổ Thông' },
    { id: 'toan-quoc-te', label: 'Toán Quốc Tế' }
  ]

  const programs = asObjectArray(input?.programs).map((item, index) => {
    const sidebarConfig = asObject(item.sidebar)
    const scheduleItems = asObjectArray(sidebarConfig.scheduleItems).map((scheduleItem) => ({
      month: asString(scheduleItem.month),
      monthLabel: asString(scheduleItem.monthLabel),
      title: asString(scheduleItem.title),
      subtitle: asString(scheduleItem.subtitle),
      monthClassName: asString(scheduleItem.monthClassName)
    }))
    const hasSidebar = Boolean(
      asString(sidebarConfig.scheduleTitle) ||
      asString(sidebarConfig.scheduleButtonLabel) ||
      asString(sidebarConfig.scheduleButtonHref) ||
      scheduleItems.length ||
      asString(sidebarConfig.personalizedTitle) ||
      asString(sidebarConfig.personalizedDescription) ||
      asString(sidebarConfig.personalizedLinkLabel) ||
      asString(sidebarConfig.personalizedHref)
    )

    return {
      id: asString(item.id, `program-${index + 1}`),
      level: asString(item.level, 'tieu-hoc'),
      type: (asString(item.type, 'section-complex') as CourseProgram['type']),
      title: asString(item.title, 'Chương trình học mới'),
      description: asString(item.description, 'Mô tả chương trình sẽ được cập nhật sớm.'),
      image: asString(item.image),
      badges: asStringArray(item.badges),
      content: asStringArray(item.content),
      result: asStringArray(item.result),
      schedule: asString(item.schedule),
      rightBadge: asString(item.rightBadge),
      cards: asObjectArray(item.cards).map((card) => ({
        title: asString(card.title),
        description: asString(card.description),
        icon: asString(card.icon, 'BookOpen'),
        iconBg: asString(card.iconBg, 'bg-slate-100 text-slate-700'),
        borderTop: asString(card.borderTop)
      })),
      columns: asObjectArray(item.columns).map((column) => ({
        badge: asString(column.badge),
        sub: asString(column.sub),
        badgeBg: asString(column.badgeBg, 'bg-amber-500'),
        description: asString(column.description),
        points: asStringArray(column.points)
      })),
      ctaTitle: asString(item.ctaTitle),
      ctaDescription: asString(item.ctaDescription),
      ctaButtonLabel: asString(item.ctaButtonLabel),
      ctaButtonHref: asString(item.ctaButtonHref),
      sidebar: hasSidebar ? {
        scheduleTitle: asString(sidebarConfig.scheduleTitle),
        scheduleButtonLabel: asString(sidebarConfig.scheduleButtonLabel),
        scheduleButtonHref: asString(sidebarConfig.scheduleButtonHref),
        scheduleItems,
        personalizedTitle: asString(sidebarConfig.personalizedTitle),
        personalizedDescription: asString(sidebarConfig.personalizedDescription),
        personalizedLinkLabel: asString(sidebarConfig.personalizedLinkLabel),
        personalizedHref: asString(sidebarConfig.personalizedHref)
      } : undefined
    }
  })

  return {
    heroBadge: asString(input?.heroBadge, 'PROGRAMS & CURRICULUM'),
    heroTitle: asString(input?.heroTitle, 'Chương trình học Toán chuẩn Quốc tế tại MathGo'),
    heroSubtitle: asString(input?.heroSubtitle, 'Từ nền tảng tư duy tiểu học đến các chứng chỉ quốc tế cấp trung học, chúng tôi đồng hành cùng học sinh trên con đường chinh phục đỉnh cao tri thức.'),
    primaryButtonLabel: asString(input?.primaryButtonLabel, 'Đăng ký học thử miễn phí'),
    primaryButtonHref: asString(input?.primaryButtonHref, '/contact'),
    secondaryButtonLabel: asString(input?.secondaryButtonLabel, 'Tư vấn lộ trình'),
    secondaryButtonHref: asString(input?.secondaryButtonHref, '/contact'),
    stats: asObjectArray(input?.stats).map((item) => ({
      value: asString(item.value),
      label: asString(item.label)
    })).filter((item) => item.value || item.label),
    tabs: asObjectArray(input?.tabs).map((item) => ({ id: asString(item.id), label: asString(item.label) })).filter((item) => item.id || item.label) || defaultTabs,
    programs
  }
}
