// components/NavLinks.tsx
'use client'

import { usePathname } from 'next/navigation'
import { NavbarLink } from './oatmeal/sections'

export default function NavLinks({ items }: any) {
  const pathname = usePathname()

  return (
    <>
      {items.map((item: any) => {
        const isActive =
          pathname === item.url ||
          pathname.startsWith(`${item.url}/`)
        return (
          <NavbarLink
            key={item.url}
            href={item.url}
            className={
              isActive
                ? 'text-[#00355f] font-semibold lg:after:!w-full'
                : ''
            }
          >
            {item.label}
          </NavbarLink>
        )
      })}
    </>
  )
}