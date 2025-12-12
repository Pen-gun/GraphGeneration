import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({path: './ai.env'});

const app = express();
const PORT = process.env.PORT;
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
    }
));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`AI Microservice is running on port ${PORT}`);
});

//import routes
import aiRoutes from './routes/ai.route.js';

//define routes
app.use('/api/v1/ai', aiRoutes);

export default app;