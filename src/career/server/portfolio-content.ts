import { getCollection } from "astro:content"
import type { Locale, PortfolioContent, Project } from "../lib/types"

const locales = new Set<Locale>(["en", "sv", "zh"])

function entryIdentity(id: string, fallbackLang: Locale) {
  const clean = id.replace(/\.(md|mdx)$/i, "")
  const parts = clean.split("/")
  const language = locales.has(parts[0] as Locale) ? parts[0] as Locale : fallbackLang
  const slug = (locales.has(parts[0] as Locale) ? parts.slice(1) : parts).join("/") || clean
  return { clean, language, slug }
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const [projectEntries] = await Promise.all([
    getCollection("projects"),
  ])

  const projects: Project[] = projectEntries.map(entry => {
    const data = entry.data
    const { clean, language, slug } = entryIdentity(entry.id, data.lang)

    return {
      id: `project:${clean}`,
      sourceId: entry.id,
      language,
      title: data.title,
      slug,
      summary: data.description,
      contentMarkdown: entry.body ?? "",
      status: data.status,
      technologies: data.technologies,
      githubUrl: data.links?.github ?? "",
      demoUrl: data.links?.live ?? "",
      published: !data.draft,
      sortOrder: data.order,
    }
  })

  return {projects}
}
