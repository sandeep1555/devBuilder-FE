import { useEffect, useState } from 'react'
import { getTaskListApi, updateProgressApi } from '../Api/Task';
import { createCommentApi } from '../Api/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTask } from '../Store/taskdataSlice';
import { Button, Modal, RangeSlider, Tabs, Textarea } from 'flowbite-react';
import { handleError } from '../Utility/Utility';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useParams } from 'react-router-dom';


const TaskProgressContainer = () => {

	const selectedTask = useSelector((store) => store.taskData.selectedTask);
	const defaultProject = useSelector((store) => store.projectData.defaultProject);
	const dispatch = useDispatch();
	const params = useParams();
	const taskName = params.taskName;


	const [progress, setProgress] = useState(null);
	const [initialProgress, setInitialProgress] = useState(null);
	const [comment, setComment] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [error, setError] = useState(null);


	const [selectedTaskId, setSelectedTaskId] = useState(null);


	const getTaskDetails = async (url = null) => {

		try {
			var queryParam = { "name": taskName };
			const response = await getTaskListApi(defaultProject.projectId, url, queryParam);
			const taskDetails = response.data.data;
			dispatch(setSelectedTask(taskDetails));
		}
		catch (error) {
			handleError(error);
		}
	}

	useEffect(() => {
		defaultProject && getTaskDetails();
	}, [defaultProject, taskName])


	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {

		const progressValues = selectedTask && selectedTask.reduce((acc, task) => ({ ...acc, [task.id]: task.progress ? task.progress : '0' }), {});
		setProgress(progressValues);
		setInitialProgress(progressValues)
	}, [selectedTask])


	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);



	const handleUpdateButton = async () => {
		try {
			const progressResponse = await updateProgressApi(selectedTaskId, progress[selectedTaskId]);
			const commentResponse = comment && await createCommentApi(selectedTaskId, comment);
			setOpenModal(false);
			setInitialProgress(progress);
		}

		catch (error) {
			handleError();
		}
		setComment("");

	}
	const handleUpdateTaskId = (taskId) => {
		setOpenModal(true);
		setSelectedTaskId(taskId);
	}


	const handleProgressChange = (e, id, maxProgress) => {

		setProgress(prev => ({ ...prev, [id]: e.target.value }));

		if (e.target.value <= Number(maxProgress)) {
			setError("");

		} else {
			setError(`Cannot be greater than ${maxProgress}`);
		}

	}


	return (
		<div className='my-4 mx-2  '>
			<div>
				<div className='shadow-lg rounded-md mt-3 '>
					<Tabs id="tabs" className='focus:ring-0 px-0 py-0    ' aria-label="Tabs with underline" variant="underline" onActiveTabChange={() => { setComment(""); setProgress(initialProgress) }} >

						{selectedTask && selectedTask.map((task, index) =>
						(

							<Tabs.Item active={index === 0} className='  custom-tab-active   ' key={task.id} title={task.tag ? task.tag.name : task.category.name}>

								<div className="w-full" >
									<div className='flex justify-center items-center w-auto font-bold text-2xl'>
										<h1 className='dark:text-white uppercase'>{task.name}</h1>
									</div>


									<div className='w-full  mx-2 my-4 mt-8 flex '>
										{task.unit != "%" ?
											<div className='w-1/2 mr-3 '>
												<label htmlFor="progress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Done</label>
												{progress && <input name="progress" id="progress" min="0" max={task.max_progress} onChange={(e) => handleProgressChange(e, task.id, task.max_progress)} value={progress[task.id] ? progress[task.id] : ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="number" placeholder="Work Done" />}
											</div> :

											<div className="w-full mr-3 ">
												<label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Done</label>
												{progress && <> <RangeSlider id="default-range" name='progress' type="range" min="0" max={task.max_progress} value={progress[task.id]} onChange={(e) => handleProgressChange(e, task.id, task.max_progress)} className=" py-2.5  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" style={{ background: `linear-gradient(to right, #3b82f6 ${progress[task.id]}%, #e5e7eb ${progress[task.id]}%)`, }} /><span className="mt-[10px] dark:text-white">{progress[task.id] + "%"}</span></>}
											</div>}
										<div className='w-1/2 mx-2 mr-4  px-2 pt-4  rounded-md mt-[-10px]'>
											<p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total Work</p>
											<p className="font-light dark:text-white text-xl" >{" / " + task.max_progress + " " + task.unit}</p>
										</div>

									</div>
									{error && <p className='text-red-500 ml-2'>{error}</p>}
									<div>


										<div className='flex flex-col m-2'>
											<label className='dark:text-white'>Remark</label>
											<Textarea className='focus:border-blue-600 focus:ring-blue-600 my-2 dark:bg-gray-600' onChange={(e) => setComment(e.target.value)} value={comment} placeholder='Write a Remark.' />
										</div>

									</div>
									<div className='flex justify-center'>
										{progress && <button className={` bg-customSky px-4  py-2 text-white rounded-md opacity-90 ${(error || initialProgress[task.id] == progress[task.id]) ? "cursor-not-allowed opacity-40 pointer-events-none" : ""}`} onClick={() => handleUpdateTaskId(task.id)}>Update</button>}
										<Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup className='pt-[200px]' >
											<Modal.Header />
											<Modal.Body >
												<div className="text-center">
													<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
													<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
														Are you sure you want to Update Status
													</h3>
													<div className="flex justify-center gap-4">
														<Button color="blue" onClick={() => handleUpdateButton()}>
															{"Yes, I'm sure"}
														</Button>
														<Button color="gray" onClick={() => setOpenModal(false)}>
															No, cancel
														</Button>
													</div>
												</div>
											</Modal.Body>
										</Modal>
									</div>
								</div>

							</Tabs.Item>
						))}
					</Tabs>
				</div>
			</div>

		</div>
	)
}

export default TaskProgressContainer