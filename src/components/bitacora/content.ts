// Datos y contenido de MedicHands-Bitacora
export const imagen1 = '/bitacora-assets/logoMH.png';
export const imagene = '/bitacora-assets/efrain.png';
export const imageny = '/bitacora-assets/yeray.png';
export const imagenc = '/bitacora-assets/citlali.png';

export const navLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Obstáculos', href: '#problema' },
  { name: 'Nosotros', href: '#nosotros' },
  { name: 'Divulgación', href: '#difusion' },
  { name: 'Educación', href: '#educacion' },
];

export const problemCards = [
  {
    title: 'Migración de Tecnologías',
    desc: 'En las primeras versiones de la plataforma de MedicHands se exploraron diversas tecnologías para optimizar el procesamiento en el borde y la arquitectura en capas.',
  },
  {
    title: 'Evolución del Hardware',
    desc: 'La evolución del diseño físico requirió transicionar de textiles cosidos a copas ergonómicas de TPU 3D biocompatibles y lavables.',
  },
  {
    title: 'Casos sin Seguimiento',
    desc: 'Al revisar registros de detección temprana, detectamos la necesidad de brindar una plataforma continua y accesible que empodere tanto a mujeres como a varones.',
  },
  {
    title: 'Reto de Información Actualizada',
    desc: 'Encontrar datos epidemiológicos locales actualizados y rigurosos fue un desafío que impulsó nuestro compromiso con la investigación científica.',
  },
  {
    title: 'Difusión en Salud Mamaria',
    desc: 'La escasez de información preventiva oportuna limita la detección temprana; buscamos democratizar el acceso a este conocimiento vital.',
  },
];

export const values = [
  'Empatía', 'Innovación', 'Prevención', 'Accesibilidad', 'Responsabilidad', 'Privacidad'
];

export const team = [
  { name: 'Citlalli Sarai Rivera Escareño', role: 'Investigadora y Desarrolladora', contact: 'crivera14@ucol.mx', img: imagenc },
  { name: 'Jetzael Yeray Anguiano Solis', role: 'Investigador y Desarrollador', contact: 'janguiano27@ucol.mx', img: imageny },
  { name: 'Efraín Alejandro Arias Meza', role: 'Investigador y Desarrollador', contact: 'earias7@ucol.mx', img: imagene },
];

export const valueProps = [
  { title: 'Prevención', desc: 'Fomentamos el cuidado constante y la revisión oportuna.' },
  { title: 'Tecnología', desc: 'Herramientas modernas para capturar información interpretable por especialistas de la salud.' },
  { title: 'Acompañamiento', desc: 'Información clara para guiar tus próximos pasos en salud.' },
];

export const preventionTopics = [
  {
    title: 'Cáncer de mama',
    desc: 'Información general y contexto sobre la importancia de la detección temprana.',
    link: 'https://incan.salud.gob.mx/p/info/tumores-mama',
  },
  {
    title: 'Autoexploración',
    desc: 'Guía básica de cómo y cuándo realizar una autoexploración mensual.',
    link: 'https://www.gob.mx/salud/acciones-y-programas/cancer-de-mama-autoexploracion-de-mamas',
  },
  {
    title: 'Signos de alerta',
    desc: 'Cambios físicos a los que debes prestar atención.',
    link: 'https://www.cancer.org/es/cancer/tipos/cancer-de-seno/pruebas-de-deteccion-y-deteccion-temprana-del-cancer-de-seno/signos-y-sintomas-del-cancer-de-seno.html',
  },
  {
    title: 'Mitos y realidades',
    desc: 'Desmintiendo creencias comunes sobre la salud mamaria.',
    link: 'https://www.bbva.mx/educacion-financiera/seguros/seguro-salud/seguro-medico-particular-mitos-y-realidades-del-cancer-de-mama.html',
  },
];

export const imagenes = [
  {
    title: 'Figura 1',
    desc: 'Mockup y kit de MedicHands',
    img: imagen1,
  },
];

export const difusionItems = [
  {
    type: 'Artículo de Investigación (2016)',
    title: 'Temperature Monitoring System of Human Breast in Early Breast Cancer Detection',
    desc: 'Artículo pionero publicado por el Dr. Jesús Alberto Verduzco Ramírez en la revista RICS Iberoamericana de las Ciencias de la Salud.',
    link: 'https://www.rics.org.mx/index.php/RICS/article/view/24',
    linkText: 'Leer Artículo',
  },
  {
    type: 'Artículo de Investigación (CITCA 2026)',
    title: 'Asynchronous Monitoring System for Thermal Anomalies Associated with Breast Tumor Formation',
    desc: 'Publicado en el 6to Congreso Internacional de Tecnología y Ciencia Aplicada (CITCA), validando la asimetría térmica contralateral con 94.2% de precisión técnica.',
    link: 'https://jcyta.cenidet.tecnm.mx/revistas/tycap/16-Vol9_Num1_Enero-Junio_2026.pdf',
    linkText: 'Leer Artículo',
  },
  {
    type: 'Nota de Publicación UCol',
    title: 'Estudiantes de la FIME presentan proyecto de computación inteligente en congreso internacional',
    desc: 'Estudiantes de la carrera de Ingeniería en Computación Inteligente participan en el Congreso Internacional CITCA.',
    link: 'https://www.facebook.com/story.php?story_fbid=1624729766320522&id=100063505422811',
    linkText: 'Leer Nota UCol',
  },
  {
    type: 'Difusión Universitaria',
    title: 'Desarrollan estudiantes de la FIME dispositivo para apoyar la detección preventiva del cáncer de mama',
    desc: 'Cobertura oficial institucional sobre el prototipo y alcance social de MedicHands.',
    link: 'https://www.facebook.com/story.php?story_fbid=1723715019755712&id=100063516915637',
    linkText: 'Leer Nota',
  },
  {
    type: 'Charla Universitaria',
    title: 'Charla Ingeniería que Cuida: señales que pueden cambiar una vida',
    desc: 'Durante la semana de lucha contra el Cáncer de Mama, la ponente Citlalli Escareño presenta el proyecto MedicHands y la importancia de la detección temprana y aplicación de la tecnología en el cuidado de la salud.',
    link: 'https://tesis-kappa.vercel.app/workshopDetail/charla_ingenieria_que_cuida_senales_que_pueden_cambiar_una_vida_6acd63df1b0ebb220745a3e5',
    linkText: 'Ver Evento',
  },  
  {
    type: 'Lanzamiento Oficial de MediCommunity',
    title: 'Lanzamiento Oficial de Canal de difusión MediCommunity',
    desc: 'Lanzamiento del canal de difusión MediCommunity, espacio para compartir información sobre la detección temprana del cáncer de mama, tips de salud y bienestar.',
    link: 'https://medicommunity.vercel.app/',
    linkText: 'Visitar sitio',
  },  
];
