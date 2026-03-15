const Badge = ({ status }) => {
  const color = status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

export default Badge;