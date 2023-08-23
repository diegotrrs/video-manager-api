-- CreateTable
CREATE TABLE "Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "durationInSec" INTEGER NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Annotation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoId" INTEGER NOT NULL,
    "startTimeInSec" INTEGER NOT NULL,
    "endTimeInSec" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Annotation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
