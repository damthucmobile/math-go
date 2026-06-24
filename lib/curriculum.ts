import fs from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'
import { getProjectRoot } from '@/lib/project-root'
import { useBlobStorage, getBlobDataFile } from '@/lib/cms-blob'

const DATA_DIR = path.join(getProjectRoot(), 'data')
const CURRICULUM_PATH = path.join(DATA_DIR, 'lo_trinh_giang_day.json')

export interface GradeSystem {
  name: string
  content: string
}

export interface MatrixRow {
  group: string
  action: string
  psycho: string
}

export interface CurriculumBlock {
  id: string
  gradeName: string
  tagline: string
  duration: string
  coreGoal: string
  strategies?: string[]
  systems?: GradeSystem[]
  matrixTable?: MatrixRow[]
}

export interface ManagementRule {
  title: string
  content: string
}

export interface DynamicCurriculum {
  title: string
  subtitle: string
  blocks: CurriculumBlock[]
  rules: ManagementRule[]
}

// Hàm đọc file thuần túy theo slug
function getCurriculumFromFs(slug: string): DynamicCurriculum {
  const filePath = path.join(DATA_DIR, `curriculum-${slug}.json`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy lộ trình cho tuyến: ${slug}`)
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as DynamicCurriculum
}

async function getCurriculumFromBlob(slug: string): Promise<DynamicCurriculum> {
  const fileName = `curriculum-${slug}.json`
  const raw = await getBlobDataFile(fileName)
  if (!raw) {
    throw new Error(`Không tìm thấy lộ trình ${fileName} trong Blob Storage`)
  }
  return JSON.parse(raw) as DynamicCurriculum
}

// Bọc cache động theo slug
export async function getCurriculumData(slug: string): Promise<DynamicCurriculum> {
  const cacheFn = unstable_cache(
    async (s: string) => (useBlobStorage() ? getCurriculumFromBlob(s) : getCurriculumFromFs(s)),
    [`curriculum-data`],
    { revalidate: 60 }
  )
  return cacheFn(slug)
}