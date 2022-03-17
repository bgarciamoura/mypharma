import express from 'express';
import { uuid } from 'uuidv4';
import { Categories } from '../models/Categories';
import { verifyToken } from '../middlewares/verifyToken';

const categoriesRoutes = express.Router();

categoriesRoutes.post('/categories', verifyToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const UUID = uuid();

        const existsCategory = await Categories.findOne({ name });

        if (existsCategory) {
            return res.status(400).send({ error: 'Category already exists' });
        }

        const category = await Categories.create({ UUID, name, description });
        res.status(201).json(category);
    } catch (error) {
        console.log('ERROR ON CREATE', error);
        res.status(500).json({ message: 'Failed to create category' });
    }
});

categoriesRoutes.delete('/categories/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Categories.find({ UUID: id });

        if (!category || category.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await Categories.deleteOne({ UUID: id });
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        console.log('ERROR ON DELETE', error);
        res.status(500).json({ message: 'Failed to delete category' });
    }
});

categoriesRoutes.put('/categories/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Categories.findOne({ UUID: id });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updatedCategory = await Categories.findOneAndUpdate(
            { UUID: id },
            { name, description },
            { new: true }
        );

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.log('ERROR ON DELETE', error);
        res.status(500).json({ message: 'Failed to delete category' });
    }
});

categoriesRoutes.get('/categories', verifyToken, async (req, res) => {
    const name = req.query?.name;
    const description = req.query?.description;

    try {
        if (!name && !description) {
            const categories = await Categories.find();
            return res.status(200).json(categories);
        }

        const categories = await Categories.find({
            $or: [
                { name: { $regex: '.*' + name + '.*' } },
                { description: { $regex: '.*' + description + '.*' } },
            ],
        });

        res.status(200).json(categories);
    } catch (error) {
        console.log('ERROR ON GET', error);
        res.status(500).json({ message: 'Failed to get categories' });
    }
});

categoriesRoutes.get('/categories/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Categories.findOne({ UUID: id });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.log('ERROR ON GET', error);
        res.status(500).json({ message: 'Failed to get category' });
    }
});

export { categoriesRoutes };
