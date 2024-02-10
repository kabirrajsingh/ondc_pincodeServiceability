// eslint-disable-next-line react/prop-types
const Card = ({ children }) => {
  return (
    <div className="max-w-xl mx-auto mt-5 bg-white rounded-xl overflow-hidden shadow-md p-4 pb-6">
      {children}
    </div>
  );
};

export default Card;
