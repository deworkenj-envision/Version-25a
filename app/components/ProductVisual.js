export default function ProductVisual({ type }) {
  if (type === "cards") return <div className="mockup-scene"><div className="mockup-card1" /><div className="mockup-card2" /></div>;
  if (type === "flyer") return <div className="mockup-scene"><div className="mockup-flyer" /></div>;
  if (type === "banner") return <div className="mockup-scene"><div className="mockup-banner" /></div>;
  return <div className="mockup-scene"><div className="mockup-postcard" /></div>;
}
