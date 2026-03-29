import TemplateBrowser from "../components/TemplateBrowser";

export default function DesignerPage() {
  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <div className="badge">Designer</div>
          <h1 style={{margin:"10px 0 6px"}}>Template-based design system</h1>
          <div className="subtle">Cleaner customer flow with starter templates plus upload-your-own-design support.</div>
        </div>
      </div>
      <TemplateBrowser />
    </div>
  );
}
