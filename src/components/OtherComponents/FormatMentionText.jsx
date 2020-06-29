import React from "react";
import ReactDOMServer from "react-dom/server";

const FormatMentionText = (props) => {
  //const text = "Lorem ipsum dolor sit amet [[Jonh Doe]] and [[Jane Doe]]";
  //const values = ["Jonh Doe", "Jane Doe"];
  const reg = new RegExp(/\[\[(.*?)\]\]/); // Match text inside two square brackets

  const formatMentionText = (text, values, regex) => {
    if (!values.length) return text;
    return (
      <div>
        {text
          .split(regex)
          .reduce((prev, current, i) => {
            if (!i) return [current];

            return prev.concat(
              values.includes(current)
                ? ReactDOMServer.renderToStaticMarkup(
                    <input key={i + current} type="text" value={current} />
                  )
                : current
            );
          }, [])
          .join("")}
      </div>
    );
  };

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: formatMentionText(props.text, props.values, reg).props.children,
      }}
    ></div>
  );
};

export default FormatMentionText;

export const formatMentionText = (text, values) => {
  const regex = new RegExp(/\[\[(.*?)\]\]/); // Match text inside two square brackets

  if (!values.length) return text;

  const returnValue = (
    <div>
      {text
        .split(regex)
        .reduce((prev, current, i) => {
          if (!i) return [current];

          return prev.concat(
            values.includes(current)
              ? ReactDOMServer.renderToStaticMarkup(
                  <input key={i + current} type="text" defaultValue={current} />
                )
              : current
          );
        }, [])
        .join("")}
    </div>
  );

  return returnValue;
};
