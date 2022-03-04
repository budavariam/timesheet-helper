import React from 'react';
import { ProjectData } from '../types';
import { formatAllDuration } from '../util/format';
import "./PlainTextData.css"

type PlainTextDataProps = {
    projectData: ProjectData
}

export function PlainTextData(props: PlainTextDataProps) {
    const projectData = props.projectData
    const csvHeader = [['Client', 'Project', ...projectData.headers.slice(0, -1)].join(",")]
    const csvBody = projectData.projects
        .filter(p => !p.ignore)
        .map((p) => {
            return [
                p.client,
                p.project,
                p.totals.slice(0, -1).map((val, i) => formatAllDuration(val + p.adjustments[i])),
            ].join(",")
        })

    return (<>
        <pre className='plaintext'>
            {csvHeader.concat(csvBody).join("\n")}
        </pre>
        <pre className='plaintext'>
            {JSON.stringify(projectData.projects, null, 2)}
        </pre>
    </>)
}
