import { Router } from "express";
import { uploadImageMiddleware } from "middlewares/multer.middleware.ts";
import { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller.ts';
import { authMiddleware } from "middlewares/auth.middleware.ts";
import { isAdmin } from "middlewares/admin.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { addProductSchema, updateProductSchema } from "schema.ts";


const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);

router.post('/', authMiddleware, isAdmin, uploadImageMiddleware.single('photo'), validate(addProductSchema), addProduct);
router.put('/:id', authMiddleware, isAdmin, uploadImageMiddleware.single('photo'), validate(updateProductSchema), updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

router.get('/image', (req, res) => {
    res.status(200).send("file recieved");
});

export default router;