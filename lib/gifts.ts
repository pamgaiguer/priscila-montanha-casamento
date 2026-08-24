export const MIN_PLAYFUL_GIFT_PRICE = 7500;
export const MIN_TEST_GIFT_PRICE = 50;
export const TEST_GIFT_IDS = [39, 40] as const;

export const giftItems = [
  { id: 1, kind: "symbolic", image: "photo-1542766788-a2f588f447ee", name: "Ajude os noivos a continuarem fitness", price: 23821 },
  { id: 2, kind: "symbolic", image: "photo-1548610325-af59423f54bc", name: "Sofá para o noivo dormir após uma discussão", price: 313439 },
  { id: 3, kind: "symbolic", image: "photo-1529139574466-a303027c1d8b", name: "Lookinhos novos para a lua de mel", price: 34478 },
  { id: 4, kind: "symbolic", image: "/gifts/cozy-blanket-v2.png", name: "Cobertor para a noiva que está sempre coberta de razão", price: 15542 },
  { id: 5, kind: "symbolic", image: "photo-1561504599-f900052636b3", name: "Cueca sexy para a noite de núpcias", price: 20723 },
  { id: 6, kind: "symbolic", image: "photo-1549465220-1a8b9238cd48", name: "Só para dizer que não dei nada", price: 4383 },
  { id: 7, kind: "symbolic", image: "/gifts/hello-kitty-stove.png", name: "Cooktop de última geração", price: 43832 },
  { id: 8, kind: "symbolic", image: "photo-1517466787929-bc90951d0974", name: "Capacete para o noivo caso o kit calmante não funcione", price: 20809 },
  { id: 9, kind: "symbolic", image: "photo-1524178232363-1fb2b075b655", name: "Dar palpite sobre o casamento", price: 82893 },
  { id: 10, kind: "symbolic", image: "photo-1527529482837-4698179dc6ce", name: "Levar alguém que não foi convidado", price: 2080949 },
  { id: 11, kind: "symbolic", image: "photo-1523438885200-e635ba2c371e", name: "Taxa para a noiva não jogar o buquê para sua namorada", price: 29945 },
  { id: 12, kind: "symbolic", image: "photo-1547592180-85f173990554", name: "Primeiro almoço na casa dos noivos", price: 22796 },
  { id: 13, kind: "symbolic", image: "photo-1544787219-7f47ccb76574", name: "Kit calmante para desestressar a noiva", price: 15607 },
  { id: 14, kind: "symbolic", image: "photo-1556910103-1c02745aae4d", name: "Curso de culinária para a noiva", price: 30090 },
  { id: 15, kind: "symbolic", image: "photo-1553531384-cc64ac80f931", name: "Ajude com a taxa de mala extra para a lua de mel", price: 39116 },
  { id: 16, kind: "symbolic", image: "photo-1503376780353-7e6692767b70", name: "Seguro para o carro da noiva", price: 57798 },
  { id: 17, kind: "symbolic", image: "/gifts/wedding-therapy-chaos.png", name: "Terapia para os noivos não surtarem nos preparativos", price: 51404 },
  { id: 18, kind: "symbolic", image: "/gifts/buffet-priority.png", name: "Prioridade na fila do buffet", price: 16437 },
  { id: 19, kind: "symbolic", image: "photo-1495474472287-4d71bcdd2085", name: "Cota de café para sobreviver ao primeiro mês", price: 9876 },
  { id: 20, kind: "symbolic", image: "/gifts/honeymoon-snoring.png", name: "Licença oficial para roncar na lua de mel", price: 18654 },
  { id: 21, kind: "symbolic", image: "photo-1522869635100-9f4c5e86aa37", name: "Posse definitiva do controle remoto", price: 24990 },
  { id: 22, kind: "symbolic", image: "photo-1544197150-b99a580bb7a8", name: "Wi-Fi para evitar a primeira crise do casal", price: 18999 },
  { id: 23, kind: "symbolic", image: "photo-1565299624946-b28f40a0ae38", name: "Fundo emergencial para pedir delivery", price: 33333 },
  { id: 24, kind: "symbolic", image: "photo-1518199266791-5375a83190b7", name: "Vale-desculpa premium para usar sem moderação", price: 49900 },
  { id: 25, kind: "symbolic", image: "/gifts/bass-strings-kit.png", name: "Kit de cordas pro baixo do noivo (senão ele não trabalha)", price: 18967 },
  { id: 26, kind: "symbolic", image: "/gifts/anime-weekend-pass.png", name: "Vale fim de semana pra noiva ir à Anime Friends e/ou CCXP em SP", price: 124790 },
  { id: 27, kind: "symbolic", image: "/gifts/pepsi-zero-stock.png", name: "TODO o estoque de Pepsi Zero de todos os atacados da região", price: 9990 },
  { id: 28, kind: "symbolic", image: "/gifts/suspicious-women-manual.png", name: "Manual de reconhecimento de mulheres duvidosas", price: 7490 },
  { id: 29, kind: "real", image: "/gifts/dinnerware-set.png", name: "Jogo de pratos para a casa nova", price: 34990 },
  { id: 30, kind: "real", image: "/gifts/flatware-set.jpg", name: "Faqueiro", price: 5900 },
  { id: 31, kind: "real", image: "/gifts/bedding-set.jpg", name: "Jogo de cama", price: 15900 },
  { id: 32, kind: "real", image: "/gifts/electric-kettle.jpg", name: "Chaleira elétrica", price: 18500 },
  { id: 33, kind: "real", image: "/gifts/glassware-set.jpg", name: "Jogo de taças", price: 23800 },
  { id: 34, kind: "real", image: "/gifts/blender.jpg", name: "Liquidificador", price: 12800 },
  { id: 35, kind: "real", image: "/gifts/electric-cooker.jpg", name: "Panela elétrica", price: 28000 },
  { id: 36, kind: "real", image: "/gifts/steam-iron.jpg", name: "Ferro a vapor", price: 9900 },
  { id: 37, kind: "real", image: "/gifts/spin-mop.jpg", name: "Mop giratório", price: 9900 },
  { id: 38, kind: "real", image: "/gifts/bath-towel-set.jpg", name: "Jogo de toalhas de banho", price: 14990 },
  { id: 39, kind: "symbolic", image: null, name: "Pam Testando se deu certo", price: 50 },
  { id: 40, kind: "symbolic", image: null, name: "Pam Testando o webhook", price: 50 },
] as const;

export const isRealGift = (id: number) => giftItems.some((gift) => gift.id === id && gift.kind === "real");
export const isTestGift = (id: number) => TEST_GIFT_IDS.includes(id as 39 | 40);
