export function assertLocalContentEditingEnabled(): void {
  if (
    import.meta.env.PROD ||
    !import.meta.env.LOCAL_CONTENT_EDITOR_ENABLED
  ) {
    throw new Error(
      "Local content editing is disabled.",
    );
  }
}