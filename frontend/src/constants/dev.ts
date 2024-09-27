export const isDevelopment = import.meta.env.MODE === 'development';
export const isShowDebugLog = isDevelopment && import.meta.env.VITE_DEV_SHOW_RERENDER_LOG === 'true';
