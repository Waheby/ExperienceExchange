import { useState, useHistory } from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
function Register() {
  let navigate = useNavigate();

  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmpassword, setConfirmpassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is Required"),
    email: Yup.string()
      .required("Email is Required")
      .email("Wrong Email Format"),
    password: Yup.string()
      .required("Password is Required")
      .min(8, "Password must be be atleast 8 characters long")
      .matches(
        /[!@#$%^&*(),.?":{}]/,
        "Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmpassword: Yup.string()
      .required("Password is Required")
      .oneOf([Yup.ref("password")], "Password doesn't match"),
  });

  const yupValidate = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("Form Validated successfully");
      return true;
    } catch (error) {
      console.log(error.inner);
      setIsSubmitting(false);
      toast.error(error.inner[0].message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsSubmitting(false);

      return false;
    }
  };
  console.log(formData);

  const register = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = await yupValidate();
    console.log(errors);

    console.log(isValid);

    if (isValid) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confpass: formData.confirmpassword,
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);

      if (data.status === 200) {
        console.log("Register Successful");
        toast.success("Register Success!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        console.log("Failed to Register");
        toast.error(data.data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setIsSubmitting(false);
      }
    } else {
      // toast.error(errors, {
      //   position: "top-right",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "colored",
      // });
      // setIsSubmitting(false);
    }
  };

  return (
    <>
      <img
        style={{
          width: "100%",
          minWidth: "1440px",
          maxWidth: "1900px",
          minHeight: "800px",
          zIndex: "-1",
          position: "absolute",
          marginTop: "-35px",
        }}
        src={`${
          import.meta.env.VITE_CLOUDINARY_URL
        }/v1729095996/blob-scene-haikei_5_feadwg.svg`}
        alt=""
      />
      <h1 style={{ textAlign: "center", marginTop: "200px" }}>
        Register a new account
      </h1>
      <div className={ContentCSS.registerContainer}>
        <form onSubmit={register} className={ContentCSS.registerFormContainer}>
          <label htmlFor="text">Username: </label>
          <input
            className={ContentCSS.loginInput}
            type="text"
            maxLength="15"
            value={formData.username}
            onChange={(event) => {
              setFormData({ ...formData, ["username"]: event.target.value });
            }}
          />
          <label htmlFor="text">Email: </label>
          <input
            className={ContentCSS.loginInput}
            type="text"
            maxLength="40"
            value={formData.email}
            onChange={(event) => {
              setFormData({ ...formData, ["email"]: event.target.value });
            }}
          />
          <label htmlFor="text">Password: </label>
          <input
            className={ContentCSS.loginInput}
            type="password"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            value={formData.password}
            onChange={(event) => {
              setFormData({ ...formData, ["password"]: event.target.value });
            }}
          />
          <label htmlFor="text">Confirm Password: </label>
          <input
            className={ContentCSS.loginInput}
            type="password"
            value={formData.confirmpassword}
            onChange={(event) => {
              setFormData({
                ...formData,
                ["confirmpassword"]: event.target.value,
              });
            }}
          />

          <hr style={{ width: "350px" }} />
          <button className={ContentCSS.loginButton} disabled={isSubmitting}>
            Register
          </button>
          <a className={ContentCSS.registerForgot} href="/login">
            Already have an account?
          </a>
        </form>
      </div>
    </>
  );
}

export default Register;
