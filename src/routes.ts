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

router.post("/", createVideo);
router.get("/", getAllVideos);
router.delete("/:videoId", deleteVideo);

router.post("/:videoId/annotations", createVideoAnnotation);
router.get("/:videoId/annotations", getVideoAnnotations);
router.put("/:videoId/annotations/:annotationId", updateAnnotation);
router.delete("/:videoId/annotations/:annotationId", deleteAnnotation);

export default router;