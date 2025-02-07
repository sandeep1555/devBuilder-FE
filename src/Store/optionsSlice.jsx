import { createSlice } from "@reduxjs/toolkit";

const optionsSlice = createSlice({
    name: "options",
    initialState: {

        unitOptions: null,
        categoryList: null,
        assigneeList: null,
        reporterList: null,
        tagList: null,
        category: null,
        tag: null,
        assignee: null,
        reporter: null,

    },
    reducers: {

        setUnitOptions: (state, action) => {
            state.unitOptions = action.payload;
        },
        setCategoryList: (state, action) => {
            state.categoryList = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setTagList: (state, action) => {
            state.tagList = action.payload;
        },
        setTag: (state, action) => {
            state.tag = action.payload;
        },
        setAssigneeList: (state, action) => {
            state.assigneeList = action.payload;
        },
        setAssignee: (state, action) => {
            state.assignee = action.payload;
        },

        setReporterList: (state, action) => {
            state.reporterList = action.payload;
        },
        setReporter: (state, action) => {
            state.reporter = action.payload;
        },


    }

})


export const { setUnitOptions, setCategoryList, setAssigneeList, setReporterList, setCategory, setAssignee, setReporter, setTag, setTagList } = optionsSlice.actions;
export default optionsSlice.reducer