
require('dotenv').config()
const axios = require("axios")
const moment = require("moment")
require("moment-duration-format");
const API_TOKEN = process.env.API_TOKEN || null
const WORKSPACE_ID = process.env.WORKSPACE_ID || null

if (!API_TOKEN || !WORKSPACE_ID) {
    console.log("Empty token or workspace ID")
    process.exit(1)
}

const dateFrom = "2021-12-11"
const dateTo = "2021-12-17"

const url = `https://api.track.toggl.com/reports/api/v2/weekly?workspace_id=${WORKSPACE_ID}&since=${dateFrom}&until=${dateTo}&user_agent=api_test`

const formatDuration = (msec) => msec ? (moment.duration(msec, 'milliseconds')).format("hh:mm:ss") : msec

axios.get(url, {
    auth: {
        username: API_TOKEN,
        password: "api_token",
    }
}).then((res) => {
    const data = res.data.data.map((project) => {
        return {
            client: project.title.client,
            project: project.title.project,
            hexColor: project.title.hex_color,
            totals: project.totals.map(formatDuration)
        }
    })
    const weekTotals = res.data.week_totals.map(formatDuration)
    console.log("Show Data", data, weekTotals)
}
).catch((err) => {
    console.error("Failed to load data", err)
})
