import axios from 'axios';
import React from 'react';
import { config } from '../config';

export interface UploadResult {
    hash: string;
}

// Uploads the file using the axios client
export async function uploadFile(file: File, title: string, onProgressChange: (progress: number) => void): Promise<UploadResult> {

    let lastValue = 0;

    // Track update progress
    const onUploadprogress = (progressEvent: ProgressEvent) => {
        lastValue = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        onProgressChange(lastValue);
    }

    // Create the request body
    const body = new FormData();

    body.append('Title', title);
    body.append('Description', "placeholder");
    body.append('File', file);

    return (await axios({
        method: "post",
        url: `${config.apiUrl}/files`,
        data: body,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onUploadprogress
    })).data;
}

export function useUploadProgress(progress: UploadProgress): [number, boolean, boolean] {
    const [percent, setPercent] = React.useState(0);
    const [done, setDone] = React.useState(false);
    const [error, setError] = React.useState(false);


    React.useEffect(() => {
        progress.observe(setPercent);
        progress.result.catch(() => setError(true)).then(() => setDone(true));
    }, [progress]);

    return [percent, done, error];
}