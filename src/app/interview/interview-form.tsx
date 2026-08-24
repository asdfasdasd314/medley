"use client";

import { useState } from "react";

type InterviewFormProps = {
  songs: string[];
  minRating: number;
  maxRating: number;
};

export function InterviewForm({
  songs,
  minRating,
  maxRating,
}: InterviewFormProps) {
  const [ratings, setRatings] = useState<(number | null)[]>(
    () => songs.map(() => null),
  );

  const scores = Array.from(
    { length: maxRating - minRating + 1 },
    (_, i) => minRating + i,
  );

  function setRating(songIndex: number, value: number) {
    setRatings((prev) => {
      const next = [...prev];
      next[songIndex] = value;
      return next;
    });
  }

  const ratedCount = ratings.filter((r) => r !== null).length;

  return (
    <div className="interview-form">
      <p className="progress">
        {ratedCount} / {songs.length} rated
      </p>

      <ol className="song-list">
        {songs.map((song, songIndex) => {
          const current = ratings[songIndex];
          return (
            <li
              key={song}
              className="song-row"
              style={{ animationDelay: `${songIndex * 40}ms` }}
            >
              <div className="song-meta">
                <span className="song-index">
                  {String(songIndex + 1).padStart(2, "0")}
                </span>
                <span className="song-title">{song}</span>
              </div>

              <div
                className="score-row"
                role="group"
                aria-label={`Rate ${song}`}
              >
                {scores.map((score) => {
                  const selected = current === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      className={selected ? "score-btn selected" : "score-btn"}
                      aria-pressed={selected}
                      onClick={() => setRating(songIndex, score)}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
