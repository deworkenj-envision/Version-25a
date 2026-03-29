export const products = [
  { slug: "business-cards", name: "Business Cards", size: "3.5 x 2 in", badge: "Best Seller" },
  { slug: "flyers", name: "Flyers", size: "8.5 x 11 in", badge: "Promo Ready" },
  { slug: "banners", name: "Banners", size: "6 x 3 ft", badge: "Large Format" },
  { slug: "postcards", name: "Postcards", size: "6 x 4 in", badge: "Direct Mail" },
];

export const industries = [
  "All",
  "Real Estate",
  "Beauty",
  "Construction",
  "Restaurant",
  "Corporate",
  "Church",
];

export const templates = [
  { id:"bc-re-1", product:"business-cards", industry:"Real Estate", title:"Modern Realtor", accent:"#0891b2", bg:"#ecfeff", mood:"photo", headline:"List. Show. Close.", sub:"A clean, high-trust real estate card.", cta:"Call Today" },
  { id:"bc-re-2", product:"business-cards", industry:"Real Estate", title:"Luxury Property", accent:"#0f766e", bg:"#ecfdf5", mood:"dark", headline:"Luxury service with local expertise.", sub:"A premium card for top agents.", cta:"Book a Tour" },
  { id:"bc-be-1", product:"business-cards", industry:"Beauty", title:"Soft Blush Salon", accent:"#db2777", bg:"#fdf2f8", mood:"soft", headline:"Beauty that feels premium.", sub:"Elegant, feminine salon branding.", cta:"Book Now" },
  { id:"bc-co-1", product:"business-cards", industry:"Construction", title:"Trade Pro", accent:"#ea580c", bg:"#fff7ed", mood:"clean", headline:"Built to last.", sub:"Strong, bold card for service trades.", cta:"Free Estimate" },
  { id:"bc-rs-1", product:"business-cards", industry:"Restaurant", title:"Chef Signature", accent:"#dc2626", bg:"#fff1f2", mood:"photo", headline:"A brand guests remember.", sub:"Restaurant card with modern warmth.", cta:"Visit Tonight" },
  { id:"bc-cp-1", product:"business-cards", industry:"Corporate", title:"Executive Grid", accent:"#2563eb", bg:"#eff6ff", mood:"clean", headline:"Professional, sharp, trusted.", sub:"Corporate card with premium spacing.", cta:"Let's Talk" },

  { id:"fl-re-1", product:"flyers", industry:"Real Estate", title:"Open House Flyer", accent:"#0284c7", bg:"#f0f9ff", mood:"photo", headline:"Open House This Weekend", sub:"Drive traffic with a cleaner flyer.", cta:"Tour Today" },
  { id:"fl-be-1", product:"flyers", industry:"Beauty", title:"Spa Promotion", accent:"#e11d48", bg:"#fff1f2", mood:"soft", headline:"Refresh your look", sub:"Beauty promo with upscale feel.", cta:"Claim Offer" },
  { id:"fl-co-1", product:"flyers", industry:"Construction", title:"Contractor Offer", accent:"#d97706", bg:"#fffbeb", mood:"clean", headline:"Licensed. Bonded. Insured.", sub:"Service flyer built for conversion.", cta:"Get a Quote" },
  { id:"fl-rs-1", product:"flyers", industry:"Restaurant", title:"Grand Opening", accent:"#dc2626", bg:"#fef2f2", mood:"photo", headline:"Grand Opening Special", sub:"A loud but premium food promo.", cta:"Order Today" },
  { id:"fl-cp-1", product:"flyers", industry:"Corporate", title:"Service Launch", accent:"#1d4ed8", bg:"#eff6ff", mood:"clean", headline:"Professional services that scale.", sub:"Corporate flyer with strong hierarchy.", cta:"Learn More" },
  { id:"fl-ch-1", product:"flyers", industry:"Church", title:"Sunday Welcome", accent:"#4338ca", bg:"#eef2ff", mood:"soft", headline:"Join us this Sunday", sub:"Warm church flyer for outreach.", cta:"All Are Welcome" },

  { id:"bn-re-1", product:"banners", industry:"Real Estate", title:"Open House Banner", accent:"#059669", bg:"#ecfdf5", mood:"photo", headline:"Open House Today", sub:"High-visibility signage for listings.", cta:"Tour This Home" },
  { id:"bn-be-1", product:"banners", industry:"Beauty", title:"Glow Studio Banner", accent:"#be185d", bg:"#fdf2f8", mood:"soft", headline:"Glow starts here", sub:"Clean beauty banner for storefronts.", cta:"Book Today" },
  { id:"bn-co-1", product:"banners", industry:"Construction", title:"Jobsite Bold", accent:"#f59e0b", bg:"#fef3c7", mood:"clean", headline:"Safety. Quality. Speed.", sub:"Trade banner with bold utility.", cta:"Call Now" },
  { id:"bn-rs-1", product:"banners", industry:"Restaurant", title:"Street Promo", accent:"#dc2626", bg:"#fff1f2", mood:"photo", headline:"Grand Opening", sub:"Street-facing restaurant banner.", cta:"Dine With Us" },

  { id:"pc-re-1", product:"postcards", industry:"Real Estate", title:"Just Listed Mailer", accent:"#0284c7", bg:"#f0f9ff", mood:"photo", headline:"Just listed in your neighborhood", sub:"High-trust property mailer.", cta:"See Listing" },
  { id:"pc-be-1", product:"postcards", industry:"Beauty", title:"Seasonal Beauty Offer", accent:"#e11d48", bg:"#fff1f2", mood:"soft", headline:"Spring glow special", sub:"Beauty promo designed to convert.", cta:"Book Now" },
  { id:"pc-rs-1", product:"postcards", industry:"Restaurant", title:"Coupon Mailer", accent:"#ea580c", bg:"#fff7ed", mood:"photo", headline:"Bring this in for 20% off", sub:"Restaurant coupon postcard.", cta:"Redeem Today" },
  { id:"pc-cp-1", product:"postcards", industry:"Corporate", title:"Announcement Card", accent:"#2563eb", bg:"#eff6ff", mood:"clean", headline:"New location. Same trusted team.", sub:"Corporate postcard announcement.", cta:"Visit Us" },
];

export const methods = [
  { id:"template", title:"Use a Template", description:"Choose a ready-made premium layout and personalize the content." },
  { id:"upload", title:"Upload My Own Design", description:"Upload finished artwork if you already have a print-ready file." },
];
