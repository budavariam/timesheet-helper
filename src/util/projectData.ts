import { Project, ProjectData, ProjectResponse } from "../types";
import { enumerateDaysBetweenDates, roundToNearestNMinutes } from "../util/generateDate"
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

export function manipulateData(project: ProjectData, weekLength: number, rounding: number): ProjectData {
    const filterFn = filterByWeekLength(weekLength)
    const roundFn = roundToNearestNMinutes(rounding)
    const newProjects = [] as Project[]
    const dailyTotals = Array(7).fill(0)

    project.projects.forEach((project) => {
        const proj = {
            ...project,
            totals: project.totals.filter(filterFn).map(roundFn)
        }
        let projTotal = 0
        proj.totals.slice(0, -1).forEach((item, i) => {
            projTotal += item
            dailyTotals[i] += item
        })
        proj.totals[proj.totals.length - 1] = projTotal

        newProjects.push(proj)
    })
    dailyTotals.push(dailyTotals.reduce((acc, curr) => acc + curr, 0))
    return {
        projects: newProjects,
        headers: project.headers.filter(filterFn),
        totals: dailyTotals.filter(filterFn).map(roundFn),
    }
}