import {z}  from '../../common/z';


export const PlacesType = z.union([z.string("api"),z.string("places")])
export const InputPlaceDetailsSchema = z.object({
    type:PlacesType,
    id:z.string().min(1)
});

export const AutoCompleteSchema = z.object({
    suggestions: z.array(z.object({
        placePrediction: z.object({
            placeId: z.string(),
            text: z.object({ text: z.string() })
        })
    })).optional()
});

const AuthorAttributionSchema = z.object({
    displayName: z.string(),
    uri: z.string().url(),
    photoUri: z.string().url().optional(),
});
const Summarize = z.object({
    text: z.string(),
    languageCode: z.string()

})
const OverviewSummarize = z.object({
    overview: Summarize
        
})
const PhotoSchema = z.object({
    name: z.string(),
    widthPx: z.number().int().positive(),
    heightPx: z.number().int().positive(),
    authorAttributions: z.array(AuthorAttributionSchema).default([]),
    flagContentUri: z.string().url().optional(),
    googleMapsUri: z.string().url().optional(),
});

const GoogleMapsLinksSchema = z.object({
    directionsUri: z.string().url().optional(),
    placeUri: z.string().url().optional(),
    writeAReviewUri: z.string().url().optional(),
    reviewsUri: z.string().url().optional(),
    photosUri: z.string().url().optional(),
});

const DisplayNameSchema = z.object({
    text: z.string(),
    languageCode: z.string().min(2).max(16),
});

const LocationSchema = z.object({
    latitude: z.number().gte(-90).lte(90),
    longitude: z.number().gte(-180).lte(180),
});

export const GooglePlaceSchema = z.object({
    name: z.string(),
    id: z.string(),
    types: z.array(z.string()).nonempty(),
    formattedAddress: z.string(),
    location: LocationSchema,
    rating: z.number().min(0).max(5).optional(),
    websiteUri: z.string().url().optional(),
    userRatingCount: z.number().int().nonnegative().optional(),
    displayName: DisplayNameSchema,
    photos: z.array(PhotoSchema).default([]),
    googleMapsLinks: GoogleMapsLinksSchema.optional(),
    generativeSummary:OverviewSummarize.optional(),
    editorialSummary:Summarize.optional()

}).strict();
export type GooglePlaces = z.infer<typeof GooglePlaceSchema>;
export const PlaceSchema = z.object({
    place_id: z.number(),
    name: z.string(),
    address: z.string(),
    lat: z.number(),
    lon: z.number(),
    categories: z.string().default(""),
    rating: z.number(),
    rating_count: z.number().default(0),
    places_picture_path: z.string().default(""),
    places_picture_url: z.string().default("").optional(),
    website_url: z.string().default("").optional(),
    api_id: z.string(),
    overview: z.string()
});
export const AutocompletePathParams = z.object({
  input: z.string().min(1).describe("Search text for place predictions"),
});
export type Places = z.infer<typeof PlaceSchema>;



