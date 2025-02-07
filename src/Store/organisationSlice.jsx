import { createSlice } from "@reduxjs/toolkit";

const organisationdataSlice = createSlice({
    name: "organisationdata",
    initialState: {
        organisationDetail: null,
    },
    reducers: {
        setOrganisation: (state, action) => {
            state.organisationDetail = action.payload;
        }
    }


})

export const { setOrganisation } = organisationdataSlice.actions;
export default organisationdataSlice.reducer