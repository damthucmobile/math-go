export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4" aria-live="polite" aria-busy="true">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-mist-600 dark:border-mist-400 border-t-transparent" aria-hidden />
      <span className="text-sm text-mist-600 dark:text-mist-400">Loading…</span>
    </div>
  )
}
