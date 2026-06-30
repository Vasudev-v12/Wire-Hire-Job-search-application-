
import React, { useState, useEffect } from "react";
import { Edit3, Save, X, Upload, User } from "lucide-react";
import githubLogo from "../assets/github.png";
import linkedinLogo from "../assets/linkedin.png";
import api from "../api/api";

export default function Profile() {
  const initial = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "+91 ",
    location: "",
    currentRole: "",
    experience: "",
    expectedSalary: "",
    preferredLocation: "",
    skills: "",
    education: "",
    github: "",
    linkedin: ""
  };

  const [profile, setProfile] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const loadProfile = async () => {
    try {
        const response = await api.get("/user/profile");
        console.log(response.data);
        setProfile(response.data);
        setDraft(response.data);
    }
    catch (err) {
        console.log(err);
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
        const formData = new FormData();
        formData.append("picture", file);
        const response = await api.post(
            "/user/profile/picture",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        setProfile(prev => ({
            ...prev, profile_picture: response.data.profile_picture
        }));
    }
    catch (err) {
        console.log(err.response.data);
    }
  };

  const uploadResume = async (file) => {
    try {
        const formData = new FormData();
        formData.append("resume", file);

        const response = await api.post(
            "/user/profile/resume",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        const extracted = response.data.profile;
        console.log(extracted);
        setProfile(prev => ({
            ...prev,
            ...extracted,
            skills: extracted.skills?.join(", ") || "",
            education: JSON.stringify(extracted.education ?? [])
        }));

        setDraft(prev => ({
            ...prev,
            ...extracted,
            skills: extracted.skills?.join(", ") || "",
            education: JSON.stringify(extracted.education ?? [])
        }));
    } catch (err) {
        console.log(err.response?.data);
    }
  };
 

  const saveProfile = async () => {
    try {
        // Upload profile picture
        if (profileImageFile) {
            await uploadProfilePicture(profileImageFile);
        }

        // Upload resume
        if (resumeFile) {
            await uploadResume(resumeFile);
        }

        // Update profile
        const response = await api.put(
            "/user/profile",
            draft
        );
        setProfile(response.data);
        setDraft(response.data);
        setEditing(false);
        alert("Profile updated successfully.");
    } catch (err) {
        console.error(err.response.data);
        alert("Unable to save profile.");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const jobs = [
    { company:"Google", role:"ML Engineer", date:"12 Jun 2026", status:"Under Review"},
    { company:"Amazon", role:"AI Intern", date:"15 Jun 2026", status:"Interview"},
    { company:"Microsoft", role:"Backend Dev", date:"18 Jun 2026", status:"Rejected"},
    { company:"NVIDIA", role:"CV Engineer", date:"22 Jun 2026", status:"Offer"},
  ];

  const update=(k,v)=>setDraft({...draft,[k]:v});
  const inputClass = "w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
  <div className="min-h-screen bg-slate-50 p-8">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500">Maintain your profile for better job recommendations.</p>
      </div>
      {!editing?
      <button onClick={()=>setEditing(true)} className="bg-blue-600 text-white px-5 py-3 rounded-xl flex gap-2"><Edit3 size={18}/>Edit Profile</button>
      :
      <div className="flex gap-3">
        <button onClick={()=>{setProfile(draft);setEditing(false);saveProfile()}} className="bg-blue-600 text-white px-5 py-3 rounded-xl flex gap-2"><Save size={18}/>Save</button>
        <button onClick={()=>{setDraft(profile);setEditing(false);}} className="border px-5 py-3 rounded-xl flex gap-2"><X size={18}/>Cancel</button>
      </div>}
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          {avatar?<img src={avatar} className="w-32 h-32 rounded-full mx-auto object-cover"/>:
          <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center mx-auto"><User size={60}/></div>}
          {editing&&<>
            <label className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
              Change Picture
              <input hidden type="file" accept="image/*" onChange={e=>{
                const f=e.target.files[0];
                if(f){
                  setProfileImageFile(f);
                  setAvatar(URL.createObjectURL(f));
                }
              }}/>
            </label>
          </>}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Resume</h2>
          <p>{resume}</p>
          {editing&&<>
            <label className="mt-4 flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
              <Upload size={18}/> Upload Resume
              <input hidden type="file" accept=".pdf" onChange={e=>{
                if(e.target.files[0]) {setResumeFile(e.target.files[0]); setResume(e.target.files[0].name)};
              }}/>
            </label>
            <p className="text-xs text-slate-500 mt-2">AI replacement dialog will be implemented in Part 2.</p>
          </>}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-5">
              <p className="text-sm text-slate-500 mb-1">
                  First Name
              </p>
              {
                  editing ?
                  <input
                      type="text"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={draft.first_name||""}
                      onChange={(e)=>
                          setDraft(prev=>({
                              ...prev,
                              first_name:e.target.value
                          }))
                      }
                  />
                  :
                  <p className="text-slate-800 font-medium">
                      {profile.first_name}
                  </p>
              }
            </div>
            <div className="mb-5">
              <p className="text-sm text-slate-500 mb-1">
                  Last Name
              </p>
              {
                  editing ?
                  <input
                      type="text"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={draft.last_name||""}
                      onChange={(e)=>
                          setDraft(prev=>({
                              ...prev,
                              last_name:e.target.value
                          }))
                      }
                  />
                  :
                  <p className="text-slate-800 font-medium">
                      {profile.last_name}
                  </p>
              }
            </div>

            <div className="mb-5">
                <p className="text-sm text-slate-500 mb-1">
                    Email
                </p>

                {
                    editing ?

                    <input
                        type="email"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={JSON.parse(localStorage.getItem("user")).email||""}
                        onChange={(e)=>
                            setDraft(prev=>({
                                ...prev,
                                email:e.target.value
                            }))
                        }
                    />
                    :
                    <p className="text-slate-800 font-medium">
                        {profile.email}
                    </p>
                }
            </div>
            
            <div className="mb-5">
                <p className="text-sm text-slate-500 mb-1">
                    Phone
                </p>
                {
                    editing ?
                    <input
                        type="text"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={draft.phone||""}
                        onChange={(e)=>
                            setDraft(prev=>({
                                ...prev,
                                phone:e.target.value
                            }))
                        }
                    />
                    :
                    <p className="text-slate-800 font-medium">
                        {profile.phone}
                    </p>
                }
            </div>
            
            <div className="mb-5">
                <p className="text-sm text-slate-500 mb-1">
                    Location
                </p>
                {
                    editing ?
                    <input
                        type="text"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={draft.location||""}
                        onChange={(e)=>
                            setDraft(prev=>({
                                ...prev,
                                location:e.target.value
                            }))
                        }
                    />
                    :
                    <p className="text-slate-800 font-medium">
                        {profile.location}
                    </p>
                }
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-5">
              <p className="text-sm text-slate-500 mb-1">
                  Current Role
              </p>
              {
                  editing ?
                  <input
                      type="text"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={draft.current_role||""}
                      onChange={(e)=>
                          setDraft(prev=>({
                              ...prev,
                              current_role:e.target.value
                          }))
                      }
                  />
                  :
                  <p className="text-slate-800 font-medium">
                      {profile.current_role}
                  </p>
              }
            </div>
            <div className="mb-5">
              <p className="text-sm text-slate-500 mb-1">
                  Experience
              </p>
              {
                  editing ?
                  <input
                      type="text"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={draft.experience||""}
                      onChange={(e)=>
                          setDraft(prev=>({
                              ...prev,
                              experience:e.target.value
                          }))
                      }
                  />
                  :
                  <p className="text-slate-800 font-medium">
                      {profile.experience}
                  </p>
              }
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm text-slate-500 mb-1">
                Skills
            </p>
            {
                editing ?
                <textarea
                    rows={4}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={draft.skills||""}
                    onChange={(e)=>
                        setDraft(prev=>({
                            ...prev,
                            skills:e.target.value
                        }))
                    }
                />
                :
                <p className="text-slate-800 font-medium whitespace-pre-wrap">
                    {profile.skills}
                </p>
            }
          </div>
          <div className="mb-5">
              <p className="text-sm text-slate-500 mb-1">
                  Education
              </p>
              {
                  editing ?
                  <input
                      type="text"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={draft.education||""}
                      onChange={(e)=>
                          setDraft(prev=>({
                              ...prev,
                              education:e.target.value
                          }))
                      }
                  />
                  :
                  <p className="text-slate-800 font-medium">
                      {profile.education}
                  </p>
              }
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="mb-5">
              <p className="text-sm flex gap-2 text-slate-500 mb-1">
                <img src={githubLogo} width="24px" height="24px"/>
                  GitHub
              </p>
              {
                  editing ?
                  <input
                      type="url"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={draft.github||""}
                      onChange={(e)=>
                          setDraft(prev=>({
                              ...prev,
                              github:e.target.value
                          }))
                      }
                  />
                  :
                  <>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.github}
                  </a>
                  </>
              }
          </div>

          <div className="mb-5">
            <p className="text-sm flex gap-2 text-slate-500 mb-1">
              <img src={linkedinLogo} width="24px" height="24px"/>
                LinkedIn
            </p>
            {
                editing ?
                <input
                    type="url"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={draft.linkedin||""}
                    onChange={(e)=>
                        setDraft(prev=>({
                            ...prev,
                            linkedin:e.target.value
                        }))
                    }
                />
                :
                <>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> 
                {profile.linkedin}
                </a>
                </>
              }
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Applied Jobs</h2>
          <table className="w-full">
            <thead><tr className="border-b"><th className="text-left py-2">Company</th><th>Role</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {jobs.map((j,i)=><tr key={i} className="border-b">
                <td className="py-3">{j.company}</td><td>{j.role}</td><td>{j.date}</td><td>{j.status}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>);
}
