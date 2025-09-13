"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.etcService = void 0;
const db_1 = require("../config/db");
const errors_1 = require("../core/errors");
const node_path_1 = __importDefault(require("node:path"));
exports.etcService = {
    async get_file_link(path, bucket, duration) {
        const { data, error } = await db_1.supabase.storage.from(bucket).createSignedUrl(path, duration);
        if (error)
            throw (0, errors_1.STORAGE_ERR)(error);
        return data;
    },
    async upload_img_storage(file, pid, bucket) {
        console.log("Try upload_img place to storage");
        const contentType = file.mimetype || 'application/octet-stream';
        const path = pid + '.' + file.mimetype.split('/')[1];
        console.log(path);
        console.log(file);
        const { data, error } = await db_1.supabase.storage.from(bucket).upload(path, file.buffer, {
            contentType,
            cacheControl: '3600',
            upsert: true,
        });
        if (error)
            throw (0, errors_1.STORAGE_ERR)(error);
        console.log(data);
        return data.path;
    },
    async downloadToImageFile(rawUrl) {
        const url = rawUrl;
        const resp = await fetch(url, { redirect: "follow" });
        if (!resp.ok) {
            throw new Error(`Download failed: ${resp.status} ${resp.statusText}`);
        }
        const mimetype = resp.headers.get("content-type") || "application/octet-stream";
        const arrayBuffer = await resp.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const cd = resp.headers.get("content-disposition");
        let filenameFromHeader = null;
        if (cd) {
            const m = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
            if (m?.[2])
                filenameFromHeader = m[2];
        }
        const urlBase = (() => {
            try {
                return node_path_1.default.posix.basename(new URL(url).pathname) || null;
            }
            catch {
                return null;
            }
        })();
        const ext = mimetype || ".jpg";
        const base = filenameFromHeader ??
            urlBase ??
            crypto.randomUUID() + ext;
        const originalname = base.includes(".") ? base : `${base}${ext}`;
        const file = {
            fieldname: "image",
            originalname,
            encoding: "7bit",
            mimetype: mimetype.toLowerCase(),
            buffer,
            size: buffer.length,
        };
        return file;
    }
};
//# sourceMappingURL=etc.service.js.map