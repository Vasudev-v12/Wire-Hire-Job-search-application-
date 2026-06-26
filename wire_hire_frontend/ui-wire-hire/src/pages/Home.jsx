import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex">
                <div className="text-2xl font-bold text-blue-600">
                    Wire
                </div>
                <div className="text-2xl font-bold text-black-600">
                    Hire
                </div>
            </div>
          

          <div className="flex gap-4">
            <Link to="/user/login" className="text-slate-700 hover:text-blue-600">
              Login
            </Link>

            <Link to="/user/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Register
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <h1 className="text-6xl font-bold text-slate-800 leading-tight">
              Find Your
              <span className="text-blue-600"> Dream Job</span>
            </h1>

            <p className="mt-6 text-xl text-slate-600">
              Connect with top companies and discover
              opportunities that match your skills.
            </p>

            <div className="mt-10 flex gap-4">

              <Link
                to="/user/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg"
              >
                Get Started
              </Link>

              <Link
                to="/company/register"
                className="border border-slate-300 px-8 py-4 rounded-xl font-medium"
              >
                Hire Talent
              </Link>

            </div>

          </div>

          <div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">

              <div className="space-y-4">

                <div className="bg-blue-50 p-5 rounded-xl">
                  <h3 className="font-semibold">
                    Software Engineer
                  </h3>
                  <p className="text-slate-500">
                    Google • Remote
                  </p>
                </div>

                <div className="bg-green-50 p-5 rounded-xl">
                  <h3 className="font-semibold">
                    ML Engineer
                  </h3>
                  <p className="text-slate-500">
                    Amazon • Bengaluru
                  </p>
                </div>

                <div className="bg-purple-50 p-5 rounded-xl">
                  <h3 className="font-semibold">
                    Backend Developer
                  </h3>
                  <p className="text-slate-500">
                    Microsoft • Hyderabad
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}