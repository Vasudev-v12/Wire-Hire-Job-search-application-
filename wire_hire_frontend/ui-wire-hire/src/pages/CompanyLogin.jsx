import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function CompanyLogin() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async (e) => {

    e.preventDefault();

    const res = await api.post(
      "/company/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
      "access_token",
      res.data.access_token
    );
    localStorage.setItem("role", "company");
    navigate("/company/dashboard");
  };

  return (
    <form
      onSubmit={login}
      className="max-w-md mx-auto mt-20"
    >
      <input
        placeholder="Email"
        className="border p-2 w-full"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mt-3"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 mt-4"
      >
        Login
      </button>
    </form>
  );
}