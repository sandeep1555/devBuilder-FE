
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/authContext";
import { useEffect } from "react";
import { getProjectList } from "../Api/Project";
import { useDispatch, useSelector } from "react-redux";
import { getOrgsanisationDetail } from '../Api/Organisation';
import { handleError } from "../Utility/Utility";
import { setOrganisation } from "../Store/organisationSlice";
import { addProjectList, setDefaultProject } from "../Store/projectdataSlice";
import { setUserDetails, setUserPermissions, setUserGroup } from "../Store/userSlice";
import { getUserDetailsApi } from "../Api/User";


const MainContainer = () => {

	const { isLoggedIn } = useAuth();
	const dispatch = useDispatch();
	const userDetails = useSelector((store) => store.user.userDetails);

	const organisation = useSelector((store) => store.organisationData.organisationDetail)


	const loadOrganisationDetail = async () => {
		try {
			const response = await getOrgsanisationDetail();
			dispatch(setOrganisation(response.data[0]));
		} catch (error) {
			handleError(error);
		}
	};

	const handleSetDefaultProject = (project) => {
		dispatch(setDefaultProject(project));
		localStorage.setItem('selectedProject', project.projectId);

	}

	const loadProjects = async () => {
		try {
			const response = await getProjectList(organisation.id);
			const projects = response.data?.data;
			dispatch(addProjectList(projects));
			const selectedProjectId = localStorage.getItem('selectedProject');
			const selectedProject = projects && (selectedProjectId ? projects.find(project => project.projectId == selectedProjectId) : projects[0]);
			handleSetDefaultProject(selectedProject);

		}
		catch (error) {
			handleError(error);
		}
	};


	const getUserDetails = async () => {
		const response = await getUserDetailsApi();
		const userDetails = response.data?.data;
		dispatch(setUserDetails(userDetails));
		dispatch(setUserGroup(userDetails.group));
		dispatch(setUserPermissions(userDetails.userPermission));
	}

	useEffect(() => {
		if (isLoggedIn()) {
			!organisation && loadOrganisationDetail();
			!userDetails && getUserDetails();
		}
	}, [isLoggedIn()]);

	useEffect(() => {
		organisation && loadProjects()

	}, [organisation])


	return (
		<div className="flex flex-col h-screen   w-full overflow-hidden overflow-y-auto ">
			{isLoggedIn ?
				(
					<div>
						<Outlet />
					</div>
				) : (
					<Navigate to={"/"} />
				)}

		</div>
	)
}

export default MainContainer