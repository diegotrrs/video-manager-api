import express from "express";
import routes from "./routes";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/videos", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
