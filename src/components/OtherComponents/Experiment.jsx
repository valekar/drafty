import React, { useState } from "react";
import FormatMentionText from "./FormatMentionText";

const Experiment = (props) => {
  const [textValue, setTextValue] = useState("test");
  const [copyTextValue, setCopyTextValue] = useState("");

  const handleChange = (e) => {
    setTextValue(e.target.value);
    console.log(e.target.value);
    setCopyTextValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={textValue} onChange={handleChange} />
      <input type="text" value={copyTextValue} />

      <FormatMentionText text={"Some text [[field_0]]"} values={["field_0"]} />
    </div>
  );
};

export default Experiment;
