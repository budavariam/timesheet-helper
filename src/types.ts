export type Project = { uuid: string, client: string, project: string, hexColor: string, totals: number[] }
export type ProjectResponse = { data: Project[], headers: string[], weekTotals: number[] }