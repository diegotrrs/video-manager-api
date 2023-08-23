import { Request, Response, NextFunction } from "express";

/**
 * Middleware function that ensure there is a valid API Key specified in every request.
 */
const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (apiKey !== process.env.API_KEY) {
    res.status(401).json({ error: "API Key not valid" });
    return;
  }

  next();
};

export default validateApiKey;
