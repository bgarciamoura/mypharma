import express from 'express';
import { Brands } from '../models/Brands';
import { uuid } from 'uuidv4';

const brandsRoutes = express.Router();

brandsRoutes.post('/brands', async (req, res) => {
    try {
        const { name } = req.body;
        const UUID = uuid();

        const existsBrand = await Brands.findOne({ name });

        if (existsBrand) {
            return res.status(400).send({ error: 'Brand already exists' });
        }

        const brands = await Brands.create({ UUID, name });
        res.status(201).json(brands);
    } catch (error) {
        console.log('ERROR ON CREATE', error);
        res.status(500).json({ message: 'Failed to create brand' });
    }
});

brandsRoutes.delete('/brands/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const brand = await Brands.find({ UUID: id });

        if (!brand || brand.length === 0) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        await Brands.deleteOne({ UUID: id });

        res.status(200).json({ message: 'Brand deleted' });
    } catch (error) {
        console.log('ERROR ON DELETE', error);
        res.status(500).json({ message: 'Failed to delete brand' });
    }
});

brandsRoutes.put('/brands/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const brand = await Brands.findOne({ UUID: id });

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        const updatedBrand = await Brands.findOneAndUpdate({ UUID: id }, { name }, { new: true });

        res.status(200).json(updatedBrand);
    } catch (error) {
        console.log('ERROR ON UPDATE', error);
        res.status(500).json({ message: 'Failed to update brand' });
    }
});

brandsRoutes.get('/brands', async (req, res) => {
    try {
        const brands = await Brands.find();
        res.status(200).json(brands);
    } catch (error) {
        console.log('ERROR ON FETCH', error);
        res.status(500).json({ message: 'Failed to fetch brands' });
    }
});

brandsRoutes.get('/brands/:name', async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ message: 'Please, provide the name for search!' });
    }

    try {
        const brands = await Brands.find({ name: { $regex: '.*' + name + '.*' } });
        return res.status(200).json(brands);
    } catch (error) {
        console.log('ERROR ON GET', error);
        res.status(500).json({ message: 'Failed to get brand' });
    }
});

export { brandsRoutes };
