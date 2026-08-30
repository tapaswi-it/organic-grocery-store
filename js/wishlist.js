/* ========================================
   ORGANIC GROCERY STORE
   WISHLIST SYSTEM
======================================== */


/* ========================================
   WISHLIST CONFIGURATION
======================================== */

const WISHLIST_STORAGE_KEY =
    "organic-grocery-wishlist";


/* ========================================
   WISHLIST STATE
======================================== */

let wishlist =
    loadWishlist();


/* ========================================
   DOM READY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initWishlist();

});


/* ========================================
   INITIALIZE WISHLIST
======================================== */

function initWishlist() {

    updateWishlistCount();

    initWishlistButtons();

    renderWishlistPage();

}


/* ========================================
   LOAD WISHLIST
======================================== */

function loadWishlist() {

    try {

        const storedWishlist =
            localStorage.getItem(
                WISHLIST_STORAGE_KEY
            );


        if (!storedWishlist) {
            return [];
        }


        const parsedWishlist =
            JSON.parse(storedWishlist);


        if (!Array.isArray(parsedWishlist)) {
            return [];
        }


        /*
         * Keep only valid product IDs.
         *
         * A Set removes accidental duplicates.
         */

        return [
            ...new Set(
                parsedWishlist.filter(
                    (id) =>
                        id !== null &&
                        id !== undefined &&
                        String(id).trim() !== ""
                )
            )
        ];

    } catch (error) {

        console.warn(
            "Unable to load wishlist.",
            error
        );


        return [];

    }

}


/* ========================================
   SAVE WISHLIST
======================================== */

function saveWishlist() {

    try {

        localStorage.setItem(
            WISHLIST_STORAGE_KEY,
            JSON.stringify(wishlist)
        );

    } catch (error) {

        console.warn(
            "Unable to save wishlist.",
            error
        );

    }


    updateWishlistCount();

}


/* ========================================
   ADD TO WISHLIST
======================================== */

/**
 * Add a product to the wishlist.
 *
 * @param {string|number} productId
 */

function addToWishlist(productId) {

    if (!isValidWishlistProduct(productId)) {
        return;
    }


    const alreadyInWishlist =
        wishlist.some(
            (id) =>
                String(id) ===
                String(productId)
        );


    if (alreadyInWishlist) {
        return;
    }


    wishlist.push(productId);

    saveWishlist();

    updateWishlistButtons();

    showWishlistFeedback(
        "Added to your wishlist."
    );

}


/* ========================================
   REMOVE FROM WISHLIST
======================================== */

/**
 * Remove a product from the wishlist.
 *
 * @param {string|number} productId
 */

function removeFromWishlist(productId) {

    wishlist =
        wishlist.filter(
            (id) =>
                String(id) !==
                String(productId)
        );


    saveWishlist();

    updateWishlistButtons();

    renderWishlistPage();

}


/* ========================================
   TOGGLE WISHLIST
======================================== */

/**
 * Add or remove a product from the wishlist.
 *
 * @param {string|number} productId
 */

function toggleWishlist(productId) {

    if (isInWishlist(productId)) {

        removeFromWishlist(productId);

        return;

    }


    addToWishlist(productId);

}


/* ========================================
   CHECK WISHLIST STATUS
======================================== */

/**
 * Check whether a product is in the wishlist.
 *
 * @param {string|number} productId
 * @returns {boolean}
 */

function isInWishlist(productId) {

    return wishlist.some(
        (id) =>
            String(id) ===
            String(productId)
    );

}


/* ========================================
   VALIDATE PRODUCT
======================================== */

function isValidWishlistProduct(productId) {

    if (
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        console.warn(
            "Product catalogue is unavailable."
        );

        return false;

    }


    const product =
        products.find(
            (item) =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        console.warn(
            "Product not found:",
            productId
        );

        return false;

    }


    return true;

}


/* ========================================
   GET WISHLIST PRODUCTS
======================================== */

function getWishlistProducts() {

    if (
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        return [];

    }


    return wishlist
        .map((wishlistId) => {

            return products.find(
                (product) =>
                    String(product.id) ===
                    String(wishlistId)
            );

        })
        .filter(Boolean);

}


/* ========================================
   WISHLIST COUNT
======================================== */

function getWishlistCount() {

    return wishlist.length;

}


function updateWishlistCount() {

    const count =
        getWishlistCount();


    const counters =
        document.querySelectorAll(
            "[data-wishlist-count]"
        );


    counters.forEach((counter) => {

        counter.textContent =
            count;


        counter.hidden =
            count === 0;

    });

}


/* ========================================
   WISHLIST BUTTONS
======================================== */

function initWishlistButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-wishlist-id]"
        );


    buttons.forEach((button) => {

        if (
            button.dataset.wishlistInitialized ===
            "true"
        ) {

            return;

        }


        button.dataset.wishlistInitialized =
            "true";


        button.addEventListener(
            "click",
            () => {

                const productId =
                    button.dataset.wishlistId;


                if (!productId) {
                    return;
                }


                toggleWishlist(productId);

            }
        );

    });


    updateWishlistButtons();

}


/* ========================================
   UPDATE WISHLIST BUTTON STATES
======================================== */

function updateWishlistButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-wishlist-id]"
        );


    buttons.forEach((button) => {

        const productId =
            button.dataset.wishlistId;


        if (!productId) {
            return;
        }


        const active =
            isInWishlist(productId);


        button.classList.toggle(
            "is-active",
            active
        );


        button.setAttribute(
            "aria-pressed",
            String(active)
        );


        button.setAttribute(
            "aria-label",
            active
                ? "Remove from wishlist"
                : "Add to wishlist"
        );


        /*
         * If the button contains visible text,
         * update only buttons that use the standard
         * wishlist labels.
         */

        const label =
            button.querySelector(
                "[data-wishlist-label]"
            );


        if (label) {

            label.textContent =
                active
                    ? "Remove from wishlist"
                    : "Add to wishlist";

        }

    });

}


/* ========================================
   WISHLIST PAGE
======================================== */

function renderWishlistPage() {

    const container =
        document.querySelector(
            "#wishlist-grid"
        );


    if (!container) {
        return;
    }


    const wishlistProducts =
        getWishlistProducts();


    const emptyState =
        document.querySelector(
            "#wishlist-empty"
        );


    const wishlistContent =
        document.querySelector(
            "#wishlist-content"
        );


    if (!wishlistProducts.length) {

        container.innerHTML = "";


        if (emptyState) {
            emptyState.hidden = false;
        }


        if (wishlistContent) {
            wishlistContent.hidden = true;
        }


        return;

    }


    if (emptyState) {
        emptyState.hidden = true;
    }


    if (wishlistContent) {
        wishlistContent.hidden = false;
    }


    container.innerHTML =
        wishlistProducts
            .map((product) =>
                createWishlistCard(product)
            )
            .join("");


    initRenderedWishlistControls();

}


/* ========================================
   WISHLIST CARD
======================================== */

function createWishlistCard(product) {

    const price =
        Number(product.price) || 0;


    const productUrl =
        getWishlistProductUrl(
            product.id
        );


    const categoryName =
        getWishlistCategoryName(
            product.category
        );


    const isInStock =
        product.inStock !== false;


    return `
        <article
            class="product-card wishlist-card"
            data-product-id="${escapeWishlistHTML(
                String(product.id)
            )}"
        >

            <div class="product-image">

                <a
                    href="${escapeWishlistHTML(
                        productUrl
                    )}"
                    class="product-image-link"
                >

                    <img
                        src="${escapeWishlistHTML(
                            getWishlistAssetUrl(
                                product.image
                            )
                        )}"
                        alt="${escapeWishlistHTML(
                            product.name
                        )}"
                        loading="lazy"
                    >

                </a>


                ${
                    product.badge
                        ? `
                            <span class="product-badge">
                                ${escapeWishlistHTML(
                                    product.badge
                                )}
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="product-content">

                <span class="product-category">
                    ${escapeWishlistHTML(
                        categoryName
                    )}
                </span>


                <h2 class="product-name">

                    <a
                        href="${escapeWishlistHTML(
                            productUrl
                        )}"
                    >
                        ${escapeWishlistHTML(
                            product.name
                        )}
                    </a>

                </h2>


                <div class="product-meta">

                    <span class="product-price">
                        $${price.toFixed(2)}
                    </span>

                    ${
                        product.unit
                            ? `
                                <span class="product-unit">
                                    / ${escapeWishlistHTML(
                                        product.unit
                                    )}
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="wishlist-card-actions">

                    ${
                        isInStock
                            ? `
                                <button
                                    type="button"
                                    class="btn btn-primary wishlist-add-cart"
                                    data-product-id="${escapeWishlistHTML(
                                        String(product.id)
                                    )}"
                                >
                                    Add to cart
                                </button>
                              `
                            : `
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    disabled
                                >
                                    Out of stock
                                </button>
                              `
                    }


                    <button
                        type="button"
                        class="wishlist-remove"
                        data-wishlist-remove="${escapeWishlistHTML(
                            String(product.id)
                        )}"
                        aria-label="Remove ${escapeWishlistHTML(
                            product.name
                        )} from wishlist"
                    >
                        Remove
                    </button>

                </div>

            </div>

        </article>
    `;

}


/* ========================================
   RENDERED WISHLIST CONTROLS
======================================== */

function initRenderedWishlistControls() {

    const removeButtons =
        document.querySelectorAll(
            "[data-wishlist-remove]"
        );


    removeButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    button.dataset.wishlistRemove;


                if (!productId) {
                    return;
                }


                removeFromWishlist(
                    productId
                );

            }
        );

    });


    const addToCartButtons =
        document.querySelectorAll(
            ".wishlist-add-cart"
        );


    addToCartButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    button.dataset.productId;


                if (!productId) {
                    return;
                }


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
                    productId,
                    1
                );

            }
        );

    });

}


/* ========================================
   WISHLIST FEEDBACK
======================================== */

function showWishlistFeedback(message) {

    let feedback =
        document.querySelector(
            ".wishlist-feedback"
        );


    if (!feedback) {

        feedback =
            document.createElement("div");

        feedback.className =
            "wishlist-feedback";


        feedback.setAttribute(
            "role",
            "status"
        );


        feedback.setAttribute(
            "aria-live",
            "polite"
        );


        document.body.appendChild(
            feedback
        );

    }


    feedback.textContent =
        message;


    feedback.classList.add(
        "is-visible"
    );


    window.clearTimeout(
        feedback._hideTimeout
    );


    feedback._hideTimeout =
        window.setTimeout(() => {

            feedback.classList.remove(
                "is-visible"
            );

        }, 2500);

}


/* ========================================
   PRODUCT URL
======================================== */

function getWishlistProductUrl(productId) {

    const currentPath =
        window.location.pathname;


    const isInsidePagesDirectory =
        currentPath.includes("/pages/");


    const productPage =
        isInsidePagesDirectory
            ? "product.html"
            : "pages/product.html";


    return `${productPage}?id=${encodeURIComponent(
        productId
    )}`;

}


/* ========================================
   ASSET URL
======================================== */

function getWishlistAssetUrl(assetPath) {

    if (!assetPath) {
        return "";
    }


    const currentPath =
        window.location.pathname;


    const isInsidePagesDirectory =
        currentPath.includes("/pages/");


    if (
        isInsidePagesDirectory &&
        !assetPath.startsWith("../") &&
        !assetPath.startsWith("/")
    ) {

        return `../${assetPath}`;

    }


    return assetPath;

}


/* ========================================
   CATEGORY NAME
======================================== */

function getWishlistCategoryName(categoryId) {

    if (
        typeof categories === "undefined" ||
        !Array.isArray(categories)
    ) {

        return categoryId;

    }


    const category =
        categories.find(
            (item) =>
                String(item.id) ===
                String(categoryId)
        );


    return category
        ? category.name
        : categoryId;

}


/* ========================================
   HTML ESCAPING
======================================== */

function escapeWishlistHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
