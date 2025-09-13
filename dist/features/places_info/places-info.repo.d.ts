import * as schema from './places-info.schema';
export declare const PlacesInfoRepo: {
    places_details(place_id: number): Promise<schema.Places | null>;
    places_details_api(api_id: string): Promise<schema.Places | null>;
    add_places(pdata: Omit<schema.Places, "place_id">): Promise<schema.Places>;
};
//# sourceMappingURL=places-info.repo.d.ts.map