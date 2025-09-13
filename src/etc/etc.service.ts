import { supabase } from "../config/db";
import { STORAGE_ERR } from "../core/errors";
import { ImageFile } from "./etc.schema";
import path from "node:path";
export const etcService = {
    async get_file_link(path:string,bucket:string,duration:number):Promise<{signedUrl:string}>{
      console.log(path,bucket)

        const {data,error} = await supabase.storage.from(bucket).createSignedUrl(path,duration);
        console.log("GET File")
        console.log(data)
        if (error) throw STORAGE_ERR(error);
        return data;
    },
    async upload_img_storage(file: ImageFile, pid:string,bucket:string): Promise<string> {
            console.log("Try upload_img place to storage")
            const contentType = file.mimetype || 'application/octet-stream';
            const path =pid+'.'+file.mimetype.split('/')[1];
            console.log(path)
            console.log(file)
            const { data, error } = await supabase.storage.from(bucket).upload(path, file.buffer, {
                contentType,
                cacheControl: '3600',
                upsert: true,
            });
            if (error) throw STORAGE_ERR(error);
            console.log(data)
            return data.path;
        },
    async downloadToImageFile(
      rawUrl: string
    ): Promise<ImageFile> {
      const url = rawUrl;
    
      const resp = await fetch(url, { redirect: "follow" });
      if (!resp.ok) {
        throw new Error(`Download failed: ${resp.status} ${resp.statusText}`);
      }
    
      const mimetype = resp.headers.get("content-type") || "application/octet-stream";
      const arrayBuffer = await resp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
    
    
      const cd = resp.headers.get("content-disposition");
      let filenameFromHeader: string | null = null;
      if (cd) {
        const m = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
        if (m?.[2]) filenameFromHeader = m[2];
      }
    
      const urlBase = (() => {
        try {
          return path.posix.basename(new URL(url).pathname) || null;
        } catch {
          return null;
        }
      })();
    
      const ext = mimetype || ".jpg";
      const base =
        filenameFromHeader ??
        urlBase ??
        crypto.randomUUID() + ext;
    
      const originalname = base.includes(".") ? base : `${base}${ext}`;
    
      const file: ImageFile = {
        fieldname: "image",
        originalname,
        encoding: "7bit",     
        mimetype: mimetype.toLowerCase() as ImageFile["mimetype"],
        buffer,
        size: buffer.length,
      };
      return file;
    }


}
