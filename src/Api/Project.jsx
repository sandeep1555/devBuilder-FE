import apiClient from "../Contexts/authInterceptor";


export const getProjectList = async (organisationId) => {
    const response = await apiClient.get("project/list/" + organisationId, { withCredentials: true });
    return response;
}

export const getProjectAssigneeList = async (project, assigneeText) => {
    const response = await apiClient.get("project/" + project + "/user/list/?search=" + assigneeText);
    return response;
}

export const createPorject = async (projectName, organisationId) => {
    const response = await apiClient.post("project/create/" + organisationId, { name: projectName });
    return response
}
export const updateProject = async (projectName, projectId) => {
    const response = await apiClient.put("/project/update/" + projectId, { name: projectName });
    return response;
}

export const deleteProject = async (projectId) => {
    const response = await apiClient.delete("/project/delete/" + projectId);
    return response;
}