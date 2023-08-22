import express from 'express';
import videoRoutes from './videos/routes';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/videos', videoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});