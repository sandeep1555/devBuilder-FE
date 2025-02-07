import { createSlice } from "@reduxjs/toolkit";


const contractorDataSlice = createSlice({
    name: "contractorData",
    initialState: {
        contractorList: null,
        contractorNextLink: null,
        contractorPreviousLink: null,
        contractorCount: null,
    },
    reducers: {
        setContractorList: (state, action) => {
            state.contractorList = action.payload;
        },

        setContractorNextLink: (state, action) => {
            state.contractorNextLink = action.payload;
        },
        setContractorPreviousLink: (state, action) => {
            state.contractorPreviousLink = action.payload;
        },
        setContractorCount: (state, action) => {
            state.contractorCount = action.payload;
        },

    }



})

export const { setContractorList, setContractorNextLink, setContractorPreviousLink, setContractorCount } = contractorDataSlice.actions

export default contractorDataSlice.reducer