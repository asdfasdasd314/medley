import { InterviewForm } from "./interview-form";
import { loadSongRatingParams } from "@/lib/song-rating-params";

export default function InterviewPage() {
  const { songs, minRating, maxRating } = loadSongRatingParams();

  return (
    <main className="interview-page">
      <header className="interview-header">
        <p className="eyebrow">Medley</p>
        <h1>Rate these songs</h1>
        <p className="lede">
          Pretend this is a playlist. Score each track from {minRating} to{" "}
          {maxRating}. Nothing is saved yet.
        </p>
      </header>

      <InterviewForm
        songs={songs}
        minRating={minRating}
        maxRating={maxRating}
      />
    </main>
  );
}
