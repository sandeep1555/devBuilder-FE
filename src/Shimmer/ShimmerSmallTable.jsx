import { useSelector } from "react-redux";

const ShimmerSmallTable = () => {
  const shimmer = [];
  const taskCount = useSelector((store) => store.taskData.taskCount);
  const ShimmerLength = taskCount ? taskCount : 3;

  for (let i = 0; i < ShimmerLength; i++) {
    shimmer.push(
      <tr key={i} className="animate-pulse ">
        <td className="px-6 py-4">
          <div className="bg-gray-700 loading-shimmer h-5 w-60 rounded"></div>
        </td>
        <td className="px-6 py-4">
          <div className="bg-gray-700 loading-shimmer h-5 w-40 rounded"></div>
        </td>
      </tr>
    );
  }

  return (
    <div className="mt-10">
      <table className="w-full border-collapse ">
        <tbody>{shimmer}</tbody>
      </table>
    </div>
  );
};

export default ShimmerSmallTable;
