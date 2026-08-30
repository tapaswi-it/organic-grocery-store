/* ========================================
   ORGANIC GROCERY STORE
   FORM HANDLING
======================================== */


/* ========================================
   DOM READY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initForms();

});


/* ========================================
   INITIALIZE FORMS
======================================== */

function initForms() {

    initLoginForm();

    initRegisterForm();

    initCheckoutForm();

    initContactForm();

    initNewsletterForms();

    initPasswordToggles();

}


/* ========================================
   LOGIN FORM
======================================== */

function initLoginForm() {

    const form =
        document.querySelector("#login-form");


    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        clearFormMessage(form);


        const email =
            form.querySelector(
                'input[name="email"]'
            );


        const password =
            form.querySelector(
                'input[name="password"]'
            );


        if (!email || !password) {
            return;
        }


        const emailValue =
            email.value.trim();


        const passwordValue =
            password.value;


        if (!emailValue) {

            showFormMessage(
                form,
                "Please enter your email address.",
                "error"
            );

            email.focus();

            return;

        }


        if (!isValidEmail(emailValue)) {

            showFormMessage(
                form,
                "Please enter a valid email address.",
                "error"
            );

            email.focus();

            return;

        }


        if (!passwordValue) {

            showFormMessage(
                form,
                "Please enter your password.",
                "error"
            );

            password.focus();

            return;

        }


        /*
         * Frontend-only placeholder.
         *
         * Authentication will be connected to a
         * backend or authentication service later.
         */

        showFormMessage(
            form,
            "Login is ready, but authentication is not connected yet.",
            "success"
        );

    });

}


/* ========================================
   REGISTER FORM
======================================== */

function initRegisterForm() {

    const form =
        document.querySelector("#register-form");


    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        clearFormMessage(form);


        const name =
            form.querySelector(
                'input[name="name"]'
            );


        const email =
            form.querySelector(
                'input[name="email"]'
            );


        const password =
            form.querySelector(
                'input[name="password"]'
            );


        const confirmPassword =
            form.querySelector(
                'input[name="confirm-password"]'
            );


        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            return;

        }


        const nameValue =
            name.value.trim();


        const emailValue =
            email.value.trim();


        const passwordValue =
            password.value;


        const confirmPasswordValue =
            confirmPassword.value;


        if (!nameValue) {

            showFormMessage(
                form,
                "Please enter your name.",
                "error"
            );

            name.focus();

            return;

        }


        if (!isValidEmail(emailValue)) {

            showFormMessage(
                form,
                "Please enter a valid email address.",
                "error"
            );

            email.focus();

            return;

        }


        if (passwordValue.length < 8) {

            showFormMessage(
                form,
                "Password must be at least 8 characters long.",
                "error"
            );

            password.focus();

            return;

        }


        if (
            passwordValue !==
            confirmPasswordValue
        ) {

            showFormMessage(
                form,
                "Passwords do not match.",
                "error"
            );

            confirmPassword.focus();

            return;

        }


        /*
         * Frontend-only placeholder.
         *
         * Do not store passwords in localStorage.
         */

        showFormMessage(
            form,
            "Your registration form is valid. Account creation is not connected yet.",
            "success"
        );

    });

}


/* ========================================
   CHECKOUT FORM
======================================== */

function initCheckoutForm() {

    const form =
        document.querySelector("#checkout-form");


    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        clearFormMessage(form);


        if (!validateRequiredFields(form)) {

            showFormMessage(
                form,
                "Please complete all required fields.",
                "error"
            );

            return;

        }


        const email =
            form.querySelector(
                'input[type="email"]'
            );


        if (
            email &&
            !isValidEmail(
                email.value.trim()
            )
        ) {

            showFormMessage(
                form,
                "Please enter a valid email address.",
                "error"
            );

            email.focus();

            return;

        }


        /*
         * Frontend-only checkout placeholder.
         *
         * No payment processor or order API is
         * connected at this stage.
         */

        showFormMessage(
            form,
            "Your checkout details are valid. Payment processing is not connected yet.",
            "success"
        );

    });

}


/* ========================================
   CONTACT FORM
======================================== */

function initContactForm() {

    const form =
        document.querySelector("#contact-form");


    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        clearFormMessage(form);


        if (!validateRequiredFields(form)) {

            showFormMessage(
                form,
                "Please complete all required fields.",
                "error"
            );

            return;

        }


        const email =
            form.querySelector(
                'input[type="email"]'
            );


        if (
            email &&
            !isValidEmail(
                email.value.trim()
            )
        ) {

            showFormMessage(
                form,
                "Please enter a valid email address.",
                "error"
            );

            email.focus();

            return;

        }


        /*
         * Frontend-only contact form.
         *
         * No email delivery service is connected yet.
         */

        showFormMessage(
            form,
            "Thanks for reaching out! Your message is ready to be sent once the contact service is connected.",
            "success"
        );


        form.reset();

    });

}


/* ========================================
   NEWSLETTER FORMS
======================================== */

function initNewsletterForms() {

    const forms =
        document.querySelectorAll(
            ".newsletter-form"
        );


    forms.forEach((form) => {

        /*
         * main.js already handles #newsletter-form.
         * Avoid attaching a second handler to it.
         */

        if (
            form.id === "newsletter-form"
        ) {

            return;

        }


        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                clearFormMessage(form);


                const email =
                    form.querySelector(
                        'input[type="email"]'
                    );


                if (!email) {
                    return;
                }


                const emailValue =
                    email.value.trim();


                if (
                    !isValidEmail(
                        emailValue
                    )
                ) {

                    showFormMessage(
                        form,
                        "Please enter a valid email address.",
                        "error"
                    );

                    email.focus();

                    return;

                }


                showFormMessage(
                    form,
                    "Thanks for subscribing!",
                    "success"
                );


                form.reset();

            }
        );

    });

}


/* ========================================
   PASSWORD TOGGLES
======================================== */

function initPasswordToggles() {

    const toggles =
        document.querySelectorAll(
            "[data-password-toggle]"
        );


    toggles.forEach((toggle) => {

        if (
            toggle.dataset.passwordInitialized ===
            "true"
        ) {

            return;

        }


        toggle.dataset.passwordInitialized =
            "true";


        toggle.addEventListener(
            "click",
            () => {

                const targetId =
                    toggle.dataset.passwordToggle;


                if (!targetId) {
                    return;
                }


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                const isPassword =
                    input.type === "password";


                input.type =
                    isPassword
                        ? "text"
                        : "password";


                toggle.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );


                toggle.setAttribute(
                    "aria-pressed",
                    String(isPassword)
                );

            }
        );

    });

}


/* ========================================
   REQUIRED FIELD VALIDATION
======================================== */

function validateRequiredFields(form) {

    const requiredFields =
        form.querySelectorAll(
            "[required]"
        );


    let isValid = true;


    requiredFields.forEach((field) => {

        const value =
            field.value.trim();


        if (!value) {

            field.setAttribute(
                "aria-invalid",
                "true"
            );


            if (isValid) {
                field.focus();
            }


            isValid = false;

        } else {

            field.removeAttribute(
                "aria-invalid"
            );

        }

    });


    return isValid;

}


/* ========================================
   EMAIL VALIDATION
======================================== */

function isValidEmail(email) {

    /*
     * Practical frontend validation.
     * The browser's native email validation still
     * provides the primary validation layer.
     */

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


/* ========================================
   FORM MESSAGE
======================================== */

function showFormMessage(
    form,
    message,
    type = "success"
) {

    clearFormMessage(form);


    const messageElement =
        document.createElement("p");


    messageElement.className =
        `form-message form-message-${type}`;


    messageElement.textContent =
        message;


    messageElement.setAttribute(
        "role",
        type === "error"
            ? "alert"
            : "status"
    );


    messageElement.setAttribute(
        "aria-live",
        type === "error"
            ? "assertive"
            : "polite"
    );


    form.appendChild(
        messageElement
    );

}


/* ========================================
   CLEAR FORM MESSAGE
======================================== */

function clearFormMessage(form) {

    const existingMessages =
        form.querySelectorAll(
            ".form-message"
        );


    existingMessages.forEach(
        (message) => {
            message.remove();
        }
    );

}


/* ========================================
   SHARED FORM RESET
======================================== */

function resetFormState(form) {

    if (!form) {
        return;
    }


    form.reset();


    const invalidFields =
        form.querySelectorAll(
            "[aria-invalid='true']"
        );


    invalidFields.forEach(
        (field) => {

            field.removeAttribute(
                "aria-invalid"
            );

        }
    );


    clearFormMessage(form);

}
