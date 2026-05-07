import { useMemo, useState } from "react";

const TEMPLE_PHOTO_URL = "haeinsa.jpe"; // public/temple.jpg 사용 시 "/temple.jpg"로 변경
const ROWS = 12;
const COLS = 30;
const TOTAL = ROWS * COLS;

const SAMPLE = [
  ["김보현", "가족의 평안과 건강을 발원합니다.", 30000],
  ["이서연", "좋은 인연과 지혜를 기원합니다.", 50000],
  ["박지훈", "부모님의 무병장수를 발원합니다.", 100000],
  ["정다은", "아이의 앞날에 밝은 길이 열리길 바랍니다.", 30000],
  ["한마음회", "모든 생명의 평화를 기원합니다.", 200000],
];

function initTiles() {
  const arr = Array.from({ length: TOTAL }, (_, i) => ({
    id: i + 1,
    code: `HG-${String(Math.floor(i / COLS) + 1).padStart(2, "0")}-${String((i % COLS) + 1).padStart(2, "0")}`,
    name: "",
    message: "",
    amount: 0,
    occupied: false,
  }));
  const used = new Set();
  while (used.size < 74) used.add(Math.floor(Math.random() * TOTAL));
  let k = 0;
  used.forEach((idx) => {
    const s = SAMPLE[k % SAMPLE.length];
    arr[idx] = { ...arr[idx], name: s[0], message: s[1], amount: s[2], occupied: true };
    k++;
  });
  return arr;
}

const won = (n) => new Intl.NumberFormat("ko-KR").format(n);

export default function App() {
  const [tiles, setTiles] = useState(initTiles);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", message: "", amount: 30000 });

  const filled = tiles.filter(t => t.occupied).length;
  const totalAmount = tiles.reduce((a, t) => a + t.amount, 0);
  const progress = Math.round((filled / TOTAL) * 100);
  const tile = selected !== null ? tiles[selected] : null;

  const top = useMemo(() => tiles.filter(t => t.occupied).sort((a,b)=>b.amount-a.amount).slice(0,5), [tiles]);

  const openTile = (i) => {
    setSelected(i);
    if (!tiles[i].occupied) {
      setForm({ name: "", message: "", amount: 30000 });
      setModal(true);
    } else {
      setModal(false);
    }
  };

  const submit = () => {
    if (!form.name.trim() || !form.message.trim()) return;
    setTiles(prev => {
      const next = [...prev];
      next[selected] = { ...next[selected], name: form.name.trim(), message: form.message.trim(), amount: Number(form.amount), occupied: true };
      return next;
    });
    setModal(false);
  };

  return (
    <main className="page">
      <section className="hero">
        <div className="nav">
          <div>
            <span className="eyebrow">온라인 기와불사</span>
            <h1>해인사 장경각 디지털 서원</h1>
          </div>
          <button className="ghost" onClick={() => document.querySelector(".content")?.scrollIntoView({behavior:"smooth"})}>내 기와 보기</button>
        </div>
        <p className="lead">팔만대장경을 품은 장경각을 모티브로, 한 장의 기와에 이름과 발원을 새기는 참여형 디지털 불사 데모입니다.</p>
        <div className="stats">
          <div><b>{TOTAL}</b><span>총 기와</span></div>
          <div><b>{filled}</b><span>등록 서원</span></div>
          <div><b>{progress}%</b><span>완성률</span></div>
          <div><b>{won(totalAmount)}원</b><span>누적 후원</span></div>
        </div>
      </section>

      <section className="temple">
        <div className="bar">
          <div><strong>장경각 정면 기와 영역</strong><p>기와를 클릭하면 서원 등록 또는 상세 내용을 볼 수 있습니다.</p></div>
          <div className="gauge"><span>완성률</span><div><i style={{width:`${progress}%`}} /></div><b>{progress}%</b></div>
        </div>

        <div className="scene">
          {TEMPLE_PHOTO_URL ? <img className="photo" src={TEMPLE_PHOTO_URL} alt="해인사 장경각" /> : <FallbackTemple />}
          <div className="tiles">
            {tiles.map((t, i) => (
              <button key={t.id} title={`${t.code} ${t.occupied ? t.name : "빈 기와"}`} onClick={() => openTile(i)} className={`tile ${t.occupied ? "filled" : ""} ${selected===i ? "active" : ""}`}>
                {t.occupied ? "卍" : ""}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="content">
        <article className="panel">
          <h2>선택한 기와</h2>
          {tile ? tile.occupied ? (
            <div className="detail"><span>{tile.code}</span><h3>{tile.name}</h3><p>{tile.message}</p><b>{won(tile.amount)}원</b></div>
          ) : (
            <div className="empty"><span>{tile.code}</span><p>아직 비어 있는 기와입니다.</p><button onClick={() => setModal(true)}>서원 등록하기</button></div>
          ) : <p className="muted">기와를 클릭하면 상세 정보가 표시됩니다.</p>}
        </article>
        <article className="panel">
          <h2>대표 서원</h2>
          {top.map(d => <div className="donor" key={d.code}><span>{d.code}</span><strong>{d.name}</strong><em>{won(d.amount)}원</em></div>)}
        </article>
        <article className="panel">
          <h2>실서비스 확장</h2>
          <ul>
            <li>실제 사찰 사진 위에 기와 좌표 매핑</li>
            <li>결제 연동 후 기와 확정</li>
            <li>관리자 승인 후 기도문 노출</li>
            <li>내 기와 찾기와 공유 링크</li>
          </ul>
        </article>
      </section>

      {modal && tile && (
        <div className="modalBg" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <span className="code">{tile.code}</span>
            <h2>기와 서원 등록</h2>
            <label>이름 / 단체명</label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="예: 최재호" />
            <label>발원문</label>
            <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="가족의 건강과 평안을 발원합니다." />
            <label>후원 금액</label>
            <select value={form.amount} onChange={e=>setForm({...form,amount:Number(e.target.value)})}>
              <option value={30000}>3만원</option>
              <option value={50000}>5만원</option>
              <option value={100000}>10만원</option>
              <option value={200000}>20만원</option>
            </select>
            <div className="actions"><button className="ghost" onClick={()=>setModal(false)}>취소</button><button className="primary" onClick={submit}>등록하기</button></div>
          </div>
        </div>
      )}
    </main>
  );
}

function FallbackTemple() {
  return (
    <div className="fallback">
      <div className="sky" /><div className="mountain a" /><div className="mountain b" /><div className="ground" />
      <div className="shadow" /><div className="base" />
      <div className="wall">{Array.from({length:9},(_,i)=><span key={i}/>)}</div>
      <div className="columns">{Array.from({length:8},(_,i)=><span key={i}/>)}</div>
      <div className="roof" /><div className="deepRoof" /><div className="ridge" /><div className="eave left" /><div className="eave right" />
      <div className="sign">藏經閣</div>
    </div>
  );
}
