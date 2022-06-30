interface Window {
  showOpenFilePicker: (options?: {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<FileSystemFileHandle[]>;
}

interface FileSystemFileHandle {
  queryPermission: (options: {
    mode: 'read' | 'readwrite';
  }) => Promise<PermissionState>;

  requestPermission: (options: {
    mode: 'read' | 'readwrite';
  }) => Promise<PermissionState>;
}
