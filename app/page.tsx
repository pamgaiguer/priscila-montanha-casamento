"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { giftItems, isRealGift, isTestGift, MIN_PLAYFUL_GIFT_PRICE, MIN_TEST_GIFT_PRICE, TEST_CHECKOUT_ENABLED } from "@/lib/gifts";

const links = [
  ["Início", "inicio"], ["O casal", "casal"], ["Cerimônia", "cerimonia"],
  ["Lista de presentes", "presentes"], ["Dicas", "dicas"],
  ["Confirme sua presença", "presenca"], ["Recados", "recados"],
];

const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

const giftImage = (image: string, width: number, quality: number) =>
  image.startsWith("/") ? image : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=${quality}`;

const familyPhotos = [
  { src: "/photos/DSC_5456.jpg", alt: "Priscila, Montanha e a família reunidos" },
  { src: "/photos/DSC_5398.jpg", alt: "Retrato da filha com seu instrumento" },
  { src: "/photos/DSC_5523.jpg", alt: "Montanha e a filha em um momento divertido" },
  { src: "/photos/DSC_5555.jpg", alt: "Retrato da família em preto e branco" },
  { src: "/photos/DSC_5483.jpg", alt: "Priscila e Montanha com o baixo" },
  { src: "/photos/DSC_5759.jpg", alt: "Priscila e Montanha dançando" },
];

function FamilySlider() {
  return <aside className="familySlider" aria-label="Fotos da família"><div className="familySliderHeading"><span>NOSSA FAMÍLIA</span><strong>Quem faz parte da nossa história</strong></div><div className="familySliderViewport"><div className="familySliderTrack">{[false, true].map((duplicate) => <div className="familySliderGroup" key={String(duplicate)} aria-hidden={duplicate}>{familyPhotos.map((photo) => <div className="familyPhoto" key={`${duplicate}-${photo.src}`}><Image src={photo.src} alt={duplicate ? "" : photo.alt} width={480} height={720} sizes="(max-width: 650px) 58vw, 240px" /></div>)}</div>)}</div></div></aside>;
}

function Countdown() {
  const wedding = new Date("2026-09-26T16:00:00-03:00").getTime();
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
  const [giftAmounts, setGiftAmounts] = useState<Record<number, number>>({});
  const [giftOrder, setGiftOrder] = useState("default");
  const [payerEmail, setPayerEmail] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };
  const toggleGift = (id: number) => {
    const gift = giftItems.find((item) => item.id === id);
    setCart((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    if (gift && (!isRealGift(id) || isTestGift(id)) && giftAmounts[id] === undefined) {
      const minimum = isTestGift(id) ? MIN_TEST_GIFT_PRICE : MIN_PLAYFUL_GIFT_PRICE;
      setGiftAmounts((current) => ({ ...current, [id]: Math.max(gift.price, minimum) }));
    }
  };
  const selectedGifts = giftItems.filter((gift) => cart.includes(gift.id));
  const giftPrice = (gift: (typeof giftItems)[number]) => {
    if (isRealGift(gift.id) && !isTestGift(gift.id)) return gift.price;
    const minimum = isTestGift(gift.id) ? MIN_TEST_GIFT_PRICE : MIN_PLAYFUL_GIFT_PRICE;
    return giftAmounts[gift.id] ?? Math.max(gift.price, minimum);
  };
  const cartTotal = selectedGifts.reduce((total, gift) => total + giftPrice(gift), 0);
  const hasInvalidAmount = selectedGifts.some((gift) => {
    if (isRealGift(gift.id) && !isTestGift(gift.id)) return false;
    return giftPrice(gift) < (isTestGift(gift.id) ? MIN_TEST_GIFT_PRICE : MIN_PLAYFUL_GIFT_PRICE);
  });
  const orderedGifts = giftItems.filter((gift) => TEST_CHECKOUT_ENABLED || !isTestGift(gift.id)).sort((a, b) => giftOrder === "highest" ? b.price - a.price : giftOrder === "lowest" ? a.price - b.price : a.id - b.id);
  const practicalGifts = orderedGifts.filter((gift) => isRealGift(gift.id) && !isTestGift(gift.id));
  const playfulGifts = orderedGifts.filter((gift) => !isRealGift(gift.id) || isTestGift(gift.id));
  const startCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftIds: cart, giftAmounts, payerEmail }),
      });
      const result = await response.json() as { checkoutUrl?: string; error?: string };
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error || "Não foi possível iniciar o pagamento.");
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Não foi possível iniciar o pagamento.");
      setCheckoutLoading(false);
    }
  };
  const renderGift = (gift: (typeof giftItems)[number]) => <article key={gift.id} className={cart.includes(gift.id) ? "selected" : ""}><div className={`giftArt${gift.image ? "" : " giftArtPlaceholder"}`}>{gift.image ? <Image src={giftImage(gift.image, 700, 80)} alt={gift.name} width={700} height={500} sizes="(max-width: 700px) 86vw, (max-width: 1100px) 42vw, 22vw"/> : <b>TESTE<br/>PIX</b>}<small>P &amp; M</small></div><div className="giftBody"><h3>{gift.name}</h3><p>{isRealGift(gift.id) && !isTestGift(gift.id) ? money(gift.price) : <>Valor sugerido: {money(giftPrice(gift))}<small>{isTestGift(gift.id) ? "Presente temporário de teste — mínimo R$ 0,50" : "Este valor é simbólico — ajuste como preferir, respeitando o mínimo de R$ 75,00."}</small></>}</p><button onClick={() => toggleGift(gift.id)}>{cart.includes(gift.id) ? "REMOVER DO CARRINHO" : "ADICIONAR AO CARRINHO"}</button></div></article>;

  return <main>
    <header className="nav">
      <button className="brand" onClick={() => go("inicio")}>P <i>&</i> M</button>
      <button className="menuButton" aria-label="Abrir menu" onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
      <nav className={open ? "open" : ""}>{links.map(([label,id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav>
    </header>

    <section id="inicio" className="hero">
      <Image src="/photos/site-hero-v2.jpg" alt="Priscila e Montanha juntos no ensaio" fill sizes="100vw" priority />
      <div className="heroShade" />
      <div className="heroContent"><p>Vamos nos casar</p><h1>Priscila <span>&</span> Montanha</h1><div className="line"/><h2>26 • 09 • 2026</h2><button onClick={() => go("casal")}>Descubra nossa história <b>↓</b></button></div>
    </section>

    <section className="welcome section"><p className="eyebrow">SEJA BEM-VINDO</p><h2>Um novo capítulo da nossa história</h2><p>Depois de 5 anos vivendo intensamente cada momento juntos, chegou a hora de oficializar nossa história! Decidimos dar um passo importante: morar juntos e realizar nossa união no civil.</p><p>E, para celebrar essa nova fase, queremos reunir as pessoas que amamos para uma costelada especial de boas-vindas à nossa casa nova.</p><p>Criamos este site para reunir todas as informações importantes e, para quem desejar nos ajudar no chá da casa nova, também deixamos uma lista de presentes.</p><p>Acreditamos que um lar não é construído apenas por paredes e móveis, mas também pelo carinho de quem faz parte da nossa história. Por isso, cada presente simboliza um pedacinho desse novo começo e será uma lembrança de que vocês fizeram parte dos primeiros capítulos da nossa vida nesta casa.</p><p>O maior presente de todos, porém, será celebrar esse momento ao lado de vocês. Esperamos vocês com o coração cheio de alegria!</p><div className="flourish">❦</div><h3>Contagem regressiva</h3><Countdown /></section>

    <section id="casal" className="split section"><div className="photoStack"><Image className="photoMain" src="/photos/site-story.jpg" alt="Priscila e Montanha juntos" width={1200} height={1800} sizes="(max-width: 900px) 86vw, 43vw"/><div className="photoAccent"/></div><div className="story"><p className="eyebrow">O CASAL</p><h2>Uma história escrita a dois</h2><p>Algumas histórias começam quando menos se espera. A nossa começou logo após o lockdown da pandemia, quando nossos caminhos se cruzaram em um show.</p><p>Entre música, boas conversas e um simples “até logo”, nasceu uma história que mudaria nossas vidas.</p><p>Depois vieram o primeiro encontro, o companheirismo e a certeza de que sempre haveria alguém para acreditar nos sonhos do outro.</p><p>Enquanto cada um construía o próprio caminho, também nascia um sonho em comum: construir um lar, formar uma família e compartilhar a vida.</p><p>Com o tempo, morar juntos deixou de ser apenas um plano e se tornou o próximo passo natural. No Dia dos Namorados de 2026, um pedido de noivado tornou esse sonho ainda mais especial.</p><p>Agora, chegou a hora de escrever um novo capítulo! E não poderíamos imaginar uma forma melhor de começar essa nova fase do que celebrando ao lado das pessoas que amamos.</p><span className="signature">P & M</span></div></section>

    <section id="cerimonia" className="event"><div className="eventCard"><p className="eyebrow">O GRANDE DIA</p><h2>Cerimônia & Festa</h2><div className="dateBadge"><span>SETEMBRO</span><strong>26</strong><small>2026</small></div><p>Sábado, às 16 horas</p><h3>Espaço Jardim das Oliveiras</h3><p>Estrada das Flores, 1200<br/>São Paulo — SP</p><a href="https://maps.google.com" target="_blank" rel="noreferrer">VER NO MAPA</a></div></section>

    <section id="presentes" className="giftsBand"><div className="section gifts"><p className="eyebrow">COM CARINHO</p><h2>Lista de presentes</h2><p>O melhor presente é ter você ao nosso lado. Se quiser contribuir, escolha uma ou mais das nossas sugestões.</p><div className="giftNotice"><strong>Presentes simbólicos</strong><span>Os itens abaixo são simbólicos e os valores representam contribuições financeiras aos noivos.</span></div><div className="giftToolbar"><div><label htmlFor="gift-order">Ordenar por</label><select id="gift-order" value={giftOrder} onChange={(event) => setGiftOrder(event.target.value)}><option value="default">Nossa seleção</option><option value="highest">Maior preço</option><option value="lowest">Menor preço</option></select></div></div><div className="giftGrid"><header className="giftGroupHeading"><span>PARA O NOVO LAR</span><h3>Presentes para a casa nova</h3><p>Opções clássicas para quem prefere presentear de um jeito mais tradicional.</p></header>{practicalGifts.map(renderGift)}<FamilySlider /><header className="giftGroupHeading giftGroupHeadingPlayful"><span>COM A CARA DOS NOIVOS</span><h3>Presentes selecionados ESPECIALMENTE para o casal </h3><p>Contribuições simbólicas escolhidas com carinho e uma pitada do nosso bom humor.</p></header>{playfulGifts.map(renderGift)}</div></div></section>

    <section id="dicas" className="section tips"><p className="eyebrow">PARA VOCÊS</p><h2>Dicas importantes</h2><div className="cards"><article><span>⌂</span><h3>Onde ficar</h3><p>Selecionamos algumas opções de hospedagem próximas ao local.</p><button>VER SUGESTÕES</button></article><article><span>♧</span><h3>Trajes</h3><p>O estilo da celebração será esporte fino. Venha confortável para festejar!</p><button>SAIBA MAIS</button></article><article><span>✦</span><h3>Salão de beleza</h3><p>Confira nossas indicações para se preparar com tranquilidade.</p><button>VER INDICAÇÕES</button></article></div></section>

    <section id="presenca" className="rsvp section"><div><p className="eyebrow">RSVP</p><h2>Confirme sua presença</h2><p>Ter você conosco tornará esse dia ainda mais especial. Confirme até 26 de agosto de 2026.</p></div><form onSubmit={(e)=>{e.preventDefault();setSent("Presença confirmada! Esperamos você por lá ♡");}}><label>Seu nome completo<input required placeholder="Digite seu nome"/></label><label>Você estará presente?<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Sim, estarei presente</option><option>Infelizmente não poderei ir</option></select></label><label>Número de acompanhantes<input type="number" min="0" placeholder="0"/></label><button>CONFIRMAR PRESENÇA</button>{sent && <p className="success">{sent}</p>}</form></section>

    {cart.length > 0 && <button className="cartButton" onClick={() => setCartOpen(true)}><span>♡</span> Ver carrinho <b>{cart.length}</b></button>}

    {cartOpen && <div className="cartOverlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><section className="cartModal" role="dialog" aria-modal="true" aria-labelledby="cart-title"><button className="cartClose" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>×</button><p className="eyebrow">SEUS PRESENTES</p><h2 id="cart-title">Carrinho</h2><div className="cartItems">{selectedGifts.map((gift) => <div key={gift.id}>{gift.image ? <Image className="cartThumb" src={giftImage(gift.image, 120, 70)} alt="" width={46} height={46}/> : <span className="cartThumb cartThumbPlaceholder">PIX</span>}<p>{gift.name}{isRealGift(gift.id) && !isTestGift(gift.id) ? <strong>{money(gift.price)}</strong> : <label className="cartGiftAmount">Valor da contribuição<input type="number" min={isTestGift(gift.id) ? "0.50" : "75"} step="0.01" value={giftPrice(gift) / 100} onChange={(event) => setGiftAmounts((current) => ({ ...current, [gift.id]: Math.round(Number(event.target.value) * 100) }))} aria-label={`Valor para ${gift.name}`} /></label>}</p><button aria-label={`Remover ${gift.name}`} onClick={() => toggleGift(gift.id)}>×</button></div>)}</div><div className="cartTotal"><span>Total da contribuição</span><strong>{money(cartTotal)}</strong></div>{hasInvalidAmount && <p className="checkoutError" role="alert">Confira o valor mínimo indicado para cada presente.</p>}<label className="checkoutEmail">Seu e-mail<input type="email" required value={payerEmail} onChange={(event) => setPayerEmail(event.target.value)} placeholder="voce@exemplo.com" autoComplete="email" /></label>{TEST_CHECKOUT_ENABLED && <button type="button" className="testEmailButton" onClick={() => setPayerEmail("comprador.teste@example.com")}>USAR E-MAIL DE TESTE</button>}<p className="cartDisclaimer">Você será direcionado ao ambiente seguro do Mercado Pago para concluir o pagamento.</p>{checkoutError && <p className="checkoutError" role="alert">{checkoutError}</p>}<button className="checkoutButton" onClick={startCheckout} disabled={checkoutLoading || !payerEmail || hasInvalidAmount}>{checkoutLoading ? "ABRINDO PAGAMENTO…" : "PAGAR COM MERCADO PAGO"}</button></section></div>}

    <section id="recados" className="messages"><div className="section"><p className="eyebrow">DEIXE SEU CARINHO</p><h2>Recados para os noivos</h2><form onSubmit={(e)=>{e.preventDefault();setSent("Seu recado foi enviado com carinho ♡");}}><input required placeholder="Seu nome"/><textarea required placeholder="Escreva uma mensagem para o casal" rows={4}/><button>ENVIAR RECADO</button>{sent && <p className="success">{sent}</p>}</form><div className="notes"><blockquote>“Que essa nova etapa seja repleta de amor e cumplicidade. Estamos contando os dias!”<cite>— Família e amigos</cite></blockquote><blockquote>“Desejamos uma vida inteira de aventuras, risadas e muito amor.”<cite>— Convidados especiais</cite></blockquote></div></div></section>

    <footer><div className="monogram">P <i>&</i> M</div><p>26 • 09 • 2026</p><small>Feito com amor para celebrar uma história inesquecível.</small><button onClick={() => go("inicio")}>↑</button></footer>
  </main>;
}
