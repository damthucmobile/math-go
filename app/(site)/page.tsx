
import { getRecordAsync } from '@/lib/cms'
import { parseHomepageData, normalizeHomepageData } from '@/lib/homepage-data'
import HomePageClient from './HomePageClient'

export default async function Home() {
  const record = (await getRecordAsync('homepage')) ?? {}
  const homepageData = normalizeHomepageData(parseHomepageData(record?.sectionData))

  return <HomePageClient homepageData={homepageData} />
}
