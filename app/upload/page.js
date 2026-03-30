import UploadStorefront from "../components/UploadStorefront";
export default function UploadPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Upload Artwork</div>
          <h1 style={{ margin: "10px 0 6px" }}>Product first. Upload second. Easy for customers.</h1>
          <div className="subtle">This replaces the old design flow with a cleaner upload-only ordering experience.</div>
        </div>
      </div>
      <UploadStorefront />
    </div>
  );
}
