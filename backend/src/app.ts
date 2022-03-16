import express from 'express';
import cors from 'cors';
import { db_config } from '../mongoose.config';

import { brandsRoutes } from './routes/brands.routes';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3333;

db_config;

app.use('/api/v1', brandsRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
