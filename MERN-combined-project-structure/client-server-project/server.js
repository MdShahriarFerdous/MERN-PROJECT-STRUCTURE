require("dotenv").config();
const { readdirSync } = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
//DevDependency Lib import
const morgan = require("morgan");

// Middlewares implement
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));

// Request Rate Limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//mongoose set up and connection
// mongoose.set("strictQuery", false);
// mongoose
// 	.connect(process.env.MONGO_DB_CONNECTION)
// 	.then(() => {
// 		console.log("MongoDB connected!!");
// 	})
// 	.catch((err) => {
// 		console.log("Failed to connect to MongoDB", err.message);
// 	});

//Managing frontend routing
app.use(express.static("client-side/dist"));
app.get("*", function (req, res) {
	req.sendFile(path.resolve(__dirname, "client-side", "dist", "index.html"));
});

//Managing backend API routing
readdirSync("./src/routes").map((router) =>
	app.use("/api/v1", require(`./src/routes/${router}`))
);

app.listen(process.env.PORT || 8000, () => {
	console.log(`Server is running on port: ${process.env.PORT}`);
});
