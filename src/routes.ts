import { Router } from "express";
import {
  createVideo,
  getAllVideos,
  getVideoAnnotations,
  deleteVideo,
  createVideoAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from "./controllers/videos";

const router = Router();

router.post("/", (req, res) => createVideo(req, res));
router.get("/", (req, res) => getAllVideos(req, res));
router.delete("/:videoId", (req, res) => deleteVideo(req, res));

router.post("/:videoId/annotations", (req, res) => createVideoAnnotation(req, res));
router.get("/:videoId/annotations", (req, res) => getVideoAnnotations(req, res));
router.put("/:videoId/annotations/:annotationId", (req, res) => updateAnnotation(req, res));
router.delete("/:videoId/annotations/:annotationId", (req, res) => deleteAnnotation(req, res));

export default router;