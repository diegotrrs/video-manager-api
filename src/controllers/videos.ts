import {
    getAllVideos as getAllVideosService,
    getVideoById, getVideoAnnotations,
    createVideo as createVideoService,
    deleteVideo as deleteVideoService,
    createVideoAnnotation as createVideoAnnotationService,
    getAnnotationById,
    updateAnnotation as updateAnnotationService,
    deleteAnnotation as deleteAnnotationService,
} from '../services/videos';

import { AnnotationSchema, VideoSchema } from '../generated/zod-schemas';
import { Request, Response } from 'express'
import { z } from 'zod';

export const getAllVideos = async (_req: Request, res: Response) => {
    try {    
        const videos = await getAllVideosService();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
}

export const getAnnotationsForVideo = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId);

    try {
      const video = await getVideoById(videoId)
  
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
  
      // Retrieve annotations associated with the video
      const annotations = await getVideoAnnotations(videoId)
  
      res.status(200).json(annotations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch annotations' });
    }
}

export const createVideo = async (req: Request, res: Response) => {
    try {
        // During the creation we omit the id from the Schema since it isn't expected in this case.
        const payload = VideoSchema.omit({ id:true }).parse(req.body);
        const video = await createVideoService(payload)

        res.status(201).json(video);
    } catch(error){
        console.error(error)

        if (error instanceof z.ZodError) {
          const errors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }));
          res.status(422).json({
            error: 'Validation failed',
            details: errors
          });
        } else {
          res.status(500).send({ error: 'Internal Server Error' });
        }
    }   
}

export const deleteVideo = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId)

    try {
        if (isNaN(videoId)) {
            return res.status(400).json({ error: 'Video Id must be a number' });
        }

        const video = await getVideoById(videoId)

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        await deleteVideoService(videoId)
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete video' });
    }
}

export const createVideoAnnotation = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId);
    const { body } = req;
  
    try {
      // During the creation we omit the id from the Schema since it isn't expected in this case.
      const payload = AnnotationSchema.omit({ id:true }).parse(body);
      const { startTimeInSec, endTimeInSec } = payload;
  
      const video = await getVideoById(videoId)
  
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
  
      if (startTimeInSec < 0 || endTimeInSec > video.durationInSec) {
        return res.status(400).json({ error: 'Annotation is out of bounds of video duration' });
      }
  
      const annotation = await createVideoAnnotationService(payload)
  
      res.status(201).json(annotation);
    } catch (error) {
  
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        res.status(422).json({
          error: 'Validation failed',
          details: errors
        });
      } else {
        res.status(500).send({ error: 'Internal Server Error' });
      }
  
      res.status(500).json({ error: 'Failed to create annotation' });
    }
}

export const updateAnnotation = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId);
    const annotationId = parseInt(req.params.annotationId);

    if (isNaN(videoId)) {
        return res.status(400).json({ error: 'Video Id must be a number' });
    }

    if (isNaN(annotationId)) {
        return res.status(400).json({ error: 'Annotiation Id must be a number' });
    }
    
    try {
      const payload = AnnotationSchema.omit({ id:true }).omit({ videoId: true }).parse(req.body);

      const existingAnnotation = await getAnnotationById(annotationId)
  
      if (!existingAnnotation) {
        return res.status(404).json({ error: 'Annotation not found' });
      }
  
      if (existingAnnotation.videoId !== videoId) {
        return res.status(400).json({ error: 'Annotation does not belong to the specified video' });
      }
  
      const updatedAnnotation = await updateAnnotationService(annotationId, { ...payload, videoId })

      res.status(200).json(updatedAnnotation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        res.status(422).json({
          error: 'Validation failed',
          details: errors
        });
      } else {
        res.status(500).json({ error: 'Failed to update annotation' });
      }
    }
}

export const deleteAnnotation = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId);
    const annotationId = parseInt(req.params.annotationId);
  
    try {
        const existingAnnotation = await getAnnotationById(annotationId)

        if (!existingAnnotation) {
            return res.status(404).json({ error: 'Annotation not found' });
        }
  
        if (existingAnnotation.videoId !== videoId) {
            return res.status(400).json({ error: 'Annotation does not belong to the specified video' });
        }
  
        await deleteAnnotationService(annotationId)
  
        res.status(200).json({ message: 'Annotation deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete annotation' });
    }
}