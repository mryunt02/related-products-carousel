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
      <div class="recommendation-carousel" style="background:#f4f5f7;padding:0;">
        <div class="carousel-container">
          <button type="button" aria-label="previous" class="buttonBack___1mlaL carousel__back-button carousel-arrow carousel-arrow-left" disabled="">
            <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
          </button>
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
                    <div class="carousel-inner-card">
                      <div class="new-product-card">
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
                        <div class="carousel-price"><p class="carousel-price-text">${
                          product.price
                        }</p></div>
                      </div>
                      </div>
                    </div>
                  </a>
                `
              )
              .join("")}
          </div>
          <button type="button" aria-label="right" class="carousel-arrow carousel-arrow-right" style="position:absolute;right:-40px;top:50%;transform:translateY(-50%) rotate(180deg);background:none;border:none;cursor:pointer;z-index:2;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
          </button>
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
      * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', Arial, sans-serif;
      }
      .recommendation-carousel {
        background: #f4f5f7;
        width: 100%;
        padding: 0;
      }
      .carousel-container {
        margin-top: 32px;
        padding: 16px 0;
        width: 80%;
        margin: 0 auto;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-title {
        margin-bottom: 16px;
        color: #222;
        padding: 15px 0;
        font-size: 32px;
        font-weight: lighter;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-track {
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 8px;
        display: flex;
        align-items: stretch;
        width: 302.083%;
        transform: translateX(0%) translateX(0px);
        flex-direction: row;
      }
      .carousel-card {
        width: 6.66667%;
        height: fit-content;
        padding-bottom: unset;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      }
      .carousel-inner-card {
        width: calc(100% - 10px);
        height: calc(100% - 10px);
      }
      .carousel-img-wrap {
        position: relative;
        overflow: hidden;
      
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
      .new-product-card {
        width: 22rem;
        height: auto;
      }
      .carousel-info {
        padding: 0px 12px;
        display: flex;
        flex-direction: column;
        text-align: left;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-name {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        color: #302e2b;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .carousel-price {
        color: #193db0;
        font-size: 18px;
        font-weight: 600;
        height: 44px;
        font-family: 'Open Sans', Arial, sans-serif;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
      }
      .carousel-price-text {
        margin: 0 !important;
      }
      @media (max-width: 992px) {
        .carousel-card { min-width: 140px; max-width: 160px; }
        .carousel-img-wrap { height: 120px; }
        .carousel-title { font-size: 24px; }
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
