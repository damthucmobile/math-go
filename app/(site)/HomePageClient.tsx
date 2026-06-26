'use client'

import { ComponentRenderer, type ComponentRecord } from '@/app/components/ComponentRenderer'
import TrialRegistrationDialog from '../components/dialog/TrialRegistrationDialog'
import { useEffect, useState } from 'react'
import type { HomepageData } from '../../lib/homepage-data'
import { OPEN_HERO_DIALOG_EVENT } from '@/app/components/ComponentRenderer/sections/HomepageHeroSection'

type HomePageClientProps = {
    homepageData: HomepageData
}

export default function HomePageClient({ homepageData }: HomePageClientProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        const handleOpenDialog = () => setIsDialogOpen(true)
        window.addEventListener(OPEN_HERO_DIALOG_EVENT, handleOpenDialog)
        return () => window.removeEventListener(OPEN_HERO_DIALOG_EVENT, handleOpenDialog)
    }, [])

    const sectionComponents: ComponentRecord[] = (homepageData.sections ?? []).map((section, index) => ({
        id: index + 1,
        type: section.type,
        label: section.type,
    }))

    const sharedSectionContext = {
        title: homepageData.hero.headline,
        content: homepageData.hero.subtext,
        featuredImage: homepageData.hero.imageUrl ? { url: homepageData.hero.imageUrl, alt: homepageData.hero.badge } : undefined,
        sectionData: {
            hero: {
                badge: homepageData.hero.badge,
                headline: homepageData.hero.headline,
                subtext: homepageData.hero.subtext,
                primaryButtonLabel: homepageData.hero.primaryButtonLabel,
                primaryButtonHref: homepageData.hero.primaryButtonHref,
                secondaryButtonLabel: homepageData.hero.secondaryButtonLabel,
                secondaryButtonHref: homepageData.hero.secondaryButtonHref,
                imageUrl: homepageData.hero.imageUrl,
            },
            stats: homepageData.stats.map((stat) => ({ value: stat.value, label: stat.label })),
            programs: homepageData.programs.map((program) => ({ title: program.title, description: program.description, href: program.href, iconName: program.iconName })),
            programsHeading: 'Chương trình đào tạo',
            tutor: homepageData.tutor.map((item) => ({
                name: item.name,
                title: item.title,
                quote: item.quote,
                description: item.description,
                imageUrl: item.imageUrl,
                stat1Value: item.stat1Value,
                stat1Label: item.stat1Label,
                stat2Value: item.stat2Value,
                stat2Label: item.stat2Label,
                badges: item.badges.map((badge) => ({ label: badge.label, iconName: badge.iconName })),
            })),
            testimonials: homepageData.testimonials.map((item) => ({ quote: item.quote, author: item.author, role: item.role, avatarUrl: item.avatarUrl })),
            testimonialsHeading: 'Chia Sẻ Từ Học Viên',
            contact: {
                eyebrow: homepageData.contact.eyebrow,
                title: homepageData.contact.title,
                subtitle: homepageData.contact.subtitle,
                buttonLabel: homepageData.contact.buttonLabel,
            },
        },
    }

    return (
        <main className="bg-slate-50 text-primary font-sans">
            {sectionComponents.map((component) => (
                <ComponentRenderer
                    key={component.id}
                    component={component}
                    contextData={sharedSectionContext}
                    className="w-full"
                />
            ))}
            <TrialRegistrationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </main>
    )
}
