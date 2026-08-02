import express from 'express'
import path from 'path'
import fs from 'fs'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from './config/passport.js'
import cors from 'cors'

// Import routes
import advisorRoutes from "./routes/advisorRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express();

// Basic Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, true);
            }
        },
        credentials: true
    })
);

// Express Session Middleware
const isHttps = process.env.COOKIE_SECURE === 'true';

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret_key_rate_my_advisor',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: isHttps,
            sameSite: isHttps ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// Passport Authentication Middleware
app.use(passport.initialize());
app.use(passport.session());

// Favicon resolution
const devFavicon = path.resolve('../', 'client', 'public', 'lightning.png')
const prodFavicon = path.resolve('public', 'lightning.png')

if (fs.existsSync(devFavicon)) {
    app.use(favicon(devFavicon))
} else if (fs.existsSync(prodFavicon)) {
    app.use(favicon(prodFavicon))
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
}

// API Routes
app.use("/auth", authRoutes);
app.use("/api/advisors", advisorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/universities", universityRoutes);

// API 404 Handler
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API route not found",
    });
});

// SPA Fallback Route: Serve index.html for client-side React routes
app.use((req, res) => {
    const indexPath = path.resolve('public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Page not found');
    }
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
