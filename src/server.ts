import express from "express";
import routes from "./routes";
import cors from "cors";
import validateApiKey from "./middleware/validateApiKey";

const app = express();
const PORT = 3000;

app.use(validateApiKey);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/videos", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
