import React from "react";
import { useState } from "react";
import LoadingSpinner from "../../component/Loading";
import api from "../../utils/api";

export default function Register({ handleAppbar }) {
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    handle_value2();
    api.userRegister({ email, password, first_name, last_name })
    .then((response) => {
      const result = response.data;
      if (result.err !== "") {
        localStorage.setItem("user-provider", JSON.stringify(result));
        localStorage.setItem("token", result.token);
        window.onload.herf('/')
        console.log("Register and Login successful");
      }
    })
      .catch((err) => {
        console.log("An error occurred. Please try again.", err);
      })
      .finally(() => {
        handle_value();
      });
  };

  const handle_value = () => {
    handleAppbar(false);
  };
 
  const handle_value2 = () => {
    handleAppbar(true);
  };
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="absolute top-5 right-5 text-3xl">
          </div>

          <div className=" p-6  w-full max-w-md">
            {/* <div className="flex justify-center mb-6">
              <img src={Logo} alt="Logo" width={200} height={200} />
            </div> */}

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
              <label className="text-left">ชื่อ</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="text"
                  placeholder="First Name"
                  value={first_name}
                  onChange={(e) => setFirst_name(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
              <label className="text-left">นามสกุล</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="text"
                  placeholder="Last Name"
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
              <label className="text-left">อีเมล</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
              <label className="text-left">รหัสผ่าน</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                onClick={handleLogin}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
