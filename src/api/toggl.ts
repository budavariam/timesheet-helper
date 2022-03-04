import moment from "moment"
import React, { useEffect } from "react"
import useFetch, { Res } from "use-http"
import { DISPATCH_ACTION } from "../util/const"
import { ProjectResponse } from "../types"
import mockData from "./data.json";

const DEV_DATA = process.env.REACT_APP_DEV_DATA ?? false // during development I don't want to spam the API

async function loadProjects(get: Function, response: Res<ProjectResponse>, dispatch: React.Dispatch<any>, workspaceId: string, dateFrom: string) {
    const dateTo = moment(dateFrom).add(7, 'days').format("YYYY-MM-DD")
    const projects = await get(`/weekly?workspace_id=${workspaceId}&since=${dateFrom}&until=${dateTo}&user_agent=api_test`)
    if (response.ok) {
        dispatch({ type: DISPATCH_ACTION.PROJECT_LOADED, value: projects })
    } else {
        console.error("Failed to load projects:", response.body)
    }
}

export const useProjectFetch = (dateFrom: string, apiToken: string, workspaceId: string, dispatch: React.Dispatch<any>): [loading: boolean, error: Error | undefined, project: ProjectResponse] => {
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
                Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
            },
        }, [dateFrom, workspaceId, apiToken])

    useEffect(() => {
        if (!DEV_DATA || !workspaceId || !apiToken) {
            dispatch({ type: DISPATCH_ACTION.PROJECT_LOADED, value: mockData })
        } else {
            loadProjects(get, response, dispatch, workspaceId, dateFrom)
        }
    }, [get, response, dispatch, workspaceId, apiToken, dateFrom])
    return [loading, error, project]
}