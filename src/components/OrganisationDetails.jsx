import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editOrganisationDetails, getOrgsanisationDetail } from '../Api/Organisation';
import { setOrganisation } from '../Store/organisationSlice';
import { handleError } from '../Utility/Utility';

const OrganisationDetails = () => {
    const organisation = useSelector((store) => store.organisationData.organisationDetail);
    const dispatch = useDispatch();
    const initialState = {
        name: organisation?.name || '',
        logo: organisation?.logo || '',
        address: organisation?.address1 || '',
        city: organisation?.city || '',
        stateName: organisation?.state || '',
        country: organisation?.country || '',
        zipcode: organisation?.zip || ''
    };

    const [formData, setFormData] = useState(initialState);
    const [isEdited, setIsEdited] = useState(false);

    // Function to update form fields and track changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedForm = { ...prev, [name]: value };
            setIsEdited(JSON.stringify(updatedForm) !== JSON.stringify(initialState));
            return updatedForm;
        });
    };

    const handleEditOrganisationDetails = async () => {
        try {
            const response = await editOrganisationDetails(
                organisation._id,
                formData.name,
                formData.logo,
                formData.address,
                formData.stateName,
                formData.city,
                formData.country,
                formData.zipcode
            );
            console.log(response);
            setIsEdited(false); // Reset edit state after successful update
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        if (organisation) {
            setFormData({
                name: organisation.name || '',
                logo: organisation.logo || '',
                address: organisation.address1 || '',
                city: organisation.city || '',
                stateName: organisation.state || '',
                country: organisation.country || '',
                zipcode: organisation.zip || ''
            });
        }
    }, [organisation]);




    const loadOrganisationDetail = async () => {
        try {
            const response = await getOrgsanisationDetail();
            dispatch(setOrganisation(response.data[0]));

        } catch (error) {
            handleError(error);
        }
    };


    useEffect(() => {
        !organisation && loadOrganisationDetail()
    }, [])


    return (
        <div className="m-4 p-4 border-2">
            <h1 className="text-center text-2xl font-bold mb-10 dark:text-white">Organisation Details</h1>
            {organisation && (
                <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto w-full">
                    {Object.keys(initialState).map((field, index) => (
                        <div className="relative z-0 w-full mb-5 group" key={index}>
                            <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>

                            <input
                                value={formData[field]}
                                onChange={handleChange}
                                type="text"
                                name={field}
                                id={field}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required
                            />

                        </div>
                    ))}
                    <button
                        onClick={handleEditOrganisationDetails}
                        className={`btn md:ml-[12.5vw] ml-[15vh] mt-4 ${isEdited ? 'bg-blue-500' : 'opacity-70 cursor-not-allowed'}`}
                        disabled={!isEdited}
                    >
                        Edit
                    </button>
                </form>
            )}
        </div>
    );
};

export default OrganisationDetails;




