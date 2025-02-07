import { createSlice } from "@reduxjs/toolkit";

const taskdataSlice = createSlice({
    name: "taskdata",
    initialState: {
        taskList: null,
        taskListLength: null,
        nextLink: null,
        previousLink: null,
        count: null,
        selectedTask: null,
        aggregateList: null,
        taskCount:null
    },

    reducers: {
        setTaskList: (state, action) => {
            state.taskList = action.payload;
        },
        setNextLink: (state, action) => {
            state.nextLink = action.payload;
        },
        setPreviousLink: (state, action) => {
            state.previousLink = action.payload;
        },
        setCount: (state, action) => {
            state.count = action.payload;
        },
        addTaskList: (state, action) => {
            state.taskList.push(action.payload);
        },
        setTaskCount:(state,action)=>
        {
            state.takCount=action.payload;
        },
        updateTaskList: (state, action) => {
            const { id, name, assignee, start_date, end_date, description, progress, units, category } = action.payload;
            const task = state.taskList.find((task) => task.id === id);
            if (task) {
                task.name = name;
                task.assignee = assignee;
                task.start_date = start_date;
                task.end_date = end_date;
                task.description = description;
                task.progress = progress;
                task.units = units;
                task.category = category;
            }
        },
        getTaskListLength: (state, action) => {
            state.taskListLength = action.payload;
        },

        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        },
        setAggregateList: (state, action) => {
            state.aggregateList = action.payload;
        }
    }

})


export const { setTaskList, addtaskList, updateTaskList, setNextLink, setPreviousLink, getTaskListLength, setCount, setSelectedTask, setAggregateList ,setTaskCount} = taskdataSlice.actions;

export default taskdataSlice.reducer