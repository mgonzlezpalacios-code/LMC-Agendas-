// Datos simulados (mock). Reemplázalos por los datos reales del laboratorio
// o conéctalos a una API cuando exista un backend.

export const LAB = {
  name: 'Laboratorio de Materia Condensada',
  short: 'LMC',
  institution: 'Escuela Politécnica Nacional',
  city: 'Quito, Ecuador',
  instagramHandle: '@lmc.epn',
  instagramUrl: 'https://www.instagram.com/lmc.epn/',
}

export const NEWS_TAGS = ['Investigación', 'Comunidad', 'Equipamiento', 'Divulgación', 'Aviso']

// Noticias de ejemplo: se pueden editar o eliminar desde la app
export const initialNews = [
  {
    id: 'n1',
    date: '2026-10-08',
    tag: 'Investigación',
    title: 'Primeras monocapas continuas de grafeno en el nuevo horno CVD',
    body: 'Tras varias semanas de ajuste de parámetros, el equipo de síntesis obtuvo películas continuas sobre lámina de cobre. El siguiente paso es la transferencia a sustratos aislantes.',
  },
  {
    id: 'n2',
    date: '2026-10-02',
    tag: 'Comunidad',
    title: 'Bienvenida a los nuevos tesistas del semestre 2026-B',
    body: 'Cuatro estudiantes de Física se incorporan al laboratorio para desarrollar sus trabajos de titulación en síntesis y caracterización de nanomateriales.',
  },
  {
    id: 'n3',
    date: '2026-09-24',
    tag: 'Equipamiento',
    title: 'Mantenimiento del espectrómetro Raman completado',
    body: 'El equipo vuelve a estar disponible. Recuerda reservar tu turno y registrar cada sesión en la bitácora.',
  },
]

export const EVENT_TYPES = {
  evento: { label: 'Evento', chip: 'bg-blue-50 text-epn-blue', block: 'bg-epn-blue' },
  visita: { label: 'Visita', chip: 'bg-violet-50 text-violet-700', block: 'bg-violet-600' },
  capacitacion: { label: 'Capacitación', chip: 'bg-amber-50 text-amber-700', block: 'bg-amber-500' },
  equipo: { label: 'Equipo nuevo', chip: 'bg-emerald-50 text-emerald-700', block: 'bg-emerald-600' },
}

// Eventos de ejemplo: se pueden editar o eliminar desde la app
export const initialEvents = [
  { id: 'v1', type: 'evento', date: '2026-10-14', time: '11:00', title: 'Seminario interno: transporte en materiales 2D', place: 'Aula de seminarios, Facultad de Ciencias', description: '' },
  { id: 'v2', type: 'visita', date: '2026-10-22', time: '09:30', title: 'Visita de estudiantes de bachillerato', place: 'Laboratorio de Materia Condensada', description: 'Recorrido por los equipos y demostración de exfoliación de grafito.' },
  { id: 'v3', type: 'capacitacion', date: '2026-11-05', time: '15:00', title: 'Capacitación: uso del espectrómetro FT-IR', place: 'Laboratorio de Materia Condensada', description: 'Dirigida a nuevos usuarios del laboratorio.' },
  { id: 'v4', type: 'equipo', date: '2026-11-18', time: '', title: 'Llegada del nuevo baño ultrasónico', place: 'Bodega del laboratorio', description: 'Coordinar recepción e instalación.' },
]

export const facts = [
  {
    title: 'Un átomo de espesor',
    text: 'El grafeno es una lámina de carbono de un solo átomo de espesor, unos 0,34 nm. Aun así, una sola capa absorbe cerca del 2,3 % de la luz visible, suficiente para verla a simple vista sobre el sustrato adecuado.',
  },
  {
    title: 'Nobel con cinta adhesiva',
    text: 'Andre Geim y Konstantin Novoselov aislaron grafeno en 2004 despegando capas de grafito con cinta adhesiva. Recibieron el Premio Nobel de Física en 2010.',
  },
  {
    title: 'Más resistente que el acero',
    text: 'El grafeno tiene una resistencia intrínseca de unos 130 GPa y un módulo de Young cercano a 1 TPa, lo que lo sitúa entre los materiales más resistentes jamás medidos.',
  },
  {
    title: 'Electrones sin masa',
    text: 'En el grafeno los electrones se comportan como fermiones de Dirac sin masa y se mueven a aproximadamente un millón de metros por segundo, unas 300 veces más lento que la luz.',
  },
  {
    title: 'El ángulo mágico',
    text: 'Al apilar dos capas de grafeno rotadas alrededor de 1,1° aparecen bandas planas y, a bajas temperaturas, superconductividad. El hallazgo de 2018 dio origen a la “twistrónica”.',
  },
  {
    title: 'Oro que no es dorado',
    text: 'Las nanopartículas de oro pueden verse rojas o púrpuras: su color depende del tamaño por la resonancia de plasmón superficial. La copa romana de Licurgo, del siglo IV, ya aprovechaba este efecto.',
  },
  {
    title: 'El color depende del tamaño',
    text: 'Los puntos cuánticos emiten luz de distinto color según su tamaño debido al confinamiento cuántico. Su descubrimiento y síntesis fueron reconocidos con el Nobel de Química 2023.',
  },
  {
    title: '¿Cuánto es un nanómetro?',
    text: 'Un nanómetro es la milmillonésima parte de un metro. Un cabello humano mide entre 80 000 y 100 000 nm de ancho.',
  },
  {
    title: 'Una cancha en un gramo',
    text: 'El área superficial teórica del grafeno es de unos 2 630 m² por gramo: unos pocos gramos bastarían para cubrir una cancha de fútbol.',
  },
  {
    title: 'Tubos que conducen calor',
    text: 'Los nanotubos de carbono individuales conducen el calor a lo largo de su eje mejor que el cobre, con conductividades térmicas medidas del orden de 3 000 W/m·K.',
  },
  {
    title: 'Las patas del geco',
    text: 'Los gecos se adhieren a las paredes gracias a millones de pelos con terminaciones nanométricas que interactúan con la superficie mediante fuerzas de van der Waals.',
  },
  {
    title: 'Casi todo es superficie',
    text: 'En una nanopartícula de pocos nanómetros una fracción importante de los átomos está en la superficie. Por eso sus propiedades químicas y catalíticas difieren tanto de las del material en bloque.',
  },
]

// Premios Nobel de ciencias 2026 (anunciados del 5 al 7 de octubre de 2026)
export const nobel = {
  year: 2026,
  prizes: [
    {
      field: 'Física',
      accent: 'bg-epn-blue',
      chip: 'bg-blue-50 text-epn-blue',
      laureates: 'Francis Halzen',
      where: 'Universidad de Wisconsin–Madison (EE. UU.)',
      topic: 'Neutrinos cósmicos de alta energía',
      text: 'Premiado por sus contribuciones decisivas al Observatorio de Neutrinos IceCube y al descubrimiento de neutrinos de alta energía de origen astrofísico. IceCube es un kilómetro cúbico de hielo antártico equipado con sensores de luz, enterrados a unos 2 km de profundidad, que registran el destello que deja un neutrino al interactuar.',
      url: 'https://www.nobelprize.org/prizes/physics/2026/press-release/',
    },
    {
      field: 'Química',
      accent: 'bg-emerald-600',
      chip: 'bg-emerald-50 text-emerald-700',
      laureates: 'Henri B. Kagan y Kenso Soai',
      where: 'Université Paris-Sud (Francia) · Tokyo University of Science (Japón)',
      topic: 'Moléculas espejo y origen de la homoquiralidad',
      text: 'Reconocidos por el descubrimiento de los efectos no lineales y de la autocatálisis en la síntesis orgánica asimétrica. Su trabajo muestra cómo un pequeño exceso de una de las dos formas espejo de una molécula puede amplificarse, y ha sido clave para diseñar reacciones con las que se fabrican medicamentos.',
      url: 'https://www.nobelprize.org/prizes/chemistry/2026/press-release/',
    },
    {
      field: 'Fisiología o Medicina',
      accent: 'bg-epn-red',
      chip: 'bg-red-50 text-epn-red',
      laureates: 'Karl Deisseroth, Peter Hegemann y Georg Nagel',
      where: 'Stanford (EE. UU.) · Universidad Humboldt de Berlín · Universidad de Wurzburgo (Alemania)',
      topic: 'Optogenética',
      text: 'Galardonados por los canales iónicos activados por luz y la optogenética. Hegemann y Nagel descubrieron la canalrodopsina; Deisseroth introdujo su gen en neuronas y logró disparar una señal nerviosa iluminándolas con luz azul. La técnica permite encender o apagar neuronas individuales en un cerebro vivo.',
      url: 'https://www.nobelprize.org/prizes/medicine/2026/press-release/',
    },
  ],
}

export const NOTE_TYPES = {
  apunte: { label: 'Apunte', chip: 'bg-slate-100 text-slate-700' },
  experimento: { label: 'Experimento', chip: 'bg-blue-50 text-epn-blue' },
  protocolo: { label: 'Protocolo', chip: 'bg-emerald-50 text-emerald-700' },
}

// Notas de ejemplo: se pueden editar o eliminar desde la app
export const initialNotes = [
  {
    id: 'note-1',
    type: 'experimento',
    title: 'Exfoliación en fase líquida — lote G-27',
    date: '2026-10-10',
    description: 'Grafito en polvo dispersado en NMP. Sonicación en baño durante 4 h, seguida de centrifugación a 3000 rpm por 30 min. Se recuperó el sobrenadante.',
    results: 'Dispersión gris oscura estable tras 24 h. Pendiente: espectro UV-Vis para estimar concentración y Raman sobre gota depositada.',
  },
  {
    id: 'note-2',
    type: 'protocolo',
    title: 'Cambio de solución KCl 3M en electrodos de referencia',
    date: '2026-10-06',
    description: '1. Retirar el electrodo y enjuagar con agua destilada.\n2. Vaciar la solución usada por el orificio de llenado.\n3. Rellenar con KCl 3M fresco sin dejar burbujas.\n4. Registrar el cambio en la hoja del equipo.',
    results: '',
  },
]
