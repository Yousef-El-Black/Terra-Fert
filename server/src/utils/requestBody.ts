export const getRequestBody = (
  body: unknown,
): Record<string, unknown> | null =>
  typeof body === "object" && body !== null && !Array.isArray(body)
    ? (body as Record<string, unknown>)
    : null;
