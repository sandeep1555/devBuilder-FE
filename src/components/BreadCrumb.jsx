import { Breadcrumb } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setContractorList } from '../Store/contractorSlice';
import { getContractorList } from '../Api/Contractor';
import { handleError } from '../Utility/Utility';

const BreadcrumbComponent = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path);
  const [contractorName, setContractorName] = useState('');
  const contractorList = useSelector((store) => store.contractorData.contractorList);
  const defaultProject = useSelector((store) => store.projectData.defaultProject);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const fetchContractorName = async () => {
    const contractorId = paths.find((path) => !isNaN(Number(path)));

    if (contractorId) {
      let contractor = contractorList?.find(c => c.id === Number(contractorId));

      if (!contractor) {
        try {
          const response = await getContractorList(defaultProject.projectId);
          const contractorData = response.data?.results;
          dispatch(setContractorList(contractorData));
          contractor = contractorData?.find(contractor => contractor.id === Number(contractorId));
        } catch (error) {
          return handleError(error);
        }
      }

      if (contractor) setContractorName(contractor.name);
    }
  };

  useEffect(() => {

    const isContractorPath = /\/task\/contractor\/\d+$/.test(location.pathname);

    if (defaultProject && isContractorPath) {
      fetchContractorName();
    }

  }, [location.pathname, defaultProject]);

  return (
    <div className='ml-6 my-2 mt-3 text-xl'>
      <Breadcrumb aria-label="Breadcrumb" >
        <Breadcrumb.Item >
          <Link className='text-md hover:underline' to="/project" onClick={() => navigate("/project")}>Home</Link>
        </Breadcrumb.Item>
        {paths.map((path, index) => {
          const to = `/${paths.slice(0, index + 1).join('/')}`;
          let formattedPath = decodeURIComponent(path).replace(/%/g, ' ').replace(/^./, str => str.toUpperCase());

          if (!isNaN(Number(path)) && contractorName) {
            formattedPath = contractorName;
          }

          return (
            <Breadcrumb.Item key={to}>
              <Link to={to} onClick={() => navigate(to)}
                className='text-md hover:underline'>{formattedPath}</Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;