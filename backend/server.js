import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import colors from "colors/safe.js";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cors from "cors";
dotenv.config();

connectDB();

const app = express();

app.use(cookieParser());
app.use(cors());
// Morgan shows http requests in console with status codes and time etc. This runs only in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Use bodyparser to access form data in request
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Settings for deployment
// The production build will be in a directory called build in the frontend directory
// This sets the build folder as a static directory to allow access to load the index.html
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  // Gets anything (except /api routes) 
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 6000;

app.listen(
  PORT,
  console.log(
    colors.verbose(
      `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
);

colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: ["blue", "underline"],
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red",
});
