/** Block tool constructor shape for EditorJS embed tool */
type EmbedBlockToolConstructor = new (config: { data?: object; api?: object }) => object

declare module '@editorjs/embed' {
  const Embed: EmbedBlockToolConstructor
  export default Embed
}
