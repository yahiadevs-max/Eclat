
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check route
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Éclat Commerce Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});