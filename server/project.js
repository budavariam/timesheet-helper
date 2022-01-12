
require('dotenv').config()
const axios = require("axios")
const moment = require("moment")
const { v4: uuidv4 } = require('uuid')
const API_TOKEN = process.env.API_TOKEN || null
const WORKSPACE_ID = process.env.WORKSPACE_ID || null

if (!API_TOKEN || !WORKSPACE_ID) {
    console.log("Empty token or workspace ID")
    process.exit(1)
}

const enumerateDaysBetweenDates = function (startDate, endDate) {
    const now = startDate.clone()
    const dates = []
    let i = 0

    while (i < 7 && now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(1, 'days')
        i++
    }
    dates.push("Totals")
    console.log(dates)
    return dates
};


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
                totals: project.totals,
            }
        }).sort((a, b) => a.client.localeCompare(b.client))
        const weekTotals = res.data.week_totals
        return {
            data,
            headers: enumerateDaysBetweenDates(moment(dateFrom), moment(dateTo)),
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