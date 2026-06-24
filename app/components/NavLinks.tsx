// components/NavLinks.tsx
'use client'

import { usePathname } from 'next/navigation'
import { NavbarLink } from './oatmeal/sections'

export default function NavLinks({ items }: any) {
  const pathname = usePathname()

  return (
    <>
      {items.map((item: any) => {
        const isActive = pathname === item.url
        return (
          <NavbarLink
            key={item.url}
            href={item.url}
            className={isActive ? 'text-orange-500' : ''}
          >
            {item.label}
          </NavbarLink>
        )
      })}
    </>
  )
}