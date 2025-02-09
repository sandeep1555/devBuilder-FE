import { useAuth } from "../Contexts/authContext";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Button, Dropdown, Navbar } from "flowbite-react";
import { setDefaultProject } from "../Store/projectdataSlice";
import { HiOutlineMoon, HiOutlineSun, HiOutlineUserCircle, HiLogout } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi";
import { useTheme } from "../Contexts/themeContext";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { CgOrganisation } from "react-icons/cg";

const Header = () => {
	const { logOut, isLoggedIn } = useAuth();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const projectList = useSelector((store) => store.projectData.projectList);
	const organisation = useSelector((store) => store.organisationData.organisationDetail);
	const { theme, toggleTheme } = useTheme();
	const userDetails = useSelector((store) => store.user.userDetails);

	const handleSetDefaultProject = (project) => {
		localStorage.setItem('selectedProject', project.projectId);
		dispatch(setDefaultProject(project));
		navigate("/project/task")
		// window.location.reload();
	}

	useEffect(() => {
		document.title = organisation ? organisation.name : "devBuilder";
	}, [organisation]);

	return (
		<Navbar className=" sticky top-0 z-30 shadow-md   py-1 sm:px-4   px-4 min-h-[70px]  dark:border-b dark:border-gray-500  " fluid rounded >
			<Navbar.Brand>
				<div className="flex items-center justify-center  ">

					{isLoggedIn() ? <img src={organisation ? organisation.logo : "assets/devduilder-light.PNG"} className="max-h-[62px] 2xl:max-h-16  w-[130px] dark:opacity-40 dark:h-[60px] dark:my-1 rounded-sm " alt="logo" />
						: <img src={theme == "light" ? "assets/devduilder-light.PNG" : "assets/devbuilder-dark.PNG"} className="max-h-[70px] 2xl:max-h-16  w-[130px]" alt="logo" />}


				</div>
			</Navbar.Brand>


			{isLoggedIn() ?
				<>
					<div className="flex md:order-2">

						<Button className="dark:text-gray-400 md:block hidden" onClick={() => navigate("/project")} color="white">Home</Button>

						<Dropdown inline arrowIcon={false} className="shadow-md  dark:text-gray-100 md:block hidden py-0" label={<span className="dark:text-gray-400 transition-all duration-500 text-sm font-medium  py-2 px-4 md:flex justify-between items-center hidden">Project<HiChevronDown className="w-[20px] h-[20px] ml-1" /></span>}>

							{projectList && projectList.map((project, index) =>
							(
								<div key={project.projectId}>

									<Dropdown.Item className="w-[250px]  flex justify-center  rounded-sm  py-3 " onClick={() => handleSetDefaultProject(project)}>{project.name}</Dropdown.Item>
									{projectList.length - 1 !== index && <Dropdown.Divider className="my-0 h-[2px]" />}
								</div>

							))}

						</Dropdown>
						<Dropdown
							arrowIcon={false}
							inline
							label={
								<HiOutlineUserCircle className="md:w-[30px] md:h-[30px] w-[40px] h-[40px] ml-4 text-customSky dark:text-gray-400  duration-400" />
							}
						>
							<Dropdown.Header className="min-w-[180px] cursor-default" >
								<span className="block text-sm">Hey, <span className="text-customSky dark:text-gray-400 ">{userDetails && userDetails.firstName}</span></span>
							</Dropdown.Header>

							<Dropdown.Item icon={CgOrganisation} onClick={() => navigate("/organisation")}>{organisation && organisation.name}</Dropdown.Item>
							<Dropdown.Item icon={FaUser} onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
							<Dropdown.Item icon={theme === 'dark' ? HiOutlineSun : HiOutlineMoon} onClick={toggleTheme}>{theme === 'dark' ? "Light Mode" : "Dark Mode"}</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item icon={HiLogout} onClick={() => logOut()}>Sign out</Dropdown.Item>
						</Dropdown>
					</div>



					<Navbar.Collapse className="">






					</Navbar.Collapse>

				</> :
				<button className="mt-1" onClick={toggleTheme}>{theme === 'dark' ? <HiOutlineSun className="w-8 h-8 text-white " /> : <HiOutlineMoon className="w-8 h-8 " />}</button>
			}


		</Navbar>

	);
};

export default Header;




