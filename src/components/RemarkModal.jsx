import { Button, Modal, Spinner } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react'
import { HiCheck, HiX, HiOutlineExclamationCircle } from "react-icons/hi";
import { createCommentApi, deleteCommentApi, getCommentListApi, updateCommentApi } from '../Api/Comment';
import { formatDateStringForComment, getInitials, handleError } from '../Utility/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { setCommentCount, setCommentList, setCommentNextLink, setCommentPreviousLink } from '../Store/commentdataSlice';

const RemarkModal = ({ closeModal, openModal, taskid }) => {

	//store
	const userName = useSelector(store => store.user.userDetails);
	const comments = useSelector((store) => store.commentData.commentList);
	const taskNextUrl = useSelector((store) => store.commentData.nextLink);
	const taskPreviousUrl = useSelector((store) => store.commentData.previousLink);

	const dispatch = useDispatch();
	const userFullName = userName.first_name + " " + userName.last_name;
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [editCommentId, setEditCommentId] = useState(null);
	const [editedComment, setEditedComment] = useState('');
	const [newComment, setNewComment] = useState("");
	const commentRef = useRef(null);
	const [updatedCommentId, setUpdatedCommentId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	//commentList
	const getTaskCommentList = async (url = null) => {
		try {

			const response = await getCommentListApi(taskid, url);
			const commentList = response.data?.data;
			dispatch(setCommentList(commentList));
			dispatch(setCommentNextLink(response.data?.next));
			dispatch(setCommentPreviousLink(response.data?.previous));
			dispatch(setCommentCount(response.data?.count));
		}
		catch (error) {
			handleError();
		}


	}

	useEffect(() => {
		getTaskCommentList();
	}, [])


	const handleEditButton = (comment) => {
		setIsEdit(true);
		setEditCommentId(comment.id);
		setEditedComment(comment.description);
	}


	//Delete Comment
	const handleDeleteButton = async (commentId) => {
		try {

			const response = await deleteCommentApi(taskid, commentId)
			getTaskCommentList();
			setOpenDeleteModal(false);
		}
		catch (error) {
			handleError(error);
		}

	}

	//create Comment
	const handleAddCommentButton = async () => {


		try {
			setIsLoading(true);
			const response = await createCommentApi(taskid, newComment)
			getTaskCommentList();
			setNewComment("");

		}
		catch (error) {
			handleError(error);
		}
		finally {
			setIsLoading(false);
		}

	}

	//Edit Comment 
	const handleUpdateCommentButton = async (commentId) => {
		try {

			const response = await updateCommentApi(taskid, commentId, editedComment);
			getTaskCommentList();
			setIsEdit(false);
		}
		catch (error) {
			handleError(error)
		}

	}

	//pagination
	const handlePreviousButton = () => {
		taskPreviousUrl && getTaskCommentList(taskPreviousUrl);
	}

	const handleNextButton = () => {
		taskNextUrl && getTaskCommentList(taskNextUrl);
	}


	//close edit input
	useEffect(() => {

		const closeDropdown = e => {
			if (commentRef.current && !commentRef.current.contains(e.target)) {
				setIsEdit(false);

			}

		}
		document.body.addEventListener('mousedown', closeDropdown)
		return () => document.body.removeEventListener('mousedown', closeDropdown)


	}, [])

	return (

		<Modal dismissible show={openModal} onClose={closeModal} className='pt-[200px] md:pt-0'>
			<Modal.Header>Remarks</Modal.Header>
			<Modal.Body>
				<div className="space-y-6" >

					<div className='w-full flex  h-auto '>
						<textarea className='w-9/12 md:w-10/12 rounded-md min-h-[40px] dark:text-white dark:bg-gray-600 ' onKeyDown={(e) => e.key === 'Enter' && handleAddCommentButton()} onChange={(e) => setNewComment(e.target.value)} type='text' value={newComment} placeholder='Add a remark' />
						<Button disabled={newComment === ""} className={`mx-2 md:w-2/12 w-3/12 h-[40px]`} onClick={handleAddCommentButton} color={"blue"}>{isLoading ? <Spinner color="gray" aria-label="Gray spinner example" /> : "add"}</Button>
					</div>

					{comments && comments.map((comment) => (
						<div key={comment.id} className='flex bg-gray-50 p-2 rounded-md dark:bg-gray-600 dark:text-gray-300'>
							<div className='mt-1'>
								<span className="border rounded-full p-2 bg-blue-500 text-white mx-2 text-sm font-mono">{getInitials(comment.author)}</span>
							</div>
							<div className='w-full mt-1 '>
								<div className='flex items-center'>
									<p className='font-medium'>{comment.author}</p>
									<p className='mx-2 text-xs font-light text-gray-500 dark:text-gray-300'> {formatDateStringForComment(comment.added_at)}</p>
								</div>
								{isEdit && comment.id === editCommentId ? <div ref={commentRef} className='flex items-center w-full'>
									<textarea className='p-0 my-[6px] md:mr-2 mr-1 rounded-md py-1 px-2  md:w-10/12 w-full dark:text-white dark:bg-gray-700 ' type='text' value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
									<button disabled={comment.description === editedComment} onClick={() => handleUpdateCommentButton(comment.id)} className='md:mx-2 mx-1 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 rounded-md p-1 md:px-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-gray-200'><HiCheck className='w-6 h-6' /></button>
									<button className='mx-1 md:mx-2 bg-gray-200 p-1 md:px-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 rounded-md  ' onClick={() => setIsEdit(false)}><HiX className='w-6 h-6' /></button></div>
									: <p className='my-[6px]'>{comment.description}</p>}
								<div className='flex '>
									<button disabled={comment.author != userFullName} className={`mr-2 hover:text-blue-500 hover:underline disabled:hidden ${isEdit && comment.id === editCommentId ? "opacity-0" : "block"}`} onClick={() => handleEditButton(comment)}>Edit</button>
									<button disabled={comment.author != userFullName} className='hover:text-red-500 hover:underline disabled:hidden' onClick={() => { setOpenDeleteModal(true); setUpdatedCommentId(comment.id) }}>Delete</button>
									<Modal className='bg-gray-800 bg-opacity-10 md:pt-0 pt-[200px]' show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
										<Modal.Header />
										<Modal.Body>
											<div className="text-center">
												<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
												<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
													Are you sure you want to delete this Remark?
												</h3>
												<div className="flex justify-center gap-4">
													<Button color="failure" onClick={() => handleDeleteButton(updatedCommentId)}>
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
							</div>
						</div>
					))}

					{/* <div className="m-2 md:m-1 w-full">
						<nav className="flex justify-between items-center md:mr-1 mr-2">
							<span className="text-sm font-normal text-gray-500 dark:text-gray-400   inline w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-{taskCount < 20 ? taskCount : 20}</span> of <span className="font-semibold text-gray-900 dark:text-white">{taskCount}</span></span>
							<ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 ">
								<li>
									<a onClick={handlePreviousButton} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${taskPreviousUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Previous</a>
								</li>
								<li>
									<a onClick={handleNextButton} className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${taskNextUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Next</a>
								</li>
							</ul>
						</nav>
					</div> */}

				</div>
			</Modal.Body>
			<Modal.Footer className='flex justify-center py-6 border-0'>
			</Modal.Footer>
		</Modal>

	)
}

export default RemarkModal