import { useEffect, useRef, useState } from "react";
import SingleTasks from "./SingleTasks"
import { useDispatch, useSelector } from "react-redux";
import { TaskModal } from "./TaskModal";
import Shimmer from "../Shimmer/Shimmer";
import { getCategoryListApi, getTaskListApi, getaggregateListApi, updatetaskListOrder } from "../Api/Task";
import { handleError, createRowSpans, getButtonStyles } from "../Utility/Utility";
import { setTaskList, setNextLink, setPreviousLink, setCount, setAggregateList } from "../Store/taskdataSlice";
import { calculateBgColor } from "../Utility/Utility";
import { Dropdown, Table } from "flowbite-react";
import { setCategoryList } from "../Store/optionsSlice";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useTheme } from "../Contexts/themeContext";


const TasksContainer = () => {

	const taskList = useSelector((store) => store.taskData.taskList);
	const taskNextUrl = useSelector((store) => store.taskData.nextLink);
	const taskPrevousUrl = useSelector((store) => store.taskData.previousLink);
	const defaultProject = useSelector((store) => store.projectData.defaultProject);
	const userPermissions = useSelector((store) => store.user.permissions);
	const categoryList = useSelector(store => store.options.categoryList);
	const aggregateList = useSelector(store => store.taskData.aggregateList);
	const { theme } = useTheme();

	const params = useParams();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const categoryParams = searchParams.get("type");
	const navigate = useNavigate();
	const dispatch = useDispatch();


	const [taskName, setTaskName] = useState(params.taskName ? params.taskName : "");
	const [taskId, setTaskId] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [categoryName, setCategoryName] = useState(categoryParams ? categoryParams : "");
	const [categorySearchText, setCategorySearchText] = useState("");
	const [taskNameSearchText, setTaskNameSearchText] = useState("");
	const [originalList, setOriginalList] = useState(null);
	const [clearFilter, setClearFilter] = useState(taskName === "" || location.pathname === "/project/task/details");

	const rowSpans = taskList && createRowSpans(taskList);
	const containerRef = useRef(null);



	const gettaskListData = async (url = null) => {
		try {
			var queryParam = { "search": searchText, "name": taskName, "category__name": categoryName };
			const response = await getTaskListApi(defaultProject.projectId, url, queryParam);
			dispatch(setTaskList(response.data?.data));
			dispatch(setNextLink(response.data?.next));
			dispatch(setPreviousLink(response.data?.previous));
			dispatch(setCount(response.data?.count));
		}

		catch (error) {
			handleError(error);
		}
	}


	useEffect(() => {
		defaultProject && gettaskListData();
	}, [categoryName, defaultProject])




	const getTaskBorder = (index) => {
		if (taskList[index + 1]) {
			if (taskList[index].name != taskList[index + 1].name) {
				return "border-b-2 border-gray-300"
			}
		}
		return "border-b"
	}

	const handleSingleTask = (taskId) => {
		setTaskId(taskId);
		setOpenModal(true)

	}

	const handleOpenCreateTask = () => {
		setTaskId(null);
		setOpenModal(true)

	}

	const handleCloseCreateTask = () => {
		setOpenModal(false)
	}

	const handlePreviousButton = () => {
		taskPrevousUrl && gettaskListData(taskPrevousUrl);
	}

	const handleNextButton = () => {
		taskNextUrl && gettaskListData(taskNextUrl);
	}


	useEffect(() => {
		const timer = setTimeout(() => {
			defaultProject && gettaskListData();
		}, 200);

		return () => {
			clearTimeout(timer);
		}

	}, [searchText]);


	const handleClearFilterButton = () => {
		setClearFilter(true);
		setTaskName("");
		setCategoryName("");
		navigate("/project/task/details")

	}

	useEffect(() => {
		const pathParts = location.pathname.split('/');
		if (pathParts[1] === 'task' && pathParts[2] === 'details') {
			const decodedTaskName = pathParts[3] ? decodeURIComponent(pathParts[3]) : "";
			setTaskName(decodedTaskName);
			setClearFilter(decodedTaskName === "");
		} else {
			setClearFilter(taskName === "");
		}
		defaultProject && gettaskListData();
	}, [location.pathname, taskName]);




	const getCategoryList = async () => {
		try {
			const response = await getCategoryListApi(categorySearchText)
			const categoryList = response.data?.data;
			dispatch(setCategoryList(categoryList));

		}
		catch (error) {
			handleError(error);
		}

	};

	useEffect(() => {
		const timer = setTimeout(() => {
			getCategoryList();

		}, 200);

		return () => {
			clearTimeout(timer);
		}



	}, [categorySearchText]);



	const getAggregateList = async () => {
		try {

			const response = await getaggregateListApi(defaultProject.projectId);
			const aggregateListData = response.data?.data;
			dispatch(setAggregateList(aggregateListData));
			setOriginalList(aggregateListData);
		}
		catch (error) {
			handleError(error);
		}

	}

	const handleSearchText = () => {
		const filterList = originalList && originalList.filter(task => task.name.toLowerCase().includes(taskNameSearchText.toLowerCase()));
		dispatch(setAggregateList(filterList))
	}

	useEffect(() => {

		handleSearchText();

	}, [taskNameSearchText, originalList])


	const handleDragUpdate = (update) => {
		const { destination, source } = update;
		const container = containerRef.current;

		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const scrollSpeed = 10; // Speed of scrolling

		if (destination) {
			const { clientY } = update;
			const offsetY = clientY - containerRect.top;
			const containerHeight = containerRect.height;
			const scrollTop = container.scrollTop;

			if (offsetY < 50 && scrollTop > 0) {
				container.scrollBy({ top: -scrollSpeed, behavior: 'smooth' });
			} else if (offsetY > containerHeight - 50) {
				container.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
			}
		}
	};


	const groupTasksByName = (tasks) => {
		const groups = {};
		tasks.forEach((task, index) => {
			if (!groups[task.name]) {
				groups[task.name] = [];
			}
			groups[task.name].push(index);
		});
		return groups;
	};



	const saveTaskOrder = async (updatedTasks) => {
		try {
			const taskOrderData = updatedTasks.map((task, index) => ({

				id: task.id,
				orderId: index + 1,
			}));
			await updatetaskListOrder(taskOrderData);


		} catch (error) {

			console.error("Error saving task order:", error);
		}
	};


	const handleDragEnd = (results) => {
		const { source, destination } = results;

		// Check if the item was dropped outside the list or at the same position
		if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
			return;
		}

		// Create a copy of the taskList to manipulate
		const updatedTaskList = Array.from(taskList);

		// Get the task name for source and destination
		const sourceTask = taskList[source.index];
		const destinationTask = taskList[destination.index];

		// Group tasks by name
		const taskGroups = groupTasksByName(updatedTaskList);

		// Get the source and destination groups
		const sourceGroup = taskGroups[sourceTask.name];
		const destinationGroup = taskGroups[destinationTask.name];

		const isSourceTaskUnique = sourceGroup.length === 1;
		const isDestinationGroup = destinationGroup.length > 1;

		if (isSourceTaskUnique && isDestinationGroup) {
			// Find the correct position to drop the unique task
			const allIndexes = updatedTaskList
				.map((task, index) => ({ task, index }))
				.filter(item => item.task.name === destinationTask.name);

			let targetIndex;

			if (source.index < destination.index) {
				// Dragging from top to bottom
				targetIndex = allIndexes.slice(-1)[0].index;
			} else {
				// Dragging from bottom to top
				targetIndex = allIndexes[0].index;
			}

			// Adjust targetIndex to handle valid insertion
			targetIndex = Math.min(targetIndex, updatedTaskList.length);

			if (destination.index >= targetIndex) {
				// Drop at the bottom of the group
				const [movedTask] = updatedTaskList.splice(source.index, 1);
				updatedTaskList.splice(targetIndex, 0, movedTask);
			} else {
				// Drop at the top of the group
				const [movedTask] = updatedTaskList.splice(source.index, 1);
				const firstInGroupIndex = updatedTaskList.findIndex(task => task.name === destinationTask.name);
				updatedTaskList.splice(firstInGroupIndex, 0, movedTask);
			}

			// Dispatch the updated list to the Redux store
			dispatch(setTaskList(updatedTaskList));
			saveTaskOrder(updatedTaskList)
			return;
		}

		// Handle tasks within the same group
		const isMultipleInGroup = sourceGroup.length > 1;

		if (isMultipleInGroup && sourceGroup !== destinationGroup) {
			// Restrict movement to within the same group
			return;
		} else {
			// Move the dragged item to the destination position
			const [movedTask] = updatedTaskList.splice(source.index, 1);
			updatedTaskList.splice(destination.index, 0, movedTask);
		}

		// Dispatch the updated list to the Redux store
		dispatch(setTaskList(updatedTaskList));
		saveTaskOrder(updatedTaskList)

	};


	return !taskList ? <Shimmer /> : (
		<div className="w-full mx-1  overflow-y-scroll  ">
			<h2 className="text-center text-xl font-bold dark:text-white m-2">{defaultProject ? defaultProject.name : ""}</h2>

			<div className="md:mx-2 mx-4 md:flex  justify-between  mt-4 overflow-x-scroll">
				<div className="flex items-center">
					<input className="relative rounded-md h-[40px] py-[15px] md:px-4 md:w-[250px] mx-2  mr-4 w- dark:bg-gray-700  dark:text-white" onChange={(e) => setSearchText(e.target.value)} type="text" placeholder="Search Task.." value={searchText} />
				</div>

				<div className="flex justify-between w-full items-center ">

					<div className="flex items-center mt-4 ">
						<div onClick={() => getAggregateList()} className="mx-4 dark:text-white">
							<Dropdown label={taskName ? taskName : "Task Name"} className="" inline>

								<Dropdown.Header>
									<input type="text" placeholder="search...." onKeyDown={(e) => e.stopPropagation()} onChange={(e) => { setTaskNameSearchText(e.target.value) }} value={taskNameSearchText} className="rounded-sm mx-0 " />
								</Dropdown.Header>

								<div className="overflow-y-scroll max-h-[180px]">
									{aggregateList && aggregateList.map((task) =>
									(

										<Dropdown.Item key={task.name} onClick={() => { setTaskName(task.name); setClearFilter(false); setTaskNameSearchText(""); navigate(`/project/task/details/${task.name}`) }}>{task.name}</Dropdown.Item>

									))}
								</div>
							</Dropdown>
						</div>


						<div onClick={() => getCategoryList()} className="mx-4 dark:text-white">
							<Dropdown label={categoryName ? categoryName : "Nature Of Work"} className="" inline>

								<Dropdown.Header>
									<input type="text" placeholder="search...." onKeyDown={(e) => e.stopPropagation()} onChange={(e) => { setCategorySearchText(e.target.value) }} value={categorySearchText} className="rounded-sm mx-0" />
								</Dropdown.Header>

								<div className="overflow-y-scroll max-h-[180px]">
									{categoryList && categoryList.map((category) =>
									(

										<Dropdown.Item key={category.id} onClick={() => { setCategoryName(category.name); setClearFilter(false); setCategorySearchText(""); navigate(`${location.pathname + "?type=" + category.name}`) }}>{category.name}</Dropdown.Item>

									))}
								</div>
							</Dropdown>
						</div>
						<a style={getButtonStyles(defaultProject?.bgColor, theme)}
							className={` mx-4 md:p-2 py-1 md:px-4 px-2 rounded-lg cursor-pointer dark:text-white dark:hover:text-blue-500 ${clearFilter && "hidden "}`} onClick={() => handleClearFilterButton()} >Clear Filters</a>
					</div>

					{userPermissions.includes("add_task") && <button style={getButtonStyles(defaultProject.bgColor, theme)} className="block py-1  mt-5 md:py-2  md:px-5 px-4 me-2 mb-2 text-md md:text-lg font-medium text-gray-900 focus:outline-none  rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={handleOpenCreateTask}>Add Task</button>}
				</div>


			</div>






			<DragDropContext onDragEnd={(results) => handleDragEnd(results)} onDragUpdate={handleDragUpdate} >
				<div ref={containerRef} className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2 mx-3  ">
					<Table className="table-auto w-full shadow-lg   ">

						<Table.Head className="w-full text-md md:text-lg 2xl:text-xl  ">
							<Table.HeadCell className="text-center w-3/12">Name of Equipment</Table.HeadCell>
							<Table.HeadCell className="text-center px-2 w-3/12">Nature of Work</Table.HeadCell>
							<Table.HeadCell className="text-center px-4 w-2/12" >Task Category</Table.HeadCell>
							<Table.HeadCell className="text-center px-3 w-2/12">Completed Quantity</Table.HeadCell>
							<Table.HeadCell className="w-2/12 text-center">Remarks</Table.HeadCell>
							{/* <Table.HeadCell className="text-center px-3">ASSIGNEE</Table.HeadCell> */}

						</Table.Head>
						<Droppable droppableId="taskListDroppable" direction="vertical" className="">
							{(provided) => (<Table.Body ref={provided.innerRef} {...provided.droppableProps} className="text-md md:text-lg 2xl:text-xl " >
								{taskList.length > 0 ? rowSpans && taskList.map((data, index) =>

								(
									<Draggable draggableId={data._id.toString()} index={index} key={data._id}>
										{(provided) => (
											<SingleTasks ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => { handleSingleTask(data.id) }}
												rowSpans={rowSpans[index].span}
												taskid={data.id}
												name={data.name}
												unit={data.unit}
												progress={data.progress}
												// userIconBg={getRandomColor()}
												tag={data.tag ? data.tag.name : ""}
												category={data.category ? data.category.name : ""}
												start_date={data.start_date}
												end_date={data.end_date}
												maxProgress={data.max_progress}
												latestComment={data.latest_comment}
												bgColor={calculateBgColor(data.start_date, data.end_date, data.progress)}
												border={getTaskBorder(index)}
												updatedTaskList={gettaskListData}
												index={index}

											/>)}
									</Draggable>

								)) :
									<Table.Row>
										<Table.Cell colSpan={6} className="text-center  text-gray-500 pointer-events-none">
											No tasks available
										</Table.Cell>
									</Table.Row>}
								{provided.placeholder}

							</Table.Body>)}
						</Droppable>
					</Table>

				</div>
			</DragDropContext>
			{/* <div className="m-2 md:m-4">
				<nav className="flex justify-between items-center md:mr-4 mr-2">
					<span className="text-sm font-normal text-gray-500 dark:text-gray-400 inline w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-{taskCount < 20 ? taskCount : 20}</span> of <span className="font-semibold text-gray-900 dark:text-white">{taskCount}</span></span>
					<ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
						<li>
							<a onClick={handlePreviousButton} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${taskPrevousUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Previous</a>
						</li>
						<li>
							<a onClick={handleNextButton} className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${taskNextUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Next</a>
						</li>
					</ul>
				</nav>
			</div> */}
			{openModal && <TaskModal updateTaskList={gettaskListData} openModal={handleOpenCreateTask} closeModal={handleCloseCreateTask} taskId={taskId} />}
		</div >
	);
};

export default TasksContainer;