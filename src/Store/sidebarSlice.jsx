import { createSlice } from "@reduxjs/toolkit"


const sidebarSlice = createSlice({
    name: "sidebar",
    initialState: {
        sideBar: false,
    },
    reducers: {

        setSideBar: (state, action) => {
            state.sideBar = action.payload;
        }
    }
})

export const { setSideBar } = sidebarSlice.actions;

export default sidebarSlice.reducer