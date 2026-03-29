function shapeRadius(shape){ if(shape==="banner") return "18px"; if(shape==="flyer") return "18px"; if(shape==="postcard") return "18px"; return "14px"; }
function shapeAspect(shape){ if(shape==="banner") return "16 / 7"; if(shape==="flyer") return "8.5 / 11"; if(shape==="postcard") return "6 / 4"; return "3.5 / 2"; }

function ImageBlock({ styleType, accent }) {
  if (styleType === "none") return null;
  const bg = styleType === "photo"
    ? `linear-gradient(135deg, ${accent}, rgba(255,255,255,.92))`
    : `radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), ${accent})`;
  return <div style={{height:"34%",borderRadius:14,background:bg,border:"1px solid rgba(255,255,255,.25)"}} />;
}

export default function TemplatePreview({ template, brandName="Envision Direct", headline, subheadline, cta, contact="555-123-4567 • info@envisiondirect.net", accent, bg, logoText="ED" }) {
  const finalAccent = accent || template.accent;
  const finalBg = bg || template.bg;
  const finalHeadline = headline || template.headline;
  const finalSub = subheadline || template.subheadline;
  const finalCta = cta || template.cta;
  const dark = template.title === "Luxury Black" || template.title === "Luxury Gold";
  return (
    <div className="preview-canvas" style={{aspectRatio:shapeAspect(template.previewShape),background:finalBg,borderRadius:shapeRadius(template.previewShape),padding:18,display:"grid",gridTemplateRows:"auto 1fr auto",gap:14,color:dark?"#ffffff":"#0f172a"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:46,height:46,borderRadius:12,background:finalAccent,color:"#fff",display:"grid",placeItems:"center",fontWeight:800,letterSpacing:".04em"}}>{logoText}</div>
          <div>
            <div style={{fontWeight:800,fontSize:18}}>{brandName}</div>
            <div style={{fontSize:12,opacity:.7}}>{template.category} template</div>
          </div>
        </div>
        <div style={{background:finalAccent,color:"#fff",padding:"8px 12px",borderRadius:999,fontSize:12,fontWeight:700}}>{finalCta}</div>
      </div>
      <div style={{display:"grid",gap:14,alignContent:"start"}}>
        <ImageBlock styleType={template.imageStyle} accent={finalAccent} />
        <div style={{fontSize:template.previewShape==="banner"?34:28,lineHeight:1.02,fontWeight:800}}>{finalHeadline}</div>
        <div style={{fontSize:15,lineHeight:1.4,maxWidth:"88%",opacity:.8}}>{finalSub}</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,borderTop:"1px solid rgba(15,23,42,.08)",paddingTop:12,fontSize:13,opacity:.8}}>
        <div>{contact}</div>
        <div style={{fontWeight:700,color:finalAccent}}>{brandName}</div>
      </div>
    </div>
  );
}
