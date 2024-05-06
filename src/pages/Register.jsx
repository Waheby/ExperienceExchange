import { useState, useHistory } from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = "http://localhost:5000";
    if (password == confirmpassword) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            confpass: confirmpassword,
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
      }
    } else {
      toast.error("Passwords doesn't match!", {
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
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Register Page</h1>
      <div className={ContentCSS.registerContainer}>
        <form onSubmit={register} className={ContentCSS.registerFormContainer}>
          <label htmlFor="text">Username: </label>
          <input
            className={ContentCSS.loginInput}
            type="text"
            required
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <label htmlFor="text">Email: </label>
          <input
            className={ContentCSS.loginInput}
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <label htmlFor="text">Password: </label>
          <input
            className={ContentCSS.loginInput}
            type="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <label htmlFor="text">Confirm Password: </label>
          <input
            className={ContentCSS.loginInput}
            type="password"
            required
            value={confirmpassword}
            onChange={(event) => {
              setConfirmpassword(event.target.value);
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
