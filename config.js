/* ==========================================================
   CONFIGURACIÓN DEL PORTAFOLIO
   Todo lo que ves en la página sale de este archivo.
   No hace falta tocar index.html, style.css ni main.js.

   ICONOS (campo "icon"), podés usar:
     "si:github"          -> Simple Icons (redes, marcas)  https://simpleicons.org
     "devicon:python"     -> Devicon (lenguajes, librerías) https://devicon.dev
     "devicon:java:plain" -> Devicon con variante distinta a "original"
     "assets/mi-icono.png" o "https://..." -> imagen propia
   ========================================================== */

window.PORTFOLIO = {
  /* Título de la pestaña del navegador */
  title: "Daichow | Portafolio",

  /* Orden de las secciones. Reordená, quitá o repetí a gusto.
     Disponibles: "profile", "socials", "music", "skills", "categories" */
  sections: ["profile", "socials", "music", "skills", "categories"],

  /* ---------- Apariencia ---------- */
  theme: {
    accent: "#8b5cf6",          // color principal
    accent2: "#ec4899",         // segundo color (degradados)
    text: "#f3f4f6",
    muted: "#9ca3af",
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(255,255,255,0.10)",
    radius: "18px",
    blur: "14px",               // desenfoque "glass" de las tarjetas
    font: "'Inter', system-ui, sans-serif",
    maxWidth: "860px"
  },

  /* Fondo: "gradient" | "image" | "video" */
  background: {
    type: "gradient",
    value: "radial-gradient(1200px 600px at 20% -10%, #2a1a4d 0%, transparent 60%), radial-gradient(900px 500px at 100% 10%, #4d1a3a 0%, transparent 55%), #0b0b10",
    // type: "image" -> value: "assets/fondo.jpg"
    // type: "video" -> value: "assets/fondo.mp4"
    overlay: 0.35,              // 0 a 1: oscurece imagen/video para que se lea el texto
    blur: 0                     // px de desenfoque del fondo
  },

  /* Efectos */
  effects: {
    particles: true,            // partículas flotando
    particleCount: 60,
    tilt: true,                 // inclinación 3D al pasar el mouse por las tarjetas
    typing: true,               // efecto de tipeo en la frase
    entrance: true              // animación de aparición
  },

  /* ---------- Perfil ---------- */
  profile: {
    name: "Daichow",
    avatar: "https://avatars.githubusercontent.com/u/9919?v=4", // cambiá por tu foto
    avatarShape: "circle",      // "circle" | "rounded" | "square"
    // Si hay varias frases, rotan con efecto de tipeo
    tagline: [
      "Developer of Apps and Projects",
      "Modding Games and Creating Mods",
      "Trying to learn always"
    ],
    bio: "I like to learn new things everyday!",
    location: "Argentina, Córdoba",      // dejalo vacío "" para ocultarlo
    badges: ["Student", "Open source", "Modder", ""] // etiquetitas opcionales
  },

  /* ---------- Música ---------- */
  music: {
    enabled: true,
    enterScreen: true,          // pantalla "Click para entrar" (los navegadores bloquean el autoplay)
    enterText: "CLICK TO ENTER",
    volume: 0.4,                // 0 a 1
    loop: true,                 // al terminar la lista, vuelve a empezar
    // Poné tus archivos en la carpeta assets/music/
    tracks: [
      { title: "Mi canción 1", artist: "Artista", src: "assets/music/cancion1.mp3", cover: "" },
      { title: "Mi canción 2", artist: "Artista", src: "assets/music/cancion2.mp3", cover: "" }
    ]
  },

  /* ---------- Redes sociales ---------- */
  socials: [
    { name: "GitHub",    icon: "si:github",    url: "https://github.com/DaichowDev" },
    { name: "Discord",   icon: "si:discord",   url: "https://discord.com/users/201544043920883712" }
  ],

  /* ---------- Skills ---------- */
  skills: [
    {
      title: "Lenguajes",
      items: [
        { name: "JavaScript", icon: "devicon:javascript" },
        { name: "TypeScript", icon: "devicon:typescript" },
        { name: "Python",     icon: "devicon:python" },
        { name: "Java",       icon: "devicon:java" },
        { name: "C#",         icon: "devicon:csharp" },
        { name: "C++",        icon: "devicon:cplusplus" },
        { name: "HTML5",      icon: "devicon:html5" },
        { name: "CSS3",       icon: "devicon:css3" }
      ]
    },
    {
      title: "Librerías y herramientas",
      items: [
        { name: "React",   icon: "devicon:react" },
        { name: "Node.js", icon: "devicon:nodejs" },
        { name: "Git",     icon: "devicon:git" },
        { name: "Docker",  icon: "devicon:docker" },
        { name: "Unity",   icon: "devicon:unity" },
        { name: "Linux",   icon: "devicon:linux" }
      ]
    }
  ],
  skillIconSize: 44,            // tamaño de los iconos en px
  skillNames: "hover",          // "hover" (tooltip) | "always" (siempre visible) | "never"

  /* ---------- Categorías (Gridview) ----------
     Agregá todas las que quieras. Cada una abre un panel con sus items. */
  categories: [
    {
      id: "projects",
      title: "Projects",
      icon: "🚀",                // emoji, o "si:..." / "devicon:..." / ruta de imagen
      description: "Cosas que construí",
      image: "",                 // opcional: imagen de portada de la categoría
      items: [
        {
          title: "Proyecto de ejemplo",
          description: "Breve descripción de qué hace y con qué está hecho.",
          image: "",             // opcional: captura o logo
          tags: ["JavaScript", "Web"],
          links: [
            { label: "Código", url: "https://github.com/tuusuario/proyecto" },
            { label: "Demo",   url: "https://tuusuario.github.io/proyecto" }
          ]
        },
        {
          title: "Otro proyecto",
          description: "Otra descripción corta.",
          tags: ["Python", "Bot"],
          links: [{ label: "Código", url: "https://github.com/tuusuario/otro" }]
        }
      ]
    },
    {
      id: "mods",
      title: "Mods",
      icon: "🧩",
      description: "Mods y plugins que hice",
      items: [
        {
          title: "Mod de ejemplo",
          description: "Qué agrega o cambia el mod.",
          tags: ["Minecraft", "Java"],
          links: [{ label: "Descargar", url: "https://modrinth.com/" }]
        }
      ]
    },
    {
      id: "tools",
      title: "Herramientas",
      icon: "🛠️",
      description: "Utilidades y scripts",
      items: []                  // vacío: muestra "Próximamente"
    },
    {
      id: "games",
      title: "Juegos",
      icon: "🎮",
      description: "Juegos y prototipos",
      items: []
    }
  ],
  categoryColumns: 2,           // columnas del grid en escritorio (en celular se ajusta solo)

  /* ---------- Pie de página ---------- */
  footer: "You can always contact me if you want to work with me :)"
};
