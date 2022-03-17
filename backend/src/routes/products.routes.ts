import express from 'express';
import { uuid } from 'uuidv4';
import { Products } from '../models/Products';
import { verifyToken } from '../middlewares/verifyToken';

const productRoutes = express.Router();

productRoutes.post('/products', verifyToken, async (req, res) => {
    try {
        const { name, brand, price, description } = req.body;
        const UUID = uuid();

        const existsProduct = await Products.findOne({ name });

        if (existsProduct) {
            return res.status(400).send({ error: 'Product already exists' });
        }

        const products = await Products.create({ UUID, name, brand, price, description });
        res.status(201).json(products);
    } catch (error) {
        console.log('ERROR ON CREATE', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
});

productRoutes.delete('/products/:id', verifyToken, async (req, res) => {
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

productRoutes.put('/products/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, brand, price, description } = req.body;

    try {
        const product = await Products.findOne({ UUID: id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Products.findOneAndUpdate(
            { UUID: id },
            { name, brand, price, description },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log('ERROR ON DELETE', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

productRoutes.get('/products', verifyToken, async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (error) {
        console.log('ERROR ON GET', error);
        res.status(500).json({ message: 'Failed to get products' });
    }
});

productRoutes.get('/products/:name', verifyToken, async (req, res) => {
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
