import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode} from "@fortawesome/free-solid-svg-icons";

function Sending() {

  const tabButtons = [
    { name: "აქტიური",   },
    { name: "დასრულებული",   },
    { name: "გაუქმებული", },
    { name: "დასადასტურებელი", },
]

return (
  <div className="flex flex-col h-screen bg-white">
   
    {/* Header */}
    <div className="p-4">
      <h1 className="text-2xl font-bold">მიწოდება</h1>

      {/* Tab Navigation */}
      <div className="flex mt-4 space-x-2">
        {tabButtons.map((item) => (
        <button
          key={item.name}
          className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
        >{item.name}
        </button>
      ))}
      </div>
    </div>

    {/* Search Input */}
    <div className="flex items-center px-4 py-2">
      <div className="flex items-center border-2 border-gray-300 w-full rounded-md px-4 py-2">
        <FontAwesomeIcon icon={faBarcode} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="ძიება"
          className="w-full focus:outline-none"
        />
      </div>
    </div>

    {/* parcel info */}
    <div >
      
    </div>

    {/* QR Code Section */}
    <div className="p-4">
      <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 py-4 rounded-lg text-black font-semibold text-lg shadow-md">
        <FontAwesomeIcon icon={faBarcode} />
        <span>კოდის სკანირება</span>
      </button>
    </div>

  </div>
);
}
export default Sending;
