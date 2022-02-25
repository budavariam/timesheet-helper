/** Data of a single project */
export type Project = { uuid: string, client: string, project: string, hexColor: string, totals: number[], adjustments: number[], ignore: boolean }
/** Exact Data coming from toggl */
export type ProjectResponse = { data: Project[], headers: string[], weekTotals: number[] }
/** Full grid data */

export type ProjectHeader = {
    Header: string,
    accessor: any,
    Footer?: (info: any) => void,
    width?: number,
  }

export type ProjectData = { projects: Project[], totals: number[], totalAdjustments: number[], headers: string[] }