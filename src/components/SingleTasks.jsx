import { Table } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCommentList } from '../Store/commentdataSlice';
import RemarkModal from "./RemarkModal";
// import { getassigneeInitials } from "../Utility/Utility";

const SingleTasks = React.forwardRef(({ onClick, progress, taskid, name, category, bgColor, maxProgress, unit, border, tag, rowSpans, latestComment, updatedTaskList, ...props }, ref) => {

	const dispatch = useDispatch();
	const [openModal, setOpenModal] = useState(false);
	const setcloseRemarkModal = () => {
		setOpenModal(false);
		dispatch(setCommentList(null));
		updatedTaskList();
	}

	const setOpenRemarkModal = () => {
		setOpenModal(true);
	}
	// const assigneeInitials = assignee && getassigneeInitials(assignee.full_name);
	return (
		<>
			<Table.Row ref={ref} onClick={onClick} key={taskid} {...props} className={`cursor-pointer ${border} group text-black dark:text-gray-200 w-full`}>
				{rowSpans > 0 && (<Table.Cell className="text-center border-r pointer-events-none w-3/12 " rowSpan={rowSpans}>{name}</Table.Cell>)}
				<Table.Cell className={`text-center px-2 w-2/12 ${bgColor} ${border}`}>{category ? category : ""}</Table.Cell>
				<Table.Cell className={`text-center w-2/12 px-4 border-b ${bgColor} ${border}`}>{tag}</Table.Cell>
				<Table.Cell className={`text-center px-2 border-b w-2/12  ${bgColor} ${border}`} >{progress !== "" ? (progress + " / " + maxProgress + " " + unit) : ("0" + " / " + maxProgress + " " + unit)}</Table.Cell>
				<Table.Cell className=" pointer-events-none max-w-2/12 mx-2 text-center px-2 border-l   " onClick={(e) => e.stopPropagation()}>
					<span className="truncate-1-lines  pointer-events-none ">{latestComment}</span>
					<button className="text-blue-500 underline pointer-events-auto " onClick={(e) => { e.stopPropagation(); setOpenModal(true) }}>{latestComment ? "See All" : "Add Remark"}</button>

				</Table.Cell>

				{/* <Table.Cell className="text-center">{assigneeInitials}</Table.Cell> */}

			</Table.Row >

			{openModal && <RemarkModal closeModal={setcloseRemarkModal} openModal={setOpenRemarkModal} taskid={taskid} />}

		</>

	);
});
SingleTasks.displayName = "SingleTasks";

export default SingleTasks;
