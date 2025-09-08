
import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user } = useUser(); // Clerk user
  const { getToken } = useAuth(); // Clerk token

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // ---------------- Fetch Jobs ----------------
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) setJobs(data.jobs);
      else {
        toast.error(data.message);
        setJobs(jobsData); // fallback
      }
    } catch (error) {
      console.error("Error fetching jobs:", error.response?.data || error.message);
      toast.error("Could not load jobs");
      setJobs(jobsData); // fallback
    }
  };

  // ---------------- Fetch Company Data ----------------
  const fetchCompanyData = async () => {
    if (!companyToken) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });

      if (data.success) setCompanyData(data.company);
      else toast.error(data.message);
    } catch (error) {
      console.error("Error fetching company data:", error.response?.data || error.message);
      toast.error("Could not load company data");
    }
  };

  // ---------------- Fetch User Data ----------------
  const fetchUserData = async () => {
    if (!user) return;

    try {
      const token = await getToken();
      if (!token) return console.warn("Clerk token not ready yet");

      const { data } = await axios.get(`${backendUrl}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setUserData(data.user);
      else {
        setUserData(null);
        toast.error(data.message);
      }
    } catch (error) {
      setUserData(null);
      console.error("Error fetching user:", error.response?.data || error.message);
    }
  };

  // ---------------- Fetch User Applications ----------------
  const fetchUserApplications = async () => {
    if (!user) return;

    try {
      const token = await getToken();
      if (!token) return console.warn("Clerk token not ready yet");

      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setUserApplications(data.applications);
      else toast.error(data.message);
    } catch (error) {
      console.error("Error fetching applications:", error.response?.data || error.message);
    }
  };

  // ---------------- Initial Load ----------------
  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) setCompanyToken(storedCompanyToken);
  }, []);

  // ---------------- Company Token Changes ----------------
  useEffect(() => {
    if (companyToken) fetchCompanyData();
  }, [companyToken]);

  // ---------------- User Changes (Clerk) ----------------
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    } else {
      setUserData(null);
      setUserApplications([]);
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,
        jobs,
        setJobs,
        showRecruiterLogin,
        setShowRecruiterLogin,
        companyData,
        setCompanyData,
        backendUrl,
        companyToken,
        setCompanyToken,
        userData,
        setUserData,
        userApplications,
        setUserApplications,
        fetchUserData,
        fetchUserApplications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};



// import { createContext, useEffect, useState } from "react";
// import { jobsData } from "../assets/assets";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useAuth, useUser } from "@clerk/clerk-react";

// export const AppContext = createContext();

// export const AppContextProvider = (props) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const { user } = useUser();
//   const { getToken } = useAuth();

//   const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
//   const [isSearched, setIsSearched] = useState(false);
//   const [jobs, setJobs] = useState([]);
//   const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
//   const [companyToken, setCompanyToken] = useState(null);
//   const [companyData, setCompanyData] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [userApplications, setUserApplications] = useState([]);

//   // ---------------- Fetch Jobs ----------------
//   const fetchJobs = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/jobs`);
//       if (data.success) {
//         setJobs(data.jobs);
//         console.log("Jobs loaded:", data.jobs);
//       } else {
//         toast.error(data.message);
//         setJobs(jobsData); // fallback
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error.response?.data || error.message);
//       toast.error("Could not load jobs");
//       setJobs(jobsData); // fallback
//     }
//   };

//   // ---------------- Fetch Company Data ----------------
//   const fetchCompanyData = async () => {
//     if (!companyToken) return;

//     try {
//       const { data } = await axios.get(`${backendUrl}/api/company/company`, {
//         headers: { Authorization: `Bearer ${companyToken}` },
//       });

//       if (data.success) {
//         setCompanyData(data.company);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching company data:", error.response?.data || error.message);
//       toast.error("Could not load company data");
//     }
//   };

//   // ---------------- Fetch User Data ----------------
//   const fetchUserData = async () => {
//     if (!user) return;

//     try {
//       const token = await getToken();
//       if (!token) {
//         console.warn("No Clerk token available yet");
//         return;
//       }

//       const { data } = await axios.get(`${backendUrl}/api/users/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         setUserData(data.user);
//       } else {
//         setUserData(null);
//         toast.error(data.message);
//       }
//     } catch (error) {
//       setUserData(null);
//       console.error("Error fetching user:", error.response?.data || error.message);
//     }
//   };

//   // ---------------- Fetch User Applications ----------------
//   const fetchUserApplications = async () => {
//     if (!user) return;

//     try {
//       const token = await getToken();
//       if (!token) {
//         console.warn("No Clerk token available yet");
//         return;
//       }

//       const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         setUserApplications(data.applications);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching applications:", error.response?.data || error.message);
//     }
//   };

//   // ---------------- useEffect: Initial Load ----------------
//   useEffect(() => {
//     fetchJobs();

//     const storedCompanyToken = localStorage.getItem("companyToken");
//     if (storedCompanyToken) {
//       setCompanyToken(storedCompanyToken);
//     }
//   }, []);

//   // ---------------- useEffect: Company Token Changes ----------------
//   useEffect(() => {
//     if (companyToken) {
//       fetchCompanyData();
//     }
//   }, [companyToken]);

//   // ---------------- useEffect: User Changes ----------------
//   useEffect(() => {
//     if (user) {
//       fetchUserData();
//       fetchUserApplications();
//     } else {
//       setUserData(null);
//       setUserApplications([]);
//     }
//   }, [user]);

//   const value = {
//     searchFilter,
//     setSearchFilter,
//     isSearched,
//     setIsSearched,
//     jobs,
//     setJobs,
//     showRecruiterLogin,
//     setShowRecruiterLogin,
//     companyData,
//     setCompanyData,
//     backendUrl,
//     userApplications,
//     setUserApplications,
//     userData,
//     setUserData,
//     fetchUserData,
//     fetchUserApplications,
//     companyToken,
//     setCompanyToken,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };

