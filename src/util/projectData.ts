import { Project, ProjectData, ProjectResponse } from "../types";
import { enumerateDaysBetweenDates } from "../util/generateDate"
import { v4 as uuidv4 } from "uuid"
import moment from 'moment';

export function processProjectData(response: any, dateFrom: string, dateTo: string): ProjectData {
    const projects: Project[] = response.data.map((project: any): Project => {
        return {
            uuid: uuidv4(),
            client: project.title.client || "-",
            project: project.title.project || "-",
            hexColor: project.title.hex_color || "#000000",
            totals: project.totals,
        }
    }
    ).sort((a: Project, b: Project) => a.client.localeCompare(b.client))
    const totals = (response.week_totals || []) as number[]
    const headers = enumerateDaysBetweenDates(moment(dateFrom), moment(dateTo))

    return {
        projects,
        headers,
        totals,
    }
}

const filterByWeekLength = (weekLength: number) => (e: any, i: number) => {
    return !(weekLength === 5 && (i === 5 || i === 6))
}

export function filterProjectDataByWeekLength(project: ProjectData, weekLength: number): ProjectData {
    const filterFn = filterByWeekLength(weekLength)
    const newProjects = [] as Project[]

    project.projects.forEach((project) => {
        const proj = {
            ...project,
            totals: project.totals.filter(filterFn)
        }
        newProjects.push(proj)
    })

    return {
        projects: newProjects,
        headers: project.headers.filter(filterFn),
        totals: project.totals.filter(filterFn),
    }
}