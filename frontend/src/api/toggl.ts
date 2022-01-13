import moment from "moment"
import useFetch from "use-http"
import { v4 as uuidv4 } from "uuid"
import { Project, ProjectResponse } from "../types"
import { enumerateDaysBetweenDates } from "../util/generateDate"

export const useProjectFetch = (dateFrom: string, apiToken: string, workspaceId: string): [loading: boolean, error: Error | undefined, project: ProjectResponse] => {
    const dateTo = moment(dateFrom).add(7, 'days').format("YYYY-MM-DD")
    const {
        loading,
        error,
        data: project = { data: [], headers: [], weekTotals: [] }
    } = useFetch<ProjectResponse>(
        `https://api.track.toggl.com/reports/api/v2/weekly?workspace_id=${workspaceId}&since=${dateFrom}&until=${dateTo}&user_agent=api_test`,
        {
            headers: {
                Accept: 'application/json',
                Authorization: 'Basic ' + btoa(apiToken + ":" + "api_token")
            },
            interceptors: {
                response: async ({ response }) => {
                    const data: Project[] = response.data.data.map((project: any): Project => {
                        return {
                            uuid: uuidv4(),
                            client: project.title.client || "-",
                            project: project.title.project || "-",
                            hexColor: project.title.hex_color || "#000000",
                            totals: project.totals,
                        }
                    }
                    ).sort((a: Project, b: Project) => a.client.localeCompare(b.client))
                    const weekTotals = (response.data.week_totals || [])
                    response.data = {
                        data,
                        headers: enumerateDaysBetweenDates(moment(dateFrom), moment(dateTo)),
                        weekTotals,
                    }

                    return response
                }
            }
        }, [dateFrom, dateTo, workspaceId, apiToken])
    return [loading, error, project]
}