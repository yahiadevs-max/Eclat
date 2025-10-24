import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// =================================================================
// Routes de l'API
// Toutes les routes de l'application sont chargées à partir du
// routeur principal défini dans './routes/index.ts'.
// Cette approche modulaire garde ce fichier propre et organisé.
// =================================================================
app.use('/api', apiRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Éclat Commerce Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});