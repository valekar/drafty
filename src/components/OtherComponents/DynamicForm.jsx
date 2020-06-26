import React, { Component } from "react";
import { Formik, Field } from "formik";
//import "./App.css";

class DynamicForm extends Component {
  renderField(inputs) {
    return inputs.map((input) => {
      return (
        <div key={input.name}>
          <label>{input.label}</label>
          <div>
            <Field
              name={input.name}
              render={(props) => {
                const { field } = props;
                return <input {...field} type="text" />;
              }}
            />
          </div>
        </div>
      );
    });
  }

  getInitialValues(inputs) {
    //declare an empty initialValues object
    const initialValues = {};
    //loop loop over fields array
    //if prop does not exit in the initialValues object,
    // pluck off the name and value props and add it to the initialValues object;
    inputs.forEach((field) => {
      if (!initialValues[field.name]) {
        initialValues[field.name] = field.value;
      }
    });

    //return initialValues object
    return initialValues;
  }

  render() {
    const initialValues = this.getInitialValues(this.props.fields);
    return (
      <div className="app">
        <h1>Dynamic International Form</h1>
        <Formik
          onSubmit={(values) => {
            console.log("submitting");
            console.log(values);
          }}
          validationSchema={this.props.validation}
          initialValues={initialValues}
          render={(form) => {
            return (
              <div>
                <form onSubmit={form.handleSubmit}>
                  {this.renderField(this.props.fields)}
                  <button type="submit" className="btn">
                    Submit
                  </button>
                </form>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default DynamicForm;
