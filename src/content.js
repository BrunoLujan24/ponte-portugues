/* ===================== CONTENIDO ===================== */
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const LEVEL_INFO = {
  A1: { words: 600, name: 'Principiante' },
  A2: { words: 1200, name: 'Básico' },
  B1: { words: 2200, name: 'Intermedio' },
  B2: { words: 3800, name: 'Intermedio alto' }
};

const CURRICULUM = [
  { id: 'a1-u1', level: 'A1', n: 1, title: 'Sonidos y saludos', desc: 'Pronunciación clave, saludos, pronombres (eu, você, a gente…).' },
  { id: 'a1-u2', level: 'A1', n: 2, title: 'Presentarse', desc: 'Verbo ser, nacionalidades, profesiones, números 0–100.' },
  { id: 'a1-u3', level: 'A1', n: 3, title: 'Familia y descripción', desc: 'Ter, posesivos (meu, seu, dele), género y número.' },
  { id: 'a1-u4', level: 'A1', n: 4, title: 'La casa y la ciudad', desc: 'Estar, artículos y contracciones (no, na, do, da), «tem» = hay.' },
  { id: 'a1-u5', level: 'A1', n: 5, title: 'Rutina', desc: 'Presente de verbos regulares (-ar, -er, -ir), horas y días.' },
  { id: 'a1-u6', level: 'A1', n: 6, title: 'Comida y restaurante', desc: 'Querer, gostar de, pedir y pagar.' },
  { id: 'a1-u7', level: 'A1', n: 7, title: 'Compras y ropa', desc: 'Demostrativos (este, esse, aquele, isso), precios, colores.' },
  { id: 'a1-u8', level: 'A1', n: 8, title: 'Tiempo libre', desc: 'Irregulares frecuentes (fazer, ir, poder, ver, vir), ir + infinitivo, preguntas y negación.' },
  { id: 'a2-u1', level: 'A2', n: 1, title: 'El fin de semana pasado', desc: 'Pretérito perfeito regular.' },
  { id: 'a2-u2', level: 'A2', n: 2, title: 'Viajes', desc: 'Pretérito perfeito irregular (fui, tive, fiz, estive, pude).' },
  { id: 'a2-u3', level: 'A2', n: 3, title: 'Cuando era niño', desc: 'Pretérito imperfeito y contraste con el perfeito.' },
  { id: 'a2-u4', level: 'A2', n: 4, title: 'Salud y cuerpo', desc: 'Doer, ter que, precisar, consejos básicos.' },
  { id: 'a2-u5', level: 'A2', n: 5, title: 'Transporte y direcciones', desc: 'Imperativo, por/para, pelo/pela.' },
  { id: 'a2-u6', level: 'A2', n: 6, title: 'Comparaciones', desc: 'Comparativos, superlativos, -íssimo.' },
  { id: 'a2-u7', level: 'A2', n: 7, title: 'Relaciones', desc: 'Pronombres de objeto (o, a, lhe, me, te) y su uso coloquial en Brasil («vi ele»).' },
  { id: 'a2-u8', level: 'A2', n: 8, title: 'Experiencias', desc: 'Já, ainda não y el pretérito perfeito composto (tenho feito), que no equivale al «he hecho».' },
  { id: 'b1-u1', level: 'B1', n: 1, title: 'Opiniones', desc: 'Achar que, conectores (porém, então, aliás), acuerdo y desacuerdo.' },
  { id: 'b1-u2', level: 'B1', n: 2, title: 'Deseos y consejos', desc: 'Presente do subjuntivo.' },
  { id: 'b1-u3', level: 'B1', n: 3, title: 'Emociones y dudas', desc: 'Subjuntivo con emociones, talvez, embora.' },
  { id: 'b1-u4', level: 'B1', n: 4, title: 'Condiciones futuras', desc: 'Futuro do subjuntivo (quando eu for, se você puder).' },
  { id: 'b1-u5', level: 'B1', n: 5, title: 'Hipótesis', desc: 'Futuro do pretérito e imperfeito do subjuntivo (se eu tivesse…, eu faria…).' },
  { id: 'b1-u6', level: 'B1', n: 6, title: 'Noticias', desc: 'Voz pasiva y «se» impersonal.' },
  { id: 'b1-u7', level: 'B1', n: 7, title: 'Relatos', desc: 'Mais-que-perfeito (tinha feito) y discurso indirecto básico.' },
  { id: 'b1-u8', level: 'B1', n: 8, title: 'Planes y problemas', desc: 'Infinitivo pessoal (para nós fazermos, antes de eles chegarem).' },
  { id: 'b2-u1', level: 'B2', n: 1, title: 'Debate', desc: 'Conectores avanzados (no entanto, contudo, apesar de, à medida que).' },
  { id: 'b2-u2', level: 'B2', n: 2, title: 'Trabajo', desc: 'Registro formal e informal, correos y entrevistas.' },
  { id: 'b2-u3', level: 'B2', n: 3, title: 'Sociedad y medio ambiente', desc: 'Vocabulario abstracto y nominalización.' },
  { id: 'b2-u4', level: 'B2', n: 4, title: 'Hipótesis en el pasado', desc: 'Se eu tivesse sabido, eu teria feito.' },
  { id: 'b2-u5', level: 'B2', n: 5, title: 'Discurso indirecto avanzado', desc: 'Discurso indirecto avanzado y correlación de tiempos.' },
  { id: 'b2-u6', level: 'B2', n: 6, title: 'Habla real', desc: 'Reducciones (tá, pra, cê, né), muletillas, diferencias entre escrito y oral.' },
  { id: 'b2-u7', level: 'B2', n: 7, title: 'Expresiones idiomáticas', desc: 'Expresiones idiomáticas, humor e ironía.' },
  { id: 'b2-u8', level: 'B2', n: 8, title: 'Portugués escrito formal', desc: 'Colocación formal de pronombres (ênclise, mesóclise) para reconocerla en textos.' }
];

const TAG_LABEL = {
  'nasal': 'Vocal nasal', 'abierta': 'Vocal abierta', 'cerrada': 'Vocal cerrada', 'final-e': '-e final = i',
  'final-o': '-o final = u', 'ti-di': 'ti / di = chi / dʒi', 'r': 'r inicial / rr', 'lh': 'lh', 'nh': 'nh = ñ', 's-z': 's = z'
};

const V = (id, pt, es, ex, exEs, o) => Object.assign({ id, pt, es, ex, exEs }, o || {});

/* ---------- A1 · Unidad 1 ---------- */
const UNIT_A1U1 = {
  id: 'a1-u1', level: 'A1', n: 1, title: 'Sonidos y saludos', titlePt: 'Sons e cumprimentos',
  goals: ['Saludar y despedirte según la hora y el registro', 'Usar você, a gente, o senhor y a senhora', 'Reconocer los sonidos que más cambian respecto al español'],
  vocab: [
    V('a1-u1-v001', 'oi', 'hola', 'Oi, Ana! Tudo bem?', '¡Hola, Ana! ¿Todo bien?', { note: 'El saludo informal más común en Brasil.' }),
    V('a1-u1-v002', 'tudo bem?', '¿todo bien? / ¿qué tal?', 'Oi, Lucas! Tudo bem?', '¡Hola, Lucas! ¿Qué tal?', { kind: 'parecida', forms: ['tudo bem', 'tudo', 'bem'], note: 'Se responde igual: «Tudo bem!».' }),
    V('a1-u1-v003', 'e você?', '¿y tú? / ¿y usted?', 'Tudo bem, e você?', 'Todo bien, ¿y tú?', { forms: ['e você', 'você'], tags: ['final-e'], note: 'La «e» sola suena «i»: «i você».' }),
    V('a1-u1-v004', 'bom dia', 'buenos días', 'Bom dia, Pedro!', '¡Buenos días, Pedro!', { kind: 'parecida', tags: ['nasal', 'ti-di'], forms: ['bom dia'], note: '«Bom» es nasal: cierra los labios sin decir «m». «Dia» suena «dʒía».' }),
    V('a1-u1-v005', 'obrigado / obrigada', 'gracias', 'Obrigada, Lucas!', '¡Gracias, Lucas!', { tags: ['final-o'], forms: ['obrigado', 'obrigada'], note: 'Concuerda con quien habla: un hombre dice «obrigado» y una mujer «obrigada». La -o final suena «u».' }),
    V('a1-u1-v006', 'tchau', 'adiós / chao', 'Tchau, Ana!', '¡Adiós, Ana!', { kind: 'parecida' }),
    V('a1-u1-v007', 'até amanhã', 'hasta mañana', 'Tchau! Até amanhã.', '¡Adiós! Hasta mañana.', { tags: ['nasal'], forms: ['até amanhã', 'amanhã', 'até'], note: '«Amanhã» termina en «ã» nasal.' }),
    V('a1-u1-v008', 'ótimo', 'excelente / muy bien', 'Tudo ótimo, obrigado.', 'Todo excelente, gracias.', { kind: 'parecida', forms: ['ótimo', 'ótima'] }),
    V('a1-u1-v009', 'que bom!', '¡qué bien! / ¡qué bueno!', 'Tudo ótimo? Que bom!', '¿Todo excelente? ¡Qué bien!', { kind: 'parecida', forms: ['que bom', 'que', 'bom'] }),
    V('a1-u1-v010', 'boa tarde', 'buenas tardes', 'Boa tarde, Ana!', '¡Buenas tardes, Ana!', { kind: 'parecida', tags: ['final-e', 'ti-di'], forms: ['boa tarde', 'boa', 'tarde'], note: '«Tarde» suena «tárdʒi».' }),
    V('a1-u1-v011', 'boa noite', 'buenas noches', 'Boa noite, Lucas!', '¡Buenas noches, Lucas!', { tags: ['final-e', 'ti-di'], forms: ['boa noite', 'noite'], note: 'Sirve para saludar y para despedirse de noche. «Noite» suena «nóitʃi».' }),
    V('a1-u1-v012', 'olá', 'hola (más formal o escrito)', 'Olá, tudo bem?', 'Hola, ¿qué tal?', { kind: 'parecida' }),
    V('a1-u1-v013', 'por favor', 'por favor', 'Um café, por favor.', 'Un café, por favor.', { kind: 'parecida' }),
    V('a1-u1-v014', 'de nada', 'de nada', 'Obrigado! De nada!', '¡Gracias! ¡De nada!', { kind: 'parecida' }),
    V('a1-u1-v015', 'sim', 'sí', 'Sim, tudo bem.', 'Sí, todo bien.', { kind: 'parecida', tags: ['nasal'], note: 'La «m» final no suena: la «i» se vuelve nasal.' }),
    V('a1-u1-v016', 'não', 'no', 'Não, obrigado.', 'No, gracias.', { tags: ['nasal'], note: '«Ão» nasal: como «au» dejando salir el aire por la nariz.' }),
    V('a1-u1-v017', 'desculpa', 'perdón / disculpa', 'Desculpa, Ana!', '¡Perdón, Ana!', { kind: 'parecida', tags: ['ti-di'], note: 'Suena «dʒiskúlpa»: la «de» átona se vuelve «dʒi».' }),
    V('a1-u1-v018', 'com licença', 'con permiso', 'Com licença, por favor.', 'Con permiso, por favor.', { kind: 'parecida', tags: ['nasal'], forms: ['com licença', 'licença'] }),
    V('a1-u1-v019', 'eu', 'yo', 'Eu? Tudo ótimo!', '¿Yo? ¡Todo excelente!', { note: 'Suena «éu».' }),
    V('a1-u1-v020', 'eu sou', 'yo soy', 'Eu sou o Lucas.', 'Yo soy Lucas.', { kind: 'parecida', forms: ['eu sou', 'sou'], note: 'En Brasil es muy común poner artículo antes del nombre: «o Lucas», «a Ana».' }),
    V('a1-u1-v021', 'você', 'tú / usted', 'E você? Tudo bem?', '¿Y tú? ¿Todo bien?', { tags: ['cerrada'], note: 'Es la forma normal de decir «tú» en casi todo Brasil. Usa el verbo como «usted»: você é.' }),
    V('a1-u1-v022', 'é', 'es / eres', 'Você é o Pedro?', '¿Tú eres Pedro?', { tags: ['abierta'], note: 'É con acento agudo: «e» abierta.' }),
    V('a1-u1-v023', 'ele', 'él', 'Ele é o Pedro.', 'Él es Pedro.', { tags: ['final-e'], note: 'Suena «éli».' }),
    V('a1-u1-v024', 'ela', 'ella', 'Ela é a Helena.', 'Ella es Helena.', { tags: ['abierta'], note: 'Suena «éla», con «e» abierta.' }),
    V('a1-u1-v025', 'a gente', 'nosotros (informal)', 'Tchau! A gente se vê amanhã.', '¡Adiós! Nos vemos mañana.', { kind: 'falso', trap: 'la gente', forms: ['a gente', 'se vê'], note: 'Significa «nosotros» y lleva el verbo como «ele»: a gente é. Para «las personas» se dice «as pessoas».' }),
    V('a1-u1-v026', 'nós', 'nosotros', 'Nós somos amigos.', 'Nosotros somos amigos.', { tags: ['abierta'], forms: ['nós', 'somos'], note: 'Más formal o escrito que «a gente». Ó abierta.' }),
    V('a1-u1-v027', 'vocês', 'ustedes', 'Bom dia! Tudo bem com vocês?', '¡Buenos días! ¿Todo bien con ustedes?', { note: 'No existe «vosotros»: para varias personas siempre se usa «vocês».' }),
    V('a1-u1-v028', 'eles / elas', 'ellos / ellas', 'Eles são amigos.', 'Ellos son amigos.', { forms: ['eles', 'elas', 'são'], note: '«São» = son.' }),
    V('a1-u1-v029', 'muito prazer', 'mucho gusto', 'Muito prazer, eu sou a Ana.', 'Mucho gusto, yo soy Ana.', { tags: ['nasal'], forms: ['muito prazer', 'prazer', 'muito'], note: '«Muito» suena «múintu», con una nasal suave.' }),
    V('a1-u1-v030', 'o prazer é meu', 'el gusto es mío', 'Muito prazer! O prazer é meu.', '¡Mucho gusto! El gusto es mío.', { forms: ['o prazer é meu', 'meu'] }),
    V('a1-u1-v031', 'como vai?', '¿cómo te va? / ¿cómo estás?', 'Oi, Pedro! Como vai?', '¡Hola, Pedro! ¿Cómo te va?', { kind: 'parecida', forms: ['como vai', 'como', 'vai'] }),
    V('a1-u1-v032', 'bem', 'bien', 'Bem, obrigado. E você?', 'Bien, gracias. ¿Y tú?', { kind: 'parecida', tags: ['nasal'], note: 'Final nasal: «bẽi».' }),
    V('a1-u1-v033', 'mais ou menos', 'más o menos', 'Tudo bem? Mais ou menos.', '¿Todo bien? Más o menos.', { kind: 'parecida', forms: ['mais ou menos', 'mais', 'ou', 'menos'] }),
    V('a1-u1-v034', 'o senhor / a senhora', 'usted (señor / señora)', 'Bom dia! Como vai a senhora?', '¡Buenos días! ¿Cómo le va?', { kind: 'parecida', tags: ['nh'], forms: ['senhor', 'senhora'], note: 'Tratamiento de respeto para personas mayores o situaciones formales.' }),
    V('a1-u1-v035', 'até logo', 'hasta luego', 'Obrigada! Até logo!', '¡Gracias! ¡Hasta luego!', { kind: 'parecida', forms: ['até logo', 'logo'] }),
    V('a1-u1-v036', 'até mais', 'nos vemos / hasta luego', 'Tchau, Lucas! Até mais!', '¡Adiós, Lucas! ¡Nos vemos!', { forms: ['até mais'] }),
    V('a1-u1-v037', 'gente', 'chicos / todos (para hablarle a un grupo)', 'Oi, gente! Tudo bem?', '¡Hola a todos! ¿Todo bien?', { kind: 'parecida', tags: ['ti-di', 'final-e'], note: '«Gente» sola sirve para dirigirse a un grupo. Suena «ʒẽntʃi».' }),
    V('a1-u1-v038', 'tá bom', 'está bien / va', 'Até amanhã? Tá bom!', '¿Hasta mañana? ¡Va!', { forms: ['tá bom', 'tá'], note: 'Forma hablada de «está bom». Muy frecuente.' }),
    V('a1-u1-v039', 'legal', 'padre / genial', 'Que legal!', '¡Qué padre!', { kind: 'falso', trap: 'legal (según la ley)', note: 'En Brasil «legal» casi siempre significa «genial» o «buena onda».' }),
    V('a1-u1-v040', 'claro', 'claro', 'Claro! Tudo bem.', '¡Claro! Todo bien.', { kind: 'parecida' }),
    V('a1-u1-v041', 'um / uma', 'un / una', 'Um café e uma água, por favor.', 'Un café y un agua, por favor.', { kind: 'parecida', tags: ['nasal'], forms: ['um', 'uma'], note: '«Um» es nasal: la «m» no se pronuncia.' }),
    V('a1-u1-v042', 'o café', 'el café', 'Um café, por favor.', 'Un café, por favor.', { kind: 'parecida', tags: ['abierta'], forms: ['café', 'cafés'], note: 'La «é» final es abierta.' }),
    V('a1-u1-v043', 'a água', 'el agua', 'Uma água, por favor.', 'Un agua, por favor.', { kind: 'parecida', forms: ['água', 'águas'], note: 'Es femenino con «a»: a água. En español decimos «el agua».' }),
    V('a1-u1-v044', 'com', 'con', 'Tudo bem com você?', '¿Todo bien contigo?', { kind: 'parecida', tags: ['nasal'], note: '«Com você» = contigo.' }),
    V('a1-u1-v045', 'o leite', 'la leche', 'Um café com leite, por favor.', 'Un café con leche, por favor.', { kind: 'parecida', tags: ['final-e', 'ti-di'], forms: ['leite'], note: '«Leite» suena «léitʃi».' }),
    V('a1-u1-v046', 'o pão', 'el pan', 'Um pão e um café, por favor.', 'Un pan y un café, por favor.', { kind: 'parecida', tags: ['nasal'], forms: ['pão', 'pães'], note: '«Ão» nasal, sin «n» al final.' }),
    V('a1-u1-v047', 'a mãe', 'la mamá / la madre', 'Oi, mãe! Tudo bem?', '¡Hola, mamá! ¿Todo bien?', { tags: ['nasal'], forms: ['mãe'], note: '«Ãe» nasal: como «ai» por la nariz.' }),
    V('a1-u1-v048', 'as lições', 'las lecciones', 'As lições são ótimas.', 'Las lecciones son excelentes.', { kind: 'parecida', tags: ['nasal'], forms: ['lições', 'lição'], note: '«Ões» nasal: como «oi» por la nariz.' }),
    V('a1-u1-v049', 'a avó', 'la abuela', 'Bom dia, avó!', '¡Buenos días, abuela!', { tags: ['abierta'], forms: ['avó'], note: 'Ó abierta. Compara con «avô» (abuelo), con ô cerrada.' }),
    V('a1-u1-v050', 'o avô', 'el abuelo', 'Boa noite, avô!', '¡Buenas noches, abuelo!', { tags: ['cerrada'], forms: ['avô'], note: 'Ô cerrada, con los labios redondeados.' }),
    V('a1-u1-v051', 'a cidade', 'la ciudad', 'Que cidade linda!', '¡Qué ciudad tan bonita!', { kind: 'parecida', tags: ['ti-di', 'final-e'], forms: ['cidade'], note: '«Cidade» suena «sidádʒi».' }),
    V('a1-u1-v052', 'lindo / linda', 'bonito / bonita', 'Que dia lindo!', '¡Qué día tan bonito!', { kind: 'parecida', tags: ['nasal'], forms: ['lindo', 'linda'], note: 'Muy usado para «bonito».' }),
    V('a1-u1-v053', 'a tia', 'la tía', 'Oi, tia! Tudo bem?', '¡Hola, tía! ¿Todo bien?', { kind: 'parecida', tags: ['ti-di'], forms: ['tia'], note: '«Ti» suena «chi»: «chía».' }),
    V('a1-u1-v054', 'o carro', 'el carro / el coche', 'Que carro legal!', '¡Qué carro tan padre!', { kind: 'parecida', tags: ['r'], forms: ['carro'], note: 'La «rr» suena como una «j» suave y aspirada.' }),
    V('a1-u1-v055', 'a rua', 'la calle', 'A rua é linda.', 'La calle es bonita.', { tags: ['r'], forms: ['rua'], note: 'La «r» inicial también suena como «j» suave: «júa».' }),
    V('a1-u1-v056', 'o filho / a filha', 'el hijo / la hija', 'Oi, filho! Tudo bem?', '¡Hola, hijo! ¿Todo bien?', { tags: ['lh', 'final-o'], forms: ['filho', 'filha'], note: '«Lh» suena parecido a «li» rápida: «fílio».' }),
    V('a1-u1-v057', 'o vinho', 'el vino', 'Um vinho, por favor.', 'Un vino, por favor.', { kind: 'parecida', tags: ['nh'], forms: ['vinho'], note: '«Nh» = ñ: «víño».' }),
    V('a1-u1-v058', 'a casa', 'la casa', 'Que casa linda!', '¡Qué casa tan bonita!', { kind: 'parecida', tags: ['s-z'], forms: ['casa'], note: 'La «s» entre vocales suena «z», con zumbido: «káza».' }),
    V('a1-u1-v059', 'o amigo / a amiga', 'el amigo / la amiga', 'Oi, amiga! Tudo bem?', '¡Hola, amiga! ¿Todo bien?', { kind: 'parecida', forms: ['amigo', 'amiga', 'amigos'] }),
    V('a1-u1-v060', 'muito', 'muy / mucho', 'Muito bem, obrigado!', '¡Muy bien, gracias!', { tags: ['nasal'], note: 'Suena «múintu».' }),
    V('a1-u1-v061', 'e aí?', '¿qué onda? / ¿qué tal?', 'E aí, Lucas? Tudo bem?', '¿Qué onda, Lucas? ¿Todo bien?', { forms: ['e aí', 'aí'], note: 'Saludo muy informal entre amigos.' }),
    V('a1-u1-v062', 'beleza', 'todo bien / va (informal)', 'Tudo bem? Beleza!', '¿Todo bien? ¡Todo bien!', { kind: 'falso', trap: 'belleza (solamente)', note: 'Significa «belleza», pero en saludos se usa como «todo bien» o «va».' })
  ],
  grammar: [
    {
      id: 'a1-u1-g1', title: 'Los sonidos que cambian', divergent: true,
      body: 'El portugués de Brasil se escribe parecido al español, pero varios sonidos cambian. Estos son los que más vas a practicar:\n- **Vocales nasales**: *ão, ãe, õe, im, um, em*. El aire sale también por la nariz y no se pronuncia la «n» o la «m».\n- **E y o finales átonas** suenan **i** y **u**: *noite* = «nóitʃi», *obrigado* = «obrigádu».\n- **T y d antes de i** (o de una e que suena i) suenan **chi** y **dʒi**: *tia* = «chía», *cidade* = «sidádʒi».\n- **R inicial y rr** suenan como una **j suave**: *rua*, *carro*.\n- **Lh** se parece a «li» y **nh** es la **ñ**: *filho*, *vinho*.\n- **S entre vocales** suena **z**: *casa* = «káza».\n- **É/ó abiertas y ê/ô cerradas** distinguen palabras: *avó* (abuela) y *avô* (abuelo).',
      table: [['noite', '«nói-chi»'], ['cidade', '«si-dá-dʒi»'], ['pão', '«pau» nasal'], ['vinho', '«ví-ño»'], ['casa', '«ká-za»']],
      check: { q: '¿Cómo se pronuncia «noite»?', options: ['nói-te', 'nói-chi', 'nói-ti'], answer: 1 }
    },
    {
      id: 'a1-u1-g2', title: 'Tú, usted, «você» y «a gente»', after: 'a1-u1-v021', divergent: true,
      body: 'En casi todo Brasil **você** cubre «tú» y «usted», y lleva el verbo en 3.ª persona: *você é* (como «usted es»).\n- Para mostrar respeto se usa **o senhor / a senhora**.\n- **Tu** existe en algunas regiones, a menudo también con verbo en 3.ª persona.\n- **A gente** es la forma normal de decir «nosotros» al hablar, y lleva el verbo como «ele»: *a gente é*. **Nós** es más formal o escrito.\n- No existe «vosotros»: **vocês** = ustedes.',
      table: [['você é', 'tú eres / usted es'], ['o senhor / a senhora', 'usted (respeto)'], ['a gente é', 'nosotros somos (hablado)'], ['nós somos', 'nosotros somos'], ['vocês são', 'ustedes son']],
      check: { q: '¿Cuál significa «nosotros» en el habla cotidiana?', options: ['a gente', 'as pessoas', 'vocês'], answer: 0 }
    },
    {
      id: 'a1-u1-g3', title: 'Saludos según la hora y «obrigado/obrigada»', after: 'a1-u1-v011', divergent: true,
      body: '- **Bom dia**: por la mañana. **Boa tarde**: de mediodía hasta que oscurece. **Boa noite**: de noche, al llegar y al irse.\n- *Bom* acompaña a *dia* (masculino) y *boa* a *tarde* y *noite* (femeninos), como en español.\n- **Gracias concuerda con quien habla**: un hombre dice *obrigado* y una mujer *obrigada*. En español «gracias» no cambia.',
      table: [['bom dia', 'buenos días'], ['boa tarde', 'buenas tardes'], ['boa noite', 'buenas noches'], ['obrigado (él) / obrigada (ella)', 'gracias']],
      check: { q: 'Un hombre da las gracias. ¿Qué dice?', options: ['Obrigado', 'Obrigada', 'Obrigados'], answer: 0 }
    },
    {
      id: 'a1-u1-g4', title: 'Artículos: o, a, um, uma', after: 'a1-u1-v041', divergent: true,
      body: 'Los artículos son más cortos que en español:\n- **o / a** = el / la; **os / as** = los / las.\n- **um / uma** = un / una.\n- La «o» del artículo suena «u»: *o café* = «u kafé».\n- Ojo con **a água**: en español decimos «el agua», pero en portugués es *a água*, *uma água*.\n- Con nombres de personas es común el artículo: *a Ana*, *o Lucas*.',
      table: [['o café / a casa', 'el café / la casa'], ['os amigos / as amigas', 'los amigos / las amigas'], ['um pão / uma água', 'un pan / un agua'], ['a água', 'el agua']],
      check: { q: '¿Cómo se dice «el agua»?', options: ['o água', 'a água', 'la água'], answer: 1 }
    }
  ],
  exercises: [
    { id: 'a1-u1-e001', type: 'completar', after: 'a1-u1-v002', pt: 'Oi! Tudo ___?', answer: 'bem', es: '¡Hola! ¿Todo bien?' },
    { id: 'a1-u1-e002', type: 'completar', after: 'a1-u1-v003', pt: 'Tudo bem, e ___?', answer: 'você', es: 'Todo bien, ¿y tú?' },
    { id: 'a1-u1-e003', type: 'pronunciar', after: 'a1-u1-v004', pt: 'bom dia', focus: 'ti-di', tip: '«Dia» suena «dʒía», parecido a «yía» con una «d» delante. «Bom» es nasal: cierra los labios sin decir la «m».', quiz: { q: '¿Cómo suena «dia» en «bom dia»?', options: ['día, como en español', 'dʒía (parecido a «yía»)', 'dea'], answer: 1 } },
    { id: 'a1-u1-e004', type: 'pronunciar', after: 'a1-u1-v005', pt: 'obrigado', focus: 'final-o', tip: 'La -o final átona suena «u»: «obrigádu».', quiz: { q: '¿Cómo termina «obrigado» al hablar?', options: ['-do', '-du', '-dó'], answer: 1 } },
    { id: 'a1-u1-e005', type: 'elegir', g: 'a1-u1-g3', q: 'Eres mujer y alguien te da un café. ¿Qué dices?', options: ['Obrigado!', 'Obrigada!', 'Obrigados!'], answer: 1, explain: '«Obrigado/obrigada» concuerda con quien habla.' },
    { id: 'a1-u1-e006', type: 'traducir', after: 'a1-u1-v007', dir: 'es-pt', es: 'Hasta mañana.', pt: 'Até amanhã.' },
    { id: 'a1-u1-e007', type: 'elegir', g: 'a1-u1-g3', q: 'Son las 4 de la tarde y saludas a tu vecina. ¿Qué dices?', options: ['Bom dia!', 'Boa tarde!', 'Boa noite!'], answer: 1 },
    { id: 'a1-u1-e008', type: 'elegir', g: 'a1-u1-g3', q: 'Son las 10 de la noche y te despides. ¿Qué dices?', options: ['Boa tarde!', 'Boa noite!', 'Bom dia!'], answer: 1, explain: '«Boa noite» sirve para saludar y para despedirse de noche.' },
    { id: 'a1-u1-e009', type: 'pronunciar', after: 'a1-u1-v011', pt: 'boa noite', focus: 'final-e', tip: '«Noite» suena «nóitʃi»: la -te final se vuelve «chi».', quiz: { q: '¿Cómo suena «noite»?', options: ['nói-te', 'nói-chi', 'nói-ti'], answer: 1 } },
    { id: 'a1-u1-e010', type: 'pronunciar', after: 'a1-u1-v016', pt: 'não', focus: 'nasal', pair: ['nau', 'não'], tip: 'Di «au» dejando salir el aire por la nariz. No agregues una «n» al final.', quiz: { q: 'En «não», ¿se pronuncia una «n» al final?', options: ['Sí: «naon»', 'No: es «au» nasal', 'Se dice «no»'], answer: 1 } },
    { id: 'a1-u1-e011', type: 'pronunciar', after: 'a1-u1-v015', pt: 'sim', focus: 'nasal', tip: 'La «m» final no se pronuncia: es una «i» nasal, sin cerrar del todo los labios.', quiz: { q: '¿Qué pasa con la «m» de «sim»?', options: ['Se pronuncia fuerte', 'Nasaliza la «i» y casi no se oye', 'Suena «n»'], answer: 1 } },
    { id: 'a1-u1-e012', type: 'elegir', g: 'a1-u1-g2', q: '¿Qué significa «a gente» en «A gente se vê amanhã»?', options: ['la gente', 'nosotros', 'ustedes'], answer: 1 },
    { id: 'a1-u1-e013', type: 'completar', g: 'a1-u1-g2', pt: '___ é a Helena.', answer: 'Ela', es: 'Ella es Helena.', hint: 'ella' },
    { id: 'a1-u1-e014', type: 'elegir', g: 'a1-u1-g2', q: 'Saludas con respeto a una señora mayor. ¿Qué forma usas?', options: ['você', 'a senhora', 'tu'], answer: 1 },
    { id: 'a1-u1-e015', type: 'traducir', after: 'a1-u1-v029', dir: 'es-pt', es: 'Mucho gusto, yo soy Ana.', pt: 'Muito prazer, eu sou a Ana.', accept: ['Muito prazer, eu sou Ana.', 'Prazer, eu sou a Ana.', 'Muito prazer, sou a Ana.'] },
    { id: 'a1-u1-e016', type: 'completar', g: 'a1-u1-g2', pt: 'Sim, ___ somos amigos.', answer: 'nós', es: 'Sí, nosotros somos amigos.', hint: 'nosotros' },
    { id: 'a1-u1-e017', type: 'ordenar', after: 'a1-u1-v034', pt: 'Bom dia! Como vai a senhora?', es: '¡Buenos días! ¿Cómo le va?' },
    { id: 'a1-u1-e018', type: 'traducir', after: 'a1-u1-v039', dir: 'pt-es', pt: 'Que legal!', es: '¡Qué padre!', accept: ['Qué genial', 'Qué bien', 'Qué chido', 'Qué bueno', 'Qué cool', 'Qué buena onda'] },
    { id: 'a1-u1-e019', type: 'dictado', after: 'a1-u1-v004', pt: 'Bom dia! Tudo bem?', es: '¡Buenos días! ¿Todo bien?' },
    { id: 'a1-u1-e020', type: 'dictado', after: 'a1-u1-v035', pt: 'Obrigada! Até logo!', es: '¡Gracias! ¡Hasta luego!' },
    { id: 'a1-u1-e021', type: 'elegir', g: 'a1-u1-g4', q: '¿Cuál es correcto?', options: ['o água', 'a água', 'um água'], answer: 1, explain: '«Água» es femenino: a água, uma água.' },
    { id: 'a1-u1-e022', type: 'completar', g: 'a1-u1-g4', pt: '___ café, por favor.', answer: 'Um', es: 'Un café, por favor.', hint: 'un' },
    { id: 'a1-u1-e023', type: 'pronunciar', after: 'a1-u1-v050', pt: 'avó / avô', focus: 'abierta', pair: ['avó', 'avô'], tip: 'Avó (abuela): ó abierta, con la boca más abierta. Avô (abuelo): ô cerrada, con los labios redondos.', quiz: { q: '¿Cuál lleva la «o» cerrada?', options: ['avó (abuela)', 'avô (abuelo)'], answer: 1 } },
    { id: 'a1-u1-e024', type: 'pronunciar', after: 'a1-u1-v051', pt: 'cidade', focus: 'ti-di', tip: '«Ci» suena «si» y la «de» final suena «dʒi»: «sidádʒi».', quiz: { q: '¿Cómo suena la «de» final de «cidade»?', options: ['de', 'dʒi, como en inglés «jeep»', 'di, como en español'], answer: 1 } },
    { id: 'a1-u1-e025', type: 'pronunciar', after: 'a1-u1-v053', pt: 'tia / dia', focus: 'ti-di', pair: ['tia', 'dia'], tip: '«Ti» = chi y «di» = dʒi. «Tia» suena «chía» y «dia» suena «dʒía».', quiz: { q: '¿Cómo suena «tia»?', options: ['tía', 'chía', 'día'], answer: 1 } },
    { id: 'a1-u1-e026', type: 'pronunciar', after: 'a1-u1-v054', pt: 'carro / caro', focus: 'r', pair: ['caro', 'carro'], tip: 'La «r» entre vocales es suave, como en «caro» en español. La «rr» suena como una «j» suave y aspirada.', quiz: { q: '¿Cómo suena la «rr» de «carro»?', options: ['Como la rr vibrante del español', 'Como una «j» suave', 'Como una «l»'], answer: 1 } },
    { id: 'a1-u1-e027', type: 'pronunciar', after: 'a1-u1-v055', pt: 'rua', focus: 'r', tip: 'La «r» al inicio de palabra suena como una «j» suave: «júa».', quiz: { q: '¿Cómo empieza «rua» al hablar?', options: ['Con rr vibrante', 'Con una «j» suave', 'Con «l»'], answer: 1 } },
    { id: 'a1-u1-e028', type: 'pronunciar', after: 'a1-u1-v056', pt: 'filho', focus: 'lh', tip: '«Lh» se parece a una «li» rápida: «fílio». Apoya la lengua en el paladar.', quiz: { q: '«Filho» suena parecido a…', options: ['filo', 'fílio', 'fijo'], answer: 1 } },
    { id: 'a1-u1-e029', type: 'pronunciar', after: 'a1-u1-v057', pt: 'vinho', focus: 'nh', tip: '«Nh» es como la «ñ»: «víño».', quiz: { q: '«Nh» suena como…', options: ['n + h', 'ñ', 'ni con pausa'], answer: 1 } },
    { id: 'a1-u1-e030', type: 'pronunciar', after: 'a1-u1-v058', pt: 'casa / caça', focus: 's-z', pair: ['casa', 'caça'], tip: 'S entre vocales = «z», con vibración: casa = «káza». «Ç» = «s»: caça (caza) = «kása».', quiz: { q: 'En «casa», la «s» suena…', options: ['s', 'z (con zumbido)', 'ch'], answer: 1 } },
    { id: 'a1-u1-e031', type: 'pronunciar', after: 'a1-u1-v046', pt: 'pão', focus: 'nasal', pair: ['pau', 'pão'], tip: '«Pão» es «au» nasal. «Pau» (palo) no es nasal.', quiz: { q: '¿Cuál de las dos es nasal?', options: ['pão', 'pau'], answer: 0 } },
    { id: 'a1-u1-e032', type: 'pronunciar', after: 'a1-u1-v047', pt: 'mãe', focus: 'nasal', tip: '«Ãe» es «ai» nasal: «mãi».', quiz: { q: '«Mãe» suena como…', options: ['ma-e', 'mãi (ai nasal)', 'mane'], answer: 1 } },
    { id: 'a1-u1-e033', type: 'pronunciar', after: 'a1-u1-v048', pt: 'lições', focus: 'nasal', tip: '«Ões» es «oi» nasal + s: «lisõis».', quiz: { q: '«Lições» termina en…', options: ['-ones', '-õis (oi nasal)', '-oes'], answer: 1 } },
    { id: 'a1-u1-e034', type: 'pronunciar', after: 'a1-u1-v042', pt: 'você / café', focus: 'abierta', tip: '«Você»: ê cerrada. «Café»: é abierta, con la boca más abierta.', quiz: { q: '¿Cuál tiene la «e» abierta?', options: ['você', 'café'], answer: 1 } },
    { id: 'a1-u1-e035', type: 'ordenar', after: 'a1-u1-v045', pt: 'Um café com leite, por favor.', es: 'Un café con leche, por favor.' },
    { id: 'a1-u1-e036', type: 'traducir', after: 'a1-u1-v028', dir: 'es-pt', es: 'Ellos son amigos.', pt: 'Eles são amigos.' },
    { id: 'a1-u1-e037', type: 'ordenar', after: 'a1-u1-v037', pt: 'Oi, gente! Tudo bem?', es: '¡Hola a todos! ¿Todo bien?' },
    { id: 'a1-u1-e038', type: 'traducir', after: 'a1-u1-v044', dir: 'es-pt', es: '¿Todo bien contigo?', pt: 'Tudo bem com você?' },
    { id: 'a1-u1-e039', type: 'elegir', after: 'a1-u1-v062', q: 'Un amigo te dice «E aí, beleza?». ¿Qué significa?', options: ['¿Y la belleza?', '¿Qué onda, todo bien?', '¿Ahí está bien?'], answer: 1 },
    { id: 'a1-u1-e040', type: 'completar', after: 'a1-u1-v038', pt: 'Até amanhã? Tá ___!', answer: 'bom', es: '¿Hasta mañana? ¡Va!' }
  ],
  dialogues: [
    {
      id: 'a1-u1-d1', title: 'Oi, tudo bem?', setting: 'Dos amigos se encuentran en la calle.',
      speakers: { A: 'Lucas', B: 'Ana' }, names: ['Ana', 'Lucas'],
      lines: [
        { s: 'A', pt: 'Oi, Ana! Tudo bem?', es: '¡Hola, Ana! ¿Todo bien?' },
        { s: 'B', pt: 'Oi, Lucas! Tudo bem, e você?', es: '¡Hola, Lucas! Todo bien, ¿y tú?' },
        { s: 'A', pt: 'Tudo ótimo, obrigado.', es: 'Todo excelente, gracias.' },
        { s: 'B', pt: 'Que bom! Tchau, Lucas!', es: '¡Qué bien! ¡Adiós, Lucas!' },
        { s: 'A', pt: 'Tchau, Ana! Até amanhã.', es: '¡Adiós, Ana! Hasta mañana.' }
      ],
      questions: [
        { q: '¿Cómo está Lucas?', options: ['Más o menos', 'Muy bien', 'Cansado'], answer: 1 },
        { q: '¿Cuándo se van a ver otra vez?', options: ['Esta noche', 'Mañana', 'No se sabe'], answer: 1 }
      ]
    },
    {
      id: 'a1-u1-d2', title: 'Muito prazer', setting: 'Por la mañana, en la recepción de un edificio.',
      speakers: { A: 'Helena', B: 'Pedro' }, names: ['Helena', 'Pedro'],
      lines: [
        { s: 'A', pt: 'Bom dia!', es: '¡Buenos días!' },
        { s: 'B', pt: 'Bom dia, senhora! Como vai?', es: '¡Buenos días, señora! ¿Cómo le va?' },
        { s: 'A', pt: 'Bem, obrigada. E o senhor?', es: 'Bien, gracias. ¿Y usted?' },
        { s: 'B', pt: 'Muito bem. Eu sou o Pedro. Muito prazer.', es: 'Muy bien. Yo soy Pedro. Mucho gusto.' },
        { s: 'A', pt: 'O prazer é meu. Eu sou a Helena.', es: 'El gusto es mío. Yo soy Helena.' },
        { s: 'B', pt: 'Com licença, senhora. Até logo!', es: 'Con permiso, señora. ¡Hasta luego!' },
        { s: 'A', pt: 'Até logo!', es: '¡Hasta luego!' }
      ],
      questions: [
        { q: '¿En qué momento del día ocurre?', options: ['En la mañana', 'En la tarde', 'En la noche'], answer: 0 },
        { q: '¿Cómo trata Pedro a Helena?', options: ['De «você»', 'De «a senhora»', 'De «tu»'], answer: 1 },
        { q: '¿Por qué Helena dice «obrigada» y no «obrigado»?', options: ['Porque es formal', 'Porque ella es mujer', 'Porque habla con un hombre'], answer: 1 }
      ]
    }
  ],
  production: [
    { id: 'a1-u1-p1', prompt: 'Saluda a alguien por la mañana y pregúntale cómo está.', model: 'Bom dia! Tudo bem?', keywords: ['bom dia', 'tudo bem'] },
    { id: 'a1-u1-p2', prompt: 'Despídete de un amigo hasta mañana.', model: 'Tchau! Até amanhã.', keywords: ['tchau', 'até amanhã'] },
    { id: 'a1-u1-p3', prompt: 'Preséntate de forma educada con una señora.', model: 'Bom dia, senhora! Muito prazer, eu sou o Pedro.', keywords: ['senhora', 'muito prazer', 'eu sou'] },
    { id: 'a1-u1-p4', prompt: 'Saluda a un grupo de amigos de noche, de forma informal.', model: 'Boa noite, gente! E aí, tudo bem?', keywords: ['boa noite', 'gente', 'tudo bem'] }
  ]
};

/* ---------- A1 · Unidad 2 ---------- */
const UNIT_A1U2 = {
  id: 'a1-u2', level: 'A1', n: 2, title: 'Presentarse', titlePt: 'Apresentações',
  goals: ['Decir tu nombre, nacionalidad, profesión y edad', 'Conjugar el verbo ser', 'Contar de 0 a 100 y dictar un número de teléfono'],
  vocab: [
    V('a1-u2-v001', 'somos', 'somos', 'Nós somos mexicanos.', 'Somos mexicanos.', { kind: 'parecida' }),
    V('a1-u2-v002', 'são', 'son / ustedes son', 'Vocês são brasileiros?', '¿Ustedes son brasileños?', { tags: ['nasal'], note: 'Nasal «ão». Sirve para «ellos son» y «ustedes son».' }),
    V('a1-u2-v003', 'o nome', 'el nombre', 'Qual é o seu nome?', '¿Cuál es tu nombre?', { kind: 'parecida', tags: ['final-e'], forms: ['nome'], note: 'Suena «nómi».' }),
    V('a1-u2-v004', 'qual?', '¿cuál?', 'Qual é o seu celular?', '¿Cuál es tu celular?', { kind: 'parecida', forms: ['qual'], note: '«Qual é…?» se usa para pedir datos: nombre, teléfono, profesión.' }),
    V('a1-u2-v005', 'o seu / a sua', 'tu / su (de usted)', 'Qual é a sua profissão?', '¿Cuál es tu profesión?', { forms: ['seu', 'sua'], note: 'Va con artículo: «o seu nome». Lo verás a fondo en la unidad 3.' }),
    V('a1-u2-v006', 'como você se chama?', '¿cómo te llamas?', 'Oi! Como você se chama?', '¡Hola! ¿Cómo te llamas?', { forms: ['como você se chama', 'se chama', 'chama'] }),
    V('a1-u2-v007', 'eu me chamo', 'me llamo', 'Eu me chamo Daniel.', 'Me llamo Daniel.', { forms: ['eu me chamo', 'me chamo', 'chamo'] }),
    V('a1-u2-v008', 'meu nome é', 'mi nombre es', 'Meu nome é Sofia.', 'Mi nombre es Sofia.', { kind: 'parecida', forms: ['meu nome é', 'meu'] }),
    V('a1-u2-v009', 'de onde você é?', '¿de dónde eres?', 'De onde você é?', '¿De dónde eres?', { kind: 'parecida', forms: ['de onde você é', 'de onde', 'onde'] }),
    V('a1-u2-v010', 'mexicano / mexicana', 'mexicano / mexicana', 'Eu sou mexicana.', 'Soy mexicana.', { kind: 'parecida', forms: ['mexicano', 'mexicana', 'mexicanos'] }),
    V('a1-u2-v011', 'brasileiro / brasileira', 'brasileño / brasileña', 'O Lucas é brasileiro.', 'Lucas es brasileño.', { kind: 'parecida', forms: ['brasileiro', 'brasileira', 'brasileiros'] }),
    V('a1-u2-v012', 'zero', 'cero', 'O número é zero.', 'El número es cero.', { kind: 'parecida', tags: ['final-o'], note: 'Suena «zéru».' }),
    V('a1-u2-v013', 'dois / duas', 'dos', 'Dois cafés, por favor.', 'Dos cafés, por favor.', { forms: ['dois', 'duas'], note: 'Tiene femenino: «dois» para masculino y «duas» para femenino: duas águas.' }),
    V('a1-u2-v014', 'três', 'tres', 'Três pães, por favor.', 'Tres panes, por favor.', { kind: 'parecida' }),
    V('a1-u2-v015', 'quatro', 'cuatro', 'São quatro amigos.', 'Son cuatro amigos.', { kind: 'parecida', tags: ['final-o'] }),
    V('a1-u2-v016', 'cinco', 'cinco', 'Cinco cafés, por favor.', 'Cinco cafés, por favor.', { kind: 'parecida', note: 'Suena «sínku».' }),
    V('a1-u2-v017', 'seis', 'seis', 'São seis amigos.', 'Son seis amigos.', { kind: 'parecida' }),
    V('a1-u2-v018', 'sete', 'siete', 'O número é sete.', 'El número es siete.', { kind: 'parecida', tags: ['final-e', 'ti-di'], note: 'Suena «séchi».' }),
    V('a1-u2-v019', 'oito', 'ocho', 'Oito pães, por favor.', 'Ocho panes, por favor.', { tags: ['final-o'], note: 'Suena «óitu».' }),
    V('a1-u2-v020', 'nove', 'nueve', 'O número é nove.', 'El número es nueve.', { kind: 'parecida', tags: ['final-e', 'abierta'], note: 'Suena «nóvi».' }),
    V('a1-u2-v021', 'dez', 'diez', 'O número é dez.', 'El número es diez.', { kind: 'parecida', tags: ['abierta'], note: 'Suena «dés», con «e» abierta.' }),
    V('a1-u2-v022', 'o número', 'el número', 'Qual é o número?', '¿Cuál es el número?', { kind: 'parecida', forms: ['número'] }),
    V('a1-u2-v023', 'o professor / a professora', 'el profesor / la profesora', 'Eu sou professora.', 'Soy profesora.', { kind: 'parecida', forms: ['professor', 'professora'] }),
    V('a1-u2-v024', 'o médico / a médica', 'el médico / la médica', 'Ele é médico.', 'Él es médico.', { kind: 'parecida', forms: ['médico', 'médica'] }),
    V('a1-u2-v025', 'o engenheiro / a engenheira', 'el ingeniero / la ingeniera', 'A Ana é engenheira.', 'Ana es ingeniera.', { kind: 'parecida', tags: ['nh'], forms: ['engenheiro', 'engenheira'], note: '«Ge» suena como la «y» rioplatense (ʒ) y «nh» como «ñ»: «enʒeñéira».' }),
    V('a1-u2-v026', 'o estudante / a estudante', 'el estudiante / la estudiante', 'Nós somos estudantes.', 'Somos estudiantes.', { kind: 'parecida', tags: ['ti-di', 'final-e'], forms: ['estudante', 'estudantes'], note: 'Suena «estudãntʃi».' }),
    V('a1-u2-v027', 'o que você faz?', '¿a qué te dedicas?', 'O que você faz? Eu sou médica.', '¿A qué te dedicas? Soy médica.', { forms: ['o que você faz', 'faz'], note: 'Literalmente «¿qué haces?». Es la pregunta típica sobre el trabajo.' }),
    V('a1-u2-v028', 'a profissão', 'la profesión', 'Qual é a sua profissão?', '¿Cuál es tu profesión?', { kind: 'parecida', tags: ['nasal'], forms: ['profissão'] }),
    V('a1-u2-v029', 'americano / americana', 'estadounidense', 'O John é americano.', 'John es estadounidense.', { kind: 'falso', trap: 'de América (el continente)', forms: ['americano', 'americana'], note: 'En Brasil «americano» casi siempre significa «de Estados Unidos».' }),
    V('a1-u2-v030', 'argentino / argentina', 'argentino / argentina', 'O Martín é argentino.', 'Martín es argentino.', { kind: 'parecida', forms: ['argentino', 'argentina'] }),
    V('a1-u2-v031', 'colombiano / colombiana', 'colombiano / colombiana', 'A Laura é colombiana.', 'Laura es colombiana.', { kind: 'parecida', forms: ['colombiano', 'colombiana'] }),
    V('a1-u2-v032', 'espanhol / espanhola', 'español / española', 'O Javier é espanhol.', 'Javier es español.', { kind: 'parecida', tags: ['nh'], forms: ['espanhol', 'espanhola'], note: 'También es el idioma: «o espanhol».' }),
    V('a1-u2-v033', 'português / portuguesa', 'portugués / portuguesa', 'A Inês é portuguesa.', 'Inês es portuguesa.', { kind: 'parecida', forms: ['português', 'portuguesa'], note: 'También es el idioma: «o português».' }),
    V('a1-u2-v034', 'onze', 'once', 'São onze pessoas.', 'Son once personas.', { kind: 'parecida', tags: ['final-e'] }),
    V('a1-u2-v035', 'doze', 'doce', 'Doze pães, por favor.', 'Doce panes, por favor.', { kind: 'parecida', tags: ['final-e'] }),
    V('a1-u2-v036', 'treze', 'trece', 'O número é treze.', 'El número es trece.', { kind: 'parecida', tags: ['final-e'] }),
    V('a1-u2-v037', 'catorze / quatorze', 'catorce', 'Ela tem catorze anos.', 'Ella tiene catorce años.', { kind: 'parecida', forms: ['catorze', 'quatorze'] }),
    V('a1-u2-v038', 'quinze', 'quince', 'São quinze minutos.', 'Son quince minutos.', { kind: 'parecida', tags: ['final-e'] }),
    V('a1-u2-v039', 'dezesseis', 'dieciséis', 'Ela tem dezesseis anos.', 'Ella tiene dieciséis años.', { note: 'Se escribe con «zess»: dez + e + seis.' }),
    V('a1-u2-v040', 'dezessete', 'diecisiete', 'O número é dezessete.', 'El número es diecisiete.', { tags: ['ti-di'], note: 'Suena «dezesséchi».' }),
    V('a1-u2-v041', 'dezoito', 'dieciocho', 'Ele tem dezoito anos.', 'Él tiene dieciocho años.', { tags: ['final-o'] }),
    V('a1-u2-v042', 'dezenove', 'diecinueve', 'Ela tem dezenove anos.', 'Ella tiene diecinueve años.', { tags: ['final-e'] }),
    V('a1-u2-v043', 'vinte', 'veinte', 'Eu tenho vinte anos.', 'Tengo veinte años.', { kind: 'parecida', tags: ['nasal', 'ti-di'], note: 'Suena «víntʃi».' }),
    V('a1-u2-v044', 'tenho vinte anos', 'tengo veinte años', 'Eu tenho vinte anos.', 'Tengo veinte años.', { kind: 'parecida', tags: ['nh'], forms: ['tenho', 'anos'], note: 'La edad se dice con «ter» (tener): eu tenho 30 anos.' }),
    V('a1-u2-v045', 'quantos anos você tem?', '¿cuántos años tienes?', 'Quantos anos você tem?', '¿Cuántos años tienes?', { kind: 'parecida', forms: ['quantos anos você tem', 'quantos', 'tem'] }),
    V('a1-u2-v046', 'o advogado / a advogada', 'el abogado / la abogada', 'Você é advogado?', '¿Eres abogado?', { kind: 'parecida', forms: ['advogado', 'advogada'] }),
    V('a1-u2-v047', 'o enfermeiro / a enfermeira', 'el enfermero / la enfermera', 'Ela é enfermeira.', 'Ella es enfermera.', { kind: 'parecida', forms: ['enfermeiro', 'enfermeira'] }),
    V('a1-u2-v048', 'o vendedor / a vendedora', 'el vendedor / la vendedora', 'O Paulo é vendedor.', 'Paulo es vendedor.', { kind: 'parecida', forms: ['vendedor', 'vendedora'] }),
    V('a1-u2-v049', 'o garçom / a garçonete', 'el mesero / la mesera', 'O garçom é muito legal.', 'El mesero es muy buena onda.', { tags: ['nasal'], forms: ['garçom', 'garçonete'], note: 'La «ç» suena «s» y «-om» es nasal: «garsõ».' }),
    V('a1-u2-v050', 'o dentista / a dentista', 'el dentista / la dentista', 'A minha tia é dentista.', 'Mi tía es dentista.', { kind: 'parecida', forms: ['dentista'] }),
    V('a1-u2-v051', 'o jornalista / a jornalista', 'el periodista / la periodista', 'Ela é jornalista.', 'Ella es periodista.', { kind: 'falso', trap: 'jornalero', forms: ['jornalista'], note: 'No es «jornalero»: «jornal» significa «periódico».' }),
    V('a1-u2-v052', 'o programador / a programadora', 'el programador / la programadora', 'Eu sou programador.', 'Soy programador.', { kind: 'parecida', forms: ['programador', 'programadora'] }),
    V('a1-u2-v053', 'o cozinheiro / a cozinheira', 'el cocinero / la cocinera', 'O meu amigo é cozinheiro.', 'Mi amigo es cocinero.', { kind: 'parecida', tags: ['nh'], forms: ['cozinheiro', 'cozinheira'] }),
    V('a1-u2-v054', 'o motorista / a motorista', 'el chofer / la chofer', 'O motorista é argentino.', 'El chofer es argentino.', { forms: ['motorista'], note: 'La persona que maneja un taxi, autobús o coche de aplicación.' }),
    V('a1-u2-v055', 'inglês / inglesa', 'inglés / inglesa', 'O John é inglês.', 'John es inglés.', { kind: 'parecida', forms: ['inglês', 'inglesa'] }),
    V('a1-u2-v056', 'francês / francesa', 'francés / francesa', 'A Marie é francesa.', 'Marie es francesa.', { kind: 'parecida', forms: ['francês', 'francesa'] }),
    V('a1-u2-v057', 'alemão / alemã', 'alemán / alemana', 'O Hans é alemão.', 'Hans es alemán.', { kind: 'parecida', tags: ['nasal'], forms: ['alemão', 'alemã'], note: 'Femenino irregular: alemã.' }),
    V('a1-u2-v058', 'italiano / italiana', 'italiano / italiana', 'O Marco é italiano.', 'Marco es italiano.', { kind: 'parecida', forms: ['italiano', 'italiana'] }),
    V('a1-u2-v059', 'japonês / japonesa', 'japonés / japonesa', 'A Yuki é japonesa.', 'Yuki es japonesa.', { kind: 'parecida', forms: ['japonês', 'japonesa'] }),
    V('a1-u2-v060', 'canadense', 'canadiense', 'Ela é canadense.', 'Ella es canadiense.', { kind: 'parecida', tags: ['final-e'], note: 'Igual para hombre y mujer.' }),
    V('a1-u2-v061', 'trinta', 'treinta', 'Eu tenho trinta anos.', 'Tengo treinta años.', { kind: 'parecida' }),
    V('a1-u2-v062', 'quarenta', 'cuarenta', 'Ele tem quarenta anos.', 'Él tiene cuarenta años.', { kind: 'parecida' }),
    V('a1-u2-v063', 'cinquenta', 'cincuenta', 'Ela tem cinquenta anos.', 'Ella tiene cincuenta años.', { kind: 'parecida' }),
    V('a1-u2-v064', 'sessenta', 'sesenta', 'O meu avô tem sessenta anos.', 'Mi abuelo tiene sesenta años.', { kind: 'parecida' }),
    V('a1-u2-v065', 'setenta', 'setenta', 'A minha avó tem setenta anos.', 'Mi abuela tiene setenta años.', { kind: 'parecida' }),
    V('a1-u2-v066', 'oitenta', 'ochenta', 'Ela tem oitenta anos.', 'Ella tiene ochenta años.', { note: 'De «oito»: oitenta.' }),
    V('a1-u2-v067', 'noventa', 'noventa', 'O número é noventa.', 'El número es noventa.', { kind: 'parecida' }),
    V('a1-u2-v068', 'cem', 'cien', 'São cem pessoas.', 'Son cien personas.', { tags: ['nasal'], note: 'Suena «sẽi», nasal. Desde 101 se dice «cento»: cento e um.' }),
    V('a1-u2-v069', 'meia', 'seis (al dictar números)', 'Meu celular é nove, meia, oito, dois.', 'Mi celular es nueve, seis, ocho, dos.', { note: 'Al dictar teléfonos, el 6 se dice «meia» (de «meia dúzia», media docena) para no confundirlo con «três».' }),
    V('a1-u2-v070', 'o celular', 'el celular', 'Qual é o seu celular?', '¿Cuál es tu celular?', { kind: 'parecida', forms: ['celular'] }),
    V('a1-u2-v071', 'o telefone', 'el teléfono', 'Qual é o telefone da escola?', '¿Cuál es el teléfono de la escuela?', { kind: 'parecida', tags: ['final-e'], forms: ['telefone'] }),
    V('a1-u2-v072', 'o apelido', 'el apodo', 'Meu apelido é Dani.', 'Mi apodo es Dani.', { kind: 'falso', trap: 'el apellido', forms: ['apelido'] }),
    V('a1-u2-v073', 'o sobrenome', 'el apellido', 'Qual é o seu sobrenome?', '¿Cuál es tu apellido?', { tags: ['final-e'], forms: ['sobrenome'] }),
    V('a1-u2-v074', 'moro em', 'vivo en', 'Eu moro em Guadalajara.', 'Vivo en Guadalajara.', { forms: ['moro em', 'moro', 'mora'], note: 'Del verbo «morar»: vivir en un lugar.' }),
    V('a1-u2-v075', 'falo', 'hablo', 'Eu falo espanhol e um pouco de português.', 'Hablo español y un poco de portugués.', { forms: ['falo', 'fala'], note: 'Del verbo «falar»: hablar.' }),
    V('a1-u2-v076', 'a língua', 'la lengua / el idioma', 'Eu falo duas línguas.', 'Hablo dos idiomas.', { kind: 'parecida', forms: ['língua', 'línguas'] }),
    V('a1-u2-v077', 'um pouco', 'un poco', 'Eu falo um pouco de português.', 'Hablo un poco de portugués.', { kind: 'parecida', forms: ['um pouco', 'pouco'] }),
    V('a1-u2-v078', 'o trabalho', 'el trabajo', 'Meu trabalho é legal.', 'Mi trabajo está padre.', { kind: 'parecida', tags: ['lh'], forms: ['trabalho'] })
  ],
  grammar: [
    {
      id: 'a1-u2-g1', title: 'El verbo «ser»', divergent: true,
      body: 'Se conjuga casi como en español, con una diferencia clave: **você**, **a gente** y **ele/ela** comparten la forma *é*.\n- No hay una forma especial para «tú eres»: con *você* dices *você é*.\n- *Vocês são* = ustedes son.\n- Como en español, profesión y nacionalidad van **sin artículo**: *Eu sou médico.*',
      table: [['eu sou', 'yo soy'], ['você é', 'tú eres / usted es'], ['ele / ela é', 'él / ella es'], ['a gente é', 'nosotros somos (hablado)'], ['nós somos', 'nosotros somos'], ['vocês são', 'ustedes son'], ['eles / elas são', 'ellos / ellas son']],
      check: { q: 'Completa: «Vocês ___ de onde?»', options: ['é', 'são', 'somos'], answer: 1 }
    },
    {
      id: 'a1-u2-g2', title: 'Masculino y femenino: nacionalidades y profesiones', after: 'a1-u2-v023', divergent: true,
      body: 'Casi todo funciona como en español:\n- **-o → -a**: *brasileiro / brasileira*, *médico / médica*.\n- **-ês → -esa**: *português / portuguesa*, *inglês / inglesa* (el femenino pierde el acento).\n- **-or → -ora**: *professor / professora*.\n- **-ão → -ã**: *alemão / alemã*. Este cambio no existe en español.\n- Invariables en **-e** e **-ista**: *canadense*, *estudante*, *dentista*.',
      table: [['alemão / alemã', 'alemán / alemana'], ['português / portuguesa', 'portugués / portuguesa'], ['o garçom / a garçonete', 'el mesero / la mesera']],
      check: { q: 'Femenino de «inglês»:', options: ['inglêsa', 'inglesa', 'inglês'], answer: 1 }
    },
    {
      id: 'a1-u2-g3', title: 'Números del 0 al 100', after: 'a1-u2-v013', divergent: true,
      body: 'Muy parecidos al español. Lo que cambia:\n- **Uno y dos tienen femenino**: *um / uma*, *dois / duas* (*duas águas*). En español «dos» no cambia.\n- **16 a 19** se escriben juntos con «e»: *dezesseis*, *dezessete*, *dezoito*, *dezenove*.\n- **Siempre «e» entre decenas y unidades**: *vinte e um* (veintiuno), *trinta e cinco*.\n- **100 = cem**; desde 101 se usa *cento*: *cento e um*.\n- **Teléfonos**: el 6 se dice *meia* para no confundirlo con *três*.',
      table: [['vinte e um', 'veintiuno'], ['vinte e duas casas', 'veintidós casas'], ['dezesseis', 'dieciséis'], ['cem / cento e um', 'cien / ciento uno']],
      check: { q: '¿Cómo se dice «dos casas»?', options: ['dois casas', 'duas casas'], answer: 1 }
    },
    {
      id: 'a1-u2-g4', title: 'Preguntas para presentarse', after: 'a1-u2-v045',
      body: 'Todas usan *você*, con el verbo en 3.ª persona:\n- *Como você se chama?* / *Qual é o seu nome?*\n- *De onde você é?*\n- *O que você faz?* (¿a qué te dedicas?)\n- *Quantos anos você tem?* La edad se dice con **ter** (tener), igual que en español: *Eu tenho 30 anos.*\n- *Qual é o seu celular?*\nEn portugués el sujeto se dice más que en español: *Eu sou mexicano* es más natural que *Sou mexicano*, aunque las dos formas son correctas.',
      check: { q: 'Para preguntar la edad dices:', options: ['Quantos anos você é?', 'Quantos anos você tem?', 'Qual anos você tem?'], answer: 1 }
    }
  ],
  exercises: [
    { id: 'a1-u2-e001', type: 'completar', g: 'a1-u2-g1', pt: 'Eu ___ mexicana.', answer: 'sou', es: 'Yo soy mexicana.', hint: 'ser' },
    { id: 'a1-u2-e002', type: 'completar', g: 'a1-u2-g1', pt: 'Vocês ___ brasileiros?', answer: 'são', es: '¿Ustedes son brasileños?', hint: 'ser' },
    { id: 'a1-u2-e003', type: 'completar', g: 'a1-u2-g1', pt: 'Ela ___ engenheira.', answer: 'é', es: 'Ella es ingeniera.', hint: 'ser' },
    { id: 'a1-u2-e004', type: 'completar', g: 'a1-u2-g1', pt: 'Nós ___ estudantes.', answer: 'somos', es: 'Nosotros somos estudiantes.', hint: 'ser' },
    { id: 'a1-u2-e005', type: 'completar', g: 'a1-u2-g1', pt: 'A gente ___ de Monterrey.', answer: 'é', es: 'Nosotros somos de Monterrey.', hint: 'ser', explain: '«A gente» lleva el verbo como «ele»: a gente é.' },
    { id: 'a1-u2-e006', type: 'elegir', g: 'a1-u2-g2', q: '¿Cuál es el femenino de «alemão»?', options: ['alemoa', 'alemã', 'alemana'], answer: 1 },
    { id: 'a1-u2-e007', type: 'elegir', g: 'a1-u2-g2', q: '¿Cuál es el femenino de «português»?', options: ['portuguesa', 'portuguêsa', 'português'], answer: 0 },
    { id: 'a1-u2-e008', type: 'completar', g: 'a1-u2-g2', pt: 'Ele é inglês e ela é ___.', answer: 'inglesa', es: 'Él es inglés y ella es inglesa.' },
    { id: 'a1-u2-e009', type: 'traducir', g: 'a1-u2-g2', dir: 'es-pt', es: 'Soy ingeniero.', pt: 'Eu sou engenheiro.', accept: ['Sou engenheiro.'] },
    { id: 'a1-u2-e010', type: 'traducir', g: 'a1-u2-g2', dir: 'es-pt', es: 'Ella es estudiante.', pt: 'Ela é estudante.' },
    { id: 'a1-u2-e011', type: 'elegir', after: 'a1-u2-v072', q: 'Tu amigo dice «Meu apelido é Beto». ¿Qué te está diciendo?', options: ['Su apellido', 'Su apodo', 'Su dirección'], answer: 1 },
    { id: 'a1-u2-e012', type: 'dictado', g: 'a1-u2-g3', pt: 'Eu tenho vinte e cinco anos.', es: 'Tengo veinticinco años.' },
    { id: 'a1-u2-e013', type: 'dictado', after: 'a1-u2-v069', pt: 'O número é nove, meia, oito, sete.', es: 'El número es nueve, seis, ocho, siete.' },
    { id: 'a1-u2-e014', type: 'elegir', after: 'a1-u2-v039', q: '¿Cómo se escribe 16?', options: ['dezeseis', 'dezesseis', 'dezaseis'], answer: 1 },
    { id: 'a1-u2-e015', type: 'completar', after: 'a1-u2-v076', pt: 'Eu falo ___ línguas: espanhol e português.', answer: 'duas', es: 'Hablo dos idiomas: español y portugués.', hint: 'dos', explain: '«Língua» es femenino: duas línguas.' },
    { id: 'a1-u2-e016', type: 'traducir', after: 'a1-u2-v061', dir: 'es-pt', es: 'Tengo treinta y un años.', pt: 'Eu tenho trinta e um anos.', accept: ['Tenho trinta e um anos.'] },
    { id: 'a1-u2-e017', type: 'ordenar', after: 'a1-u2-v009', pt: 'De onde você é?', es: '¿De dónde eres?' },
    { id: 'a1-u2-e018', type: 'ordenar', after: 'a1-u2-v010', pt: 'Eu me chamo Daniel e sou mexicano.', es: 'Me llamo Daniel y soy mexicano.' },
    { id: 'a1-u2-e019', type: 'traducir', after: 'a1-u2-v027', dir: 'pt-es', pt: 'O que você faz?', es: '¿A qué te dedicas?', accept: ['Qué haces', 'En qué trabajas', 'A qué se dedica', 'Qué hace usted'] },
    { id: 'a1-u2-e020', type: 'elegir', after: 'a1-u2-v069', q: 'Al dictar un teléfono, ¿qué número es «meia»?', options: ['0', '6', '7'], answer: 1 },
    { id: 'a1-u2-e021', type: 'traducir', after: 'a1-u2-v007', dir: 'es-pt', es: '¿Cómo te llamas?', pt: 'Como você se chama?', accept: ['Qual é o seu nome?', 'Qual é seu nome?', 'Qual o seu nome?'] },
    { id: 'a1-u2-e022', type: 'pronunciar', after: 'a1-u2-v018', pt: 'sete', focus: 'ti-di', tip: 'La «te» final suena «chi»: «séchi».', quiz: { q: '¿Cómo suena «sete»?', options: ['sé-te', 'sé-chi', 'sié-te'], answer: 1 } },
    { id: 'a1-u2-e023', type: 'pronunciar', after: 'a1-u2-v019', pt: 'oito', focus: 'final-o', tip: 'La -o final suena «u»: «óitu».', quiz: { q: '«Oito» suena…', options: ['ói-to', 'ói-tu', 'o-cho'], answer: 1 } },
    { id: 'a1-u2-e024', type: 'pronunciar', after: 'a1-u2-v043', pt: 'vinte', focus: 'nasal', tip: '«In» nasal y la «te» final suena «chi»: «víntʃi».', quiz: { q: '«Vinte» suena…', options: ['vin-te', 'vín-chi', 'vein-te'], answer: 1 } },
    { id: 'a1-u2-e025', type: 'pronunciar', after: 'a1-u2-v068', pt: 'cem', focus: 'nasal', tip: 'La «em» final es nasal, casi «ẽi»: «sẽi». La «m» no se pronuncia.', quiz: { q: '¿Cómo suena «cem» (100)?', options: ['sem, con m', 'sẽi, nasal', 'cien'], answer: 1 } },
    { id: 'a1-u2-e026', type: 'pronunciar', after: 'a1-u2-v025', pt: 'engenheira', focus: 'nh', tip: '«Ge» suena como la «y» rioplatense (ʒ) y «nh» como «ñ»: «enʒeñéira».', quiz: { q: 'En «engenheira», «nh» suena…', options: ['n', 'ñ', 'nj'], answer: 1 } },
    { id: 'a1-u2-e027', type: 'elegir', g: 'a1-u2-g3', q: 'Para decir «dos cafés» y «dos aguas», ¿qué formas usas?', options: ['dois cafés / dois águas', 'dois cafés / duas águas', 'duas cafés / duas águas'], answer: 1 },
    { id: 'a1-u2-e028', type: 'completar', after: 'a1-u2-v029', pt: 'A Jennifer é de Nova York. Ela é ___.', answer: 'americana', es: 'Jennifer es de Nueva York. Ella es estadounidense.', hint: 'estadounidense' }
  ],
  dialogues: [
    {
      id: 'a1-u2-d1', title: 'Um intercâmbio', setting: 'En un intercambio de idiomas por la tarde.',
      speakers: { A: 'Daniel', B: 'Júlia' }, names: ['Daniel', 'Júlia', 'Guadalajara', 'Salvador'],
      lines: [
        { s: 'A', pt: 'Oi! Como você se chama?', es: '¡Hola! ¿Cómo te llamas?' },
        { s: 'B', pt: 'Oi! Eu me chamo Júlia. E você?', es: '¡Hola! Me llamo Júlia. ¿Y tú?' },
        { s: 'A', pt: 'Eu sou o Daniel. Muito prazer!', es: 'Yo soy Daniel. ¡Mucho gusto!' },
        { s: 'B', pt: 'O prazer é meu. De onde você é?', es: 'El gusto es mío. ¿De dónde eres?' },
        { s: 'A', pt: 'Eu sou mexicano, de Guadalajara. E você?', es: 'Soy mexicano, de Guadalajara. ¿Y tú?' },
        { s: 'B', pt: 'Eu sou brasileira, de Salvador.', es: 'Soy brasileña, de Salvador.' },
        { s: 'A', pt: 'Que legal! O que você faz?', es: '¡Qué padre! ¿A qué te dedicas?' },
        { s: 'B', pt: 'Eu sou professora de inglês. E você?', es: 'Soy profesora de inglés. ¿Y tú?' },
        { s: 'A', pt: 'Eu sou engenheiro.', es: 'Soy ingeniero.' }
      ],
      questions: [
        { q: '¿De dónde es Júlia?', options: ['De México', 'De Brasil', 'De Portugal'], answer: 1 },
        { q: '¿A qué se dedica Daniel?', options: ['Es profesor', 'Es ingeniero', 'Es médico'], answer: 1 }
      ]
    },
    {
      id: 'a1-u2-d2', title: 'Na recepção', setting: 'En la recepción de una escuela de idiomas.',
      speakers: { A: 'Recepcionista', B: 'Sofia' }, names: ['Sofia', 'Ramírez'],
      lines: [
        { s: 'A', pt: 'Bom dia! Qual é o seu nome, por favor?', es: '¡Buenos días! ¿Cuál es su nombre, por favor?' },
        { s: 'B', pt: 'Bom dia! Meu nome é Sofia Ramírez.', es: '¡Buenos días! Mi nombre es Sofia Ramírez.' },
        { s: 'A', pt: 'E qual é a sua profissão?', es: '¿Y cuál es su profesión?' },
        { s: 'B', pt: 'Eu sou advogada.', es: 'Soy abogada.' },
        { s: 'A', pt: 'Quantos anos a senhora tem?', es: '¿Cuántos años tiene usted?' },
        { s: 'B', pt: 'Eu tenho trinta e quatro anos.', es: 'Tengo treinta y cuatro años.' },
        { s: 'A', pt: 'E qual é o seu celular?', es: '¿Y cuál es su celular?' },
        { s: 'B', pt: 'É nove, meia, sete, dois, oito, zero, um, cinco.', es: 'Es nueve, seis, siete, dos, ocho, cero, uno, cinco.' },
        { s: 'A', pt: 'Obrigado, senhora. Até logo!', es: 'Gracias, señora. ¡Hasta luego!' }
      ],
      questions: [
        { q: '¿A qué se dedica Sofia?', options: ['Es médica', 'Es abogada', 'Es profesora'], answer: 1 },
        { q: '¿Cuántos años tiene?', options: ['24', '34', '44'], answer: 1 },
        { q: 'En su número, ¿qué cifra es «meia»?', options: ['0', '6', '7'], answer: 1 }
      ]
    }
  ],
  production: [
    { id: 'a1-u2-p1', prompt: 'Preséntate: di tu nombre y tu nacionalidad.', model: 'Oi! Eu me chamo Daniel. Eu sou mexicano.', keywords: ['me chamo', 'sou'] },
    { id: 'a1-u2-p2', prompt: 'Di a qué te dedicas y en qué ciudad vives.', model: 'Eu sou engenheira e moro em Monterrey.', keywords: ['sou', 'moro em'] },
    { id: 'a1-u2-p3', prompt: 'Di tu edad y tu número de celular (puede ser inventado).', model: 'Eu tenho trinta anos. Meu celular é nove, meia, dois, oito.', keywords: ['tenho', 'anos'] },
    { id: 'a1-u2-p4', prompt: 'Pregúntale a alguien su nombre, de dónde es y a qué se dedica.', model: 'Como você se chama? De onde você é? O que você faz?', keywords: ['como você se chama', 'de onde', 'o que você faz'] }
  ]
};

/* ---------- Unidades incluidas (formato compacto → esquema completo) ----------
   Los ids se derivan de números explícitos: nunca renumerar ni reutilizar. Solo agregar al final. */
const EXTRA_UNITS = [];
const X = {
  c: (n, pt, answer, es, o) => Object.assign({ n, type: 'completar', pt, answer, es }, o),
  e: (n, q, options, answer, o) => Object.assign({ n, type: 'elegir', q, options, answer }, o),
  t: (n, dir, es, pt, o) => Object.assign({ n, type: 'traducir', dir, es, pt }, o),
  o: (n, pt, es, o) => Object.assign({ n, type: 'ordenar', pt, es }, o),
  d: (n, pt, es, o) => Object.assign({ n, type: 'dictado', pt, es }, o),
  p: (n, pt, focus, tip, o) => Object.assign({ n, type: 'pronunciar', pt, focus, tip }, o)
};
function U(meta, b) {
  const id = meta.id, pad = n => String(n).padStart(3, '0'), vid = n => `${id}-v${pad(n)}`;
  const K = { p: 'parecida', f: 'falso' };
  const q3 = a => Array.isArray(a) ? { q: a[0], options: a[1], answer: a[2] } : a;
  const u = { id, level: meta.level, n: meta.n, title: meta.title };
  if (meta.titlePt) u.titlePt = meta.titlePt;
  if (meta.goals) u.goals = meta.goals;
  u.vocab = b.v.map(([n, pt, es, ex, exEs, o]) => {
    const v = { id: vid(n), pt, es, ex, exEs };
    if (o) { if (o.k) v.kind = K[o.k] || o.k; if (o.t) v.trap = o.t; if (o.f) v.forms = o.f; if (o.g) v.tags = o.g; if (o.n) v.note = o.n; }
    return v;
  });
  u.grammar = (b.g || []).map(g => {
    const o = { id: `${id}-g${g.n}`, title: g.t, body: g.b };
    if (g.after) o.after = vid(g.after); if (g.div) o.divergent = true; if (g.tb) o.table = g.tb; if (g.ck) o.check = q3(g.ck);
    return o;
  });
  u.exercises = (b.x || []).map(x => {
    const o = Object.assign({ id: `${id}-e${pad(x.n)}` }, x); delete o.n;
    if (typeof o.g === 'number') o.g = `${id}-g${o.g}`;
    if (typeof o.after === 'number') o.after = vid(o.after);
    if (o.quiz) o.quiz = q3(o.quiz);
    return o;
  });
  u.dialogues = (b.d || []).map(d => ({
    id: `${id}-d${d.n}`, title: d.title, setting: d.set, speakers: d.sp, names: d.names || Object.values(d.sp),
    lines: d.lines.map(([s, pt, es]) => ({ s, pt, es })), questions: d.q.map(q3)
  }));
  u.production = (b.p || []).map(([n, prompt, model, keywords]) => ({ id: `${id}-p${n}`, prompt, model, keywords }));
  return u;
}

/* ---------- Prueba de nivel ---------- */
const PLACEMENT = [
  { lvl: 'A1', q: 'Alguien te dice «Oi! Tudo bem?». ¿Qué respondes?', options: ['Tudo bem, e você?', 'Eu tenho vinte.', 'Boa noite, obrigado.'], answer: 0 },
  { lvl: 'A1', q: 'Ela ___ médica.', options: ['é', 'são', 'sou'], answer: 0 },
  { lvl: 'A1', q: '¿Qué significa «a gente» en «a gente mora aqui»?', options: ['la gente', 'nosotros', 'ustedes'], answer: 1 },
  { lvl: 'A1', q: 'Eu ___ dois irmãos.', options: ['tenho', 'tem', 'temos'], answer: 0 },
  { lvl: 'A2', q: 'Ontem eu ___ ao cinema.', options: ['vou', 'fui', 'ia'], answer: 1 },
  { lvl: 'A2', q: 'Quando eu era criança, eu ___ futebol todo dia.', options: ['joguei', 'jogava', 'jogo'], answer: 1 },
  { lvl: 'A2', q: 'Você já ___ feijoada?', options: ['comeu', 'come', 'comia'], answer: 0 },
  { lvl: 'A2', q: 'Este restaurante é ___ do que aquele.', options: ['melhor', 'mais bom', 'mais bem'], answer: 0 },
  { lvl: 'B1', q: 'Espero que você ___ bem.', options: ['está', 'esteja', 'estar'], answer: 1 },
  { lvl: 'B1', q: 'Quando você ___ ao Brasil, me liga.', options: ['vai', 'for', 'ir'], answer: 1 },
  { lvl: 'B1', q: 'Se eu ___ dinheiro, viajaria mais.', options: ['tenho', 'tivesse', 'tiver'], answer: 1 },
  { lvl: 'B1', q: 'É importante nós ___ cedo amanhã.', options: ['chegarmos', 'chegamos', 'chegar-nos'], answer: 0 },
  { lvl: 'B2', q: '___ o mau tempo, o voo saiu no horário.', options: ['Apesar de', 'Embora', 'Contudo'], answer: 0 },
  { lvl: 'B2', q: 'Se eu tivesse sabido, eu ___.', options: ['teria ido', 'tinha ido', 'iria'], answer: 0 },
  { lvl: 'B2', q: '«Far-se-á» es un ejemplo de…', options: ['ênclise', 'mesóclise', 'próclise'], answer: 1 },
  { lvl: 'B2', q: 'Ele disse que ___ no dia seguinte.', options: ['viria', 'vem', 'virá'], answer: 0 }
];

/* ---------- Input externo (desde B1) ---------- */
const INPUT_SUGGESTIONS = {
  B1: [
    { type: 'Serie', name: 'Turma da Mônica', why: 'Dibujos y cómics con lenguaje cotidiano y claro.' },
    { type: 'Video', name: 'Manual do Mundo (YouTube)', why: 'Experimentos y curiosidades; hablan claro y con mucho apoyo visual.' },
    { type: 'Serie', name: 'Coisa Mais Linda (Netflix)', why: 'Drama de época en Río, ritmo pausado. Usa subtítulos en portugués.' },
    { type: 'Lectura', name: 'O Pequeno Príncipe, en portugués', why: 'Ya conoces la historia, así que puedes enfocarte en la lengua.' },
    { type: 'Lectura', name: 'Joca, jornal para jovens', why: 'Periódico para jóvenes: noticias reales con lenguaje sencillo.' },
    { type: 'Podcast', name: 'Podcasts para extranjeros con transcripción', why: 'Busca «podcast português brasileiro para estrangeiros»: episodios cortos y lentos.' }
  ],
  B2: [
    { type: 'Podcast', name: 'Café da Manhã (Folha de S.Paulo)', why: 'Las noticias del día en formato conversación, unos 25 minutos.' },
    { type: 'Podcast', name: 'Projeto Humanos', why: 'Historias reales narradas; vocabulario rico y buena dicción.' },
    { type: 'Podcast', name: 'Nerdcast (Jovem Nerd)', why: 'Charla informal y rápida, con muchas reducciones del habla real.' },
    { type: 'Serie', name: 'Cidade Invisível (Netflix)', why: 'Folclore brasileño con habla actual de Río.' },
    { type: 'Serie', name: '3% (Netflix)', why: 'Ciencia ficción con diálogos claros y registro variado.' },
    { type: 'Serie', name: 'Sintonia (Netflix)', why: 'Jerga de la periferia de São Paulo; un reto alto y muy real.' },
    { type: 'Lectura', name: 'Capitães da Areia (Jorge Amado)', why: 'Novela clásica de Salvador, prosa accesible para B2.' },
    { type: 'Lectura', name: 'G1 o Nexo Jornal', why: 'Noticias y explicativos sobre la actualidad de Brasil.' }
  ]
};

/* ---------- Especificación del paquete (se puede copiar desde la app) ---------- */
const PACK_SPEC = `ESPECIFICACIÓN DEL PAQUETE DE CONTENIDO · Ponte Português · formato "ptbr-pack" v1

Devuelve UN solo objeto JSON válido (sin comentarios ni texto alrededor) con 1 o 2 unidades.
Portugués de Brasil natural; explicaciones breves en español de México, comparando con el español.

{
  "format": "ptbr-pack",
  "version": 1,
  "packId": "a1-u3-u4",
  "units": [ Unidad, ... ]
}

UNIDAD
  id          "a1-u3"  → (a1|a2|b1|b2)-u(1..8); fija su lugar en el temario
  level       "A1"     (debe coincidir con el id)
  n           3        (debe coincidir con el id)
  title       título en español
  goals       [opcional] 2–4 objetivos en español
  vocab       [Vocab]       ordenado de más a menos frecuente (es el orden de enseñanza)
  grammar     [Nota]        2–4 notas breves
  exercises   [Ejercicio]   15–30, de tipos variados
  dialogues   [Diálogo]     1–2
  production  [Producción]  2–4

IDS (obligatorio): únicos y estables; empiezan con el id de la unidad + "-":
  vocab a1-u3-v001 · notas a1-u3-g1 · ejercicios a1-u3-e001 · diálogos a1-u3-d1 · producción a1-u3-p1
  Nunca cambies ni reutilices un id publicado: el progreso se guarda por id.

VOCAB { id, pt, es, ex, exEs, kind?, trap?, forms?, tags?, note? }
  pt     palabra o expresión; sustantivos con artículo ("a mãe").
         Variantes con " / " y forma completa: "o médico / a médica" (no "o/a médico").
  es     traducción; acepciones separadas por " / "
  ex     frase natural en pt-BR que contiene la palabra (3–10 palabras ideal); exEs = su traducción
  kind   "nueva" (por defecto) | "parecida" (cognado → ronda rápida) | "falso" (falso amigo)
  trap   solo con "falso": el significado engañoso en español
  forms  formas que aparecen en frases y diálogos (["tenho","tem","temos"])
  tags   foco de pronunciación: nasal, abierta, cerrada, final-e, final-o, ti-di, r, lh, nh, s-z
  note   consejo breve en español

NOTA { id, title, body, after?, divergent?, table?, check? }
  body       español; admite **negrita**, *portugués en cursiva* y líneas "- " como lista
  after      id de vocab tras el cual aparece (sin after = al inicio de la unidad)
  divergent  true si difiere del español
  table      [["pt","es"], ...]
  check      { "q": "...", "options": ["..",".."], "answer": 0 }   (answer = índice desde 0)

EJERCICIO { id, type, g?, after?, explain?, ...campos }
  g / after: se activa al mostrarse la nota g o al presentarse el vocab after
             (sin ninguno: cuando se presentó la mitad del vocabulario)
  completar   { pt: "Eu ___ mexicano.", answer: "sou", accept?: [], es, hint? }   un solo "___"
  elegir      { q, options: [2–5], answer: índice, pt? }
  traducir    { dir: "es-pt" | "pt-es", es, pt, accept?: [] }
  ordenar     { pt (3–10 palabras), es }
  dictado     { pt, es }
  pronunciar  { pt, focus: tag, tip, pair?: ["pau","pão"], quiz?: { q, options, answer } }
              pair = par mínimo para discriminar al oído; quiz = alternativa de lectura

DIÁLOGO { id, title, setting?, speakers: {"A":"Nombre","B":"Nombre"}, names?: [],
          lines: [ { s: "A", pt, es } ], questions: [ { q, options, answer } ] }
  4–10 líneas con 90–95 % de vocabulario ya visto; names = nombres propios; 1–3 preguntas en español.

PRODUCCIÓN { id, prompt (español), model (pt-BR), keywords?: [] }

CALIDAD: frases naturales de Brasil; marcar falsos amigos (kind "falso" + trap) y gramática divergente;
A1–A2: 60–100 palabras nuevas por unidad; B1: 120–150; B2: 180–220. Cada unidad pesa menos de 230 KB.`;
