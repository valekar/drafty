import React from "react";
const reactStringReplace = require("react-string-replace");

const StringReplace = (props) => {
  const reg = new RegExp(/\[\[(.*?)\]\]/);
  return (
    <div>
      {reactStringReplace(props.text, reg, (match, i) => (
        <span key={i} style={{ color: "red" }}>
          {props.values[i]}
        </span>
      ))}
    </div>
  );
};

export default StringReplace;
