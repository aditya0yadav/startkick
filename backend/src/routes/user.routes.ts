import { Router } from 'express';
import { 
  getProfile,
  updateProfile,
  uploadResume,
  getResume
} from '../controllers/user.controller';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './uploads/resumes',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

const router = Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.get('/resume', getResume);

export { router as userRouter };