import express from 'express'
import path from 'path'
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

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'lightning.png')))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'lightning.png')))
    app.use(express.static('public'))
}

// specify the api path for the server to use
app.use("/advisors", advisorRoutes);
app.use("/reviews", reviewRoutes);
app.use("/universities", universityRoutes);

// 404 handler if no route is matched
app.use("/", (req, res) => {
    res.status(404).json({
        message: "API route not found",
    });
});

if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
