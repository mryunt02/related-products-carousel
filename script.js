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
        <h2 class="carousel-title">Benzer Ürünler</h2>
        <div class="carousel-track">
          ${products
            .map(
              (product) => `
                <a class="carousel-card" data-id="${product.id}" href="${
                product.url
              }" target="_blank" rel="noopener" tabindex="0" aria-label="${
                product.name
              } - ${product.price}">
                  <div class="carousel-img-wrap">
                    <img src="${product.img}" alt="${
                product.name
              }" class="carousel-img" />
                    <button type="button" class="carousel-heart${
                      favorites[product.id] ? " active" : ""
                    }" data-id="${
                product.id
              }" aria-label="Favorilere ekle/kaldır">
                          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20"><path fill="${
                            favorites[product.id] ? "#193DB0" : "#fff"
                          }" fill-rule="evenodd" stroke="${
                favorites[product.id] ? "#193DB0" : "#B6B7B9"
              }" d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z" clip-rule="evenodd"></path></svg>
                    </button>
                  </div>
                  <div class="carousel-info">
                    <div class="carousel-name">${product.name}</div>
                    <div class="carousel-price">${product.price}</div>
                  </div>
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    `;
    $(".product-detail").append(html);
  }

  function buildCSS() {
    if (!$("head link.open-sans-font").length) {
      $(
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap" class="open-sans-font">'
      ).appendTo("head");
    }
    const css = `
      .carousel-container {
        margin-top: 32px;
        padding: 16px 0;
        background: #fff;
        width: 80%;
        margin: 0 auto;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 16px;
        color: #222;
        padding: 15px 0;
        font-size: 32px;
        font-family: 'Open Sans', Arial, sans-serif;
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
        font-family: 'Open Sans', Arial, sans-serif;
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
        top: 6%;
        right: 10%;
        cursor: pointer;
        z-index: 2;
        transition: fill 0.2s;
        background: none;
        border: none;
      }
      .carousel-heart.active svg {
        fill: #0074e4;
      }
      .carousel-info {
        padding: 12px;
        text-align: left;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-name {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 8px;
        color: #333;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-price {
        font-size: 1rem;
        color: #0074e4;
        font-weight: 600;
        font-family: 'Open Sans', Arial, sans-serif;
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
    $(".carousel-heart").on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      const id = $(this).data("id");
      favorites[id] = !favorites[id];
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
      $(this).toggleClass("active");
      $(this)
        .find("svg path")
        .attr("fill", favorites[id] ? "#193DB0" : "#fff")
        .attr("stroke", favorites[id] ? "#193DB0" : "#B6B7B9");
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
