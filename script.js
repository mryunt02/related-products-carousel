(() => {
  if (!$(".product-detail").length) return;

  const PRODUCTS_URL =
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
  const STORAGE_KEY = "carousel_products";
  const FAV_KEY = "carousel_favorites";
  let products = [];
  let favorites = JSON.parse(localStorage.getItem(FAV_KEY) || "{}");

  const init = async () => {
    await loadProducts();
    buildHTML();
    buildCSS();
    setEvents();
  };

  async function loadProducts() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      products = JSON.parse(cached);
    } else {
      try {
        const res = await fetch(PRODUCTS_URL);
        products = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (e) {
        products = [];
      }
    }
  }

  function buildHTML() {
    const html = `
      <div class="carousel-container">
        <h2 class="carousel-title">You Might Also Like</h2>
        <div class="carousel-track">
        ${console.log(products)}
          ${products
            .map(
              (product) => `
            <div class="carousel-card" data-id="${product.id}">
              <div class="carousel-img-wrap">
                <img src="${product.img}" alt="${
                product.name
              }" class="carousel-img" />
                <span class="carousel-heart${
                  favorites[product.id] ? " active" : ""
                }" data-id="${product.id}">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="${
                    favorites[product.id] ? "#0074e4" : "none"
                  }" stroke="#0074e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.6-7-10.2A5.2 5.2 0 0 1 12 5.2a5.2 5.2 0 0 1 7 5.6C19 15.4 12 21 12 21z"/></svg>
                </span>
              </div>
              <div class="carousel-info">
                <div class="carousel-name">${product.name}</div>
                <div class="carousel-price">${product.price}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    $(".product-detail").append(html);
  }

  function buildCSS() {
    const css = `
      .carousel-container {
        margin-top: 32px;
        padding: 16px 0;
        background: #fff;
      }
      .carousel-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 16px;
        color: #222;
      }
      .carousel-track {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 8px;
      }
      .carousel-card {
        min-width: 180px;
        max-width: 220px;
        background: #f7f7f7;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        scroll-snap-align: start;
        position: relative;
        cursor: pointer;
        transition: box-shadow 0.2s;
      }
      .carousel-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      }
      .carousel-img-wrap {
        position: relative;
        width: 100%;
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 12px 12px 0 0;
        background: #fff;
      }
      .carousel-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .carousel-heart {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        z-index: 2;
        transition: fill 0.2s;
      }
      .carousel-heart.active svg {
        fill: #0074e4;
      }
      .carousel-info {
        padding: 12px;
        text-align: left;
      }
      .carousel-name {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 8px;
        color: #333;
      }
      .carousel-price {
        font-size: 1rem;
        color: #0074e4;
        font-weight: 600;
      }
      @media (max-width: 900px) {
        .carousel-card { min-width: 140px; max-width: 160px; }
        .carousel-img-wrap { height: 120px; }
      }
      @media (max-width: 600px) {
        .carousel-card { min-width: 110px; max-width: 120px; }
        .carousel-img-wrap { height: 80px; }
        .carousel-title { font-size: 1.1rem; }
      }
    `;
    if (!$("head .carousel-style").length) {
      $("<style>").addClass("carousel-style").html(css).appendTo("head");
    }
  }

  function setEvents() {
    $(".carousel-card").on("click", function (e) {
      if ($(e.target).closest(".carousel-heart").length) return;
      const id = $(this).data("id");
      const product = products.find((p) => p.id === id);
      if (product && product.url) {
        window.open(product.url, "_blank");
      }
    });
    $(".carousel-heart").on("click", function (e) {
      e.stopPropagation();
      const id = $(this).data("id");
      favorites[id] = !favorites[id];
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
      $(this).toggleClass("active");
      $(this)
        .find("svg")
        .attr("fill", favorites[id] ? "#0074e4" : "none");
    });
  }

  if (typeof $ === "undefined") {
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    script.onload = init;
    document.head.appendChild(script);
  } else {
    init();
  }
})();
