import { useSelector } from "react-redux";


const Shimmer = () => {

	const shimmer = [];
	const taskCount=useSelector((store)=>store.taskData.taskCount);
	const ShimmerLength=taskCount ? taskCount : 3;

	for (let i = 0; i < ShimmerLength; i++) {

		shimmer.push(
			<div key={i} className="flex items-center justify-start py-2">
				<div className="bg-gray-700  loading-shimmer h-[20px] w-[20px] ml-[30px] mr-[140px]"> </div>
				<div className="bg-gray-700  loading-shimmer h-[20px] w-[400px] mr-[430px]"></div>
				<div className="bg-gray-700  loading-shimmer h-[20px] w-[100px] mr-[90px]"></div>
				<div className="bg-gray-700  loading-shimmer h-[20px] w-[100px] mr-[40px]"></div>
				<div className="bg-gray-700  loading-shimmer h-[30px] w-[30px] mx-2  rounded-full"> </div>
			</div>
		)

	}

	return (

		<div className="mt-[100px]">

			{shimmer}

		</div>

	)
}

export default Shimmer