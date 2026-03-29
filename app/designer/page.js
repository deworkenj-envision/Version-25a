import PremiumDesigner from "../components/PremiumDesigner";

export default function DesignerPage(){
  return (
    <div className="grid" style={{gap:22}}>
      <div className="page-head">
        <div>
          <div className="badge">Designer</div>
          <h1 style={{margin:"10px 0 6px"}}>Premium template designer</h1>
          <div className="subtle">A cleaner visual hierarchy, bigger templates, and a calmer customer flow.</div>
        </div>
      </div>
      <PremiumDesigner />
    </div>
  );
}
