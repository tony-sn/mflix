import express from "express";
import cors from "cors"; //middleware

import movies from "./api/movies.route.js"; //create later

const app = express(); //create server

/**
 * @note [incoming request] => [Middleware] => [Output]
 */

app.use(cors());
app.use(express.json()); // accept JSON in request body

app.use("/api/v1/movies", movies); // convention naming
app.use("*", (req, res) => {
	res.status(404).json({ error: "not found" }); // wildcard catch
});

export default app;