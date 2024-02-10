// eslint-disable-next-line react/prop-types
const Button = ({ children, onClick }) => {
  return (
    <button
      className="m-0.5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
