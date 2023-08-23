import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

import { z } from 'zod'
import { AnnotationSchema, VideoSchema } from '../generated/zod-schemas';

const router = Router();
const prisma = new PrismaClient();

// As a user I would like to get all of the videos.
// Added:
router.get('/', async (_req, res) => {
  try {    
    const videos = await prisma.video.findMany();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// As a user I would like to be able to list all annotations relevant to a video
router.get('/:videoId/annotations', async (req, res) => {
  const videoId = parseInt(req.params.videoId);

  try {
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Retrieve annotations associated with the video
    const annotations = await prisma.annotation.findMany({
      where: { videoId: videoId }
    });

    res.status(200).json(annotations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch annotations' });
  }
});

// As a user I would like to be able to create a video on the system with relevant video metadata
router.post('/', async (req, res) => {
    const { body } = req;
    try {
        // During the creation we omit the id from the Schema since it isn't expected in this case.
        const payload = VideoSchema.omit({ id:true }).parse(body);

        const video = await prisma.video.create({
          data: {
            ...payload
          }
        });
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
});

// As a user I would like to be able to delete video from the system
router.delete('/:videoId', async (req, res) => {
  const videoId = parseInt(req.params.videoId)

  try {
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Video Id must be a number' });
    }
    
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await prisma.video.delete({
      where: { id: parseInt(req.params.videoId) }
    });
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// As a user I would like to be able to create an annotation with start and end time of the annotation
// Validate As a user I would like the system to error if I create an annotation that is out of bounds of duration of the video
// As a user I would like to be able to specify annotation type and add additional notes
router.post('/:videoId/annotations', async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const { body } = req;

  try {
    // During the creation we omit the id from the Schema since it isn't expected in this case.
    const payload = AnnotationSchema.omit({ id:true }).parse(body);
    const { startTimeInSec, endTimeInSec, type, notes } = payload;

    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (startTimeInSec < 0 || endTimeInSec > video.durationInSec) {
      return res.status(400).json({ error: 'Annotation is out of bounds of video duration' });
    }

    const annotation = await prisma.annotation.create({
      data: {
        videoId,
        startTimeInSec,
        endTimeInSec,
        type,
        notes
      }
    });

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
});


// As a user I would like to be able to update my annotation details (type and notes)
router.put('/:videoId/annotations/:annotationId', async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const annotationId = parseInt(req.params.annotationId);
  const { body } = req;

  const payload = AnnotationSchema.omit({ id:true }).omit({ videoId:true }).parse(body);

  const { type, notes } = payload;

  try {
    const existingAnnotation = await prisma.annotation.findUnique({
      where: { id: annotationId }
    });

    if (!existingAnnotation) {
      return res.status(404).json({ error: 'Annotation not found' });
    }

    if (existingAnnotation.videoId !== videoId) {
      return res.status(400).json({ error: 'Annotation does not belong to the specified video' });
    }

    const updatedAnnotation = await prisma.annotation.update({
      where: { id: annotationId },
      data: { type, notes }
    });

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
});

// As a user I would like to be able to delete my annotations
router.delete('/:videoId/annotations/:annotationId', async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const annotationId = parseInt(req.params.annotationId);

  try {
    const existingAnnotation = await prisma.annotation.findUnique({
      where: { id: annotationId }
    });

    if (!existingAnnotation) {
      return res.status(404).json({ error: 'Annotation not found' });
    }

    if (existingAnnotation.videoId !== videoId) {
      return res.status(400).json({ error: 'Annotation does not belong to the specified video' });
    }

    await prisma.annotation.delete({
      where: { id: annotationId }
    });

    res.status(200).json({ message: 'Annotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete annotation' });
  }
});

export default router;