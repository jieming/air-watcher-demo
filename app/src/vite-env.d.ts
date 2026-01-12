/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OPENWEATHER_API_KEY: string
    readonly VITE_BACKEND_API_PORT?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
