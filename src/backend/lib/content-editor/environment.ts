import "server-only";

export function assertLocalContentEditingEnabled(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Local content editing is disabled in production."
    );
  }
}