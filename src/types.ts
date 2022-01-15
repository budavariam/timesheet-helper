export type Project = { uuid: string, client: string, project: string, hexColor: string, totals: number[], adjustments: number[] }
export type ProjectResponse = { data: Project[], headers: string[], weekTotals: number[] }
export type ProjectData = { projects: Project[], totals: number[], headers: string[] }