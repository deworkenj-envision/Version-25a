import DesignerStudio from '../components/DesignerStudio';

export default function DesignerPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Designer Studio</h1>
        <p className="section-subtitle">This page includes live content and downloadable concept artwork so your preview does not look empty.</p>
        <DesignerStudio />
      </div>
    </main>
  );
}
