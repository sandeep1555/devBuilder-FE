import apiClient from "../Contexts/authInterceptor";


export const getContractorList = async (projectId, url) => {
    const response = await apiClient.get(url ? url : "contractor/" + projectId);
    return response;
}




export const deleteContractor = async (contractorId) => {
    const response = await apiClient.delete("/contractor/" + contractorId + "/");
    return response;
}

export const createContractor = async (contractorName, projectId) => {

    const response = await apiClient.post("/contractor/" + projectId + "/", {
        name: contractorName,

    });
    return response;
}


export const updateContractor = async (contractorId, contractorName) => {
    const response = await apiClient.put("/contractor/" + contractorId + "/", {
        name: contractorName,


    });
    return response;
}