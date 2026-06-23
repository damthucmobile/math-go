export default function AdminLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-12" aria-live="polite" aria-busy="true">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-mist-600 dark:border-mist-400 border-t-transparent" />
    </div>
  )
}
