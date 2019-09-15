import * as Yup from "yup";

const alpha = /^[a-zA-Z_]+( [a-zA-Z_]+)*$/;

export const signUpValid = Yup.object().shape({
  name: Yup.string()
    .max(20, "Are you sure")
    .required("Please entre your username!"),
  email: Yup.string()
    .email("Email is invalid")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required")
});
export const loginValid = Yup.object().shape({
  email: Yup.string()
    .email("Email is invalid")
    .max(20, "Are you sure")
    .required("Please entre your username!"),
  password: Yup.string()
    .max(20, "Are you sure")
    .required("Did you forget your password?")
});
export const newPostValid = Yup.object().shape({
  title: Yup.string()
    .max(35, "35 characters max")
    .required("Please entre a title for this post"),
  content: Yup.string()
    .max(1025, "Text is too long")
    .required("Please write somthing"),
  images: Yup.string().required("insert image please")
});

export const searchValid = Yup.object().shape({
  what: Yup.string().max(35, "35 characters max"),

  city: Yup.string().matches(alpha, {
    message: "Enter Valid Name",
    excludeEmptyString: true
  }),
  category: Yup.string()
    .test(
      "county",
      "Please select one category",
      value => value !== "Please Select"
    )
    .required("required")
  // firstName: Yup.string()
  //   .matches(alpha, { message: "Enter Valid Name", excludeEmptyString: true })
  //   .required()
  //   .max(35),
  // lastName: Yup.string()
  //   .matches(alpha, { message: "Enter Valid Name", excludeEmptyString: true })
  //   .required()
  //   .max(35),
  // address: Yup.string().required(),
  // .required('First Name is required'),
  // firstName: Yup.string().required("First Name is required"),
  // lastName: Yup.string().required("Last Name is required"),
  // email: Yup.string()
  //   .email("Email is invalid")
  //   .required("Email is required"),
  // password: Yup.string()
  //   .min(6, "Password must be at least 6 characters")
  //   .required("Password is required"),
  // confirmPassword: Yup.string()
  //   .oneOf([Yup.ref("password"), null], "Passwords must match")
  //   .required("Confirm Password is required")
});

//export default validation;
