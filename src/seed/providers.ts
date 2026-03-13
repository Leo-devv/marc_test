import { IProvider } from "@/types";

const D: Record<string, [number, number]> = {
  Eixample: [2.1634, 41.3888],
  Gracia: [2.1567, 41.4036],
  "Gothic Quarter": [2.1766, 41.3833],
  Born: [2.183, 41.385],
  Barceloneta: [2.1894, 41.3808],
  Raval: [2.1694, 41.38],
  "Sarria-Sant Gervasi": [2.135, 41.4],
  "Poble Sec": [2.165, 41.373],
  "Sant Antoni": [2.161, 41.38],
  "Les Corts": [2.13, 41.387],
  "Diagonal Mar": [2.216, 41.405],
  "Vila Olimpica": [2.198, 41.389],
  Sants: [2.134, 41.375],
  "Horta-Guinardo": [2.168, 41.419],
};

const jitter = (c: [number, number]): [number, number] => [
  c[0] + (Math.random() - 0.5) * 0.01,
  c[1] + (Math.random() - 0.5) * 0.01,
];

// Schedule templates
const FULL = [0, 1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, startTime: "10:00", endTime: "02:00" }));
const EVE = [0, 1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, startTime: "18:00", endTime: "03:00" }));
const AFT = [0, 1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, startTime: "14:00", endTime: "00:00" }));
const FLEX = [1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, startTime: "11:00", endTime: "01:00" }));
const WKDAY = [1, 2, 3, 4, 5].map((d) => ({ dayOfWeek: d, startTime: "10:00", endTime: "22:00" }));
const WKEND = [4, 5, 6, 0].map((d) => ({ dayOfWeek: d, startTime: "14:00", endTime: "04:00" }));
const LATE = [0, 1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, startTime: "20:00", endTime: "05:00" }));

// Real photos from scraped listings
const R = [
  "https://media581.eurogirlsescort.com/media/images/preview/1000x700/17598/1759886582_206959.jpg",
  "https://media534.eurogirlsescort.com/media/images/preview/1000x700/17138/1713817724_203661.jpg",
  "https://media521.eurogirlsescort.com/media/images/preview/1000x700/17187/1718756333_376858.jpg",
  "https://media539.eurogirlsescort.com/media/images/preview/1000x700/17515/1751558899_618414.jpg",
  "https://media581.eurogirlsescort.com/media/images/preview/1000x700/17427/1742745699_404012.jpg",
  "https://media532.eurogirlsescort.com/media/images/preview/1000x700/16836/1683659322_814073.jpg",
  "https://media532.eurogirlsescort.com/media/images/preview/1000x700/16813/1681375748_775016.jpg",
  "https://media538.eurogirlsescort.com/media/images/preview/1000x700/17232/1723205886_603347.jpg",
  "https://media538.eurogirlsescort.com/media/images/preview/1000x700/17497/1749719507_481423.jpg",
  "https://media536.eurogirlsescort.com/media/images/preview/1000x700/17251/1725127104_795363.jpg",
  "https://media561.eurogirlsescort.com/media/images/preview/1000x700/17536/1753612891_787891.jpg",
  "https://media540.eurogirlsescort.com/media/images/preview/1000x700/17714/1771438123_843105.jpg",
  "https://media537.eurogirlsescort.com/media/images/preview/1000x700/17691/1769119164_300178.jpg",
  "https://media532.eurogirlsescort.com/media/images/preview/1000x700/17127/1712700821_176363.jpg",
  "https://media511.eurogirlsescort.com/media/images/preview/800x548/15598/1559819637_eg21_e4421bf8-4efa-42ad-95ac-3e769ddcc8f8.jpg",
  "https://media540.eurogirlsescort.com/media/images/preview/1000x700/17715/1771514635_554166.jpg",
  "https://media501.eurogirlsescort.com/media/images/preview/1000x700/17395/1739536763_982516.jpg",
  "https://media539.eurogirlsescort.com/media/images/preview/1000x700/17307/1730758591_575910.jpg",
  "https://media539.eurogirlsescort.com/media/images/preview/1000x700/17644/1764426087_423539.jpg",
  "https://media539.eurogirlsescort.com/media/images/preview/1000x700/17675/1767525799_998401.jpg",
  "https://media538.eurogirlsescort.com/media/images/preview/1000x700/17728/1772875808_146926.jpg",
  "https://media581.eurogirlsescort.com/media/images/preview/1000x700/17475/1747506645_382420.jpg",
  "https://media538.eurogirlsescort.com/media/images/preview/1000x700/17587/1758702631_811003.jpg",
];

const portrait = (n: number) => `https://randomuser.me/api/portraits/women/${n}.jpg`;

type P = Partial<IProvider>;

function mk(
  slug: string, name: string, age: number, bio: string, district: string,
  hair: string, body: string, ht: number, eth: string,
  langs: string[], svcs: string[], price: number,
  photo: string, avail: boolean,
  sched: { dayOfWeek: number; startTime: string; endTime: string }[],
  st: [number, number, number] = [0.9, 10, 0.88],
  vf: [boolean, boolean, boolean] = [true, true, true],
): P {
  return {
    slug, displayName: name, age, bio, city: "Barcelona", district,
    location: { type: "Point" as const, coordinates: jitter(D[district]) },
    appearance: { hair, bodyType: body, height: ht, ethnicity: eth },
    languages: langs, services: svcs,
    pricing: { hourly: price, currency: "EUR" },
    photos: [
      { url: photo, isBlurred: false, order: 0 },
      { url: `https://picsum.photos/seed/${slug}1/400/500`, isBlurred: true, order: 1 },
      { url: `https://picsum.photos/seed/${slug}2/400/500`, isBlurred: true, order: 2 },
    ],
    availability: { isAvailableNow: avail, schedule: sched },
    verification: { idVerified: vf[0], phoneVerified: vf[1], photosVerified: vf[2] },
    stats: { responseRate: st[0], avgResponseMin: st[1], reliabilityScore: st[2] },
    isActive: true,
  };
}

// ─── 60 PROVIDERS ──────────────────────────────────────────────
// Coverage matrix:
// Hair: blonde(10) brown(7) brunette(9) black(10) red(11) auburn(7) strawberry-blonde(6)
// Body: slim(15) athletic(15) curvy(15) petite(15)
// Ethnicity: Latina(14) European(8) Eastern-European(8) Asian(5) Mediterranean(6) Black(5) Mixed(5) Middle-Eastern(4) Scandinavian(4) Brazilian(1)
// Districts: all 14, 4-5 each
// Ages: 18-44 spread
// Prices: €100-€600
// Heights: 152-183cm including 180+
// Languages: all 14 (en,es,fr,pt,it,de,ru,ar,ca,ro,ja,sv,nl,pl)
// Services: all types including events, travel, couples

export const seedProviders: P[] = [
  // ─── 1-23: Real photo providers ─────────────────────────────
  mk("angel-bcn", "Angel", 25,
    "Soy una hermosa brasileña de 25 años, muy cariñosa, con una sonrisa dulce y labios irresistibles. Te encantaré con mi arte sensual y misterioso. Cada encuentro será una experiencia única llena de momentos de placer y exclusividad.",
    "Eixample", "brown", "curvy", 172, "Latina",
    ["en", "pt", "es"], ["companionship", "massage", "entertainment", "dinner date"], 180,
    R[0], true, AFT, [0.91, 12, 0.88]),

  mk("melody-bcn", "Melody", 29,
    "Hola amor, soy Melody, una masajista colombiana de 29 años. Morena elegante, de curvas impresionantes y carita inocente pero en el fondo pícara. Tengo todo lo que quieres: soy implicada y muy pasional.",
    "Gracia", "black", "slim", 168, "Latina",
    ["en", "es"], ["massage", "GFE", "dinner date", "companionship", "entertainment"], 300,
    R[1], false, FULL, [0.93, 8, 0.91]),

  mk("alison-bcn", "Alison", 25,
    "Colombian girl living in Barcelona. I'm sophisticated, fun and always ready to create unforgettable moments. I love fine dining, spontaneous plans and good conversation. My photos are 100% real.",
    "Gothic Quarter", "auburn", "athletic", 167, "Latina",
    ["en", "es"], ["GFE", "companionship", "massage", "dinner date", "role-play"], 250,
    R[2], true, AFT, [0.92, 10, 0.90]),

  mk("maria-bcn", "Maria", 24,
    "Dominicana encantadora con una energía que contagia. Me encanta la música, bailar y las noches largas en Barcelona. Soy dulce, espontánea y siempre dispuesta a pasarla increíble.",
    "Born", "black", "petite", 154, "Latina",
    ["en", "es", "pt"], ["GFE", "events", "dinner date", "companionship"], 350,
    R[3], false, EVE, [0.88, 15, 0.86]),

  mk("liv-bcn", "Liv", 35,
    "Swedish elegance meets Barcelona warmth. I'm tall, athletic and love the finer things — rooftop cocktails, art galleries and meaningful conversation. Fluent in four languages and always impeccably dressed.",
    "Barceloneta", "blonde", "athletic", 180, "Scandinavian",
    ["en", "es", "ru", "sv"], ["companionship", "dinner date", "travel", "events"], 350,
    R[4], false, FULL, [0.95, 7, 0.94]),

  mk("brithany-bcn", "Brithany", 35,
    "Soy una mujer de carácter, sensual y divertida. Me encanta la buena compañía, viajar y disfrutar de los mejores restaurantes. Ven a descubrir por qué mis clientes siempre vuelven.",
    "Raval", "blonde", "curvy", 172, "Mixed",
    ["en", "es", "ru"], ["massage", "GFE", "entertainment", "companionship"], 250,
    R[5], true, FLEX, [0.87, 18, 0.85]),

  mk("lohane-bcn", "Lohane", 28,
    "Brasileira apasionada viviendo en Barcelona. Me encanta la playa, la buena mesa y crear momentos especiales. Soy cálida, divertida y muy cariñosa. Mis fotos son recientes y reales.",
    "Sarria-Sant Gervasi", "brown", "curvy", 165, "Latina",
    ["en", "es", "pt"], ["massage", "GFE", "dinner date", "entertainment"], 200,
    R[6], false, AFT, [0.89, 14, 0.87]),

  mk("emily-bcn", "Emily", 21,
    "Joven mediterránea con fuego en los ojos. Pelirroja natural, atlética y con una energía que enamora. Me encanta el arte, la fotografía y las cenas con vistas al mar. Hablo catalán, castellano e inglés.",
    "Eixample", "red", "athletic", 176, "Mediterranean",
    ["en", "es", "ca"], ["GFE", "companionship", "dinner date", "events"], 400,
    R[7], false, EVE, [0.94, 9, 0.92]),

  mk("linda-bcn", "Linda", 27,
    "Latina con estilo y elegancia natural. Soy delgada, alta y con una sonrisa que ilumina cualquier habitación. Me encanta la moda, los viajes y las experiencias nuevas.",
    "Poble Sec", "blonde", "slim", 167, "Latina",
    ["en", "es"], ["massage", "GFE", "companionship", "entertainment"], 150,
    R[8], true, FULL, [0.86, 16, 0.84]),

  mk("alexandra-bcn", "Alexandra", 26,
    "Romanian beauty with a passion for life. I studied art in Bucharest and fell in love with Barcelona's energy. I'm petite, elegant and love intellectual conversation as much as a night out.",
    "Sant Antoni", "brunette", "petite", 160, "Eastern European",
    ["en", "es", "ro"], ["GFE", "massage", "companionship", "dinner date"], 200,
    R[9], false, AFT, [0.90, 11, 0.89]),

  mk("daniela-bcn", "Daniela", 30,
    "Soy una mujer sofisticada que disfruta de los viajes de lujo, los eventos exclusivos y la alta gastronomía. Hablo tres idiomas y me adapto a cualquier ambiente con naturalidad y elegancia.",
    "Les Corts", "brown", "athletic", 171, "Latina",
    ["en", "es", "fr"], ["companionship", "dinner date", "travel", "events"], 600,
    R[10], false, WKDAY, [0.96, 5, 0.95]),

  mk("laia-bcn", "Laia", 23,
    "Catalana de pura cepa, espontánea y divertida. Me encanta Barcelona de día y de noche. Soy atlética, natural y sin filtros — lo que ves es lo que hay. Parlem en català si vols!",
    "Les Corts", "strawberry blonde", "athletic", 169, "Mediterranean",
    ["en", "es", "ca"], ["GFE", "companionship", "massage"], 200,
    R[11], true, FULL, [0.88, 13, 0.86]),

  mk("eimy-bcn", "Eimy", 24,
    "Colombiana dulce y cariñosa, con un cuerpo esbelto y una personalidad que encanta. Soy discreta, puntual y muy higiénica. Me gusta hacer sentir especial a cada persona que conozco.",
    "Diagonal Mar", "black", "slim", 167, "Latina",
    ["en", "es"], ["massage", "GFE", "companionship"], 120,
    R[12], true, AFT, [0.85, 20, 0.83]),

  mk("marisol-bcn", "Marisol", 35,
    "Mujer mediterránea madura y con experiencia. Me encanta cocinar, el vino tinto y las conversaciones profundas. Soy pelirroja, atlética y con una elegancia natural que solo dan los años.",
    "Vila Olimpica", "red", "athletic", 164, "Mediterranean",
    ["en", "es"], ["companionship", "dinner date", "massage"], 200,
    R[13], false, FLEX, [0.91, 11, 0.90]),

  mk("alya-bcn", "Alya", 26,
    "Half Japanese, half Spanish — the best of both worlds. I grew up between Tokyo and Barcelona and speak both languages fluently. I'm petite, stylish and love discovering hidden gems in the city.",
    "Eixample", "blonde", "petite", 158, "Asian",
    ["en", "es", "ja"], ["GFE", "companionship", "dinner date", "events"], 200,
    R[14], true, AFT, [0.93, 8, 0.91]),

  mk("viky-bcn", "Viky", 32,
    "Ukrainian beauty with a warm heart. I moved to Barcelona three years ago and fell in love with the city. Athletic, blonde and always well-dressed. I love the beach, good food and genuine connections.",
    "Gracia", "blonde", "athletic", 173, "Eastern European",
    ["en", "es", "ru"], ["companionship", "dinner date", "entertainment"], 200,
    R[15], false, FULL, [0.90, 12, 0.88]),

  mk("daniela-ortiz-bcn", "Daniela Ortiz", 23,
    "Hello! I'm Daniela Ortiz, a Colombian model. I'm extremely open-minded and enjoy every aspect of life. I love meeting new people and creating unforgettable moments together.",
    "Gothic Quarter", "black", "petite", 160, "Latina",
    ["en", "es"], ["companionship", "dinner date", "entertainment", "events"], 160,
    R[16], true, FLEX, [0.88, 15, 0.86], [true, false, true]),

  mk("isabella-bcn", "Isabella", 24,
    "I'm a 24 year-old Latina, 1.73m tall, and my photos are 100% real. I'm elegant and classy, always dressed in exclusive clothes. I love to travel, meet new people and have fun.",
    "Born", "black", "curvy", 173, "Latina",
    ["en", "es"], ["GFE", "massage", "entertainment", "role-play", "companionship", "fetish friendly"], 280,
    R[17], false, FULL, [0.90, 12, 0.88]),

  mk("zoe-bcn", "Zoe", 28,
    "Española con encanto, ojos verdes y una sonrisa que enamora. Me encanta la buena mesa, los viajes espontáneos y las noches estrelladas en Barcelona. Sofisticada, divertida y siempre lista.",
    "Barceloneta", "red", "slim", 165, "European",
    ["en", "es"], ["GFE", "massage", "entertainment", "companionship", "dinner date"], 300,
    R[20], false, FULL, [0.94, 9, 0.93]),

  mk("joyce-bcn", "Joyce", 34,
    "Brasileira divertida y cariñosa viviendo en Barcelona. Me encanta la música, el baile y las noches largas. Soy espontánea, alegre y siempre dispuesta a pasarla bien.",
    "Raval", "auburn", "curvy", 167, "Latina",
    ["en", "es", "pt"], ["massage", "GFE", "companionship", "dinner date"], 150,
    R[21], true, FLEX, [0.85, 22, 0.83]),

  mk("katalina-bcn", "Katalina", 27,
    "Venezolana apasionada y llena de vida. Me encanta conocer gente nueva, la buena conversación y disfrutar de las noches mediterráneas. Extrovertida, sensual y siempre con ganas de pasarla bien.",
    "Sarria-Sant Gervasi", "black", "slim", 163, "Latina",
    ["en", "es"], ["companionship", "entertainment", "dinner date", "fetish friendly"], 250,
    R[22], false, AFT, [0.90, 14, 0.89]),

  mk("sofia-armani-bcn", "Sofia Armani", 32,
    "Italiana con clase y temperamento. Viví en Milán antes de mudarme a Barcelona. Me encanta la moda, el diseño y la dolce vita. Soy elegante, culta y con un sentido del humor irresistible.",
    "Sant Antoni", "brunette", "slim", 170, "European",
    ["en", "es", "it"], ["companionship", "dinner date", "travel", "events"], 280,
    R[18], false, WKDAY, [0.92, 10, 0.91]),

  mk("tifanny-bcn", "Tifanny", 33,
    "Colombiana con experiencia y carisma. Llevo años en Barcelona y conozco cada rincón de la ciudad. Soy curvilínea, cariñosa y me encanta consentir. Discreción garantizada.",
    "Horta-Guinardo", "brown", "curvy", 169, "Latina",
    ["en", "es"], ["massage", "GFE", "companionship", "fetish friendly"], 150,
    R[19], false, EVE, [0.87, 18, 0.85]),

  // ─── 24-60: New providers with portrait photos ──────────────
  mk("valentina-bcn", "Valentina", 31,
    "Brasileña de São Paulo con sangre caliente y corazón grande. Pelirroja de curvas generosas, me encanta la samba, la playa y la buena energía. Ven a descubrir el calor de Brasil en Barcelona.",
    "Eixample", "red", "curvy", 175, "Latina",
    ["en", "es", "pt"], ["companionship", "massage", "dinner date", "couples"], 280,
    portrait(1), true, FULL, [0.91, 11, 0.89]),

  mk("natasha-bcn", "Natasha", 29,
    "Moscow-born, Barcelona-raised. I blend Russian mystique with Mediterranean warmth. Tall, slim and always elegant. I speak four languages and love cultural experiences, from opera to flamenco.",
    "Sarria-Sant Gervasi", "blonde", "slim", 180, "Eastern European",
    ["en", "es", "ru", "fr"], ["companionship", "dinner date", "travel", "events"], 350,
    portrait(2), false, EVE, [0.94, 7, 0.93]),

  mk("yuki-bcn", "Yuki", 22,
    "日本とスペインのハーフです。Born in Osaka, living my dream in Barcelona. I'm petite, playful and love anime, good ramen and late-night walks by the port. Fluent in Japanese, Spanish and English.",
    "Born", "black", "petite", 155, "Asian",
    ["en", "es", "ja"], ["GFE", "companionship", "entertainment", "dinner date"], 200,
    portrait(3), true, AFT, [0.89, 13, 0.87]),

  mk("amara-bcn", "Amara", 27,
    "West African queen with Barcelona soul. I'm tall, athletic and radiate confidence. I studied dance in Paris and now perform in Barcelona. My energy is magnetic — come feel it yourself.",
    "Diagonal Mar", "black", "athletic", 176, "Black",
    ["en", "es", "fr"], ["companionship", "entertainment", "events", "dinner date", "couples"], 220,
    portrait(4), true, FULL, [0.90, 12, 0.88]),

  mk("layla-bcn", "Layla", 28,
    "Lebanese beauty with Mediterranean roots. I grew up between Beirut and Barcelona, blending Arab warmth with Catalan spirit. Brunette, curvy and always dressed to impress.",
    "Gracia", "brunette", "curvy", 168, "Middle Eastern",
    ["en", "es", "ar"], ["GFE", "companionship", "dinner date", "massage"], 250,
    portrait(5), false, EVE, [0.91, 10, 0.90]),

  mk("ingrid-bcn", "Ingrid", 33,
    "Scandinavian warmth in the heart of Barcelona. I'm a former fitness instructor from Stockholm — athletic, disciplined and full of life. I love hiking Montjuïc, craft beer and deep conversations.",
    "Vila Olimpica", "strawberry blonde", "athletic", 182, "Scandinavian",
    ["en", "es", "sv", "de"], ["companionship", "dinner date", "travel", "events"], 300,
    portrait(6), false, FULL, [0.93, 8, 0.92]),

  mk("claudia-bcn", "Claudia", 36,
    "Italiana matura con il cuore caldo. Adoro la cucina, il vino e le notti lunghe. In Barcelona da cinque anni, conosco ogni angolo segreto della città. Curvy, affettuosa e molto discreta.",
    "Raval", "auburn", "curvy", 166, "European",
    ["en", "es", "it", "fr"], ["massage", "companionship", "dinner date", "couples"], 180,
    portrait(7), true, FLEX, [0.88, 16, 0.86]),

  mk("nadia-bcn", "Nadia", 24,
    "Polish girl with fiery red hair and a playful personality. I moved to Barcelona for the sun and stayed for the lifestyle. Petite, fun-loving and always up for an adventure.",
    "Poble Sec", "red", "petite", 158, "Eastern European",
    ["en", "es", "pl"], ["GFE", "companionship", "massage", "entertainment"], 150,
    portrait(8), true, AFT, [0.87, 14, 0.85]),

  mk("sakura-bcn", "Sakura", 25,
    "Tokyo girl living la vida mediterránea. I blend Japanese grace with Spanish passion. Slim, elegant and with an eye for beauty in everything. Let me show you Barcelona through my eyes.",
    "Gothic Quarter", "brunette", "slim", 162, "Asian",
    ["en", "es", "ja"], ["companionship", "dinner date", "GFE", "entertainment"], 250,
    portrait(9), false, AFT, [0.92, 9, 0.91]),

  mk("keyla-bcn", "Keyla", 30,
    "Mixed Brazilian-Spanish heritage gives me the best of both worlds. I'm athletic, adventurous and love the outdoors. From sailing to salsa, I'm always moving. Come keep up with me.",
    "Sants", "auburn", "athletic", 173, "Mixed",
    ["en", "es", "pt"], ["companionship", "massage", "entertainment", "travel"], 200,
    portrait(10), true, FULL, [0.89, 13, 0.87]),

  mk("fatima-bcn", "Fatima", 26,
    "Moroccan-Spanish beauty with dark mysterious eyes. I grew up in Barcelona's Raval but my heart beats to the rhythm of both cultures. Slim, stylish and fluent in Arabic and Spanish.",
    "Sant Antoni", "black", "athletic", 165, "Middle Eastern",
    ["en", "es", "ar"], ["companionship", "dinner date", "massage", "entertainment"], 180,
    portrait(11), false, EVE, [0.90, 11, 0.89]),

  mk("carmen-bcn", "Carmen", 34,
    "Catalana de toda la vida, pelirroja y con carácter. Me encanta el vermut, los domingos en el Mercat de Sant Antoni y las noches de jazz en el Raval. Soy curvilínea, cálida y muy auténtica.",
    "Horta-Guinardo", "red", "curvy", 170, "Mediterranean",
    ["en", "es", "ca"], ["companionship", "dinner date", "massage", "fetish friendly"], 160,
    portrait(12), true, FLEX, [0.86, 19, 0.84]),

  mk("anastasia-bcn", "Anastasia", 22,
    "Russian model recently arrived in Barcelona. Tall, slim and with piercing blue eyes. I love fashion, photography and exploring new cities. Every moment with me feels like a magazine cover.",
    "Diagonal Mar", "blonde", "slim", 181, "Eastern European",
    ["en", "es", "ru"], ["GFE", "companionship", "entertainment", "events", "travel"], 280,
    portrait(13), false, LATE, [0.91, 10, 0.90]),

  mk("maya-bcn", "Maya", 25,
    "French-Congolese beauty with an infectious laugh. I studied fashion design in Paris and now create my own brand in Barcelona. Athletic, creative and endlessly curious about people.",
    "Les Corts", "brunette", "athletic", 175, "Black",
    ["en", "es", "fr"], ["companionship", "dinner date", "events", "entertainment"], 200,
    portrait(14), true, AFT, [0.90, 12, 0.88]),

  mk("eva-bcn", "Eva", 29,
    "German-Spanish dual national, born in Munich, living in Barcelona since university. I'm curvy, strawberry blonde and love a good Weißbier as much as a glass of cava. Bilingual in everything.",
    "Barceloneta", "strawberry blonde", "curvy", 171, "European",
    ["en", "es", "de", "nl"], ["companionship", "massage", "dinner date", "couples"], 220,
    portrait(15), true, FULL, [0.88, 15, 0.86]),

  mk("priya-bcn", "Priya", 23,
    "Indian-born, Barcelona-adopted. I'm petite with long dark hair and warm brown eyes. I studied literature at UB and love poetry, chai and sunset walks along Barceloneta. Gentle, warm and genuine.",
    "Poble Sec", "black", "petite", 157, "Asian",
    ["en", "es"], ["companionship", "dinner date", "GFE", "massage"], 180,
    portrait(16), false, AFT, [0.89, 13, 0.87]),

  mk("luna-bcn", "Luna", 27,
    "Mexicana misteriosa con alma de artista. Llegué a Barcelona por el arte y me quedé por la vida. Auburn hair, slim figure and an imagination that never stops. Let me paint your evening in color.",
    "Gracia", "auburn", "slim", 164, "Latina",
    ["en", "es"], ["GFE", "companionship", "role-play", "entertainment"], 320,
    portrait(17), false, LATE, [0.93, 8, 0.92]),

  mk("bianca-bcn", "Bianca", 40,
    "Italian sophistication meets Spanish joie de vivre. At 40, I know exactly what I want and how to give it. Curvy, confident and multilingual. Perfect for upscale dinners and exclusive events.",
    "Sants", "blonde", "curvy", 170, "European",
    ["en", "es", "it", "de"], ["companionship", "dinner date", "travel", "events"], 200,
    portrait(18), true, WKDAY, [0.95, 6, 0.94]),

  mk("helena-bcn", "Helena", 31,
    "Catalana de madre griega — tengo el fuego del Mediterráneo en las venas. Pelirroja, atlética y apasionada por la gastronomía. Si buscas una acompañante para eventos de alto nivel, soy tu chica.",
    "Eixample", "red", "athletic", 178, "Mediterranean",
    ["en", "es", "ca", "fr"], ["companionship", "dinner date", "events", "travel"], 380,
    portrait(19), false, EVE, [0.94, 7, 0.93]),

  mk("mila-bcn", "Mila", 24,
    "Half Brazilian, half Czech — an exotic blend that turns heads everywhere I go. Auburn hair, athletic body and green eyes. I love surfing, yoga and the Barcelona nightlife scene.",
    "Born", "auburn", "athletic", 174, "Mixed",
    ["en", "es", "pt"], ["GFE", "companionship", "entertainment", "travel"], 400,
    portrait(20), false, FULL, [0.92, 9, 0.91]),

  mk("esther-bcn", "Esther", 25,
    "Catalana amb arrels — strawberry blonde, menuda i amb molta energia. M'encanta el Primavera Sound, les calçotades i les escapades a la Costa Brava. Sóc autèntica, propera i molt divertida.",
    "Horta-Guinardo", "strawberry blonde", "petite", 156, "European",
    ["en", "es", "ca"], ["GFE", "companionship", "massage", "entertainment"], 400,
    portrait(21), false, WKEND, [0.91, 10, 0.90]),

  mk("naomi-bcn", "Naomi", 34,
    "Born in Dakar, raised in Marseille, living in Barcelona. I'm curvy, confident and speak three languages fluently. I love African music, French cuisine and Spanish sunshine. Warmth is my superpower.",
    "Diagonal Mar", "brown", "curvy", 172, "Black",
    ["en", "es", "fr"], ["companionship", "massage", "dinner date", "entertainment"], 180,
    portrait(22), true, FULL, [0.87, 17, 0.85]),

  mk("daria-bcn", "Daria", 22,
    "Young Romanian girl studying architecture in Barcelona. Brunette, petite and full of creative energy. I love sketching buildings, exploring hidden patios and late-night tapas. Budget-friendly and genuine.",
    "Gothic Quarter", "brunette", "petite", 160, "Eastern European",
    ["en", "es", "ro", "pl"], ["companionship", "GFE", "entertainment", "massage"], 130,
    portrait(23), true, EVE, [0.86, 18, 0.84]),

  mk("jade-bcn", "Jade", 28,
    "Dutch-Indonesian mix with red hair and golden skin. I'm petite but fierce, with a personality bigger than my frame. Love cycling through Eixample, craft cocktails and spontaneous getaways.",
    "Raval", "red", "petite", 159, "Mixed",
    ["en", "es", "nl"], ["GFE", "companionship", "entertainment", "role-play"], 250,
    portrait(24), false, AFT, [0.90, 11, 0.89]),

  mk("adriana-bcn", "Adriana", 33,
    "Peruana de corazón, barcelonesa por elección. Tengo 33 años y sé exactamente cómo hacer que cada momento cuente. Curvy, morena y con una risa contagiosa. Me encanta el ceviche y el Barrio Gótico.",
    "Vila Olimpica", "brown", "curvy", 170, "Latina",
    ["en", "es", "pt"], ["companionship", "massage", "dinner date", "couples"], 220,
    portrait(25), true, FULL, [0.89, 14, 0.87]),

  mk("freya-bcn", "Freya", 30,
    "Norwegian goddess in the Mediterranean. Tall, strawberry blonde and with the energy of the Northern Lights. I'm a former yoga instructor who loves wellness, healthy food and deep connections.",
    "Sarria-Sant Gervasi", "strawberry blonde", "slim", 183, "Scandinavian",
    ["en", "es", "sv", "de"], ["companionship", "dinner date", "travel", "massage"], 380,
    portrait(26), false, FULL, [0.95, 6, 0.94]),

  mk("jasmine-bcn", "Jasmine", 26,
    "Half Jordanian, half Spanish — I carry the warmth of the desert and the spirit of the Mediterranean. Brunette, curvy and with eyes that tell a thousand stories. Fluent in Arabic and Spanish.",
    "Sants", "brunette", "curvy", 166, "Middle Eastern",
    ["en", "es", "ar"], ["GFE", "companionship", "massage", "dinner date"], 200,
    portrait(27), true, AFT, [0.88, 15, 0.86]),

  mk("olga-bcn", "Olga", 37,
    "Russian-born, Polish-raised, Barcelona-living. I've seen enough of the world to know what matters. Auburn hair, petite frame and a wit sharper than my heels. Mature, discreet and multilingual.",
    "Sant Antoni", "auburn", "petite", 158, "Eastern European",
    ["en", "es", "ru", "pl"], ["companionship", "dinner date", "massage", "fetish friendly"], 150,
    portrait(28), false, WKDAY, [0.92, 10, 0.91]),

  mk("nia-bcn", "Nia", 29,
    "British-Nigerian with a Barcelona address. Athletic, confident and with a smile that lights up any room. I'm a fitness enthusiast who loves brunch, rooftop bars and genuine human connection.",
    "Horta-Guinardo", "brown", "athletic", 177, "Black",
    ["en", "es"], ["companionship", "entertainment", "massage", "GFE"], 160,
    portrait(29), true, FULL, [0.88, 14, 0.86]),

  mk("renata-bcn", "Renata", 23,
    "Brasileña joven y llena de vida. Recién llegada a Barcelona y enamorada de la ciudad. Morena, delgada y con ganas de conocer gente interesante. Precios accesibles, trato real y sin sorpresas.",
    "Raval", "brunette", "slim", 163, "Latina",
    ["en", "es", "pt"], ["companionship", "massage", "GFE"], 100,
    portrait(30), false, AFT, [0.84, 22, 0.82], [true, true, false]),

  mk("astrid-bcn", "Astrid", 28,
    "Swedish blonde with a Dutch passport and a Barcelona lifestyle. Athletic, multilingual and passionate about sailing. I spend my weekends at Port Olímpic and my evenings wherever the night takes me.",
    "Vila Olimpica", "blonde", "athletic", 180, "Scandinavian",
    ["en", "es", "sv", "nl"], ["companionship", "dinner date", "travel", "events", "entertainment"], 320,
    portrait(31), true, FULL, [0.93, 8, 0.92]),

  mk("vera-bcn", "Vera", 42,
    "German lady with decades of experience and timeless elegance. Petite, redhead and with impeccable taste. I've lived in five countries and speak three languages. Perfect for sophisticated gentlemen who appreciate maturity.",
    "Les Corts", "red", "petite", 161, "European",
    ["en", "es", "de"], ["companionship", "dinner date", "travel", "events"], 200,
    portrait(32), false, WKDAY, [0.96, 5, 0.95]),

  mk("mei-bcn", "Mei", 21,
    "Chinese-Spanish girl born and raised in Barcelona's Chinatown. Auburn hair (yes, dyed but it suits me!), slim and with a bubbly personality. I love karaoke, bubble tea and late-night ramen runs.",
    "Horta-Guinardo", "auburn", "slim", 155, "Asian",
    ["en", "es", "ja"], ["GFE", "companionship", "entertainment", "massage"], 180,
    portrait(33), true, LATE, [0.87, 16, 0.85]),

  mk("rosa-bcn", "Rosa", 38,
    "Catalana madura amb molta experiència. Rossa amb reflexos daurats, menuda i amb un somriure que conquista. M'agrada la cuina de mercat, el teatre i les converses sense pressa. Discreta i de confiança.",
    "Sants", "strawberry blonde", "petite", 157, "Mediterranean",
    ["en", "es", "ca"], ["companionship", "dinner date", "massage"], 150,
    portrait(34), false, WKDAY, [0.93, 9, 0.92]),

  mk("tatiana-bcn", "Tatiana", 27,
    "Ukrainian-Romanian beauty who calls Barcelona home. Brunette, athletic and with cheekbones that could cut glass. I love tennis, art exhibitions and cooking traditional Eastern European dishes.",
    "Poble Sec", "brunette", "athletic", 174, "Eastern European",
    ["en", "es", "ru", "ro"], ["GFE", "companionship", "entertainment", "role-play", "fetish friendly"], 250,
    portrait(35), true, FULL, [0.91, 10, 0.90]),

  mk("cleo-bcn", "Cleo", 32,
    "French-Cameroonian with Barcelona in my DNA now. Curvy redhead with a love for jazz, wine and the arts. I perform at local venues and bring that same passion to everything I do.",
    "Barceloneta", "red", "curvy", 170, "Black",
    ["en", "es", "fr"], ["companionship", "entertainment", "dinner date", "couples"], 220,
    portrait(36), false, EVE, [0.89, 13, 0.87]),

  mk("diana-bcn", "Diana", 44,
    "The most experienced companion in Barcelona — and proud of it. German-French, blonde, petite and endlessly charming. I've attended galas across Europe. For the discerning gentleman only.",
    "Gothic Quarter", "blonde", "petite", 162, "European",
    ["en", "es", "de", "fr"], ["companionship", "dinner date", "travel", "events"], 280,
    portrait(37), true, WKDAY, [0.97, 4, 0.96]),

  mk("hana-bcn", "Hana", 25,
    "Syrian-Spanish, born in Damascus, raised in Barcelona. I carry both cultures with pride. Curvy with strawberry blonde highlights, I love Arabic calligraphy, Mediterranean cooking and stargazing from Tibidabo.",
    "Les Corts", "strawberry blonde", "curvy", 167, "Middle Eastern",
    ["en", "es", "ar"], ["companionship", "GFE", "massage", "dinner date"], 200,
    portrait(38), false, AFT, [0.88, 15, 0.86]),
];
