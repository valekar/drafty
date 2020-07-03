import React from "react";
import ReactDOMServer from "react-dom/server";
const reactStringReplace = require("react-string-replace");

const StringReplace = (props) => {
  const reg = new RegExp(/\[\[(.*?)\]\]/);

  let replacedText = reactStringReplace(props.text, reg, (match, i) => {
    // console.log(match, i);

    let result = props.values.filter(
      (value) => Object.keys(value)[0] === match
    )[0];
    // console.log(result);

    return ReactDOMServer.renderToStaticMarkup(
      <span key={i} style={{ color: "red" }}>
        {result[match]}
      </span>
    );
  }).join("");

  return <div dangerouslySetInnerHTML={{ __html: replacedText }}></div>;
};

export default StringReplace;
