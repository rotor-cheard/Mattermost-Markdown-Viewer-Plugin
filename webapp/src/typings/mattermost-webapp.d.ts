export type Store = any;
export interface FileInfo { id: string; name: string; mime_type?: string; }
export interface PluginRegistry {
  registerFilePreviewComponent: (
    predicate: (fileInfo: FileInfo) => boolean,
    component: any
  ) => void;
}
