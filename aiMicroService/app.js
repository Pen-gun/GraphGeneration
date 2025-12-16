import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(cookieParser());

//import routes
import aiRoutes from './routes/ai.route.js';
import userRoutes from './routes/user.route.js';
import queryRouter from './routes/query.route.js';

//define routes
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/queries', queryRouter);

export default app;