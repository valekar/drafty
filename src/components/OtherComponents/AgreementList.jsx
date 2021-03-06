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
                      onKeyUp={(e) => {
                        props.onChildKeyDown(
                          index,
                          e.currentTarget.value,
                          `field_${index}`
                        );
                      }}
                      placeholder={"friend"}
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
