import { Project, ProjectData, ProjectHeader, ProjectResponse } from "../types";
import { enumerateDaysBetweenDates, roundToNearestNMinutes } from "./generateDate"
import { v4 as uuidv4 } from "uuid"
import { Duration } from "../project/Duration"
import moment from 'moment';
import { ROUNDED_ADJUSTMENTS } from "./const";

export const generateHeaderColumns = (dates: string[]): ProjectHeader[] => {
    const headers = [
        {
            Header: "",
            accessor: "actions",
            width: 70,
        },
        {
            Header: "Name",
            accessor: "name",
            width: 150,
        },
        ...dates.map((date: string, i: number) => {
            return {
                Header: date,
                accessor: (line: any, a: any, b: any, c: any) => {
                    console.log("XX", line, a, b, c)
                    return [line.totals[i], line.adjustments[i]]
                },
                Cell: (cell: any) => {
                    console.log("CELL", cell)
                    const project = cell.row.original
                    const dispatch = cell.dispatch
                    return (
                        <>
                            <Duration
                                num={0}
                                projectID={project.uuid}
                                columnIndex={i}
                                // value={cell.value[0]}
                                dispatch={dispatch}
                                adjustable={i !== project.totals.length - 1}
                                adjusted={project.adjustments[i] || 0}
                                showEmpty={i === project.totals.length - 1}
                            />
                            {
                                (i === project.totals.length - 1) &&
                                <span className="ignored">
                                    &nbsp; (<Duration
                                        projectID=""
                                        columnIndex={0}
                                        num={0}
                                        adjusted={0}
                                        // value={project.adjustments[i]}
                                        dispatch={dispatch}
                                        adjustable={false}
                                        showEmpty={true}
                                        hideInfo={true}
                                    />)
                                </span>
                            }
                        </>)
                },
                Footer: () => { return 13 }
            }
        },
            {
                Header: "Totals",
                accessor: "totals"
            })
    ]
    return headers
}

export function processProjectData(response: ProjectResponse, dateFrom: string, dateTo: string): ProjectData {
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
    const totalAdjustments = [] as number[]
    const headers = enumerateDaysBetweenDates(moment(dateFrom), moment(dateTo))

    return {
        projects,
        headers,
        totals,
        totalAdjustments,
    }
}

const filterByWeekLength = (weekLength: number) => (e: any, i: number) => {
    return !(weekLength === 5 && (i === 5 || i === 6))
}

export function manipulateData(project: ProjectData, weekLength: number, rounding: number, adjustments: any, ignoreProjects: any, projectOrder: string[] = []): ProjectData {
    const filterFn = filterByWeekLength(weekLength)
    const roundFn = roundToNearestNMinutes(rounding)
    const sortFn = projectOrder.length
        ? (list: Project[]) => list.sort((a, b) => projectOrder.indexOf(a.uuid) - projectOrder.indexOf(b.uuid))
        : (list: Project[]) => list
    const newProjects = [] as Project[]
    const dailyTotals = Array(7).fill(0)
    const dailyTotalAdjustments = Array(7).fill(0)

    project.projects.forEach((project) => {
        const shouldIgnore = project.uuid in ignoreProjects
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
            if (adjustmentKey in adjustments) {
                const adj = adjustments[adjustmentKey]
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