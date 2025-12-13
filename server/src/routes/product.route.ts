import { Router } from "express";
import { uploadImageMiddleware } from "middlewares/multer.middleware.ts";
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductStock } from '../controllers/product.controller.ts';
import { authMiddleware } from "middlewares/auth.middleware.ts";
import { isAdmin } from "middlewares/admin.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { addProductSchema, updateProductSchema, updateProductStockSchema } from "schema.ts";


const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', authMiddleware, isAdmin, uploadImageMiddleware.single('photo'), validate(addProductSchema), addProduct);
router.put('/:id', authMiddleware, isAdmin, uploadImageMiddleware.single('photo'), validate(updateProductSchema), updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.put('/update-stock/:id', authMiddleware, isAdmin, validate(updateProductStockSchema), updateProductStock)

export default router;