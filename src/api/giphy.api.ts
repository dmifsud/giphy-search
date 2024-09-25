import { GiphyRequest, GiphyResponse } from "../models/giphy.models";
import { Api } from "./api";

const API_ROOT = 'https://api.giphy.com/v1/gifs';
const api_key = import.meta.env.VITE_GIPHY_API_KEY || '';



export type GiphyRequestParams = Omit<GiphyRequest, 'api_key'>;

const defaultRequestParams: GiphyRequestParams = {
    limit: import.meta.env.VITE_GIPHY_LIMIT || 48,
    rating: 'pg',
    offset: 0,
};

export class GiphyApi {

    static async get<T>(url: string, params: GiphyRequestParams): Promise<T> {
        const queryString = new URLSearchParams(
            Object.entries({
                api_key,
                ...params
            })
              .filter(([, value]) => value !== undefined && value !== null)
        ).toString();
        return Api.get(`${url}?${queryString}`);
    }

    static async search(q: string, params: Partial<GiphyRequestParams> = defaultRequestParams): Promise<GiphyResponse> {
        try {
            return await GiphyApi.get<GiphyResponse>(`${API_ROOT}/search`, { ...defaultRequestParams, ...params, q });
        } catch (error) {
            console.error('Failed to search for gifs:', error);
            return Promise.reject(error);
        }
    }

    static async trending(params: Partial<GiphyRequestParams> = defaultRequestParams): Promise<GiphyResponse> {
        console.log(import.meta.env);
        try {
            return await GiphyApi.get<GiphyResponse>(`${API_ROOT}/trending`, { ...defaultRequestParams, ...params });
        } catch (error) {
            console.error('Failed to fetch tending gifs:', error);
            return Promise.reject(error);
        }
    }
}