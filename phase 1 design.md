# Organic Grocery Store — Phase 1 Development Plan

I'd build it **from the foundation outward**, rather than starting with the pages individually.

---

## Phase 1A — Design Foundation

Handle these first:

```text
css/
├── variables.css
├── style.css
└── responsive.css
```

**Why first?** We already have our visual direction:

* Manrope + DM Serif Display
* Forest green `#244B36`
* Sage `#8FAF8F`
* Cream `#F8F6EF`
* Terracotta `#C97852`
* Charcoal `#202522`
* Olive gray `#687269`

`variables.css` establishes the design system.
`style.css` establishes the global styling.
`responsive.css` establishes the responsive behavior.

---

## Phase 1B — Global HTML Shell

Then:

```text
index.html
```

We'll build the initial:

```text
<html>
 ├── <head>
 │    ├── metadata
 │    ├── fonts
 │    └── CSS
 │
 └── <body>
      ├── Navbar
      ├── Main content
      └── Footer
```

This becomes our reference structure for all the other pages.

---

## Phase 1C — Global JavaScript

Then:

```text
js/
└── main.js
```

This handles things that exist across the website, such as:

* Mobile navigation
* Header interactions
* Global UI behavior
* Shared utilities

We **don't** need `products.js`, `cart.js`, etc. yet.

---

## Phase 1D — Homepage

Once the foundation is working, we build the homepage in `index.html`.

I'd do it section-by-section:

```text
Navbar
   ↓
Hero
   ↓
Shop by Category
   ↓
Featured Products
   ↓
Organic / Brand USP
   ↓
Promotional Banner
   ↓
Best Sellers
   ↓
Testimonials
   ↓
Newsletter
   ↓
Footer
```

At this point we'll probably create/use:

```text
data/
├── categories.js
├── products.js
└── testimonials.js
```

and:

```text
js/
└── products.js
```

---

## Phase 1E — Shop Experience

Then:

```text
pages/shop.html
```

and:

```text
js/
├── search.js
└── filters.js
```

This gives us:

* Product grid
* Search
* Categories
* Sorting
* Filters
* Product cards
* Add-to-cart buttons

---

## Phase 1F — Product → Cart

Then:

```text
pages/
├── product.html
└── cart.html
```

with:

```text
js/
├── products.js
└── cart.js
```

This is where the site starts behaving like an actual e-commerce application.

---

## Phase 1G — Checkout + Account

After that:

```text
pages/
├── checkout.html
├── login.html
├── register.html
├── account.html
├── orders.html
└── wishlist.html
```

and:

```text
js/
├── wishlist.js
└── forms.js
```

For now, these are **frontend-only experiences**. No real authentication or payment processing.

---

## Phase 1H — Secondary Pages

Finally:

```text
pages/
├── about.html
├── contact.html
└── 404.html
```

Then we'll finish:

```text
assets/
fonts/
favicon.ico
README.md
```

---

# Actual Working Order

```text
1.  variables.css
2.  style.css
3.  responsive.css
4.  index.html
5.  main.js
6.  data/categories.js
7.  data/products.js
8.  data/testimonials.js
9.  js/products.js
10. Homepage refinement
11. shop.html
12. search.js
13. filters.js
14. product.html
15. cart.html
16. cart.js
17. checkout.html
18. login.html / register.html
19. account.html / orders.html
20. wishlist.html
21. about.html / contact.html / 404.html
22. Final responsive + polish
23. Assets, favicon, README
```

**Current status:**

```text
Phase 1A — Design Foundation    ✅
Phase 1B — Global HTML Shell    → NEXT
Phase 1C — Global JavaScript
Phase 1D — Homepage
Phase 1E — Shop
Phase 1F — Product + Cart
Phase 1G — Checkout + Account
Phase 1H — Secondary Pages
```

**Next file:** `index.html`
