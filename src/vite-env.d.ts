/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_MAINTENANCE_MODE: string;
  readonly VITE_MAINTENANCE_DEV_EMAILS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}