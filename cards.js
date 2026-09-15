const fallbackCards = [
  {
    cardType: "hold",
    title: "Card payload unavailable",
    claim: "The page could not load cards.json, so it rendered this fallback hold card.",
    status: "held",
    authorityEffect: "none",
    evidence: [
      { label: "Expected", value: "cards.json" },
      { label: "Repair", value: "check deployment and JSON validity" }
    ],
    boundary: "This is a display/data hold, not a GMAP authority failure.",
    nextActions: [
      { label: "Retry", kind: "repair", message: "Refresh the page or redeploy cards.json." }
    ]
  }
];

const stack = document.querySelector("#cards");
const tmpl = document.querySelector("#card-template");
const actionLog = document.querySelector("#action-log");
const actionTitle = document.querySelector("#action-title");
const actionBody = document.querySelector("#action-body");

function labelFor(card) {
  return `${card.cardType} · ${card.status}`;
}

function showAction(card, action) {
  actionLog.hidden = false;
  actionLog.dataset.type = card.cardType;
  actionTitle.textContent = `${action.label} · ${card.title}`;
  actionBody.textContent = action.message || `${action.label} selected.`;
  actionLog.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderCards(cards) {
  stack.replaceChildren();
  for (const card of cards) {
    const node = tmpl.content.cloneNode(true);
    const article = node.querySelector("article");
    article.dataset.type = card.cardType;
    node.querySelector(".pill").textContent = labelFor(card);
    node.querySelector(".authority").textContent = `authority: ${card.authorityEffect}`;
    node.querySelector("h2").textContent = card.title;
    node.querySelector(".claim").textContent = card.claim;
    const evidence = node.querySelector(".evidence");
    for (const item of card.evidence || []) {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = item.label;
      dd.textContent = item.value;
      row.append(dt, dd);
      evidence.append(row);
    }
    const receipt = node.querySelector(".receipt-block");
    if (card.receipt?.id) receipt.textContent = `receipt: ${card.receipt.id}`;
    else receipt.remove();
    node.querySelector(".boundary").textContent = card.boundary;
    const actions = node.querySelector(".actions");
    for (const action of card.nextActions || []) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = action.requiresGmap ? `${action.label} · GMAP` : action.label;
      if (action.kind === "approve") btn.classList.add("primary");
      if (action.kind === "deny") btn.classList.add("danger");
      btn.addEventListener("click", () => showAction(card, action));
      actions.append(btn);
    }
    stack.append(node);
  }
}

async function loadCards() {
  try {
    const response = await fetch("cards.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`cards.json returned ${response.status}`);
    const cards = await response.json();
    renderCards(cards);
  } catch (error) {
    console.warn("VALIS card payload load failed", error);
    renderCards(fallbackCards);
  }
}

loadCards();
