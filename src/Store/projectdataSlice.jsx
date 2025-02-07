import { createSlice } from "@reduxjs/toolkit";

const projectdataSlice = createSlice({
    name: "projectdata",
    initialState: {
        projectList: null,
        defaultProject: null,
        selectedProject:null
    },
    reducers: {

        addProjectList: (state, action) => {
            state.projectList = action.payload;
        },
        setDefaultProject: (state, action) => {
            state.defaultProject = action.payload;
        },
        getSelectedProject:(state,action)=>
        {
            state.selectedProject=action.payload;
        },
        removeSelectedProject:(state)=>
        {
            state.selectedProject=null
        }
    }


})

export const { addProjectList, setDefaultProject,getSelectedProject,removeSelectedProject } = projectdataSlice.actions;
export default projectdataSlice.reducer