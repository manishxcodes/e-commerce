import { Router } from "express";
import multer from 'multer';

const router = Router();
const upload = multer({ dest: "uploads/"});

router.post('/image', upload.single('photo'), (req, res) => {
    res.status(200).send("file recieved");
});

router.get('/image', (req, res) => {
    res.status(200).send("file recieved");
});

export default router;