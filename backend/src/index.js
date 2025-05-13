import dotenv from "dotenv";
import app from "./app.js";
import connectdb from "./config/db.js";

const PORT = process.env.PORT ?? 8000;

connectdb()
  .then(() => {
    app.listen(PORT, () => console.log(`server is running on port no ${PORT}`));
  })
  .catch((err) => {
    console.log("mongodb connection error", err);
    process.exit(1);
  });
