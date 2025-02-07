import apiClient from "../Contexts/authInterceptor";


export const getTaskListApi = async (projectId, url = null, filters) => {

	console.log("Sandeep", projectId)
	if (url === null) {
		url = "task/" + projectId + "/list/?"
		const params = new URLSearchParams();

		for (const [key, value] of Object.entries(filters)) {
			value != null && params.append(key, value);
		}

		url = url + `${params.toString()}`;
	}
	const response = await apiClient.get(url, { withCredentials: true });
	return response;
}


export const createTaskListApi = async (taskName, description, unitsValue, maxProgress, category, tag, project, startDate, endDate) => {                      //assignee,reporter
	const response = await apiClient.post("task/create/", {
		is_active: true,
		name: taskName,
		description: description,
		unit: unitsValue,
		max_progress: maxProgress,
		category: category,
		tag: tag,
		// assignee: assignee,
		// reporter: reporter,
		project: project,
		start_date: startDate,
		end_date: endDate,
	});

	return response;
}

export const updateTaskListApi = async (taskId, taskName, description, unitsValue, maxProgress, progress, category, tag, project, startDate, endDate) => {
	console.log(taskId)         //assignee,reporter
	const response = await apiClient.put("task/update/" + taskId + "/", {
		name: taskName,
		description: description,
		unit: unitsValue,
		max_progress: maxProgress,
		progress: progress,
		category: category,
		tag: tag,
		// assignee: assignee,
		// reporter: reporter,
		project: project,
		start_date: startDate,
		end_date: endDate,
	});
	return response;
}

export const deleteTaskApi = async (id) => {
	const response = await apiClient.delete("task/delete/" + id);
	return response;
}


export const getUnitOptionsApi = async () => {
	const response = await apiClient.get("task/unit", {}, { withCredentials: true });
	return response;
}


export const getCategoryListApi = async (categoryText) => {
	const response = await apiClient.get("/category/list/?search=" + categoryText);
	return response;
}


export const createCategorytApi = async (categoryName) => {
	const response = await apiClient.post("/category/create/", {
		is_active: true,
		name: categoryName,
		description: categoryName
	});
	return response;
}

export const createTagApi = async (tagName) => {
	const response = await apiClient.post("/tag/create/", {
		is_active: true,
		name: tagName
	});
	return response;
}

export const getTagListApi = async (tagName) => {
	const tagNameText = tagName ? tagName : ""
	const response = await apiClient.get("/tag/list?search=" + tagNameText);
	return response;
}

export const updateProgressApi = async (taskId, progress) => {
	const response = await apiClient.patch("task/update/" + taskId + "/", {
		progress: progress
	});
	return response
}

export const getaggregateListApi = async (projectId, url = null, filters) => {
	// If url is not provided, construct the default URL
	if (url === null) {
		url = "task/" + projectId + "/aggregate/list/?";
		const params = new URLSearchParams();

		// Check if filters is defined and is an object before iterating
		if (filters && typeof filters === "object") {
			for (const [key, value] of Object.entries(filters)) {
				if (value != null) {
					params.append(key, value);
				}
			}
		}

		// Append the query parameters to the URL
		url = url + `${params.toString()}`;
	}

	// Make the API request
	const response = await apiClient.get(url, { withCredentials: true });
	return response;
};
export const updatetaskListOrder = async (updatedTaskList) => {
	const response = await apiClient.post("/tasks/order", { tasks: updatedTaskList });
	return response
}
