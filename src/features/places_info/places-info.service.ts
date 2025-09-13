
import z from 'zod';
import * as schema from './places-info.schema';
import { env } from '../../config/env';
import axios from 'axios';
import { INTERNAL, NotFound } from '../../core/errors';
import { etcService } from '../../etc/etc.service';
import { PlacesInfoRepo } from './places-info.repo';
import path from "node:path";
import { ImageFile, ImageFileSchema } from '../../etc/etc.schema';
import { buffer } from 'node:stream/consumers';

export const PlacesInfoService = {
    async autocomplete(input: string): Promise<z.infer<typeof schema.AutoCompleteSchema>> {
        const apiKey = env.GOOGLE_PLACE_API_KEY;
        const { data } = await axios.post(
            "https://places.googleapis.com/v1/places:autocomplete",
            {
                "input": input,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": "suggestions.placePrediction.text.text,suggestions.placePrediction.placeId"
                },
            }
        );
        const parsed = schema.AutoCompleteSchema.safeParse(data);
        if (!parsed.success) throw INTERNAL("autocomplete Can not parsed");
        return parsed.data;
    },
    async google_places_details(pid: string): Promise<schema.GooglePlaces> {
        const apiKey = env.GOOGLE_PLACE_API_KEY;
        const { data } = await axios.get(
            "https://places.googleapis.com/v1/places/" + pid,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": "id,name,photos,googleMapsLinks,rating,generativeSummary,websiteUri,userRatingCount,location,formattedAddress,displayName,types,editorialSummary"

                }
            },
        );
        console.log(data)
        const parsed = schema.GooglePlaceSchema.safeParse(data);
        if (!parsed.success) throw INTERNAL("google places details Can not parsed");
        return parsed.data;
    },
    async get_places_details(id: string, type: string): Promise<schema.Places | null> {
        if (type == "api") {
            const data = await PlacesInfoRepo.places_details_api(id);
            if (data == null) { return null; }
            if (data.places_picture_path) {
                data.places_picture_url = (await etcService.get_file_link(data.places_picture_path, "places", 3600)).signedUrl;
            }
            return data;
        }
        else {
            const my_id = Number(id);
            const data = await PlacesInfoRepo.places_details(my_id);
            if (data == null) { throw NotFound(`place_id[${my_id}] don't exist in DB`); }
            if (data.places_picture_path) {
                data.places_picture_url = (await etcService.get_file_link(data.places_picture_path, "places", 3600)).signedUrl;
            }
            return data;
        }
    },

    async get_places_picture(photo_id: string, widthPx: number, heightPx: number): Promise<ImageFile> {
        const baseurl = "https://places.googleapis.com/v1/";
        const postfix = `/media?maxHeightPx=${heightPx}&maxWidthPx=${widthPx}`;
        const url = baseurl + photo_id + postfix;
        console.log(url)
        const data = await axios.get(
            url,
            {
                headers: {
                    "X-Goog-Api-Key": env.GOOGLE_PLACE_API_KEY,
                },
                responseType: "arraybuffer",       
                maxRedirects: 5,                   
                validateStatus: s => s < 400,
            }
        );
        const buffer = Buffer.from(data.data)


        const ext = (data.headers["content-type"].split("/")[1] || "bin");

        const image_file: ImageFile = {
            fieldname: "image",
            originalname: photo_id + "." + { ext },
            encoding: "binary",
            mimetype: data.headers["content-type"],
            buffer: buffer,
            size: buffer.length

        }
        const out = ImageFileSchema.safeParse(image_file);
        if (!out.success) throw INTERNAL("Image cant parsed");
        return out.data;
    },
    async getandupdate_gplace(id: string, widthPx: number, heightPx: number): Promise<schema.Places> {

        const gdata = await PlacesInfoService.google_places_details(id);
        console.log(gdata)
        let path = "";

        if (gdata.photos && gdata.photos.length > 0) {
            const img_id = gdata.photos[0]?.name;
            const img_file = await this.get_places_picture(img_id!, widthPx, heightPx);
            path = await etcService.upload_img_storage(img_file, gdata.id, "places");

        }
        let place_data: Omit<schema.Places, "place_id"> = {
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

        }
        console.log("New place Data");
        console.log(place_data);
        const upload_data = await PlacesInfoRepo.add_places(place_data);
        return upload_data;
    },




}