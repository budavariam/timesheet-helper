import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Project } from '../types';

export function ProjectGrid(props: any) {
  const projects: Project[] = props.projects;
  const totals: string[] = props.totals;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {totals.map((num) => <TableCell align="right">{num}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project: Project) => (
            <TableRow
              key={project.uuid}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <span style={{ color: project.hexColor }}>{project.client} {project.project}</span>
              </TableCell>
              {project.totals.map((num) => <TableCell align="right">{num}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}