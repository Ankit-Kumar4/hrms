const EmptyState = ({ message, icon }) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>}
      <h3 className="mt-2 text-sm font-medium text-gray-900">No data</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;