import UploadStorefront from "../components/UploadStorefront";
export default function UploadPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Upload Artwork</div>
          <h1 style={{ margin: "10px 0 6px" }}>Upload finished files and move quickly to checkout</h1>
          <div className="subtle">A cleaner upload-first order page built for real print jobs.</div>
        </div>
      </div>
      <UploadStorefront />
    </div>
  );
}
