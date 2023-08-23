import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const VideoScalarFieldEnumSchema = z.enum(['id','title','link','durationInSec','description']);

export const AnnotationScalarFieldEnumSchema = z.enum(['id','videoId','startTimeInSec','endTimeInSec','type','notes']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// VIDEO SCHEMA
/////////////////////////////////////////

export const VideoSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  link: z.string(),
  durationInSec: z.number().int(),
  description: z.string().nullable(),
})

export type Video = z.infer<typeof VideoSchema>

/////////////////////////////////////////
// ANNOTATION SCHEMA
/////////////////////////////////////////

export const AnnotationSchema = z.object({
  id: z.number().int(),
  videoId: z.number().int(),
  startTimeInSec: z.number().int(),
  endTimeInSec: z.number().int(),
  type: z.string(),
  notes: z.string().nullable(),
})

export type Annotation = z.infer<typeof AnnotationSchema>
