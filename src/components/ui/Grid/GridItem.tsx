import styles from './gridItem.module.css';
import react, { PropsWithChildren } from 'react';


interface GridItemProps extends PropsWithChildren {
    cols?: number;
}
const GridItem = react.forwardRef<null, GridItemProps>(({ children }, ref) => {

    return <div ref={ref} className={styles.column}>{children}</div>;
});

export default GridItem;
