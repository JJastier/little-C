(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const content = window.BIRTHDAY_CONTENT;

    if (!content || !content.scenes) {
      throw new Error("No se pudo cargar el contenido de la experiencia.");
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const transitionDuration = function () {
      return prefersReducedMotion.matches ? 0 : 300;
    };

    const scenes = Array.from(document.querySelectorAll("[data-scene]"));
    let currentScene = document.querySelector(".scene.is-active");
    let isTransitioning = false;
    let memoryTimer = null;

    const byId = function (id) {
      return document.getElementById(id);
    };

    const setText = function (id, value) {
      const element = byId(id);
      if (element) {
        element.textContent = value;
      }
    };

    function iconMarkup(type) {
      const icons = {
        flower: [
          '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">',
          '<path d="M20 18c-4.8 0-7.2-3-7.2-6.2 0-2.4 1.7-4.2 4-4.2 1.6 0 2.7.8 3.2 2 .5-1.2 1.6-2 3.2-2 2.3 0 4 1.8 4 4.2 0 3.2-2.4 6.2-7.2 6.2Z"/>',
          '<path d="M20 18c-4.6 0-7.6 2.5-7.6 5.5 0 2.2 1.8 4 4.2 4 1.6 0 2.8-.8 3.4-2 .6 1.2 1.8 2 3.4 2 2.4 0 4.2-1.8 4.2-4 0-3-3-5.5-7.6-5.5Z"/>',
          '<path d="M20 25v10M20 31c3.6-3.2 6.2-2.7 7.7-1.5-1 2.7-4.3 3.6-7.7 2.6M20 29c-3-3.1-5.6-2.8-7.1-1.7.8 2.4 3.9 3.4 7.1 2.6"/>',
          '</svg>'
        ].join(""),
        gift: [
          '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">',
          '<path d="M7.5 17.5h25v17h-25zM5.5 12.5h29v6h-29zM20 12.5v22"/>',
          '<path d="M20 12.5c-4.8 0-8.5-.4-8.5-3.4 0-1.9 1.4-3.1 3.3-3.1 3.2 0 5.2 4.2 5.2 6.5ZM20 12.5c4.8 0 8.5-.4 8.5-3.4 0-1.9-1.4-3.1-3.3-3.1-3.2 0-5.2 4.2-5.2 6.5Z"/>',
          '</svg>'
        ].join(""),
        meal: [
          '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">',
          '<path d="M7 27.5h26M9.5 27.5c.7-7.1 4.4-11 10.5-11s9.8 3.9 10.5 11M20 16.5v-3.2M17.8 13.3h4.4M5.5 31.5h29"/>',
          '</svg>'
        ].join("")
      };

      return icons[type] || "";
    }

    function populateContent() {
      const entry = content.scenes.entry;
      const memory = content.scenes.memory;
      const choice = content.scenes.choice;
      const message = content.scenes.message;

      document.title = content.metadata.title;
      document.querySelector('meta[name="description"]').setAttribute("content", content.metadata.description);
      byId("experience").setAttribute("aria-label", content.accessibility.experienceLabel);

      setText("entry-kicker", entry.kicker);
      setText("entry-title", entry.initial);
      setText("entry-lead", entry.lead);
      setText("entry-note", entry.note);
      setText("entry-open", entry.button);

      setText("memory-number", memory.number);
      setText("memory-title", memory.title);
      setText("memory-prompt", memory.prompt);
      setText("memory-continue", memory.button);

      setText("choice-number", choice.number);
      setText("choice-title", choice.title);
      setText("choice-open", choice.button);
      byId("choices").setAttribute("aria-label", content.accessibility.optionGroupLabel);

      const choicesContainer = byId("choices");
      choice.options.forEach(function (option) {
        const button = document.createElement("button");
        button.className = "choice";
        button.type = "button";
        button.dataset.choice = option.id;
        button.setAttribute("aria-pressed", "false");
        button.innerHTML =
          '<span class="choice__icon">' + iconMarkup(option.id) + "</span>" +
          '<span class="choice__label"></span>';
        button.querySelector(".choice__label").textContent = option.label;
        button.addEventListener("click", function () {
          handleChoice(option, button);
        });
        choicesContainer.appendChild(button);
      });

      setText("message-title", message.title);
      const messageBody = byId("message-body");
      message.paragraphs.forEach(function (paragraph) {
        const element = document.createElement("p");
        element.textContent = paragraph;
        messageBody.appendChild(element);
      });

      const closing = byId("message-closing");
      closing.append(document.createTextNode(message.closingLead + " "));
      const initial = document.createElement("span");
      initial.className = "closing-initial";
      initial.textContent = message.closingInitial;
      closing.appendChild(initial);
    }

    function revealMemoryButton() {
      const button = byId("memory-continue");
      button.disabled = false;
      button.classList.add("is-ready");
    }

    function showScene(name) {
      const nextScene = scenes.find(function (scene) {
        return scene.dataset.scene === name;
      });

      if (!nextScene || nextScene === currentScene || isTransitioning) {
        return;
      }

      isTransitioning = true;
      currentScene.classList.remove("is-active");
      currentScene.classList.add("is-leaving");

      window.setTimeout(function () {
        currentScene.classList.remove("is-leaving");
        currentScene.hidden = true;
        currentScene.setAttribute("aria-hidden", "true");

        nextScene.hidden = false;
        nextScene.removeAttribute("aria-hidden");
        window.scrollTo(0, 0);

        window.requestAnimationFrame(function () {
          nextScene.classList.add("is-active");
          const heading = nextScene.querySelector("h1, h2");
          if (heading) {
            heading.focus({ preventScroll: true });
          }
          currentScene = nextScene;
          isTransitioning = false;

          if (name === "memory") {
            window.clearTimeout(memoryTimer);
            memoryTimer = window.setTimeout(
              revealMemoryButton,
              prefersReducedMotion.matches ? 80 : 1800
            );
          }
        });
      }, transitionDuration());
    }

    function handleChoice(option, button) {
      const feedback = byId("choice-feedback");
      feedback.classList.remove("is-changing");
      void feedback.offsetWidth;
      feedback.textContent = option.feedback;
      feedback.classList.add("is-changing");

      if (!option.unlocks) {
        button.classList.remove("is-gently-wrong");
        void button.offsetWidth;
        button.classList.add("is-gently-wrong");
        return;
      }

      const choiceButtons = Array.from(document.querySelectorAll(".choice"));
      choiceButtons.forEach(function (choiceButton) {
        const isSelected = choiceButton === button;
        choiceButton.disabled = true;
        choiceButton.classList.toggle("is-selected", isSelected);
        choiceButton.setAttribute("aria-pressed", String(isSelected));
      });

      const openButton = byId("choice-open");
      openButton.hidden = false;
      window.setTimeout(function () {
        openButton.focus({ preventScroll: true });
      }, prefersReducedMotion.matches ? 0 : 360);
    }

    populateContent();

    byId("entry-open").addEventListener("click", function () {
      showScene("memory");
    });

    byId("memory-continue").addEventListener("click", function () {
      showScene("choice");
    });

    byId("choice-open").addEventListener("click", function () {
      showScene("message");
    });
  });
})();
