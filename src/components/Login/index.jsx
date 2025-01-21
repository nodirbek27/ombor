import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import Logo from "../../assets/images/logo.png";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import APILogin from "../../services/login";
import APIUsers from "../../services/user";
import CryptoJS from "crypto-js";
import LoadnigTxt from "../../components/LoadingTxt";

const Login = () => {
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(
    parseInt(localStorage.getItem("attemptCount")) || 0
  );
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(attemptCount >= 2);
  const canvasRef = useRef(null);

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaText = "";
    for (let i = 0; i < 6; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous captcha
      ctx.font = "20px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(captchaText, 10, 30);

      // Draw a random line across the captcha for extra security
      ctx.strokeStyle = "#000"; // Color of the line
      ctx.lineWidth = 1; // Thickness of the line
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    localStorage.setItem("captcha", captchaText);
  };

  useEffect(() => {
    // Generate a new CAPTCHA on component mount or refresh
    if (showCaptcha) {
      generateCaptcha();
    }
  }, [showCaptcha]);

  localStorage.removeItem("data");
  const ShifredTxt = (key, content) => {
    const shifredTxt = CryptoJS.AES.encrypt(
      JSON.stringify(content),
      String(key)
    ).toString();
    return shifredTxt;
  };

  const [eye, setEye] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Kamida 3ta belgi bo'lishi kerak!")
      .required("Kamida 3ta belgi bo'lishi kerak!"),
    password: Yup.string()
      .min(3, "Kamida 3ta belgi bo'lishi kerak!")
      .required("Kamida 3ta belgi bo'lishi kerak!"),
  });

  const data = JSON.parse(localStorage.getItem("data"));

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (showCaptcha && inputCaptcha !== localStorage.getItem("captcha")) {
        setError("Captcha noto'g'ri kiritildi");
        setInputCaptcha("");
        generateCaptcha(); // Regenerate captcha on incorrect input
        return;
      }

      if (!errMessage && !isLoading) {
        setIsLoading(true);
        try {
          const res = await APILogin.post({
            username: values.username,
            password: values.password,
          });

          if (res.data && res.data.access) {
            try {
              const resUser = await APIUsers.get(
                values.username,
                res.data.access
              );
              const [data] = resUser.data;
              const jsonData = JSON.stringify({
                username: ShifredTxt("username-001", values.username),
                password: ShifredTxt("password-001", values.password),
                remember: values.remember,
                first_name: ShifredTxt("first_name-001", data?.first_name),
                last_name: ShifredTxt("last_name-001", data?.last_name),
                token: ShifredTxt("token-001", res.data?.access),
                role: ShifredTxt("role-001", data?.role),
                id: ShifredTxt("id-001", data?.id),
              });
              localStorage.setItem("data", jsonData);

              if (data.role) {
                if (data.role === "admin") {
                  navigate("/superadmin/ombor");
                } else if (data.role === "omborchi") {
                  navigate("/omborchi/ombor");
                } else if (data.role === "komendant") {
                  navigate("/komendant/ombor");
                } else if (data.role === "prorektor") {
                  navigate("/prorektor/talabnoma");
                } else if (data.role === "bugalter") {
                  navigate("/bugalter/talabnoma");
                } else if (data.role === "xojalik") {
                  navigate("/xojalik_bolimi/talabnoma");
                } else if (data.role === "rttm") {
                  navigate("/it_park/talabnoma");
                } else {
                  setErrMessage("No access level assigned");
                }
                setAttemptCount(0);
                setShowCaptcha(false);
                setError("");
                localStorage.removeItem("captcha");
                localStorage.removeItem("attemptCount");
              } else {
                setErrMessage("User not found");
              }
            } catch (err) {
              console.error("Admin ma'lumotlarini olishda xatolik:", err);
            }
          } else {
            setErrMessage("Username or Password wrong!");
            setTimeout(() => {
              setErrMessage("");
            }, 3000);
          }
        } catch (error) {
          console.error("Error during API call:", error);
          setErrMessage("Username or Password wrong!");
          setTimeout(() => {
            setErrMessage("");
          }, 3000);
          const newAttemptCount = attemptCount + 1;
          setAttemptCount(newAttemptCount);
          localStorage.setItem("attemptCount", newAttemptCount);

          if (newAttemptCount >= 2) {
            setShowCaptcha(true);
          }
        } finally {
          setIsLoading(false);
        }
      }
    },
  });

  const handleClickPassword = () => {
    const btn = document.getElementById("password");
    btn.type = btn.type === "text" ? "password" : "text";
    btn.type === "text" ? setEye(true) : setEye(false);
  };

  useEffect(() => {
    if (data) {
      if (data.remember) {
        navigate("/analitka");
      }
    }
  }, [data, navigate]);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center ">
      <div className="flex flex-col justify-center gap-2 border rounded-md shadow-2xl p-4 -mt-20">
        <div className="w-[300px] h-full">
          <div className="flex justify-center">
            <img
              className="w-[50px] lg:w-[60px] xl:w-[70px] 2xl:w-[80px] h-auto"
              src={Logo}
              alt="logo"
            />
          </div>
          <h1 className="text-center font-bold text-[1.3rem] lg:text-[1.4rem]">
            QDPI Ombor
          </h1>
        </div>
        <form
          className="w-[300px] flex flex-col gap-2"
          onSubmit={formik.handleSubmit}
        >
          <label className="w-full flex flex-col gap-1" htmlFor="username">
            Login
            <input
              disabled={isLoading ? true : false}
              type="text"
              id="username"
              className={`${
                formik.errors.username
                  ? "border border-red-600 focus:border-red-600 focus:outline-red-600"
                  : "focus:border-green-600 focus:outline-green-600"
              } input input-sm input-bordered w-full max-w-xs dark:bg-stone-100`}
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </label>
          {formik.errors.username && (
            <div className="text-xs text-red-600">{formik.errors.username}</div>
          )}
          <label
            className="relative flex flex-col gap-1 mb-3"
            htmlFor="password"
          >
            Parol
            <input
              disabled={isLoading ? true : false}
              type="password"
              id="password"
              className={`${
                formik.errors.password
                  ? "border border-red-600 focus:border-red-600 focus:outline-red-600"
                  : "focus:border-green-600 focus:outline-green-600"
              } input input-sm input-bordered w-full max-w-xs dark:bg-stone-100`}
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <div
              onClick={handleClickPassword}
              className="cursor-pointer absolute top-[50%] right-3 font-bold"
            >
              {
                <>
                  <BsFillEyeFill
                    className={`${eye && "hidden"} text-[1.2rem] mt-1`}
                  />
                  <BsEyeSlashFill
                    className={`${!eye && "hidden"} text-[1.2rem] mt-1`}
                  />
                </>
              }
            </div>
          </label>
          {formik.errors.password && (
            <div className="text-xs text-red-600">{formik.errors.password}</div>
          )}

          {showCaptcha && (
            <div className="flex items-center gap-3 mb-6">
              <canvas
                ref={canvasRef}
                width="100"
                height="40"
                className="border"
              />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Captchani kiriting"
                value={inputCaptcha}
                onChange={(e) => setInputCaptcha(e.target.value)}
              />
            </div>
          )}
          {error && <p className="text-red-500 text-xs italic">{error}</p>}

          <button
            type="submit"
            className={`w-full btn btn-sm text-white ${
              errMessage ? "btn-error" : "btn-success"
            }`}
          >
            {isLoading ? (
              <LoadnigTxt />
            ) : errMessage ? (
              `${errMessage}`
            ) : (
              "Kirish"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
