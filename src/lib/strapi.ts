type Props = {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
};

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  let urlStr = `${import.meta.env.STRAPI_URL}/api/${endpoint}`;

  if (query) {
    const qs = Object.entries(query)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
    urlStr += `?${qs}`;
  }
  const headers: HeadersInit = {};

  // Add Authorization header if STRAPI_API_TOKEN is set
  headers.Authorization = `Bearer ${import.meta.env.STRAPI_API_TOKEN}`;

  const res = await fetch(urlStr, { headers });
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}
