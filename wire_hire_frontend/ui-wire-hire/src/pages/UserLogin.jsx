import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function UserLogin() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:8070/auth/user/login",
        formData
      );

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/user/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 mb-8">
          Sign in to your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <div className="mt-6 text-center">

          <p>
            Don't have an account?

            <Link to="/user/register" className="text-blue-600 ml-2">
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}