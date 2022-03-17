import express from 'express';
import { uuid } from 'uuidv4';
import { Products } from '../models/Products';
import { verifyToken } from '../middlewares/verifyToken';
import { Brands } from '../models/Brands';

const productsRoutes = express.Router();

productsRoutes.post('/products', verifyToken, async (req, res) => {
    const { name, description, price, stock, categories, brands } = req.body;

    const newProduct = new Products({
        UUID: uuid(),
        name,
        description,
        price,
        stock,
        categories,
        brands,
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.log('ERROR ON CREATE', error);
        res.status(400).json({ message: error });
    }
});

productsRoutes.delete('/products/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Products.find({ UUID: id });

        if (!product || product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Products.deleteOne({ UUID: id });

        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        console.log('ERROR ON DELETE', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

productsRoutes.put('/products/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, categories, brands } = req.body;

    try {
        const product = await Products.findOne({ UUID: id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Products.findOneAndUpdate(
            { UUID: id },
            { name, description, price, stock, categories, brands },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log('ERROR ON UPDATE', error);
        res.status(500).json({ message: 'Failed to update the product' });
    }
});

productsRoutes.get('/products', verifyToken, async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (error) {
        console.log('ERROR ON GET', error);
        res.status(500).json({ message: 'Failed to get products' });
    }
});

productsRoutes.get('/products/:name', verifyToken, async (req, res) => {
    const { name } = req.params;

    try {
        const product = await Products.findOne({ name });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log('ERROR ON GET', error);
        res.status(500).json({ message: 'Failed to get product' });
    }
});

export { productsRoutes };
