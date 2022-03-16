import express, { Request, Response } from 'express';
import { db_config } from '../mongoose.config';

const app = express();
const PORT = 3333;

db_config;

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>OI MUNDO, DIRETO DO BACKEND</h1>');
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
