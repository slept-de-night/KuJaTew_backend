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
exports.registerPlaceInfo = registerPlaceInfo;
const schema = __importStar(require("./places-info.schema"));
function registerPlaceInfo(registry) {
    registry.register("AutocompletePathParams", schema.AutocompletePathParams);
    registry.register("Predictions", schema.AutoCompleteSchema);
    registry.register("InputPlaceDetailsType", schema.InputPlaceDetailsSchema);
    registry.register("PlaceDetails", schema.PlaceSchema);
    registry.registerPath({
        method: "get",
        path: "/api/places/{id}/{type}",
        operationId: "getPlaceDetails by api_id or place_id",
        summary: "Returns place information for the given id",
        request: {
            params: schema.InputPlaceDetailsSchema,
        },
        responses: {
            200: {
                description: "Places Information",
                content: { "application/json": { schema: schema.PlaceSchema } },
            },
            400: { description: "Validation error" },
        },
        tags: ["place Infomation"],
    });
    registry.registerPath({
        method: "get",
        path: "/api/places/autocomplete/{input}",
        operationId: "getAutocompleteByInput",
        summary: "Returns place predictions for the given input",
        request: {
            params: schema.AutocompletePathParams,
        },
        responses: {
            200: {
                description: "List of predictions",
                content: { "application/json": { schema: schema.AutoCompleteSchema } },
            },
            400: { description: "Validation error" },
        },
        tags: ["place Infomation"],
    });
}
//# sourceMappingURL=places-info.openapi.js.map