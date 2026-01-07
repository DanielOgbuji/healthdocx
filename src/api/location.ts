import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export interface GeoapifyFeature {
    properties: {
        formatted: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

/**
 * Searches for a location using Geoapify Autocomplete API.
 * @param text - The search query.
 * @returns A list of location features.
 */
export const searchLocation = async (text: string): Promise<GeoapifyFeature[]> => {
    try {
        const response = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
             params: {
                text,
                apiKey: API_KEY,
                limit: 5,
                filter: "countrycode:ng",
            },
        });
        return response.data.features || [];
    } catch (error) {
        console.error("Geoapify fetch error:", error);
        return [];
    }
}
