import { Response } from "express";
import { z } from "zod";

/**
 * This function tries to figure out the type of the error about to be sent in the HttpResponse.
 * First, it checks if it's a Zod validation error it iterates over of the errors and creates a composed error message.
 * Then, if the error has an attribute message on it, then sends that text as the error message.
 * Finally, the default case corresponds to just sending the error to the response.
 * @param error The error that ocurred.
 * @param res The Express's Response object
 */
const handleErrorForResponse = (error: unknown, res: Response) => {
  if (error instanceof z.ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    
    res.status(422).json({
      error: "Validation failed",
      details: errors,
    });

  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {

    res.status(500).send({ error: error.message });

  } else {
    res.status(500).send({ error });
  }
};

export default handleErrorForResponse;