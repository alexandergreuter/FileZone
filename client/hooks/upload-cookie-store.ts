import { getCookie, setCookies } from 'cookies-next';
import { UploadInfo } from '../pages';

export const uploadsCookieKey = 'uploads' as const;

export interface StorableUpload {
    id: string;
    info: UploadInfo;
    link: string;
}

export function getUploads(context?): StorableUpload[] {
    const cookie = getCookie(uploadsCookieKey, context) as string;
    if (!cookie) {
        return [];
    }

    return JSON.parse(cookie);
}

export function setUploads(uploads: StorableUpload[]) {
    setCookies(uploadsCookieKey, JSON.stringify(uploads), {
        sameSite: 'lax',
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365) * 1000)
    });
}