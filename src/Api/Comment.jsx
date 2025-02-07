import apiClient from "../Contexts/authInterceptor";

export const createCommentApi = async (taskId, commentText) => {
    const response = await apiClient.post("task/" + taskId + "/remarks/", {
        description: commentText
    });
    return response
}

export const getCommentListApi = async (taskId, url = null) => {
    if (url === null) {
        url = "task/" + taskId + "/remarks/"

    }
    const response = await apiClient.get(url)
    return response;
}

export const deleteCommentApi = async (taskId, commentId) => {
    const response = await apiClient.delete("task/" + taskId + "/remarks/" + commentId + "/");
    return response;
}


export const updateCommentApi = async (taskId, commentId, commentText) => {
    const response = await apiClient.put("task/" + taskId + "/remarks/" + commentId + "/", {
        description: commentText
    })
    return response;
}
