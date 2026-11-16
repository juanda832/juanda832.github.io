(() => {
  const h = React.createElement;
  const useState = React.useState;
  const pageOptions = ["Home", "Services", "About", "Contact", "Portfolio"];
  const projectTypes = [
    ["Business website", "A clear home for your business"],
    ["Landing page", "One focused offer or campaign"],
    ["Portfolio", "Work, story, and contact in one place"],
  ];
  const initial = {
    business: "",
    type: "Business website",
    goal: "Explain my services and help people get in touch.",
    pages: ["Home", "Services", "Contact"],
    action: "Send a message",
  };

  function Field(props) {
    return h("div", { className: "field" },
      h("div", { className: "field-heading" },
        props.id
          ? h("label", { htmlFor: props.id }, props.label)
          : h("span", { className: "field-label", id: props.groupId }, props.label),
        props.hint ? h("span", { className: "field-hint" }, props.hint) : null
      ),
      props.children
    );
  }

  function TypeOptions(props) {
    return h("fieldset", { className: "type-options", "aria-labelledby": props.labelledBy },
      h("legend", { className: "sr-only" }, "Choose a website type"),
      h("div", { className: "type-grid" },
        projectTypes.map((option) => h("label", {
          className: "type-card " + (props.value === option[0] ? "is-selected" : ""),
          key: option[0],
        },
          h("input", {
            type: "radio", name: "project-type", value: option[0],
            checked: props.value === option[0], onChange: () => props.onChange(option[0]),
          }),
          h("span", { className: "type-mark", "aria-hidden": "true" }, props.value === option[0] ? "✓" : ""),
          h("span", { className: "type-copy" },
            h("strong", null, option[0]),
            h("small", null, option[1])
          )
        ))
      )
    );
  }

  function PageOptions(props) {
    return h("fieldset", { className: "page-options", "aria-labelledby": props.labelledBy },
      h("legend", { className: "sr-only" }, "Choose the pages to include"),
      h("div", { className: "page-grid" },
        pageOptions.map((page) => {
          const selected = props.selected.includes(page);
          return h("label", {
            className: "page-chip " + (selected ? "is-selected" : ""),
            key: page,
          },
            h("input", {
              type: "checkbox", value: page, checked: selected,
              onChange: () => props.onToggle(page),
            }),
            h("span", { className: "check-mark", "aria-hidden": "true" }, selected ? "✓" : "+"),
            page
          );
        })
      )
    );
  }

  function makeSummary(brief) {
    const name = brief.business.trim() || "Your business";
    const pages = brief.pages.length ? brief.pages.join(", ") : "Not selected yet";
    const goal = brief.goal.trim() || "Clarify the offer and next step.";
    return "Project: " + name + "\nWebsite: " + brief.type + "\nGoal: " + goal +
      "\nPages: " + pages + "\nPrimary action: " + brief.action;
  }

  function BriefPreview(props) {
    const summary = makeSummary(props.brief);
    return h("aside", { className: "preview-card", "aria-labelledby": "preview-title" },
      h("div", { className: "preview-topline" },
        h("span", { className: "preview-kicker" }, "LIVE PREVIEW"),
        h("span", { className: "preview-status" },
          h("span", { className: "status-dot", "aria-hidden": "true" }), "Draft"
        )
      ),
      h("h2", { id: "preview-title" }, "A useful first brief."),
      h("p", { className: "preview-intro" }, "A short, specific starting point makes the first client conversation easier."),
      h("div", { className: "preview-divider" }),
      h("p", { className: "preview-label" }, "PROJECT SUMMARY"),
      h("p", { className: "summary-text" }, summary),
      h("div", { className: "preview-metadata" },
        h("div", null, h("span", null, "FORMAT"), h("strong", null, props.brief.type)),
        h("div", null, h("span", null, "PAGES"), h("strong", null, props.brief.pages.length + " selected")),
        h("div", null, h("span", null, "NEXT STEP"), h("strong", null, props.brief.action))
      ),
      h("label", { className: "sr-only", htmlFor: "brief-output" }, "Copyable project brief"),
      h("textarea", { id: "brief-output", className: "brief-output", value: summary, readOnly: true, rows: 5 }),
      h("div", { className: "preview-actions" },
        h("button", { className: "button button-primary", type: "button", onClick: props.onCopy }, "Copy brief"),
        h("span", { className: "copy-message", role: "status", "aria-live": "polite" }, props.copyMessage)
      ),
      h("p", { className: "privacy-note" },
        h("span", { "aria-hidden": "true" }, "↗"), " Demo only. Nothing is sent or saved to a server."
      )
    );
  }

  function App() {
    const state = useState(initial);
    const brief = state[0];
    const setBrief = state[1];
    const copyState = useState("");
    const copyMessage = copyState[0];
    const setCopyMessage = copyState[1];

    function update(key, value) {
      setBrief((current) => Object.assign({}, current, { [key]: value }));
      setCopyMessage("");
    }

    function togglePage(page) {
      setBrief((current) => {
        const pages = current.pages.includes(page)
          ? current.pages.filter((item) => item !== page)
          : current.pages.concat(page);
        return Object.assign({}, current, { pages: pages });
      });
      setCopyMessage("");
    }

    async function copyBrief() {
      try {
        await navigator.clipboard.writeText(makeSummary(brief));
        setCopyMessage("Brief copied. You can paste it into your project notes.");
      } catch {
        const output = document.getElementById("brief-output");
        output.focus();
        output.select();
        setCopyMessage("Clipboard unavailable. The brief is selected so you can copy it manually.");
      }
    }

    function resetBrief() {
      setBrief(initial);
      setCopyMessage("Example restored.");
    }

    return h("div", { className: "app-shell" },
      h("header", { className: "site-header" },
        h("a", { className: "brand", href: "#top", "aria-label": "Nexora Digital, back to top" },
          h("span", { className: "brand-mark", "aria-hidden": "true" }, "N"),
          h("span", null, "NEXORA", h("small", null, "DIGITAL"))
        ),
        h("div", { className: "header-note" },
          h("span", { className: "header-dot" }), "Independent concept demo"
        )
      ),
      h("main", { id: "top" },
        h("section", { className: "hero" },
          h("p", { className: "eyebrow" }, "A BETTER PROJECT STARTS WITH CLARITY"),
          h("h1", null, "Let’s shape a website brief that feels ", h("em", null, "clear.")),
          h("p", { className: "hero-copy" }, "A calm, practical way to organize the essentials before design and development begin."),
          h("div", { className: "hero-rule" },
            h("span", null, "01"), h("span", null, "PROJECT PLANNER"), h("span", null, "3 MINUTES")
          )
        ),
        h("div", { className: "planner-layout" },
          h("section", { className: "form-panel", "aria-labelledby": "form-title" },
            h("div", { className: "section-heading" },
              h("div", null, h("p", { className: "section-index" }, "01 / YOUR PROJECT"),
                h("h2", { id: "form-title" }, "Start with the basics")),
              h("button", { className: "reset-button", type: "button", onClick: resetBrief }, "Reset example")
            ),
            h(Field, { id: "business-name", label: "Business or project name", hint: "Optional" },
              h("input", {
                id: "business-name", className: "text-input", type: "text", value: brief.business, maxLength: 60,
                placeholder: "e.g. North Star Studio", autoComplete: "organization",
                onChange: (event) => update("business", event.target.value),
              })
            ),
            h(Field, { groupId: "project-type-label", label: "What are you planning?", hint: "Choose one" },
              h(TypeOptions, { labelledBy: "project-type-label", value: brief.type, onChange: (value) => update("type", value) })
            ),
            h(Field, { id: "website-goal", label: "What should the site help people do?", hint: "Keep it simple" },
              h("textarea", {
                id: "website-goal", className: "text-input goal-input", value: brief.goal, maxLength: 150, rows: 3,
                onChange: (event) => update("goal", event.target.value),
              })
            ),
            h(Field, { groupId: "page-choices-label", label: "Which pages are useful?", hint: "Select what fits" },
              h(PageOptions, { labelledBy: "page-choices-label", selected: brief.pages, onToggle: togglePage })
            ),
            h(Field, { id: "main-action", label: "What should a visitor do next?", hint: "Main action" },
              h("select", {
                id: "main-action", className: "text-input select-input", value: brief.action,
                onChange: (event) => update("action", event.target.value),
              },
                ["Send a message", "Book a call", "Request a quote", "View the work"]
                  .map((action) => h("option", { key: action, value: action }, action))
              )
            ),
            h("p", { className: "form-privacy" }, "Use fictional details here. This demo runs in your browser and has no backend.")
          ),
          h(BriefPreview, { brief: brief, onCopy: copyBrief, copyMessage: copyMessage })
        )
      ),
      h("footer", { className: "site-footer" },
        h("span", null, "NEXORA DIGITAL · CONCEPT DEMO"),
        h("span", null, "Made to make the first conversation easier.")
      )
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
