import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
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
import conversationRouter from './routes/conversation.route.js';

//define routes
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/queries', queryRouter);
app.use('/api/v1/conversations', conversationRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
    // Ensure CORS headers are set
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ statusCode, message, success: false });
});

export default app;