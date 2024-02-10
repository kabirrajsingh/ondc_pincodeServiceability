/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Button from "./Button";
import SubHeading from "./SubHeading";

const MultiInputBox = ({ inputs, setInputs, inputType, setInputType }) => {
  // Function to handle changes in input values
  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  // Function to add a new input field
  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };

  // Function to reset inputs
  const handleReset = () => {
    setInputs([""]);
  };

  // Handlers for changing input type
  const handleType1QueryClick = () => {
    setInputType(0);
  };

  const handleType2QueryClick = () => {
    setInputType(1);
    setInputs([""]);
  };

  const handleType3QueryClick = () => {
    setInputType(2);
    setInputs(["", ""]);
  };

  // Generate placeholders based on input type
  const getPlaceholder = (index) => {
    switch (inputType) {
      case 0:
        return `Pincode${index + 1}`;
      case 1:
        return "Company Name";
      case 2:
        return index === 0 ? "Pincode" : "Company Name";
      default:
        return `Input ${index + 1}`;
    }
  };

  return (
    <div className="max-w-md p-4 flex flex-wrap items-center">
      <div className="ml-2 -mt-1">
        <Button onClick={handleType1QueryClick}>Type-1</Button>
        <Button onClick={handleType2QueryClick}>Type-2</Button>
        <Button onClick={handleType3QueryClick}>Type-3</Button>
        <div className="-ml-3">
          {inputType == 0 && (
            <SubHeading
              label={"Type 1: To query company names for list of pincodes."}
            />
          )}
          {inputType == 1 && (
            <SubHeading
              label={"Type 2: To query list of pincodes for a company name."}
            />
          )}
          {inputType == 2 && (
            <SubHeading
              label={
                "Type 3: To query if a (company name, pincode) tuple is present in the data."
              }
            />
          )}
        </div>
      </div>
      {inputs.map((input, index) => (
        <input
          key={index}
          type="text"
          value={input}
          onChange={(e) => handleInputChange(index, e.target.value)}
          placeholder={getPlaceholder(index)}
          className="border rounded px-2 py-1 m-2"
        />
      ))}
      {/* Show "Add Parameters" button if inputType is 0 */}
      {inputType === 0 && (
        <Button onClick={handleAddInput}>
          {inputs.length > 1 ? "Add More Parameters" : "Add Parameter"}
        </Button>
      )}
      <button
        onClick={handleReset}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Reset
      </button>
    </div>
  );
};

export default MultiInputBox;
