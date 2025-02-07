import { Button, Modal } from 'flowbite-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleApiErrors } from '../Utility/Utility';
import { createContractor, updateContractor } from "../Api/Contractor"
import { setErrorList } from '../Store/errorSlice';
const ContractorModal = ({ openModal, closeModal, updateContractorList, contractorId }) => {

    const defaultProject = useSelector((store) => store.projectData.defaultProject);
    const contractorList = useSelector((store) => store.contractorData.contractorList);
    const errorList = useSelector(store => store.error.errorList);
    const selectedContractor = contractorList && contractorList.filter(contractor => contractor.id === contractorId)[0];
    const [contractorName, setContractorName] = useState(contractorId ? (selectedContractor ? selectedContractor.name : "") : "");
    const dispatch = useDispatch();
    const handleCreateButton = async () => {
        try {
            const response = await createContractor(contractorName, defaultProject.projectId);
            updateContractorList();
            closeModal();
        }
        catch (error) {
            handleApiErrors(error, dispatch, setErrorList);
        }
    }


    const handleUpdateButton = async () => {
        try {

            const response = await updateContractor(contractorId, contractorName);
            updateContractorList();
            closeModal();
        }
        catch (error) {
            handleApiErrors(error, dispatch, setErrorList);
        }
    }
    return (
        <div>
            <Modal dismissible show={openModal} onClose={closeModal} className='pt-[200px] md:pt-0'>
                <Modal.Header>Contractor</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">

                        <div className="col-span-2">
                            <label htmlFor="ContractorName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contractor Name</label>
                            <input type="text" name="Contractorname" id="ContractorName" onChange={(e) => setContractorName(e.target.value)} value={contractorName} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`} placeholder="Contractor Name" />
                            {errorList && <p className="ml-1 mt-2 text-red-500">{errorList.name}</p>}

                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer className=''>

                    <div className={`${errorList && (errorList.global || errorList.non_field_errors ? "block" : "hidden")}`}>
                        {errorList && <p className={`text-red-500 `}>{errorList.global}</p>}
                        {errorList && <p className="ml-1 mt-2 text-red-500">{errorList.non_field_errors}</p>}
                    </div>

                    <div className='flex justify-end w-full'>
                        <Button className='mx-4' color="gray" onClick={closeModal}>Cancel</Button>
                        <Button disabled={contractorId ? ((contractorName != selectedContractor.name && contractorName != "") ? false : true) : (contractorName == "" ? true : false)} color="blue" onClick={contractorId ? handleUpdateButton : handleCreateButton}>
                            {contractorId ? "Update" : "Create"}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ContractorModal