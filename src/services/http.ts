export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

type FetchJsonOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Typed JSON fetch wrapper:
 * - throws HttpError on non-2xx
 * - parses JSON response when present
 */
export async function fetchJson<T>(
  input: RequestInfo | URL,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(input, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const parsedBody = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (parsedBody && typeof parsedBody === "object" && "error" in parsedBody
        ? String((parsedBody as Record<string, unknown>).error)
        : res.statusText) || "Request failed";

    throw new HttpError(message, res.status, parsedBody);
  }

  return parsedBody as T;
}
