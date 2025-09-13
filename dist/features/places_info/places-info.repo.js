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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesInfoRepo = void 0;
const db_1 = require("../../config/db");
const errors_1 = require("../../core/errors");
const schema = __importStar(require("./places-info.schema"));
exports.PlacesInfoRepo = {
    async places_details(place_id) {
        const { data, error } = await db_1.supabase.from('places').select("place_id,name,address,lat,lon,categories,overview,rating,rating_count,places_picture_path").eq("place_id", place_id);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        if (data && data.length > 0) {
            const parsed = schema.PlaceSchema.safeParse(data[0]);
            if (!parsed.success)
                throw (0, errors_1.INTERNAL)("Can't Parsed places data");
            return parsed.data;
        }
        else {
            return null;
        }
    },
    async places_details_api(api_id) {
        const { data, error } = await db_1.supabase.from('places').select("place_id,name,address,lat,lon,categories,overview,rating,rating_count,places_picture_path").eq("api_id", api_id);
        console.log(data);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        if (data && data.length > 0) {
            const parsed = schema.PlaceSchema.safeParse(data[0]);
            if (!parsed.success)
                throw (0, errors_1.INTERNAL)("Can't Parsed places data");
            return parsed.data;
        }
        else {
            return null;
        }
    },
    async add_places(pdata) {
        const { places_picture_url, ...remain } = pdata;
        console.log(remain);
        const { data, error } = await db_1.supabase.from('places').insert(remain).select("*").single();
        console.log("SHow insert");
        console.log(data);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        const outdata = schema.PlaceSchema.parse(data);
        return outdata;
    }
};
//# sourceMappingURL=places-info.repo.js.map