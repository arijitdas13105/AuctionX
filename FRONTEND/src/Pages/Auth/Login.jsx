import React from "react";
import bidImgae from "../../assets/bids.avif";
function Login() {
  return (
    <div className="bg-[#D4D6EA] w-full h-screen  flex justify-center  py-20">
      <div className="   flex  justify-center  items-center ">
        <div className="bg-white w-[50%] h-full    px-4 py-6 ">
          <div className="mt-10  flex flex-col py-10 px-5  ">
            <div>
              <h2 className="text-3xl font-bold ">Welcome Back</h2>
              <span>Sign in to your account</span>
            </div>

            <div className="flex flex-col mt-10 ">
              <span className="text-sm font-medium ">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-[80%] border  p-2 rounded-md"
              />
              <span className="mt-2 text-sm font-medium">Password</span>
              <div className="flex flex-col relative w-[80%]">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="border   p-2 rounded-md"
                />
                <span className="text-blue-500 cursor-pointer absolute top-10 right-2">
                  Forgot Password
                </span>
              </div>
            </div>
            <span className="w-full mt-12">
              <button className="bg-blue-500 p-2 text-white font-bold rounded-md  w-[80%] ">
                Login
              </button>
            </span>
            <div className="mt-2 flex flex-row gap-2 items-center justify-center w-[80%] text-sm ">
              <span className="">Dont have an account?</span>
              <span className="text-blue-900 cursor-pointer underline">
                Register Here
              </span>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 w-[50%] h-full">
          <img src={bidImgae} alt="" className="w-full h-full " />
        </div>
      </div>
    </div>
  );
}

export default Login;
