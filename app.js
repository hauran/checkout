(function () {
  "use strict";

  const STORAGE_KEY = "pretendCheckoutApp.v1";
  const DEFAULT_PRICES = [1, 5, 10, 20];
  const OPTIONAL_PRICE_PRESETS = [2, 15, 30, 50];
  const DEFAULT_EMOJI = "🛒";
  const DEFAULT_THEME_ID = "candy";
  const SCAN_SOUND_DELAY_MS = 1500;
  const SCAN_DURATION_MS = 3000;
  const RECEIPT_HISTORY_LIMIT = 50;
  const SOUND_FILES = {
    scan: "assets/scan-beep.mp3",
    payment: "assets/cash-register.mp3",
  };
  const STORE_THEMES = [
    {
      id: "market",
      name: "Market",
      swatches: ["#f7c948", "#04756f", "#f06b4f"],
      vars: {
        "--paper": "#f7f3eb",
        "--panel": "#fffdf8",
        "--line": "#dfd7c8",
        "--teal": "#04756f",
        "--teal-dark": "#035b57",
        "--coral": "#f06b4f",
        "--yellow": "#f7c948",
        "--green": "#15835b",
        "--blue": "#2f64d6",
      },
    },
    {
      id: "candy",
      name: "Candy",
      swatches: ["#ff6b9a", "#00a7a5", "#ffd166"],
      vars: {
        "--paper": "#fff4f7",
        "--panel": "#fffafd",
        "--line": "#edd0d9",
        "--teal": "#c23366",
        "--teal-dark": "#981f4d",
        "--coral": "#ff8a4c",
        "--yellow": "#ffd166",
        "--green": "#16856b",
        "--blue": "#3056d3",
      },
    },
    {
      id: "ocean",
      name: "Ocean",
      swatches: ["#6bd4ff", "#007c89", "#ffb35c"],
      vars: {
        "--paper": "#eef9fb",
        "--panel": "#fbfeff",
        "--line": "#c8dde2",
        "--teal": "#007c89",
        "--teal-dark": "#005c66",
        "--coral": "#ff7f50",
        "--yellow": "#6bd4ff",
        "--green": "#187a67",
        "--blue": "#245fc7",
      },
    },
    {
      id: "garden",
      name: "Garden",
      swatches: ["#9bd45a", "#2f7d32", "#ff8b5f"],
      vars: {
        "--paper": "#f4f8ea",
        "--panel": "#fefff8",
        "--line": "#d5dfbf",
        "--teal": "#2f7d32",
        "--teal-dark": "#245f26",
        "--coral": "#ff8b5f",
        "--yellow": "#cfe86a",
        "--green": "#2f7d32",
        "--blue": "#2d62b7",
      },
    },
    {
      id: "arcade",
      name: "Arcade",
      swatches: ["#7c5cff", "#0a8f8f", "#ffcf33"],
      vars: {
        "--paper": "#f3f1ff",
        "--panel": "#fffaff",
        "--line": "#d9d1f0",
        "--teal": "#5c4bc8",
        "--teal-dark": "#40338f",
        "--coral": "#ff5f73",
        "--yellow": "#ffcf33",
        "--green": "#128760",
        "--blue": "#0a72d8",
      },
    },
    {
      id: "mono",
      name: "Classic",
      swatches: ["#202124", "#f7c948", "#f06b4f"],
      vars: {
        "--paper": "#f3f0e8",
        "--panel": "#fffdf8",
        "--line": "#d6d0c4",
        "--teal": "#202124",
        "--teal-dark": "#000000",
        "--coral": "#f06b4f",
        "--yellow": "#f7c948",
        "--green": "#15835b",
        "--blue": "#2f64d6",
      },
    },
  ];
  const EMOJI_RANGES = [
    [0x1f300, 0x1f4ff],
    [0x1f600, 0x1f64f],
    [0x1f680, 0x1f6ff],
    [0x1f900, 0x1f9ff],
    [0x1fa70, 0x1faff],
  ];
  const EMOJI_ALIASES = {
    "🛒": "cart checkout shopping grocery retail store market",
    "🏪": "convenience store shop market retail",
    "🏬": "department store shop mall retail",
    "🏦": "bank money checkout",
    "🏠": "house home",
    "🏡": "home house",
    "🏰": "castle pretend play",
    "🎪": "circus tent shop pretend play",
    "🧸": "teddy toy toys bear",
    "🎁": "gift present shop",
    "🎈": "balloon party",
    "🎉": "party celebration",
    "🎀": "ribbon bow gift",
    "🎮": "game video games arcade",
    "🕹️": "joystick game arcade",
    "🎲": "dice game",
    "🧩": "puzzle toy",
    "📚": "books bookstore school",
    "📖": "book library",
    "✏️": "pencil school art",
    "🖍️": "crayon art",
    "🎨": "art paint",
    "👟": "shoe shoes sneaker",
    "👑": "crown princess royal",
    "💎": "gem jewel diamond",
    "💰": "money bag cash",
    "💵": "money cash dollar",
    "💳": "credit card payment checkout",
    "🪙": "coin money cash",
    "🍕": "pizza food restaurant",
    "🍔": "burger food restaurant",
    "🍟": "fries food restaurant",
    "🌭": "hot dog food",
    "🌮": "taco food",
    "🌯": "burrito food",
    "🥪": "sandwich food",
    "🍿": "popcorn snack food",
    "🍩": "donut dessert food",
    "🍪": "cookie dessert food",
    "🧁": "cupcake dessert bakery",
    "🎂": "cake birthday dessert bakery",
    "🍰": "cake dessert bakery",
    "🍦": "ice cream dessert",
    "🍨": "ice cream dessert",
    "🍧": "shaved ice dessert",
    "🍫": "chocolate candy sweet",
    "🍬": "candy sweet",
    "🍭": "lollipop candy sweet",
    "🍎": "apple fruit food",
    "🍌": "banana fruit food",
    "🍓": "strawberry fruit food",
    "🍉": "watermelon fruit food",
    "🍇": "grapes fruit food",
    "🍒": "cherry fruit food",
    "🥕": "carrot vegetable food",
    "🌽": "corn vegetable food",
    "🥨": "pretzel snack food",
    "🥐": "croissant bakery food",
    "🍞": "bread bakery food",
    "🥛": "milk drink",
    "🧃": "juice drink box",
    "☕": "coffee drink",
    "🍵": "tea drink",
    "🥤": "soda drink",
    "🌸": "flower blossom",
    "🌼": "flower daisy",
    "🌻": "flower sunflower",
    "🌷": "flower tulip",
    "🌹": "flower rose",
    "🌲": "tree plant",
    "🌳": "tree plant",
    "⭐": "star favorite",
    "🌟": "star glowing favorite",
    "✨": "sparkles magic",
    "🌈": "rainbow",
    "☀️": "sun sunny",
    "☁️": "cloud weather",
    "❄️": "snow winter",
    "🔥": "fire hot",
    "❤️": "heart love",
    "🧡": "heart orange love",
    "💛": "heart yellow love",
    "💚": "heart green love",
    "💙": "heart blue love",
    "💜": "heart purple love",
    "🐶": "dog animal pet",
    "🐱": "cat animal pet",
    "🐭": "mouse animal",
    "🐹": "hamster animal pet",
    "🐰": "bunny rabbit animal",
    "🦊": "fox animal",
    "🐻": "bear animal",
    "🐼": "panda animal",
    "🐨": "koala animal",
    "🐯": "tiger animal",
    "🦁": "lion animal",
    "🐮": "cow animal farm",
    "🐷": "pig animal farm",
    "🐸": "frog animal",
    "🐵": "monkey animal",
    "🦄": "unicorn animal magic",
    "🐝": "bee animal bug",
    "🦋": "butterfly animal bug",
    "🐢": "turtle animal",
    "🐙": "octopus animal ocean",
    "🐠": "fish animal ocean",
    "🐬": "dolphin animal ocean",
    "🚗": "car vehicle",
    "🚕": "taxi vehicle",
    "🚚": "truck delivery vehicle",
    "🚲": "bike bicycle vehicle",
    "🚀": "rocket space",
    "✈️": "airplane plane travel",
    "⚽": "soccer ball sport",
    "🏀": "basketball sport",
    "🏈": "football sport",
    "⚾": "baseball sport",
    "🎾": "tennis sport",
    "🏆": "trophy winner",
    "🎵": "music note",
    "🎤": "microphone music",
    "🎧": "headphones music",
    "🥁": "drum music",
    "🎸": "guitar music",
    "📱": "phone mobile",
    "💻": "laptop computer",
    "🤖": "robot",
    "🙂": "smile happy face",
    "😀": "grin happy face",
    "😄": "smile happy face",
    "😍": "heart eyes face",
    "😎": "cool sunglasses face",
  };

  const app = document.querySelector("#app");

  let data = loadData();
  let ui = {
    route: getInitialRoute(data),
    draftStore: null,
    editingStoreId: null,
    selectedReceiptId: "",
    emojiFilter: "",
    saleStartCustomerName: "",
    error: "",
    scanTimer: null,
    scanSoundTimer: null,
    activeSaleStoreIds: new Set(),
    signaturePad: {
      drawing: false,
      hasInk: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
    },
  };
  let emojiOptionsCache = null;
  let audioContext = null;
  let soundPlayers = {};

  render();

  document.addEventListener("click", handleClick);
  document.addEventListener("submit", handleSubmit);
  document.addEventListener("input", handleInput);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("pointerdown", primeAudio, { passive: true });
  document.addEventListener("pointerdown", handleSignaturePointerDown);
  document.addEventListener("pointermove", handleSignaturePointerMove);
  document.addEventListener("pointerup", handleSignaturePointerEnd);
  document.addEventListener("pointercancel", handleSignaturePointerEnd);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  function loadData() {
    let parsed = null;

    try {
      parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      parsed = null;
    }

    const stores = Array.isArray(parsed && parsed.stores)
      ? parsed.stores.map(normalizeStore).filter(Boolean)
      : [];
    const activeStoreId = stores.some((store) => store.id === parsed?.activeStoreId)
      ? parsed.activeStoreId
      : stores[0]?.id || null;
    const salesByStoreId = {};
    const receiptsByStoreId = {};

    stores.forEach((store) => {
      const currentStoreSale = normalizeSale(
        parsed?.salesByStoreId && parsed.salesByStoreId[store.id]
      );
      const savedReceipts = Array.isArray(
        parsed?.receiptsByStoreId && parsed.receiptsByStoreId[store.id]
      )
        ? parsed.receiptsByStoreId[store.id]
        : [];

      salesByStoreId[store.id] = currentStoreSale;
      receiptsByStoreId[store.id] = normalizeReceiptHistory(
        currentStoreSale.paid
          ? [currentStoreSale, ...savedReceipts]
          : savedReceipts
      );
    });

    return {
      stores,
      activeStoreId,
      salesByStoreId,
      receiptsByStoreId,
    };
  }

  function normalizeStore(store) {
    if (!store || typeof store !== "object") {
      return null;
    }

    const name = String(store.name || "").trim();
    if (!name) {
      return null;
    }

    const priceOptions = Array.isArray(store.priceOptions)
      ? store.priceOptions.map(roundMoney).filter((price) => price > 0)
      : DEFAULT_PRICES;

    return {
      id: String(store.id || makeId()),
      name,
      description: String(store.description || "").trim(),
      emojiLogo: String(store.emojiLogo || DEFAULT_EMOJI).trim() || DEFAULT_EMOJI,
      themeId: DEFAULT_THEME_ID,
      priceOptions: uniquePrices(priceOptions.length ? priceOptions : DEFAULT_PRICES),
    };
  }

  function normalizeSale(sale) {
    const items = Array.isArray(sale?.items)
      ? sale.items
          .map((item) => ({
            id: String(item.id || makeId()),
            price: roundMoney(item.price),
          }))
          .filter((item) => item.price > 0)
      : [];

    return {
      items,
      customerName: String(sale?.customerName || "").trim(),
      tip: roundMoney(sale?.tip || 0),
      paid: sale?.paid === true,
      paymentType: typeof sale?.paymentType === "string" ? sale.paymentType : "",
      signatureDataUrl:
        typeof sale?.signatureDataUrl === "string" ? sale.signatureDataUrl : "",
      receiptNumber:
        typeof sale?.receiptNumber === "string" ? sale.receiptNumber : "",
      paidAt: typeof sale?.paidAt === "string" ? sale.paidAt : "",
    };
  }

  function normalizeReceiptHistory(receipts) {
    const seen = new Set();

    return receipts
      .map(normalizeReceipt)
      .filter(Boolean)
      .filter((receipt) => {
        const key =
          receipt.receiptNumber && receipt.paidAt
            ? `${receipt.receiptNumber}-${receipt.paidAt}`
            : receipt.id;
        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
      .slice(0, RECEIPT_HISTORY_LIMIT);
  }

  function normalizeReceipt(receipt) {
    const sale = normalizeSale(receipt);
    if (!sale.paid || !sale.items.length) {
      return null;
    }

    return {
      ...sale,
      id: String(receipt?.id || receipt?.receiptId || sale.receiptNumber || makeId()),
      paid: true,
      receiptNumber: sale.receiptNumber || makeReceiptNumber(),
      paidAt: sale.paidAt || new Date().toISOString(),
    };
  }

  function getInitialRoute(nextData) {
    if (nextData.stores.length === 0) {
      return "store-form";
    }

    if (nextData.stores.length > 1) {
      return "store-picker";
    }

    return "register";
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function currentStore() {
    return (
      data.stores.find((store) => store.id === data.activeStoreId) ||
      data.stores[0] ||
      null
    );
  }

  function currentSale() {
    const store = currentStore();
    if (!store) {
      return normalizeSale(null);
    }

    if (!data.salesByStoreId[store.id]) {
      data.salesByStoreId[store.id] = normalizeSale(null);
    }

    return data.salesByStoreId[store.id];
  }

  function currentReceiptHistory(store = currentStore()) {
    if (!store) {
      return [];
    }

    data.receiptsByStoreId = data.receiptsByStoreId || {};
    if (!Array.isArray(data.receiptsByStoreId[store.id])) {
      data.receiptsByStoreId[store.id] = [];
    }

    return data.receiptsByStoreId[store.id];
  }

  function findCurrentReceipt(receiptId) {
    return currentReceiptHistory().find((receipt) => receipt.id === receiptId) || null;
  }

  function addReceiptToHistory(store, sale) {
    if (!store) {
      return null;
    }

    const receipt = normalizeReceipt({ ...sale, id: makeId() });
    if (!receipt) {
      return null;
    }

    data.receiptsByStoreId = data.receiptsByStoreId || {};
    data.receiptsByStoreId[store.id] = normalizeReceiptHistory([
      receipt,
      ...currentReceiptHistory(store),
    ]);
    return receipt;
  }

  function isSaleStarted(store, sale) {
    if (!store || sale?.paid) {
      return false;
    }

    return ui.activeSaleStoreIds.has(store.id) || Boolean(sale?.items.length);
  }

  function getTheme() {
    return (
      STORE_THEMES.find((theme) => theme.id === DEFAULT_THEME_ID) ||
      STORE_THEMES[0]
    );
  }

  function applyCurrentTheme(route) {
    const source =
      route === "store-form" ? ui.draftStore : currentStore();
    const theme = getTheme(source?.themeId);

    Object.entries(theme.vars).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }

  function themeStyleAttribute(themeId) {
    const theme = getTheme(themeId);

    return Object.entries(theme.vars)
      .map(([property, value]) => `${property}: ${value}`)
      .join("; ");
  }

  function render() {
    const route = data.stores.length === 0 ? "store-form" : ui.route;

    if (route === "store-form" && !ui.draftStore) {
      beginDraftStore(null, { renderNow: false });
    }

    applyCurrentTheme(route);

    if (route === "store-form") {
      renderStoreForm();
      return;
    }

    if (route === "store-picker") {
      renderStorePicker();
      return;
    }

    if (route === "scanning") {
      renderScanning();
      return;
    }

    if (route === "sale-start") {
      renderSaleStart();
      return;
    }

    if (route === "price") {
      renderPriceSelect();
      return;
    }

    if (route === "checkout") {
      renderCheckout();
      return;
    }

    if (route === "signature") {
      renderSignature();
      return;
    }

    if (route === "approved") {
      renderApproved();
      return;
    }

    if (route === "receipt") {
      renderHistoryReceipt();
      return;
    }

    renderRegister();
  }

  function renderStorePicker() {
    const hasMultipleStores = data.stores.length > 1;
    app.innerHTML = `
      <main class="screen">
        <header class="topbar">
          <h1>${hasMultipleStores ? "Choose Store" : "Store"}</h1>
        </header>
        <section class="store-grid">
          ${data.stores.map(renderStoreCard).join("")}
        </section>
        <button class="primary-button store-add" type="button" data-action="new-store">New Store</button>
      </main>
    `;
  }

  function renderStoreCard(store) {
    const isActive = store.id === data.activeStoreId;

    return `
      <article class="store-card" style="${themeStyleAttribute(store.themeId)}">
        <div class="logo-mark" aria-hidden="true">${escapeHtml(store.emojiLogo)}</div>
        <div>
          <h2>${escapeHtml(store.name)}</h2>
          ${store.description ? `<p>${escapeHtml(store.description)}</p>` : ""}
          <div class="store-meta">
            ${isActive ? `<span class="pill active">Active</span>` : ""}
            <span class="pill">${store.priceOptions.length} prices</span>
          </div>
        </div>
        <div class="store-card-actions">
          <button class="primary-button" type="button" data-action="select-store" data-store-id="${escapeHtml(
            store.id
          )}">Open</button>
          <button class="secondary-button" type="button" data-action="edit-store" data-store-id="${escapeHtml(
            store.id
          )}">Edit</button>
        </div>
      </article>
    `;
  }

  function renderStoreForm() {
    if (!ui.draftStore) {
      beginDraftStore(null, { renderNow: false });
    }

    applyCurrentTheme("store-form");

    const draft = ui.draftStore;
    const isEditing = Boolean(ui.editingStoreId);
    const canCancel = data.stores.length > 0;
    const canDelete = isEditing && data.stores.length > 1;

    app.innerHTML = `
      <main class="screen">
        <section class="setup-panel">
          <div class="emoji-preview-row">
            <div class="logo-mark" aria-hidden="true">${escapeHtml(
              draft.emojiLogo || DEFAULT_EMOJI
            )}</div>
            <div>
              <h1 class="setup-title">${isEditing ? "Edit Store" : "Create New Store"}</h1>
              ${isEditing ? `<p class="muted">Store details</p>` : ""}
            </div>
          </div>
          <form class="form-grid" data-form="store">
            <label>
              Name
              <input name="name" type="text" value="${escapeHtml(
                draft.name
              )}" autocomplete="off" maxlength="34" required />
            </label>
            <label>
              Description
              <textarea name="description" maxlength="90">${escapeHtml(
                draft.description
              )}</textarea>
            </label>
            <div class="emoji-field">
              <label>Logo</label>
              <input
                data-emoji-filter
                type="search"
                value="${escapeHtml(ui.emojiFilter)}"
                autocomplete="off"
                enterkeyhint="search"
                placeholder="Filter emojis"
              />
              <div class="emoji-picker" role="radiogroup" aria-label="Store logo">
                ${renderEmojiChoices(draft.emojiLogo)}
              </div>
            </div>
            <div class="price-editor">
              <label>Price Options</label>
              <div class="price-chips selected-prices">
                ${renderSelectedPriceButtons(draft.priceOptions)}
              </div>
              <div class="price-chips optional-prices">
                ${renderOptionalPriceButtons(draft.priceOptions)}
              </div>
              <div class="inline-form">
                <input name="newPrice" type="number" min="0.01" step="0.01" inputmode="decimal" enterkeyhint="done" placeholder="0.00" />
                <button class="secondary-button" type="button" data-action="add-price">Add</button>
              </div>
            </div>
            <div class="error-message" role="alert">${escapeHtml(ui.error)}</div>
            <div class="form-actions">
              <button class="primary-button" type="submit">Save Store</button>
              ${
                canCancel
                  ? `<button class="secondary-button" type="button" data-action="cancel-store-form">Cancel</button>`
                  : ""
              }
              ${
                canDelete
                  ? `<button class="danger-button" type="button" data-action="delete-store">Delete Store</button>`
                  : ""
              }
            </div>
          </form>
        </section>
      </main>
    `;
  }

  function renderRegister() {
    const store = currentStore();

    if (!store) {
      ui.route = "store-form";
      renderStoreForm();
      return;
    }

    const sale = currentSale();
    const canScan = isSaleStarted(store, sale);
    const canCheckout = canScan && sale.items.length > 0;
    const receipts = currentReceiptHistory(store);

    app.innerHTML = `
      <main class="screen ${canScan ? "with-actions" : ""}">
        <header class="topbar">
          <button class="text-button" type="button" data-action="open-stores">Stores</button>
        </header>
        <section class="brand-card">
          <div class="logo-mark" aria-hidden="true">${escapeHtml(store.emojiLogo)}</div>
          <div>
            <h2>${escapeHtml(store.name)}</h2>
            ${store.description ? `<p>${escapeHtml(store.description)}</p>` : ""}
          </div>
        </section>
        ${canScan ? renderActiveSaleRegister(sale) : renderStoreHome(receipts)}
      </main>
      ${
        canScan
          ? `<nav class="bottom-actions" aria-label="Sale actions">
              <div class="bottom-actions-inner action-count-${canCheckout ? 2 : 1}">
                ${renderSaleActionButtons(canCheckout)}
              </div>
            </nav>`
          : ""
      }
    `;
  }

  function renderStoreHome(receipts) {
    return `
      <button class="primary-button store-start-button" type="button" data-action="new-sale">New Sale</button>
      <section class="sales-history" aria-label="Past sales">
        <h2>Past Sales</h2>
        <div class="sales-list">
          ${
            receipts.length
              ? receipts.map(renderPastSaleRow).join("")
              : `<div class="past-sale-empty">No past sales</div>`
          }
        </div>
      </section>
    `;
  }

  function renderActiveSaleRegister(sale) {
    return `
      ${
        sale.customerName
          ? `<div class="customer-strip">Customer: <strong>${escapeHtml(
              sale.customerName
            )}</strong></div>`
          : ""
      }
      <section class="cart-list" aria-label="Cart">
        ${
          sale.items.length
            ? sale.items.map(renderCartRow).join("")
            : `<div class="empty-state"><div><strong>Ready</strong><span>Scan the first item</span></div></div>`
        }
      </section>
    `;
  }

  function renderPastSaleRow(receipt) {
    const totals = calculateTotals(receipt);
    const dateLabel = formatReceiptDate(receipt.paidAt);

    return `
      <button
        class="past-sale-row"
        type="button"
        data-action="open-receipt"
        data-receipt-id="${escapeHtml(receipt.id)}"
      >
        <span>
          <strong>${escapeHtml(receipt.customerName || "Customer")}</strong>
          <small>${escapeHtml(dateLabel)} · #${escapeHtml(
            receipt.receiptNumber || "000000"
          )}</small>
        </span>
        <strong>${formatMoney(totals.total)}</strong>
      </button>
    `;
  }

  function renderSaleActionButtons(canCheckout) {
    return `
      <button class="primary-button" type="button" data-action="scan-item">Scan Item</button>
      ${
        canCheckout
          ? `<button class="secondary-button" type="button" data-action="checkout">Checkout</button>`
          : ""
      }
    `;
  }

  function renderCartRow(item, index) {
    return `
      <div class="cart-row">
        <div>
          <strong>Item ${index + 1}</strong>
          <span>${formatMoney(item.price)}</span>
        </div>
        <strong>${formatMoney(item.price)}</strong>
        <button class="remove-button" type="button" data-action="remove-item" data-item-id="${escapeHtml(
          item.id
        )}" aria-label="Remove item">×</button>
      </div>
    `;
  }

  function renderSaleStart() {
    const store = currentStore();

    if (!store) {
      ui.route = "store-form";
      renderStoreForm();
      return;
    }

    app.innerHTML = `
      <main class="screen">
        <header class="topbar">
          <button class="text-button" type="button" data-action="cancel-start-sale">Back</button>
          <h1>${escapeHtml(store.name)}</h1>
          <span class="fake-badge">New Sale</span>
        </header>
        <section class="sale-start-panel">
          <div class="emoji-preview-row">
            <div class="logo-mark" aria-hidden="true">${escapeHtml(store.emojiLogo)}</div>
            <div>
              <h1>Start Sale</h1>
            </div>
          </div>
          <form class="form-grid" data-form="sale-start">
            <label>
              Customer name
              <input
                name="customerName"
                type="text"
                value="${escapeHtml(ui.saleStartCustomerName)}"
                autocomplete="off"
                maxlength="34"
                placeholder="Customer name"
                required
              />
            </label>
            <div class="error-message" role="alert">${escapeHtml(ui.error)}</div>
            <div class="form-actions">
              <button class="primary-button" type="submit">Start Sale</button>
            </div>
          </form>
        </section>
      </main>
    `;
  }

  function renderScanning() {
    const store = currentStore();

    app.innerHTML = `
      <main class="screen">
        <header class="topbar">
          <button class="text-button" type="button" data-action="cancel-scan">Back</button>
          <h1>${escapeHtml(store?.name || "Store")}</h1>
          <span class="fake-badge">Pretend</span>
        </header>
        <section class="scanner-panel">
          <h1>Scanning</h1>
          <div class="scanner-window" aria-hidden="true">
            <div class="scan-laser"></div>
            <div class="scanner-code">
              <span></span><span></span><span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
        </section>
      </main>
    `;
  }

  function renderPriceSelect() {
    const store = currentStore();

    app.innerHTML = `
      <main class="screen">
        <header class="topbar">
          <button class="text-button" type="button" data-action="back-register">Back</button>
          <h1>Item Price</h1>
          <span class="fake-badge">Scanned</span>
        </header>
        <section class="price-panel">
          <h1>${escapeHtml(store?.emojiLogo || DEFAULT_EMOJI)} ${escapeHtml(
            store?.name || "Store"
          )}</h1>
          <div class="price-grid">
            ${(store?.priceOptions || DEFAULT_PRICES)
              .map(
                (price) => `
                  <button class="price-button" type="button" data-action="add-item" data-price="${price}">
                    ${formatMoney(price)}
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="custom-price">
            <input data-custom-price type="number" min="0.01" step="0.01" inputmode="decimal" enterkeyhint="done" placeholder="0.00" />
            <button class="primary-button" type="button" data-action="add-custom-item">Add</button>
          </div>
          <div class="error-message" role="alert">${escapeHtml(ui.error)}</div>
        </section>
      </main>
    `;
  }

  function renderCheckout() {
    const sale = currentSale();
    const totals = calculateTotals(sale);

    app.innerHTML = `
      <main class="screen">
        <header class="topbar">
          <button class="text-button" type="button" data-action="back-register">Back</button>
          <h1>Checkout</h1>
          <span class="fake-badge">Fake Pay</span>
        </header>
        <section class="checkout-panel">
          <h1>Total</h1>
          <label class="customer-field">
            Customer name
            <input
              data-checkout-customer-name
              type="text"
              value="${escapeHtml(sale.customerName || "")}"
              autocomplete="off"
              maxlength="34"
              placeholder="Customer name"
              required
            />
          </label>
          <div class="error-message" role="alert">${escapeHtml(ui.error)}</div>
          <div class="checkout-totals">
            <div class="total-line">
              <span>Subtotal</span>
              <strong>${formatMoney(totals.subtotal)}</strong>
            </div>
            <div class="total-line">
              <span>Tip</span>
              <strong data-tip-display>${formatMoney(sale.tip)}</strong>
            </div>
            <div class="total-line final">
              <span>Final</span>
              <strong data-final-display>${formatMoney(totals.total)}</strong>
            </div>
          </div>
          <div class="tip-grid">
            ${[0, 1, 2, 5]
              .map(
                (tip) => `
                  <button class="tip-button ${
                    roundMoney(sale.tip) === tip ? "active" : ""
                  }" type="button" data-action="set-tip" data-tip="${tip}">
                    ${tip === 0 ? "No Tip" : formatMoney(tip)}
                  </button>
                `
              )
              .join("")}
          </div>
          <label>
            Custom tip
            <input data-tip-input type="number" min="0" step="0.01" inputmode="decimal" value="${
              sale.tip ? sale.tip : ""
            }" placeholder="0.00" />
          </label>
          <div class="pay-grid">
            <button class="pay-button" type="button" data-action="pay" data-payment-type="Credit Card">
              <span class="pay-icon" aria-hidden="true">💳</span>
              <span>Credit Card</span>
            </button>
            <button class="pay-button apple" type="button" data-action="pay" data-payment-type="Apple Pay">
              <span class="pay-icon apple-logo" aria-hidden="true"></span>
              <span>Apple Pay</span>
            </button>
          </div>
        </section>
      </main>
    `;
  }

  function renderSignature() {
    const sale = currentSale();
    const totals = calculateTotals(sale);

    app.innerHTML = `
      <main class="screen">
        <header class="topbar">
          <button class="text-button" type="button" data-action="back-checkout">Back</button>
          <h1>Signature</h1>
          <span class="fake-badge">${escapeHtml(sale.paymentType || "Payment")}</span>
        </header>
        <section class="signature-panel">
          <div>
            <h1>Sign</h1>
            <p class="muted">${escapeHtml(sale.customerName || "Customer")}</p>
          </div>
          <div class="signature-summary">
            <div>
              <span>Total</span>
              <strong>${formatMoney(totals.total)}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>${escapeHtml(sale.paymentType || "Payment")}</strong>
            </div>
          </div>
          <canvas class="signature-pad" data-signature-pad aria-label="Customer signature"></canvas>
          <div class="error-message" role="alert">${escapeHtml(ui.error)}</div>
          <div class="signature-actions">
            <button class="secondary-button" type="button" data-action="clear-signature">Clear</button>
            <button
              class="primary-button"
              type="button"
              data-action="accept-signature"
              data-accept-signature
              disabled
            >Done</button>
          </div>
        </section>
      </main>
    `;

    prepareSignaturePad();
  }

  function renderApproved() {
    const sale = currentSale();
    const store = currentStore();
    const receiptId = ui.selectedReceiptId || findReceiptIdForSale(store, sale);

    app.innerHTML = `
      <main class="screen receipt-screen">
        ${renderReceiptPaper(sale, store)}
        <div class="receipt-actions">
          <button class="primary-button" type="button" data-action="new-sale">New Sale</button>
          ${renderReceiptDeleteLink(receiptId)}
        </div>
      </main>
    `;
  }

  function renderHistoryReceipt() {
    const store = currentStore();
    const receipt = findCurrentReceipt(ui.selectedReceiptId);

    if (!store || !receipt) {
      ui.route = "register";
      ui.selectedReceiptId = "";
      render();
      return;
    }

    app.innerHTML = `
      <main class="screen receipt-screen">
        <header class="topbar">
          <button class="text-button" type="button" data-action="back-register">Back</button>
          <h1>Receipt</h1>
          ${renderReceiptDeleteLink(receipt.id)}
        </header>
        ${renderReceiptPaper(receipt, store)}
      </main>
    `;
  }

  function renderReceiptDeleteLink(receiptId) {
    if (!receiptId) {
      return "";
    }

    return `
      <button
        class="receipt-delete-link"
        type="button"
        data-action="delete-receipt"
        data-receipt-id="${escapeHtml(receiptId)}"
      >Delete</button>
    `;
  }

  function renderReceiptPaper(sale, store) {
    const totals = calculateTotals(sale);
    const paymentType = sale.paymentType || "Payment";
    const receiptNumber = sale.receiptNumber || "000000";
    const paidAt = sale.paidAt || new Date().toISOString();

    return `
      <section class="receipt-paper" aria-label="Receipt">
        <div class="receipt-top">
          <div class="receipt-logo" aria-hidden="true">${escapeHtml(
            store?.emojiLogo || DEFAULT_EMOJI
          )}</div>
          <h1>${escapeHtml(store?.name || "Checkout")}</h1>
          ${store?.description ? `<p>${escapeHtml(store.description)}</p>` : ""}
        </div>

        <div class="receipt-meta">
          <div>
            <span>Receipt</span>
            <strong>#${escapeHtml(receiptNumber)}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>${escapeHtml(formatReceiptDate(paidAt))}</strong>
          </div>
          <div>
            <span>Customer</span>
            <strong>${escapeHtml(sale.customerName || "Customer")}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>${escapeHtml(paymentType)}</strong>
          </div>
        </div>

        <div class="receipt-divider" aria-hidden="true"></div>
        <div class="receipt-items">
          ${renderReceiptItemRows(sale)}
        </div>
        <div class="receipt-divider" aria-hidden="true"></div>
        <div class="receipt-totals">
          <div class="receipt-line">
            <span>Subtotal</span>
            <strong>${formatMoney(totals.subtotal)}</strong>
          </div>
          <div class="receipt-line">
            <span>Tip</span>
            <strong>${formatMoney(totals.tip)}</strong>
          </div>
          <div class="receipt-line final">
            <span>Total</span>
            <strong>${formatMoney(totals.total)}</strong>
          </div>
        </div>
        <p class="receipt-thanks">Thank you</p>
        <div class="receipt-signature">
          <span>Signature</span>
          <div class="receipt-signature-frame">
            ${
              sale.signatureDataUrl
                ? `<img src="${escapeHtml(
                    sale.signatureDataUrl
                  )}" alt="Customer signature" />`
                : `<div class="receipt-signature-line" aria-hidden="true"></div>`
            }
          </div>
          <strong>${escapeHtml(sale.customerName || "Customer")}</strong>
        </div>
      </section>
    `;
  }

  function renderReceiptItemRows(sale) {
    if (!sale.items.length) {
      return `<div class="receipt-row"><span>No items</span><strong>${formatMoney(
        0
      )}</strong></div>`;
    }

    return sale.items
      .map(
        (item, index) => `
          <div class="receipt-row">
            <span>Item ${index + 1}</span>
            <strong>${formatMoney(item.price)}</strong>
          </div>
        `
      )
      .join("");
  }

  function handleClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }

    const action = button.dataset.action;

    if (action === "open-stores") {
      clearScanTimer();
      ui.selectedReceiptId = "";
      ui.route = "store-picker";
      render();
      return;
    }

    if (action === "select-store") {
      clearScanTimer();
      data.activeStoreId = button.dataset.storeId;
      saveData();
      ui.selectedReceiptId = "";
      ui.route = "register";
      ui.error = "";
      render();
      return;
    }

    if (action === "new-store") {
      beginDraftStore(null);
      return;
    }

    if (action === "edit-store") {
      beginDraftStore(button.dataset.storeId);
      return;
    }

    if (action === "cancel-store-form") {
      clearDraft();
      ui.route = data.stores.length > 1 ? "store-picker" : "register";
      render();
      return;
    }

    if (action === "delete-store") {
      deleteCurrentDraftStore();
      return;
    }

    if (action === "add-price") {
      addDraftPrice();
      return;
    }

    if (action === "toggle-price") {
      toggleDraftPrice(button.dataset.price);
      return;
    }

    if (action === "select-emoji") {
      selectDraftEmoji(button.dataset.emoji);
      return;
    }

    if (action === "new-sale") {
      ui.selectedReceiptId = "";
      beginSaleStart();
      return;
    }

    if (action === "open-receipt") {
      openReceipt(button.dataset.receiptId);
      return;
    }

    if (action === "delete-receipt") {
      deleteReceipt(button.dataset.receiptId);
      return;
    }

    if (action === "cancel-start-sale") {
      ui.route = "register";
      ui.error = "";
      render();
      return;
    }

    if (action === "scan-item") {
      startScan();
      return;
    }

    if (action === "cancel-scan" || action === "back-register") {
      clearScanTimer();
      ui.selectedReceiptId = "";
      ui.route = "register";
      ui.error = "";
      render();
      return;
    }

    if (action === "checkout") {
      const store = currentStore();
      const sale = currentSale();
      if (!isSaleStarted(store, sale) || !sale.items.length) {
        ui.route = "register";
        ui.error = "";
        render();
        return;
      }

      ui.route = "checkout";
      ui.error = "";
      render();
      return;
    }

    if (action === "back-checkout") {
      ui.route = "checkout";
      ui.error = "";
      render();
      return;
    }

    if (action === "add-item") {
      addItem(roundMoney(button.dataset.price));
      return;
    }

    if (action === "add-custom-item") {
      addCustomItem();
      return;
    }

    if (action === "remove-item") {
      removeItem(button.dataset.itemId);
      return;
    }

    if (action === "set-tip") {
      setTip(roundMoney(button.dataset.tip));
      return;
    }

    if (action === "pay") {
      completePayment(button.dataset.paymentType || "Payment");
      return;
    }

    if (action === "clear-signature") {
      clearSignaturePad();
      return;
    }

    if (action === "accept-signature") {
      acceptSignature();
    }
  }

  function handleSubmit(event) {
    const storeForm = event.target.closest("[data-form='store']");
    if (storeForm) {
      event.preventDefault();
      saveDraftStore();
      return;
    }

    const saleStartForm = event.target.closest("[data-form='sale-start']");
    if (saleStartForm) {
      event.preventDefault();
      const fields = new FormData(saleStartForm);
      startNewSale(fields.get("customerName"));
    }
  }

  function handleInput(event) {
    if (event.target.matches("[data-emoji-filter]") && ui.route === "store-form") {
      syncDraftFromForm();
      ui.emojiFilter = event.target.value;
      updateEmojiPicker();
      return;
    }

    if (event.target.name === "customerName" && ui.route === "sale-start") {
      ui.saleStartCustomerName = event.target.value;
      if (event.target.value.trim()) {
        ui.error = "";
      }
      return;
    }

    if (event.target.matches("[data-checkout-customer-name]")) {
      const sale = currentSale();
      sale.customerName = event.target.value.trim();
      if (sale.customerName) {
        ui.error = "";
      }
      sale.paid = false;
      sale.paymentType = "";
      saveData();
      return;
    }

    if (event.target.matches("[data-tip-input]")) {
      const sale = currentSale();
      sale.tip = roundMoney(event.target.value);
      sale.paid = false;
      sale.paymentType = "";
      saveData();
      updateCheckoutTotals();
    }
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter") {
      return;
    }

    if (event.target.matches("input[name='newPrice']")) {
      event.preventDefault();
      addDraftPrice();
      return;
    }

    if (event.target.matches("[data-custom-price]")) {
      event.preventDefault();
      addCustomItem();
    }
  }

  function renderEmojiChoices(selectedEmoji) {
    const options = getFilteredEmojiOptions();

    if (!options.length) {
      return `<div class="emoji-empty">No emojis found</div>`;
    }

    return options.map((option) => {
      const isSelected = option.emoji === selectedEmoji;

      return `
        <button
          class="emoji-choice ${isSelected ? "active" : ""}"
          type="button"
          data-action="select-emoji"
          data-emoji="${escapeHtml(option.emoji)}"
          aria-label="Use ${escapeHtml(option.emoji)} logo"
          aria-checked="${isSelected ? "true" : "false"}"
          role="radio"
          title="${escapeHtml(option.searchLabel)}"
        >${escapeHtml(option.emoji)}</button>
      `;
    }).join("");
  }

  function renderSelectedPriceButtons(priceOptions) {
    return uniquePrices(priceOptions.length ? priceOptions : DEFAULT_PRICES)
      .map((price) => renderPriceSetupButton(price, true))
      .join("");
  }

  function renderOptionalPriceButtons(priceOptions) {
    const selectedPrices = uniquePrices(priceOptions);

    return OPTIONAL_PRICE_PRESETS.filter(
      (price) => !selectedPrices.some((selectedPrice) => selectedPrice === price)
    )
      .map((price) => renderPriceSetupButton(price, false))
      .join("");
  }

  function renderPriceSetupButton(price, isSelected) {
    const formattedPrice = formatMoney(price);

    return `
      <button
        class="price-chip ${isSelected ? "selected" : "optional"}"
        type="button"
        data-action="toggle-price"
        data-price="${price}"
        aria-pressed="${isSelected ? "true" : "false"}"
        aria-label="${isSelected ? "Remove" : "Add"} ${formattedPrice}"
      >
        <span aria-hidden="true">${isSelected ? "✓" : "□"}</span>
        <span>${formattedPrice}</span>
      </button>
    `;
  }

  function updateEmojiPicker() {
    const picker = app.querySelector(".emoji-picker");

    if (picker) {
      picker.innerHTML = renderEmojiChoices(ui.draftStore?.emojiLogo || DEFAULT_EMOJI);
    }
  }

  function getFilteredEmojiOptions() {
    const terms = ui.emojiFilter
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    const options = getEmojiOptions();

    if (!terms.length) {
      return options;
    }

    return options.filter((option) =>
      terms.every(
        (term) => option.emoji.includes(term) || option.searchText.includes(term)
      )
    );
  }

  function getEmojiOptions() {
    if (emojiOptionsCache) {
      return emojiOptionsCache;
    }

    const seen = new Set();
    const options = [];

    Object.keys(EMOJI_ALIASES).forEach((emoji) => {
      addEmojiOption(options, seen, emoji);
    });

    getGeneratedEmojiCharacters().forEach((emoji) => {
      addEmojiOption(options, seen, emoji);
    });

    emojiOptionsCache = options;
    return emojiOptionsCache;
  }

  function addEmojiOption(options, seen, emoji) {
    if (!emoji || seen.has(emoji)) {
      return;
    }

    seen.add(emoji);
    const codePoint = emoji.codePointAt(0);
    const searchLabel = [
      EMOJI_ALIASES[emoji] || "",
      getEmojiCategoryKeywords(codePoint),
      codePoint ? `u${codePoint.toString(16)}` : "",
    ]
      .join(" ")
      .trim();

    options.push({
      emoji,
      searchLabel,
      searchText: `${emoji} ${searchLabel}`.toLowerCase(),
    });
  }

  function getGeneratedEmojiCharacters() {
    const regexes = getEmojiRegexes();
    if (!regexes) {
      return [];
    }

    const emojis = [];
    const seen = new Set();

    EMOJI_RANGES.forEach(([start, end]) => {
      for (let codePoint = start; codePoint <= end; codePoint += 1) {
        const character = String.fromCodePoint(codePoint);

        if (
          !regexes.emoji.test(character) ||
          regexes.component.test(character)
        ) {
          continue;
        }

        const emoji = regexes.presentation.test(character)
          ? character
          : `${character}\ufe0f`;

        if (!seen.has(emoji)) {
          seen.add(emoji);
          emojis.push(emoji);
        }
      }
    });

    return emojis;
  }

  function getEmojiRegexes() {
    try {
      return {
        emoji: new RegExp("\\p{Emoji}", "u"),
        component: new RegExp("\\p{Emoji_Component}", "u"),
        presentation: new RegExp("\\p{Emoji_Presentation}", "u"),
      };
    } catch (error) {
      return null;
    }
  }

  function getEmojiCategoryKeywords(codePoint) {
    if (!codePoint) {
      return "emoji";
    }

    if (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) {
      return "emoji nature food object symbol";
    }

    if (codePoint >= 0x1f600 && codePoint <= 0x1f64f) {
      return "emoji face smile person emotion";
    }

    if (codePoint >= 0x1f680 && codePoint <= 0x1f6ff) {
      return "emoji travel vehicle transport sign";
    }

    if (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) {
      return "emoji person animal food object";
    }

    if (codePoint >= 0x1fa70 && codePoint <= 0x1faff) {
      return "emoji object symbol animal";
    }

    if (codePoint >= 0x2600 && codePoint <= 0x27bf) {
      return "emoji symbol weather star heart";
    }

    return "emoji symbol";
  }

  function selectDraftEmoji(emoji) {
    if (!emoji || !ui.draftStore) {
      return;
    }

    syncDraftFromForm();
    ui.draftStore.emojiLogo = emoji;
    ui.error = "";
    renderStoreForm();
  }

  function beginDraftStore(storeId, options = {}) {
    const store = data.stores.find((candidate) => candidate.id === storeId);

    ui.editingStoreId = store ? store.id : null;
    ui.emojiFilter = "";
    ui.draftStore = store
      ? {
          id: store.id,
          name: store.name,
          description: store.description,
          emojiLogo: store.emojiLogo,
          themeId: DEFAULT_THEME_ID,
          priceOptions: [...store.priceOptions],
        }
      : {
          id: makeId(),
          name: "",
          description: "",
          emojiLogo: DEFAULT_EMOJI,
          themeId: DEFAULT_THEME_ID,
          priceOptions: [...DEFAULT_PRICES],
        };
    ui.error = "";
    ui.route = "store-form";

    if (options.renderNow !== false) {
      render();
    }
  }

  function clearDraft() {
    ui.draftStore = null;
    ui.editingStoreId = null;
    ui.error = "";
  }

  function syncDraftFromForm() {
    const form = app.querySelector("[data-form='store']");
    if (!form || !ui.draftStore) {
      return;
    }

    const fields = new FormData(form);
    ui.draftStore.name = String(fields.get("name") || "").trim();
    ui.draftStore.description = String(fields.get("description") || "").trim();
  }

  function addDraftPrice() {
    syncDraftFromForm();
    const input = app.querySelector("input[name='newPrice']");
    const price = roundMoney(input?.value || 0);

    if (!price) {
      ui.error = "Enter a price above $0.";
      renderStoreForm();
      return;
    }

    ui.draftStore.priceOptions = uniquePrices([...ui.draftStore.priceOptions, price]);
    ui.error = "";
    renderStoreForm();
  }

  function toggleDraftPrice(rawPrice) {
    syncDraftFromForm();
    const price = roundMoney(rawPrice || 0);
    const hasPrice = ui.draftStore.priceOptions.some(
      (priceOption) => roundMoney(priceOption) === price
    );

    if (!price) {
      return;
    }

    if (hasPrice && ui.draftStore.priceOptions.length === 1) {
      ui.error = "Keep at least one price button.";
      renderStoreForm();
      return;
    }

    ui.draftStore.priceOptions = hasPrice
      ? ui.draftStore.priceOptions.filter(
          (priceOption) => roundMoney(priceOption) !== price
        )
      : uniquePrices([...ui.draftStore.priceOptions, price]);
    ui.error = "";
    renderStoreForm();
  }

  function saveDraftStore() {
    syncDraftFromForm();
    const draft = ui.draftStore;

    if (!draft.name) {
      ui.error = "Store name is required.";
      renderStoreForm();
      return;
    }

    if (!draft.priceOptions.length) {
      ui.error = "Add at least one price button.";
      renderStoreForm();
      return;
    }

    const nextStore = {
      id: draft.id,
      name: draft.name,
      description: draft.description,
      emojiLogo: draft.emojiLogo || DEFAULT_EMOJI,
      themeId: DEFAULT_THEME_ID,
      priceOptions: uniquePrices(draft.priceOptions),
    };

    if (ui.editingStoreId) {
      data.stores = data.stores.map((store) =>
        store.id === ui.editingStoreId ? nextStore : store
      );
    } else {
      data.stores = [...data.stores, nextStore];
    }

    data.activeStoreId = nextStore.id;
    data.salesByStoreId[nextStore.id] =
      data.salesByStoreId[nextStore.id] || normalizeSale(null);
    data.receiptsByStoreId[nextStore.id] = data.receiptsByStoreId[nextStore.id] || [];
    clearDraft();
    saveData();
    ui.route = "register";
    render();
  }

  function deleteCurrentDraftStore() {
    if (!ui.editingStoreId || data.stores.length <= 1) {
      return;
    }

    const draftName = ui.draftStore?.name || "this store";
    if (!window.confirm(`Delete ${draftName}?`)) {
      return;
    }

    data.stores = data.stores.filter((store) => store.id !== ui.editingStoreId);
    delete data.salesByStoreId[ui.editingStoreId];
    delete data.receiptsByStoreId[ui.editingStoreId];

    if (!data.stores.some((store) => store.id === data.activeStoreId)) {
      data.activeStoreId = data.stores[0]?.id || null;
    }

    clearDraft();
    saveData();
    ui.route = data.stores.length > 1 ? "store-picker" : "register";
    render();
  }

  function beginSaleStart() {
    const store = currentStore();
    if (!store) {
      ui.route = "store-form";
      render();
      return;
    }

    clearScanTimer();
    ui.saleStartCustomerName = "";
    ui.route = "sale-start";
    ui.error = "";
    render();
  }

  function startNewSale(customerName) {
    const store = currentStore();
    if (!store) {
      ui.route = "store-form";
      render();
      return;
    }

    const nextCustomerName = String(customerName || "").trim();
    if (!nextCustomerName) {
      ui.saleStartCustomerName = "";
      ui.error = "Customer name is required.";
      ui.route = "sale-start";
      render();
      return;
    }

    data.salesByStoreId[store.id] = normalizeSale({
      customerName: nextCustomerName,
    });
    ui.activeSaleStoreIds.add(store.id);
    saveData();
    ui.route = "register";
    ui.saleStartCustomerName = "";
    ui.error = "";
    render();
  }

  function openReceipt(receiptId) {
    const receipt = findCurrentReceipt(receiptId);
    if (!receipt) {
      return;
    }

    clearScanTimer();
    ui.selectedReceiptId = receipt.id;
    ui.route = "receipt";
    ui.error = "";
    render();
  }

  function deleteReceipt(receiptId) {
    const store = currentStore();
    const receipt = findCurrentReceipt(receiptId);
    if (!store || !receipt) {
      ui.selectedReceiptId = "";
      ui.route = "register";
      render();
      return;
    }

    if (!window.confirm("Delete this receipt?")) {
      return;
    }

    data.receiptsByStoreId[store.id] = currentReceiptHistory(store).filter(
      (candidate) => candidate.id !== receipt.id
    );

    const sale = currentSale();
    if (
      sale.paid &&
      sale.receiptNumber === receipt.receiptNumber &&
      sale.paidAt === receipt.paidAt
    ) {
      data.salesByStoreId[store.id] = normalizeSale(null);
    }

    saveData();
    ui.selectedReceiptId = "";
    ui.route = "register";
    ui.error = "";
    render();
  }

  function startScan() {
    clearScanTimer();
    const store = currentStore();
    const sale = currentSale();
    if (!isSaleStarted(store, sale)) {
      beginSaleStart();
      return;
    }

    sale.paymentType = "";
    saveData();
    ui.route = "scanning";
    ui.error = "";
    render();
    ui.scanSoundTimer = window.setTimeout(() => {
      playScanSound();
      ui.scanSoundTimer = null;
    }, SCAN_SOUND_DELAY_MS);
    ui.scanTimer = window.setTimeout(() => {
      ui.route = "price";
      ui.scanTimer = null;
      render();
    }, SCAN_DURATION_MS);
  }

  function clearScanTimer() {
    if (ui.scanSoundTimer) {
      window.clearTimeout(ui.scanSoundTimer);
      ui.scanSoundTimer = null;
    }

    if (ui.scanTimer) {
      window.clearTimeout(ui.scanTimer);
      ui.scanTimer = null;
    }
  }

  function addItem(price) {
    if (!price) {
      ui.error = "Enter a price above $0.";
      renderPriceSelect();
      return;
    }

    const sale = currentSale();
    const store = currentStore();
    if (store) {
      ui.activeSaleStoreIds.add(store.id);
    }
    sale.items.push({ id: makeId(), price });
    sale.paid = false;
    sale.paymentType = "";
    saveData();
    ui.route = "register";
    ui.error = "";
    render();
  }

  function addCustomItem() {
    const input = app.querySelector("[data-custom-price]");
    addItem(roundMoney(input?.value || 0));
  }

  function removeItem(itemId) {
    const sale = currentSale();
    sale.items = sale.items.filter((item) => item.id !== itemId);
    sale.paid = false;
    sale.paymentType = "";
    saveData();
    renderRegister();
  }

  function setTip(tip) {
    syncCheckoutCustomerName();
    const sale = currentSale();
    sale.tip = tip;
    sale.paid = false;
    sale.paymentType = "";
    saveData();
    renderCheckout();
  }

  function completePayment(paymentType) {
    syncCheckoutCustomerName();
    const tipInput = app.querySelector("[data-tip-input]");
    if (tipInput) {
      currentSale().tip = roundMoney(tipInput.value);
    }

    const sale = currentSale();
    const store = currentStore();
    if (!isSaleStarted(store, sale) || !sale.items.length) {
      ui.route = "register";
      render();
      return;
    }

    if (!sale.customerName) {
      ui.error = "Customer name is required.";
      renderCheckout();
      return;
    }

    sale.paid = false;
    sale.paymentType = paymentType;
    sale.signatureDataUrl = "";
    sale.receiptNumber = "";
    sale.paidAt = "";
    saveData();
    playPaymentSound();
    ui.error = "";
    ui.route = "signature";
    render();
  }

  function prepareSignaturePad() {
    ui.signaturePad = {
      drawing: false,
      hasInk: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
    };

    updateSignatureDoneButton();

    const canvas = app.querySelector("[data-signature-pad]");
    if (!canvas || typeof canvas.getContext !== "function") {
      return;
    }

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(Math.round((rect.width || canvas.clientWidth || 300) * ratio), 1);
    const height = Math.max(Math.round((rect.height || canvas.clientHeight || 180) * ratio), 1);
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width / ratio, height / ratio);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width / ratio, height / ratio);
    configureSignatureContext(context);
    updateSignatureDoneButton();
  }

  function clearSignaturePad() {
    ui.error = "";
    prepareSignaturePad();
  }

  function acceptSignature() {
    const sale = currentSale();
    const store = currentStore();
    const canvas = app.querySelector("[data-signature-pad]");

    if (!ui.signaturePad.hasInk || !canvas) {
      ui.error = "Signature is required.";
      renderSignature();
      return;
    }

    sale.signatureDataUrl =
      typeof canvas.toDataURL === "function" ? canvas.toDataURL("image/png") : "";
    sale.paid = true;
    sale.receiptNumber = sale.receiptNumber || makeReceiptNumber();
    sale.paidAt = new Date().toISOString();
    if (store) {
      const receipt = addReceiptToHistory(store, sale);
      ui.selectedReceiptId = receipt?.id || "";
      ui.activeSaleStoreIds.delete(store.id);
    }
    saveData();
    ui.error = "";
    ui.route = "approved";
    render();
  }

  function handleSignaturePointerDown(event) {
    const canvas = event.target.closest?.("[data-signature-pad]");
    if (ui.route !== "signature" || !canvas) {
      return;
    }

    event.preventDefault();
    const point = getSignaturePoint(canvas, event);
    ui.signaturePad = {
      drawing: true,
      hasInk: true,
      pointerId: event.pointerId,
      lastX: point.x,
      lastY: point.y,
    };
    canvas.setPointerCapture?.(event.pointerId);
    drawSignatureDot(canvas, point);
    ui.error = "";
    updateSignatureDoneButton();
  }

  function handleSignaturePointerMove(event) {
    if (
      ui.route !== "signature" ||
      !ui.signaturePad.drawing ||
      ui.signaturePad.pointerId !== event.pointerId
    ) {
      return;
    }

    const canvas = app.querySelector("[data-signature-pad]");
    if (!canvas) {
      return;
    }

    event.preventDefault();
    const point = getSignaturePoint(canvas, event);
    drawSignatureLine(
      canvas,
      { x: ui.signaturePad.lastX, y: ui.signaturePad.lastY },
      point
    );
    ui.signaturePad.lastX = point.x;
    ui.signaturePad.lastY = point.y;
    ui.signaturePad.hasInk = true;
    updateSignatureDoneButton();
  }

  function handleSignaturePointerEnd(event) {
    if (
      ui.route !== "signature" ||
      !ui.signaturePad.drawing ||
      ui.signaturePad.pointerId !== event.pointerId
    ) {
      return;
    }

    const canvas = app.querySelector("[data-signature-pad]");
    canvas?.releasePointerCapture?.(event.pointerId);
    ui.signaturePad.drawing = false;
    ui.signaturePad.pointerId = null;
  }

  function getSignaturePoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function drawSignatureDot(canvas, point) {
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    configureSignatureContext(context);
    context.beginPath();
    context.arc(point.x, point.y, 2, 0, Math.PI * 2);
    context.fillStyle = "#202124";
    context.fill();
  }

  function drawSignatureLine(canvas, from, to) {
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    configureSignatureContext(context);
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }

  function configureSignatureContext(context) {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 4;
    context.strokeStyle = "#202124";
  }

  function updateSignatureDoneButton() {
    const button = app.querySelector("[data-accept-signature]");
    if (button) {
      button.disabled = !ui.signaturePad.hasInk;
    }
  }

  function syncCheckoutCustomerName() {
    const input = app.querySelector("[data-checkout-customer-name]");
    if (!input) {
      return;
    }

    currentSale().customerName = input.value.trim();
  }

  function updateCheckoutTotals() {
    const sale = currentSale();
    const totals = calculateTotals(sale);
    const tipDisplay = app.querySelector("[data-tip-display]");
    const finalDisplay = app.querySelector("[data-final-display]");

    if (tipDisplay) {
      tipDisplay.textContent = formatMoney(sale.tip);
    }

    if (finalDisplay) {
      finalDisplay.textContent = formatMoney(totals.total);
    }
  }

  function calculateTotals(sale) {
    const subtotalCents = sale.items.reduce(
      (sum, item) => sum + moneyToCents(item.price),
      0
    );
    const tipCents = moneyToCents(sale.tip);

    return {
      subtotal: subtotalCents / 100,
      tip: tipCents / 100,
      total: (subtotalCents + tipCents) / 100,
    };
  }

  function findReceiptIdForSale(store, sale) {
    if (!store || !sale?.receiptNumber || !sale?.paidAt) {
      return "";
    }

    const receipt = currentReceiptHistory(store).find(
      (candidate) =>
        candidate.receiptNumber === sale.receiptNumber &&
        candidate.paidAt === sale.paidAt
    );
    return receipt?.id || "";
  }

  function playScanSound() {
    playSoundEffect("scan", [
      { frequency: 880, delay: 0, duration: 0.09, gain: 0.12 },
      { frequency: 1320, delay: 0.1, duration: 0.1, gain: 0.1 },
    ]);
  }

  function playPaymentSound() {
    playSoundEffect("payment", [
      { frequency: 523.25, delay: 0, duration: 0.12, gain: 0.1 },
      { frequency: 659.25, delay: 0.12, duration: 0.12, gain: 0.1 },
      { frequency: 783.99, delay: 0.24, duration: 0.24, gain: 0.12 },
    ]);
  }

  function primeAudio() {
    preloadSoundPlayers();

    const context = getAudioContext();
    if (!context || context.state !== "suspended") {
      return;
    }

    context.resume().catch(() => {});
  }

  function preloadSoundPlayers() {
    Object.keys(SOUND_FILES).forEach((name) => {
      getSoundPlayer(name);
    });
  }

  function getSoundPlayer(name) {
    const source = SOUND_FILES[name];
    if (!source) {
      return null;
    }

    if (!soundPlayers[name]) {
      const audio = new Audio(source);
      audio.preload = "auto";
      audio.volume = name === "payment" ? 0.85 : 1;
      soundPlayers[name] = audio;
    }

    return soundPlayers[name];
  }

  function playSoundEffect(name, fallbackNotes) {
    const player = getSoundPlayer(name);
    if (!player) {
      playToneSequence(fallbackNotes);
      return;
    }

    try {
      player.pause();
      player.currentTime = 0;
      const promise = player.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          playToneSequence(fallbackNotes);
        });
      }
    } catch (error) {
      playToneSequence(fallbackNotes);
    }
  }

  function playToneSequence(notes) {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      context
        .resume()
        .then(() => scheduleToneSequence(context, notes))
        .catch(() => {});
      return;
    }

    scheduleToneSequence(context, notes);
  }

  function getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContext();
    }

    return audioContext;
  }

  function scheduleToneSequence(context, notes) {
    notes.forEach((note) => {
      const startTime = context.currentTime + 0.02 + note.delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(note.frequency, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(note.gain, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration + 0.02);
    });
  }

  function formatMoney(value) {
    return roundMoney(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function formatReceiptDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function roundMoney(value) {
    const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(numeric) || numeric < 0) {
      return 0;
    }
    return Math.round(numeric * 100) / 100;
  }

  function moneyToCents(value) {
    return Math.round(roundMoney(value) * 100);
  }

  function uniquePrices(prices) {
    return [...new Set(prices.map(roundMoney).filter((price) => price > 0))].sort(
      (a, b) => a - b
    );
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function makeReceiptNumber() {
    return Date.now().toString().slice(-6);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
