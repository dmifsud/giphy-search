import React, { PropsWithChildren } from 'react';
import styles from './grid.module.css';
import classNames from 'classnames';

export type GridColumnSize = 1 | 2 | 3 | 4 | 6 | 12;


interface GridProps extends PropsWithChildren {
  className?: string;
  wrap?: React.CSSProperties['flexWrap'];
  gap?: number;
  columns: GridColumnSize;
}

const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  wrap = 'wrap',
  gap = 16,
  columns
}) => {

  return (
    <>
      {
        <div className={classNames(styles.GridContainer, className, {
          [styles.cols1]: columns === 1,
          [styles.cols2]: columns === 2,
          [styles.cols3]: columns === 3,
          [styles.cols4]: columns === 4,
          [styles.cols6]: columns === 6,
          [styles.cols12]: columns === 12,
        })} style={{ gap, flexWrap: wrap }}>
          {children}
        </div>
      }
    </>
  );
};

export default Grid;
