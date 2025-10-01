import { useEffect, useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Eye from 'components/Eye';
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import ActionAlert from "components/Alert";

const registerSchema = yup.object().shape({
  firstName: yup.string().min(2).max(10).required("required"),
  lastName: yup.string().min(2).max(10).required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().min(4).max(12).required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().min(4).max(12).required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const [T, setT] = useState("");
  const flag = useSelector((state) => state.eye);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    setT((flag) ? "text" : "password");
  }, [flag]);

  const register = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      formData.append("picturePath", values.picture.name);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      onSubmitProps.resetForm();

      if (data.status) {
        setAlert({ message: "Registration successful! Please login.", type: "success" });
        setPageType("login");
      } else {
        setAlert({ message: data.message || "Registration failed!", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "Something went wrong!", type: "error" });
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      onSubmitProps.resetForm();

      if (data.status) {
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        setAlert({ message: "Login successful!", type: "success" });
        navigate("/home");
      } else {
        setAlert({ message: data.msg || "Login failed!", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "Something went wrong!", type: "error" });
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <>
          {alert.message && <div style={{ marginBottom: "20px" }}><ActionAlert message={alert.message} type={alert.type} setAlert={setAlert} /></div>}
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName || ""}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName || ""}
                    name="lastName"
                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location || ""}
                    name="location"
                    error={Boolean(touched.location) && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation || ""}
                    name="occupation"
                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="0.5rem"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.secondary.dark}`}
                          p="0.5rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
              )}

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email || ""}
                name="email"
                helperText={touched.email && errors.email}
                error={Boolean(touched.email) && Boolean(errors.email)}
                sx={{ gridColumn: "span 4" }}
              />

              <Box position={"relative"} sx={{ gridColumn: "span 4" }}>
                <TextField
                  label="Password"
                  type={T}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password || ""}
                  name="password"
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  fullWidth
                />
                <Box position={'absolute'} right={'10px'} top={'10px'}><Eye /></Box>
              </Box>

            </Box>

            {/* BUTTONS */}

            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.secondary.dark,
                  color: "white",
                  "&:hover": {
                    color: palette.primary.alt,
                    backgroundColor: palette.secondary.main
                  },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  color: palette.secondary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.secondary.light,
                  },
                }}
                textAlign="center"
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        </>

      )}
    </Formik>
  );
};

export default Form;
