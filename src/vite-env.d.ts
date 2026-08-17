/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DND5E_API_ROOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

