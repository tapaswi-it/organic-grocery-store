/* ========================================
   ORGANIC GROCERY STORE
   PRODUCT SEARCH
======================================== */


/* ========================================
   SEARCH STATE
======================================== */

const productSearchState = {
    term: ""
};


/* ========================================
   DOM READY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initProductSearch();

});


/* ========================================
   INITIALIZE SEARCH
======================================== */

function initProductSearch() {

    const searchInput =
        document.querySelector("#product-search");


    if (!searchInput) {
        return;
    }


    /* ----------------------------------------
       Restore initial search state
    ---------------------------------------- */

    productSearchState.term =
        searchInput.value
            .trim()
            .toLowerCase();


    /* ----------------------------------------
       Search input
    ---------------------------------------- */

    searchInput.addEventListener(
        "input",
        () => {

            productSearchState.term =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (
                typeof applyShopFilters ===
                "function"
            ) {

                applyShopFilters();

            }

        }
    );

}


/* ========================================
   SEARCH PRODUCTS
======================================== */

/**
 * Filter products using the current
 * search term.
 *
 * @param {Array} productList
 * @returns {Array}
 */

function searchProducts(productList) {

    if (
        !Array.isArray(productList)
    ) {
        return [];
    }


    const searchTerm =
        productSearchState.term;


    if (!searchTerm) {
        return productList;
    }


    return productList.filter((product) => {

        if (!product) {
            return false;
        }


        const name =
            String(product.name || "")
                .toLowerCase();


        const category =
            String(product.category || "")
                .toLowerCase();


        const badge =
            String(product.badge || "")
                .toLowerCase();


        const description =
            String(product.description || "")
                .toLowerCase();


        return (
            name.includes(searchTerm) ||
            category.includes(searchTerm) ||
            badge.includes(searchTerm) ||
            description.includes(searchTerm)
        );

    });

}


/* ========================================
   GET CURRENT SEARCH TERM
======================================== */

/**
 * Return the current search term.
 *
 * @returns {string}
 */

function getCurrentSearchTerm() {

    return productSearchState.term;

}


/* ========================================
   CLEAR SEARCH
======================================== */

function clearProductSearch() {

    const searchInput =
        document.querySelector("#product-search");


    productSearchState.term = "";


    if (searchInput) {

        searchInput.value = "";

    }


    if (
        typeof applyShopFilters ===
        "function"
    ) {

        applyShopFilters();

    }

}
