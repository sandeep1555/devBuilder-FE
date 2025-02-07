
import { Outlet, useNavigate } from 'react-router-dom'
import SideBar from './SideBar'
import { useAuth } from '../Contexts/authContext';
import BreadcrumbComponent from './BreadCrumb';
import { useEffect } from 'react';


const Body = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/")
    }
  }, [isLoggedIn()])
  return (
    <div className={`${isLoggedIn() && "flex"}`}>
      {isLoggedIn() && <SideBar />}
      <div className='flex w-full flex-col'>
        {isLoggedIn() && <BreadcrumbComponent />}
        <Outlet />
      </div>

    </div>
  )
}

export default Body