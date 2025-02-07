import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, setUserGroup, setUserPermissions } from '../Store/userSlice';
import { editUserDetails, getUserDetailsApi } from '../Api/User';
import { handleError } from '../Utility/Utility';

const ViewProfile = () => {
    const userDetails = useSelector((store) => store.user.userDetails);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    const initialState = {
        firstName: userDetails?.firstName || '',
        lastName: userDetails?.lastName || '',
        emailId: userDetails?.emailId || '',
        group: userDetails?.group || '',
    };

    const [formData, setFormData] = useState(initialState);
    const [isEdited, setIsEdited] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedForm = { ...prev, [name]: value };
            setIsEdited(JSON.stringify(updatedForm) !== JSON.stringify(initialState));
            return updatedForm;
        });
    };

    const handleGroupChange = (e) => {
        const newGroup = e.target.value;
        setFormData((prev) => {
            const updatedForm = { ...prev, group: newGroup };
            setIsEdited(JSON.stringify(updatedForm) !== JSON.stringify(initialState));
            return updatedForm;
        });
    };

    const handleEditUserDetails = async () => {
        try {
            const response = await editUserDetails(
                userDetails._id,
                formData.firstName,
                formData.lastName,
            );
            const userDetailData = response.data?.data;
            setMessage(response?.data?.message);
            dispatch(setUserDetails(userDetailData));
            dispatch(setUserGroup(userDetailData.group));
            dispatch(setUserPermissions(userDetailData.userPermission));
            setIsEdited(false); // Reset edit state after successful update
            setTimeout(() => {
                setMessage("")
            }, 5000)

        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        if (userDetails) {
            setFormData({
                firstName: userDetails?.firstName || '',
                lastName: userDetails?.lastName || '',
                emailId: userDetails?.emailId || '',
                group: userDetails?.group || '',
            });
        }
    }, [userDetails]);

    const getUserDetails = async () => {
        const response = await getUserDetailsApi();
        const userDetails = response.data?.data;
        dispatch(setUserDetails(userDetails));
        dispatch(setUserGroup(userDetails.group));
        dispatch(setUserPermissions(userDetails.userPermission));
    };

    useEffect(() => {
        !userDetails && getUserDetails();
    }, []);

    return (
        <div className="m-4 p-4 border-2">
            <h1 className="text-center text-2xl font-bold mb-10 dark:text-white">User Details</h1>
            {userDetails && (
                <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto w-full">
                    {['firstName', 'lastName'].map((field, index) => (
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John"
                                required
                            />
                        </div>
                    ))}

                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="emailId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>

                        <input
                            value={formData.emailId}
                            onChange={handleChange}
                            type="email"
                            name="emailId"
                            id="emailId"
                            className="bg-gray-50  opacity-60 hover:cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="example@domain.com"
                            disabled
                            title='cant Change Email'
                            required
                        />
                    </div>

                    <label htmlFor="userGroup" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Role</label>
                    <select disabled title='you cant change the role'
                        id="userGroup"
                        onChange={handleGroupChange}
                        value={formData.group}
                        className="block py-2.5  hover:cursor-not-allowed px-0 w-full text-sm text-gray-500 mb-5 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer "
                    >
                        <option value="">Choose User Type</option>
                        <option value="ROLE_PROJECT_SUPERVISOR">Supervisor</option>
                        <option value="ROLE_OWN">Owner</option>
                        <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
                    </select>

                    {message && <p className='text-blue-500'>{message}</p>}

                    <button
                        onClick={handleEditUserDetails}
                        className={`px-4 py-2 bg-customSky text-white rounded-md md:ml-[12.5vw] ml-[15vh] mt-4 ${isEdited ? 'bg-blue-500' : 'opacity-70 cursor-not-allowed'}`}
                        disabled={!isEdited}
                    >
                        Edit
                    </button>
                </form>
            )}
        </div>
    );
};

export default ViewProfile;
