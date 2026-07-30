import express from 'express'
import path from 'path'
import fs from 'fs'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import cors from 'cors'

// import the router from your routes file
import advisorRoutes from "./routes/advisorRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express();

// middleware
app.use(express.json());
app.use(cors());

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

// specify the api path for the server to use
app.use("/api/advisors", advisorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/universities", universityRoutes);

// 404 handler if no route is matched
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API route not found",
    });
});

if (process.env.NODE_ENV === 'production') {
    app.get('/*path', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
