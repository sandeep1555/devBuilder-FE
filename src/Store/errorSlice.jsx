import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name: "error",
    initialState: {
        errorList: null,
    },
    reducers: {

        setErrorList: (state, action) => {
            state.errorList = action.payload;
        },
        removeErrorList: (state) => {
            state.errorList = null;
        }
    }
})


export const { setErrorList ,removeErrorList} = errorSlice.actions;
export default errorSlice.reducer;