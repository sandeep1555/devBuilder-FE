import { createSlice } from "@reduxjs/toolkit";


const useSlice = createSlice({
    name: "user",
    initialState: {
        userDetails: null,
        group: null,
        permissions: null
    },
    reducers:
    {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
        setUserGroup: (state, action) => {
            state.group = action.payload;
        },
        setUserPermissions: (state, action) => {
            state.permissions = action.payload;
        }
    }
})


export const { setUserDetails, setUserPermissions, setUserGroup } = useSlice.actions;
export default useSlice.reducer