/** Data of a single project */
export type Project = { uuid: string, client: string, project: string, hexColor: string, totals: number[], adjustments: number[], ignore: boolean }
/** Full grid data */
export type ProjectResponse = { data: Project[], headers: string[], week_totals: number[] }

/** Exact Data coming from toggl */
export type TogglProject = {
  title: {
    client: string,
    project: string,
    hex_color: string,
  },
  ignore: boolean,
  totals: number[],
}
export type TogglProjectResponse = {
  data: TogglProject[],
  week_totals: number[]
}

export type ProjectData = { projects: Project[], totals: number[], totalAdjustments: number[], headers: string[] }