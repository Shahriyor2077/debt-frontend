import { getApiUrl } from "./api";

export function getSessionId(): string | null {
    return localStorage.getItem("sessionId");
}

export function setSessionId(sessionId: string): void {
    localStorage.setItem("sessionId", sessionId);
}

export function clearSession(): void {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("username");
}

export function isAuthenticated(): boolean {
    return !!getSessionId();
}

export async function checkAuth(): Promise<boolean> {
    const sessionId = getSessionId();
    if (!sessionId) return false;

    try {
        const response = await fetch(getApiUrl("/api/auth/check"), {
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });
        const data = await response.json();
        return data.authenticated;
    } catch {
        return false;
    }
}

export async function logout(): Promise<void> {
    const sessionId = getSessionId();
    if (sessionId) {
        try {
            await fetch(getApiUrl("/api/auth/logout"), {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
            });
        } catch {
            // Ignore errors
        }
    }
    clearSession();
}
