let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

export const refreshFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  options.credentials = "include";

  let response = await fetch(url, options);

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise<Response>((resolve) => {
        refreshSubscribers.push(() => {
          resolve(fetch(url, options));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshResponse.ok) throw new Error("Refresh failed");

      isRefreshing = false;

      refreshSubscribers.forEach((cb) => cb());
      refreshSubscribers = [];

      return fetch(url, options);
    } catch (error) {}
  }

  return response;
};
