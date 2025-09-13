import { ImageFile } from "./etc.schema";
export declare const etcService: {
    get_file_link(path: string, bucket: string, duration: number): Promise<{
        signedUrl: string;
    }>;
    upload_img_storage(file: ImageFile, pid: string, bucket: string): Promise<string>;
    downloadToImageFile(rawUrl: string): Promise<ImageFile>;
};
//# sourceMappingURL=etc.service.d.ts.map