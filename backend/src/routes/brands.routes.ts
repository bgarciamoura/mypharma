import express from 'express';
import { Brands } from '../models/Brands';
import { uuid } from 'uuidv4';

const brandsRoutes = express.Router();

brandsRoutes.get('/brands', async (req, res) => {
    try {
        const brands = await Brands.find();
        res.status(200).json(brands);
    } catch (error) {
        console.log('ERROR ON FETCH', error);
        res.status(500).json({ message: 'Failed to fetch brands' });
    }
});

brandsRoutes.post('/brands', async (req, res) => {
    try {
        const { name } = req.body;
        const UUID = uuid();
        const brands = await Brands.create({ UUID, name });
        res.status(201).json(brands);
    } catch (error) {
        console.log('ERROR ON CREATE', error);
        res.status(500).json({ message: 'Failed to create brand' });
    }
});

export { brandsRoutes };
