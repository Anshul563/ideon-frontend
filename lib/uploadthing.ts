import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "../../ideon-backend/src/modules/upload/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "http://localhost:5000/api/uploadthing",
});
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "http://localhost:5000/api/uploadthing",
});
