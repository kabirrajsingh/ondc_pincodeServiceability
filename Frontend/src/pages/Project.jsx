import { useState } from "react";
import Card from "../components/Card";
import FileUpload from "../components/FileUpload";
import Heading from "../components/Heading";
import MultiInputBox from "../components/MultiInputBox";
import SubHeading from "../components/SubHeading";
import Retrieve from "../components/Retrieve";

function Project() {
  const [inputs, setInputs] = useState([""]);
  const [inputType, setInputType] = useState(0);
  return (
    <div>
      <Card>
        <Heading label={"Upload the Matrix"} />
        <SubHeading label={"(in .txt format)"} />
        <FileUpload />
      </Card>
      <Card>
        <Heading label={"Add Query Parameter(s)"} />
        <MultiInputBox
          inputs={inputs}
          setInputs={setInputs}
          inputType={inputType}
          setInputType={setInputType}
        />
      </Card>
      <Card>
        <Heading label={"Retrieved Company Name/Ids"} />
        <SubHeading label={"(Click the button to get)"} />
        <Retrieve inputs={inputs} inputType={inputType} />
      </Card>
    </div>
  );
}

export default Project;
