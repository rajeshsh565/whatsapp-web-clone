import { useEffect, useState } from "react"
import { HidePasswordIcon, ShowPasswordIcon } from "../utils/Icons";

const CustomAuthInput = ({ name, placeholder, error }) => {
  const [pwdToggle, setPwdToggle] = useState(true);
  return (
    <>
      <div className="flex items-center relative">  
        <input type={pwdToggle && ["password", "confirmPassword"].includes(name) ? 'password':'text'} name={name} placeholder={placeholder} className={`auth-input ${name==="name" ? "pe-10 bg-red-700" : ""}`} autoComplete="off"/>
        {
          ["password", "confirmPassword"].includes(name) && (
            <div className="absolute right-3 z-50" onClick={()=>setPwdToggle(!pwdToggle)}>
              {
                pwdToggle ? <ShowPasswordIcon/> : <HidePasswordIcon/>
              }
            </div>
          )
        }
      </div>
      {
        error && <p className="text-error text-xs w-full ms-10 mt-[-10px]">{error}</p>
      }
    </>
  )
}
export default CustomAuthInput