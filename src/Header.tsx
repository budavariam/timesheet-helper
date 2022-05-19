import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Card, Grid, TextField } from '@mui/material';
import { DISPATCH_ACTION } from './util/const';
import React from 'react';

type HeaderProps = {
    state: any,
    dispatch: React.Dispatch<any>,
    dateSelection: string[],
    localStorageKey: string,
    setKey: React.Dispatch<any>,
    localStorageWid: string,
    setWid: React.Dispatch<any>,
    localStorageWebsite: string,
    setWebsite: React.Dispatch<any>,
    children?: React.ReactChild,
}

export const Header = (props: HeaderProps) => {
    const {
        state, dispatch, dateSelection, 
        localStorageKey, setKey, 
        localStorageWid, setWid,
        localStorageWebsite, setWebsite,
    } = props
    return (
        <Card elevation={1} style={{ marginBottom: 15, marginTop: 15, padding: "0 15px" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <FormControl size="small" fullWidth margin="dense">
                        <InputLabel id="demo-simple-select-label">Start</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state.start}
                            label="Start"
                            onChange={(e) => { dispatch({ type: DISPATCH_ACTION.START_CHANGED, value: e.target.value }) }}
                        >
                            {dateSelection.map((val) => <MenuItem key={val} value={val}>{val}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl size="small" fullWidth margin="dense">
                        <InputLabel id="week-length-label">Week length</InputLabel>
                        <Select
                            labelId="week-length-label"
                            id="week-length"
                            value={state.weekLength}
                            label="Week Length"
                            onChange={(e) => { dispatch({ type: DISPATCH_ACTION.WEEK_LENGTH_CHANGED, value: parseInt(`${e.target.value}`, 10) }) }}
                        >
                            <MenuItem value={7}>Whole Week</MenuItem>
                            <MenuItem value={5}>Workdays</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl size="small" fullWidth margin="dense">
                        <InputLabel id="rounding-lable">Round</InputLabel>
                        <Select
                            labelId="rounding-label"
                            id="rounding"
                            value={state.rounding}
                            label="Rounding"
                            onChange={(e) => { dispatch({ type: DISPATCH_ACTION.ROUNDING_CHANGED, value: parseInt(`${e.target.value}`, 10) }) }}
                        >
                            <MenuItem value={0}>No Rounding</MenuItem>
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>Hour</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            id="apikey"
                            value={localStorageKey}
                            label="API Key"
                            variant="standard"
                            type="password"
                            onChange={(e) => {
                                setKey(e.target.value)
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            id="workspaceid"
                            value={localStorageWid}
                            label="Workspace ID"
                            variant="standard"
                            type="password"
                            onChange={(e) => {
                                setWid(e.target.value)
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            id="website"
                            value={localStorageWebsite}
                            label="Website"
                            variant="standard"
                            type="text"
                            onChange={(e) => {
                                setWebsite(e.target.value)
                            }}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Card>
        )
}