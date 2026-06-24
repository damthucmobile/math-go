'use client';

import Link from 'next/link';
import { GraduationCap, Calculator, Sigma } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ROUTE_BUILDERS } from '@/lib/routes';

export default function CurriculumNavigation() {
  const pathname = usePathname();

  const items = [
    {
      href: ROUTE_BUILDERS.CURRICULUM_BY_SLUG('tieu-hoc'),
      label: 'Tiểu học',
      icon: GraduationCap,
    },
    {
      href: ROUTE_BUILDERS.CURRICULUM_BY_SLUG('trung-hoc'),
      label: 'Trung học (Cấp 2)',
      icon: Calculator,
    },
    {
      href: ROUTE_BUILDERS.CURRICULUM_BY_SLUG('trung-hoc-pho-thong'),
      label: 'THPT (Cấp 3)',
      icon: Sigma,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto mb-6 flex flex-wrap justify-center gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname == item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${active
              ? 'bg-[#1a365d] text-white shadow-md'
              : 'bg-white text-[#1a365d] border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}