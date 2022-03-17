import express from 'express';
import cors from 'cors';
import { db_config } from '../mongoose.config';

import { authRoutes } from './routes/auth.routes';
import { brandsRoutes } from './routes/brands.routes';
import { categoriesRoutes } from './routes/categories.routes';
import { productsRoutes } from './routes/products.routes';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3333;

db_config;

app.use('/api/v1', authRoutes);
app.use('/api/v1', brandsRoutes);
app.use('/api/v1', categoriesRoutes);
app.use('/api/v1', productsRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
