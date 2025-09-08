// Frontend for login/signup with optional logo upload
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecuriterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login"); // Login | Sign Up
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Sign Up" && !isTextDataSubmitted) return setIsTextDataSubmitted(true);

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, { email, password });
        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);

        const { data } = await axios.post(`${backendUrl}/api/company/register`, formData);

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  return (
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-[350px] sm:w-[400px]"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm text-center mb-4">
          {state === "Login"
            ? "Welcome back! Please sign in to continue"
            : !isTextDataSubmitted
            ? "Create your recruiter account"
            : "Upload your company logo"}
        </p>

        {/* Login Form */}
        {state === "Login" && (
          <>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3">
              <img src={assets.email_icon} alt="" />
              <input
                type="email"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none text-sm w-full"
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3">
              <img src={assets.lock_icon} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none text-sm w-full"
                required
              />
            </div>
          </>
        )}

        {/* Sign Up Step 1 */}
        {state === "Sign Up" && !isTextDataSubmitted && (
          <>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Company Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="outline-none text-sm w-full"
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3">
              <img src={assets.email_icon} alt="" />
              <input
                type="email"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none text-sm w-full"
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3">
              <img src={assets.lock_icon} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none text-sm w-full"
                required
              />
            </div>
          </>
        )}

        {/* Sign Up Step 2 (Logo Upload) */}
        {state === "Sign Up" && isTextDataSubmitted && (
          <div className="flex flex-col items-center gap-4 my-8 justify-center">
            <label htmlFor="image" className="cursor-pointer">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="upload"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <input
                id="image"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <p className="text-sm text-center">Upload Company Logo (Optional)</p>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 mt-4 rounded-full"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "Next"}
        </button>

        {/* Toggle Login / Signup */}
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Sign Up");
                setIsTextDataSubmitted(false);
              }}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        {/* Close Button */}
        <img
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="close"
        />
      </form>
    </div>
  );
};

export default RecuriterLogin;
