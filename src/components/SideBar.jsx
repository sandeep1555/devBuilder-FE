import { Sidebar } from 'flowbite-react'
import { HiOutlineViewGrid, HiHome, HiOutlineClipboardList, HiCog, HiChevronRight, HiChevronLeft, HiBriefcase } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultProject } from '../Store/projectdataSlice';
import { setSideBar } from '../Store/sidebarSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const SideBar = () => {


    const isSideBar = useSelector(store => store.sideBar.sideBar);
    const projectList = useSelector((store) => store.projectData.projectList);
    const userPermissions = useSelector((store) => store.user.permissions);
    const dispatch = useDispatch();
    const location = useLocation(); // Get current route
    const navigate=useNavigate();


    const handleSetDefaultProject = (project) => {
        dispatch(setDefaultProject(project));
    }

    const isDisabled = location.pathname === '/project';

    return (
        <div className='relative  md:border-r-2  border-gray-200 dark:border-gray-500 min-h-screen' >
            <span className='flex items-center justify-center ' onClick={() => { isSideBar ? dispatch(setSideBar(false)) : dispatch(setSideBar(true)) }}>{isSideBar ? <HiChevronLeft className='absolute mt-6 md:mt-0 z-20 md:w-[20px] md:h-[20px] w-[30px] h-[30px] md:right-[-11px] right-[-15px] md:top-[30px] top-[10px]  rounded-full hover:bg-customSky hover:text-white bg-white shadow-md  cursor-pointer dark:bg-gray-600 dark:hover:bg-customSky dark:text-white' /> : <HiChevronRight className='absolute z-20 mt-6 md:mt-0 md:w-[20px] md:h-[20px] w-[30px] h-[30px] md:right-[-11px] right-[-30px] md:top-[30px] top-[10px]  rounded-full hover:bg-customSky hover:text-white bg-white shadow-md cursor-pointer dark:bg-gray-600 dark:hover:bg-customSky dark:text-white ' />}</span>
            <Sidebar className={`${isSideBar ? "w-64" : "md:w-6 w-0"} rounded-lg duration-200  md:h-full overflow-y-hidden shadow-lg  bg-white   relative  h-full z-10 `}   >

                {isSideBar && <Sidebar.Items>


                    <Sidebar.ItemGroup>


                        <Sidebar.Item className="" onClick={()=>{navigate("/project");dispatch(setSideBar(false))}} icon={HiHome}>
                            Home
                        </Sidebar.Item>

                        {!isDisabled && <Sidebar.Collapse className='md:hidden' icon={HiOutlineClipboardList} label="Project">

                            {projectList && projectList.map(project =>
                            (

                                <Sidebar.Item key={project.projectId} className="w-[200px] mx-1 md:hidden" onClick={() => { handleSetDefaultProject(project); dispatch(setSideBar(false)) }} >{project.name}</Sidebar.Item>

                            ))}

                        </Sidebar.Collapse>}



                        {!isDisabled && <Sidebar.Item onClick={()=>{navigate("/project/task");dispatch(setSideBar(false))}} icon={HiOutlineViewGrid}>
                            Tasks
                        </Sidebar.Item>}

                        {(!isDisabled && userPermissions) && userPermissions.includes("view_contractor") && <Sidebar.Item  onClick={()=>{navigate("/project/contractor");dispatch(setSideBar(false))}} icon={HiBriefcase}>
                            Contractor Attendance
                        </Sidebar.Item>}

                        {!isDisabled && <Sidebar.Item href="#" icon={HiCog}>
                            Settings
                        </Sidebar.Item >}
                    </Sidebar.ItemGroup>
                </Sidebar.Items>}
            </Sidebar>

        </div>
    )
}

export default SideBar