import { asyncHandler } from "../../core/http";
import { Request, Response } from 'express';
import { PlacesInfoService } from './places-info.service'
import { BadRequest, INTERNAL, NotFound } from "../../core/errors";
import { etcService } from "../../etc/etc.service";
import { z } from "zod";
import { PlacesType } from "./places-info.schema";


export const autocomplete = asyncHandler(async (req: Request, res: Response) => {
    const input = req.params.input;
    if (!input) throw BadRequest("input do not exist in request");
    const predict_places = await PlacesInfoService.autocomplete(input);
    res.status(200).json(predict_places);
});

export const places_details = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw BadRequest("input do not exist in request");
    const req_type = PlacesType.safeParse(req.params.type);
    if (!req_type.success) throw BadRequest("request type not exist");

    const places_data = await PlacesInfoService.get_places_details(id, req_type.data);
    if (places_data == null) {
        const widthPx = 300;
        const heightPx = 600;
        const uploaded_data = await PlacesInfoService.getandupdate_gplace(id, widthPx, heightPx);
        if (uploaded_data.places_picture_path) {
            uploaded_data.places_picture_url = (await etcService.get_file_link(uploaded_data.places_picture_path, "places", 3600)).signedUrl;
        }
        const {places_picture_path,...remains} = uploaded_data;
        return res.status(200).json(remains);
    }
    else {
        let link = "";
        if(places_data.places_picture_path){
            link = (await etcService.get_file_link(places_data.places_picture_path,"places",3600)).signedUrl;
        }
        places_data.places_picture_url=link;
        const {places_picture_path,...remains} = places_data; 
        return res.status(200).json(remains);
    }
}
);

