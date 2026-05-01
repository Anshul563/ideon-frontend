import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "../../ideon-backend/src/modules/upload/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing`,
});
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing`,
});
