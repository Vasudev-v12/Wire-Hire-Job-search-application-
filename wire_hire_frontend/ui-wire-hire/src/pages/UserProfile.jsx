import { useState } from "react";
import { Upload, FileText, Save } from "lucide-react";

export default function Profile() {
  const [resume, setResume] = useState(null);

  const appliedJobs = [
    {
      company: "Google",
      role: "Machine Learning Engineer",
      date: "12 Jun 2026",
      status: "Under Review",
    },
    {
      company: "Amazon",
      role: "AI Research Intern",
      date: "10 Jun 2026",
      status: "Interview",
    },
    {
      company: "Microsoft",
      role: "Backend Developer",
      date: "4 Jun 2026",
      status: "Rejected",
    },
    {
      company: "NVIDIA",
      role: "Computer Vision Engineer",
      date: "18 Jun 2026",
      status: "Offer",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            My Profile
          </h1>

          <p className="text-slate-500 mt-1">
            Keep your profile updated for better AI recommendations.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
          <Save size={18} />
          Save Profile
        </button>
      </div>

      {/* Completion */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold text-slate-700">
            Profile Completion
          </h2>

          <span className="text-blue-600 font-semibold">
            80%
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <div className="bg-blue-600 h-3 rounded-full w-4/5"></div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">

        {/* Left Side */}

        <div className="col-span-8 space-y-8">

          {/* Personal Details */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <input placeholder="Full Name" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input placeholder="Email" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input placeholder="Phone Number" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input placeholder="Location" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          {/* Professional */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
              Professional Details
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <input placeholder="Current Role" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input placeholder="Experience (Years)" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input placeholder="Expected Salary" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input placeholder="Preferred Location" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <textarea
              rows="4"
              placeholder="Skills (Python, React, FastAPI, Machine Learning...)"
              className="input mt-5"
            />

            <textarea
              rows="3"
              placeholder="Education"
              className="input mt-5"
            />
          </div>

          {/* Social */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
              Social Profiles
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {/* <Github className="text-slate-500" /> */}

                <input
                  placeholder="https://github.com/username"
                 className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* <Linkedin className="text-blue-600" /> */}

                <input
                  placeholder="https://linkedin.com/in/username"
                 className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="col-span-4 space-y-8">

          {/* Resume */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-5">
              Resume
            </h2>

            <label className="border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 p-8 flex flex-col items-center cursor-pointer">
              <Upload className="text-blue-600 mb-3" size={35} />

              <p className="font-medium">
                Upload Resume (PDF)
              </p>

              <p className="text-sm text-slate-500 mt-2">
                AI will automatically fill your profile.
              </p>

              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
              />
            </label>

            {resume && (
              <div className="mt-5 flex items-center gap-2 text-green-600">
                <FileText size={18} />
                {resume.name}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold mb-4">
              AI Resume Extraction
            </h2>

            <ul className="space-y-3 text-slate-600">
              <li>✔ Name</li>
              <li>✔ Skills</li>
              <li>✔ Education</li>
              <li>✔ Experience</li>
              <li>✔ Projects</li>
              <li>✔ Certifications</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6">
          Applied Jobs
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="pb-4">Company</th>
              <th className="pb-4">Role</th>
              <th className="pb-4">Applied On</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {appliedJobs.map((job, index) => (
              <tr key={index} className="border-b border-slate-100">
                <td className="py-4">{job.company}</td>
                <td>{job.role}</td>
                <td>{job.date}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      job.status === "Offer"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Interview"
                        ? "bg-blue-100 text-blue-700"
                        : job.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}