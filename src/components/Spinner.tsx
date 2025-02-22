const Spinner = ({ size = "h-12 w-12" }) => (
  <div className="flex justify-center items-center">
    <div
      className={`animate-spin rounded-full ${size} border-t-4 border-yellow-500 border-t-yellow-300`}
    ></div>
  </div>
);

export default Spinner;
