import { getAccessToken } from "@/utils";

export const fetchPostApiData = async <TResult, TVariables extends Record<string, unknown>>({
    url,
    body,
    method = "POST",
    next,
    cache = "default",
    responseType = "json",
}: {
    url: string;
    body: TVariables;
    method?: "POST" | "PUT" | "DELETE";
    next?: NextFetchRequestConfig;
    cache?: RequestCache;
    responseType?: "json" | "blob" | "text";
}): Promise<TResult> => {
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
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        throw new Error("Request failed");
    }

    if (responseType === "blob") {
        return (await res.blob()) as TResult;
    }

    if (responseType === "text") {
        return (await res.text()) as TResult;
    }

    return (await res.json()) as TResult;
};
