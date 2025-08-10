import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomAuthInput from "../Components/CustomAuthInput";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const Register = () => {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
    const { name, phone, password, confirmPassword } = formVals;
    const formErrors = {};
    formErrors.name =
      name
        ? name.match(/^[A-Za-z ]{3,50}$/)
          ? ""
          : "Please provide a valid name"
        : "Please provide a name";
    formErrors.phone = 
      phone
        ? phone.match(/^[0-9]{10}$/)
          ? ""
          : "Please provide a valid 10 digits phone number"
        : "Please provide a phone number";
    formErrors.password = 
      password
        ? password.length >= 8
          ? ""
          : "Password should be of minimum 8 characters"
        : "Please provide a password"
    formErrors.confirmPassword = 
      confirmPassword
        ? password === confirmPassword
          ? ""
          : "Passwords do not match"
        : "Please provide the matching password"
    
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
        const { data } = await customFetch.post("/auth/register", formVals);
        toast.success(data?.msg || "Registration successful!");
        navigate("/login");
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
        <CustomAuthInput name="name" placeholder="Name..." error={formErrors.name}/>
        <CustomAuthInput name="phone" placeholder="Phone Number..." error={formErrors.phone}/>
        <CustomAuthInput name="password" placeholder="Password..." error={formErrors.password}/>
        <CustomAuthInput name="confirmPassword" placeholder="Confirm Password..." error={formErrors.confirmPassword}/>
        <button type="submit" className="btn btn-secondary btn-dash px-8">Register</button>
      </form>
      <div className="text-center">
        <p className="font-serif">Already Registered?</p>
        <Link to="/login" className="btn btn-ghost btn-secondary px-8">Login Here</Link>
      </div>
    </div>
  )
}
export default Register