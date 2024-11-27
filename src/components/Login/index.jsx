import { useState } from "react";
import { useNavigate } from "react-router-dom";
import APILogin from "../../services/login";
import APIUsers from "../../services/user";
import logo from "../../assets/images/logo.png";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await APILogin.post({ username, password });

      const token = loginResponse.data.access;
      const refreshToken = loginResponse.data.refresh;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const userResponse = await APIUsers.get();
      const users = userResponse.data;

      const currentUser = users.find((user) => user.username === username);
      const loggedInUserId = currentUser.id;
      localStorage.setItem("userId", loggedInUserId);

      if (currentUser) {
        if (currentUser.superadmin) {
          onLogin("superadmin");
          navigate("/superadmin/ombor");
        } else if (currentUser.omborchi) {
          onLogin("omborchi");
          navigate("/omborchi/ombor");
        } else if (currentUser.komendant) {
          onLogin("komendant");
          navigate("/komendant/ombor");
        } else if (currentUser.prorektor) {
          onLogin("prorektor");
          navigate("/prorektor/ombor");
        } else if (currentUser.bugalter) {
          onLogin("bugalter");
          navigate("/bugalter/ombor");
        } else if (currentUser.xojalik_bolimi) {
          onLogin("xojalik_bolimi");
          navigate("/xojalik_bolimi/ombor");
        } else if (currentUser.it_park) {
          onLogin("it_park");
          navigate("/it_park/ombor");
        } else {
          setErrorMessage("No access level assigned");
        }
      } else {
        setErrorMessage("User not found");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto translate-y-3/4">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center mb-3">
          <img
            src={logo}
            className="flex w-12 h-auto object-cover mr-2"
            alt="QDPI logo"
          />
          <p className="font-semibold text-md w-[200px] h-15 text-gray-700">
            Qo'qon davlat pedagogika instituti ombori
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Foydalanuvchi nomi
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Parol
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-3">
            {errorMessage}
          </p>
        )}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#004269] hover:bg-[#004269] w-full text-white font-bold text-center p-2 rounded focus:outline-none focus:shadow-outline"
          >
            Kirish
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
