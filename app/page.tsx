"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const links = [
  ["Início", "inicio"], ["O casal", "casal"], ["Cerimônia", "cerimonia"],
  ["Lista de presentes", "presentes"], ["Dicas", "dicas"],
  ["Confirme sua presença", "presenca"], ["Recados", "recados"],
];

const giftItems = [
  { id: 1, image: "photo-1542766788-a2f588f447ee", name: "Ajude os noivos a continuarem fitness", price: 23821 },
  { id: 2, image: "photo-1548610325-af59423f54bc", name: "Sofá para o noivo dormir após uma discussão", price: 313439 },
  { id: 3, image: "photo-1529139574466-a303027c1d8b", name: "Lookinhos novos para a lua de mel", price: 34478 },
  { id: 4, image: "/gifts/cozy-blanket-v2.png", name: "Cobertor para a noiva que está sempre coberta de razão", price: 15542 },
  { id: 5, image: "photo-1561504599-f900052636b3", name: "Cueca sexy para a noite de núpcias", price: 20723 },
  { id: 6, image: "photo-1549465220-1a8b9238cd48", name: "Só para dizer que não dei nada", price: 4383 },
  { id: 7, image: "/gifts/hello-kitty-stove.png", name: "Cooktop de última geração", price: 43832 },
  { id: 8, image: "photo-1517466787929-bc90951d0974", name: "Capacete para o noivo caso o kit calmante não funcione", price: 20809 },
  { id: 9, image: "photo-1524178232363-1fb2b075b655", name: "Dar palpite sobre o casamento", price: 82893 },
  { id: 10, image: "photo-1527529482837-4698179dc6ce", name: "Levar alguém que não foi convidado", price: 2080949 },
  { id: 11, image: "photo-1523438885200-e635ba2c371e", name: "Taxa para a noiva não jogar o buquê para sua namorada", price: 29945 },
  { id: 12, image: "photo-1547592180-85f173990554", name: "Primeiro almoço na casa dos noivos", price: 22796 },
  { id: 13, image: "photo-1544787219-7f47ccb76574", name: "Kit calmante para desestressar a noiva", price: 15607 },
  { id: 14, image: "photo-1556910103-1c02745aae4d", name: "Curso de culinária para a noiva", price: 30090 },
  { id: 15, image: "photo-1553531384-cc64ac80f931", name: "Ajude com a taxa de mala extra para a lua de mel", price: 39116 },
  { id: 16, image: "photo-1503376780353-7e6692767b70", name: "Seguro para o carro da noiva", price: 57798 },
  { id: 17, image: "/gifts/wedding-therapy-chaos.png", name: "Terapia para os noivos não surtarem nos preparativos", price: 51404 },
  { id: 18, image: "/gifts/buffet-priority.png", name: "Prioridade na fila do buffet", price: 16437 },
  { id: 19, image: "photo-1495474472287-4d71bcdd2085", name: "Cota de café para sobreviver ao primeiro mês", price: 9876 },
  { id: 20, image: "/gifts/honeymoon-snoring.png", name: "Licença oficial para roncar na lua de mel", price: 18654 },
  { id: 21, image: "photo-1522869635100-9f4c5e86aa37", name: "Posse definitiva do controle remoto", price: 24990 },
  { id: 22, image: "photo-1544197150-b99a580bb7a8", name: "Wi-Fi para evitar a primeira crise do casal", price: 18999 },
  { id: 23, image: "photo-1565299624946-b28f40a0ae38", name: "Fundo emergencial para pedir delivery", price: 33333 },
  { id: 24, image: "photo-1518199266791-5375a83190b7", name: "Vale-desculpa premium para usar sem moderação", price: 49900 },
  { id: 25, image: "/gifts/bass-strings-kit.png", name: "Kit de cordas pro baixo do noivo (senão ele não trabalha)", price: 18967 },
  { id: 26, image: "/gifts/anime-weekend-pass.png", name: "Vale fim de semana pra noiva ir à Anime Friends e/ou CCXP em SP", price: 124790 },
  { id: 27, image: "/gifts/pepsi-zero-stock.png", name: "TODO o estoque de Pepsi Zero de todos os atacados da região", price: 9990 },
  { id: 28, image: "/gifts/suspicious-women-manual.png", name: "Manual de reconhecimento de mulheres duvidosas", price: 7490 },
  { id: 29, image: "/gifts/dinnerware-set.png", name: "Jogo de pratos para a casa nova", price: 34990 },
  { id: 30, image: "/gifts/flatware-set.jpg", name: "Faqueiro", price: 5900 },
  { id: 31, image: "/gifts/bedding-set.jpg", name: "Jogo de cama", price: 15900 },
  { id: 32, image: "/gifts/electric-kettle.jpg", name: "Chaleira elétrica", price: 18500 },
  { id: 33, image: "/gifts/glassware-set.jpg", name: "Jogo de taças", price: 23800 },
  { id: 34, image: "/gifts/blender.jpg", name: "Liquidificador", price: 12800 },
  { id: 35, image: "/gifts/electric-cooker.jpg", name: "Panela elétrica", price: 28000 },
  { id: 36, image: "/gifts/steam-iron.jpg", name: "Ferro a vapor", price: 9900 },
  { id: 37, image: "/gifts/spin-mop.jpg", name: "Mop giratório", price: 9900 },
  { id: 38, image: "/gifts/bath-towel-set.jpg", name: "Jogo de toalhas de banho", price: 14990 },
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
  const practicalGifts = orderedGifts.filter((gift) => gift.id >= 29);
  const playfulGifts = orderedGifts.filter((gift) => gift.id < 29);
  const renderGift = (gift: (typeof giftItems)[number]) => <article key={gift.id} className={cart.includes(gift.id) ? "selected" : ""}><div className="giftArt"><Image src={giftImage(gift.image, 700, 80)} alt={gift.name} width={700} height={500} sizes="(max-width: 700px) 86vw, (max-width: 1100px) 42vw, 22vw"/><small>P &amp; M</small></div><div className="giftBody"><h3>{gift.name}</h3><p>{money(gift.price)}</p><button onClick={() => toggleGift(gift.id)}>{cart.includes(gift.id) ? "REMOVER DO CARRINHO" : "ADICIONAR AO CARRINHO"}</button></div></article>;

  return <main>
    <header className="nav">
      <button className="brand" onClick={() => go("inicio")}>P <i>&</i> M</button>
      <button className="menuButton" aria-label="Abrir menu" onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
      <nav className={open ? "open" : ""}>{links.map(([label,id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav>
    </header>

    <section id="inicio" className="hero">
      <Image src="/photos/site-hero-v2.jpg" alt="Priscila e Montanha juntos no ensaio" fill sizes="100vw" priority />
      <div className="heroShade" />
      <div className="heroContent"><p>Vamos nos casar</p><h1>Priscila <span>&</span> Montanha</h1><div className="line"/><h2>18 • 09 • 2027</h2><button onClick={() => go("casal")}>Descubra nossa história <b>↓</b></button></div>
    </section>

    <section className="welcome section"><p className="eyebrow">SEJA BEM-VINDO</p><h2>Um novo capítulo da nossa história</h2><p>Depois de 5 anos vivendo intensamente cada momento juntos, chegou a hora de oficializar nossa história! Decidimos dar um passo importante: morar juntos e realizar nossa união no civil.</p><p>E, para celebrar essa nova fase, queremos reunir as pessoas que amamos para uma costelada especial de boas-vindas à nossa casa nova.</p><p>Criamos este site para reunir todas as informações importantes e, para quem desejar nos ajudar no chá da casa nova, também deixamos uma lista de presentes.</p><p>Acreditamos que um lar não é construído apenas por paredes e móveis, mas também pelo carinho de quem faz parte da nossa história. Por isso, cada presente simboliza um pedacinho desse novo começo e será uma lembrança de que vocês fizeram parte dos primeiros capítulos da nossa vida nesta casa.</p><p>O maior presente de todos, porém, será celebrar esse momento ao lado de vocês. Esperamos vocês com o coração cheio de alegria!</p><div className="flourish">❦</div><h3>Contagem regressiva</h3><Countdown /></section>

    <section id="casal" className="split section"><div className="photoStack"><Image className="photoMain" src="/photos/site-story.jpg" alt="Priscila e Montanha juntos" width={1200} height={1800} sizes="(max-width: 900px) 86vw, 43vw"/><div className="photoAccent"/></div><div className="story"><p className="eyebrow">O CASAL</p><h2>Uma história escrita a dois</h2><p>Algumas histórias começam quando menos se espera. A nossa começou logo após o lockdown da pandemia, quando nossos caminhos se cruzaram em um show.</p><p>Entre música, boas conversas e um simples “até logo”, nasceu uma história que mudaria nossas vidas.</p><p>Depois vieram o primeiro encontro, o companheirismo e a certeza de que sempre haveria alguém para acreditar nos sonhos do outro.</p><p>Enquanto cada um construía o próprio caminho, também nascia um sonho em comum: construir um lar, formar uma família e compartilhar a vida.</p><p>Com o tempo, morar juntos deixou de ser apenas um plano e se tornou o próximo passo natural. No Dia dos Namorados de 2026, um pedido de noivado tornou esse sonho ainda mais especial.</p><p>Agora, chegou a hora de escrever um novo capítulo! E não poderíamos imaginar uma forma melhor de começar essa nova fase do que celebrando ao lado das pessoas que amamos.</p><span className="signature">P & M</span></div></section>

    <section id="cerimonia" className="event"><div className="eventCard"><p className="eyebrow">O GRANDE DIA</p><h2>Cerimônia & Festa</h2><div className="dateBadge"><span>SETEMBRO</span><strong>18</strong><small>2027</small></div><p>Sábado, às 16 horas</p><h3>Espaço Jardim das Oliveiras</h3><p>Estrada das Flores, 1200<br/>São Paulo — SP</p><a href="https://maps.google.com" target="_blank" rel="noreferrer">VER NO MAPA</a></div></section>

    <section id="presentes" className="giftsBand"><div className="section gifts"><p className="eyebrow">COM CARINHO</p><h2>Lista de presentes</h2><p>O melhor presente é ter você ao nosso lado. Se quiser contribuir, escolha uma ou mais das nossas sugestões.</p><div className="giftNotice"><strong>Presentes simbólicos</strong><span>Os itens abaixo são simbólicos e os valores representam contribuições financeiras aos noivos.</span></div><div className="giftToolbar"><div><label htmlFor="gift-order">Ordenar por</label><select id="gift-order" value={giftOrder} onChange={(event) => setGiftOrder(event.target.value)}><option value="default">Nossa seleção</option><option value="highest">Maior preço</option><option value="lowest">Menor preço</option></select></div></div><div className="giftGrid"><header className="giftGroupHeading"><span>PARA O NOVO LAR</span><h3>Presentes para a casa nova</h3><p>Opções clássicas para quem prefere presentear de um jeito mais tradicional.</p></header>{practicalGifts.map(renderGift)}<FamilySlider /><header className="giftGroupHeading giftGroupHeadingPlayful"><span>COM A CARA DOS NOIVOS</span><h3>Presentes selecionados ESPECIALMENTE para o casal </h3><p>Contribuições simbólicas escolhidas com carinho e uma pitada do nosso bom humor.</p></header>{playfulGifts.map(renderGift)}</div></div></section>

    <section id="dicas" className="section tips"><p className="eyebrow">PARA VOCÊS</p><h2>Dicas importantes</h2><div className="cards"><article><span>⌂</span><h3>Onde ficar</h3><p>Selecionamos algumas opções de hospedagem próximas ao local.</p><button>VER SUGESTÕES</button></article><article><span>♧</span><h3>Trajes</h3><p>O estilo da celebração será esporte fino. Venha confortável para festejar!</p><button>SAIBA MAIS</button></article><article><span>✦</span><h3>Salão de beleza</h3><p>Confira nossas indicações para se preparar com tranquilidade.</p><button>VER INDICAÇÕES</button></article></div></section>

    <section id="presenca" className="rsvp section"><div><p className="eyebrow">RSVP</p><h2>Confirme sua presença</h2><p>Ter você conosco tornará esse dia ainda mais especial. Confirme até 18 de agosto de 2027.</p></div><form onSubmit={(e)=>{e.preventDefault();setSent("Presença confirmada! Esperamos você por lá ♡");}}><label>Seu nome completo<input required placeholder="Digite seu nome"/></label><label>Você estará presente?<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Sim, estarei presente</option><option>Infelizmente não poderei ir</option></select></label><label>Número de acompanhantes<input type="number" min="0" placeholder="0"/></label><button>CONFIRMAR PRESENÇA</button>{sent && <p className="success">{sent}</p>}</form></section>

    {cart.length > 0 && <button className="cartButton" onClick={() => setCartOpen(true)}><span>♡</span> Ver carrinho <b>{cart.length}</b></button>}

    {cartOpen && <div className="cartOverlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><section className="cartModal" role="dialog" aria-modal="true" aria-labelledby="cart-title"><button className="cartClose" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>×</button><p className="eyebrow">SEUS PRESENTES</p><h2 id="cart-title">Carrinho</h2><div className="cartItems">{selectedGifts.map((gift) => <div key={gift.id}><Image className="cartThumb" src={giftImage(gift.image, 120, 70)} alt="" width={46} height={46}/><p>{gift.name}<strong>{money(gift.price)}</strong></p><button aria-label={`Remover ${gift.name}`} onClick={() => toggleGift(gift.id)}>×</button></div>)}</div><div className="cartTotal"><span>Total da contribuição</span><strong>{money(cartTotal)}</strong></div><p className="cartDisclaimer">Você será direcionado ao ambiente seguro do Mercado Pago para concluir o pagamento.</p><button className="checkoutButton" disabled>PAGAMENTO EM BREVE</button></section></div>}

    <section id="recados" className="messages"><div className="section"><p className="eyebrow">DEIXE SEU CARINHO</p><h2>Recados para os noivos</h2><form onSubmit={(e)=>{e.preventDefault();setSent("Seu recado foi enviado com carinho ♡");}}><input required placeholder="Seu nome"/><textarea required placeholder="Escreva uma mensagem para o casal" rows={4}/><button>ENVIAR RECADO</button>{sent && <p className="success">{sent}</p>}</form><div className="notes"><blockquote>“Que essa nova etapa seja repleta de amor e cumplicidade. Estamos contando os dias!”<cite>— Família e amigos</cite></blockquote><blockquote>“Desejamos uma vida inteira de aventuras, risadas e muito amor.”<cite>— Convidados especiais</cite></blockquote></div></div></section>

    <footer><div className="monogram">P <i>&</i> M</div><p>18 • 09 • 2027</p><small>Feito com amor para celebrar uma história inesquecível.</small><button onClick={() => go("inicio")}>↑</button></footer>
  </main>;
}
