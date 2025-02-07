import './App.css'
import { createBrowserRouter } from "react-router-dom"
import MainContainer from './components/MainContainer'
import Login from "./components/Login"
import Body from './components/Body'
import Header from './components/Header'
import { useTheme } from './Contexts/themeContext'
import TasksContainer from "./components/TasksContainer"
import AggregateTaskContainer from './components/AggregateTaskContainer'
import TaskProgressContainer from './components/TaskProgressContainer'
import ContractorAttendance from './components/ContractorAttendance'
import ContractorList from './components/ContractorList'
import ProjectContainer from './components/ProjectContainer'
import OrganisationDetails from './components/OrganisationDetails'
import ViewProfile from './components/ViewProfile'


function App() {
	const { theme } = useTheme();
	return (
		<div className={`app ${theme}`}>
			<div className="bg-white dark:bg-gray-800">
				<Header />
				<Body />
			</div>
		</div>
	)
}

export const appRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [

			{
				path: "/",
				element: <Login />,
			},

			{
				path: "/",
				element: <MainContainer />,
				children: [

					{
						path: "/organisation",
						element: <OrganisationDetails />
					},
					{
						path: "/profile",
						element: <ViewProfile />
					},
					{
						path: "/project",
						element: <ProjectContainer />
					},

					{
						path: "/project/task",
						element: <AggregateTaskContainer />
					},
					{
						path: "/project/task/details",
						element: <TasksContainer />,
					},
					{
						path: "/project/task/details/:taskName",
						element: <TasksContainer />

					},
					{
						path: "/project/task/detail/",
						element: <AggregateTaskContainer />
					},

					{
						path: "/project/task/detail/:taskName",
						element: <TaskProgressContainer />
					},
					{
						path: "/project/contractor",
						element: <ContractorList />,
					},
					{
						path: "/project/contractor/:contractorId",
						element: <ContractorAttendance />
					}


				]
			},

		]
	},

])

export default App
