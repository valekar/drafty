import React from "react";
import ReactDOMServer from "react-dom/server";

const FormatMentionText = (props) => {
  const reg = new RegExp(/\[\[(.*?)\]\]/); // Match text inside two square brackets

  console.log(props.values);
  const formatMentionText = (text, values, regex) => {
    if (!values.length) return text;
    return (
      <div>
        {text
          .split(regex)
          .reduce((prev, current, i) => {
            // console.log("CURRENT" + current);
            // console.log("Prev " + prev);
            // console.log(i);
            if (!i) return [current];

            return prev.concat(
              values.includes(current)
                ? ReactDOMServer.renderToStaticMarkup(
                    <input
                      key={i + current}
                      type="text"
                      defaultValue={values[0]}
                    />
                  )
                : current
            );
          }, [])
          .join("")}
      </div>
    );
  };

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: formatMentionText(props.text, props.values, reg).props
            .children,
        }}
      ></div>
    </div>
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
