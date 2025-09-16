"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompletePathParams = exports.PlaceSchema = exports.GooglePlaceSchema = exports.AutoCompleteSchema = exports.InputPlaceDetailsSchema = exports.PlacesType = void 0;
const z_1 = require("../../common/z");
exports.PlacesType = z_1.z.union([z_1.z.string("api"), z_1.z.string("places")]);
exports.InputPlaceDetailsSchema = z_1.z.object({
    type: exports.PlacesType,
    id: z_1.z.string().min(1)
});
exports.AutoCompleteSchema = z_1.z.object({
    suggestions: z_1.z.array(z_1.z.object({
        placePrediction: z_1.z.object({
            placeId: z_1.z.string(),
            text: z_1.z.object({ text: z_1.z.string() })
        })
    })).optional()
});
const AuthorAttributionSchema = z_1.z.object({
    displayName: z_1.z.string(),
    uri: z_1.z.string().url(),
    photoUri: z_1.z.string().url().optional(),
});
const Summarize = z_1.z.object({
    text: z_1.z.string(),
    languageCode: z_1.z.string()
});
const OverviewSummarize = z_1.z.object({
    overview: Summarize
});
const PhotoSchema = z_1.z.object({
    name: z_1.z.string(),
    widthPx: z_1.z.number().int().positive(),
    heightPx: z_1.z.number().int().positive(),
    authorAttributions: z_1.z.array(AuthorAttributionSchema).default([]),
    flagContentUri: z_1.z.string().url().optional(),
    googleMapsUri: z_1.z.string().url().optional(),
});
const GoogleMapsLinksSchema = z_1.z.object({
    directionsUri: z_1.z.string().url().optional(),
    placeUri: z_1.z.string().url().optional(),
    writeAReviewUri: z_1.z.string().url().optional(),
    reviewsUri: z_1.z.string().url().optional(),
    photosUri: z_1.z.string().url().optional(),
});
const DisplayNameSchema = z_1.z.object({
    text: z_1.z.string(),
    languageCode: z_1.z.string().min(2).max(16),
});
const LocationSchema = z_1.z.object({
    latitude: z_1.z.number().gte(-90).lte(90),
    longitude: z_1.z.number().gte(-180).lte(180),
});
exports.GooglePlaceSchema = z_1.z.object({
    name: z_1.z.string(),
    id: z_1.z.string(),
    types: z_1.z.array(z_1.z.string()).nonempty(),
    formattedAddress: z_1.z.string(),
    location: LocationSchema,
    rating: z_1.z.number().min(0).max(5).optional(),
    websiteUri: z_1.z.string().url().optional(),
    userRatingCount: z_1.z.number().int().nonnegative().optional(),
    displayName: DisplayNameSchema,
    photos: z_1.z.array(PhotoSchema).default([]),
    googleMapsLinks: GoogleMapsLinksSchema.optional(),
    generativeSummary: OverviewSummarize.optional(),
    editorialSummary: Summarize.optional()
}).strict();
exports.PlaceSchema = z_1.z.object({
    place_id: z_1.z.number(),
    name: z_1.z.string(),
    address: z_1.z.string(),
    lat: z_1.z.number(),
    lon: z_1.z.number(),
    categories: z_1.z.string().default(""),
    rating: z_1.z.number(),
    rating_count: z_1.z.number().default(0),
    places_picture_path: z_1.z.string().default(""),
    places_picture_url: z_1.z.string().default("").optional(),
    website_url: z_1.z.string().default("").optional(),
    api_id: z_1.z.string(),
    overview: z_1.z.string()
});
exports.AutocompletePathParams = z_1.z.object({
    input: z_1.z.string().min(1).describe("Search text for place predictions"),
});
//# sourceMappingURL=places-info.schema.js.map