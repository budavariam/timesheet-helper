import React from 'react';
import { ProjectData } from '../types';
import { formatAllDuration } from '../util/format';
import "./PlainTextData.css"

export function PlainTextData(props: any) {
    const projectData: ProjectData = props.projectData
    console.log(projectData)
    return (<>
    <pre className='plaintext'>
        {JSON.stringify(projectData.projects
            .filter(p => !p.ignore)
            .map((p)=> {
                return [
                    p.client, 
                    p.project, 
                    p.totals.slice(0, -1).map((val, i) => formatAllDuration(val + p.adjustments[i])),
                ].join(",")
        }), null, 2)}
    </pre>
    <pre className='plaintext'>
        {JSON.stringify(projectData.projects, null, 2)}
    </pre>
    </>
    )
}
