import type { AboutContent, Locale, SharedProjects, SharedSkills } from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body) headers.set("Content-Type", "application/json");

  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    const text = await response.text();
    let message = `HTTP ${response.status}`;
    if (text) {
      try {
        const body = JSON.parse(text) as { error?: string; detail?: string; title?: string };
        message = body.error ?? body.detail ?? body.title ?? text;
      } catch {
        message = text;
      }
    }
    throw new Error(message);
  }

  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}

export const localContentApi = {
  updateAbout: (locale: Locale, content: AboutContent) =>
    request<AboutContent>(`/api/local/about/${locale}`, { method: "PUT", body: JSON.stringify(content) }),
  updateSkills: (skills: SharedSkills) =>
    request<SharedSkills>("/api/local/skills", { method: "PUT", body: JSON.stringify(skills) }),
  updateProjects: (projects: SharedProjects) =>
    request<SharedProjects>("/api/local/projects", { method: "PUT", body: JSON.stringify(projects) }),
};
