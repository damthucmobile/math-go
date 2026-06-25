
import { getRecordAsync } from '@/lib/cms'
import { normalizeCoursePageData } from './types'
import { CoursesPageClient } from './CoursesPageClient'

export default async function CoursesPage() {
  const record = (await getRecordAsync('courses')) ?? {}
  const data = normalizeCoursePageData(record)

  return <CoursesPageClient data={data} />
}

