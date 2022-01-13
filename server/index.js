const express = require("express")
const { getDataByProject } = require("./project")
const app = express()
const port = 8080

app.get("/project", (req, res) => {
    console.log("project", req.query)
    const { from: dateFrom } = req.query
    getDataByProject(dateFrom)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send(err)
        })
})
app.get("/ping", (req, res) => {
    res.send("PONG")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})