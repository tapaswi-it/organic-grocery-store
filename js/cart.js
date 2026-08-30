/* ========================================
   ORGANIC GROCERY STORE
   CART SYSTEM
======================================== */


/* ========================================
   CART CONFIGURATION
======================================== */

const CART_STORAGE_KEY = "organic-grocery-cart";


/* ========================================
   CART STATE
======================================== */

let cart = loadCart();


/* ========================================
   DOM READY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initCart();

});


/* ========================================
   INITIALIZE CART
======================================== */

function initCart() {

    updateCartCount();

    initAddToCartButtons();

    renderCartPage();

    refreshProductCardControls();

}


/* ========================================
   LOAD CART
======================================== */

function loadCart() {

    try {

        const storedCart =
            localStorage.getItem(CART_STORAGE_KEY);


        if (!storedCart) {
            return [];
        }


        const parsedCart =
            JSON.parse(storedCart);


        if (!Array.isArray(parsedCart)) {
            return [];
        }


        return parsedCart
            .filter((item) => {

                return (
                    item &&
                    item.id !== undefined &&
                    Number.isFinite(Number(item.quantity)) &&
                    Number(item.quantity) > 0
                );

            })
            .map((item) => {

                return {
                    id: item.id,
                    quantity: Math.min(
                        99,
                        Math.max(
                            1,
                            Math.floor(
                                Number(item.quantity)
                            )
                        )
                    )
                };

            });

    } catch (error) {

        console.warn(
            "Unable to load cart.",
            error
        );

        return [];

    }

}


/* ========================================
   SAVE CART
======================================== */

function saveCart() {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.warn(
            "Unable to save cart.",
            error
        );

    }


    updateCartCount();

    refreshProductCardControls();

    document.dispatchEvent(
        new CustomEvent("cartUpdated")
    );

}


/* ========================================
   ADD TO CART
======================================== */

function addToCart(
    productId,
    quantity = 1
) {

    if (
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        console.warn(
            "Product catalogue is unavailable."
        );

        return;

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

        return;

    }


    if (product.inStock === false) {
        return;
    }


    const safeQuantity =
        Math.min(
            99,
            Math.max(
                1,
                Math.floor(
                    Number(quantity) || 1
                )
            )
        );


    const existingItem =
        cart.find(
            (item) =>
                String(item.id) ===
                String(productId)
        );


    if (existingItem) {

        existingItem.quantity =
            Math.min(
                99,
                existingItem.quantity +
                    safeQuantity
            );

    } else {

        cart.push({
            id: product.id,
            quantity: safeQuantity
        });

    }


    saveCart();


    showCartFeedback(
        `${product.name} added to your cart.`
    );


    renderCartPage();

}


/* ========================================
   REMOVE FROM CART
======================================== */

function removeFromCart(productId) {

    const previousLength =
        cart.length;


    cart =
        cart.filter(
            (item) =>
                String(item.id) !==
                String(productId)
        );


    if (cart.length === previousLength) {
        return;
    }


    saveCart();

    renderCartPage();

}


/* ========================================
   UPDATE CART ITEM
======================================== */

function updateCartItem(
    productId,
    quantity
) {

    const item =
        cart.find(
            (cartItem) =>
                String(cartItem.id) ===
                String(productId)
        );


    if (!item) {
        return;
    }


    let safeQuantity =
        Number(quantity);


    if (!Number.isFinite(safeQuantity)) {
        safeQuantity = 1;
    }


    safeQuantity =
        Math.min(
            99,
            Math.max(
                0,
                Math.floor(safeQuantity)
            )
        );


    if (safeQuantity === 0) {

        removeFromCart(productId);

        return;

    }


    item.quantity =
        safeQuantity;


    saveCart();

    renderCartPage();

}


/* ========================================
   GET CART QUANTITY
======================================== */

function getCartQuantity(productId) {

    const item =
        cart.find(
            (cartItem) =>
                String(cartItem.id) ===
                String(productId)
        );


    return item
        ? Number(item.quantity)
        : 0;

}


/* ========================================
   GET CART PRODUCTS
======================================== */

function getCartProducts() {

    if (
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        return [];

    }


    return cart
        .map((cartItem) => {

            const product =
                products.find(
                    (item) =>
                        String(item.id) ===
                        String(cartItem.id)
                );


            if (!product) {
                return null;
            }


            return {
                ...product,
                quantity: cartItem.quantity
            };

        })
        .filter(Boolean);

}


/* ========================================
   CART COUNT
======================================== */

function getCartItemCount() {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.quantity),
        0
    );

}


function updateCartCount() {

    const count =
        getCartItemCount();


    const counters =
        document.querySelectorAll(
            "[data-cart-count]"
        );


    counters.forEach((counter) => {

        counter.textContent =
            count > 0
                ? `(${count})`
                : "";

        counter.hidden =
            count === 0;

    });

}


/* ========================================
   PRODUCT CARD CONTROLS
======================================== */

/*
 * Product cards use one consistent area
 * for their cart interaction.
 *
 * Not in cart:
 *
 * ┌─────────────────────┐
 * │     Add to cart     │
 * └─────────────────────┘
 *
 *
 * In cart:
 *
 * ┌─────────────────────┐
 * │    −    2    +      │
 * └─────────────────────┘
 *          ×
 *
 */


function refreshProductCardControls() {

    const addButtons =
        document.querySelectorAll(
            ".product-add-button"
        );


    addButtons.forEach((button) => {

        const productId =
            button.dataset.productId;


        if (!productId) {
            return;
        }


        const quantity =
            getCartQuantity(productId);


        if (quantity <= 0) {
            return;
        }


        const product =
            getProductById(productId);


        if (!product) {
            return;
        }


        const control =
            createProductCartControl(
                product,
                quantity
            );


        button.replaceWith(control);

    });


    const controls =
        document.querySelectorAll(
            ".product-cart-control"
        );


    controls.forEach((control) => {

        const productId =
            control.dataset.productId;


        const quantity =
            getCartQuantity(productId);


        if (quantity <= 0) {

            const product =
                getProductById(productId);


            if (!product) {
                return;
            }


            const button =
                createProductAddButton(
                    product
                );


            control.replaceWith(button);

            return;

        }


        const quantityElement =
            control.querySelector(
                ".product-cart-quantity"
            );


        if (quantityElement) {

            quantityElement.textContent =
                quantity;

        }

    });


    initAddToCartButtons();

    initProductCartControls();

}


/* ========================================
   GET PRODUCT
======================================== */

function getProductById(productId) {

    if (
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {
        return null;
    }


    return products.find(
        (product) =>
            String(product.id) ===
            String(productId)
    ) || null;

}


/* ========================================
   CREATE PRODUCT CART CONTROL
======================================== */

function createProductCartControl(
    product,
    quantity
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "product-cart-control";


    wrapper.dataset.productId =
        String(product.id);


    wrapper.innerHTML = `

        <div class="product-cart-quantity-row">

            <button
                type="button"
                class="product-cart-decrease"
                data-product-id="${escapeCartHTML(
                    String(product.id)
                )}"
                aria-label="Decrease ${escapeCartHTML(
                    product.name
                )} quantity"
            >
                −
            </button>


            <span
                class="product-cart-quantity"
                aria-label="Quantity"
            >
                ${quantity}
            </span>


            <button
                type="button"
                class="product-cart-increase"
                data-product-id="${escapeCartHTML(
                    String(product.id)
                )}"
                aria-label="Increase ${escapeCartHTML(
                    product.name
                )} quantity"
            >
                +
            </button>

        </div>


        <button
            type="button"
            class="product-cart-remove"
            data-product-id="${escapeCartHTML(
                String(product.id)
            )}"
            aria-label="Remove ${escapeCartHTML(
                product.name
            )} from cart"
            title="Remove from cart"
        >
            ×
        </button>

    `;


    return wrapper;

}


/* ========================================
   CREATE PRODUCT ADD BUTTON
======================================== */

function createProductAddButton(product) {

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.className =
        "btn btn-primary product-add-button";


    button.dataset.productId =
        String(product.id);


    button.textContent =
        "Add to cart";


    return button;

}


/* ========================================
   INITIALIZE PRODUCT CARD CONTROLS
======================================== */

function initProductCartControls() {

    const controls =
        document.querySelectorAll(
            ".product-cart-control"
        );


    controls.forEach((control) => {

        if (
            control.dataset.initialized ===
            "true"
        ) {
            return;
        }


        control.dataset.initialized =
            "true";


        const productId =
            control.dataset.productId;


        const decrease =
            control.querySelector(
                ".product-cart-decrease"
            );


        const increase =
            control.querySelector(
                ".product-cart-increase"
            );


        const remove =
            control.querySelector(
                ".product-cart-remove"
            );


        decrease?.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();


                const quantity =
                    getCartQuantity(productId);


                updateCartItem(
                    productId,
                    quantity - 1
                );

            }
        );


        increase?.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();


                const quantity =
                    getCartQuantity(productId);


                updateCartItem(
                    productId,
                    quantity + 1
                );

            }
        );


        remove?.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();


                removeFromCart(productId);

            }
        );

    });

}


/* ========================================
   ADD TO CART BUTTONS
======================================== */

function initAddToCartButtons() {

    const buttons =
        document.querySelectorAll(
            ".product-add-button"
        );


    buttons.forEach((button) => {

        initSingleAddToCartButton(button);

    });

}


function initSingleAddToCartButton(button) {

    if (
        button.dataset.cartInitialized ===
        "true"
    ) {
        return;
    }


    button.dataset.cartInitialized =
        "true";


    button.addEventListener(
        "click",
        (event) => {

            event.preventDefault();
            event.stopPropagation();


            const productId =
                button.dataset.productId;


            if (!productId) {
                return;
            }


            addToCart(
                productId,
                1
            );

        }
    );

}


/* ========================================
   CART PAGE
======================================== */

function renderCartPage() {

    const container =
        document.querySelector(
            "#cart-items"
        );


    if (!container) {
        return;
    }


    const cartProducts =
        getCartProducts();


    const emptyState =
        document.querySelector(
            "#cart-empty"
        );


    const cartContent =
        document.querySelector(
            "#cart-content"
        );


    if (!cartProducts.length) {

        container.innerHTML = "";


        if (emptyState) {
            emptyState.hidden = false;
        }


        if (cartContent) {
            cartContent.hidden = true;
        }


        updateCartSummary();

        return;

    }


    if (emptyState) {
        emptyState.hidden = true;
    }


    if (cartContent) {
        cartContent.hidden = false;
    }


    container.innerHTML =
        cartProducts
            .map((product) =>
                createCartItem(product)
            )
            .join("");


    initCartItemControls();

    updateCartSummary();

}


/* ========================================
   CART ITEM
======================================== */

function createCartItem(product) {

    const price =
        Number(product.price) || 0;


    const quantity =
        Number(product.quantity) || 1;


    const itemTotal =
        price * quantity;


    const productUrl =
        getProductUrl(product.id);


    const categoryName =
        getCartCategoryName(
            product.category
        );


    return `
        <article
            class="cart-item"
            data-product-id="${escapeCartHTML(
                String(product.id)
            )}"
        >

            <a
                href="${escapeCartHTML(productUrl)}"
                class="cart-item-image"
            >

                <img
                    src="${escapeCartHTML(
                        getAssetUrl(product.image)
                    )}"
                    alt="${escapeCartHTML(
                        product.name
                    )}"
                    loading="lazy"
                >

            </a>


            <div class="cart-item-details">

                <span class="product-category">
                    ${escapeCartHTML(categoryName)}
                </span>


                <h2>

                    <a
                        href="${escapeCartHTML(
                            productUrl
                        )}"
                    >
                        ${escapeCartHTML(
                            product.name
                        )}
                    </a>

                </h2>


                <span class="cart-item-unit">

                    $${price.toFixed(2)}

                    ${
                        product.unit
                            ? `
                                / ${escapeCartHTML(
                                    product.unit
                                )}
                              `
                            : ""
                    }

                </span>

            </div>


            <div class="cart-item-actions">

                <div class="cart-item-quantity">

                    <label
                        for="cart-quantity-${escapeCartHTML(
                            String(product.id)
                        )}"
                        class="sr-only"
                    >
                        Quantity for ${escapeCartHTML(
                            product.name
                        )}
                    </label>


                    <div class="quantity-control">

                        <button
                            type="button"
                            class="cart-quantity-decrease"
                            data-product-id="${escapeCartHTML(
                                String(product.id)
                            )}"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <input
                            type="number"
                            id="cart-quantity-${escapeCartHTML(
                                String(product.id)
                            )}"
                            class="cart-quantity-input"
                            value="${quantity}"
                            min="1"
                            max="99"
                            inputmode="numeric"
                            data-product-id="${escapeCartHTML(
                                String(product.id)
                            )}"
                            aria-label="Quantity"
                        >


                        <button
                            type="button"
                            class="cart-quantity-increase"
                            data-product-id="${escapeCartHTML(
                                String(product.id)
                            )}"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="cart-item-remove"
                    data-product-id="${escapeCartHTML(
                        String(product.id)
                    )}"
                    aria-label="Remove ${escapeCartHTML(
                        product.name
                    )} from cart"
                    title="Remove from cart"
                >
                    ×
                </button>

            </div>


            <div class="cart-item-total">

                <strong>
                    $${itemTotal.toFixed(2)}
                </strong>

            </div>

        </article>
    `;

}


/* ========================================
   CART ITEM CONTROLS
======================================== */

function initCartItemControls() {

    const decreaseButtons =
        document.querySelectorAll(
            ".cart-quantity-decrease"
        );


    const increaseButtons =
        document.querySelectorAll(
            ".cart-quantity-increase"
        );


    const quantityInputs =
        document.querySelectorAll(
            ".cart-quantity-input"
        );


    const removeButtons =
        document.querySelectorAll(
            ".cart-item-remove"
        );


    decreaseButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    button.dataset.productId;


                const item =
                    cart.find(
                        (cartItem) =>
                            String(cartItem.id) ===
                            String(productId)
                    );


                if (!item) {
                    return;
                }


                updateCartItem(
                    productId,
                    item.quantity - 1
                );

            }
        );

    });


    increaseButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    button.dataset.productId;


                const item =
                    cart.find(
                        (cartItem) =>
                            String(cartItem.id) ===
                            String(productId)
                    );


                if (!item) {
                    return;
                }


                updateCartItem(
                    productId,
                    item.quantity + 1
                );

            }
        );

    });


    quantityInputs.forEach((input) => {

        input.addEventListener(
            "change",
            () => {

                let value =
                    parseInt(
                        input.value,
                        10
                    );


                if (
                    !Number.isFinite(value)
                ) {
                    value = 1;
                }


                value =
                    Math.min(
                        99,
                        Math.max(
                            1,
                            value
                        )
                    );


                updateCartItem(
                    input.dataset.productId,
                    value
                );

            }
        );

    });


    removeButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                removeFromCart(
                    button.dataset.productId
                );

            }
        );

    });

}


/* ========================================
   CART SUMMARY
======================================== */

function updateCartSummary() {

    const subtotalElement =
        document.querySelector(
            "[data-cart-subtotal]"
        );


    const totalElement =
        document.querySelector(
            "[data-cart-total]"
        );


    const cartProducts =
        getCartProducts();


    const subtotal =
        cartProducts.reduce(
            (total, product) => {

                const price =
                    Number(product.price) || 0;

                const quantity =
                    Number(product.quantity) || 0;

                return total +
                    price * quantity;

            },
            0
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            `$${subtotal.toFixed(2)}`;

    }


    if (totalElement) {

        totalElement.textContent =
            `$${subtotal.toFixed(2)}`;

    }

}


/* ========================================
   CART FEEDBACK
======================================== */

function showCartFeedback(message) {

    let feedback =
        document.querySelector(
            ".cart-feedback"
        );


    if (!feedback) {

        feedback =
            document.createElement(
                "div"
            );


        feedback.className =
            "cart-feedback";


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
        window.setTimeout(
            () => {

                feedback.classList.remove(
                    "is-visible"
                );

            },
            2500
        );

}


/* ========================================
   PRODUCT URL
======================================== */

function getProductUrl(productId) {

    const currentPath =
        window.location.pathname
            .replace(/\\/g, "/");


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

function getAssetUrl(assetPath) {

    if (!assetPath) {
        return "";
    }


    const normalizedPath =
        String(assetPath)
            .replace(/^(\.\.\/)+/, "");


    const currentPath =
        window.location.pathname
            .replace(/\\/g, "/");


    const isInsidePagesDirectory =
        currentPath.includes("/pages/");


    return isInsidePagesDirectory
        ? `../${normalizedPath}`
        : normalizedPath;

}


/* ========================================
   CART CATEGORY NAME
======================================== */

function getCartCategoryName(categoryId) {

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
   HTML ESCAPING
======================================== */

function escapeCartHTML(value) {

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
