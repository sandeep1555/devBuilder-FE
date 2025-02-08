import { Table } from 'flowbite-react'
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getButtonStyles, handleError } from '../Utility/Utility';
import { getaggregateListApi, updatetaskListOrder } from '../Api/Task';
import { setAggregateList } from '../Store/taskdataSlice';
import TaskModal from './TaskModal';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useTheme } from '../Contexts/themeContext';

const AggregateTaskContainer = () => {


    const role = useSelector(store => store.user.group);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const defaultProject = useSelector((store) => store.projectData.defaultProject);
    const aggregateList = useSelector(store => store.taskData.aggregateList);
    const [originalList, setOriginalList] = useState(null);
    const userPermissions = useSelector((store) => store.user.permissions);

    const [searchText, setSearchText] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const containerRef = useRef(null);


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
    useEffect(() => {
        defaultProject && getAggregateList();
    }, [defaultProject]);

    const handleSearchText = () => {
        const filterList = originalList && originalList.filter(task => task.name.toLowerCase().includes(searchText.toLowerCase()));
        dispatch(setAggregateList(filterList))
    }

    useEffect(() => {
        handleSearchText();
    }, [searchText, originalList])


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleOpenCreateTask = () => {

        setOpenModal(true)

    }

    const handleCloseCreateTask = () => {
        setOpenModal(false);
        getAggregateList();
    }


    // const updateAggregateList=async(updatedList)=>
    // {
    //     try {

    // 		const taskOrderData = updatedList.map((task, index) => ({

    // 			id: task.id,
    // 			orderId: index + 1,
    // 		}));
    // 		await updateAggregateListOrder(taskOrderData);


    // 	} catch (error) {

    // 		console.error("Error saving task order:", error);
    // 	} 
    // }


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

        // If the item was dropped outside the list or at the same position, do nothing
        if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
            return;
        }

        // Create a copy of the taskList to manipulate
        const updatedTaskList = Array.from(aggregateList);

        // Remove the dragged item from its source position
        const [movedTask] = updatedTaskList.splice(source.index, 1);

        // Insert the dragged item at the destination position
        updatedTaskList.splice(destination.index, 0, movedTask);

        // Dispatch the updated list to the Redux store
        dispatch(setAggregateList(updatedTaskList));
        saveTaskOrder(updatedTaskList)


    }

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

    return (
        <div ref={containerRef} className='mx-1 mt-2'>
            <h2 className="text-center text-3xl font-bold dark:text-white m-2">{defaultProject ? defaultProject.name : ""}</h2>
            <div className='relative flex flex-row   md:flex my-4 mx-3 justify-between   md:justify-between '>
                <input className="relative rounded-md px-4  p-2 md:w-3/12 w-7/12   dark:bg-gray-800 dark:text-white " type="text" value={searchText} placeholder="Search Task..." onChange={(e) => setSearchText(e.target.value)} />
                {userPermissions && userPermissions.includes("add_task") && <button style={getButtonStyles(defaultProject?.bgColor, theme)} className="block py-2 pt-2 md:w-[120px] w-[120px] px-5 mb-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={handleOpenCreateTask}>Add Task</button>}
            </div>

            <DragDropContext onDragEnd={(results) => handleDragEnd(results)} onDragUpdate={handleDragUpdate} >
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2 mx-3 b  ">
                    <Table hoverable className="table-auto w-full shadow-lg dark:shadow-3xl ">

                        <Table.Head className="w-full md:text-md lg:text-lg text-md  xl:text-xl  ">
                            <Table.HeadCell className="w-3/12">Name of Equipment</Table.HeadCell>
                            <Table.HeadCell className="text-center px-2 w-3/12 ">Avg Completed Quantity</Table.HeadCell>
                        </Table.Head>
                        <Droppable droppableId="taskListDroppable" direction="vertical" className="overflow-y-scroll">
                            {(provided) => (<Table.Body ref={provided.innerRef} {...provided.droppableProps} className="text-black md:text-md text-lg lg:text-lg  xl:text-xl " >

                                {aggregateList && (aggregateList.length > 0 ? aggregateList.map((task, index) =>
                                (
                                    <Draggable draggableId={task.name} index={index} key={task.name}>
                                        {(provided) => (<Table.Row ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => navigate((role === "ROLE_OWN" || role === "ROLE_PROJECT_MANAGER") ? "details/" + task.name : "/project/task/detail/" + task.name)} className='border-b border-b-gray-300 dark:text-gray-400 cursor-pointer '>
                                            <Table.Cell>{task.name}</Table.Cell>
                                            <Table.Cell className='text-center'>{task.average_progress_percentage}</Table.Cell>
                                        </Table.Row>)}
                                    </Draggable>

                                )) :

                                    <Table.Row>
                                        <Table.Cell colSpan={2} className="text-center py-4 text-gray-500 pointer-events-none">
                                            No tasks available
                                        </Table.Cell>
                                    </Table.Row>)}
                                {provided.placeholder}
                            </Table.Body>)}
                        </Droppable>

                    </Table>
                </div>
            </DragDropContext>

            {openModal && <TaskModal openModal={handleOpenCreateTask} closeModal={handleCloseCreateTask} />}

        </div>
    )
}

export default AggregateTaskContainer