export default function SiteLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-16" aria-live="polite" aria-busy="true">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-mist-600 border-t-transparent dark:border-mist-400" aria-hidden />
    </div>
  )
}
