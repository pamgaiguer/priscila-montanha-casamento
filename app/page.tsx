"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const links = [
  ["Início", "inicio"], ["O casal", "casal"], ["Cerimônia", "cerimonia"],
  ["Dicas", "dicas"], ["Confirme sua presença", "presenca"],
  ["Lista de presentes", "presentes"], ["Recados", "recados"],
];

const giftItems = [
  { id: 1, image: "photo-1542766788-a2f588f447ee", name: "Ajude os noivos a continuarem fitness", price: 23821 },
  { id: 2, image: "photo-1548610325-af59423f54bc", name: "Sofá para o noivo dormir após uma discussão", price: 313439 },
  { id: 3, image: "photo-1529139574466-a303027c1d8b", name: "Lookinhos novos para a lua de mel", price: 34478 },
  { id: 4, image: "photo-1584100936595-c0654b55a2e2", name: "Cobertor para a noiva que está sempre coberta de razão", price: 15542 },
  { id: 5, image: "photo-1561504599-f900052636b3", name: "Cueca sexy para a noite de núpcias", price: 20723 },
  { id: 6, image: "photo-1549465220-1a8b9238cd48", name: "Só para dizer que não dei nada", price: 4383 },
  { id: 7, image: "photo-1556911220-bff31c812dba", name: "Cooktop de última geração", price: 43832 },
  { id: 8, image: "photo-1517466787929-bc90951d0974", name: "Capacete para o noivo caso o kit calmante não funcione", price: 20809 },
  { id: 9, image: "photo-1524178232363-1fb2b075b655", name: "Dar palpite sobre o casamento", price: 82893 },
  { id: 10, image: "photo-1527529482837-4698179dc6ce", name: "Levar alguém que não foi convidado", price: 2080949 },
  { id: 11, image: "photo-1523438885200-e635ba2c371e", name: "Taxa para a noiva não jogar o buquê para sua namorada", price: 29945 },
  { id: 12, image: "photo-1547592180-85f173990554", name: "Primeiro almoço na casa dos noivos", price: 22796 },
  { id: 13, image: "photo-1544787219-7f47ccb76574", name: "Kit calmante para desestressar a noiva", price: 15607 },
  { id: 14, image: "photo-1556910103-1c02745aae4d", name: "Curso de culinária para a noiva", price: 30090 },
  { id: 15, image: "photo-1553531384-cc64ac80f931", name: "Ajude com a taxa de mala extra para a lua de mel", price: 39116 },
  { id: 16, image: "photo-1503376780353-7e6692767b70", name: "Seguro para o carro da noiva", price: 57798 },
  { id: 17, image: "photo-1573496359142-b8d87734a5a2", name: "Terapia para os noivos não surtarem nos preparativos", price: 51404 },
  { id: 18, image: "photo-1559339352-11d035aa65de", name: "Prioridade na fila do buffet", price: 16437 },
  { id: 19, image: "photo-1495474472287-4d71bcdd2085", name: "Cota de café para sobreviver ao primeiro mês", price: 9876 },
  { id: 20, image: "photo-1505693416388-ac5ce068fe85", name: "Licença oficial para roncar na lua de mel", price: 18654 },
  { id: 21, image: "photo-1522869635100-9f4c5e86aa37", name: "Posse definitiva do controle remoto", price: 24990 },
  { id: 22, image: "photo-1544197150-b99a580bb7a8", name: "Wi-Fi para evitar a primeira crise do casal", price: 18999 },
  { id: 23, image: "photo-1565299624946-b28f40a0ae38", name: "Fundo emergencial para pedir delivery", price: 33333 },
  { id: 24, image: "photo-1518199266791-5375a83190b7", name: "Vale-desculpa premium para usar sem moderação", price: 49900 },
];

const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

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
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [giftOrder, setGiftOrder] = useState("default");
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };
  const toggleGift = (id: number) => setCart((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const selectedGifts = giftItems.filter((gift) => cart.includes(gift.id));
  const cartTotal = selectedGifts.reduce((total, gift) => total + gift.price, 0);
  const orderedGifts = [...giftItems].sort((a, b) => giftOrder === "highest" ? b.price - a.price : giftOrder === "lowest" ? a.price - b.price : a.id - b.id);

  return <main>
    <header className="nav">
      <button className="brand" onClick={() => go("inicio")}>P <i>&</i> M</button>
      <button className="menuButton" aria-label="Abrir menu" onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
      <nav className={open ? "open" : ""}>{links.map(([label,id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav>
    </header>

    <section id="inicio" className="hero">
      <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=88" alt="Casal em uma cerimônia ao ar livre" fill sizes="100vw" priority />
      <div className="heroShade" />
      <div className="heroContent"><p>Vamos nos casar</p><h1>Priscila <span>&</span> Montanha</h1><div className="line"/><h2>18 • 09 • 2027</h2><button onClick={() => go("casal")}>Descubra nossa história <b>↓</b></button></div>
    </section>

    <section className="welcome section"><p className="eyebrow">SEJA BEM-VINDO</p><h2>Nosso grande dia está chegando</h2><p>Criamos este cantinho para compartilhar com vocês os detalhes da organização do nosso casamento. Estamos muito felizes e contamos com a presença de todos!</p><div className="flourish">❦</div><h3>Contagem regressiva</h3><Countdown /></section>

    <section id="casal" className="split section"><div className="photoStack"><Image className="photoMain" src="https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=85" alt="Casal caminhando" width={1200} height={1500} sizes="(max-width: 900px) 86vw, 43vw"/><div className="photoAccent"/></div><div className="story"><p className="eyebrow">O CASAL</p><h2>Uma história escrita a dois</h2><p>Nos conhecemos quando menos esperávamos e, desde então, descobrimos que a vida fica ainda mais bonita quando compartilhada. Entre risadas, viagens e sonhos, construímos nosso caminho até aqui.</p><p>Agora chegou o momento de celebrar esse amor ao lado das pessoas que fazem parte da nossa história.</p><span className="signature">P & M</span></div></section>

    <section id="cerimonia" className="event"><div className="eventCard"><p className="eyebrow">O GRANDE DIA</p><h2>Cerimônia & Festa</h2><div className="dateBadge"><span>SETEMBRO</span><strong>18</strong><small>2027</small></div><p>Sábado, às 16 horas</p><h3>Espaço Jardim das Oliveiras</h3><p>Estrada das Flores, 1200<br/>São Paulo — SP</p><a href="https://maps.google.com" target="_blank" rel="noreferrer">VER NO MAPA</a></div></section>

    <section id="dicas" className="section tips"><p className="eyebrow">PARA VOCÊS</p><h2>Dicas importantes</h2><div className="cards"><article><span>⌂</span><h3>Onde ficar</h3><p>Selecionamos algumas opções de hospedagem próximas ao local.</p><button>VER SUGESTÕES</button></article><article><span>♧</span><h3>Trajes</h3><p>O estilo da celebração será esporte fino. Venha confortável para festejar!</p><button>SAIBA MAIS</button></article><article><span>✦</span><h3>Salão de beleza</h3><p>Confira nossas indicações para se preparar com tranquilidade.</p><button>VER INDICAÇÕES</button></article></div></section>

    <section id="presenca" className="rsvp section"><div><p className="eyebrow">RSVP</p><h2>Confirme sua presença</h2><p>Ter você conosco tornará esse dia ainda mais especial. Confirme até 18 de agosto de 2027.</p></div><form onSubmit={(e)=>{e.preventDefault();setSent("Presença confirmada! Esperamos você por lá ♡");}}><label>Seu nome completo<input required placeholder="Digite seu nome"/></label><label>Você estará presente?<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Sim, estarei presente</option><option>Infelizmente não poderei ir</option></select></label><label>Número de acompanhantes<input type="number" min="0" placeholder="0"/></label><button>CONFIRMAR PRESENÇA</button>{sent && <p className="success">{sent}</p>}</form></section>

    <section id="presentes" className="section gifts"><p className="eyebrow">COM CARINHO</p><h2>Lista de presentes</h2><p>O melhor presente é ter você ao nosso lado. Se quiser contribuir, escolha uma ou mais das nossas sugestões bem-humoradas.</p><div className="giftNotice"><strong>Presentes simbólicos</strong><span>Os itens abaixo são fictícios e os valores representam contribuições financeiras aos noivos.</span></div><div className="giftToolbar"><div><label htmlFor="gift-order">Ordenar por</label><select id="gift-order" value={giftOrder} onChange={(event) => setGiftOrder(event.target.value)}><option value="default">Nossa seleção</option><option value="highest">Maior preço</option><option value="lowest">Menor preço</option></select></div></div><div className="giftGrid">{orderedGifts.map((gift)=><article key={gift.id} className={cart.includes(gift.id) ? "selected" : ""}><div className="giftArt"><Image src={`https://images.unsplash.com/${gift.image}?auto=format&fit=crop&w=700&q=80`} alt={gift.name} width={700} height={500} sizes="(max-width: 700px) 86vw, (max-width: 1100px) 42vw, 22vw"/><small>P &amp; M</small></div><div className="giftBody"><h3>{gift.name}</h3><p>{money(gift.price)}</p><button onClick={() => toggleGift(gift.id)}>{cart.includes(gift.id) ? "REMOVER DO CARRINHO" : "ADICIONAR AO CARRINHO"}</button></div></article>)}</div></section>

    {cart.length > 0 && <button className="cartButton" onClick={() => setCartOpen(true)}><span>♡</span> Ver carrinho <b>{cart.length}</b></button>}

    {cartOpen && <div className="cartOverlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><section className="cartModal" role="dialog" aria-modal="true" aria-labelledby="cart-title"><button className="cartClose" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>×</button><p className="eyebrow">SEUS PRESENTES</p><h2 id="cart-title">Carrinho</h2><div className="cartItems">{selectedGifts.map((gift) => <div key={gift.id}><Image className="cartThumb" src={`https://images.unsplash.com/${gift.image}?auto=format&fit=crop&w=120&q=70`} alt="" width={46} height={46}/><p>{gift.name}<strong>{money(gift.price)}</strong></p><button aria-label={`Remover ${gift.name}`} onClick={() => toggleGift(gift.id)}>×</button></div>)}</div><div className="cartTotal"><span>Total da contribuição</span><strong>{money(cartTotal)}</strong></div><p className="cartDisclaimer">Você será direcionado ao ambiente seguro do Mercado Pago para concluir o pagamento.</p><button className="checkoutButton" disabled>PAGAMENTO EM BREVE</button></section></div>}

    <section id="recados" className="messages"><div className="section"><p className="eyebrow">DEIXE SEU CARINHO</p><h2>Recados para os noivos</h2><form onSubmit={(e)=>{e.preventDefault();setSent("Seu recado foi enviado com carinho ♡");}}><input required placeholder="Seu nome"/><textarea required placeholder="Escreva uma mensagem para o casal" rows={4}/><button>ENVIAR RECADO</button>{sent && <p className="success">{sent}</p>}</form><div className="notes"><blockquote>“Que essa nova etapa seja repleta de amor e cumplicidade. Estamos contando os dias!”<cite>— Família e amigos</cite></blockquote><blockquote>“Desejamos uma vida inteira de aventuras, risadas e muito amor.”<cite>— Convidados especiais</cite></blockquote></div></div></section>

    <footer><div className="monogram">P <i>&</i> M</div><p>18 • 09 • 2027</p><small>Feito com amor para celebrar uma história inesquecível.</small><button onClick={() => go("inicio")}>↑</button></footer>
  </main>;
}
