const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};

export default LoadingSkeleton;