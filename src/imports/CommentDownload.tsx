import svgPaths from "./svg-uw28geut9b";

function CommentDownload({ className }: { className?: string }) {
  return (
    <div className={className} data-name="comment-download">
      <div className="absolute inset-[8.33%_8.31%_8.33%_8.34%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p28513b80} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function CommentDownload1() {
  return <CommentDownload className="relative size-full" />;
}