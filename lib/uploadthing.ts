import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { FileRouter } from "uploadthing/next";

// Removed cross-directory import to fix build error
export type OurFileRouter = FileRouter;

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing`,
});
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing`,
});
