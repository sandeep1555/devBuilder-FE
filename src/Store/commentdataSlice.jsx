import { createSlice } from "@reduxjs/toolkit";

const commentdataSlice = createSlice({
    name: "commentdata",
    initialState: {
        commentList: null,
        nextLink: null,
        previousLink: null,
        count: null
    },
    reducers: {
        setCommentList: (state, action) => {
            state.commentList = action.payload;
        },
        setCommentNextLink: (state, action) => {
            state.nextLink = action.payload;
        },
        setCommentPreviousLink: (state, action) => {
            state.previousLink = action.payload;
        },
        setCommentCount: (state, action) => {
            state.count = action.payload;
        },
    }
})

export const { setCommentList, setCommentNextLink, setCommentPreviousLink, setCommentCount } = commentdataSlice.actions
export default commentdataSlice.reducer