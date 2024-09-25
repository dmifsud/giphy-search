import { Gif } from "../../models/giphy.models";
import styles from './giphyThumbnail.module.css';

export interface GiphyThumbnailProps {
    gif: Gif;
}

function GiphyThumbnail({ gif }: GiphyThumbnailProps) {
    return (
        <a href={gif.url} className={styles.imageContainer} target="_blank" title={gif.alt_text}>
            <img className={styles.image} src={gif.images.preview_gif.url} alt={gif.alt_text} />
        </a>
    );
}

export default GiphyThumbnail;