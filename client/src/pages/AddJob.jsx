// import React, { useEffect, useRef, useState, useContext } from 'react';
// import Quill from 'quill';
// import { JobCategories, JobLocations } from '../assets/assets';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AddJob = () => {
//   const [title, setTitle] = useState('');
//   const [location, setLocation] = useState(JobLocations[0] || 'Bangalore');
//   const [category, setCategory] = useState(JobCategories[0] || 'Programming');
//   const [level, setLevel] = useState('Beginner level');
//   const [salary, setSalary] = useState(0);

//   const editorRef = useRef(null);
//   const quillRef = useRef(null);

//   const { backendUrl, companyToken } = useContext(AppContext);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const description = quillRef.current.root.innerHTML;

//       if (!title || !description) {
//         toast.error('Title and description are required');
//         return;
//       }

//       // Build FormData (important if backend uses multer)
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('description', description);
//       formData.append('location', location);
//       formData.append('category', category);
//       formData.append('level', level);
//       formData.append('salary', salary);

//       const { data } = await axios.post(
//         `${backendUrl}/api/company/post-job`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${companyToken}`, // safer header format
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (data.success) {
//         toast.success('Job posted successfully!');
//         setTitle('');
//         setSalary(0);
//         quillRef.current.root.innerHTML = '';
//         setCategory(JobCategories[0] || '');
//         setLocation(JobLocations[0] || '');
//         setLevel('Beginner level');
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   useEffect(() => {
//     if (!quillRef.current && editorRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: 'snow',
//         placeholder: 'Write job description here...',
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, false] }],
//             ['bold', 'italic', 'underline'],
//             ['blockquote', 'code-block'],
//             [{ list: 'ordered' }, { list: 'bullet' }],
//             ['link'],
//           ],
//         },
//       });
//     }
//   }, []);

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="container p-4 flex flex-col w-full items-start gap-3"
//     >
//       {/* Job Title */}
//       <div className="w-full">
//         <p className="mb-2">Job Title</p>
//         <input
//           type="text"
//           className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
//           placeholder="Type here"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//       </div>

//       {/* Job Description */}
//       <div className="w-full max-w-lg">
//         <p className="my-2">Job Description</p>
//         <div
//           ref={editorRef}
//           className="h-40 border-2 border-gray-300 rounded p-2"
//         />
//       </div>

//       {/* Job Category, Location, Level */}
//       <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
//         <div>
//           <p className="mb-2">Job Category</p>
//           <select
//             className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {JobCategories.map((cat, index) => (
//               <option key={index} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <p className="mb-2">Job Location</p>
//           <select
//             className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           >
//             {JobLocations.map((loc, index) => (
//               <option key={index} value={loc}>
//                 {loc}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <p className="mb-2">Job Level</p>
//           <select
//             className="w-full px-3 py-2 border-2 border-gray-300 rounded"
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//           >
//             <option value="Beginner level">Beginner level</option>
//             <option value="Mid level">Mid level</option>
//             <option value="Senior level">Senior level</option>
//           </select>
//         </div>
//       </div>

//       {/* Job Salary */}
//       <div>
//         <p className="mb-2">Job Salary</p>
//         <input
//           type="number"
//           min={0}
//           placeholder="2500"
//           value={salary}
//           onChange={(e) => setSalary(e.target.value)}
//           className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
//         />
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
//       >
//         ADD JOB
//       </button>
//     </form>
//   );
// };

// export default AddJob;


import React, { useEffect, useRef, useState, useContext } from 'react';
import Quill from 'quill';
import { JobCategories, JobLocations } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddJob = ({ onJobAdded }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(JobLocations[0] || 'Bangalore');
  const [category, setCategory] = useState(JobCategories[0] || 'Programming');
  const [level, setLevel] = useState('Beginner level');
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { backendUrl, companyToken } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const description = quillRef.current.root.innerHTML;
      if (!title || !description) {
        toast.error('Title and description are required');
        return;
      }

      const payload = {
        title,
        description,
        location,
        category,
        level,
        salary,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (data.success) {
        toast.success('Job posted successfully!');
        // reset form
        setTitle('');
        setSalary(0);
        quillRef.current.root.innerHTML = '';
        setCategory(JobCategories[0] || '');
        setLocation(JobLocations[0] || '');
        setLevel('Beginner level');

        // notify parent to refresh job list
        if (onJobAdded) onJobAdded();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write job description here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
          ],
        },
      });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
      {/* Job Title */}
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input
          type="text"
          className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Job Description */}
      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef} className="h-40 border-2 border-gray-300 rounded p-2" />
      </div>

      {/* Job Category, Location, Level */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Location</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Level</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Mid level">Mid level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      {/* Job Salary */}
      <div>
        <p className="mb-2">Job Salary</p>
        <input
          type="number"
          min={0}
          placeholder="2500"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
        />
      </div>

      {/* Submit */}
      <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
        ADD JOB
      </button>
    </form>
  );
};

export default AddJob;

