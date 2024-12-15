import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';

// Define the storage configuration with types
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using the current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter for validating file types
const fileFilter: multer.Options['fileFilter'] = (req, file, cb: FileFilterCallback) => {
  // Only allow image files
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true); // Accept the file
  } else {
    const error = new Error('Only image files are allowed!');
    // @ts-ignore
    cb(error, false); // Reject the file with an error
  }
};

// Create the multer upload instance with types
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: fileFilter
});

export default upload;
