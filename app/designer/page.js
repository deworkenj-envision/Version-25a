import PremiumGallery from "../components/PremiumGallery";
export default function DesignerPage() {
  return (
    <div className="grid" style={{gap:22}}>
      <div className="page-head">
        <div>
          <div className="badge">Designer</div>
          <h1 style={{margin:"10px 0 6px"}}>Premium template gallery</h1>
          <div className="subtle">Business-card-first, industry-driven, with stronger starter layouts and better product previews.</div>
        </div>
      </div>
      <PremiumGallery />
    </div>
  );
}
