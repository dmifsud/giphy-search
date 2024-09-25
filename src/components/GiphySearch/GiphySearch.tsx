import { useEffect, useRef } from "react";
import useGiphySearchStore from "../../hooks/useGiphySearchStore";
import GiphyThumbnail from "../GiphyThumbnail/GiphyThumbnail";
import Grid from "../ui/Grid/Grid";
import GridItem from "../ui/Grid/GridItem";
import Card from "../ui/Card/Card";
import styles from './giphySearch.module.css';
import Skeleton from "react-loading-skeleton";

function SkeletonLoadingGrid() {
    const limit = Number(import.meta.env.VITE_GIPHY_LIMIT);
    return (
        Array(limit).fill(null).map((_, i) =>
            <GridItem key={`loading-${i}`}>
                <Card>
                    <Skeleton containerClassName={styles.SkeletonContainer} className={styles.GiphySkeleton} />
                </Card>
            </GridItem>
        )
    );
}

function GiphySearch() {

    const {
        data: gifs,
        loading,
        searchLoading,
        loadingMore,
        getTrending,
        searchGifs,
        getNextSearch,
        getNextTrending,
        hasNext,
        error
    } = useGiphySearchStore();

    const searchQueryRef = useRef<HTMLInputElement>(null);
    const searchFormRef = useRef<HTMLFormElement>(null);
    const searchType = useRef<'trending' | 'search'>('trending');


    useEffect(() => {
        getTrending();
        searchType.current = 'trending';
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const searchQuery = searchQueryRef.current?.value;
        if (searchQuery) {
            searchGifs(searchQuery);
            searchType.current = 'search';
        } else {
            getTrending();
            searchType.current = 'trending';
        }
        console.log('Search query:', searchQuery);
        // searchFormRef.current?.reset();
    };

    const handleNext = () => {
        switch (searchType.current) {
            case 'trending':
                getNextTrending();
                break;
            case 'search':
                getNextSearch();
                break;
            default:
                console.error('Search type not set');
                break;
        }

    };

    console.log('render', gifs.length, loading, hasNext);

    return (
        <div>
            <div className={styles.FormContainer}>
                <form ref={searchFormRef} className={styles.Form} onSubmit={handleSubmit}>
                    <label className={styles.FormLabel}>Search</label>
                    <div className={styles.RelativeContainer}>
                        <div className={styles.IconContainer}>
                            <svg className={styles.SearchIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" ref={searchQueryRef} className={styles.SearchInput} placeholder="Search Giphys..." />
                        <button type="submit" className={styles.SearchButton}>
                            {searchLoading ? <>Searching&hellip;</> : <>Search</>}
                        </button>
                    </div>
                </form>
            </div>

            {error && <div className={styles.ErrorContainer}>{error}</div>}

            <Grid columns={2}>
                {
                    loading ?
                        <SkeletonLoadingGrid /> :
                        gifs.map((gif, i) =>
                            <GridItem key={`${gif.id}-${i}`}>
                                <Card>
                                    <GiphyThumbnail gif={gif} />
                                </Card>
                            </GridItem>
                        )
                }
                {
                    loadingMore &&
                    <SkeletonLoadingGrid />
                }
            </Grid>

            {hasNext &&
                <div className={styles.LoadMoreContainer}>
                    <button className={styles.NextButton} onClick={handleNext}>Load more&hellip;</button>
                </div>
            }

        </div>
    );
}

export default GiphySearch;