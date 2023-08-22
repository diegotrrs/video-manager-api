import { Router } from 'express';

const router = Router();

// As a user I would like to be able to list all annotations relevant to a video
router.get('/:videoId/annotations', (req, res) => {
    res.json(["Diego", "Tony","Lisa","Michael","Ginger","Food"]);
});


// As a user I would like to be able to create a video on the system with relevant video metadata
router.post('/', (req, res) => {
    // Fetch all videos logic here
});

// As a user I would like to be able to delete video from the system
router.delete('/', (req, res) => {
    // Fetch all videos logic here
});

// As a user I would like to be able to create an annotation with start and end time of the annotation
// Validate As a user I would like the system to error if I create an annotation that is out of bounds of duration of the video
// As a user I would like to be able to specify annotation type and add additional notes
router.post('/:videoId/annotations', (req, res) => {
    // Fetch all videos logic here
    // As a user I would like to be able to specify annotation type and add additional notes
});

// As a user I would like to be able to update my annotation details
router.put('/:videoId/annotations/:annotationId', (req, res) => {
    
});

// As a user I would like to be able to delete my annotations
router.delete('/:videoId/annotations', (req, res) => {
    
});

// More video related routes here...

export default router;