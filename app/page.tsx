"use client";

import { useEffect, useState } from "react";

const links = [
  ["Início", "inicio"], ["O casal", "casal"], ["Cerimônia", "cerimonia"],
  ["Dicas", "dicas"], ["Confirme sua presença", "presenca"],
  ["Lista de presentes", "presentes"], ["Recados", "recados"],
];

function Countdown() {
  const wedding = new Date("2027-09-18T16:00:00").getTime();
  const [parts, setParts] = useState([0, 0, 0, 0]);
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, wedding - Date.now());
      setParts([Math.floor(d / 86400000), Math.floor(d / 3600000) % 24, Math.floor(d / 60000) % 60, Math.floor(d / 1000) % 60]);
    };
    tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer);
  }, [wedding]);
  return <div className="countdown">{parts.map((value, i) => <div key={i}><strong>{String(value).padStart(2,"0")}</strong><span>{["dias","horas","minutos","segundos"][i]}</span></div>)}</div>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState("");
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };

  return <main>
    <header className="nav">
      <button className="brand" onClick={() => go("inicio")}>P <i>&</i> M</button>
      <button className="menuButton" aria-label="Abrir menu" onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
      <nav className={open ? "open" : ""}>{links.map(([label,id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav>
    </header>

    <section id="inicio" className="hero">
      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=88" alt="Casal em uma cerimônia ao ar livre" />
      <div className="heroShade" />
      <div className="heroContent"><p>Vamos nos casar</p><h1>Priscila <span>&</span> Montanha</h1><div className="line"/><h2>18 • 09 • 2027</h2><button onClick={() => go("casal")}>Descubra nossa história <b>↓</b></button></div>
    </section>

    <section className="welcome section"><p className="eyebrow">SEJA BEM-VINDO</p><h2>Nosso grande dia está chegando</h2><p>Criamos este cantinho para compartilhar com vocês os detalhes da organização do nosso casamento. Estamos muito felizes e contamos com a presença de todos!</p><div className="flourish">❦</div><h3>Contagem regressiva</h3><Countdown /></section>

    <section id="casal" className="split section"><div className="photoStack"><img className="photoMain" src="https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=85" alt="Casal caminhando"/><div className="photoAccent"/></div><div className="story"><p className="eyebrow">O CASAL</p><h2>Uma história escrita a dois</h2><p>Nos conhecemos quando menos esperávamos e, desde então, descobrimos que a vida fica ainda mais bonita quando compartilhada. Entre risadas, viagens e sonhos, construímos nosso caminho até aqui.</p><p>Agora chegou o momento de celebrar esse amor ao lado das pessoas que fazem parte da nossa história.</p><span className="signature">P & M</span></div></section>

    <section id="cerimonia" className="event"><div className="eventCard"><p className="eyebrow">O GRANDE DIA</p><h2>Cerimônia & Festa</h2><div className="dateBadge"><span>SETEMBRO</span><strong>18</strong><small>2027</small></div><p>Sábado, às 16 horas</p><h3>Espaço Jardim das Oliveiras</h3><p>Estrada das Flores, 1200<br/>São Paulo — SP</p><a href="https://maps.google.com" target="_blank" rel="noreferrer">VER NO MAPA</a></div></section>

    <section id="dicas" className="section tips"><p className="eyebrow">PARA VOCÊS</p><h2>Dicas importantes</h2><div className="cards"><article><span>⌂</span><h3>Onde ficar</h3><p>Selecionamos algumas opções de hospedagem próximas ao local.</p><button>VER SUGESTÕES</button></article><article><span>♧</span><h3>Trajes</h3><p>O estilo da celebração será esporte fino. Venha confortável para festejar!</p><button>SAIBA MAIS</button></article><article><span>✦</span><h3>Salão de beleza</h3><p>Confira nossas indicações para se preparar com tranquilidade.</p><button>VER INDICAÇÕES</button></article></div></section>

    <section id="presenca" className="rsvp section"><div><p className="eyebrow">RSVP</p><h2>Confirme sua presença</h2><p>Ter você conosco tornará esse dia ainda mais especial. Confirme até 18 de agosto de 2027.</p></div><form onSubmit={(e)=>{e.preventDefault();setSent("Presença confirmada! Esperamos você por lá ♡");}}><label>Seu nome completo<input required placeholder="Digite seu nome"/></label><label>Você estará presente?<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Sim, estarei presente</option><option>Infelizmente não poderei ir</option></select></label><label>Número de acompanhantes<input type="number" min="0" placeholder="0"/></label><button>CONFIRMAR PRESENÇA</button>{sent && <p className="success">{sent}</p>}</form></section>

    <section id="presentes" className="section gifts"><p className="eyebrow">COM CARINHO</p><h2>Lista de presentes</h2><p>O melhor presente é ter você ao nosso lado. Mas, se desejar nos presentear, preparamos algumas sugestões.</p><div className="giftGrid">{[
      ["Jantar romântico na lua de mel","R$ 250"],["Passeio especial para os noivos","R$ 380"],["Café da manhã na cama","R$ 180"]
    ].map(([name,price],i)=><article key={name}><img src={`https://images.unsplash.com/photo-${["1547592180-85f173990554","1500530855697-b586d89ba3ee","1493770348161-369560ae357d"][i]}?auto=format&fit=crop&w=700&q=80`} alt="Sugestão de presente"/><div><h3>{name}</h3><p>{price}</p><button>PRESENTEAR</button></div></article>)}</div></section>

    <section id="recados" className="messages"><div className="section"><p className="eyebrow">DEIXE SEU CARINHO</p><h2>Recados para os noivos</h2><form onSubmit={(e)=>{e.preventDefault();setSent("Seu recado foi enviado com carinho ♡");}}><input required placeholder="Seu nome"/><textarea required placeholder="Escreva uma mensagem para o casal" rows={4}/><button>ENVIAR RECADO</button>{sent && <p className="success">{sent}</p>}</form><div className="notes"><blockquote>“Que essa nova etapa seja repleta de amor e cumplicidade. Estamos contando os dias!”<cite>— Família e amigos</cite></blockquote><blockquote>“Desejamos uma vida inteira de aventuras, risadas e muito amor.”<cite>— Convidados especiais</cite></blockquote></div></div></section>

    <footer><div className="monogram">P <i>&</i> M</div><p>18 • 09 • 2027</p><small>Feito com amor para celebrar uma história inesquecível.</small><button onClick={() => go("inicio")}>↑</button></footer>
  </main>;
}
