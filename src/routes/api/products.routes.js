// BASE URL: /api/products
const router = require('express').Router();

const { getAll, createProduct, updateProduct, deleteProduct, getById, getByDepartment, getAvailable, getByPrice } = require('../../controllers/products.controller');
const { checkToken } = require('../../utils/middlewares');

router.get('/', getAll);
router.get('/dpt/:department', getByDepartment);
router.get('/available', getAvailable);
router.get('/price', getByPrice);
router.get('/:productId', getById);

router.post('/', checkToken, createProduct);
router.put('/:productId', checkToken, updateProduct);
router.delete('/:productId', checkToken, deleteProduct);

module.exports = router;