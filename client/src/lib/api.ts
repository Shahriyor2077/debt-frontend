// Production'da backend URL, development'da proxy orqali
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export function getApiUrl(path: string): string {
    // path "/api/..." formatida keladi
    return `${API_BASE_URL}${path}`;
}
