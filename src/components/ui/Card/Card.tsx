import { PropsWithChildren } from "react";
import styles from './card.module.css';

interface CardProps extends PropsWithChildren { }

function Card({ children }: CardProps) {
    return (
        <div className={styles.Card}>
            {children}
        </div>
    );
}

export default Card;