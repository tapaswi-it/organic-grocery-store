/* ========================================
   ORGANIC GROCERY STORE
   PRODUCT FILTERING
======================================== */


/* ========================================
   FILTER STATE
======================================== */

const shopFilterState = {

    category: "",

    minPrice: "",

    maxPrice: "",

    inStockOnly: false,

    sort: "default"

};


/* ========================================
   DOM READY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initShopFilters();

});


/* ========================================
   INITIALIZE FILTERS
======================================== */

function initShopFilters() {

    const categoryContainer =
        document.querySelector("#category-filters");

    const minPriceInput =
        document.querySelector("#min-price");

    const maxPriceInput =
        document.querySelector("#max-price");

    const stockCheckbox =
        document.querySelector("#in-stock");

    const sortSelect =
        document.querySelector("#sort-products");

    const clearButton =
        document.querySelector("#clear-filters");

    const resetButton =
        document.querySelector("#empty-state-reset");


    /* ----------------------------------------
       Category filters
    ---------------------------------------- */

    if (
        categoryContainer &&
        typeof categories !== "undefined"
    ) {

        renderCategoryFilters(
            categoryContainer
        );

    }


    /* ----------------------------------------
       Price filters
    ---------------------------------------- */

    minPriceInput?.addEventListener(
        "input",
        () => {

            shopFilterState.minPrice =
                minPriceInput.value;

            applyShopFilters();

        }
    );


    maxPriceInput?.addEventListener(
        "input",
        () => {

            shopFilterState.maxPrice =
                maxPriceInput.value;

            applyShopFilters();

        }
    );


    /* ----------------------------------------
       Availability filter
    ---------------------------------------- */

    stockCheckbox?.addEventListener(
        "change",
        () => {

            shopFilterState.inStockOnly =
                stockCheckbox.checked;

            applyShopFilters();

        }
    );


    /* ----------------------------------------
       Sorting
    ---------------------------------------- */

    sortSelect?.addEventListener(
        "change",
        () => {

            shopFilterState.sort =
                sortSelect.value;

            applyShopFilters();

        }
    );


    /* ----------------------------------------
       Clear filters
    ---------------------------------------- */

    clearButton?.addEventListener(
        "click",
        clearShopFilters
    );


    resetButton?.addEventListener(
        "click",
        clearShopFilters
    );


    /* ----------------------------------------
       Initial render
    ---------------------------------------- */

    applyShopFilters();

}


/* ========================================
   CATEGORY FILTERS
======================================== */

function renderCategoryFilters(container) {

    container.innerHTML = categories
        .map((category) => {

            return `
                <label class="filter-checkbox">

                    <input
                        type="radio"
                        name="product-category"
                        value="${escapeHTML(
                            String(category.id)
                        )}"
                    >

                    <span>
                        ${escapeHTML(category.name)}
                    </span>

                </label>
            `;

        })
        .join("");


    const categoryInputs =
        container.querySelectorAll(
            'input[name="product-category"]'
        );


    categoryInputs.forEach((input) => {

        input.addEventListener(
            "change",
            () => {

                shopFilterState.category =
                    input.value;

                applyShopFilters();

            }
        );

    });

}


/* ========================================
   APPLY SHOP FILTERS
======================================== */

function applyShopFilters() {

    const container =
        document.querySelector(
            "#shop-product-grid"
        );


    if (
        !container ||
        typeof products === "undefined"
    ) {
        return;
    }


    let filteredProducts =
        [...products];


    /* ----------------------------------------
       Search
    ---------------------------------------- */

    if (
        typeof searchProducts ===
        "function"
    ) {

        filteredProducts =
            searchProducts(
                filteredProducts
            );

    }


    /* ----------------------------------------
       Category
    ---------------------------------------- */

    if (shopFilterState.category) {

        filteredProducts =
            filteredProducts.filter(
                (product) =>
                    String(product.category) ===
                    String(
                        shopFilterState.category
                    )
            );

    }


    /* ----------------------------------------
       Minimum price
    ---------------------------------------- */

    const minPrice =
        Number(shopFilterState.minPrice);


    if (
        shopFilterState.minPrice !== "" &&
        Number.isFinite(minPrice)
    ) {

        filteredProducts =
            filteredProducts.filter(
                (product) =>
                    Number(product.price) >=
                    minPrice
            );

    }


    /* ----------------------------------------
       Maximum price
    ---------------------------------------- */

    const maxPrice =
        Number(shopFilterState.maxPrice);


    if (
        shopFilterState.maxPrice !== "" &&
        Number.isFinite(maxPrice)
    ) {

        filteredProducts =
            filteredProducts.filter(
                (product) =>
                    Number(product.price) <=
                    maxPrice
            );

    }


    /* ----------------------------------------
       Availability
    ---------------------------------------- */

    if (shopFilterState.inStockOnly) {

        filteredProducts =
            filteredProducts.filter(
                (product) =>
                    product.inStock !== false
            );

    }


    /* ----------------------------------------
       Sorting
    ---------------------------------------- */

    filteredProducts =
        sortProducts(
            filteredProducts,
            shopFilterState.sort
        );


    /* ----------------------------------------
       Render results
    ---------------------------------------- */

    renderShopProducts(
        filteredProducts,
        container
    );


    updateShopResults(
        filteredProducts.length
    );

}


/* ========================================
   SORT PRODUCTS
======================================== */

function sortProducts(
    productList,
    sortOption
) {

    const sortedProducts =
        [...productList];


    switch (sortOption) {

        case "featured":

            return sortedProducts.sort(
                (a, b) =>
                    Number(Boolean(b.featured)) -
                    Number(Boolean(a.featured))
            );


        case "price-low":

            return sortedProducts.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );


        case "price-high":

            return sortedProducts.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );


        case "name":

            return sortedProducts.sort(
                (a, b) =>
                    String(a.name).localeCompare(
                        String(b.name)
                    )
            );


        default:

            return sortedProducts;

    }

}


/* ========================================
   RENDER SHOP PRODUCTS
======================================== */

function renderShopProducts(
    productList,
    container
) {

    if (!productList.length) {

        container.innerHTML = "";

        showShopEmptyState();

        return;

    }


    hideShopEmptyState();


    if (
        typeof renderProductCards ===
        "function"
    ) {

        renderProductCards(
            productList,
            container
        );

    }

}


/* ========================================
   RESULTS INFORMATION
======================================== */

function updateShopResults(count) {

    const countElement =
        document.querySelector(
            "#product-count"
        );


    if (!countElement) {
        return;
    }


    if (count === 0) {

        countElement.textContent =
            "No products found.";

        return;

    }


    countElement.textContent =
        `Showing ${count} ${
            count === 1
                ? "product"
                : "products"
        }`;

}


/* ========================================
   EMPTY STATE
======================================== */

function showShopEmptyState() {

    const emptyState =
        document.querySelector(
            "#shop-empty-state"
        );


    if (emptyState) {
        emptyState.hidden = false;
    }

}


function hideShopEmptyState() {

    const emptyState =
        document.querySelector(
            "#shop-empty-state"
        );


    if (emptyState) {
        emptyState.hidden = true;
    }

}


/* ========================================
   CLEAR FILTERS
======================================== */

function clearShopFilters() {

    shopFilterState.category = "";

    shopFilterState.minPrice = "";

    shopFilterState.maxPrice = "";

    shopFilterState.inStockOnly = false;

    shopFilterState.sort = "default";


    /* ----------------------------------------
       Reset category controls
    ---------------------------------------- */

    const categoryInputs =
        document.querySelectorAll(
            'input[name="product-category"]'
        );


    categoryInputs.forEach((input) => {

        input.checked = false;

    });


    /* ----------------------------------------
       Reset price controls
    ---------------------------------------- */

    const minPriceInput =
        document.querySelector("#min-price");

    const maxPriceInput =
        document.querySelector("#max-price");

    const stockCheckbox =
        document.querySelector("#in-stock");

    const sortSelect =
        document.querySelector("#sort-products");


    if (minPriceInput) {
        minPriceInput.value = "";
    }


    if (maxPriceInput) {
        maxPriceInput.value = "";
    }


    if (stockCheckbox) {
        stockCheckbox.checked = false;
    }


    if (sortSelect) {
        sortSelect.value = "default";
    }


    /* ----------------------------------------
       Reset search
    ---------------------------------------- */

    if (
        typeof clearProductSearch ===
        "function"
    ) {

        clearProductSearch();

        return;

    }


    applyShopFilters();

}


/* ========================================
   HTML ESCAPING
======================================== */

function escapeHTML(value) {

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
        .replace(
            /'/g,
            "&#039;"
        );

}
