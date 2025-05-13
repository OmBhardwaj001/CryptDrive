import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1000 * 1000,
  },
});

export default upload;
