import type { KnowHowImage } from '../types';

/**
 * 初期データに添付する解説図（SVG）。写真の代わりに、ノウハウの要点を線画で示す。
 * 画像本体は起動時に imageStore へ投入される（App.tsx の ensureSeedImages）。
 */
export interface SeedImage {
  name: string;
  caption: string;
  svg: string;
}

const FONT = `font-family="'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic UI',Meiryo,sans-serif"`;

const DEFS = `<defs>
<pattern id="sand" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#f1e9da"/><line x1="0" y1="0" x2="0" y2="14" stroke="#cdbb9a" stroke-width="2"/></pattern>
<pattern id="sleeve" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="10" height="10" fill="#fde7c7"/><line x1="0" y1="0" x2="0" y2="10" stroke="#e0a25a" stroke-width="2"/></pattern>
<pattern id="core" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d9c9a9"/><circle cx="4" cy="4" r="1.2" fill="#9c8a66"/></pattern>
<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f2933"/></marker>
<marker id="arRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#b45309"/></marker>
<marker id="arBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1d4ed8"/></marker>
</defs>`;

function svg(title: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" ${FONT} font-size="20" fill="#1f2933">
<rect width="800" height="600" fill="#ffffff"/>${DEFS}
<text x="24" y="40" font-size="26" font-weight="700">${title}</text>
${body}
<text x="776" y="584" font-size="14" fill="#6b7280" text-anchor="end">解説図（模式図・寸法は誇張）</text>
</svg>`;
}

const METAL = 'fill="#e8a45c" stroke="#8a4b1a" stroke-width="3"';
const LINE = 'stroke="#1f2933" stroke-width="3" fill="none"';
const THIN = 'stroke="#1f2933" stroke-width="2" fill="none"';
const DASH = 'stroke="#1f2933" stroke-width="2" stroke-dasharray="10 8" fill="none"';

export const SEED_IMAGES: Record<string, SeedImage> = {
  'seed-img-riser': {
    name: 'riser-directional-solidification.svg',
    caption: '押湯を最後に凝固させ、遠い厚肉部（ボス）には冷やし金を当てて押湯側へ指向性凝固させる',
    svg: svg(
      '押湯と冷やし金による指向性凝固',
      `<rect x="0" y="70" width="800" height="490" fill="url(#sand)"/>
<line x1="0" y1="380" x2="800" y2="380" ${DASH}/>
<text x="20" y="372" font-size="18">上型</text><text x="20" y="404" font-size="18">下型</text>
<rect x="160" y="140" width="170" height="240" fill="url(#sleeve)" stroke="#b45309" stroke-width="3"/>
<rect x="195" y="150" width="100" height="215" ${METAL}/>
<polygon points="205,365 285,365 275,380 215,380" ${METAL}/>
<rect x="120" y="380" width="560" height="120" ${METAL}/>
<rect x="560" y="300" width="120" height="80" ${METAL}/>
<rect x="690" y="290" width="44" height="100" fill="#5b6470" stroke="#1f2933" stroke-width="3"/>
<line x1="640" y1="440" x2="330" y2="440" stroke="#1f2933" stroke-width="4" marker-end="url(#ar)"/>
<text x="485" y="470" text-anchor="middle" font-size="18" font-weight="700">凝固の進行方向</text>
<text x="245" y="120" text-anchor="middle" font-weight="700">押湯</text>
<text x="140" y="245" text-anchor="end" font-size="18">保温</text><text x="140" y="268" text-anchor="end" font-size="18">スリーブ</text>
<line x1="150" y1="255" x2="175" y2="255" ${THIN}/>
<text x="345" y="352" font-size="18">押湯首（ネック）</text>
<line x1="340" y1="356" x2="290" y2="372" ${THIN}/>
<text x="400" y="530" text-anchor="middle" font-size="18">製品（板部）</text>
<text x="620" y="290" text-anchor="middle" font-size="18">厚肉ボス</text>
<text x="712" y="270" text-anchor="middle" font-size="18" font-weight="700">冷やし金</text>
<text x="40" y="548" font-size="17" fill="#374151">押湯モジュラス ≧ 製品 × 1.2、押湯首 ≒ 製品 × 1.1</text>
<text x="40" y="574" font-size="17" fill="#374151">押湯から遠い厚肉部は冷やし金でホットスポットを消す</text>`,
    ),
  },
  'seed-img-gating': {
    name: 'gating-system.svg',
    caption: '湯口系の各部名称。湯道を下型・堰を上型に置き、湯道末端を延長してスラグ溜まりにする',
    svg: svg(
      '湯口系の構成（側面断面）',
      `<rect x="0" y="70" width="800" height="490" fill="url(#sand)"/>
<line x1="0" y1="380" x2="800" y2="380" ${DASH}/>
<text x="740" y="372" font-size="18">上型</text><text x="740" y="404" font-size="18">下型</text>
<polygon points="90,110 210,110 185,160 115,160" ${METAL}/>
<polygon points="136,160 164,160 158,382 142,382" ${METAL}/>
<rect x="118" y="380" width="64" height="60" ${METAL}/>
<rect x="150" y="392" width="540" height="38" ${METAL}/>
<rect x="228" y="386" width="16" height="50" fill="#ffffff" stroke="#1f2933" stroke-width="2"/>
<line x1="232" y1="390" x2="232" y2="432" stroke="#1f2933" stroke-width="1"/><line x1="236" y1="390" x2="236" y2="432" stroke="#1f2933" stroke-width="1"/><line x1="240" y1="390" x2="240" y2="432" stroke="#1f2933" stroke-width="1"/>
<rect x="300" y="352" width="60" height="42" ${METAL}/>
<rect x="470" y="352" width="60" height="42" ${METAL}/>
<rect x="260" y="240" width="320" height="114" ${METAL}/>
<text x="150" y="98" text-anchor="middle" font-size="18" font-weight="700">湯口カップ</text>
<text x="60" y="280" font-size="18">湯口</text><text x="60" y="303" font-size="18">（スプルー）</text>
<line x1="125" y1="290" x2="145" y2="290" ${THIN}/>
<text x="60" y="480" font-size="18">湯だまり</text>
<line x1="120" y1="470" x2="140" y2="445" ${THIN}/>
<text x="330" y="470" font-size="18" font-weight="700">湯道（ランナー）</text>
<text x="330" y="340" text-anchor="middle" font-size="18" font-weight="700">堰</text>
<text x="500" y="340" text-anchor="middle" font-size="18" font-weight="700">堰</text>
<text x="420" y="305" text-anchor="middle" font-size="20" font-weight="700">製品</text>
<text x="236" y="475" text-anchor="middle" font-size="16">フィルター</text>
<text x="640" y="470" text-anchor="middle" font-size="17">湯道延長</text><text x="640" y="492" text-anchor="middle" font-size="17">（スラグ溜まり）</text>
<line x1="640" y1="450" x2="640" y2="432" ${THIN}/>
<text x="40" y="522" font-size="17" fill="#374151">断面比（湯口 : 湯道 : 堰）の目安</text>
<text x="40" y="547" font-size="17" fill="#374151">鋳鉄（加圧）1 : 0.8 : 0.6　／　アルミ・鋳鋼（非加圧）1 : 2 : 4</text>
<text x="40" y="572" font-size="17" fill="#374151">堰の流速はアルミで 0.5 m/s 以下が目安</text>`,
    ),
  },
  'seed-img-draft': {
    name: 'draft-angle.svg',
    caption: '抜け勾配の取り方。外側面は 1〜2°、内側のポケットは 2〜3°、見切り面は極力 1 平面にする',
    svg: svg(
      '模型の抜け勾配と見切り面',
      `<rect x="100" y="200" width="600" height="340" fill="url(#sand)" stroke="#1f2933" stroke-width="3"/>
<polygon points="200,200 600,200 565,480 235,480" ${METAL}/>
<polygon points="360,200 440,200 428,380 372,380" fill="url(#sand)" stroke="#8a4b1a" stroke-width="3"/>
<line x1="200" y1="200" x2="200" y2="480" ${DASH}/>
<line x1="360" y1="200" x2="360" y2="380" ${DASH}/>
<path d="M200,300 A100,100 0 0 1 208,300" ${THIN}/>
<text x="150" y="330" text-anchor="end" font-size="18" font-weight="700">外側 1〜2°</text>
<line x1="155" y1="322" x2="212" y2="322" ${THIN}/>
<text x="470" y="330" font-size="18" font-weight="700">内側（ポケット）2〜3°</text>
<line x1="465" y1="322" x2="372" y2="322" ${THIN}/>
<line x1="60" y1="200" x2="740" y2="200" ${DASH}/>
<text x="700" y="190" text-anchor="end" font-size="18" font-weight="700">見切り面（1 平面にする）</text>
<line x1="400" y1="160" x2="400" y2="80" ${LINE} marker-end="url(#ar)"/>
<text x="420" y="110" font-size="18">模型を抜く方向</text>
<text x="400" y="450" text-anchor="middle" font-size="20" font-weight="700">製品（模型）</text>
<text x="700" y="520" text-anchor="end" font-size="18">砂型（下型）</text>
<text x="40" y="575" font-size="17" fill="#374151">深い部分ほど勾配を大きく。肉付け側／肉引き側は設計と事前に取り決める</text>`,
    ),
  },
  'seed-img-core-print': {
    name: 'core-print-chaplet.svg',
    caption: '中子は湯の浮力で持ち上がる。両端の中子プリントで支え、足りなければチャップレットで押さえる',
    svg: svg(
      '中子プリントと浮力・チャップレット',
      `<rect x="0" y="70" width="800" height="490" fill="url(#sand)"/>
<line x1="0" y1="300" x2="800" y2="300" ${DASH}/>
<text x="20" y="292" font-size="18">上型</text><text x="20" y="324" font-size="18">下型</text>
<rect x="180" y="220" width="440" height="180" ${METAL}/>
<rect x="110" y="268" width="580" height="64" fill="url(#core)" stroke="#6b5a3a" stroke-width="3"/>
<line x1="180" y1="268" x2="180" y2="332" stroke="#6b5a3a" stroke-width="2" stroke-dasharray="4 4"/>
<line x1="620" y1="268" x2="620" y2="332" stroke="#6b5a3a" stroke-width="2" stroke-dasharray="4 4"/>
<line x1="400" y1="262" x2="400" y2="150" stroke="#b45309" stroke-width="5" marker-end="url(#arRed)"/>
<text x="420" y="180" font-size="20" font-weight="700" fill="#b45309">浮力（湯が中子を押し上げる）</text>
<rect x="272" y="332" width="56" height="8" fill="#5b6470"/><rect x="292" y="340" width="16" height="52" fill="#5b6470"/><rect x="272" y="392" width="56" height="8" fill="#5b6470"/>
<text x="300" y="440" text-anchor="middle" font-size="17">チャップレット</text><text x="300" y="462" text-anchor="middle" font-size="17">（中子押さえ）</text>
<text x="145" y="250" text-anchor="middle" font-size="17" font-weight="700">中子プリント</text>
<text x="655" y="250" text-anchor="middle" font-size="17" font-weight="700">中子プリント</text>
<text x="500" y="306" font-size="18" font-weight="700">中子</text>
<text x="420" y="380" font-size="18">製品部（溶湯）</text>
<text x="655" y="365" text-anchor="middle" font-size="15">隙間</text><text x="655" y="385" text-anchor="middle" font-size="15">0.1〜0.3mm</text>
<line x1="655" y1="345" x2="655" y2="335" ${THIN}/>
<text x="40" y="530" font-size="17" fill="#374151">浮力は鋳鉄で中子体積 × 約 7 倍の砂重量分。片持ちは避けて両端で支える</text>
<text x="40" y="556" font-size="17" fill="#374151">チャップレットは同系材質の錫メッキ品。錆・湿気は溶着不良の原因</text>`,
    ),
  },
  'seed-img-porosity': {
    name: 'shrinkage-vs-gas-porosity.svg',
    caption: '断面で見分ける。引け巣は内壁がギザギザで厚肉中央、ガス巣は滑らかな球形で上型側の表面直下',
    svg: svg(
      '引け巣とガス巣の見分け方（断面）',
      `<text x="220" y="100" text-anchor="middle" font-size="22" font-weight="700">引け巣（収縮巣）</text>
<text x="580" y="100" text-anchor="middle" font-size="22" font-weight="700">ガス巣（ブローホール）</text>
<polygon points="60,160 380,160 380,460 60,460" ${METAL}/>
<polygon points="200,250 225,285 265,275 245,310 275,345 235,340 215,380 200,340 160,350 185,310 150,290 195,290" fill="#3b2a1a" stroke="#1f2933" stroke-width="2"/>
<text x="220" y="500" text-anchor="middle" font-size="17">内壁がギザギザ（樹枝状）・不規則な形</text>
<text x="220" y="525" text-anchor="middle" font-size="17">厚肉部の中央・ボス根元に発生</text>
<text x="220" y="550" text-anchor="middle" font-size="17" fill="#b45309" font-weight="700">→ 押湯・冷やし金・方案の見直し</text>
<polygon points="420,160 740,160 740,460 420,460" ${METAL}/>
<circle cx="480" cy="200" r="18" fill="#3b2a1a" stroke="#1f2933" stroke-width="2"/>
<circle cx="545" cy="215" r="12" fill="#3b2a1a" stroke="#1f2933" stroke-width="2"/>
<circle cx="600" cy="195" r="20" fill="#3b2a1a" stroke="#1f2933" stroke-width="2"/>
<circle cx="660" cy="220" r="14" fill="#3b2a1a" stroke="#1f2933" stroke-width="2"/>
<circle cx="700" cy="190" r="10" fill="#3b2a1a" stroke="#1f2933" stroke-width="2"/>
<ellipse cx="520" cy="255" rx="9" ry="7" fill="#3b2a1a" stroke="#1f2933" stroke-width="2"/>
<line x1="580" y1="145" x2="580" y2="130" ${THIN}/><text x="580" y="125" text-anchor="middle" font-size="16">上面（上型側）</text>
<text x="580" y="500" text-anchor="middle" font-size="17">内壁が滑らか・球形〜楕円で光沢あり</text>
<text x="580" y="525" text-anchor="middle" font-size="17">上型側の表面直下・中子接触面に発生</text>
<text x="580" y="550" text-anchor="middle" font-size="17" fill="#1d4ed8" font-weight="700">→ 砂の水分・中子ガス・溶湯脱ガスの見直し</text>`,
    ),
  },
  'seed-img-diecast-vent': {
    name: 'diecast-overflow-chillvent.svg',
    caption: '最終充填部にオーバーフローを置き、その先のチルベントから型外へガスを逃がす（平面図）',
    svg: svg(
      'ダイカストのガス抜き配置（平面図）',
      `<rect x="80" y="70" width="640" height="500" fill="#d5d9df" stroke="#1f2933" stroke-width="3"/>
<rect x="360" y="520" width="80" height="50" ${METAL}/>
<polygon points="330,520 470,520 560,430 240,430" ${METAL}/>
<rect x="200" y="140" width="400" height="290" rx="14" ${METAL}/>
<line x1="300" y1="410" x2="300" y2="190" stroke="#1d4ed8" stroke-width="4" marker-end="url(#arBlue)"/>
<line x1="400" y1="410" x2="400" y2="190" stroke="#1d4ed8" stroke-width="4" marker-end="url(#arBlue)"/>
<line x1="500" y1="410" x2="500" y2="190" stroke="#1d4ed8" stroke-width="4" marker-end="url(#arBlue)"/>
<rect x="215" y="100" width="70" height="40" rx="6" ${METAL}/>
<rect x="365" y="100" width="70" height="40" rx="6" ${METAL}/>
<rect x="515" y="100" width="70" height="40" rx="6" ${METAL}/>
<polyline points="250,100 244,90 256,82 244,74 256,66 250,58" ${LINE} marker-end="url(#ar)"/>
<polyline points="400,100 394,90 406,82 394,74 406,66 400,58" ${LINE} marker-end="url(#ar)"/>
<polyline points="550,100 544,90 556,82 544,74 556,66 550,58" ${LINE} marker-end="url(#ar)"/>
<text x="400" y="300" text-anchor="middle" font-size="22" font-weight="700">製品（キャビティ）</text>
<text x="330" y="350" text-anchor="middle" font-size="16" fill="#1d4ed8">湯流れ</text>
<text x="620" y="170" font-size="17" font-weight="700">最終充填部</text>
<line x1="615" y1="163" x2="600" y2="155" ${THIN}/>
<text x="205" y="130" text-anchor="end" font-size="17" font-weight="700">オーバーフロー</text>
<text x="205" y="80" text-anchor="end" font-size="17" font-weight="700">チルベント → 型外へ</text>
<text x="205" y="102" text-anchor="end" font-size="15">（波形・厚さ 0.1〜0.2mm）</text>
<text x="400" y="470" text-anchor="middle" font-size="18" font-weight="700">ゲート</text>
<text x="460" y="552" font-size="18">ランナー</text>
<text x="100" y="510" font-size="16" fill="#374151">・ベント面はアルミ付着で塞がる → 定期清掃</text>
<text x="100" y="535" font-size="16" fill="#374151">・離型剤の水分もガス源 → 塗布後エアブロー</text>
<text x="100" y="560" font-size="16" fill="#374151">・耐圧品は真空ダイカストも検討</text>`,
    ),
  },
  'seed-img-die-temp': {
    name: 'die-temperature-points.svg',
    caption: '型温の測定点は湯口側・厚肉部・薄肉先端の 3 点以上を決め、定期的に記録する',
    svg: svg(
      '金型温度の測定点（アルミ重力鋳造）',
      `<rect x="100" y="120" width="600" height="380" fill="#d5d9df" stroke="#1f2933" stroke-width="3"/>
<polygon points="240,120 290,120 290,220 240,220" ${METAL}/>
<polygon points="200,220 420,220 420,300 620,300 620,400 200,400" ${METAL}/>
<circle cx="520" cy="460" r="12" fill="#ffffff" stroke="#1d4ed8" stroke-width="3"/>
<circle cx="600" cy="460" r="12" fill="#ffffff" stroke="#1d4ed8" stroke-width="3"/>
<text x="560" y="492" text-anchor="middle" font-size="15" fill="#1d4ed8">冷却水穴</text>
<circle cx="205" cy="180" r="18" fill="#b45309"/><text x="205" y="187" text-anchor="middle" font-size="18" fill="#ffffff" font-weight="700">1</text>
<circle cx="310" cy="440" r="18" fill="#b45309"/><text x="310" y="447" text-anchor="middle" font-size="18" fill="#ffffff" font-weight="700">2</text>
<circle cx="640" cy="350" r="18" fill="#b45309"/><text x="640" y="357" text-anchor="middle" font-size="18" fill="#ffffff" font-weight="700">3</text>
<line x1="310" y1="422" x2="310" y2="402" ${THIN}/>
<line x1="622" y1="350" x2="640" y2="350" ${THIN}/>
<text x="265" y="100" text-anchor="middle" font-size="17">湯口</text>
<text x="310" y="270" text-anchor="middle" font-size="18" font-weight="700">厚肉部</text>
<text x="520" y="360" text-anchor="middle" font-size="18" font-weight="700">薄肉部</text>
<text x="120" y="530" font-size="17">① 湯口側　② 厚肉部（冷却）　③ 薄肉先端（保温・ヒーター）</text>
<text x="120" y="560" font-size="17" fill="#374151">目安 250〜350℃。低いと湯回り不良、高いと引け・焼付き。部位間の温度差を縮める。</text>
<text x="400" y="580" text-anchor="middle" font-size="15" fill="#6b7280">金型（断面）</text>`,
    ),
  },
  'seed-img-heatcheck': {
    name: 'heat-check-pattern.svg',
    caption: 'ヒートチェックはゲート付近・湯当たり部から亀甲状に発生し、外側へ進行する（型面の平面図）',
    svg: svg(
      'ヒートチェック（熱疲労割れ）の進行',
      `<rect x="100" y="100" width="600" height="400" fill="#cfd4da" stroke="#1f2933" stroke-width="3"/>
<polygon points="100,260 100,340 150,320 150,280" ${METAL}/>
<text x="60" y="230" font-size="18" font-weight="700">ゲート</text>
<g stroke="#4b1d10" stroke-width="2.5" fill="none" stroke-linejoin="round">
<polyline points="160,200 190,215 185,250 215,270 240,255 245,220 275,205"/>
<polyline points="190,215 165,245 175,285 150,300"/>
<polyline points="185,250 160,265"/>
<polyline points="215,270 210,305 235,330 265,325 280,290 245,255"/>
<polyline points="175,285 205,300 210,305"/>
<polyline points="235,330 225,365 255,385 285,370 290,335 265,325"/>
<polyline points="205,300 190,340 170,355 175,390 205,405 225,365"/>
<polyline points="280,290 310,300 330,275 320,240 275,205 245,220"/>
<polyline points="330,275 355,290 350,325 320,345 290,335"/>
<polyline points="285,370 300,400 330,395 345,360 350,325"/>
<polyline points="355,290 385,280 405,300 395,330 365,340 350,325"/>
<polyline points="320,240 345,225 375,240 385,280"/>
<polyline points="405,300 435,310 440,340 415,355 395,330"/>
<polyline points="255,385 245,420 275,440 300,425 300,400"/>
<polyline points="375,240 400,215 430,235 435,270 405,300"/>
<polyline points="440,340 470,335 480,300 465,275 435,270"/>
<polyline points="480,300 510,290 530,310 520,345"/>
<polyline points="345,225 350,195 380,180 405,215"/>
<polyline points="510,290 535,265 530,235"/>
<polyline points="470,335 475,370 500,380"/>
<polyline points="415,355 420,390 445,405"/>
<polyline points="560,240 585,260 580,290"/>
<polyline points="600,330 625,345 620,375"/>
<polyline points="580,400 605,410"/>
</g>
<line x1="330" y1="140" x2="560" y2="140" stroke="#b45309" stroke-width="4" marker-end="url(#arRed)"/>
<text x="445" y="130" text-anchor="middle" font-size="17" fill="#b45309" font-weight="700">進行方向（密 → 疎）</text>
<text x="640" y="470" text-anchor="end" font-size="16">型面（平面図）</text>
<text x="100" y="535" font-size="17" fill="#374151">対策：予熱 150〜200℃以上、急冷スプレー最小限、SKD61 で HRC 44〜48、</text>
<text x="100" y="560" font-size="17" fill="#374151">1〜2 万ショットごとに応力除去焼戻し、コーナーは R 付け・磨き仕上げ</text>`,
    ),
  },
  'seed-img-core-vent': {
    name: 'core-vent.svg',
    caption: '中子内部のベント通路を中子プリント経由で型外へつなぎ、樹脂バインダのガスを逃がす',
    svg: svg(
      '中子のガス抜き（ベント）経路',
      `<rect x="0" y="70" width="800" height="490" fill="url(#sand)"/>
<line x1="0" y1="300" x2="800" y2="300" ${DASH}/>
<text x="20" y="292" font-size="18">上型</text><text x="20" y="324" font-size="18">下型</text>
<rect x="200" y="220" width="400" height="180" ${METAL}/>
<rect x="130" y="268" width="540" height="64" fill="url(#core)" stroke="#6b5a3a" stroke-width="3"/>
<polygon points="600,268 615,268 615,276 600,276" fill="#6b5a3a"/>
<line x1="170" y1="300" x2="668" y2="300" stroke="#1d4ed8" stroke-width="4" stroke-dasharray="14 8"/>
<rect x="668" y="292" width="100" height="16" fill="#ffffff" stroke="#1d4ed8" stroke-width="3"/>
<line x1="700" y1="300" x2="790" y2="300" stroke="#1d4ed8" stroke-width="4" marker-end="url(#arBlue)"/>
<g stroke="#b45309" stroke-width="3" fill="none">
<line x1="260" y1="280" x2="260" y2="296" marker-end="url(#arRed)"/><line x1="340" y1="322" x2="340" y2="306" marker-end="url(#arRed)"/>
<line x1="420" y1="280" x2="420" y2="296" marker-end="url(#arRed)"/><line x1="500" y1="322" x2="500" y2="306" marker-end="url(#arRed)"/>
</g>
<text x="400" y="200" text-anchor="middle" font-size="18">製品部（溶湯）</text>
<text x="165" y="250" text-anchor="middle" font-size="17" font-weight="700">中子プリント</text>
<text x="635" y="250" text-anchor="middle" font-size="17" font-weight="700">中子プリント</text>
<text x="330" y="440" font-size="18" font-weight="700">中子（樹脂バインダ）</text>
<text x="330" y="466" font-size="17" fill="#b45309">↑ 加熱でガス発生</text>
<text x="470" y="362" font-size="17" fill="#1d4ed8" font-weight="700">ベント通路（ワックス線など）</text>
<line x1="500" y1="350" x2="520" y2="305" stroke="#1d4ed8" stroke-width="2"/>
<text x="735" y="280" text-anchor="middle" font-size="16" fill="#1d4ed8" font-weight="700">型外へ</text>
<text x="600" y="255" font-size="14">湯止め段</text>
<text x="40" y="530" font-size="17" fill="#374151">型側のプリントにもガス抜き溝を切り、湯止めの段で湯の回り込みを防ぐ</text>
<text x="40" y="556" font-size="17" fill="#374151">上型の最も高い位置と中子プリントの両方に逃げ道を作るのが基本</text>`,
    ),
  },
};

export function seedImageRefs(...ids: string[]): KnowHowImage[] {
  return ids.map((id) => {
    const image = SEED_IMAGES[id];
    if (!image) throw new Error(`unknown seed image: ${id}`);
    return { id, name: image.name, caption: image.caption };
  });
}

export function seedImageBlob(id: string): Blob | null {
  const image = SEED_IMAGES[id];
  return image ? new Blob([image.svg], { type: 'image/svg+xml' }) : null;
}
