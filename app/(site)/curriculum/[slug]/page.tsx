import { notFound } from 'next/navigation'
import { getCurriculumData } from '@/lib/curriculum'
import CurriculumDashboard from '@/app/components/CurriculumDashboard'
import CurriculumNavigation from '@/app/components/navigator/CurriculumNavigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export default async function CurriculumPage({ params }: PageProps) {
  const { slug } = await params

  try {
    // Gọi data call động theo slug trên URL (ví dụ: tieu-hoc hoặc trung-hoc)
    const curriculumData = await getCurriculumData(slug)

    return (
      <main className="min-h-screen bg-slate-100 py-6 px-4">
        <CurriculumNavigation />
        {/* Component UI giữ nguyên vì cấu trúc JSON không đổi */}
        <CurriculumDashboard data={curriculumData} />
      </main>
    )
  } catch (error) {
    // Nếu truyền slug bậy bạ không có file JSON tương ứng -> trả về 404
    console.error(error)
    notFound()
  }
}