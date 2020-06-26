import React from "react";
const contactForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        name="name"
      />
      {errors.name && <div>{errors.name}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};
