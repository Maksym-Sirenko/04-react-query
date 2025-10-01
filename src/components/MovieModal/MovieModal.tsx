// src/components/MovieModal/MovieModal.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({
  movie: {
    title,
    overview,
    release_date,
    vote_average,
    backdrop_path,
    poster_path,
  },
  onClose,
}: MovieModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const imagePath = backdrop_path ?? poster_path ?? "";

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {imagePath && (
          <img
            className={css.image}
            src={`https://image.tmdb.org/t/p/w500${imagePath}`}
            alt={title ?? "Movie image"}
            loading="lazy"
          />
        )}

        <div className={css.content}>
          <h2 className={css.title}>{title ?? "Untitled"}</h2>
          <p className={css.overview}>
            {overview ?? "No description available."}
          </p>

          <p className={css.meta}>
            <strong>Release Date:</strong> {release_date ?? "Unknown"}
          </p>

          <p className={css.meta}>
            <strong>Rating:</strong> {vote_average ?? "N/A"}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
