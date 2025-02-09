import { Button, Modal, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteContractor, getContractorList } from '../Api/Contractor';
import { setContractorCount, setContractorList, setContractorNextLink, setContractorPreviousLink } from '../Store/contractorSlice';
import { getButtonStyles, handleError } from '../Utility/Utility';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineExclamationCircle, HiPencilAlt } from "react-icons/hi";
import ContractorModal from './ContractorModal';
import { useTheme } from '../Contexts/themeContext';
import ShimmerSmallTable from '../Shimmer/ShimmerSmallTable';



const ContractorList = () => {


    const defaultProject = useSelector((store) => store.projectData.defaultProject);
    const contractorList = useSelector((store) => store.contractorData.contractorList);
    const contractorNextUrl = useSelector((store) => store.contractorData.contractorNextLink);
    const contractorPreviousUrl = useSelector((store) => store.contractorData.contractorPreviousLink);
    const userPermissions = useSelector((store) => store.user.permissions);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [contractorId, setContractorId] = useState(null);
    const [openContractorModal, setOpenContractorModal] = useState(false);

    const setContractorListData = async (url = null) => {
        try {
            const response = await getContractorList(defaultProject.projectId, url);
            const contractorData = response.data?.data;
            dispatch(setContractorList(contractorData));
            dispatch(setContractorNextLink(response.data?.next));
            dispatch(setContractorPreviousLink(response.data?.previous));
            dispatch(setContractorCount(response.data?.count));
        }
        catch (error) {
            handleError(error);
        }

    }
    useEffect(() => {
        defaultProject && setContractorListData();

    }, [defaultProject])


    const handlePreviousButton = () => {
        contractorPreviousUrl && setContractorListData(contractorPreviousUrl);
    }

    const handleNextButton = () => {
        contractorNextUrl && setContractorListData(contractorNextUrl);
    }
    const handleDeleteButton = async () => {
        const response = await deleteContractor(contractorId);
        setContractorListData();
        setOpenDeleteModal(false);
        setContractorId(null);
    }
    const handleOpenContractorModal = () => {
        setOpenContractorModal(true);
        setContractorId(null);
    }
    const handleCloseContractorModal = () => {
        setOpenContractorModal(false);
    }

    return (
        <div className='mx-2 md:mx-1 mt-2 flex  flex-col items-center'>
            <h2 className="text-center text-3xl font-bold dark:text-white m-2">{defaultProject ? defaultProject.name : ""}</h2>


            <div className='relative flex mt-4 mx-4 w-full md:w-8/12  justify-end '>
                {userPermissions && userPermissions.includes("add_contractor") && <button style={getButtonStyles(defaultProject?.bgColor, theme)} className="block py-2 pt-2 px-5 mb-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={handleOpenContractorModal}>Add Contractor</button>}
            </div>
            <div className="relative md:w-8/12  w-full  overflow-x-auto shadow-md sm:rounded-lg mt-2 mx-3">
                {contractorList ? <Table hoverable className="table-auto  shadow-lg dark:shadow-3xl ">

                    <Table.Head className="w-full md:text-md lg:text-lg text-md  xl:text-xl ">
                        <Table.HeadCell className=" w-6/12">Contractor Name</Table.HeadCell>
                        {userPermissions && (userPermissions.includes("change_contractor") || userPermissions.includes("delete_contractor")) && <Table.HeadCell className='w-1/12 text-center'>Action</Table.HeadCell>}

                    </Table.Head>
                    <Table.Body className="text-black md:text-md text-lg lg:text-lg dark:text-gray-300 xl:text-xl " >

                        {contractorList && contractorList.length > 0 ? contractorList.map((contractor) => (

                            <Table.Row key={contractor.id} className='cursor-pointer hover:bg-white dark:hover:bg-gray-800' >
                                <Table.Cell onClick={() => userPermissions && userPermissions.includes("view_attendance") && navigate(`/project/contractor/${contractor.id}`)} className='hover:bg-gray-100 dark:hover:bg-gray-600' >{contractor.name}</Table.Cell>
                                {userPermissions && (userPermissions.includes("change_contractor") || userPermissions.includes("delete_contractor")) && <Table.Cell className='text-center hover:bg-white dark:hover:bg-gray-800 flex justify-center'>
                                    {userPermissions.includes("delete_contractor") && <button onClick={() => { setOpenDeleteModal(true); setContractorId(contractor.id) }} className='bg-red-600 p-1 rounded-md '><HiOutlineTrash className='md:w-6 md:h-6 w-5 h-5 text-white ' /></button>}
                                    {userPermissions.includes("change_contractor") && <button onClick={() => { setOpenContractorModal(true); setContractorId(contractor.id) }} className='bg-gray-400 p-1 rounded-md  mx-2'><HiPencilAlt className='md:w-6 md:h-6 w-5 h-5 text-white ' /></button>}

                                </Table.Cell>}
                                <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className='pt-[200px] md:pt-0 opacity-100'>
                                    <Modal.Header />
                                    <Modal.Body >
                                        <div className="text-center " >
                                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                Are you sure you want to delete this <span className='font-bold dark:text-white'>{contractor.name}</span> Contractor?
                                            </h3>
                                            <div className="flex justify-center gap-4">
                                                <Button color="failure" onClick={() => handleDeleteButton(contractor.id)}>
                                                    {"Yes, I'm sure"}
                                                </Button>
                                                <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                                                    No, cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                </Modal>


                            </Table.Row>))

                            :

                            <Table.Row>
                                <Table.Cell colSpan={2} className="text-center py-4 text-gray-500 pointer-events-none">
                                    No Contractor
                                </Table.Cell>
                            </Table.Row>
                        }


                    </Table.Body>

                </Table> : <ShimmerSmallTable />}
            </div>

            {/* <div className="flex justify-between md:w-8/12 w-full mt-4">

                <span className="text-sm font-normal text-gray-500 dark:text-gray-400   inline w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-{contractorCount < 20 ? contractorCount : 20}</span> of <span className="font-semibold text-gray-900 dark:text-white">{contractorCount}</span></span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 ">
                    <li>
                        <a onClick={handlePreviousButton} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${contractorPreviousUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Previous</a>
                    </li>
                    <li>
                        <a onClick={handleNextButton} className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${contractorNextUrl === null ? "cursor-not-allowed hover:text-gray-400 opacity-50" : "cursor-pointer"}`}>Next</a>
                    </li>
                </ul>

            </div> */}
            {openContractorModal && <ContractorModal openModal={handleOpenContractorModal} closeModal={handleCloseContractorModal} updateContractorList={setContractorListData} contractorId={contractorId} />}
        </div>
    )
}

export default ContractorList