import { Map, Set } from "immutable"

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

export type ProjectData = {
  projects: Project[],
  totals: number[],
  totalAdjustments: number[],
  headers: string[],
}

// root state

export type RootState = {
  start: string,
  weekLength: number,
  rounding: number,
  hideIgnored: boolean,
  adjustments: Map<string, number>,
  projectOrder: string[],
  projectData: ProjectData,
  originalProjectData: ProjectData,
  ignoreProjects: Set<string>,
}

export type RootAction = {
  type: string;
  value: string | number | TogglProjectResponse;
  projectID?: string | undefined;
  columnIndex?: number | undefined;
}

export type RootReducer = (state: RootState, action: RootAction) => RootState