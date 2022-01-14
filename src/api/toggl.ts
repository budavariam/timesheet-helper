import moment from "moment"
import { useEffect } from "react"
import useFetch from "use-http"
import { DISPATCH_ACTION } from "../util/const"
import { ProjectResponse } from "../types"

export const useProjectFetch = (dateFrom: string, apiToken: string, workspaceId: string, dispatch: Function): [loading: boolean, error: Error | undefined, project: ProjectResponse] => {
    const {
        loading,
        get,
        response,
        error,
        data: project = { data: [], headers: [], weekTotals: [] }
    } = useFetch<ProjectResponse>(
        `https://api.track.toggl.com/reports/api/v2`,
        {
            headers: {
                Accept: 'application/json',
                Authorization: 'Basic ' + btoa(apiToken + ":" + "api_token")
            },
        }, [dateFrom, workspaceId, apiToken])

    async function loadProjects(workspaceId: string, dateFrom: string) {
        const dateTo = moment(dateFrom).add(7, 'days').format("YYYY-MM-DD")
        const projects = await get(`/weekly?workspace_id=${workspaceId}&since=${dateFrom}&until=${dateTo}&user_agent=api_test`)
        if (response.ok) {
            dispatch({ type: DISPATCH_ACTION.PROJECT_LOADED, value: projects })
        } else {
            console.error("Failed to load projects:", response.body)
        }
    }

    useEffect(() => {
        loadProjects(workspaceId, dateFrom)
    }, [workspaceId, apiToken, dateFrom])
    return [loading, error, project]
}