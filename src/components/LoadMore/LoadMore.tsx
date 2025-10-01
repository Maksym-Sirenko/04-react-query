import css from "./LoadMore.module.css";

type LoadMoreProps = {
  handleClick: () => void;
};

const LoadMore = ({ handleClick }: LoadMoreProps) => (
  <div className={css.container}>
    <button className={css.button} onClick={handleClick}>
      Load more
    </button>
  </div>
);

export default LoadMore;
