import React, { Fragment } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import Button from "../../Button/Button";
import FilePicker from "../../Form/Input/FilePicker";
const input = props => {
  const handleChangeFile = e => {
    props.onChange(e.target.value, e.target.files);
  };
  const handleFormSubmit = value => {
    props.formSubmit(value);
  };
  const getInitialValues = inputs => {
    const initialValues = {};
    //loop loop over fields array
    //if prop does not exit in the initialValues object,
    // pluck off the name and value props and add it to the initialValues object;
    if (inputs) {
      inputs.forEach(field => {
        if (!initialValues[field.name]) {
          initialValues[field.name] = field.value;
        }
      });
    }
    return initialValues;
  };

  const initialValues = getInitialValues(props.fields);

  const renderFields = (inputs, form) => {
    return inputs.map(input => {
      if (input.type === "select") {
        return renderSelect(input);
      }
      if (input.type === "textarea") {
        return renderTextArea(input);
      }
      if (input.type === "file") {
        return renderImageInput(input);
      }
      return (
        <div className="group" key={input.name}>
          <Field
            name={input.name}
            render={props => {
              const { field } = props;
              const { errors, touched, handleBlur } = props.form;
              const hasError =
                errors[input.name] && touched[input.name]
                  ? "wrong  invalid"
                  : "";
              const istouched = touched[input.name] ? " touched" : "";

              return (
                <Fragment>
                  <input
                    {...field}
                    onBlur={handleBlur}
                    id={field.name}
                    name={input.name}
                    className={[hasError, istouched]}
                    type="text"
                  />
                  <ErrorMessage
                    name={input.name}
                    component="div"
                    className="required"
                  />
                  <span className="highlight" />
                  <span className="bar" />
                  <label htmlFor={field.name}>{input.label}</label>
                </Fragment>
              );
            }}
          />
        </div>
      );
    });
  };

  const renderSelect = input => {
    return (
      <div className="select group" key={input.name}>
        <Field
          name={input.name}
          render={props => {
            const { field } = props;
            const { errors, touched } = props.form;
            const hasError =
              errors[input.name] && touched[input.name] ? "wrong  invalid" : "";
            const defaultOption = (
              <option key="default" value="" hidden></option>
            );
            const options = input.data.map(i => (
              <option key={i} value={i}>
                {" "}
                {i}{" "}
              </option>
            ));
            const selectOptions = [defaultOption, ...options];
            return (
              <select
                required
                value={field.value}
                {...field}
                id={hasError}
                className={[`${hasError}`, "select-text"].join("  ")}
              >
                {selectOptions}
              </select>
            );
          }}
        />
        <span className="select-highlight" />
        <span className="select-bar" />
        <label className="select-label">{input.label}</label>
        <ErrorMessage name={input.name} component="div" className="required" />
      </div>
    );
  };
  const renderTextArea = input => {
    return (
      <div className="group" key={"tr eer"}>
        <Field
          name={input.name}
          render={props => {
            const { field } = props;
            const { errors, touched } = props.form;
            const hasError =
              errors[input.name] && touched[input.name] ? "hasError" : "";
            return <textarea {...field} id={input.id} rows="5"></textarea>;
          }}
        />
        <span className="highlight" />
        <span className="bar" />
        <label htmlFor={input.id}>{input.label}</label>
        <ErrorMessage name={input.name} component="div" className="required" />
      </div>
    );
  };

  const renderImageInput = input => {
    return (
      <div className="group" key={"tadsopi"}>
        <p>Please choose some images.</p>
        <Field
          name={input.name}
          render={props => {
            const { field } = props;
            const {
              errors,
              touched,
              onBlur,
              onChange,
              setFieldValue
            } = props.form;
            const hasError =
              errors[input.name] && touched[input.name] ? "hasError" : "";
            return (
              <div className="input file_picker">
                <input
                  onChange={event => {
                    setFieldValue("images", event.currentTarget.files);
                    handleChangeFile(event);
                  }}
                  onBlur={onBlur}
                  type="file"
                  id={input.name}
                />
                <label className={["btn-3"].join(" ")} htmlFor={input.name}>
                  <span>
                    <i className="fas fa-plus"></i>
                    {input.label}
                  </span>
                </label>
              </div>
            );
          }}
        />
        <ErrorMessage name={input.name} component="div" className="required" />
      </div>
    );
  };

  return (
    <div className="wrapper">
      {props.control === "form" ? (
        <Formik
          onSubmit={values => {
            handleFormSubmit(values);
          }}
          validationSchema={props.validation}
          initialValues={initialValues}
          render={form => {
            return (
              <form id="my-form" onSubmit={form.handleSubmit}>
                {renderFields(props.fields, form)}
                {props.children}
                <div className="feed__actions">
                  {props.cancel && (
                    <Button
                      design="danger"
                      mode="flat"
                      onClick={props.cancelPostChangeHandler}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" className="btn">
                    {props.btnValue}
                  </Button>
                </div>
              </form>
            );
          }}
        />
      ) : (
        <div className="group">
          {props.control === "input" && (
            <input
              placeholder={props.placeholder}
              type={props.type}
              name={props.name}
              required="required"
              className={[
                !props.valid ? "invalid" : "valid",
                props.touched ? "touched" : "untouched"
              ].join(" ")}
              id={props.id}
              value={props.value}
              onChange={props.onChange}
              onBlur={props.onBlur}
            />
          )}
          {props.control === "textarea" && (
            <textarea
              className={[
                !props.valid ? "invalid" : "valid",
                props.touched ? "touched" : "untouched"
              ].join(" ")}
              id={props.id}
              rows={props.rows}
              required={props.required}
              value={props.value}
              onChange={e => props.onChange(props.id, e.target.value)}
              onBlur={props.onBlur}
            />
          )}
          {props.label && (
            <Fragment>
              <span className="highlight" />
              <span className="bar" />
              <label htmlFor={props.id}>{props.label}</label>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default input;

// <div>
//   {props.label && <label htmlFor={props.id}>{props.label}</label>}
//   {props.control === 'input' && (
//       <input
//       className={[
//         'common-input',
//         !props.valid ? 'invalid' : 'valid',
//         props.touched ? 'touched' : 'untouched'
//       ].join(' ')}
//       type={props.type}
//       id={props.id}
//       required={props.required}
//       value={props.value}
//       placeholder={props.placeholder}
//       onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
//       onBlur={props.onBlur}
//       placeholder={props.placeholder}
//     />
//   )}
//   {props.control === 'textarea' && (
//     <textarea
//       className={[
//         !props.valid ? 'invalid' : 'valid',
//         props.touched ? 'touched' : 'untouched'
//       ].join(' ')}
//       id={props.id}
//       rows={props.rows}
//       required={props.required}
//       value={props.value}
//       onChange={e => props.onChange(props.id, e.target.value)}
//       onBlur={props.onBlur}
//     />
//   )}
// </div>

// <Formik
//   onSubmit={values => {
//     console.log(values);
//   }}
//   validationSchema={props.validation}
//   initialValues={initialValues}
// >
//   {({ errors, touched }) => (
//     <Form>
//       {props.fields.map(field => {
//         console.log(errors[field.name]);

//         return (
//           <div className="group" key={field.name}>
//             <Field name={field.name} id={field.name} {...field}/>
//             <span className="highlight" />
//             <span className="bar" />
//             <label htmlFor={field.name}>{field.label}</label>
//             {errors[field.name] && touched[field.name] ? (
//               <div>{errors[field.name]}</div>
//             ) : null}
//           </div>
//         );
//       })}

//       <button className="btn" type="submit">
//         Submit
//       </button>
//     </Form>
//   )}
// </Formik>
