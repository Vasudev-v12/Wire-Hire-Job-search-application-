import { useState, useEffect } from "react";
import { LogOut, Sparkles, Briefcase, User, Building2 ,MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Profile from "./UserProfile";
import BussinessDashboard from "./Bussiness";
//const navigate = useNavigate();

function Sidebar({page,setPage}){
  const menu=[
    { name:"jobs", icon:<Briefcase size={20}/> },
    { name:"profile", icon:<User size={20}/> },
    { name:"business", icon:<Building2 size={20}/> },
    { name:"logout", icon:<LogOut size={20}/>}
  ];

  return(
    <div className="w-64 bg-white border-r border-slate-200 shadow-sm">
      <div className="flex items-center justify-center h-16 text-2xl font-bold">
        <span className="text-blue-600">
        Wire
        </span>

        <span className="text-slate-900">
        Hire
        </span>
      </div>

      <div className="space-y-3 px-4">
      {
        menu.map(item=>(
          <button
            key={item.name}
            onClick={()=>setPage(item.name)}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl capitalize transition
            ${ page===item.name ? "bg-blue-600 text-white rounded-xl" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600" }`
          }>
          {item.icon}
          {item.name}
          </button>
        ))
      }
      </div>
    </div>
  )
}


function JobCard({job}){
  return(
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transitionduration-300">
    <div className="flex justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
        {job.role}
        </h2>

        <p className="text-blue-600 font-medium">
        {job.company}
        </p>
      </div>

      <span className="bg-slate-100 text-blue-700">
      {job.salary}
      </span>
    </div>

    <div className="flex gap-5 mt-5 text-gray-300">
      <div className="text-slate-500">
        <MapPin size={18}/>
        {job.location}
      </div>

      <div className="flex gap-2">
        <Briefcase size={18}/>
        {job.type}
      </div>
    </div>
    <button className="bg-blue-600 hover:bg-blue-700 text-white">
      Apply
    </button>
  </div>
  )
}

function FilterPanel(){
  return(
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
    <h2 className="text-gray-900">
    Filters
    </h2>
    
    <div className="space-y-4">
      <select className="bg-slate-50 border border-slate-300 focus:border-blue-500">
        <option>Location</option>
        <option>Bangalore</option>
        <option>Chennai</option>
        <option>Remote</option>
      </select>
      <select className="bg-slate-50 border border-slate-300 focus:border-blue-500">
        <option>Experience</option>
        <option>Fresher</option>
        <option>1-3 Years</option>
        <option>3+ Years</option>
      </select>
      <select className="bg-slate-50 border border-slate-300 focus:border-blue-500">
        <option>Job Type</option>
        <option>Remote</option>
        <option>Hybrid</option>
        <option>On Site</option>
      </select>
      <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold">
      Apply Filters
      </button>
    </div>
  </div>
  )
}



function AIAssistant(){
  return(
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="text-blue-600">
        <Sparkles/>
        AI Assistant
      </div>
      <p className="text-gray-300 mt-4">
        Describe your skills and career goals.
        Our AI will recommend the best matching jobs.
      </p>
      <textarea rows={8} placeholder="Example: I know Python, Machine Learning, React..."
      className="bg-gray-50 border-gray-300 focus:ring-cyan-500"
      />
      <button className="bg-blue-600 hover:bg-blue-700">
        Find Best Jobs
      </button>
    </div>
  )
}

export default function UserDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [page,setPage]=useState("jobs");

  useEffect(() => {
    if(page === "logout"){
      logout();
      navigate("/user/login");
    }
  }, [page, logout, setPage]);


  const jobs=[
        {
            company:"Google",
            role:"Machine Learning Engineer",
            location:"Bangalore",
            salary:"₹28 LPA",
            type:"Full Time"
        },
        {
            company:"Microsoft",
            role:"Backend Developer",
            location:"Hyderabad",
            salary:"₹22 LPA",
            type:"Remote"
        },
        {
            company:"Amazon",
            role:"AI Research Intern",
            location:"Chennai",
            salary:"₹80k/month",
            type:"Internship"
        }
  ];

  return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar page={page} setPage={setPage}/>
        <div className="flex-1 p-8 text-gray-900">
          {page==="jobs" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">
                Find Your Dream Job
              </h1>
              <div className="grid grid-cols-12 gap-6">

              <div className="col-span-3">
                <FilterPanel/>
              </div>

              <div className="col-span-6 space-y-5">
                <input placeholder="Search Job" className=" w-full rounded-xl border border-gray-300 bg-white px-5 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"/>
                {
                  jobs.map((job,index)=>(
                    <JobCard key={index} job={job}/>
                  ))
                }
              </div>

              <div className="col-span-3">
                <AIAssistant/>
              </div>

              </div>
            </div>
          )}

          {page==="profile" && (
            <Profile />
          )}

          {page==="business" && (
            <BussinessDashboard />
          )}
        </div>
      </div>
  );
}