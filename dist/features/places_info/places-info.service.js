"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesInfoService = void 0;
const schema = __importStar(require("./places-info.schema"));
const env_1 = require("../../config/env");
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../../core/errors");
const etc_service_1 = require("../../etc/etc.service");
const places_info_repo_1 = require("./places-info.repo");
const etc_schema_1 = require("../../etc/etc.schema");
exports.PlacesInfoService = {
    async autocomplete(input) {
        const apiKey = env_1.env.GOOGLE_PLACE_API_KEY;
        const { data } = await axios_1.default.post("https://places.googleapis.com/v1/places:autocomplete", {
            "input": input,
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "suggestions.placePrediction.text.text,suggestions.placePrediction.placeId"
            },
        });
        const parsed = schema.AutoCompleteSchema.safeParse(data);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("autocomplete Can not parsed");
        return parsed.data;
    },
    async google_places_details(pid) {
        const apiKey = env_1.env.GOOGLE_PLACE_API_KEY;
        const { data } = await axios_1.default.get("https://places.googleapis.com/v1/places/" + pid, {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "id,name,photos,googleMapsLinks,rating,generativeSummary,websiteUri,userRatingCount,location,formattedAddress,displayName,types"
            }
        });
        console.log(data);
        const parsed = schema.GooglePlaceSchema.safeParse(data);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("google places details Can not parsed");
        return parsed.data;
    },
    async get_places_details(id, type) {
        if (type == "api") {
            const data = await places_info_repo_1.PlacesInfoRepo.places_details_api(id);
            if (data == null) {
                return null;
            }
            if (data.places_picture_path) {
                data.places_picture_url = (await etc_service_1.etcService.get_file_link(data.places_picture_path, "places_picture", 600)).signedUrl;
            }
            return data;
        }
        else {
            const my_id = Number(id);
            const data = await places_info_repo_1.PlacesInfoRepo.places_details(my_id);
            if (data == null) {
                return null;
            }
            if (data.places_picture_path) {
                data.places_picture_url = (await etc_service_1.etcService.get_file_link(data.places_picture_path, "places_picture", 600)).signedUrl;
            }
            return data;
        }
    },
    async get_places_picture(photo_id, widthPx, heightPx) {
        const baseurl = "https://places.googleapis.com/v1/";
        const postfix = `/media?maxHeightPx=${heightPx}&maxWidthPx=${widthPx}`;
        const url = baseurl + photo_id + postfix;
        console.log(url);
        const data = await axios_1.default.get(url, {
            headers: {
                "X-Goog-Api-Key": env_1.env.GOOGLE_PLACE_API_KEY,
            },
            responseType: "arraybuffer",
            maxRedirects: 5,
            validateStatus: s => s < 400,
        });
        const buffer = Buffer.from(data.data);
        const ext = (data.headers["content-type"].split("/")[1] || "bin");
        const image_file = {
            fieldname: "image",
            originalname: photo_id + "." + { ext },
            encoding: "binary",
            mimetype: data.headers["content-type"],
            buffer: buffer,
            size: buffer.length
        };
        const out = etc_schema_1.ImageFileSchema.safeParse(image_file);
        if (!out.success)
            throw (0, errors_1.INTERNAL)("Image cant parsed");
        return out.data;
    },
    async getandupdate_gplace(id, widthPx, heightPx) {
        const gdata = await exports.PlacesInfoService.google_places_details(id);
        console.log(gdata);
        let path = "";
        if (gdata.photos && gdata.photos.length > 0) {
            const img_id = gdata.photos[0]?.name;
            const img_file = await this.get_places_picture(img_id, widthPx, heightPx);
            path = await etc_service_1.etcService.upload_img_storage(img_file, gdata.id, "places");
        }
        let place_data = {
            name: gdata.displayName.text,
            address: gdata.formattedAddress,
            categories: gdata.types.join(","),
            lat: gdata.location.latitude,
            lon: gdata.location.longitude,
            rating: gdata.rating ?? -1,
            rating_count: gdata.userRatingCount ?? -1,
            website_url: gdata.websiteUri ?? "",
            places_picture_path: path,
            api_id: id,
            overview: gdata.editorialSummary?.text ?? gdata.generativeSummary?.overview.text ?? ""
        };
        console.log("New place Data");
        console.log(place_data);
        const upload_data = await places_info_repo_1.PlacesInfoRepo.add_places(place_data);
        return upload_data;
    },
};
//# sourceMappingURL=places-info.service.js.map