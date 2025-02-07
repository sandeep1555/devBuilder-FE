import { configureStore } from "@reduxjs/toolkit"
import taskDataSlice from "./taskdataSlice"
import userSlice from "./userSlice"
import projectdataSlice from "./projectdataSlice"
import optionsSlice from "./optionsSlice"
import errorSlice from "./errorSlice"
import organisationSlice from "./organisationSlice"
import sidebarSlice from "./sidebarSlice"
import commentdataSlice from "./commentdataSlice"
import contractorSlice from "./contractorSlice"
import attendanceSlice from "./attendanceSlice"


const appStore = configureStore({
    reducer:
    {
        taskData: taskDataSlice,
        options: optionsSlice,
        user: userSlice,
        projectData: projectdataSlice,
        organisationData: organisationSlice,
        error: errorSlice,
        sideBar: sidebarSlice,
        commentData: commentdataSlice,
        contractorData: contractorSlice,
        attendanceData: attendanceSlice
    }
})


export default appStore