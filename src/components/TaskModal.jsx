
import { useEffect, useRef, useState } from "react"
import { combineDateTime, formatDateToISO, getCurrentTime, handleError, separateDateTime, convertDateToDatePickerFormat } from "../Utility/Utility";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryList, setUnitOptions, setCategory, setTag, setTagList } from "../Store/optionsSlice";
import { createTaskListApi, getUnitOptionsApi, getCategoryListApi, updateTaskListApi, createCategorytApi, createTagApi, getTagListApi, deleteTaskApi } from "../Api/Task";
import { removeErrorList, setErrorList } from "../Store/errorSlice";
import { Button, Datepicker, Modal, RangeSlider, Table, TableBody } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
// import {setAssigneeList, setReporterList,setAssignee, setReporter} from "../Store/optionsSlice";
// import { getProjectAssigneeList } from "../Api/Project";

const TaskModal = ({ updateTaskList, openModal, closeModal, taskId }) => {


	//store variables
	const defaultProject = useSelector(store => store.projectData.defaultProject);
	const taskList = useSelector(store => store.taskData.taskList);
	const selectedTask = taskList && taskList.filter(data => data.id === taskId)[0];
	const unitOptionsList = useSelector(store => store.options.unitOptions);
	const categoryList = useSelector(store => store.options.categoryList);
	const tagList = useSelector(store => store.options.tagList);
	const selectedCategory = useSelector(store => store.options.category);
	const selectedTag = useSelector(store => store.options.tag);
	const errorList = useSelector(store => store.error.errorList);
	const userPermissions = useSelector((store) => store.user.permissions);

	// const assigneeList = useSelector(store => store.options.assigneeList);
	// const reporterList = useSelector(store => store.options.reporterList);

	// const selectedAssignee = useSelector(store => store.options.assignee);
	// const selectedReporter = useSelector(store => store.options.reporter);
	const dispatch = useDispatch();


	//task variables
	const [taskName, setTaskName] = useState(taskId ? selectedTask.name : "");
	const [description, setDescription] = useState(taskId ? selectedTask.description : "");
	const [maxProgress, setMaxProgress] = useState(taskId ? selectedTask.max_progress : "100");
	const [progress, setProgress] = useState(taskId && (selectedTask.progress !== "" ? selectedTask.progress : "0"))
	//startDate variables
	const separateStartdate = taskId && separateDateTime(selectedTask.start_date);
	const [startDate, setStartDate] = useState(taskId ? separateStartdate.date : "");
	const [startTime, setStartTime] = useState(taskId ? separateStartdate.time : getCurrentTime());
	//endDate variables
	const separateEnddate = taskId && separateDateTime(selectedTask.end_date);
	const [endDate, setEndDate] = useState(taskId ? separateEnddate.date : "");
	const [endTime, setEndTime] = useState(taskId ? separateEnddate.time : "12:00:00");

	//units variables
	const [unit, setUnit] = useState(taskId ? selectedTask.unit : "");
	const [showUnitOptions, setShowUnitOptions] = useState(false);
	const unitsRef = useRef(null);

	//category variables
	const [categoryValue, setCategoryValue] = useState(taskId ? (selectedTask.category ? selectedTask.category.name : "") : "");
	const [showCategoryList, setShowCategoryList] = useState(false);
	const categoryRef = useRef(null);
	// dispatch(setCategory(selectedTask.category));

	const [tagValue, setTagValue] = useState(taskId ? (selectedTask.tag ? selectedTask.tag.name : "") : "");
	const [showTagList, setShowTagList] = useState(false);
	const tagRef = useRef(null);

	const [openDeleteModal, setOpenDeleteModal] = useState(false);


	//assignee variables
	// const [assigneeValue, setAssigneeValue] = useState(taskId ? selectedTask.assignee ? selectedTask.assignee.full_name : "" : "");
	// const [showAssigneeList, setShowAssigneeList] = useState(false);
	// const assigneeRef = useRef(null);
	// dispatch(setAssignee(selectedTask.assignee));

	//reporter variables
	// const [reporterValue, setReporterValue] = useState(taskId ? selectedTask.reporter ? selectedTask.reporter.full_name : "" : "");
	// const [showReporterList, setShowReporterList] = useState(false);
	// const reporterRef = useRef(null);
	// dispatch(setReporter(selectedTask.reporter));
	const createpageref = useRef(null);
	const [isCreateTaskValid, setIsCreateTaskVValid] = useState(false);

	useEffect(() => {
		taskId && dispatch(setCategory(selectedTask.category));
		// taskId && dispatch(setAssignee(selectedTask.assignee));
		// taskId && dispatch(setReporter(selectedTask.reporter));
		taskId && dispatch(setTag(selectedTask.tag));
	}, []);

	const validateCreateTask = () => {
		const isValid =
			taskName !== "" &&
			categoryValue !== "" &&
			tagValue !== "" &&
			unit !== "" &&
			maxProgress !== "" &&
			startDate !== "" &&
			endDate !== ""
		setIsCreateTaskVValid(isValid);
	};

	useEffect(() => {
		validateCreateTask();
	}, [taskName, description, unit, maxProgress, categoryValue, startDate, endDate, tagValue]);     //assigneeValue, reporterValue,

	//createButton function
	const handleCreateButton = async () => {


		const categoryId = selectedCategory && selectedCategory.id;
		const tagId = selectedTag && selectedTag.id;
		// const assigneeId = selectedAssignee && selectedAssignee.id;
		// const reporterId = selectedReporter && selectedReporter.id;
		const startDateWithTime = startDate && combineDateTime(startDate, startTime);
		const endDateWithTime = endDate && combineDateTime(endDate, endTime);
		dispatch(removeErrorList());

		try {

			const response = await createTaskListApi(taskName, description, unit, maxProgress, categoryId, tagId, defaultProject.projectId, startDateWithTime, endDateWithTime);      //assigneeId, reporterId

			if (response.status === 200) {

				handleCloseButton();
				updateTaskList();
				setIsCreateTaskVValid(false);

			}
		}

		catch (error) {

			const ResponseErrors = error.errors;
			const newErrors = {};
			ResponseErrors && ResponseErrors.forEach(error => newErrors[error.field] = error.data[0].message);
			dispatch(setErrorList(newErrors));


		}

	}


	//updateButton function
	const handleupdateButton = async () => {

		if (progress > Number(maxProgress)) {
			dispatch(setErrorList({ progress: "Can not be greater than " + maxProgress }));
			return;
		}


		const categoryId = selectedCategory && selectedCategory.id;
		const tagId = selectedTag && selectedTag.id;
		// const assigneeId = selectedAssignee && selectedAssignee.id;
		// const reporterId = selectedReporter && selectedReporter.id;
		const startDateWithTime = startDate && combineDateTime(startDate, startTime);
		const endDateWithTime = endDate && combineDateTime(endDate, endTime);
		dispatch(removeErrorList());


		try {


			const response = await updateTaskListApi(taskId, taskName, description, unit, maxProgress, progress, categoryId, tagId, defaultProject.projectId, startDateWithTime, endDateWithTime);          //assigneeId, reporterId,
			if (response.status === 200) {
				handleCloseButton();
				setIsCreateTaskVValid(false);
				updateTaskList()

			}
		}
		catch (error) {

			const ResponseErrors = error.errors;
			const newErrors = {};
			ResponseErrors.forEach(error => newErrors[error.field] = error.data[0].message);
			dispatch(setErrorList(newErrors));

		}
	}





	const handleCloseButton = () => {

		setIsCreateTaskVValid(false);
		dispatch(removeErrorList());
		setTaskName("");
		setDescription("");
		setMaxProgress("");
		setProgress(0);
		setUnit("");
		setCategoryValue("");
		// setAssigneeValue("");
		// setReporterValue("");
		setStartDate("");
		setEndDate("");
		closeModal();

	}



	useEffect(() => {

		const closeDropdown = e => {
			if (unitsRef.current && !unitsRef.current.contains(e.target)) {
				setShowUnitOptions(false);

			}
			if (categoryRef.current && !categoryRef.current.contains(e.target)) {
				setShowCategoryList(false);

			}
			if (tagRef.current && !tagRef.current.contains(e.target)) {
				setShowTagList(false);

			}

			// if (assigneeRef.current && !assigneeRef.current.contains(e.target)) {
			// 	setShowAssigneeList(false);
			// }
			// if (reporterRef.current && !reporterRef.current.contains(e.target)) {
			// 	setShowReporterList(false);
			// }
			if (createpageref.current && !createpageref.current.contains(e.target)) {

				handleCloseButton();
				setShowUnitOptions(false);
				dispatch(removeErrorList());

			}

		}
		document.body.addEventListener('mousedown', closeDropdown)
		return () => document.body.removeEventListener('mousedown', closeDropdown)


	}, [])






	//unit functions
	const handleUnitsOptionsButton = async () => {
		setShowUnitOptions(!showUnitOptions)

		if (!showUnitOptions) {
			try {
				const response = await getUnitOptionsApi();

				if (response.status === 200) {
					const unitOptionsData = response.data;
					dispatch(setUnitOptions(unitOptionsData));

				}
			}
			catch (error) {
				handleError(error);
			}
		}
	}

	const handleUnitOptionClick = (options) => {
		setUnit(options);
		setShowUnitOptions(false);
		setProgress("0");
	}



	//category functions
	const handleCategoryClick = (category) => {

		setCategoryValue(category.name);
		dispatch(setCategory(category));
		setShowCategoryList(false);

	}

	const getCategoryList = async () => {
		try {
			const response = await getCategoryListApi(categoryValue)
			const categoryList = response.data?.data;
			dispatch(setCategoryList(categoryList));
		}
		catch (error) {
			handleError(error);
		}

	};

	useEffect(() => {

		categoryValue && getCategoryList();

	}, [categoryValue]);


	const handleCreateCategoryButton = async () => {

		try {
			const response = await createCategorytApi(categoryValue);
			const newCategory = response.data.data;
			dispatch(setCategory(newCategory));
			setShowCategoryList(false);

		}
		catch (error) {
			handleError(error);
		}

	}

	//Nature Of Work
	const handleTagClick = (tag) => {

		setTagValue(tag.name);
		dispatch(setTag(tag));
		setShowTagList(false);

	}

	const getTagList = async () => {
		try {
			const response = await getTagListApi(tagValue)
			const tagList = response.data?.data;
			dispatch(setTagList(tagList));
		}
		catch (error) {
			handleError(error);
		}

	};

	useEffect(() => {

		tagValue && getTagList();

	}, [tagValue]);


	const handleCreateTagButton = async () => {

		try {

			const response = await createTagApi(tagValue);
			const newTag = response.data.data;
			dispatch(setTag(newTag));
			setShowTagList(false);


		}
		catch (error) {
			handleError(error);
		}

	}

	const handleDeleteButton = async (id) => {
		try {

			const response = await deleteTaskApi(id);
			handleCloseButton();
			setOpenDeleteModal(false);
			updateTaskList();
		}
		catch (error) {
			handleError();
		}

	}


	//assignee functions

	// const handleAssigneeClick = (assignee) => {

	// 	setAssigneeValue(assignee.user);
	// 	dispatch(setAssignee(assignee));
	// 	setShowAssigneeList(false);

	// }

	// const getAssigneeList = async () => {

	// 	try {
	// 		const response = await getProjectAssigneeList(defaultProject.id, assigneeValue);
	// 		const AssigneeList = response.data?.results;
	// 		dispatch(setAssigneeList(AssigneeList));

	// 	}
	// 	catch (error) {
	// 		handleError(error);
	// 	}
	// }

	// useEffect(() => {
	// 	assigneeValue && getAssigneeList();

	// }, [assigneeValue])




	//reporter functions
	// const getReporterList = async () => {
	// 	try {
	// 		const response = await getProjectAssigneeList(defaultProject.id, reporterValue);
	// 		const reporterList = response.data?.results;
	// 		dispatch(setReporterList(reporterList));
	// 	}
	// 	catch (error) {
	// 		handleError(error);
	// 	}
	// }

	// useEffect(() => {
	// 	reporterValue && getReporterList();
	// }, [reporterValue])

	// const handleReporterClick = (reporter) => {

	// 	setReporterValue(reporter.user);
	// 	dispatch(setReporter(reporter));
	// 	setShowReporterList(false);
	// }
	return (

		<Modal dismissible className="h-full" show={openModal} onClose={handleCloseButton}>
			<Modal.Header>
				{taskId ? "Update Task" : "Create Task"}

			</Modal.Header>
			<Modal.Body>
				<div className="space-y-6">


					<form onSubmit={(e) => e.preventDefault()} className=" md:p-5">


						<div className="grid gap-8 mb-4 grid-cols-2">



							<div className="col-span-2" ref={categoryRef}>
								<label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nature of Work</label>
								<input id="category" name="category" value={categoryValue} autoComplete="off" onChange={(e) => { setCategoryValue(e.target.value); setShowCategoryList(true); dispatch(setCategory(null)) }} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`} type="text" placeholder="Nature of Work" />
								{/* {showCategoryList ? <img className="right-0 mr-[10px]  md:mt-[50px] mt-[35px] md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/up-arrow-icon.png" /> : <img className="right-0 mr-[10px] md:mt-[50px] mt-[35px]  md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/arrow-down-icon.png" />} */}
								{showCategoryList && <ul className="bg-gray-100 py-2 text-sm text-gray-700 dark:text-gray-200 mt-1 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 max-h-[160px] overflow-y-scroll">
									{(categoryList && categoryList.length > 0) ? categoryList.map((category) => <li className="px-4 py-2  hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-500 dark:hover:text-white flex justify-between " onClick={() => { handleCategoryClick(category) }} key={category.id}>{category.name}</li>) : <li className="px-4 py-2  hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-500 dark:hover:text-white flex justify-between "><button onClick={handleCreateCategoryButton} className="text-blue-500">+ Create Task Category</button></li>}
								</ul>}
								{errorList && <p className="ml-1 mt-2 text-red-500 z-10">{errorList.category}</p>}
							</div>


							<div className="col-span-2">
								<label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name of Equipment</label>
								<input onChange={(e) => { setTaskName(e.target.value) }} value={taskName} type="text" name="name" id="name" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`} placeholder="Name of Equipment" />
								{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.name}</p>}
							</div>



							<div className="col-span-2" ref={tagRef}>
								<label htmlFor="tag" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Category</label>
								<input id="tag" name="tag" autoComplete="off" value={tagValue} onChange={(e) => { setTagValue(e.target.value); setShowTagList(true); dispatch(setTag(null)) }} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`} type="text" placeholder="Task Category" />
								{/* {showCategoryList ? <img className="right-0 mr-[10px]  md:mt-[50px] mt-[35px] md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/up-arrow-icon.png" /> : <img className="right-0 mr-[10px] md:mt-[50px] mt-[35px]  md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/arrow-down-icon.png" />} */}
								{showTagList && <ul className="bg-gray-100 py-2 text-sm text-gray-700 dark:text-gray-200 mt-1 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 max-h-[160px] overflow-y-scroll">
									{(tagList && tagList.length > 0) ? tagList.map((work) => <li className="px-4 py-2  hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-500 dark:hover:text-white flex justify-between " onClick={() => { handleTagClick(work) }} key={work.id}>{work.name}</li>) : <li className="px-4 py-2  hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-500 dark:hover:text-white flex justify-between "><button onClick={handleCreateTagButton} className="text-blue-500">+ Create Natuer of Work</button></li>}
								</ul>}
								{errorList && <p className="ml-1 mt-2 text-red-500 z-10">{errorList.tag}</p>}
							</div>


							<div className="col-span-2" ref={unitsRef}>
								<label htmlFor="units" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Units</label>

								<button id="units" onClick={handleUnitsOptionsButton} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 flex justify-between items-center ${showUnitOptions && "rounded-b-0"}`} type="button">{unit ? unit : "Select Units"} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
									<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
								</svg>
								</button>
								{showUnitOptions && <ul className="bg-gray-100  py-2 text-sm text-gray-700 dark:text-gray-200 mt-1 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400" aria-labelledby="dropdownDefaultButton">
									{unitOptionsList && unitOptionsList.map((option) => <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-500 dark:hover:text-white flex justify-between " onClick={() => { handleUnitOptionClick(option.value) }} key={option.display_name}>{option.display_name} <p className="">{option.value}</p></li>)}
								</ul>}
								{errorList && !showUnitOptions && <p className="ml-1 mt-2 text-red-500">{errorList.unit}</p>}

							</div>



							{taskId && ((unit === "%") ? <div className=" col-span-2">
								<label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Completed Quantity</label>
								<RangeSlider
									id="range-input"
									sizing="md"
									value={progress}
									min={0}
									max={maxProgress}
									onChange={(e) => { setProgress(e.target.value) }}
									style={{
										background: `linear-gradient(to right, #3b82f6 ${progress}%, #e5e7eb ${progress}%)`,
									}}
								/><span className="mt-[10px] dark:text-white">{progress + "%"}</span>

								{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.progress}</p>}
							</div>
								:

								<div className="col-span-2">
									<label htmlFor="progress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Completed Quantity</label>
									<input name="progress" id="progress" onChange={(e) => setProgress(e.target.value)} value={progress} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="number" placeholder="Work Done" />
									{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.progress}</p>}
								</div>
							)}




							<div className="col-span-2">
								<label htmlFor="maxProgress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total Quantity</label>
								<input name="max_progress" id="maxProgress" onChange={(e) => { setMaxProgress(e.target.value) }} value={maxProgress} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="number" placeholder="Total Quantity" />
								{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.max_progress}</p>}
							</div>


							{/* <div className="col-span-2" ref={assigneeRef}>
								<label htmlFor="assignee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Assignee</label>
								<input name="assignee" id="assignee" onBlur={() => setAssigneeValue("")} value={assigneeValue} onChange={(e) => { setAssigneeValue(e.target.value); assigneeValue.length >= 0 && setShowAssigneeList(true) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="text" placeholder="Assignee" />
								{showAssigneeList ? <img className="right-0 mr-[10px]  md:mt-[50px] mt-[35px] md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/up-arrow-icon.png" /> : <img className="right-0 mr-[10px] md:mt-[50px] mt-[35px]  md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/arrow-down-icon.png" />}
								{showAssigneeList && assigneeList && assigneeList.length > 0 && <ul className="bg-gray-100 py-2 text-sm text-gray-700 dark:text-gray-200 mt-1 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 max-h-[160px] overflow-y-scroll ">
									{assigneeList.map((assginee) => <li className="px-4 py-2  hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-500 dark:hover:text-white flex justify-between " onClick={() => handleAssigneeClick(assginee)} key={assginee.id}>{assginee.user}</li>)}

								</ul>}
								{errorList && <p className="ml-1 mt-2 text-red-500 z-10">{errorList.assignee}</p>}
							</div> */}


							{/* <div className="col-span-2" ref={reporterRef}>
								<label htmlFor="reporter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reporter</label>
								<input id="reporter" name="reporter" onBlur={() => setReporterValue("")} value={reporterValue} onChange={(e) => { setReporterValue(e.target.value); reporterValue.length >= 0 && setShowReporterList(true) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="text" placeholder="Reporter" />
								{showReporterList ? <img className="right-0 mr-[10px]  md:mt-[50px] mt-[35px] md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/up-arrow-icon.png" /> : <img className="right-0 mr-[10px] md:mt-[50px] mt-[35px]  md:w-[12px] md:h-[12px] w-[12px] h-[12px] absolute" src="/assets/arrow-down-icon.png" />}
								{showReporterList && reporterList && reporterList.length > 0 && <ul className="bg-gray-100 py-2 text-sm text-gray-700 dark:text-gray-200 mt-1 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 max-h-[160px] overflow-y-scroll ">
									{reporterList.map((reporter) => <li className="px-4 py-2  hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-500 dark:hover:text-white flex justify-between " onClick={() => handleReporterClick(reporter)} key={reporter.id}>{reporter.user}</li>)}

								</ul>}
								{errorList && <p className="ml-1 mt-2 text-red-500 z-10">{errorList.reporter}</p>}
							</div> */}



							<div className="col-span-2 sm:col-span-1">
								<label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
								<Datepicker class="dark:bg-gray-600 w-full rounded-md px-10 dark:text-gray-200 bg-gray-50 dark:placeholder-gray-400 border-gray-300 dark:border-gray-500" autoHide={true} id="startDate" name="start_date" onSelectedDateChanged={(date) => { const Date = formatDateToISO(date); setStartDate(Date) }} value={startDate} placeholder="DD/MM/YYYY" />
								{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.start_date}</p>}

							</div>


							<div className="col-span-2 sm:col-span-1">
								<label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
								<Datepicker class="dark:bg-gray-600 w-full rounded-md px-10 dark:text-gray-50 dark:placeholder-gray-400 bg-gray-50 border-gray-300 dark:border-gray-500" autoHide={true} id="endDate" name="end_date" minDate={startDate && new Date(convertDateToDatePickerFormat(startDate))} onSelectedDateChanged={(date) => { const Date = formatDateToISO(date); setEndDate(Date) }} selected={endDate} value={endDate} className={`dark:focus:ring-gray-500 `} placeholder="DD/MM/YYYY" />
								{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.end_date}</p>}
							</div>

						</div>


						<div className="col-span-2">
							<label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
							<textarea onChange={(e) => { setDescription(e.target.value) }} value={description} type="text" name="description" id="description" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`} placeholder="Description" required="" />
							{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.description}</p>}
						</div>
						{errorList && <p className="ml-1 mt-2 text-red-500">{errorList.non_field_errors}</p>}

					</form>

				</div>
			</Modal.Body>
			<div className={`flex items-center ${(taskId && userPermissions.includes("delete_task")) ? "justify-between" : "justify-center"} my-6 mx-8`} >
				{taskId && userPermissions.includes("delete_task") &&
					<div>
						<Button color={"failure"} onClick={() => setOpenDeleteModal(true)} className="flex items-center justify-between">Delete Task</Button>
						<Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className="bg-opacity-90 pt-[200px] md:pt-0  ">
							<Modal.Header />
							<Modal.Body>
								<div className="text-center  ">
									<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
									<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
										Are you sure you want to delete this Task?
									</h3>
									<div className="my-8 flex justify-center items-center">
										<Table className="shadow-lg w-auto ">
											<Table.Head className="rounded-md text-md border-b-2 dark:border-gray-500" >
												<Table.HeadCell className="dark:bg-gray-600">Name of Equipment</Table.HeadCell>
												<Table.HeadCell className="dark:bg-gray-600">Nature of Work</Table.HeadCell>
												<Table.HeadCell className="dark:bg-gray-600">Task Category</Table.HeadCell>
											</Table.Head>
											<TableBody className="rounded-md">
												<Table.Row className="font-bold text-black dark:text-white">
													<Table.Cell>{taskName}</Table.Cell>
													<Table.Cell>{categoryValue}</Table.Cell>
													<Table.Cell>{tagValue}</Table.Cell>
												</Table.Row>
											</TableBody>
										</Table>

									</div>
									<div className="flex justify-center gap-4">
										<Button color="failure" onClick={() => handleDeleteButton(taskId)}>
											{"Yes, I'm sure"}
										</Button>
										<Button color="gray" onClick={() => setOpenDeleteModal(false)}>
											No, cancel
										</Button>
									</div>
								</div>
							</Modal.Body>
						</Modal>
					</div>}
				<button type="submit" onClick={() => taskId ? isCreateTaskValid && handleupdateButton() : isCreateTaskValid && handleCreateButton()} className={`text-white flex-inline  items-center ${isCreateTaskValid ? "bg-customSky cursor-pointer  dark:bg-customSky  dark:focus:ring-blue-800 focus:ring-blue-300 focus:ring-4 focus:outline-none  " : "text-white bg-customSkyLight dark:bg-customSkyLight cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"}   font-medium rounded-lg text-sm px-5 py-2.5 text-center `}>{taskId ? "Update Task" : "Create Task"}</button>
			</div>
		</Modal>

	);
};

export default TaskModal;
export { TaskModal };
