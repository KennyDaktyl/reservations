import { getAccessToken } from "@/utils";

export const fetchPostApiData = async <TResult, TVariables extends Record<string, unknown>>({
    url,
    body,
    method = "POST",
    next,
    cache = "default",
}: {
    url: string; 
    body: TVariables; 
    method?: "POST" | "PUT" | "DELETE"; 
    next?: NextFetchRequestConfig;
    cache?: RequestCache;
}): Promise<TResult | null> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    const token = getAccessToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
        cache,
        ...(next && { next }),
        credentials: "include",
    });

    if (res.status === 401) {
        throw { status: 401, message: "Unauthorized - Redirecting to login" };
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); 
        throw { status: res.status, message: errorData.message || `Unexpected status code: ${res.status}` };
    }

    if (res.status === 204) {
        return null; 
    }

    const data: TResult = (await res.json()) as TResult;
    return data;
};
