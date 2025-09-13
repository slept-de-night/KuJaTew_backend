"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceSchema = exports.GooglePlaceSchema = exports.AutoCompleteSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.AutoCompleteSchema = zod_1.default.object({
    suggestions: zod_1.default.array(zod_1.default.object({
        placePrediction: zod_1.default.object({
            placeId: zod_1.default.string(),
            text: zod_1.default.object({ text: zod_1.default.string() })
        })
    })).optional()
});
const AuthorAttributionSchema = zod_1.default.object({
    displayName: zod_1.default.string(),
    uri: zod_1.default.string().url(),
    photoUri: zod_1.default.string().url().optional(),
});
const Summarize = zod_1.default.object({
    text: zod_1.default.string(),
    languageCode: zod_1.default.string()
});
const OverviewSummarize = zod_1.default.object({
    overview: Summarize
});
const PhotoSchema = zod_1.default.object({
    name: zod_1.default.string(),
    widthPx: zod_1.default.number().int().positive(),
    heightPx: zod_1.default.number().int().positive(),
    authorAttributions: zod_1.default.array(AuthorAttributionSchema).default([]),
    flagContentUri: zod_1.default.string().url().optional(),
    googleMapsUri: zod_1.default.string().url().optional(),
});
const GoogleMapsLinksSchema = zod_1.default.object({
    directionsUri: zod_1.default.string().url().optional(),
    placeUri: zod_1.default.string().url().optional(),
    writeAReviewUri: zod_1.default.string().url().optional(),
    reviewsUri: zod_1.default.string().url().optional(),
    photosUri: zod_1.default.string().url().optional(),
});
const DisplayNameSchema = zod_1.default.object({
    text: zod_1.default.string(),
    languageCode: zod_1.default.string().min(2).max(16),
});
const LocationSchema = zod_1.default.object({
    latitude: zod_1.default.number().gte(-90).lte(90),
    longitude: zod_1.default.number().gte(-180).lte(180),
});
exports.GooglePlaceSchema = zod_1.default.object({
    name: zod_1.default.string(),
    id: zod_1.default.string(),
    types: zod_1.default.array(zod_1.default.string()).nonempty(),
    formattedAddress: zod_1.default.string(),
    location: LocationSchema,
    rating: zod_1.default.number().min(0).max(5).optional(),
    websiteUri: zod_1.default.string().url().optional(),
    userRatingCount: zod_1.default.number().int().nonnegative().optional(),
    displayName: DisplayNameSchema,
    photos: zod_1.default.array(PhotoSchema).default([]),
    googleMapsLinks: GoogleMapsLinksSchema.optional(),
    generativeSummary: OverviewSummarize.optional(),
    editorialSummary: Summarize.optional()
}).strict();
exports.PlaceSchema = zod_1.default.object({
    place_id: zod_1.default.number(),
    name: zod_1.default.string(),
    address: zod_1.default.string(),
    lat: zod_1.default.number(),
    lon: zod_1.default.number(),
    categories: zod_1.default.string().default(""),
    rating: zod_1.default.number(),
    rating_count: zod_1.default.number().default(0),
    places_picture_path: zod_1.default.string().default(""),
    places_picture_url: zod_1.default.string().default("").optional(),
    website_url: zod_1.default.string().default("").optional(),
    api_id: zod_1.default.string(),
    overview: zod_1.default.string()
});
//# sourceMappingURL=places-info.schema.js.map