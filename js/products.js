/* ========================================
   ORGANIC GROCERY STORE
   PRODUCT / HOMEPAGE RENDERING
======================================== */


/* ========================================
   DOM READY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderCategories();
    renderFeaturedProducts();
    renderBestSellers();
    renderTestimonials();
    renderProductDetail();

    /*
     * Cart may initialize after this file.
     * If it is already available, synchronize
     * the product cards immediately.
     */

    if (
        typeof refreshProductCardControls ===
        "function"
    ) {

        refreshProductCardControls();

    }

});


/* ========================================
   CART UPDATE LISTENER
======================================== */

document.addEventListener(
    "cartUpdated",
    () => {

        if (
            typeof refreshProductCardControls ===
            "function"
        ) {

            refreshProductCardControls();

        }

    }
);


/* ========================================
   PATH / URL HELPERS
======================================== */

function getAssetUrl(path) {

    if (!path) {
        return "";
    }


    const normalizedPath =
        String(path).replace(/^(\.\.\/)+/, "");


    const isPageDirectory =
        window.location.pathname
            .replace(/\\/g, "/")
            .includes("/pages/");


    return isPageDirectory
        ? `../${normalizedPath}`
        : normalizedPath;

}


function getProductUrl(productId) {

    const isPageDirectory =
        window.location.pathname
            .replace(/\\/g, "/")
            .includes("/pages/");


    return isPageDirectory
        ? `product.html?id=${encodeURIComponent(productId)}`
        : `pages/product.html?id=${encodeURIComponent(productId)}`;

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ========================================
   CATEGORIES
======================================== */

function renderCategories() {

    const container =
        document.querySelector(
            "#category-grid"
        );


    if (
        !container ||
        typeof categories === "undefined" ||
        !Array.isArray(categories)
    ) {

        return;

    }


    container.innerHTML =
        categories
            .map((category) => {

                return `
                    <article class="category-card">

                        <a
                            href="${escapeHTML(
                                getCategoryUrl(category)
                            )}"
                        >

                            <div class="category-image">

                                <img
                                    src="${escapeHTML(
                                        getAssetUrl(
                                            category.image
                                        )
                                    )}"
                                    alt="${escapeHTML(
                                        category.name
                                    )}"
                                    loading="lazy"
                                >

                            </div>


                            <div class="category-content">

                                <h3>
                                    ${escapeHTML(
                                        category.name
                                    )}
                                </h3>


                                ${
                                    category.description
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    category.description
                                                )}
                                            </p>
                                          `
                                        : ""
                                }

                            </div>

                        </a>

                    </article>
                `;

            })
            .join("");

}


function getCategoryUrl(category) {

    if (!category) {
        return "#";
    }


    if (category.link) {

        const link =
            String(category.link);


        if (
            link.startsWith("http://") ||
            link.startsWith("https://") ||
            link.startsWith("#")
        ) {

            return link;

        }


        const isPageDirectory =
            window.location.pathname
                .replace(/\\/g, "/")
                .includes("/pages/");


        if (
            isPageDirectory &&
            !link.startsWith("../")
        ) {

            return `../${link}`;

        }


        if (
            !isPageDirectory &&
            link.startsWith("../")
        ) {

            return link.replace(
                /^(\.\.\/)+/,
                ""
            );

        }


        return link;

    }


    return getShopUrl();

}


function getShopUrl() {

    const isPageDirectory =
        window.location.pathname
            .replace(/\\/g, "/")
            .includes("/pages/");


    return isPageDirectory
        ? "shop.html"
        : "pages/shop.html";

}


/* ========================================
   FEATURED PRODUCTS
======================================== */

function renderFeaturedProducts() {

    const container =
        document.querySelector(
            "#featured-products"
        );


    if (
        !container ||
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        return;

    }


    const featuredProducts =
        products.filter(
            (product) =>
                product.featured
        );


    renderProductCards(
        featuredProducts,
        container
    );

}


/* ========================================
   BEST SELLERS
======================================== */

function renderBestSellers() {

    const container =
        document.querySelector(
            "#best-sellers"
        );


    if (
        !container ||
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        return;

    }


    const bestSellers =
        products.filter(
            (product) =>
                product.bestSeller
        );


    renderProductCards(
        bestSellers,
        container
    );

}


/* ========================================
   PRODUCT CARDS
======================================== */

function renderProductCards(
    productsToRender,
    container
) {

    if (
        !container ||
        !Array.isArray(productsToRender)
    ) {

        return;

    }


    container.innerHTML =
        productsToRender
            .map((product) => {

                const price =
                    Number(product.price);


                const formattedPrice =
                    Number.isFinite(price)
                        ? price.toFixed(2)
                        : "0.00";


                const productUrl =
                    getProductUrl(product.id);


                const imageUrl =
                    getAssetUrl(product.image);


                const categoryName =
                    getCategoryName(
                        product.category
                    );


                const isInStock =
                    product.inStock !== false;


                return `
                    <article
                        class="product-card ${
                            !isInStock
                                ? "is-out-of-stock"
                                : ""
                        }"
                    >

                        <a
                            href="${escapeHTML(
                                productUrl
                            )}"
                            class="product-image-link"
                            aria-label="View ${escapeHTML(
                                product.name
                            )}"
                        >

                            <div class="product-image">

                                <img
                                    src="${escapeHTML(
                                        imageUrl
                                    )}"
                                    alt="${escapeHTML(
                                        product.name
                                    )}"
                                    loading="lazy"
                                >


                                ${
                                    product.badge
                                        ? `
                                            <span class="product-badge">
                                                ${escapeHTML(
                                                    product.badge
                                                )}
                                            </span>
                                          `
                                        : ""
                                }

                            </div>

                        </a>


                        <div class="product-content">

                            <span class="product-category">
                                ${escapeHTML(
                                    categoryName
                                )}
                            </span>


                            <h3 class="product-name">

                                <a
                                    href="${escapeHTML(
                                        productUrl
                                    )}"
                                >
                                    ${escapeHTML(
                                        product.name
                                    )}
                                </a>

                            </h3>


                            ${
                                product.description
                                    ? `
                                        <p class="product-description">
                                            ${escapeHTML(
                                                product.description
                                            )}
                                        </p>
                                      `
                                    : ""
                            }


                            <div class="product-meta">

                                <span class="product-price">
                                    $${formattedPrice}
                                </span>


                                ${
                                    product.unit
                                        ? `
                                            <span class="product-unit">
                                                / ${escapeHTML(
                                                    product.unit
                                                )}
                                            </span>
                                          `
                                        : ""
                                }

                            </div>


                            ${
                                isInStock
                                    ? `
                                        <button
                                            type="button"
                                            class="btn btn-primary product-add-button"
                                            data-product-id="${escapeHTML(
                                                String(
                                                    product.id
                                                )
                                            )}"
                                        >
                                            Add to cart
                                        </button>
                                      `
                                    : `
                                        <button
                                            type="button"
                                            class="btn btn-primary product-add-button"
                                            disabled
                                        >
                                            Out of stock
                                        </button>
                                      `
                            }

                        </div>

                    </article>
                `;

            })
            .join("");


    /*
     * Cart.js owns the transformation from
     * "Add to cart" to quantity controls.
     */

    if (
        typeof refreshProductCardControls ===
        "function"
    ) {

        refreshProductCardControls();

    }

}


/* ========================================
   CATEGORY NAME
======================================== */

function getCategoryName(categoryId) {

    if (
        typeof categories === "undefined" ||
        !Array.isArray(categories)
    ) {

        return categoryId || "Organic grocery";

    }


    const category =
        categories.find(
            (item) =>
                String(item.id) ===
                String(categoryId)
        );


    return category
        ? category.name
        : categoryId || "Organic grocery";

}


/* ========================================
   PRODUCT DETAIL PAGE
======================================== */

function renderProductDetail() {

    const container =
        document.querySelector(
            "#product-detail"
        );


    if (
        !container ||
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        return;

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        showProductNotFound();

        return;

    }


    const product =
        products.find(
            (item) =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        showProductNotFound();

        return;

    }


    const price =
        Number(product.price);


    const formattedPrice =
        Number.isFinite(price)
            ? price.toFixed(2)
            : "0.00";


    const categoryName =
        getCategoryName(
            product.category
        );


    const isInStock =
        product.inStock !== false;


    container.innerHTML = `

        <div class="product-detail">

            <div class="product-detail-image">

                <img
                    src="${escapeHTML(
                        getAssetUrl(
                            product.image
                        )
                    )}"
                    alt="${escapeHTML(
                        product.name
                    )}"
                >


                ${
                    product.badge
                        ? `
                            <span class="product-badge">
                                ${escapeHTML(
                                    product.badge
                                )}
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="product-detail-content">

                <a
                    href="${escapeHTML(
                        getShopUrl()
                    )}"
                    class="product-back-link"
                >
                    ← Back to shop
                </a>


                <span class="product-category">
                    ${escapeHTML(
                        categoryName
                    )}
                </span>


                <h1>
                    ${escapeHTML(
                        product.name
                    )}
                </h1>


                ${
                    product.description
                        ? `
                            <p class="product-description">
                                ${escapeHTML(
                                    product.description
                                )}
                            </p>
                          `
                        : ""
                }


                <div class="product-detail-price">

                    <span class="product-price">
                        $${formattedPrice}
                    </span>


                    ${
                        product.unit
                            ? `
                                <span class="product-unit">
                                    / ${escapeHTML(
                                        product.unit
                                    )}
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="product-quantity">

                    <label for="product-quantity">
                        Quantity
                    </label>


                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-decrease"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <input
                            type="number"
                            id="product-quantity"
                            value="1"
                            min="1"
                            max="99"
                            inputmode="numeric"
                        >


                        <button
                            type="button"
                            class="quantity-increase"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="btn btn-primary product-detail-add"
                    data-product-id="${escapeHTML(
                        String(product.id)
                    )}"
                    ${!isInStock ? "disabled" : ""}
                >
                    ${
                        isInStock
                            ? "Add to cart"
                            : "Out of stock"
                    }
                </button>


                <div class="product-info-list">

                    ${
                        product.unit
                            ? `
                                <div>
                                    <span>Size</span>

                                    <strong>
                                        ${escapeHTML(
                                            product.unit
                                        )}
                                    </strong>
                                </div>
                              `
                            : ""
                    }


                    <div>

                        <span>Category</span>

                        <strong>
                            ${escapeHTML(
                                categoryName
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>Availability</span>

                        <strong>
                            ${
                                isInStock
                                    ? "In stock"
                                    : "Out of stock"
                            }
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    `;


    initProductQuantity();

    initProductAddToCart(product);

}


/* ========================================
   PRODUCT QUANTITY
======================================== */

function initProductQuantity() {

    const input =
        document.querySelector(
            "#product-quantity"
        );


    const decrease =
        document.querySelector(
            ".quantity-decrease"
        );


    const increase =
        document.querySelector(
            ".quantity-increase"
        );


    if (!input) {
        return;
    }


    const clampQuantity = () => {

        let quantity =
            parseInt(
                input.value,
                10
            );


        if (!Number.isFinite(quantity)) {
            quantity = 1;
        }


        quantity =
            Math.max(
                1,
                Math.min(
                    99,
                    quantity
                )
            );


        input.value =
            quantity;

    };


    input.addEventListener(
        "change",
        clampQuantity
    );


    decrease?.addEventListener(
        "click",
        () => {

            clampQuantity();


            input.value =
                Math.max(
                    1,
                    parseInt(
                        input.value,
                        10
                    ) - 1
                );

        }
    );


    increase?.addEventListener(
        "click",
        () => {

            clampQuantity();


            input.value =
                Math.min(
                    99,
                    parseInt(
                        input.value,
                        10
                    ) + 1
                );

        }
    );

}


/* ========================================
   PRODUCT DETAIL ADD TO CART
======================================== */

function initProductAddToCart(product) {

    const button =
        document.querySelector(
            ".product-detail-add"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const quantityInput =
                document.querySelector(
                    "#product-quantity"
                );


            const quantity =
                quantityInput
                    ? Math.max(
                        1,
                        parseInt(
                            quantityInput.value,
                            10
                        ) || 1
                    )
                    : 1;


            if (
                typeof addToCart !==
                "function"
            ) {

                console.warn(
                    "Cart system is not available."
                );

                return;

            }


            addToCart(
                product.id,
                quantity
            );

        }
    );

}


/* ========================================
   PRODUCT NOT FOUND
======================================== */

function showProductNotFound() {

    const detail =
        document.querySelector(
            "#product-detail"
        );


    const notFound =
        document.querySelector(
            "#product-not-found"
        );


    if (detail) {
        detail.innerHTML = "";
    }


    if (notFound) {
        notFound.hidden = false;
    }

}


/* ========================================
   TESTIMONIALS
======================================== */

function renderTestimonials() {

    const container =
        document.querySelector(
            "#testimonial-grid"
        );


    if (
        !container ||
        typeof testimonials === "undefined" ||
        !Array.isArray(testimonials)
    ) {

        return;

    }


    container.innerHTML =
        testimonials
            .map((testimonial) => {

                const rating =
                    Math.max(
                        0,
                        Math.min(
                            5,
                            Number(
                                testimonial.rating
                            ) || 0
                        )
                    );


                return `
                    <article class="testimonial-card">

                        <div
                            class="testimonial-rating"
                            aria-label="${rating} out of 5 stars"
                        >
                            ${"★".repeat(rating)}
                        </div>


                        <blockquote>
                            "${escapeHTML(
                                testimonial.quote
                            )}"
                        </blockquote>


                        <footer>

                            <strong>
                                ${escapeHTML(
                                    testimonial.name
                                )}
                            </strong>


                            <span>
                                ${escapeHTML(
                                    testimonial.location
                                )}
                            </span>

                        </footer>

                    </article>
                `;

            })
            .join("");

}
