export default function HomePage() {
  const products = [
    {
      badge: "Best Seller",
      name: "Business Cards",
      size: "3.5 x 2 in",
      desc: "Perfect for networking, storefronts, and service businesses.",
      accent: "#eef2ff",
      art: "cards",
    },
    {
      badge: "Promo Ready",
      name: "Flyers",
      size: "8.5 x 11 in",
      desc: "Great for events, menus, promotions, and handouts.",
      accent: "#eaf2ff",
      art: "flyer",
    },
    {
      badge: "Large Format",
      name: "Banners",
      size: "6 x 3 ft",
      desc: "Ideal for storefronts, events, and temporary signage.",
      accent: "#dbeafe",
      art: "banner",
    },
    {
      badge: "Direct Mail",
      name: "Postcards",
      size: "6 x 4 in",
      desc: "Built for local marketing, promotions, and announcements.",
      accent: "#fef3c7",
      art: "postcard",
    },
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#eef2f7",
      color: "#0f172a",
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    navWrap: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(255,255,255,0.95)",
      borderBottom: "1px solid #dbe1ea",
      backdropFilter: "blur(8px)",
    },
    container: {
      maxWidth: "1360px",
      margin: "0 auto",
      paddingLeft: "24px",
      paddingRight: "24px",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 0",
      gap: "20px",
      flexWrap: "wrap",
    },
    brand: {
      fontSize: "20px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "22px",
      flexWrap: "wrap",
      fontWeight: 600,
      color: "#334155",
    },
    navButton: {
      background: "linear-gradient(90deg, #2563eb, #7c3aed)",
      color: "#fff",
      border: "none",
      borderRadius: "999px",
      padding: "12px 18px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
    },
    heroSection: {
      padding: "26px 0 12px",
    },
    hero: {
      borderRadius: "34px",
      overflow: "hidden",
      background: "linear-gradient(90deg, #0b1328 0%, #172033 42%, #2563eb 100%)",
      boxShadow: "0 28px 50px rgba(15,23,42,0.15)",
      padding: "36px",
    },
    heroGrid: {
      display: "grid",
      gridTemplateColumns: "1.25fr 1fr",
      gap: "26px",
      alignItems: "center",
    },
    pill: {
      display: "inline-block",
      width: "fit-content",
      padding: "8px 14px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.18)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "14px",
    },
    heroTitle: {
      marginTop: "22px",
      marginBottom: "18px",
      color: "#fff",
      fontSize: "72px",
      lineHeight: 0.95,
      letterSpacing: "-0.05em",
      fontWeight: 900,
    },
    heroSubWrap: {
      textAlign: "center",
      marginTop: "14px",
      marginBottom: "18px",
    },
    heroSub1: {
      color: "#fff",
      fontSize: "30px",
      fontWeight: 800,
      margin: 0,
    },
    heroSub2: {
      color: "#fff",
      fontSize: "30px",
      fontWeight: 800,
      margin: "10px 0 0 0",
    },
    heroActions: {
      display: "flex",
      gap: "14px",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: "22px",
    },
    primaryBtn: {
      background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
      color: "#fff",
      border: "none",
      borderRadius: "999px",
      padding: "15px 24px",
      fontSize: "17px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 14px 28px rgba(59,130,246,0.22)",
    },
    secondaryBtn: {
      background: "rgba(255,255,255,0.08)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "999px",
      padding: "15px 24px",
      fontSize: "17px",
      fontWeight: 700,
      cursor: "pointer",
    },
    productPills: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: "22px",
    },
    smallPills: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: "18px",
    },
    rightCol: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    rightTopCard: {
      background: "#fff",
      borderRadius: "30px",
      padding: "24px",
      boxShadow: "0 20px 36px rgba(15,23,42,0.15)",
    },
    infoCard: {
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: "26px",
      padding: "20px",
      color: "#fff",
      backdropFilter: "blur(8px)",
    },
    productsWrap: {
      marginTop: "30px",
      background: "#fff",
      border: "1px solid #dbe1ea",
      borderRadius: "34px",
      padding: "28px",
      boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
    },
    sectionTitle: {
      fontSize: "52px",
      fontWeight: 900,
      letterSpacing: "-0.04em",
      margin: "18px 0 8px 0",
    },
    sectionSub: {
      fontSize: "18px",
      color: "#64748b",
      margin: 0,
    },
    productGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "20px",
      marginTop: "28px",
    },
    productCard: {
      border: "1px solid #e2e8f0",
      borderRadius: "28px",
      padding: "18px",
      background: "#fff",
      boxShadow: "0 6px 14px rgba(15,23,42,0.05)",
    },
    artBox: {
      height: "180px",
      borderRadius: "22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      overflow: "hidden",
    },
    badgeRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "16px",
      gap: "10px",
    },
    badge: {
      display: "inline-block",
      background: "#eef2ff",
      color: "#3730a3",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "14px",
      fontWeight: 800,
    },
    size: {
      color: "#64748b",
      fontSize: "16px",
    },
    productTitle: {
      marginTop: "18px",
      marginBottom: "10px",
      fontSize: "18px",
      fontWeight: 900,
    },
    productDesc: {
      margin: 0,
      color: "#64748b",
      fontSize: "16px",
      lineHeight: 1.4,
      minHeight: "68px",
    },
    productButtons: {
      display: "flex",
      gap: "10px",
      marginTop: "18px",
      flexWrap: "wrap",
    },
    orderBtn: {
      background: "linear-gradient(90deg, #2563eb, #7c3aed)",
      color: "#fff",
      border: "none",
      borderRadius: "999px",
      padding: "12px 18px",
      fontWeight: 800,
      cursor: "pointer",
    },
    detailBtn: {
      background: "#fff",
      color: "#334155",
      border: "1px solid #dbe1ea",
      borderRadius: "999px",
      padding: "12px 18px",
      fontWeight: 800,
      cursor: "pointer",
    },
  };

  const Art = ({ type, bg }) => {
    const base = {
      ...styles.artBox,
      background: bg,
      position: "relative",
    };

    if (type === "cards") {
      return (
        <div style={base}>
          <div
            style={{
              position: "absolute",
              width: "58px",
              height: "58px",
              background: "#fff",
              borderRadius: "10px",
              transform: "rotate(-8deg)",
              left: "38%",
              top: "33%",
              boxShadow: "0 14px 28px rgba(15,23,42,0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "92px",
              height: "56px",
              background: "#fff",
              borderRadius: "10px",
              transform: "rotate(8deg)",
              left: "50%",
              top: "30%",
              boxShadow: "0 14px 28px rgba(15,23,42,0.12)",
            }}
          />
        </div>
      );
    }

    if (type === "flyer") {
      return (
        <div style={base}>
          <div
            style={{
              width: "90px",
              height: "118px",
              background: "#fff",
              borderRadius: "12px",
              transform: "rotate(-5deg)",
              boxShadow: "0 14px 28px rgba(15,23,42,0.12)",
            }}
          />
        </div>
      );
    }

    if (type === "banner") {
      return (
        <div style={base}>
          <div
            style={{
              width: "150px",
              height: "54px",
              background: "linear-gradient(90deg, #0f172a, #2563eb)",
              borderRadius: "14px",
              boxShadow: "0 14px 28px rgba(15,23,42,0.16)",
            }}
          />
        </div>
      );
    }

    return (
      <div style={base}>
        <div
          style={{
            width: "104px",
            height: "72px",
            background: "#fff",
            borderRadius: "14px",
            transform: "rotate(-6deg)",
            boxShadow: "0 14px 28px rgba(15,23,42,0.12)",
          }}
        />
      </div>
    );
  };

  return (
    <main style={styles.page}>
      <header style={styles.navWrap}>
        <div style={styles.container}>
          <div style={styles.nav}>
            <div style={styles.brand}>PrintLuxe V35</div>

            <div style={styles.navLinks}>
              <span>Home</span>
              <span>Products</span>
              <span>Upload Artwork</span>
              <span>Dashboard</span>
              <button style={styles.navButton}>Upload Artwork</button>
            </div>
          </div>
        </div>
      </header>

      <section style={styles.heroSection}>
        <div style={styles.container}>
          <div style={styles.hero}>
            <div style={styles.heroGrid}>
              <div>
                <div style={styles.pill}>Premium Print • Upload Ready Files</div>

                <h1 style={styles.heroTitle}>
                  Top Quality Printing with the Best Prices
                </h1>

                <div style={styles.heroSubWrap}>
                  <p style={styles.heroSub1}>Top Quality Printing with the Best Prices</p>
                  <p style={styles.heroSub2}>Fast Turnaround</p>
                </div>

                <div style={styles.productPills}>
                  <span style={styles.pill}>Postcards</span>
                  <span style={styles.pill}>Flyers</span>
                  <span style={styles.pill}>Business Cards</span>
                  <span style={styles.pill}>Banners</span>
                </div>

                <div style={styles.heroActions}>
                  <button style={styles.primaryBtn}>Upload Artwork</button>
                  <button style={styles.secondaryBtn}>Browse Products</button>
                </div>

                <div style={styles.smallPills}>
                  <span style={styles.pill}>Top Quality Printing</span>
                  <span style={styles.pill}>Best Prices</span>
                  <span style={styles.pill}>Fast Turnaround</span>
                </div>
              </div>

              <div style={styles.rightCol}>
                <div style={styles.rightTopCard}>
                  <div
                    style={{
                      ...styles.badge,
                      display: "inline-block",
                    }}
                  >
                    Postcards • Flyers • Business Cards • Banners
                  </div>

                  <div
                    style={{
                      marginTop: "14px",
                      fontSize: "18px",
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    Print-ready orders made simple
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      color: "#64748b",
                      fontSize: "16px",
                    }}
                  >
                    Upload finished artwork and place your order quickly.
                  </div>

                  <div
                    style={{
                      marginTop: "16px",
                      fontSize: "42px",
                      fontWeight: 900,
                      color: "#020617",
                    }}
                  >
                    Best Prices
                  </div>
                </div>

                <div style={styles.infoCard}>
                  <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.88)" }}>
                    Fast Turnaround
                  </div>
                  <div style={{ fontSize: "48px", fontWeight: 900, lineHeight: 1 }}>
                    2–4 Days
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="products" style={styles.productsWrap}>
            <div style={styles.badge}>Featured Products</div>

            <h2 style={styles.sectionTitle}>Popular print products</h2>
            <p style={styles.sectionSub}>
              Choose your product and upload your artwork.
            </p>

            <div style={styles.productGrid}>
              {products.map((product) => (
                <div key={product.name} style={styles.productCard}>
                  <Art type={product.art} bg={`linear-gradient(135deg, #f8fafc, ${product.accent})`} />

                  <div style={styles.badgeRow}>
                    <div style={styles.badge}>{product.badge}</div>
                    <div style={styles.size}>{product.size}</div>
                  </div>

                  <div style={styles.productTitle}>{product.name}</div>
                  <p style={styles.productDesc}>{product.desc}</p>

                  <div style={styles.productButtons}>
                    <button style={styles.orderBtn}>Start Order</button>
                    <button style={styles.detailBtn}>Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}