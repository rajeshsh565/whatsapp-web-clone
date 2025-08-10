import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomAuthInput from "../Components/CustomAuthInput";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const Login = () => {
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    (async()=>{
      const { data } = await customFetch.get("/user/current-user");
      const user = data?.user;
      if(user){
        navigate('/');
      }
    })();
  }, []);

  const validateForm = (formVals) => {
    const { phone, password } = formVals;
    const formErrors = {};
    formErrors.phone = 
      phone
        ? phone.match(/^[0-9]{10}$/)
          ? ""
          : "Please provide a valid phone number"
        : "Please provide a phone number";
    formErrors.password = 
      password
        ? password.length >= 8
          ? ""
          : "Password should be of minimum 8 characters"
        : "Please provide a password"
    
    if(Object.values(formErrors).some((val)=>val!="")){
      setFormErrors(formErrors);
      return false;
    } else {
      setFormErrors({});
      return true;
    }
  }

  const submitForm = async(e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formVals = Object.fromEntries(formData);
    if(validateForm(formVals)){
      try {
        const { data } = await customFetch.post("/auth/login", formVals);
        toast.success(data?.msg || "Login successful!");
        navigate("/");
      } catch (error) {
        console.error("error: ", error);
        const errMsg = error?.response?.data?.msg || "Something went wrong!";
        toast.error(errMsg);
      }
    }
  }
  return (
    <div className="auth-container">
      <h1 className="text-3xl text-primary">Whatsapp Web Clone</h1>
      <form onSubmit={submitForm} className="auth-form">
          <CustomAuthInput name="phone" placeholder="Phone Number..." error={formErrors.phone}/>
          <CustomAuthInput name="password" placeholder="Password..." error={formErrors.password}/>
        <button type="submit" className="btn btn-secondary btn-dash px-8">Login</button>
      </form>
      <div className="text-center">
        <p className="font-serif">Not a user yet?</p>
        <Link to="/register" className="btn btn-ghost btn-secondary px-8">Register Here</Link>
      </div>
    </div>
  )
}
export default Login