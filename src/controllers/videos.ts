import {
  getAllVideos as getAllVideosService,
  getVideoAnnotations as getVideoAnnotationsService,
  createVideo as createVideoService,
  deleteVideo as deleteVideoService,
  createVideoAnnotation as createVideoAnnotationService,
  updateAnnotation as updateAnnotationService,
  deleteAnnotation as deleteAnnotationService,
  getAnnotationById,
  getVideoById,
} from "../services/videos";

import { AnnotationSchema, VideoSchema } from "../generated/zod-schemas";
import { Request, Response, response } from "express";
import { z } from "zod";
import handleErrorForResponse from "../utils/handleErrorForResponse";

/**
 * Returns all of the videos in the DB.
 * This endpoint doesn't correspond to any original requirement in the Test description.
 */
export const getAllVideos = async (_req: Request, res: Response) => {
  try {
    const videos = await getAllVideosService();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

/**
 * Creates a video. Requirement associated:
 * 'As a user I would like to be able to create a video on the system with relevant video metadata'
 */
export const createVideo = async (req: Request, res: Response) => {
  try {
    // During the creation we omit the id from the Schema since it isn't expected in this case.
    const payload = VideoSchema.omit({ id: true }).parse(req.body);
    const video = await createVideoService(payload);

    res.status(201).json(video);
  } catch (error) {
    handleErrorForResponse(error, res);
  }
};

/**
 * Creates an annotation for a video. Requirements associated:
 * 'As a user I would like to be able to create an annotation with start and end time of the annotation'
 * 'As a user I would like the system to error if I create an annotation that is out of bounds of duration of the video'
 * 'As a user I would like to be able to specify annotation type and add additional notes'
 */
export const createVideoAnnotation = async (req: Request, res: Response) => {
  const videoId = parseInt(req.params.videoId);

  if (isNaN(videoId)) {
    return res.status(400).json({ error: "Video Id must be a number" });
  }

  try {
    // During the creation we omit the id from the Schema since it isn't expected in this case.
    const payload = AnnotationSchema.omit({ id: true })
      .omit({ videoId: true })
      .parse(req.body);

    const annotation = await createVideoAnnotationService({
      ...payload,
      videoId,
    });

    res.status(201).json(annotation);
  } catch (error) {
    handleErrorForResponse(error, res);
  }
};

/**
 * Returns the annotations for a video:
 * 'As a user I would like to be able to list all annotations relevant to a video'
 */
export const getVideoAnnotations = async (req: Request, res: Response) => {
  const videoId = parseInt(req.params.videoId);

  try {
    if (isNaN(videoId)) {
      return res.status(400).json({ error: "Video Id must be a number" });
    }

    // Retrieve video to check if it exists.
    await getVideoById(videoId);

    // Retrieve annotations associated with the video
    const annotations = await getVideoAnnotationsService(videoId);

    res.status(200).json(annotations);
  } catch (error) {
    handleErrorForResponse(error, res);
  }
};

/**
 * Updates the attributes of an annotation. Requirements associated:
 * 'As a user I would like to be able to specify annotation type and add additional notes'
 * 'As a user I would like to be able to update my annotation details'
 */
export const updateAnnotation = async (req: Request, res: Response) => {
  const videoId = parseInt(req.params.videoId);
  const annotationId = parseInt(req.params.annotationId);

  if (isNaN(videoId)) {
    return res.status(400).json({ error: "Video Id must be a number" });
  }

  if (isNaN(annotationId)) {
    return res.status(400).json({ error: "Annotiation Id must be a number" });
  }

  try {
    // Retrieve video to check if it exists.
    await getVideoById(videoId);

    const payload = AnnotationSchema.omit({ id: true })
      .omit({ videoId: true })
      .parse(req.body);

    const updatedAnnotation = await updateAnnotationService(annotationId, {
      ...payload,
      videoId,
    });

    res.status(200).json(updatedAnnotation);
  } catch (error) {
    handleErrorForResponse(error, res);
  }
};

/**
 * Deletes an annotation associated to a video. Requirements associated:
 * As a user I would like to be able to delete my annotations
 */
export const deleteAnnotation = async (req: Request, res: Response) => {
  const videoId = parseInt(req.params.videoId);
  const annotationId = parseInt(req.params.annotationId);

  try {
    await deleteAnnotationService(annotationId, videoId);
    res.status(200).json({ message: "Annotation deleted successfully" });
  } catch (error) {
    handleErrorForResponse(error, res);
  }
};

/**
 * Deletes a video from the DB. Requirements associated:
 * 'As a user I would like to be able to delete video from the system'
 */
export const deleteVideo = async (req: Request, res: Response) => {
  const videoId = parseInt(req.params.videoId);

  try {
    if (isNaN(videoId)) {
      return res.status(400).json({ error: "Video Id must be a number" });
    }

    await deleteVideoService(videoId);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    handleErrorForResponse(error, res);
  }
};
