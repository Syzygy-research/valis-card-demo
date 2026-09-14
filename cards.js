const cards = [
  {
    cardType: "proof",
    title: "GMAP is bound for this session",
    claim: "The approval surface is available and consequential work must route through GMAP.",
    status: "verified",
    authorityEffect: "none",
    evidence: [
      { label: "Identity", value: "identity_bound" },
      { label: "Session", value: "session_ready" },
      { label: "GMAP", value: "gmap_bound" },
      { label: "Routing", value: "GMAP_REQUIRED" }
    ],
    receipt: { id: "GMAP-SESSION-STARTUP-20260914-150228-280" },
    boundary: "This proves readiness and routing. It does not approve or execute a new action.",
    nextActions: [
      { label: "View receipt", kind: "view", requiresGmap: false },
      { label: "Save proof", kind: "save", requiresGmap: false }
    ]
  },
  {
    cardType: "artifact",
    title: "Voice-produced proof artifact",
    claim: "Ricky spoke intent; Noetica structured it into a proof/readback artifact.",
    status: "draft",
    authorityEffect: "none",
    evidence: [
      { label: "Surface", value: "mobile voice" },
      { label: "Output", value: "proof card" },
      { label: "Mode", value: "informational" }
    ],
    boundary: "Artifacts inform. They do not authorize consequence.",
    nextActions: [
      { label: "Open", kind: "view", requiresGmap: false },
      { label: "Share after voice", kind: "share", requiresGmap: false }
    ]
  },
  {
    cardType: "hold",
    title: "Localhost cannot be viewed from phone",
    claim: "The phone surface cannot reach the Codex host's 127.0.0.1 server.",
    status: "held",
    authorityEffect: "none",
    evidence: [
      { label: "Attempt", value: "http://127.0.0.1:8099/" },
      { label: "Result", value: "not visible on phone" },
      { label: "Repair", value: "native card surface or hosted link after voice" }
    ],
    boundary: "This is a display-route hold, not a VALIS authority failure.",
    nextActions: [
      { label: "Use inline card", kind: "repair", requiresGmap: false }
    ]
  },
  {
    cardType: "approval",
    title: "Example GMAP approval card",
    claim: "This card type is reserved for exact consequential release.",
    status: "released",
    authorityEffect: "requests_release",
    evidence: [
      { label: "Action", value: "deploy exact artifact digest" },
      { label: "Digest", value: "sha256:example" },
      { label: "Expiry", value: "single-use / bounded" }
    ],
    boundary: "Only approval cards can authorize consequence, and only after valid GMAP release.",
    nextActions: [
      { label: "Approve", kind: "approve", requiresGmap: true },
      { label: "Deny", kind: "deny", requiresGmap: true }
    ]
  }
];

const stack = document.querySelector("#cards");
const tmpl = document.querySelector("#card-template");

function labelFor(card) {
  return `${card.cardType} · ${card.status}`;
}

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
    btn.textContent = action.requiresGmap ? `${action.label} · GMAP` : action.label;
    if (action.kind === "approve") btn.classList.add("primary");
    actions.append(btn);
  }
  stack.append(node);
}
