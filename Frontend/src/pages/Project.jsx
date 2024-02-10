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
        <Heading label={"Upload the Matrix/Data"} />
        <SubHeading label={"(in .txt format)"} />
        <FileUpload />
      </Card>
      <Card>
        <Heading label={"Add Query Parameter(s)"} />
        <SubHeading label={"Select the type of query you want to make"} />
        <MultiInputBox
          inputs={inputs}
          setInputs={setInputs}
          inputType={inputType}
          setInputType={setInputType}
        />
      </Card>
      <Card>
        <Heading label={"Retrieve Company Name(s)/Pincode(s)"} />
        <SubHeading
          label={"Click the button to query data as per above parameters"}
        />
        <Retrieve inputs={inputs} inputType={inputType} />
      </Card>
    </div>
  );
}

export default Project;
