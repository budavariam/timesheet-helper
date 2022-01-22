export type Project = { uuid: string, client: string, project: string, hexColor: string, totals: number[], adjustments: number[], ignore: boolean }
export type ProjectResponse = { data: Project[], headers: string[], weekTotals: number[] }
export type ProjectData = { projects: Project[], totals: number[], headers: string[] }