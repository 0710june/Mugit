import ReviewList from "./reviewList";

export default function Review() {
  return (
    <div className="mx-auto w-2/3 pb-10">
      <p className="text-2xl font-bold underline decoration-4 underline-offset-[7.3px]">
        Comments
      </p>
      <hr className="border-2" />
      <ReviewList />
    </div>
  );
}
