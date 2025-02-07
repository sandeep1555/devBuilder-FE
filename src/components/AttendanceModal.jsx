import { Button, Datepicker, Modal } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { convertDateToDatePickerFormat, convertDateToDDMMYYYY, formatDateToISO, getTodayDate, handleApiErrors } from '../Utility/Utility'
import { createContractorAttendance, deleteContractorAttendance, updateContractorAttendance } from '../Api/Attendance'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { removeErrorList, setErrorList } from '../Store/errorSlice'

const AttendanceModal = ({ openModal, closeModal, contractorId, attendanceId, updateAttendance }) => {


    const defaultProject = useSelector((store) => store.projectData.defaultProject);
    const userPermissions = useSelector((store) => store.user.permissions);
    const attendanceList = useSelector(store => store.attendanceData.contractorAttendanceList);
    const errorList = useSelector(store => store.error.errorList);

    const selectedAttendance = attendanceList && attendanceList.filter(attendance => attendance.id === attendanceId)[0];
    const [date, setDate] = useState(attendanceId ? (selectedAttendance && convertDateToDDMMYYYY(selectedAttendance.date.split("T")[0])) : getTodayDate());
    const [labourCount, setLabourCount] = useState(attendanceId ? (selectedAttendance && selectedAttendance.labour_count) : "");
    const [isOpen, setIsOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {

        const closeDropdown = e => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsOpen(false);

            }

        }
        document.body.addEventListener('mousedown', closeDropdown)
        return () => document.body.removeEventListener('mousedown', closeDropdown)


    }, [])


    const handleSubmitButton = async () => {
        dispatch(removeErrorList());

        const convertDate = convertDateToDatePickerFormat(date);


        try {

            const response = await createContractorAttendance(Number(defaultProject.projectId), Number(contractorId), convertDate, Number(labourCount));
            closeModal();
            updateAttendance();

        }
        catch (error) {
            handleApiErrors(error, dispatch, setErrorList);
        }
    }


    const handleUpdateButton = async () => {

        dispatch(removeErrorList());
        console.log(date)
        const convertDate = convertDateToDatePickerFormat(date);
        console.log(convertDate)
        try {
            const response = await updateContractorAttendance(Number(defaultProject.projectId), Number(contractorId), Number(attendanceId), convertDate, Number(labourCount));
            closeModal();
            updateAttendance();
        }
        catch (error) {
            handleApiErrors(error, dispatch, setErrorList);
        }
    }
    const handleDeleteButton = async () => {
        dispatch(removeErrorList());
        try {
            const response = await deleteContractorAttendance(contractorId, attendanceId)
            setOpenDeleteModal(false);
            updateAttendance();
            closeModal();
        }
        catch (error) {
            handleApiErrors(error, dispatch, setErrorList);
        }
    }


    return (
        <div >
            <Modal dismissible show={openModal} onClose={closeModal} className='pt-[100px] md:pt-0' >
                <Modal.Header>Attendance</Modal.Header>
                <Modal.Body >
                    <div className={`"space-y-6 ${isOpen && "md:h-[600px] h-[600px]"}`}  >


                        <div className='mb-4'>
                            <label htmlFor="numberOfLabour" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number Of Labour</label>
                            <input className="dark:bg-gray-600 w-full rounded-md dark:text-gray-200 bg-gray-50 dark:placeholder-gray-400 border-gray-300 dark:border-gray-500" type='number' value={labourCount} onChange={(e) => { setLabourCount(e.target.value); dispatch(removeErrorList()) }} />
                            {errorList && <p className="ml-1 mt-2 text-red-500">{errorList.labour_count}</p>}
                        </div>

                        <div ref={modalRef} className='relative mb-4'>
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">Date</label>
                            <Datepicker class="dark:bg-gray-600 w-full   max-h-[100px]  rounded-md px-10 dark:text-gray-200 bg-gray-50 dark:placeholder-gray-400 border-gray-300 dark:border-gray-500" onClick={() => setIsOpen(true)} autoHide={true} minDate={!selectedAttendance && new Date()} id="date" name="start_date" onSelectedDateChanged={(date) => { console.log(date); const Date = formatDateToISO(date); setDate(Date); setIsOpen(false); dispatch(removeErrorList()) }} value={date} placeholder="YYYY-MM-DD" />
                            {errorList && <p className="ml-1 mt-2 text-red-500">{errorList.date}</p>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer  >
                    <div className={` ${errorList && (errorList.global || errorList.non_field_errors ? "block" : "hidden")}`}>
                        <p className={`text-red-500 `}>{errorList && errorList.global}</p>
                        {errorList && <p className="ml-1 mt-2 text-red-500">{errorList.non_field_errors}</p>}
                    </div>
                    {userPermissions && userPermissions.includes("delete_attendance") &&

                        <div className={`flex  ${userPermissions.includes("delete_attendance") ? "justify-between" : "justify-end"}`} >
                            <div>
                                {attendanceId && <Button onClick={() => setOpenDeleteModal(true)} color="failure">Delete</Button>}
                            </div>

                            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className='pt-[250px] md:pt-0' >
                                <Modal.Header />
                                <Modal.Body>
                                    <div className="text-center">
                                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                            Are you sure you want to delete this Attendance?
                                        </h3>
                                        <div className="flex justify-center gap-4">
                                            <Button color="failure" onClick={handleDeleteButton}>
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

                    <div className='flex  justify-end w-full'>

                        <Button className='mr-3' color="gray" onClick={closeModal}>Cancel</Button>
                        <Button disabled={selectedAttendance ? ((selectedAttendance.date != date || selectedAttendance.labour_count != labourCount && labourCount != "") ? false : true) : (labourCount ? false : true)} color="blue" onClick={selectedAttendance ? handleUpdateButton : handleSubmitButton}>
                            {selectedAttendance ? "Update" : "Submit"}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AttendanceModal