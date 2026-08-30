/* ========================================
   ORGANIC GROCERY STORE
   GLOBAL JAVASCRIPT
======================================== */


/* ========================================
   DOM READY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initMobileNavigation();
    initHeaderScroll();
    initSmoothScrolling();
    initNewsletterForm();

});


/* ========================================
   MOBILE NAVIGATION
======================================== */

function initMobileNavigation() {

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!navbar || !menuToggle || !navLinks) {
        return;
    }


    /* ----------------------------------------
       Toggle menu
    ---------------------------------------- */

    menuToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen =
            navbar.classList.toggle("nav-open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    /* ----------------------------------------
       Close menu when a navigation link
       is selected
    ---------------------------------------- */

    const links =
        navLinks.querySelectorAll("a");

    links.forEach((link) => {

        link.addEventListener("click", () => {

            closeMobileNavigation();

        });

    });


    /* ----------------------------------------
       Close menu with Escape
    ---------------------------------------- */

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") {
            return;
        }

        closeMobileNavigation();

    });


    /* ----------------------------------------
       Close menu when clicking outside
    ---------------------------------------- */

    document.addEventListener("click", (event) => {

        if (!navbar.classList.contains("nav-open")) {
            return;
        }

        if (navbar.contains(event.target)) {
            return;
        }

        closeMobileNavigation();

    });


    /* ----------------------------------------
       Close menu when returning to desktop
    ---------------------------------------- */

    const handleViewportChange = () => {

        if (window.innerWidth > 768) {
            closeMobileNavigation();
        }

    };


    window.addEventListener(
        "resize",
        handleViewportChange,
        { passive: true }
    );


    function closeMobileNavigation() {

        navbar.classList.remove("nav-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }

}


/* ========================================
   HEADER SCROLL BEHAVIOR
======================================== */

function initHeaderScroll() {

    const header =
        document.querySelector(".site-header");

    if (!header) {
        return;
    }


    const updateHeaderState = () => {

        const isScrolled =
            window.scrollY > 20;

        header.classList.toggle(
            "is-scrolled",
            isScrolled
        );

    };


    updateHeaderState();


    window.addEventListener(
        "scroll",
        updateHeaderState,
        { passive: true }
    );

}


/* ========================================
   SMOOTH INTERNAL NAVIGATION
======================================== */

function initSmoothScrolling() {

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            let target = null;

            try {

                target =
                    document.querySelector(targetId);

            } catch (error) {

                return;

            }


            if (!target) {
                return;
            }


            event.preventDefault();


            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const targetPosition =
                target.getBoundingClientRect().top
                + window.scrollY
                - headerHeight;


            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "smooth"
            });

        });

    });

}


/* ========================================
   NEWSLETTER FORM
======================================== */

function initNewsletterForm() {

    const form =
        document.querySelector("#newsletter-form");

    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const emailInput =
            form.querySelector(
                'input[type="email"]'
            );

        if (!emailInput) {
            return;
        }


        const email =
            emailInput.value.trim();


        if (!email) {
            return;
        }


        /*
         * Frontend-only placeholder.
         *
         * No API or mailing service is connected yet.
         * This can be replaced when a mailing service
         * is introduced.
         */

        console.log(
            "Newsletter signup:",
            email
        );


        emailInput.value = "";


        showTemporaryMessage(
            form,
            "Thanks for subscribing!"
        );

    });

}


/* ========================================
   TEMPORARY UI MESSAGE
======================================== */

function showTemporaryMessage(
    parent,
    message
) {

    if (!parent) {
        return;
    }


    const existingMessage =
        parent.querySelector(".form-message");

    if (existingMessage) {
        existingMessage.remove();
    }


    const messageElement =
        document.createElement("p");

    messageElement.className =
        "form-message";

    messageElement.setAttribute(
        "role",
        "status"
    );

    messageElement.textContent =
        message;


    parent.appendChild(messageElement);


    window.setTimeout(() => {

        if (messageElement.isConnected) {
            messageElement.remove();
        }

    }, 4000);

}


/* ========================================
   SHARED DOM UTILITIES
======================================== */


/**
 * Select a single DOM element.
 *
 * @param {string} selector
 * @param {Element|Document} parent
 * @returns {Element|null}
 */

function select(
    selector,
    parent = document
) {

    return parent.querySelector(selector);

}


/**
 * Select multiple DOM elements.
 *
 * @param {string} selector
 * @param {Element|Document} parent
 * @returns {NodeListOf<Element>}
 */

function selectAll(
    selector,
    parent = document
) {

    return parent.querySelectorAll(selector);

}


/**
 * Add a class to an element.
 *
 * @param {Element|null} element
 * @param {string} className
 */

function addClass(
    element,
    className
) {

    if (!element) {
        return;
    }

    element.classList.add(className);

}


/**
 * Remove a class from an element.
 *
 * @param {Element|null} element
 * @param {string} className
 */

function removeClass(
    element,
    className
) {

    if (!element) {
        return;
    }

    element.classList.remove(className);

}


/**
 * Toggle a class on an element.
 *
 * @param {Element|null} element
 * @param {string} className
 * @returns {boolean}
 */

function toggleClass(
    element,
    className
) {

    if (!element) {
        return false;
    }

    return element.classList.toggle(
        className
    );

}
