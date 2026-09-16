import type {
  AboutContent,
  Locale,
  Project,
} from "./types";


async function request<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const headers =
    new Headers(
      init?.headers,
    );

  if (init?.body) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const response =
    await fetch(
      url,
      {
        ...init,
        headers,
      },
    );


  if (!response.ok) {
    const text =
      await response.text();

    let message =
      `HTTP ${response.status}`;

    if (text) {
      try {
        const body =
          JSON.parse(
            text,
          ) as {
            error?: string;
            detail?: string;
            title?: string;
          };

        message =
          body.error ??
          body.detail ??
          body.title ??
          text;
      } catch {
        message =
          text;
      }
    }

    throw new Error(
      message,
    );
  }


  if (
    response.status === 204
  ) {
    return undefined as T;
  }


  return response.json() as Promise<T>;
}


export const localContentApi = {
  updateAbout: (
    locale: Locale,
    content: AboutContent,
  ) =>
    request<AboutContent>(
      `/api/local/about/${locale}`,
      {
        method: "PUT",

        body:
          JSON.stringify(
            content,
          ),
      },
    ),


  saveProject: (
    project: Project,
  ) =>
    request<Project>(
      "/api/local/projects",
      {
        method: "PUT",

        body:
          JSON.stringify(
            project,
          ),
      },
    ),


  deleteProject: (
    sourceId: string,
  ) =>
    request<void>(
      `/api/local/projects?sourceId=${encodeURIComponent(
        sourceId,
      )}`,
      {
        method: "DELETE",
      },
    ),
};