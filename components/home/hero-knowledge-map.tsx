const nodes = [
  { name: "阴阳", x: 114, y: 104, tone: "concept" },
  { name: "五行", x: 392, y: 106, tone: "concept" },
  { name: "天干地支", x: 420, y: 280, tone: "concept" },
  { name: "八字", x: 305, y: 408, tone: "technique" },
  { name: "奇门", x: 486, y: 430, tone: "technique" },
  { name: "老子", x: 74, y: 360, tone: "book" },
] as const;

export function HeroKnowledgeMap() {
  return (
    <figure className="relative mx-auto w-full max-w-[36rem]" aria-labelledby="hero-map-title">
      <svg
        className="h-auto w-full"
        viewBox="0 0 560 560"
        role="img"
        aria-labelledby="hero-map-title hero-map-description"
      >
        <title id="hero-map-title">玄象知识关系坐标</title>
        <desc id="hero-map-description">
          周易位于关系图中心，与阴阳、五行、天干地支、八字、奇门和老子等知识对象相连。
        </desc>

        <defs>
          <pattern id="hero-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeOpacity=".08" />
          </pattern>
          <marker id="hero-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity=".48" />
          </marker>
        </defs>

        <rect x="16" y="16" width="528" height="528" fill="var(--card)" stroke="currentColor" strokeOpacity=".18" />
        <rect x="16" y="16" width="528" height="528" fill="url(#hero-grid)" />
        <path d="M45 56h118M45 56v26M515 504H397M515 504v-26" stroke="var(--accent)" strokeWidth="1.5" opacity=".7" />

        <g fill="none" stroke="currentColor" strokeOpacity=".42" markerEnd="url(#hero-arrow)">
          <path d="M264 252 C220 206 168 157 122 116" />
          <path d="M301 249 C329 201 356 154 385 119" />
          <path d="M318 278 C355 280 382 280 410 280" />
          <path d="M297 310 C303 344 304 370 305 395" />
          <path d="M320 300 C381 333 432 372 475 416" />
          <path d="M245 296 C180 316 128 336 84 354" />
          <path d="M120 116 C221 86 306 88 384 108" strokeDasharray="4 7" />
        </g>

        <g>
          <rect x="240" y="236" width="96" height="80" fill="var(--ink)" />
          <text x="288" y="273" textAnchor="middle" fill="var(--ink-foreground)" fontFamily="var(--font-serif)" fontSize="25">周易</text>
          <text x="288" y="296" textAnchor="middle" fill="var(--ink-muted)" fontSize="10" letterSpacing="2">BOOK · 001</text>
        </g>

        {nodes.map((node) => {
          const wide = node.name.length > 2;
          const width = wide ? 94 : 72;
          const fill = node.tone === "technique" ? "var(--primary)" : "var(--background)";
          const textFill = node.tone === "technique" ? "var(--primary-foreground)" : "var(--foreground)";

          return (
            <g key={node.name} transform={`translate(${node.x - width / 2} ${node.y - 22})`}>
              <rect width={width} height="44" fill={fill} stroke="currentColor" strokeOpacity=".45" />
              <text x={width / 2} y="27" textAnchor="middle" fill={textFill} fontFamily="var(--font-serif)" fontSize="15">
                {node.name}
              </text>
            </g>
          );
        })}

        <g fill="var(--muted-foreground)" fontSize="9" letterSpacing="1.4">
          <text x="34" y="38">KNOWLEDGE FIELD / 玄象</text>
          <text x="458" y="529">X 028</text>
          <text x="30" y="529">Y 064</text>
        </g>
      </svg>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>关系坐标 · 静态示意</span>
        <span className="tabular">7 nodes / 7 relations</span>
      </figcaption>
    </figure>
  );
}
