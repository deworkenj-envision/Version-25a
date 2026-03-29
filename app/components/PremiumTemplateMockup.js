function aspectFor(product){ if(product==="banners") return "16 / 7"; if(product==="flyers") return "8.5 / 11"; if(product==="postcards") return "6 / 4"; return "3.5 / 2"; }
function widthFor(product){ if(product==="banners") return "min(100%, 680px)"; if(product==="flyers") return "min(100%, 430px)"; if(product==="postcards") return "min(100%, 560px)"; return "min(100%, 520px)"; }
function PhotoBlock({ mood, accent }){ if (mood === "clean" || mood === "dark") return null; const bg = mood === "photo" ? `linear-gradient(135deg, ${accent}, rgba(255,255,255,.9))` : `radial-gradient(circle at 25% 25%, rgba(255,255,255,.95), ${accent})`; return <div style={{height:"34%",borderRadius:18,background:bg,border:"1px solid rgba(255,255,255,.25)"}} />; }
export default function PremiumTemplateMockup({ template, brandName="Envision Direct", headline, subheadline="Premium print that looks ready to sell.", cta, contact="555-123-4567 • envisiondirect.net", logoText="ED", accent, bg }) {
  const finalAccent = accent || template.accent;
  const finalBg = bg || template.bg;
  const finalHeadline = headline || template.headline;
  const finalCta = cta || template.cta;
  const dark = template.mood === "dark";
  return (
    <div className="mockup-frame">
      <div style={{width:widthFor(template.product),aspectRatio:aspectFor(template.product),borderRadius:28,background:finalBg,padding:22,border:"1px solid rgba(15,23,42,.08)",boxShadow:"0 30px 70px rgba(15,23,42,.12)",display:"grid",gridTemplateRows:"auto 1fr auto",gap:18,color:dark?"#ffffff":"#0f172a",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:"auto -10% -22% auto",width:"58%",height:"58%",background:`radial-gradient(circle, ${finalAccent}22, transparent 65%)`}} />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:54,height:54,borderRadius:18,background:finalAccent,color:"#fff",display:"grid",placeItems:"center",fontWeight:900,boxShadow:"0 8px 24px rgba(15,23,42,.12)"}}>{logoText}</div>
            <div><div style={{fontSize:20,fontWeight:900}}>{brandName}</div><div style={{fontSize:12,opacity:.72}}>{template.category} template</div></div>
          </div>
          <div style={{padding:"10px 14px",borderRadius:999,background:finalAccent,color:"#fff",fontWeight:800,fontSize:12}}>{finalCta}</div>
        </div>
        <div style={{display:"grid",gap:16,alignContent:"start",position:"relative"}}>
          <PhotoBlock mood={template.mood} accent={finalAccent} />
          <div style={{fontWeight:900,lineHeight:1.02,fontSize: template.product === "banners" ? 40 : template.product === "flyers" ? 34 : 30}}>{finalHeadline}</div>
          <div style={{fontSize:16,opacity:.8,maxWidth:"85%",lineHeight:1.45}}>{subheadline}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,borderTop:"1px solid rgba(15,23,42,.08)",paddingTop:14,position:"relative"}}>
          <div style={{fontSize:13,opacity:.82}}>{contact}</div>
          <div style={{fontSize:13,fontWeight:800,color:finalAccent}}>Print-ready preview</div>
        </div>
      </div>
    </div>
  );
}
