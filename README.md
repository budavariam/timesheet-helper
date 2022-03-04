# Timesheet Helper

[DEMO](https://budavariam.github.io/timesheet-helper/)

I've started to use [Toggl Track](https://track.toggl.com) last year to keep track of my time.
I wanted to know how much time do I spend on different projects and activities.

It also helps me see where am I on the work-life balance scale in any given week.

I have to fill my timesheets for work, I thought it would be beneficial if I had a tool to help me with that.

Toggl Track reports were a good start, but I wanted more extensibility.
With this site I'm able to hide weekends, and show rounded data.
The best part is that I'm able to spill the overwork between days while the adjustments are visible per project basis and visible in the totals as well.
Since I track my side projects and also my personal timeouts I need the possibility to hide certain projects from the report.

## Getting Started

```bash
npm install
npm start
```

If you don't want to spam the toggl api during  development, you can set an env variable e.g in `.env.local`

```conf
REACT_APP_DEV_DATA=true
```

For toggl integration: Set the WorkspaceID and APIKey from the website into the 2 input fields in the app.

## Ideas for development

I know that the project structure is ugly, I aimed for an MVP and improving the code bit by bit ever since.

Things that I think could improve the quality are kept in the [TODO](./TODO.md) doc.
