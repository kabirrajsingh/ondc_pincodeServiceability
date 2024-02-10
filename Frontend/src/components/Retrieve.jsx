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
      // Make the API call
      const response = await axios.get(
        "https://asia-south2-local-cogency-413608.cloudfunctions.net/QuerySparseMatrix",
        {
          params: {
            // Adjust parameters based on your requirements
            inputType: inputType,
            inputs: inputs,
          },
        }
      );

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
      {/* "Send Query" button */}
      <Button onClick={handleSendQuery} className="mt-2">
        Send Query
      </Button>

      {/* Display the query response */}
      <div className="mt-3">{queryResponse}</div>
    </div>
  );
}
