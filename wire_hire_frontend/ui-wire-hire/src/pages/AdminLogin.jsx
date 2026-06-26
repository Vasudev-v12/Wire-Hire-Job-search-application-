import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async (e) => {

    e.preventDefault();

    const res = await api.post(
      "/admin/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
      "access_token",
      res.data.access_token
    );

    localStorage.setItem("role", "admin");

    navigate("/admin/dashboard");
  };

  return (
    <form
      onSubmit={login}
      className="max-w-md mx-auto mt-20"
    >
      <input
        className="border p-2 w-full"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 w-full mt-3"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="bg-red-600 text-white px-4 py-2 mt-4"
      >
        Login
      </button>
    </form>
  );
}