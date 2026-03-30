import UploadStorefront from "../components/UploadStorefront";
export default function UploadPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Upload Artwork</div>
          <h1 style={{ margin: "10px 0 6px" }}>Fast ordering for customers with finished files</h1>
          <div className="subtle">Simple, polished, and easy to understand from the first glance.</div>
        </div>
      </div>
      <UploadStorefront />
    </div>
  );
}
