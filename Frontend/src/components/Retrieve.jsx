// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import Button from "./Button";

// Retrieve component
// eslint-disable-next-line react/prop-types
export default function Retrieve({ inputs, inputType }) {
  const [queryResponse, setQueryResponse] = useState("");

  // Function to handle the "Send Query" button click
  const handleSendQuery = async () => {
    try {
      let endpoint =
        "https://asia-south2-local-cogency-413608.cloudfunctions.net/QuerySparseMatrix";

      // Adjust parameters based on inputType
      let params = {};
      if (inputType === 0) {
        // For Type 0 query
        params["pincodeList"] = inputs.join(",");
      } else if (inputType === 1) {
        // For Type 1 query
        params["company"] = inputs[0];
      } else if (inputType === 2) {
        // For Type 2 query
        params["company"] = inputs[1];
        params["pincode"] = inputs[0];
      }

      // Make the API call
      const response = await axios.get(endpoint, { params });

      // Extract the data from the response
      const { data } = response;

      // Update the state variable with the obtained data
      setQueryResponse(data);
    } catch (error) {
      console.error("Error sending query:", error);
      // Handle error if needed
    }
  };

  return (
    <div className="ml-4">
      {/* "Send Query" button styled with green background color */}
      <Button
        onClick={handleSendQuery}
        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Send Query
      </Button>

      {/* Display the query response */}
      <div className="mt-3">{queryResponse}</div>
    </div>
  );
}
