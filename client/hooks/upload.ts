import axios from 'axios';
import React from 'react';
import { config } from '../config';
import { UploadResult } from '../dto/UploadResult';

export interface UploadProgress {
    observe: (next: (progress: number | 'done') => void) => void;
    onUploadDone: Promise<UploadResult>;
}


// Uploads the file using the axios client
export function uploadFile(file: File): UploadProgress {

    let observer = null
    let lastValue: number | 'done' = 0;

    const body = new FormData();

    body.append('file', file);
    body.append('title', file.name);

    const req = axios({
        method: "post",
        url: `${config.apiUrl}/files`,
        data: body,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: ProgressEvent) => {
            const percent = Math.floor(progressEvent.total / progressEvent.loaded) * 100;

            lastValue = percent == 100 ? 'done' : percent;

            if (observer) {
                observer(lastValue);
            }
        } 
    })

    return {
        observe: (next: (progress: number | 'done') => void) => {
            observer = next;
            next(lastValue);
        },
        onUploadDone: req.then(res => res.data as UploadResult)
    }
}

export function useUploadProgress(progress: UploadProgress) {
    const [value, setValue] = React.useState<number | 'done'>(0);

    React.useEffect(() => {
        progress.observe(setValue);
    }, [progress]);

    return value;
}