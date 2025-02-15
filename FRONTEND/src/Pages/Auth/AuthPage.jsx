import React, { useState } from "react";
import bidImage from "../../assets/bids.avif";
import { BASE_URL } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Slices/authSlice";
import { ToastContainer, toast } from "react-toastify";

function AuthPage() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const toggleAuthMode = () => {
    console.log("Toggling auth mode. Current isLogin:", isLogin);
    setIsLogin((prev) => !prev);
    setMessage(""); // Clear messages when toggling
  };
  console.log("isLogin", isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let response;
      if (isLogin) {
        response = await fetch(`${BASE_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } else {
        // Sign-Up API call
        if (password !== confirmPassword) {
          setMessage("Passwords do not match!");
          setLoading(false);
          return;
        }
        response = await fetch(`${BASE_URL}/users/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
      }

      const data = await response.json();

      const handleLoginSuccess = (token, userId) => {
        console.log("token is", token);
        console.log("user id is", userId);
        dispatch(login({ token, userId }));
        localStorage.setItem("token", token);
        navigate("/");
      };
      if (response.ok) {
        console.log(data.token);
        setMessage(isLogin ? "Login successful!" : "Sign-up successful!");
        toast.success(isLogin ? "Login successful!" : "Sign-up successful!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            if (!isLogin) {
              toggleAuthMode();

              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }
          },
        });

        isLogin && handleLoginSuccess(data.token, data.data.id);
      } else {
        setMessage(data.message || "Something went wrong!");
        toast.error(data.message || "Something went wrong!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#D4D6EA] w-full h-screen flex justify-center py-20">
      <div className="flex justify-center items-center">
        {/* Left Section */}
        <div className="bg-white w-[50%] h-full px-4 py-6">
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col py-10 px-5"
          >
            <div>
              <h2 className="text-3xl font-bold">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h2>
              <span>
                {isLogin ? "Sign in to your account" : "Sign up for an account"}
              </span>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col mt-10">
              {!isLogin && (
                <>
                  {/* Additional Field for Sign-Up */}
                  <span className="mt-2 text-sm font-medium">Name</span>
                  <input
                    type="text"
                    placeholder="Enter your Name"
                    className="w-[80%] border p-2 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </>
              )}

              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-[80%] border p-2 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="mt-2 text-sm font-medium">Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-[80%] border p-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <>
                  {/* Additional Field for Sign-Up */}
                  <span className="mt-2 text-sm font-medium">
                    Confirm Password
                  </span>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-[80%] border p-2 rounded-md"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </>
              )}
            </div>

            {/* Button */}
            <span className="w-full mt-12">
              <button
                type="submit"
                className={`p-2 text-white font-bold rounded-md w-[80%] ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
                }`}
                disabled={loading}
              >
                {loading ? "Please Wait..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </span>

            <div className="mt-2 flex flex-row gap-2 items-center justify-center w-[80%] text-sm">
              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <span
                className="text-blue-900 cursor-pointer underline"
                onClick={toggleAuthMode}
              >
                {isLogin ? "Register Here" : "Login Here"}
              </span>
            </div>
          </form>
        </div>

        <div className="bg-blue-500 w-[50%] h-full">
          <img src={bidImage} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AuthPage;
