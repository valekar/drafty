import React, { useState } from "react";

const MyForm = () => {
  const [name, setName] = useState("name");

  const mySubmit = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    console.log(event);
  };

  const handleChange = (event) => {
    setName({
      name: event.target.value,
    });
  };

  return (
    <div>
      <form>
        <input type="text" value={name} onChange={handleChange} />

        <button type="submit" onClick={(e) => mySubmit(e)}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default MyForm;
