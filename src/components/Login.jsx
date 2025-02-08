import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/authContext';
import { useDispatch, useSelector } from 'react-redux';
import { removeErrorList, setErrorList } from '../Store/errorSlice';
import { MdErrorOutline } from "react-icons/md";
import { login, signUp } from '../Api/User';
import { Typewriter } from 'react-simple-typewriter';
const Login = () => {


    const [isLoginPage, setIsLoginPage] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [group, setGroup] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { logIn } = useAuth();
    const dispatch = useDispatch();


    const errorList = useSelector(store => store.error.errorList);

    const handleLoginButton = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(email, password);
            if (response.status === 200) {
                const access_token = response.data?.access_token;

                const token_expire_time = response.data?.token_expire_time;

                const role = response.data?.role;
                logIn(access_token, token_expire_time, role);
                navigate("/project");
                setLoading(false);
                dispatch(removeErrorList());
            }


        }

        catch (error) {


            const errorResponse = error.response.data.errors;
            dispatch(setErrorList(errorResponse));

        }
        finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (password !== confirmPassword) {

                dispatch(setErrorList("Passwords do not match!"))
                return

            }
            const response = await signUp(firstName, lastName, email, password, group);
            if (response.status === 200) {
                const access_token = response.data?.access_token;

                const token_expire_time = response.data?.token_expire_time;

                const role = response.data?.role;

                logIn(access_token, token_expire_time, role);
                navigate("/project");
                setLoading(false);
                dispatch(removeErrorList());
            }

        } catch (error) {
            const errorResponse = error.response.data.errors;
            dispatch(setErrorList(errorResponse));
        }
        finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/project");
        }
        else {
            navigate("/");
        }
    }, [])



    return (
        <div className='h-screen'>
        <div className={`md:flex    md:justify-around  dark:bg-gray-800    md:mt-[25vh]  md:pt-0 ${isLoginPage ? "mt-[10vh]" : "mt-[4vh]"} `}>

         <div className='block md:hidden my-4 '>
        <h1 className='font-bold text-xl ml-[25vw] uppercase  typist my-3 mb-3  dark:text-white'>Streamline your construction site,
                    
                    </h1>
                    <span  className=' text-white  ml-[100px]  bg-customSky px-4 py-2  font-bold text-lg italic typist shadow-xl'><Typewriter 
                            words={['#Manage Tasks.....','#Add Remarks.....', '#Track Attendance.....']}
                            loop={15}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        /></span>
                        </div>
           

            <div className='flex  justify-center items-center   '>

                <div className='flex flex-col justify-center items-center bg-stone-50 opacity-90  border-gray-200 dark:bg-gray-900 dark:border-gray-700 md:w-[450px] w-[350px]   md:m-2 m-1 md:p-10 p-6  rounded-md shadow-md   '>
                    <h1  className='text-3xl text-customSky mb-10 '>{isLoginPage ? "Log In" : "Sign Up"}</h1>


                    <form className="max-w-md mx-auto w-full">
                        {!isLoginPage && <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label  htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" name="floating_last_name" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                            </div>
                        </div>}
                        <div className="relative z-0 w-full mb-5 group">
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        </div>
                        {!isLoginPage && <>
                            <div className="relative z-0 w-full mb-5 group">
                                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                            </div>


                            <label htmlFor="underline_select" className="sr-only">Underline select</label>
                            <select id="underline_select" onChange={(e) => setGroup(e.target.value)} value={group} className="block py-2.5 px-0 w-full text-sm text-gray-500 mb-5 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                <option selected>Choose User Type</option>
                                <option value="ROLE_PROJECT_SUPERVISOR">Supervisor</option>
                                <option value="ROLE_OWN">Owner</option>
                                <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
                            </select>

                        </>}
                        {errorList && <p className='text-red-500 flex items-center '><MdErrorOutline className='mr-2' />{errorList}</p>}
                        <div className='flex flex-col justify-center items-center mt-10'>
                            <button  disabled={loading} type="submit" onClick={(e) => isLoginPage ? handleLoginButton(e) : handleSignUp(e)} className={`mb-4 text-white  bg-customSky hover:bg-customSky focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 ${loading ? " py-2" : "py-2.5"} text-center dark:bg-customSky dark:hover:bg-customSky dark:focus:ring-blue-800`}>{isLoginPage ? (loading ? <div role="status">
                                <svg aria-hidden="true" className="w-9 h-6 ml-[29vw] md:ml-0 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 dark:fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                <span className="sr-only">Loading...</span>
                            </div> : "Log In") : (loading ? <div role="status">
                                <svg aria-hidden="true" className="w-9 h-6 ml-[29vw] md:ml-0 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 dark:fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                <span className="sr-only">Loading...</span>
                            </div> : "Sign Up")}</button>



                            <p className='dark:text-white'>{isLoginPage ? "new User, " : "already have account, "}<a className='underline cursor-pointer text-customSky ' onClick={() => { setIsLoginPage(!isLoginPage), setEmail(""); setPassword(""); setConfirmPassword(""); setFirstName(""); setLastName(""); setGroup(""); dispatch(removeErrorList()) }}>{isLoginPage ? "Sign Up" : "Log In"}</a></p>
                        </div>


                    </form>



                </div>
            </div>




            <div className='md:flex md:flex-col  hidden  items-center'>
                <div>
                <img className='w-[500px] h-[250px]  dark:md:block  hidden' src="assets/devbuilder-dark.PNG" />
                <img className='w-[500px] h-[250px] dark:hidden md:block  hidden' src="assets/devduilder-light.PNG" />
                </div>
                <div>
                <h1 className='font-bold text-4xl uppercase  typist my-3 mb-5 dark:text-white'>Streamline your construction site,
                    
                    </h1>
                    <span  className=' text-white bg-customSky px-4 py-2  font-bold text-3xl italic typist shadow-xl'><Typewriter 
                            words={['#Manage Tasks.....', '#Track Attendance.....','#Add Remarks.....']}
                            loop={10}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        /></span>
    </div>
                
            </div>



        </div>
        </div>
    )

}

export default Login