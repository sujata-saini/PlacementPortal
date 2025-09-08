// // server/config/multer.js
// import multer from "multer";

// // store file in memory instead of local disk
// const storage = multer.memoryStorage();

// const upload = multer({ storage });

// export default upload;


import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
