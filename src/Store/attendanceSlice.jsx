import { createSlice } from "@reduxjs/toolkit";


const attendanceDataSlice = createSlice({
    name: "attendanceData",
    initialState: {
        contractorAttendanceList: null,
        attendanceNextLink: null,
        attendancePreviousLink: null,
        attendanceCount: null,

    },
    reducers: {

        setContractorAttendanceList: (state, action) => {
            state.contractorAttendanceList = action.payload;
        },
        setAttendanceNextLink: (state, action) => {
            state.attendanceNextLink = action.payload;
        },
        setAttendancePreviousLink: (state, action) => {
            state.attendancePreviousLink = action.payload;
        },
        setAttendanceCount: (state, action) => {
            state.attendanceCount = action.payload;
        },

    }



})

export const { setContractorAttendanceList, setAttendanceNextLink, setAttendancePreviousLink, setAttendanceCount } = attendanceDataSlice.actions

export default attendanceDataSlice.reducer