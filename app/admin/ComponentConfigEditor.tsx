'use client'

import { PlusCircle, Trash2 } from 'lucide-react'
import type { JsonValue } from '@/types/json'
import { inputClasses, labelClasses } from '@/lib/admin-utils'

interface ComponentConfigEditorProps {
  componentType: string
  configValue: string
  onChange: (nextConfig: string) => void
}

export type ComponentTypeOption = {
  value: string
  label: string
  description: string
}

export const COMPONENT_TYPE_OPTIONS: ComponentTypeOption[] = [
  { value: 'hero', label: 'Hero', description: 'Headline, image, CTA và intro.' },
  { value: 'featured', label: 'Featured', description: 'Mục nổi bật với tiêu đề và nội dung.' },
  { value: 'featured-split', label: 'Featured Split', description: 'Block 2 cột với ảnh, quote, badges và stats.' },
  { value: 'cta', label: 'CTA', description: 'Khối gọi hành động đơn giản.' },
  { value: 'pricing', label: 'Pricing', description: 'Bảng giá với nhiều gói dịch vụ.' },
  { value: 'stats', label: 'Stats', description: 'Số liệu thống kê dạng card.' },
  { value: 'testimonials', label: 'Testimonials', description: 'Những đánh giá khách hàng.' },
  { value: 'team', label: 'Team', description: 'Danh sách thành viên / giảng viên.' },
  { value: 'faqs', label: 'FAQs', description: 'Câu hỏi thường gặp.' },
  { value: 'banners', label: 'Banner', description: 'Banner quảng bá trực quan.' },
  { value: 'twocolumn', label: 'Two Column', description: 'Hai cột nội dung + hình ảnh.' },
  { value: 'homepage-hero', label: 'Homepage Hero', description: 'Hero đặc thù cho trang chủ.' },
  { value: 'homepage-stats', label: 'Homepage Stats', description: 'Block thống kê cho trang chủ.' },
  { value: 'homepage-programs', label: 'Homepage Programs', description: 'Danh sách chương trình đào tạo.' },
  { value: 'homepage-tutor', label: 'Homepage Tutor', description: 'Thông tin giảng viên / tutor.' },
  { value: 'homepage-testimonials', label: 'Homepage Testimonials', description: 'Khối review học viên cho trang chủ.' },
  { value: 'homepage-contact', label: 'Homepage Contact', description: 'Block CTA / contact cho trang chủ.' },
  { value: 'trial-registration-dialog', label: 'Trial Registration', description: 'Form đăng ký học thử và các trường nhập.' },
]

export const KNOWN_COMPONENT_TYPES = COMPONENT_TYPE_OPTIONS.map((option) => option.value)

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseConfigValue(raw: string): Record<string, JsonValue> {
  const trimmed = raw.trim()
  if (!trimmed) return {}
  try {
    const parsed = JSON.parse(trimmed)
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function stringifyConfig(config: Record<string, JsonValue>): string {
  return JSON.stringify(config, null, 2)
}

export function buildDefaultConfig(componentType: string): Record<string, JsonValue> {
  switch (componentType) {
    case 'hero':
      return {
        eyebrow: '',
        title: '',
        subtitle: '',
        imageUrl: '',
        primaryButtonLabel: '',
        primaryButtonHref: '',
        secondaryButtonLabel: '',
        secondaryButtonHref: '',
      }
    case 'cta':
      return {
        title: '',
        subtitle: '',
        buttonLabel: '',
        buttonHref: '',
        variant: 'primary',
      }
    case 'featured-split':
      return {
        overline: '',
        title: '',
        quote: '',
        description: '',
        imageUrl: '',
        badges: [{ label: '', iconName: 'sparkles' }],
        stats: [{ value: '', label: '' }],
      }
    case 'pricing':
      return {
        title: '',
        subtitle: '',
        plans: [{ name: '', price: '', description: '', ctaLabel: '', featured: false, features: [''] }],
      }
    case 'stats':
      return {
        title: '',
        subtitle: '',
        items: [{ value: '', label: '' }],
      }
    case 'testimonials':
      return {
        title: '',
        subtitle: '',
        items: [{ quote: '', author: '', role: '' }],
      }
    case 'team':
      return {
        title: '',
        subtitle: '',
        members: [{ name: '', role: '', description: '', imageUrl: '' }],
      }
    case 'faqs':
      return {
        title: '',
        subtitle: '',
        items: [{ question: '', answer: '' }],
      }
    case 'banners':
      return {
        title: '',
        subtitle: '',
        imageUrl: '',
        buttonLabel: '',
        buttonHref: '',
        variant: 'primary',
      }
    case 'twocolumn':
      return {
        eyebrow: '',
        title: '',
        subtitle: '',
        imageUrl: '',
        buttonLabel: '',
        buttonHref: '',
        reverse: false,
      }
    case 'homepage-hero':
      return {
        badge: '',
        headline: '',
        subtext: '',
        primaryButtonLabel: '',
        primaryButtonHref: '#contact',
        secondaryButtonLabel: '',
        secondaryButtonHref: '#courses',
        imageUrl: '',
      }
    case 'homepage-stats':
      return {
        items: [{ value: '', label: '' }],
      }
    case 'homepage-programs':
      return {
        heading: 'Chương trình đào tạo',
        items: [{ title: '', description: '', href: '', iconName: 'GraduationCap' }],
      }
    case 'homepage-tutor':
      return {
        name: '',
        title: '',
        quote: '',
        description: '',
        imageUrl: '',
        stat1Value: '',
        stat1Label: '',
        stat2Value: '',
        stat2Label: '',
      }
    case 'homepage-testimonials':
      return {
        heading: 'Chia sẻ từ học viên',
        items: [{ quote: '', author: '', role: '', avatarUrl: '' }],
      }
    case 'homepage-contact':
      return {
        eyebrow: '',
        title: '',
        subtitle: '',
        buttonLabel: '',
      }
    case 'trial-registration-dialog':
      return {
        title: 'Đăng ký Học thử Miễn phí',
        description: 'Bắt đầu lộ trình chinh phục môn Toán cùng chuyên gia.',
        submitButtonLabel: 'Xác nhận Đăng ký',
        successMessage: 'Đăng ký thành công!',
        errorMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        submitUrl: '',
        submitMethod: 'POST',
        fields: [
          {
            key: 'fullName',
            label: 'Họ và tên',
            type: 'text',
            required: true,
            placeholder: 'Nguyễn Văn A',
          },
        ],
      }
    default:
      return {}
  }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asBoolean(value: unknown): boolean {
  return value === true
}

function asRecordArray(value: unknown): Record<string, JsonValue>[] {
  if (!Array.isArray(value)) return []
  return value.filter(isRecord)
}

export default function ComponentConfigEditor({ componentType, configValue, onChange }: ComponentConfigEditorProps) {
  const config = parseConfigValue(configValue)
  const selectedType = componentType || 'hero'
  const updateConfig = (patch: Record<string, JsonValue>) => {
    onChange(stringifyConfig({ ...config, ...patch }))
  }

  const renderHeroFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className={labelClasses}>Eyebrow</label>
        <input value={asString(config.eyebrow)} onChange={(e) => updateConfig({ eyebrow: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Image URL</label>
        <input value={asString(config.imageUrl)} onChange={(e) => updateConfig({ imageUrl: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Title</label>
        <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Subtitle</label>
        <textarea value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div>
        <label className={labelClasses}>Primary button label</label>
        <input value={asString(config.primaryButtonLabel)} onChange={(e) => updateConfig({ primaryButtonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Primary button href</label>
        <input value={asString(config.primaryButtonHref)} onChange={(e) => updateConfig({ primaryButtonHref: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Secondary button label</label>
        <input value={asString(config.secondaryButtonLabel)} onChange={(e) => updateConfig({ secondaryButtonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Secondary button href</label>
        <input value={asString(config.secondaryButtonHref)} onChange={(e) => updateConfig({ secondaryButtonHref: e.target.value })} className={inputClasses} />
      </div>
    </div>
  )

  const renderCtaFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={labelClasses}>Title</label>
        <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Subtitle</label>
        <textarea value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div>
        <label className={labelClasses}>Button label</label>
        <input value={asString(config.buttonLabel)} onChange={(e) => updateConfig({ buttonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Button href</label>
        <input value={asString(config.buttonHref)} onChange={(e) => updateConfig({ buttonHref: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Variant</label>
        <select value={asString(config.variant)} onChange={(e) => updateConfig({ variant: e.target.value })} className={inputClasses}>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>
    </div>
  )

  const renderPricingFields = () => {
    const plans = asRecordArray(config.plans)
    const updatePlan = (index: number, patch: Record<string, JsonValue>) => {
      const nextPlans = plans.map((plan, idx) => idx === index ? { ...plan, ...patch } : plan)
      updateConfig({ plans: nextPlans })
    }
    const addPlan = () => updateConfig({ plans: [...plans, { name: '', price: '', description: '', ctaLabel: '', featured: false, features: [''] }] })
    const removePlan = (index: number) => updateConfig({ plans: plans.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Title</label>
            <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Subtitle</label>
            <input value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">Plans</p>
          <button type="button" onClick={addPlan} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm gói
          </button>
        </div>
        <div className="space-y-3">
          {plans.map((plan, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">Gói {index + 1}</span>
                <button type="button" onClick={() => removePlan(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClasses}>Name</label>
                  <input value={asString(plan.name)} onChange={(e) => updatePlan(index, { name: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Price</label>
                  <input value={asString(plan.price)} onChange={(e) => updatePlan(index, { price: e.target.value })} className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Description</label>
                  <textarea value={asString(plan.description)} onChange={(e) => updatePlan(index, { description: e.target.value })} className={inputClasses + ' min-h-[80px]'} rows={2} />
                </div>
                <div>
                  <label className={labelClasses}>CTA label</label>
                  <input value={asString(plan.ctaLabel)} onChange={(e) => updatePlan(index, { ctaLabel: e.target.value })} className={inputClasses} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input id={`featured-${index}`} type="checkbox" checked={asBoolean(plan.featured)} onChange={(e) => updatePlan(index, { featured: e.target.checked })} />
                  <label htmlFor={`featured-${index}`} className="text-sm text-mist-700">Featured</label>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Features (one per line)</label>
                  <textarea value={Array.isArray(plan.features) ? (plan.features as string[]).join('\n') : ''} onChange={(e) => updatePlan(index, { features: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })} className={inputClasses + ' min-h-[90px]'} rows={4} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderStatsFields = () => {
    const items = asRecordArray(config.items)
    const updateItem = (index: number, patch: Record<string, JsonValue>) => {
      const nextItems = items.map((item, idx) => idx === index ? { ...item, ...patch } : item)
      updateConfig({ items: nextItems })
    }
    const addItem = () => updateConfig({ items: [...items, { value: '', label: '' }] })
    const removeItem = (index: number) => updateConfig({ items: items.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Title</label>
            <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Subtitle</label>
            <input value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">Items</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm item
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">Item {index + 1}</span>
                <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3">
                <div>
                  <label className={labelClasses}>Value</label>
                  <input value={asString(item.value)} onChange={(e) => updateItem(index, { value: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Label</label>
                  <input value={asString(item.label)} onChange={(e) => updateItem(index, { label: e.target.value })} className={inputClasses} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTestimonialsFields = () => {
    const items = asRecordArray(config.items)
    const updateItem = (index: number, patch: Record<string, JsonValue>) => {
      const nextItems = items.map((item, idx) => idx === index ? { ...item, ...patch } : item)
      updateConfig({ items: nextItems })
    }
    const addItem = () => updateConfig({ items: [...items, { quote: '', author: '', role: '' }] })
    const removeItem = (index: number) => updateConfig({ items: items.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Title</label>
            <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Subtitle</label>
            <input value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">Testimonials</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm testimonial
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">Testimonial {index + 1}</span>
                <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3">
                <div>
                  <label className={labelClasses}>Quote</label>
                  <textarea value={asString(item.quote)} onChange={(e) => updateItem(index, { quote: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
                </div>
                <div>
                  <label className={labelClasses}>Author</label>
                  <input value={asString(item.author)} onChange={(e) => updateItem(index, { author: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Role</label>
                  <input value={asString(item.role)} onChange={(e) => updateItem(index, { role: e.target.value })} className={inputClasses} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTeamFields = () => {
    const members = asRecordArray(config.members)
    const updateMember = (index: number, patch: Record<string, JsonValue>) => {
      const nextMembers = members.map((member, idx) => idx === index ? { ...member, ...patch } : member)
      updateConfig({ members: nextMembers })
    }
    const addMember = () => updateConfig({ members: [...members, { name: '', role: '', description: '', imageUrl: '' }] })
    const removeMember = (index: number) => updateConfig({ members: members.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Title</label>
            <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Subtitle</label>
            <input value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">Members</p>
          <button type="button" onClick={addMember} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm thành viên
          </button>
        </div>
        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">Member {index + 1}</span>
                <button type="button" onClick={() => removeMember(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClasses}>Name</label>
                  <input value={asString(member.name)} onChange={(e) => updateMember(index, { name: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Role</label>
                  <input value={asString(member.role)} onChange={(e) => updateMember(index, { role: e.target.value })} className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Description</label>
                  <textarea value={asString(member.description)} onChange={(e) => updateMember(index, { description: e.target.value })} className={inputClasses + ' min-h-[80px]'} rows={2} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Image URL</label>
                  <input value={asString(member.imageUrl)} onChange={(e) => updateMember(index, { imageUrl: e.target.value })} className={inputClasses} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderFaqsFields = () => {
    const items = asRecordArray(config.items)
    const updateItem = (index: number, patch: Record<string, JsonValue>) => {
      const nextItems = items.map((item, idx) => idx === index ? { ...item, ...patch } : item)
      updateConfig({ items: nextItems })
    }
    const addItem = () => updateConfig({ items: [...items, { question: '', answer: '' }] })
    const removeItem = (index: number) => updateConfig({ items: items.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Title</label>
            <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Subtitle</label>
            <input value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">FAQs</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm câu hỏi
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">FAQ {index + 1}</span>
                <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3">
                <div>
                  <label className={labelClasses}>Question</label>
                  <input value={asString(item.question)} onChange={(e) => updateItem(index, { question: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Answer</label>
                  <textarea value={asString(item.answer)} onChange={(e) => updateItem(index, { answer: e.target.value })} className={inputClasses + ' min-h-[80px]'} rows={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderBannerFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={labelClasses}>Title</label>
        <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Subtitle</label>
        <textarea value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div>
        <label className={labelClasses}>Image URL</label>
        <input value={asString(config.imageUrl)} onChange={(e) => updateConfig({ imageUrl: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Button label</label>
        <input value={asString(config.buttonLabel)} onChange={(e) => updateConfig({ buttonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Button href</label>
        <input value={asString(config.buttonHref)} onChange={(e) => updateConfig({ buttonHref: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Variant</label>
        <select value={asString(config.variant)} onChange={(e) => updateConfig({ variant: e.target.value })} className={inputClasses}>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>
    </div>
  )

  const renderHomepageHeroFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className={labelClasses}>Badge</label>
        <input value={asString(config.badge)} onChange={(e) => updateConfig({ badge: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Image URL</label>
        <input value={asString(config.imageUrl)} onChange={(e) => updateConfig({ imageUrl: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Headline</label>
        <textarea value={asString(config.headline)} onChange={(e) => updateConfig({ headline: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Subtext</label>
        <textarea value={asString(config.subtext)} onChange={(e) => updateConfig({ subtext: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div>
        <label className={labelClasses}>Primary button label</label>
        <input value={asString(config.primaryButtonLabel)} onChange={(e) => updateConfig({ primaryButtonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Primary button href</label>
        <input value={asString(config.primaryButtonHref)} onChange={(e) => updateConfig({ primaryButtonHref: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Secondary button label</label>
        <input value={asString(config.secondaryButtonLabel)} onChange={(e) => updateConfig({ secondaryButtonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Secondary button href</label>
        <input value={asString(config.secondaryButtonHref)} onChange={(e) => updateConfig({ secondaryButtonHref: e.target.value })} className={inputClasses} />
      </div>
    </div>
  )

  const renderHomepageStatsFields = () => {
    const items = asRecordArray(config.items)
    const updateItem = (index: number, patch: Record<string, JsonValue>) => {
      const nextItems = items.map((item, idx) => idx === index ? { ...item, ...patch } : item)
      updateConfig({ items: nextItems })
    }
    const addItem = () => updateConfig({ items: [...items, { value: '', label: '' }] })
    const removeItem = (index: number) => updateConfig({ items: items.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">Stats items</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm item
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">Item {index + 1}</span>
                <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3">
                <div>
                  <label className={labelClasses}>Value</label>
                  <input value={asString(item.value)} onChange={(e) => updateItem(index, { value: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Label</label>
                  <input value={asString(item.label)} onChange={(e) => updateItem(index, { label: e.target.value })} className={inputClasses} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderHomepageProgramsFields = () => {
    const items = asRecordArray(config.items)
    const updateItem = (index: number, patch: Record<string, JsonValue>) => {
      const nextItems = items.map((item, idx) => idx === index ? { ...item, ...patch } : item)
      updateConfig({ items: nextItems })
    }
    const addItem = () => updateConfig({ items: [...items, { title: '', description: '', href: '', iconName: 'GraduationCap' }] })
    const removeItem = (index: number) => updateConfig({ items: items.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Heading</label>
          <input value={asString(config.heading)} onChange={(e) => updateConfig({ heading: e.target.value })} className={inputClasses} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">Programs</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm chương trình
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">Program {index + 1}</span>
                <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3">
                <div>
                  <label className={labelClasses}>Title</label>
                  <input value={asString(item.title)} onChange={(e) => updateItem(index, { title: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Description</label>
                  <textarea value={asString(item.description)} onChange={(e) => updateItem(index, { description: e.target.value })} className={inputClasses + ' min-h-[80px]'} rows={3} />
                </div>
                <div>
                  <label className={labelClasses}>Link</label>
                  <input value={asString(item.href)} onChange={(e) => updateItem(index, { href: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Icon</label>
                  <input value={asString(item.iconName)} onChange={(e) => updateItem(index, { iconName: e.target.value })} className={inputClasses} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderHomepageTutorFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className={labelClasses}>Name</label>
        <input value={asString(config.name)} onChange={(e) => updateConfig({ name: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Title</label>
        <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Quote</label>
        <textarea value={asString(config.quote)} onChange={(e) => updateConfig({ quote: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Description</label>
        <textarea value={asString(config.description)} onChange={(e) => updateConfig({ description: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div>
        <label className={labelClasses}>Image URL</label>
        <input value={asString(config.imageUrl)} onChange={(e) => updateConfig({ imageUrl: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Stat 1 value</label>
        <input value={asString(config.stat1Value)} onChange={(e) => updateConfig({ stat1Value: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Stat 1 label</label>
        <input value={asString(config.stat1Label)} onChange={(e) => updateConfig({ stat1Label: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Stat 2 value</label>
        <input value={asString(config.stat2Value)} onChange={(e) => updateConfig({ stat2Value: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Stat 2 label</label>
        <input value={asString(config.stat2Label)} onChange={(e) => updateConfig({ stat2Label: e.target.value })} className={inputClasses} />
      </div>
    </div>
  )

  const renderHomepageTestimonialsFields = () => {
    const items = asRecordArray(config.items)
    const updateItem = (index: number, patch: Record<string, JsonValue>) => {
      const nextItems = items.map((item, idx) => idx === index ? { ...item, ...patch } : item)
      updateConfig({ items: nextItems })
    }
    const addItem = () => updateConfig({ items: [...items, { quote: '', author: '', role: '', avatarUrl: '' }] })
    const removeItem = (index: number) => updateConfig({ items: items.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Heading</label>
          <input value={asString(config.heading)} onChange={(e) => updateConfig({ heading: e.target.value })} className={inputClasses} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-mist-600">Testimonials</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
            <PlusCircle className="h-4 w-4" /> Thêm testimonial
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-mist-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-mist-700">Testimonial {index + 1}</span>
                <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
              <div className="grid gap-3">
                <div>
                  <label className={labelClasses}>Quote</label>
                  <textarea value={asString(item.quote)} onChange={(e) => updateItem(index, { quote: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
                </div>
                <div>
                  <label className={labelClasses}>Author</label>
                  <input value={asString(item.author)} onChange={(e) => updateItem(index, { author: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Role</label>
                  <input value={asString(item.role)} onChange={(e) => updateItem(index, { role: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Avatar URL</label>
                  <input value={asString(item.avatarUrl)} onChange={(e) => updateItem(index, { avatarUrl: e.target.value })} className={inputClasses} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderHomepageContactFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className={labelClasses}>Eyebrow</label>
        <input value={asString(config.eyebrow)} onChange={(e) => updateConfig({ eyebrow: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Button label</label>
        <input value={asString(config.buttonLabel)} onChange={(e) => updateConfig({ buttonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Title</label>
        <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Subtitle</label>
        <textarea value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
    </div>
  )

  const renderTwoColumnFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className={labelClasses}>Eyebrow</label>
        <input value={asString(config.eyebrow)} onChange={(e) => updateConfig({ eyebrow: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Image URL</label>
        <input value={asString(config.imageUrl)} onChange={(e) => updateConfig({ imageUrl: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Title</label>
        <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2">
        <label className={labelClasses}>Subtitle</label>
        <textarea value={asString(config.subtitle)} onChange={(e) => updateConfig({ subtitle: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
      </div>
      <div>
        <label className={labelClasses}>Button label</label>
        <input value={asString(config.buttonLabel)} onChange={(e) => updateConfig({ buttonLabel: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Button href</label>
        <input value={asString(config.buttonHref)} onChange={(e) => updateConfig({ buttonHref: e.target.value })} className={inputClasses} />
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <input id="reverse-layout" type="checkbox" checked={asBoolean(config.reverse)} onChange={(e) => updateConfig({ reverse: e.target.checked })} />
        <label htmlFor="reverse-layout" className="text-sm text-mist-700">Reverse layout</label>
      </div>
    </div>
  )

  const renderTrialFields = () => {
    const fields = asRecordArray(config.fields)
    const updateField = (index: number, patch: Record<string, JsonValue>) => {
      const nextFields = fields.map((field, idx) => idx === index ? { ...field, ...patch } : field)
      updateConfig({ fields: nextFields })
    }
    const addField = () => updateConfig({ fields: [...fields, { key: '', label: '', type: 'text', required: false, placeholder: '' }] })
    const removeField = (index: number) => updateConfig({ fields: fields.filter((_, idx) => idx !== index) })

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Title</label>
            <input value={asString(config.title)} onChange={(e) => updateConfig({ title: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Submit button label</label>
            <input value={asString(config.submitButtonLabel)} onChange={(e) => updateConfig({ submitButtonLabel: e.target.value })} className={inputClasses} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Description</label>
            <textarea value={asString(config.description)} onChange={(e) => updateConfig({ description: e.target.value })} className={inputClasses + ' min-h-[90px]'} rows={3} />
          </div>
          <div>
            <label className={labelClasses}>Submit URL</label>
            <input value={asString(config.submitUrl)} onChange={(e) => updateConfig({ submitUrl: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Submit method</label>
            <select value={asString(config.submitMethod)} onChange={(e) => updateConfig({ submitMethod: e.target.value })} className={inputClasses}>
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Success message</label>
            <input value={asString(config.successMessage)} onChange={(e) => updateConfig({ successMessage: e.target.value })} className={inputClasses} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Error message</label>
            <input value={asString(config.errorMessage)} onChange={(e) => updateConfig({ errorMessage: e.target.value })} className={inputClasses} />
          </div>
        </div>

        <div className="rounded-lg border border-mist-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-mist-800">Form fields</h4>
            <button type="button" onClick={addField} className="inline-flex items-center gap-2 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900">
              <PlusCircle className="h-4 w-4" /> Thêm field
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="rounded-lg border border-mist-200 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-mist-700">Field {index + 1}</span>
                  <button type="button" onClick={() => removeField(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                    <Trash2 className="h-4 w-4" /> Xóa
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className={labelClasses}>Key</label>
                    <input value={asString(field.key)} onChange={(e) => updateField(index, { key: e.target.value })} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Label</label>
                    <input value={asString(field.label)} onChange={(e) => updateField(index, { label: e.target.value })} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Type</label>
                    <select value={asString(field.type)} onChange={(e) => updateField(index, { type: e.target.value })} className={inputClasses}>
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="radio">Radio</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Placeholder</label>
                    <input value={asString(field.placeholder)} onChange={(e) => updateField(index, { placeholder: e.target.value })} className={inputClasses} />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input id={`required-${index}`} type="checkbox" checked={asBoolean(field.required)} onChange={(e) => updateField(index, { required: e.target.checked })} />
                    <label htmlFor={`required-${index}`} className="text-sm text-mist-700">Required</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderEditor = () => {
    switch (selectedType) {
      case 'hero':
        return renderHeroFields()
      case 'cta':
        return renderCtaFields()
      case 'pricing':
        return renderPricingFields()
      case 'stats':
        return renderStatsFields()
      case 'testimonials':
        return renderTestimonialsFields()
      case 'team':
        return renderTeamFields()
      case 'faqs':
        return renderFaqsFields()
      case 'banners':
        return renderBannerFields()
      case 'twocolumn':
        return renderTwoColumnFields()
      case 'homepage-hero':
        return renderHomepageHeroFields()
      case 'homepage-stats':
        return renderHomepageStatsFields()
      case 'homepage-programs':
        return renderHomepageProgramsFields()
      case 'homepage-tutor':
        return renderHomepageTutorFields()
      case 'homepage-testimonials':
        return renderHomepageTestimonialsFields()
      case 'homepage-contact':
        return renderHomepageContactFields()
      case 'trial-registration-dialog':
        return renderTrialFields()
      default:
        return (
          <div className="space-y-3">
            <p className="text-sm text-mist-600">Dùng JSON cấu hình cho component này. Bạn có thể chỉnh trực tiếp ở dưới đây.</p>
            <textarea value={configValue} onChange={(e) => onChange(e.target.value)} className={inputClasses + ' min-h-[220px] font-mono text-sm'} rows={10} />
          </div>
        )
    }
  }

  const selectedOption = COMPONENT_TYPE_OPTIONS.find((option) => option.value === selectedType) ?? COMPONENT_TYPE_OPTIONS[0]

  return (
    <div className="space-y-4 rounded-xl border border-mist-200 bg-mist-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-mist-800">Configuration</p>
          <p className="text-xs text-mist-600">Form sẽ đổi theo loại component bạn chọn để phù hợp hơn.</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(stringifyConfig(buildDefaultConfig(selectedType)))}
          className="rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:text-mist-900"
        >
          Reset cấu hình
        </button>
      </div>
      <div className="rounded-lg border border-mist-200 bg-white/80 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">Selected type</p>
        <p className="mt-1 text-sm font-semibold text-mist-800">{selectedOption.label}</p>
        <p className="text-xs text-mist-600">{selectedOption.description}</p>
      </div>
      {renderEditor()}
      <div className="rounded-lg border border-dashed border-mist-300 bg-white/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">JSON Preview</p>
        <pre className="mt-2 overflow-x-auto text-xs text-mist-700">{configValue || '{}'}</pre>
      </div>
    </div>
  )
}

