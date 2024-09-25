import { useCallback, useMemo, useRef, useState } from "react";
import { GiphyApi } from "../api/giphy.api";
import { Gif, GiphyResponse } from "../models/giphy.models";
// import mockData from './data.mock.json';
import { CrudSlice } from "../models/crud.models";


interface GiphyCrudSlice extends CrudSlice<Gif[]> {
    offset?: number;
    pageCount?: number;
    totalCount?: number;
    hasNext?: boolean;
    searchLoading: boolean;
    loadingMore: boolean;
}

function useGiphySearchStore() {

    const initialState: GiphyCrudSlice = {
        data: [],
        loading: true,
        error: null,
        searchLoading: false,
        loadingMore: false,
    };

    const [crudData, setCrudData] = useState<GiphyCrudSlice>(initialState);
    let currentSearchText = useRef<string>('');

    const setResponseToCrud = useCallback(({ data, pagination, meta }: GiphyResponse) => {
        console.log('setting pagination', pagination, meta);
        setCrudData({
            ...initialState,
            data,
            offset: pagination?.offset,
            pageCount: pagination?.count,
            totalCount: pagination?.total_count,
            hasNext: pagination ? pagination.total_count > pagination.offset : false,
            loading: false,
            error: meta && meta.status !== 200 ? meta?.msg : null
        });
    }, [crudData]);

    const getTrending = useCallback(async () => {
        setCrudData((prevState) => ({ ...prevState, loading: true, error: null }));
        try {
            const response = await GiphyApi.trending();
            setResponseToCrud(response);
        } catch (error) {
            setResponseToCrud(error as any as GiphyResponse);
        }
    }, [setResponseToCrud]);

    const searchGifs = useCallback(async (searchText: string) => {
        setCrudData((prevState) => ({ ...prevState, searchLoading: true, error: null }));
        currentSearchText.current = searchText;
        try {
            const response = await GiphyApi.search(searchText);
            setResponseToCrud(response);
        } catch (error) {
            setResponseToCrud(error as any as GiphyResponse);
        }
    }, [setResponseToCrud]);

    const getNextTrending = useCallback(async () => {
        if (crudData.offset !== undefined && crudData.pageCount !== undefined) {
            setCrudData((prevState) => ({ ...prevState, loadingMore: true, error: null }));
            console.log('setting new offset', crudData.offset + crudData.pageCount);
            try {
                const response = await GiphyApi.trending({ offset: crudData.offset + crudData.pageCount });
                setResponseToCrud({
                    ...response,
                    data: [...crudData.data, ...response.data]
                });
            } catch (error) {
                setResponseToCrud(error as any as GiphyResponse);
            }
        }
    }, [setResponseToCrud]);

    const getNextSearch = useCallback(async () => {
        if (currentSearchText.current) {
            if (crudData.offset !== undefined && crudData.pageCount !== undefined) {
                setCrudData((prevState) => ({ ...prevState, loadingMore: true, error: null }));
                try {
                    const response = await GiphyApi.search(currentSearchText.current, { offset: crudData.offset + crudData.pageCount });
                    setResponseToCrud({
                        ...response,
                        data: [...crudData.data, ...response.data]
                    });
                } catch (error) {
                    setResponseToCrud(error as any as GiphyResponse);
                }
            }
        } else {
            console.error('Search not set! Please call searchGifs first');
        }
    }, [setResponseToCrud]);


    return useMemo(() => ({
        getTrending,
        searchGifs,
        getNextTrending,
        getNextSearch,
        ...crudData,
    }), [crudData, getTrending, searchGifs, getNextTrending, getNextSearch]);
}

export default useGiphySearchStore;