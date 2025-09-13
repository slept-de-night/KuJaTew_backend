import z from 'zod';
import * as schema from './places-info.schema';
import { ImageFile } from '../../etc/etc.schema';
export declare const PlacesInfoService: {
    autocomplete(input: string): Promise<z.infer<typeof schema.AutoCompleteSchema>>;
    google_places_details(pid: string): Promise<schema.GooglePlaces>;
    get_places_details(id: string, type: string): Promise<schema.Places | null>;
    get_places_picture(photo_id: string, widthPx: number, heightPx: number): Promise<ImageFile>;
    getandupdate_gplace(id: string, widthPx: number, heightPx: number): Promise<schema.Places>;
};
//# sourceMappingURL=places-info.service.d.ts.map