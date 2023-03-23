import { Project, ProjectData, TogglProject, TogglProjectResponse } from "../types";
import { enumerateDaysBetweenDates, roundToNearestNMinutes } from "./generateDate"
import { v4 as uuidv4 } from "uuid"
import moment from 'moment';
import { Map, Set } from "immutable"
import { ROUNDED_ADJUSTMENTS } from "./const";

export function processProjectData(response: TogglProjectResponse, dateFrom: string, dateTo: string): ProjectData {
    const projects: Project[] = response.data.map((project: TogglProject): Project => {
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
    const totalAdjustments = [] as number[]
    const headers = enumerateDaysBetweenDates(moment(dateFrom), moment(dateTo))

    return {
        projects,
        headers,
        totals,
        totalAdjustments,
    }
}

const filterByWeekLength = (weekLength: number) => (_e: unknown, i: number) => {
    return !(weekLength === 5 && (i === 5 || i === 6))
}

export function manipulateData(project: ProjectData, weekLength: number, rounding: number, adjustments: Map<string, number>, ignoreProjects: Set<string>, autoIgnoreProjects: Set<string>, projectOrder: string[] = []): ProjectData {
    const filterFn = filterByWeekLength(weekLength)
    const roundFn = roundToNearestNMinutes(rounding)
    const sortFn = projectOrder.length
        ? (list: Project[]) => list.sort((a, b) => projectOrder.indexOf(a.uuid) - projectOrder.indexOf(b.uuid))
        : (list: Project[]) => list
    const newProjects = [] as Project[]
    const dailyTotals = Array(7).fill(0)
    const dailyTotalAdjustments = Array(7).fill(0)

    project.projects.forEach((project) => {
        const shouldIgnore = ignoreProjects.has(project.uuid) || autoIgnoreProjects.has(project.client)
        const proj = {
            ...project,
            ignore: shouldIgnore,
            totals: [...project.totals].filter(filterFn)
        }

        const lineValues = Array(weekLength).fill(0)
        const adjustmentValues = Array(weekLength).fill(0)
        proj.totals.slice(0, -1).forEach((value, i) => {
            let item = value

            const adjustmentKey = `${proj.uuid}-${i}`
            if (adjustments.has(adjustmentKey)) {
                const adj = adjustments.get(adjustmentKey) || 0
                adjustmentValues[i] = adj
                item += adj
                if (!shouldIgnore) {
                    dailyTotalAdjustments[i] += ROUNDED_ADJUSTMENTS ? roundFn(adj) : adj
                }
            }
            if (item < 0) {
                item = 0
            }
            lineValues[i] = roundFn(item)
            if (!shouldIgnore) {
                dailyTotals[i] += roundFn(item)
            }
        })

        // Sum of values for line
        lineValues.push(lineValues.reduce((acc, curr) => acc + curr, 0))
        // Sum of adjustments for line
        adjustmentValues.push(adjustmentValues.reduce((acc, curr) => acc + curr, 0))

        proj.totals = lineValues
        proj.adjustments = adjustmentValues
        newProjects.push(proj)
    })
    // Daily Grandtotal
    dailyTotals.push(dailyTotals.reduce((acc, curr) => acc + curr, 0))
    // Adjustments Grandtotal
    dailyTotalAdjustments.push(dailyTotalAdjustments.reduce((acc, curr) => acc + curr, 0))
    return {
        projects: sortFn(newProjects),
        headers: project.headers.filter(filterFn),
        totals: dailyTotals.filter(filterFn),
        totalAdjustments: dailyTotalAdjustments.filter(filterFn),
    }
}