const ShimmerProjectCard = () => {
    const shimmer = Array(3).fill(0); // Create 3 shimmer cards

    return (
        <div className="flex mx-2 flex-wrap  ">
            {shimmer.map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse flex justify-between max-w-[300px] md:min-h-[180px] min-h-[130px] md:min-w-[320px] min-w-[320px] bg-gray-200 dark:bg-gray-700 pl-3 pr-0 mx-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm mb-4 md:mb-0"
                >
                    <div>
                        <div className="bg-gray-400 dark:bg-gray-600 loading-projectshimmer h-6 w-3/4 rounded mt-4"></div>
                        <div className="bg-gray-400 dark:bg-gray-600 loading-projectshimmer h-4 w-2/3 rounded mt-4"></div>
                        <div className="bg-gray-400 dark:bg-gray-600 loading-projectshimmer h-4 w-1/2 rounded mt-5"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShimmerProjectCard;
