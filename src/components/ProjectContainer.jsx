import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { colors, handleError } from '../Utility/Utility';
import { addProjectList, getSelectedProject, setDefaultProject } from '../Store/projectdataSlice';
import { createPorject, deleteProject, getProjectList, updateProject } from '../Api/Project';
import { useNavigate } from 'react-router-dom';
import { GoPlus } from "react-icons/go";
import { MdErrorOutline } from "react-icons/md";
import { Button, Dropdown, Modal } from "flowbite-react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { setTaskCount } from '../Store/taskdataSlice';
import ShimmerProjectCard from '../Shimmer/ShimmerProjectCard';


const ProjectContainer = () => {

    const projectList = useSelector((store) => store.projectData.projectList);
    const organisation = useSelector((store) => store.organisationData.organisationDetail)
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [hoveredProjectId, setHoveredProjectId] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");



    const [selectedColor, setSelectedColor] = useState(colors[0]); // Default color





    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSetDefaultProject = (project) => {
        dispatch(setDefaultProject(project));
        localStorage.setItem('selectedProject', project.projectId);

    }

    const loadProjects = async (organisationId) => {
        try {
            const response = await getProjectList(organisationId);
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


    const setproject = async () => {
        try {
            setLoading(true);
            const response = await createPorject(projectName, selectedColor, organisation.id);
            loadProjects(organisation.id);
            setOpenModal(false);
            setProjectName("");
        }
        catch (err) {
            setErrorMessage(err?.response?.data?.error)
            setTimeout(() => {
                setErrorMessage("");
            }, 5000)
        }
        finally {
            setLoading(false)
        }

    }

    const handleEditProject = async () => {
        try {
            const response = await updateProject(projectName, selectedProjectId, selectedColor);
            setOpenEditModal(false);
            setProjectName("");
            setSelectedProjectId("");
            loadProjects(organisation.id)
        }
        catch (err) {
            handleError(err);
        }
    }

    const handleDeleteProject = async () => {
        try {
            const response = await deleteProject(selectedProjectId);
            setOpenDeleteModal(false);
            setProjectName("");
            setSelectedProjectId("");
            loadProjects(organisation.id);

        }
        catch (err) {
            handleError(err);
        }

    }


    const handleProjectCard = (project) => {
        dispatch(setTaskCount(project.taskCount));
        handleSetDefaultProject(project)
        navigate("task");
    }
    return (
        <div className='m-4 flex  justify-center md:justify-start  flex-wrap gap-2 gap-y-4   '>


            <div className="flex justify-center items-center max-w-sm  md:min-h-[180px] min-h-[100px] md:min-w-[320px] min-w-[320px] p-6 mx-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 cursor-pointer" onClick={() => setOpenModal(true)}>
                <div className='flex flex-col items-center justify-center '>
                    <GoPlus className='md:w-16 md:h-16 w-12 h-12 dark:text-white  text-customSky ' />
                    <h5 className="mb-2 md:text-xl text-md font-bold tracking-tight text-gray-900 dark:text-white">Create Project</h5>
                </div>
                {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
                {/* <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </a> */}
            </div>


            {projectList ? projectList.map((project) =>
            (

                <div key={project._id} onMouseEnter={() => setHoveredProjectId(project.projectId)}
                    onMouseLeave={() => setHoveredProjectId(null)}>
                    <div style={{ borderLeft: `6px solid ${project.bgColor}` }} className={`flex justify-between   max-w-[300px] md:min-h-[180px] min-h-[130px] md:min-w-[320px] min-w-[320px]  bg-gray-100 dark:bg-gray-700   pl-3 pr-0 mx-2 dark:text-black border border-gray-200 rounded-md shadow-sm  dark:border-gray-700 cursor-pointer`} onClick={() => handleProjectCard(project)}>
                        <div>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  dark:text-white mt-4">{project.name.charAt(0).toUpperCase() + project.name.slice(1)}</h5>
                            {project.createdBy && <p className='text-bold text-gray-500   flex   items-center dark:text-white mt-4 '><FaUser className='mr-2 ' />
                                Created By,<span className=' text-gray-500 dark:text-white font-light italic ml-1'>{" " + project.createdBy}</span></p>}
                            <p className='text-bold text-gray-500 my-3 mt-5 pl-1  font-bold  flex  justify-between items-center dark:text-white '>{project.taskCount > 0 && project.taskCount + " " + "Tasks"}</p>
                        </div>
                        {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
                        {/* <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </a> */}
                        <div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Dropdown className='w-[150px]   ' arrowIcon={false} label={<IoEllipsisVerticalSharp className={` w-7 h-7 mx-2 mt-4  ${hoveredProjectId == project.projectId ? "md:opacity-90 " : "md:opacity-0"}  opacity-90   dark:text-white rounded-md`} />} inline>
                                <Dropdown.Item onClick={() => { dispatch(getSelectedProject(project)); setOpenEditModal(true); setProjectName(project.name); setSelectedProjectId(project.projectId); setSelectedColor(project.bgColor) }} className='dark:bg-gray-800'>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setOpenDeleteModal(true); setSelectedProjectId(project.projectId); setProjectName(project.name) }} className='text-red-500 dark:bg-gray-800'>Delete</Dropdown.Item>

                            </Dropdown>
                        </div>
                    </div>




                </div>
            )) : <div className=''>
                <ShimmerProjectCard />
            </div>}





            <Modal className='pt-[200px]  md:pt-0' dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Create Project</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="col-span-2">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Name</label>
                            <input onChange={(e) => { setProjectName(e.target.value) }} value={projectName} type="text" name="name" id="name" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`} placeholder="Project Name" />
                            {/* {errorList && <p className="ml-1 mt-2 text-red-500">{errorList.name}</p>} */}
                        </div>



                        <div className="col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Theme Color:</label>
                            <div className="flex space-x-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`w-6 h-6 border rounded-full ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>

                        </div>




                    </div>
                    {errorMessage && <p className='mt-4 text-red-500 flex items-center'><MdErrorOutline className='mr-1' />{errorMessage}</p>}
                </Modal.Body>
                <Modal.Footer className='flex justify-center'>

                    <button className='bg-customSky dark:bg-gray-500 text-white p-2 px-4 rounded-lg' onClick={() => setproject()} >{loading ? <div role="status">
                        <svg aria-hidden="true" className="w-9 h-6 mx-1.5 text-gray-200 animate-spin dark:text-gray-600 fill-white dark:fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div> : "Create"}</button>
                    {/* <Button color="gray" onClick={() => setOpenModal(false)}>
                        Canel
                    </Button> */}
                </Modal.Footer>
            </Modal>




            <Modal className='pt-[200px]  md:pt-0' dismissible show={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Modal.Header>Edit Project</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="col-span-2">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Name</label>
                            <input onChange={(e) => { setProjectName(e.target.value) }} value={projectName} type="text" name="name" id="name" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`} placeholder="Project Name" />
                            {/* {errorList && <p className="ml-1 mt-2 text-red-500">{errorList.name}</p>} */}
                        </div>

                        <div className="col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Theme Color:</label>
                            <div className="flex space-x-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`w-6 h-6 border rounded-full ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>




                    </div>
                </Modal.Body>
                <Modal.Footer className='flex justify-center'>


                    <button className='bg-customSky dark:bg-gray-500 text-white p-2 px-4 rounded-lg' onClick={() => handleEditProject()} >{loading ? <div role="status">
                        <svg aria-hidden="true" className="w-9 h-6 mx-1.5 text-gray-200 animate-spin dark:text-gray-600 fill-white dark:fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div> : "Edit"}</button>
                </Modal.Footer>
            </Modal>




            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className='pt-[200px] md:pt-0 '>
                <Modal.Header />
                <Modal.Body >
                    <div className="text-center " >
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this <span className='font-bold text-black dark:text-white'>{projectName}</span> project
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteProject} >
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default ProjectContainer