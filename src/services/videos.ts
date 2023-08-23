import { Video } from "../generated/zod-schemas";

import { Annotation, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllVideos = async () => await prisma.video.findMany({
    include: {
      annotations: true,
    },
  });

type VideoId = Video["id"];
type VideoForInsertion = Omit<Video, "id">; // The video id attribute is ignored during insertion

type AnnotationId = Annotation["id"];
type AnnotationForInsertion = Omit<Annotation, "id">; // The annotation id attribute is ignored during insertion

export const getVideoById = async (videoId: VideoId) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new Error(`Video with ID ${videoId} does not exist.`);
  }

  return video;
};

export const getVideoAnnotations = (videoId: VideoId) =>
  prisma.annotation.findMany({
    where: { videoId: videoId },
  });

export const createVideo = async (video: VideoForInsertion) =>
  prisma.video.create({
    data: {
      ...video,
    },
  });

export const deleteVideo = async (videoId: VideoId) => {
  const video = await getVideoById(videoId);
  if (video === null) {
    return new Error(`The video with the id ${videoId} does not exist.`);
  }

  return prisma.video.delete({
    where: { id: videoId },
  });
};

export const createVideoAnnotation = async (
  annotationForInsertion: AnnotationForInsertion
) => {
  const video = await getVideoById(annotationForInsertion.videoId);

  if (
    annotationForInsertion.startTimeInSec < 0 ||
    annotationForInsertion.endTimeInSec > video.durationInSec ||
    annotationForInsertion.endTimeInSec < 0 ||
    annotationForInsertion.startTimeInSec > video.durationInSec
  ) {
    throw new Error(
      `Annotation is out of bounds of video duration (${video.durationInSec})`
    );
  }

  return await prisma.annotation.create({
    data: {
      ...annotationForInsertion,
    },
  });
};

export const getAnnotationById = async (annotationId: AnnotationId) => {
  const annotation = await prisma.annotation.findUnique({
    where: { id: annotationId },
  });

  if (!annotation) {
    throw new Error(`Annotation with ID ${annotationId} does not exist.`);
  }

  return annotation;
};

export const updateAnnotation = async (
  annotationId: AnnotationId,
  annotation: AnnotationForInsertion
) => {
  const existingAnnotation = await getAnnotationById(annotationId);

  if (existingAnnotation.videoId !== annotation.videoId) {
    throw new Error("Annotation does not belong to the specified video.");
  }

  return prisma.annotation.update({
    where: { id: annotationId },
    data: { ...annotation },
  });
};

export const deleteAnnotation = async (
  annotationId: AnnotationId,
  videoId: VideoId
) => {
  const existingAnnotation = await getAnnotationById(annotationId);
  if (existingAnnotation.videoId !== videoId) {
    throw new Error("Annotation does not belong to the specified video.");
  }
  return prisma.annotation.delete({ where: { id: annotationId } });
};
