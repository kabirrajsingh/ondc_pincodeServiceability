/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import SubHeading from "./SubHeading";
import Heading from "./Heading";

// Retrieve component
export default function Retrieve({ inputs, inputType }) {
  const [queryResponse, setQueryResponse] = useState({});
  const [isQuerySent, setIsQuerySent] = useState(false);

  const handleSendQuery = async () => {
    try {
      let endpoint =
        "https://asia-south2-local-cogency-413608.cloudfunctions.net/QuerySparseMatrix";

      // Adjust parameters based on inputType
      let params = {};
      if (inputType === 0) {
        params["pincodeList"] = inputs.join(",").replace(/,+$/, "");
      } else if (inputType === 1) {
        params["company"] = inputs[0];
      } else if (inputType === 2) {
        params["company"] = inputs[1];
        params["pincode"] = inputs[0];
      }

      const response = await axios.get(endpoint, { params });

      const { data } = response;

      setQueryResponse(data);
      setIsQuerySent(true);
    } catch (error) {
      console.error("Error sending query:", error);
    }
  };

  // Function to render the content based on the response data
  const renderContent = () => {
    if (inputType === 0) {
      // For Type 0 query
      if (queryResponse.companies) {
        return (
          <div>
            <SubHeading
              label={
                "The companies corresponding to the following pincodes are:"
              }
            />
            <ul className="text-slate-500 list-disc pl-10 -mt-2">
              {Object.entries(queryResponse.companies).map(
                ([pincode, companies]) => (
                  <li key={pincode}>
                    <span className="text-slate-500">{pincode}:</span>{" "}
                    {companies.join(", ")}
                  </li>
                )
              )}
            </ul>
          </div>
        );
      }
    } else if (inputType === 1) {
      // For Type 1 query
      if (queryResponse.pincodes) {
        return (
          <div>
            <SubHeading
              label={`The pincodes corresponding to the company ${inputs[0]} are:`}
            />
            <ul className="text-slate-500 text-md px-4 pb-4 list-disc pl-10 -mt-2">
              {queryResponse.pincodes.map((pincode, index) => (
                <li key={index}>{pincode}</li>
              ))}
            </ul>
          </div>
        );
      }
    } else if (inputType === 2) {
      // For Type 2 query
      if (queryResponse.exists !== undefined) {
        return (
          <p className="text-slate-500 text-md px-4 pb-4">
            The Tuple ({inputs[1]}, {inputs[0]}) is{" "}
            {queryResponse.exists ? "present" : "absent"} in the data.
          </p>
        );
      }
    }

    return null;
  };

  return (
    <div className="ml-4">
      <button
        onClick={handleSendQuery}
        className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Send Query
      </button>

      {isQuerySent && (
        <div className="-ml-4">
          <Heading label={"Query Response"} />
          {renderContent()}
        </div>
      )}
    </div>
  );
}
