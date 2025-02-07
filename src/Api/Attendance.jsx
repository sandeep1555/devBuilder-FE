import apiClient from "../Contexts/authInterceptor";

export const getContractorAttendance = async (projectId, contractorId, url) => {
    const response = await apiClient.get(url ? url : "contractor/" + contractorId + "/attendance/" + projectId);
    return response;
}


export const createContractorAttendance = async (projectId, contractorId, date, count) => {
    const response = await apiClient.post("contractor/" + contractorId + "/attendance/", {
        project: projectId,
        date: date,
        labour_count: count
    });
    return response;
}

export const updateContractorAttendance = async (projectId, contractorId, attendanceId, date, count) => {
    const response = await apiClient.put("contractor/" + contractorId + "/attendance/" + attendanceId + "/", {
        project: projectId,
        date: date,
        labour_count: count
    });
    return response;
}


export const deleteContractorAttendance = async (contractorId, attendanceId) => {
    const response = await apiClient.delete("contractor/" + contractorId + "/attendance/" + attendanceId + "/");
    return response;
}