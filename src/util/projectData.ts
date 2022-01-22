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
            adjustments: Array(7).fill(0),
            ignore: false,
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

export function manipulateData(project: ProjectData, weekLength: number, rounding: number, adjustments: any, ignoreProjects: any): ProjectData {
    const filterFn = filterByWeekLength(weekLength)
    const roundFn = roundToNearestNMinutes(rounding)
    const newProjects = [] as Project[]
    const dailyTotals = Array(7).fill(0)

    project.projects.forEach((project) => {
        const ignore = project.uuid in ignoreProjects
        const proj = {
            ...project,
            ignore,
            totals: project.totals.filter(filterFn)
        }

        const lineValues = Array(weekLength).fill(0)
        const adjustmentValues = Array(weekLength).fill(0)
        proj.totals.slice(0, -1).forEach((value, i) => {
            let item = value

            const adjustmentKey = `${proj.uuid}-${i}`
            if (adjustmentKey in adjustments) {
                const adj = adjustments[adjustmentKey]
                adjustmentValues[i] = adj
                item += adj
            }
            if (item < 0) {
                item = 0
            }
            lineValues[i] = item
            if (!ignore) {
                dailyTotals[i] += item
            }
        })
        lineValues.push(lineValues.reduce((acc, curr) => acc + curr, 0))

        proj.totals = lineValues.map(roundFn)
        proj.adjustments = adjustmentValues
        newProjects.push(proj)
    })
    dailyTotals.push(dailyTotals.reduce((acc, curr) => acc + curr, 0))
    return {
        projects: newProjects,
        headers: project.headers.filter(filterFn),
        totals: dailyTotals.filter(filterFn).map(roundFn),
    }
}