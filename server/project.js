
require('dotenv').config()
const axios = require("axios")
const moment = require("moment")
const { v4: uuidv4 } = require('uuid')
require("moment-duration-format");
const API_TOKEN = process.env.API_TOKEN || null
const WORKSPACE_ID = process.env.WORKSPACE_ID || null

if (!API_TOKEN || !WORKSPACE_ID) {
    console.log("Empty token or workspace ID")
    process.exit(1)
}
const formatDuration = (msec) => msec ? (moment.duration(msec, 'milliseconds')).format("hh:mm:ss") : msec

const getDataByProject = (dateFrom, dateTo) => {
    const url = `https://api.track.toggl.com/reports/api/v2/weekly?workspace_id=${WORKSPACE_ID}&since=${dateFrom}&until=${dateTo}&user_agent=api_test`
    return axios.get(url, {
        auth: {
            username: API_TOKEN,
            password: "api_token",
        }
    }).then((res) => {
        const data = res.data.data.map((project) => {
            return {
                uuid: uuidv4(),
                client: project.title.client || "-",
                project: project.title.project || "-",
                hexColor: project.title.hex_color || "#000000",
                totals: (project.totals || []).map(formatDuration)
            }
        }).sort((a, b) => a.client.localeCompare(b.client))
        const weekTotals = (res.data.week_totals || []).map(formatDuration)
        console.log("Show Data", data, weekTotals)
        return {
            data,
            weekTotals,
        }
    }
    ).catch((err) => {
        console.error("Failed to load data", err)
    })
}

module.exports = {
    getDataByProject
}