// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Button from "./Button";

// eslint-disable-next-line react/prop-types
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
  };

  const handleType3QueryClick = () => {
    setInputType(2);
    // If inputType is 2, reset inputs and show only two input boxes
    setInputs(["", ""]);
  };

  // Generate placeholders based on input type
  const getPlaceholder = (index) => {
    switch (inputType) {
      case 0:
        return `Id${index + 1}`;
      case 1:
        return `Company${index + 1}`;
      case 2:
        return index === 0 ? "Id" : "Company";
      default:
        return `Input ${index + 1}`;
    }
  };

  return (
    <div className="max-w-md p-4 flex flex-wrap items-center">
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
      {/* Show "Add Parameters" button if inputType is not 2 or inputs length is less than 2 */}
      {(inputType !== 2 || inputs.length < 2) && (
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
      <div className="m-2">
        <Button onClick={handleType1QueryClick}>
          Type-1 Query(List of Ids)
        </Button>
        <Button onClick={handleType2QueryClick}>
          Type-2 Query(List of Companies)
        </Button>
        <Button onClick={handleType3QueryClick}>
          Type-3 Query(One Id and One Company)
        </Button>
      </div>
    </div>
  );
};

export default MultiInputBox;
