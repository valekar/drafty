import React from "react";
import { Formik, Form, FieldArray, Field } from "formik";
const AgreementList = (props) => (
  <div>
    <h1>Agreement Field List</h1>
    <Formik
      enableReinitialize
      initialValues={{ fields: props.agreementFields }}
      onSubmit={props.onSubmit}
      render={({ values }) => (
        <Form>
          <FieldArray
            name="fields"
            render={(arrayHelpers) => (
              <div>
                {values.fields.map((friend, index) => (
                  <div key={index}>
                    <Field
                      name={`fields.${index}`}
                      onBlur={(e) => {
                        props.onChildBlur(index, e.currentTarget.value);
                      }}
                    />
                  </div>
                ))}
                <div>
                  <button type="submit">Submit</button>
                </div>
              </div>
            )}
          />
        </Form>
      )}
    />
  </div>
);

export default AgreementList;
