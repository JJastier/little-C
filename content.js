/*
 * Todo el texto visible de la experiencia vive en este archivo.
 * Puedes cambiar las frases entre comillas sin tocar script.js.
 */
window.BIRTHDAY_CONTENT = Object.freeze({
  metadata: {
    title: "Para C",
    description: "Una pequeña experiencia de cumpleaños."
  },

  accessibility: {
    experienceLabel: "Una pequeña experiencia de cumpleaños",
    optionGroupLabel: "Elige una de las tres posibilidades"
  },

  scenes: {
    entry: {
      kicker: "Un pequeño paréntesis",
      initial: "C",
      lead: "Tengo algo pequeño para ti.",
      note: "No se abre inmediatamente.",
      button: "Abrir"
    },

    memory: {
      number: "01",
      title: "Antes de continuar...",
      prompt: "Piensa por un momento en alguna de esas comidas especiales que aparecían cualquier día, sin necesitar una ocasión.",
      button: "Ya tengo una"
    },

    choice: {
      number: "02",
      title: "¿Qué convirtió muchos días normales en algo especial?",
      options: [
        {
          id: "flower",
          label: "Una flor",
          feedback: "Cerca... pero no."
        },
        {
          id: "gift",
          label: "Un regalo",
          feedback: "Tampoco necesitábamos una ocasión, pero otra cosa."
        },
        {
          id: "meal",
          label: "Una comida",
          feedback: "Sí. Esa era fácil, somos bien tragones.",
          unlocks: true
        }
      ],
      button: "Abrir"
    },

    message: {
      title: "Feliz cumpleaños.",
      paragraphs: [
        "Hay personas que, aunque el tiempo cambie muchas cosas, dejan recuerdos bonitos que siguen teniendo un lugar especial.",
        "De ti recuerdo especialmente tu ternura, esas comidas especiales capaces de volver especial cualquier día, y la forma en que estuviste a mi lado cuando realmente importaba.",
        "Parte del hombre que soy hoy también se construyó contigo.",
        "Espero que este nuevo año te traiga mucha tranquilidad y muchas cosas bonitas. Te las mereces."
      ],
      closingLead: "Feliz día",
      closingInitial: "C"
    }
  }
});
