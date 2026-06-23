/**
 * Shown while BlockEditor is loading (dynamic import). Keeps layout stable and is accessible.
 */
export function BlockEditorPlaceholder() {
  return (
    <div
      className="flex min-h-[320px] items-center justify-center rounded-xl border-2 border-dashed border-mist-200 bg-mist-50/50 dark:border-mist-700 dark:bg-mist-800/30"
      aria-busy="true"
      aria-label="Editor loading"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mist-600 dark:border-mist-400 border-t-transparent" />
        <span className="text-sm text-mist-500 dark:text-mist-400">Loading editor…</span>
      </div>
    </div>
  )
}
