import { Video } from "../generated/zod-schemas";

import { Annotation, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllVideos = async () => {
  return await prisma.video.findMany();
};

type VideoId = Video["id"];
type VideoForInsertion = Omit<Video, "id">; // The video id attribute is ignored during insertion

type AnnotationId = Annotation["id"];
type AnnotationForInsertion = Omit<Annotation, "id">; // The annotation id attribute is ignored during insertion

export const getVideoById = (videoId: VideoId) =>
  prisma.video.findUnique({
    where: { id: videoId },
  });

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
  await prisma.video.delete({
    where: { id: videoId },
  });
};

export const createVideoAnnotation = async (
  annotation: AnnotationForInsertion
) => {
  return await prisma.annotation.create({
    data: {
      ...annotation,
    },
  });
};

export const getAnnotationById = (annotationId: AnnotationId) =>
  prisma.annotation.findUnique({
    where: { id: annotationId },
  });

export const updateAnnotation = (
  annotationId: AnnotationId,
  annotation: AnnotationForInsertion
) =>
  prisma.annotation.update({
    where: { id: annotationId },
    data: { ...annotation },
  });

export const deleteAnnotation = async (annotationId: AnnotationId) =>
  prisma.annotation.delete({ where: { id: annotationId } });
