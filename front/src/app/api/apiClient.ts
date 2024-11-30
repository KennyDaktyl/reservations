import { getAccessToken } from "@/utils";
import { redirect } from "next/navigation";

export const fetchGetApiData = async <TResult, TVariables extends Record<string, unknown>>({
    url,
    variables,
    next,
    cache = "default",
    sessionid,
}: {
    url: string;
    variables: TVariables;
    next?: NextFetchRequestConfig;
    cache?: RequestCache;
    sessionid?: string;
}): Promise<TResult | { status: number }> => {
    const apiUrl = new URL(url);
    Object.keys(variables).forEach((key) => apiUrl.searchParams.append(key, String(variables[key])));

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Cookie: `sessionid=${sessionid || ""}`,
    };

    const token = getAccessToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(apiUrl.toString(), {
        method: "GET",
        headers,
        cache,
        ...(next && { next }),
    });

    if (res.status === 401) {
        redirect("/auth/login");
        return { status: 401 }; 
    }

    if (!res.ok) {
        return { status: res.status }; 
    }

    const data: TResult = (await res.json()) as TResult;
    return data;
};
