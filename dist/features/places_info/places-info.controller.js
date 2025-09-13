"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.places_details = exports.autocomplete = void 0;
const http_1 = require("../../core/http");
const places_info_service_1 = require("./places-info.service");
const errors_1 = require("../../core/errors");
const etc_service_1 = require("../../etc/etc.service");
exports.autocomplete = (0, http_1.asyncHandler)(async (req, res) => {
    const input = req.params.input;
    if (!input)
        throw (0, errors_1.BadRequest)("input do not exist in request");
    const predict_places = await places_info_service_1.PlacesInfoService.autocomplete(input);
    res.status(200).json(predict_places);
});
exports.places_details = (0, http_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    if (!id)
        throw (0, errors_1.BadRequest)("input do not exist in request");
    const req_type = String(req.params.type);
    if (!req_type)
        throw (0, errors_1.BadRequest)("request type not exist");
    const places_data = await places_info_service_1.PlacesInfoService.get_places_details(id, req_type);
    console.log("IS data exist");
    console.log(places_data);
    if (places_data == null) {
        const widthPx = 300;
        const heightPx = 600;
        if (req_type == "place") {
            throw (0, errors_1.INTERNAL)("place don't exist in DB by place_id");
        }
        const uploaded_data = await places_info_service_1.PlacesInfoService.getandupdate_gplace(id, widthPx, heightPx);
        if (uploaded_data.places_picture_path) {
            uploaded_data.places_picture_url = (await etc_service_1.etcService.get_file_link(uploaded_data.places_picture_path, "places", 3600)).signedUrl;
        }
        const { places_picture_path, ...remains } = uploaded_data;
        return res.status(200).json(remains);
    }
    else {
        let link = "";
        if (places_data.places_picture_path) {
            link = (await etc_service_1.etcService.get_file_link(places_data.places_picture_path, "places", 3600)).signedUrl;
        }
        places_data.places_picture_url = link;
        const { places_picture_path, ...remains } = places_data;
        return res.status(200).json(remains);
    }
});
//# sourceMappingURL=places-info.controller.js.map