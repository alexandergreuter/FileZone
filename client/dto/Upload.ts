import { UploadProgress } from "../hooks/upload";

export class Upload {
    id: string;
    filename: string;
    file: File;
    progress: UploadProgress;
}