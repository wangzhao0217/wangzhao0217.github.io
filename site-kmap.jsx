/* site-kmap.jsx — Interactive Research Knowledge Map (Open Knowledge Maps style) */
const KMAP_NS = window.ZhaoWangResearchDesignSystem_65eff9;

function KnowledgeMapSection() {
  const S = window.SITE;
  const lang = window.useLang();
  const t = (v) => window.tx(v, lang);

  // ─── State Management ────────────────────────────────────────────────────────
  const [selectedCluster, setSelectedCluster] = React.useState(null); // cluster id
  const [selectedPaper, setSelectedPaper] = React.useState(null);     // paper obj or doi
  const [searchQuery, setSearchQuery] = React.useState("");
  const [domainFilter, setDomainFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("year-desc");
  const [rsIndex, setRsIndex] = React.useState({});
  const [activeNote, setActiveNote] = React.useState(null);           // { title, content } for notes modal
  const [activeCite, setActiveCite] = React.useState(null);           // paper obj for BibTeX modal
  const [copiedBib, setCopiedBib] = React.useState(false);

  // Load ResearchStudio index
  React.useEffect(() => {
    fetch("assets/paper_content/researchstudio_index.json")
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        data.forEach((entry) => {
          if (entry.doi) map[entry.doi] = entry;
        });
        setRsIndex(map);
      })
      .catch(() => {});
  }, []);

  // ─── Clusters Definition ───────────────────────────────────────────────────
  const clusters = [
    {
      id: "c1",
      name: { en: "Transport Network Science & Active Travel", zh: "交通网络科学与主动出行" },
      shortName: { en: "Transport Science", zh: "交通网络" },
      keywords: ["Cycling infrastructure", "Corenet framework", "Network planning", "stplanr", "Route simplification"],
      color: "#10B981",
      bgSoft: "rgba(16, 185, 129, 0.12)",
      cx: 260, cy: 190, r: 110,
      paperDois: [
        "10.1016/j.jtrangeo.2025.104549", // Corenet
        "10.1177/23998083251387986",     // Network simplification
        "10.5281/zenodo.11077553",       // GISRUK 2024
      ],
    },
    {
      id: "c2",
      name: { en: "Unpaved Road Infrastructure & Remote Sensing ML", zh: "未铺装路网与遥感机器学习" },
      shortName: { en: "Remote Sensing ML", zh: "遥感 ML" },
      keywords: ["Satellite imagery", "Multimodal ML", "Africa road assessment", "LLaVA", "ITS Asia-Pacific Best Paper"],
      color: "#D97706",
      bgSoft: "rgba(217, 119, 6, 0.12)",
      cx: 160, cy: 370, r: 105,
      paperDois: [
        "10.1016/j.jtrangeo.2025.104525", // Africa unpaved
        "10.3390/rs15163985",             // RS prediction
        "ITS-AP-2022-BEST",              // ITS Asia-Pacific
      ],
    },
    {
      id: "c3",
      name: { en: "Electric Vehicles & Smart Energy Systems", zh: "电动汽车与智慧能源系统" },
      shortName: { en: "EV & Smart Mobility", zh: "电动汽车与能源" },
      keywords: ["V2X online discussions", "EV refueling demand", "V2G bi-directional solar", "Smart mobility"],
      color: "#0284C7",
      bgSoft: "rgba(2, 132, 199, 0.12)",
      cx: 440, cy: 155, r: 98,
      paperDois: [
        "10.1016/j.apenergy.2026.128746", // Two-seater electric microcars
        "10.1016/j.apenergy.2026.128478", // Bi-directional charging
        "10.1109/TITS.2026.3652333",       // EV refueling review
        "10.1016/j.tbs.2026.101362",              // V2X discussions
      ],
    },
    {
      id: "c4",
      name: { en: "Seismic Hazards & Geotechnical Engineering", zh: "地震灾害与岩土工程" },
      shortName: { en: "Seismic & Tunnels", zh: "地震与岩土" },
      keywords: ["Shaking table tests", "Near-fault ground motions", "Fault container design", "Tunnel buffer layers", "HSR tunnel resilience"],
      color: "#6366F1",
      bgSoft: "rgba(99, 102, 241, 0.12)",
      cx: 480, cy: 360, r: 125,
      paperDois: [
        "10.1016/j.enggeo.2026.109017", // Seasonally frozen slopes
        "10.1016/j.tust.2026.107874", // Tunnel buffer layers
        "10.1016/j.jrmge.2025.03.001", // Fault container
        "10.1007/s00603-024-04346-y", // Anti-dip slope
        "10.1007/s00603-025-04798-w", // Near-fault rock slope
        "10.1016/j.enggeo.2025.108216", // Benched slope
        "10.1016/j.undsp.2025.04.011",  // HSR tunnel ML
        "10.1016/j.jrmge.2024.03.031", // Stepped slope shatter
        "10.1016/j.enggeo.2024.107707", // Dip vs anti-dip
        "10.1016/j.soildyn.2022.107440",// Composite tunnel lining
      ],
    },
    {
      id: "c5",
      name: { en: "Sustainable Concrete Materials & Structural Mechanics", zh: "可持续混凝土材料与结构力学" },
      shortName: { en: "Structural Materials", zh: "结构材料" },
      keywords: ["FRP confinement", "Rubberised concrete", "Recycled steel fibres", "Inverse tensile model", "Phase-field crack"],
      color: "#EC4899",
      bgSoft: "rgba(236, 72, 153, 0.12)",
      cx: 320, cy: 490, r: 112,
      paperDois: [
        "10.1016/j.conbuildmat.2024.134890", // SFRC fibre length
        "10.1016/j.ijsolstr.2023.112496",     // Phase-field crack
        "10.1016/j.conbuildmat.2020.121023", // FRP rubberised
        "10.1016/j.conbuildmat.2019.117591", // Tensile stress-strain
        "10.1061/(ASCE)CC.1943-5614.0000962",// Shear model
        "10.1002/suco.201800100",            // Post-cracking SFRC
        "CONF-2017-ZADAR",                  // Shear Zadar 2017
        "CONF-2017-ACIC",                   // Coupling beams ACIC 2017
      ],
    },
  ];

  // Helper: map paper to cluster
  const getPaperCluster = (p) => {
    const doi = p.doi || (p.best ? "ITS-AP-2022-BEST" : (p.venue?.includes("Zadar") ? "CONF-2017-ZADAR" : "CONF-2017-ACIC"));
    return clusters.find((c) => c.paperDois.includes(doi)) || clusters[0];
  };

  // ─── Filter & Search Papers ────────────────────────────────────────────────
  const allPapers = React.useMemo(() => {
    return S.publications.map((p, idx) => {
      const doiKey = p.doi || (p.best ? "ITS-AP-2022-BEST" : (p.venue?.includes("Zadar") ? "CONF-2017-ZADAR" : "CONF-2017-ACIC"));
      const cluster = getPaperCluster(p);
      const rsEntry = p.doi ? rsIndex[p.doi] : null;
      return {
        ...p,
        id: `paper-${idx}`,
        doiKey,
        cluster,
        rsEntry,
      };
    });
  }, [S.publications, rsIndex]);

  const filteredPapers = React.useMemo(() => {
    return allPapers.filter((p) => {
      // Cluster filter
      if (selectedCluster && p.cluster.id !== selectedCluster) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchAuthors = p.authors.toLowerCase().includes(q);
        const matchVenue = p.venue.toLowerCase().includes(q);
        const matchYear = p.year.includes(q);
        const matchKw = p.cluster.keywords.some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchAuthors && !matchVenue && !matchYear && !matchKw) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "year-desc") return parseInt(b.year) - parseInt(a.year);
      if (sortBy === "year-asc") return parseInt(a.year) - parseInt(b.year);
      return 0;
    });
  }, [allPapers, selectedCluster, searchQuery, sortBy]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const openNoteHandler = (paper) => {
    if (!paper.rsEntry) return;
    const blogFile = lang === "zh" ? paper.rsEntry.blog_zh : paper.rsEntry.blog_en;
    fetch(blogFile)
      .then((r) => r.text())
      .then((text) => {
        setActiveNote({ title: paper.title, content: text, paper });
      })
      .catch(() => {
        setActiveNote({ title: paper.title, content: "# " + paper.title + "\n\nLoading research notes failed.", paper });
      });
  };

  const generateBibtex = (p) => {
    const firstAuthor = p.authors.split(",")[0].trim().toLowerCase();
    const citeKey = `${firstAuthor}${p.year}${p.title.split(" ")[0].toLowerCase()}`;
    return `@article{${citeKey},\n  author    = {${p.authors}},\n  title     = {${p.title}},\n  journal   = {${p.venue}},\n  year      = {${p.year}}${p.doi ? `,\n  doi       = {${p.doi}}` : ""}\n}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  return (
    <Section id="knowledge-map" eyebrow={t(S.ui.sections.kmapEyebrow)} title={t(S.ui.sections.kmapTitle)} intro={t(S.ui.sections.kmapIntro)}>
      {/* ── Top Overview Banner / Controls Bar ── */}
      <div style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4) var(--space-5)",
        marginBottom: "1.5rem",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700,
            color: "var(--clay-700)", background: "var(--clay-100)", padding: "0.25rem 0.65rem", borderRadius: "var(--radius-pill)",
          }}>
            {allPapers.length} {lang === "zh" ? "篇研究成果" : "Publications & Tools"}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            5 {lang === "zh" ? "大核心主题" : "Core Knowledge Clusters"} · 2017–2026
          </span>
          {selectedCluster && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "var(--text-xs)", fontFamily: "var(--font-ui)", fontWeight: 600,
              background: clusters.find((c) => c.id === selectedCluster)?.bgSoft,
              color: clusters.find((c) => c.id === selectedCluster)?.color,
              padding: "0.2rem 0.6rem", borderRadius: "var(--radius-pill)", border: `1px solid ${clusters.find((c) => c.id === selectedCluster)?.color}`,
            }}>
              <Icon name="funnel-fill" />
              {t(clusters.find((c) => c.id === selectedCluster)?.shortName)}
              <button onClick={() => setSelectedCluster(null)} style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", padding: 0, marginLeft: "0.2rem" }}>
                <Icon name="x-circle-fill" />
              </button>
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button onClick={() => { setSelectedCluster(null); setSelectedPaper(null); setSearchQuery(""); }} style={{
            fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", fontWeight: 600,
            padding: "0.35rem 0.8rem", borderRadius: "var(--radius-pill)", cursor: "pointer",
            border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-body)",
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
          }}>
            <Icon name="arrow-counterclockwise" /> {lang === "zh" ? "重置视图" : "Reset View"}
          </button>
        </div>
      </div>

      {/* ── Main Split-Screen Knowledge Map ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)", gap: "1.5rem", alignItems: "start",
      }} className="about-grid">
        
        {/* ── LEFT PANEL: Interactive SVG Knowledge Bubble Map ── */}
        <div style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "1.2rem",
          position: "relative",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--divider)",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", fontWeight: 600, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="diagram-3-fill" style={{ color: "var(--clay)" }} />
              {lang === "zh" ? "研究领域主题图谱" : "Interactive Cluster Map"}
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>
              {lang === "zh" ? "点击气泡筛选领域" : "Click bubble to zoom & filter"}
            </span>
          </div>

          {/* SVG Map Container */}
          <div style={{ width: "100%", aspectRatio: "640 / 620", position: "relative" }}>
            <svg viewBox="0 0 640 620" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              <defs>
                <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.15" />
                </filter>
                <filter id="activeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="var(--clay)" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Connecting Lines between clusters */}
              <line x1="260" y1="190" x2="440" y2="155" stroke="var(--divider)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="260" y1="190" x2="160" y2="370" stroke="var(--divider)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="260" y1="190" x2="480" y2="360" stroke="var(--divider)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="160" y1="370" x2="320" y2="490" stroke="var(--divider)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="480" y1="360" x2="320" y2="490" stroke="var(--divider)" strokeWidth="2" strokeDasharray="4 4" />

              {/* Cluster Bubbles */}
              {clusters.map((c) => {
                const isActive = selectedCluster === c.id;
                const count = allPapers.filter((p) => p.cluster.id === c.id).length;
                const isDimmed = selectedCluster && !isActive;

                return (
                  <g
                    key={c.id}
                    onClick={() => setSelectedCluster(isActive ? null : c.id)}
                    style={{
                      cursor: "pointer",
                      transition: "all var(--dur-base) var(--ease-out)",
                      opacity: isDimmed ? 0.35 : 1,
                      transformOrigin: `${c.cx}px ${c.cy}px`,
                      transform: isActive ? "scale(1.06)" : "scale(1)",
                    }}
                  >
                    {/* Outer Circle Background */}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r={c.r}
                      fill={c.bgSoft}
                      stroke={c.color}
                      strokeWidth={isActive ? 3.5 : 1.8}
                      filter={isActive ? "url(#activeGlow)" : "url(#shadowGlow)"}
                      style={{ transition: "all 0.3s ease" }}
                    />

                    {/* Orbiting Paper Dots */}
                    {allPapers.filter((p) => p.cluster.id === c.id).map((paper, i) => {
                      const total = count;
                      const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
                      const orbitR = c.r - 24;
                      const px = c.cx + orbitR * Math.cos(angle);
                      const py = c.cy + orbitR * Math.sin(angle);
                      const isPaperSelected = selectedPaper === paper.id;

                      return (
                        <g key={paper.id} onClick={(e) => { e.stopPropagation(); setSelectedPaper(paper.id); setSelectedCluster(c.id); }}>
                          <circle
                            cx={px}
                            cy={py}
                            r={isPaperSelected ? 9 : 6}
                            fill={isPaperSelected ? "var(--clay)" : c.color}
                            stroke="#fff"
                            strokeWidth="2"
                            style={{ transition: "all 0.2s ease" }}
                          />
                        </g>
                      );
                    })}

                    {/* Cluster Label inside bubble */}
                    <foreignObject x={c.cx - c.r + 14} y={c.cy - 48} width={(c.r - 14) * 2} height="96">
                      <div style={{
                        height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        textAlign: "center", pointerEvents: "none", color: "var(--text-heading)", padding: "0 4px",
                      }}>
                        <div style={{
                          fontFamily: "var(--font-display)", fontSize: c.r > 110 ? "13px" : "11px", fontWeight: 700, lineHeight: 1.25,
                          color: "var(--text-heading)", marginBottom: "3px", textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                        }}>
                          {t(c.name)}
                        </div>
                        <div style={{
                          fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, color: c.color,
                          background: "rgba(255,255,255,0.85)", padding: "1px 6px", borderRadius: "10px", marginTop: "2px",
                        }}>
                          {count} {lang === "zh" ? "篇论文" : "papers"}
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Cluster Legend Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid var(--divider)" }}>
            {clusters.map((c) => {
              const active = selectedCluster === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCluster(active ? null : c.id)}
                  style={{
                    fontFamily: "var(--font-ui)", fontSize: "var(--text-2xs)", fontWeight: 600,
                    padding: "0.25rem 0.65rem", borderRadius: "var(--radius-pill)", cursor: "pointer",
                    border: `1.5px solid ${c.color}`,
                    background: active ? c.color : "transparent",
                    color: active ? "#fff" : "var(--text-heading)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {t(c.shortName)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL: Interactive Search & Filtered Paper List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Search Box & Controls */}
          <div style={{
            background: "var(--surface-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)",
            padding: "var(--space-4)", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: "0.75rem",
          }}>
            {/* Search Input */}
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                placeholder={lang === "zh" ? "在知识图谱中搜索 (标题 / 关键词 / 年份)..." : "Search within visualization (title, keyword, author)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)",
                  padding: "0.55rem 0.8rem 0.55rem 2.2rem", borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--border-strong)", background: "var(--surface-page)",
                  color: "var(--text-heading)", outline: "none", transition: "border-color 0.2s ease",
                }}
              />
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                <Icon name="search" />
              </span>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}>
                  <Icon name="x-circle-fill" />
                </button>
              )}
            </div>

            {/* Sort & Count */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>Showing <strong>{filteredPapers.length}</strong> of {allPapers.length} resources</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <label style={{ color: "var(--text-muted)" }}>{lang === "zh" ? "排序:" : "Sort:"}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", background: "transparent",
                    border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-heading)", padding: "0.15rem 0.4rem",
                  }}
                >
                  <option value="year-desc">{lang === "zh" ? "按年份 (最新)" : "Year (Newest)"}</option>
                  <option value="year-asc">{lang === "zh" ? "按年份 (最早)" : "Year (Oldest)"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Paper List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "680px", overflowY: "auto", paddingRight: "0.2rem" }}>
            {filteredPapers.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", background: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                <Icon name="search" style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "var(--text-subtle)" }} />
                <div>{lang === "zh" ? "没有找到匹配的研究成果" : "No matching research publications found."}</div>
              </div>
            ) : (
              filteredPapers.map((paper) => {
                const isSelected = selectedPaper === paper.id;
                const isJournal = paper.type === "Journal";

                return (
                  <div
                    key={paper.id}
                    onClick={() => setSelectedPaper(paper.id)}
                    style={{
                      background: "var(--surface-card)",
                      border: `1.5px solid ${isSelected ? "var(--clay)" : "var(--border-color)"}`,
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-4) var(--space-5)",
                      boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-xs)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    {/* Header Badges */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", fontWeight: 700,
                        padding: "0.1rem 0.45rem", borderRadius: "var(--radius-pill)",
                        background: paper.best ? "var(--clay-100)" : (isJournal ? "var(--info-soft)" : "#efe6ef"),
                        color: paper.best ? "var(--clay-700)" : (isJournal ? "#3c4a63" : "#5e4860"),
                      }}>
                        {paper.best ? (lang === "zh" ? "最佳论文奖" : "Best Paper") : (isJournal ? "Journal Article" : "Conference Paper")}
                      </span>

                      {/* Authorship Badge */}
                      {(() => {
                        const isPrimary = paper.role === "first" || paper.role === "corr" || paper.role === "first_corr";
                        const roleLabel = paper.role === "first_corr"
                          ? (lang === "zh" ? "第一 & 通讯" : "1st & Corr. Author")
                          : paper.role === "first"
                          ? (lang === "zh" ? "第一作者" : "1st Author")
                          : paper.role === "corr"
                          ? (lang === "zh" ? "通讯作者" : "Corr. Author")
                          : (lang === "zh" ? "合作" : "Co-Author");
                        return (
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", fontWeight: 700,
                            padding: "0.1rem 0.45rem", borderRadius: "var(--radius-pill)",
                            background: isPrimary ? "var(--clay-100)" : "var(--surface-raised)",
                            color: isPrimary ? "var(--clay-700)" : "var(--text-muted)",
                            border: isPrimary ? "1px solid var(--clay)" : "1px solid var(--border-color)",
                          }}>
                            {roleLabel}
                          </span>
                        );
                      })()}

                      {/* Cluster Tag */}
                      <span style={{
                        fontFamily: "var(--font-ui)", fontSize: "var(--text-2xs)", fontWeight: 600,
                        color: paper.cluster.color, background: paper.cluster.bgSoft,
                        padding: "0.1rem 0.45rem", borderRadius: "var(--radius-pill)",
                      }}>
                        Area: {t(paper.cluster.shortName)}
                      </span>

                      {/* Year */}
                      <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--clay-600)", fontWeight: 600 }}>
                        {paper.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 style={{
                      fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600,
                      lineHeight: "var(--leading-snug)", color: "var(--text-heading)", margin: "0 0 0.35rem",
                    }}>
                      {paper.title}
                    </h4>

                    {/* Authors & Venue */}
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                      {(() => {
                        const isPrimary = paper.role === "first" || paper.role === "corr" || paper.role === "first_corr";
                        return paper.authors.split("Wang, Z").map((part, idx, arr) => (
                          <React.Fragment key={idx}>
                            {part}
                            {idx < arr.length - 1 && (
                              <strong style={{
                                color: isPrimary ? "var(--clay-700)" : "var(--text-heading)",
                                fontWeight: 700,
                                background: isPrimary ? "var(--clay-100)" : "transparent",
                                padding: isPrimary ? "0.05rem 0.3rem" : "0",
                                borderRadius: "3px",
                              }}>
                                Wang, Z{isPrimary ? ".*" : ""}
                              </strong>
                            )}
                          </React.Fragment>
                        ));
                      })()}
                    </div>

                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "var(--text-xs)", color: "var(--text-body)", marginBottom: "0.6rem" }}>
                      {paper.venue}
                    </div>

                    {/* Metric Badge if available */}
                    {paper.metric && (
                      <div style={{ marginBottom: "0.6rem" }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", fontWeight: 700,
                          background: "var(--kraft-100)", color: "var(--kraft-800)", padding: "0.15rem 0.5rem", borderRadius: "var(--radius-pill)",
                        }}>
                          ⚡ {t(paper.metric)}
                        </span>
                      </div>
                    )}

                    {/* Action Link Buttons */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", pt: "0.3rem", borderTop: "1px dashed var(--divider)" }}>
                      {paper.doi && (
                        <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{
                          fontSize: "var(--text-2xs)", fontFamily: "var(--font-ui)", fontWeight: 600,
                          padding: "0.2rem 0.5rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)",
                          color: "var(--text-link)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem",
                        }}>
                          <Icon name="link-45deg" /> DOI
                        </a>
                      )}

                      {paper.rsEntry && (
                        <button onClick={(e) => { e.stopPropagation(); openNoteHandler(paper); }} style={{
                          fontSize: "var(--text-2xs)", fontFamily: "var(--font-ui)", fontWeight: 600,
                          padding: "0.2rem 0.55rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--clay)",
                          background: "var(--clay-100)", color: "var(--clay-700)", cursor: "pointer",
                          display: "inline-flex", alignItems: "center", gap: "0.25rem",
                        }}>
                          <Icon name="journal-text" /> {t(S.ui.sections.rsNotesLabel)}
                        </button>
                      )}

                      <button onClick={(e) => { e.stopPropagation(); setActiveCite(paper); }} style={{
                        fontSize: "var(--text-2xs)", fontFamily: "var(--font-ui)", fontWeight: 600,
                        padding: "0.2rem 0.5rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)",
                        background: "transparent", color: "var(--text-body)", cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      }}>
                        <Icon name="quote" /> {lang === "zh" ? "引用" : "Cite as"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL 1: Research Notes Reader ── */}
      {activeNote && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, background: "rgba(15, 21, 33, 0.65)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
        }} onClick={() => setActiveNote(null)}>
          <div style={{
            background: "var(--surface-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)",
            width: "min(1140px, 94vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-xl)",
            overflow: "hidden",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: "1rem 1.4rem", borderBottom: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--surface-raised)",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--text-md)", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon name="journal-text" style={{ color: "var(--clay)" }} />
                {lang === "zh" ? "研究笔记 (ResearchStudio Summary)" : "Research Studio Notes"}
              </div>
              <button onClick={() => setActiveNote(null)} style={{ border: "none", background: "transparent", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icon name="x-lg" />
              </button>
            </div>

            <div style={{ padding: "1.8rem", overflowY: "auto", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", color: "var(--text-body)" }}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-ui)", margin: 0 }}>
                {activeNote.content}
              </pre>
            </div>

            <div style={{ padding: "0.8rem 1.4rem", borderTop: "1px solid var(--divider)", background: "var(--surface-raised)", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setActiveNote(null)} style={{
                fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", fontWeight: 600,
                padding: "0.4rem 1rem", borderRadius: "var(--radius-pill)", border: "none",
                background: "var(--clay)", color: "#fff", cursor: "pointer",
              }}>
                {lang === "zh" ? "关闭" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: BibTeX Citation ── */}
      {activeCite && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, background: "rgba(15, 21, 33, 0.65)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
        }} onClick={() => setActiveCite(null)}>
          <div style={{
            background: "var(--surface-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)",
            width: "min(780px, 90vw)", padding: "1.6rem", boxShadow: "var(--shadow-xl)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--text-md)", color: "var(--text-heading)" }}>
                {lang === "zh" ? "BibTeX 引用格式" : "Cite this Publication"}
              </div>
              <button onClick={() => setActiveCite(null)} style={{ border: "none", background: "transparent", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icon name="x-lg" />
              </button>
            </div>

            <textarea
              readOnly
              rows={8}
              value={generateBibtex(activeCite)}
              style={{
                width: "100%", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", padding: "0.8rem",
                borderRadius: "var(--radius-md)", border: "1px solid var(--border-strong)", background: "var(--surface-page)",
                color: "var(--text-heading)", outline: "none", resize: "none",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                {copiedBib ? (lang === "zh" ? "已复制到剪贴板！" : "Copied to clipboard!") : ""}
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => copyToClipboard(generateBibtex(activeCite))} style={{
                  fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", fontWeight: 600,
                  padding: "0.45rem 1rem", borderRadius: "var(--radius-pill)", border: "none",
                  background: "var(--clay)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem",
                }}>
                  <Icon name="clipboard-check" /> {lang === "zh" ? "复制 BibTeX" : "Copy BibTeX"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
window.KnowledgeMapSection = KnowledgeMapSection;
