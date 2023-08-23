import { Router } from 'express';
import {
  createVideo,
  getAllVideos,
  getAnnotationsForVideo,
  deleteVideo,
  createVideoAnnotation,
  updateAnnotation,
  deleteAnnotation
} from '../controllers/videos';

const router = Router();

// As a user I would like to get all of the videos.
router.get('/', (req, res) => getAllVideos(req, res))

// As a user I would like to be able to list all annotations relevant to a video
router.get('/:videoId/annotations', (req, res) => getAnnotationsForVideo(req, res))

// As a user I would like to be able to create a video on the system with relevant video metadata
router.post('/', (req, res) => createVideo(req, res))

// As a user I would like to be able to delete video from the system
router.delete('/:videoId', (req, res) => deleteVideo(req, res))

// As a user I would like to be able to create an annotation with start and end time of the annotation
// Validate As a user I would like the system to error if I create an annotation that is out of bounds of duration of the video
// As a user I would like to be able to specify annotation type and add additional notes
router.post('/:videoId/annotations', (req, res) =>  createVideoAnnotation(req, res));

// As a user I would like to be able to update my annotation details (type and notes)
router.put('/:videoId/annotations/:annotationId', (req, res) =>  updateAnnotation(req, res));

// As a user I would like to be able to delete my annotations
router.delete('/:videoId/annotations/:annotationId', (req, res) => deleteAnnotation(req, res));

export default router;