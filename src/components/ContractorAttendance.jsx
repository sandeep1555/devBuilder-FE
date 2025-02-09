import { Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getContractorAttendance } from '../Api/Attendance';
import { getButtonStyles, handleError } from '../Utility/Utility';
import { setContractorAttendanceList, setAttendanceCount, setAttendanceNextLink, setAttendancePreviousLink } from '../Store/attendanceSlice';
import { useParams } from 'react-router-dom';
import AttendanceModal from './AttendanceModal';
import { setErrorList } from '../Store/errorSlice';
import { useTheme } from '../Contexts/themeContext';
import ShimmerSmallTable from '../Shimmer/ShimmerSmallTable';

const ContractorAttendance = () => {

    const defaultProject = useSelector((store) => store.projectData.defaultProject);
    const contractorAttendanceList = useSelector((store) => store.attendanceData.contractorAttendanceList);
    const attendanceNextUrl = useSelector((store) => store.attendanceData.attendanceNextLink);
    const attendancePreviousUrl = useSelector((store) => store.attendanceData.attendancePreviousLink);
    const userPermissions = useSelector((store) => store.user.permissions);
    const params = useParams();
    const contractorId = params.contractorId;
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [attendanceId, setAttendanceId] = useState(null);
    const { theme } = useTheme()

    const setContractorAttendanceData = async (url = null) => {
        try {
            const response = await getContractorAttendance(defaultProject.projectId, contractorId, url);
            const contractorData = response.data.data;
            dispatch(setContractorAttendanceList(contractorData));
            dispatch(setAttendanceNextLink(response.data?.next));
            dispatch(setAttendancePreviousLink(response.data?.previous));
            dispatch(setAttendanceCount(response.data?.count));
        }
        catch (error) {
            handleError(error);
        }
    }



    useEffect(() => {
        defaultProject && setContractorAttendanceData();
    }, [defaultProject])


    const openAttendanceModal = () => {
        setOpenModal(true);
        setAttendanceId(null);
    }

    const closeAttendanceModal = () => {
        setOpenModal(false);
        dispatch(setErrorList(null));
    }

    const handleAttendanceClick = (attendanceId) => {
        openAttendanceModal();
        setAttendanceId(attendanceId);

    }

    const handlePreviousButton = () => {
        attendancePreviousUrl && setContractorAttendanceData(attendancePreviousUrl);
    }

    const handleNextButton = () => {
        attendanceNextUrl && setContractorAttendanceData(attendanceNextUrl);
    }

    return (
        <div className='mx-1 mt-2'>
            <h2 className="text-center text-3xl font-bold dark:text-white m-2">{defaultProject ? defaultProject.name : ""}</h2>
            <div className='relative flex my-4 mx-4   justify-end '>
                {userPermissions && userPermissions.includes("add_attendance") && <button style={getButtonStyles(defaultProject?.bgColor, theme)} className="block py-2 pt-2 px-5 mb-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={openAttendanceModal}>Add Attendance</button>}
            </div>


            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2 mx-3  ">
                {contractorAttendanceList ? <Table hoverable className="table-auto w-full shadow-lg dark:shadow-3xl">

                    <Table.Head className="w-full md:text-md lg:text-lg text-md  xl:text-xl ">
                        <Table.HeadCell className="text-center w-3/12">Date</Table.HeadCell>
                        <Table.HeadCell className="text-center px-2 w-3/12">Number of Labour</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="text-black md:text-md text-lg lg:text-lg dark:text-gray-300  xl:text-xl " >

                        {contractorAttendanceList && (contractorAttendanceList.length > 0 ? contractorAttendanceList.map(attendance =>
                        (
                            <Table.Row key={attendance.id} onClick={() => userPermissions && userPermissions.includes("change_attendance") && handleAttendanceClick(attendance.id)} className='cursor-pointer' >
                                <Table.Cell className='text-center'>{attendance.date.split('T')[0]}</Table.Cell>
                                <Table.Cell className='text-center'>{attendance.labour_count}</Table.Cell>

                            </Table.Row>
                        )
                        )
                            :

                            <Table.Row>
                                <Table.Cell colSpan={2} className="text-center py-4 text-gray-500 pointer-events-none">
                                    No Attendance
                                </Table.Cell>
                            </Table.Row>)
                        }

                    </Table.Body>

                </Table> : <ShimmerSmallTable />}
            </div>

            {/* <div className="m-2 md:m-1 w-auto flex  justify-between items-center pt-1 md:px-2 px-1">

                <span className="text-sm font-normal text-gray-500 dark:text-gray-400   inline w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-{attendanceCount < 20 ? attendanceCount : 20}</span> of <span className="font-semibold text-gray-900 dark:text-white">{attendanceCount}</span></span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 ">
                    <li>
                        <a onClick={handlePreviousButton} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${attendancePreviousUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Previous</a>
                    </li>
                    <li>
                        <a onClick={handleNextButton} className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${attendanceNextUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Next</a>
                    </li>
                </ul>

            </div> */}


            {openModal && <AttendanceModal openModal={openAttendanceModal} closeModal={closeAttendanceModal} attendanceId={attendanceId} contractorId={contractorId} updateAttendance={setContractorAttendanceData} />}
        </div>
    )
}

export default ContractorAttendance