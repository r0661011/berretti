/* Berretti Garden & Works — main.js (vanilla, no dependencies) */
(function () {
    "use strict";

    /* ---------- Sticky header ---------- */
    var header = document.querySelector(".site-header");
    if (header && !header.classList.contains("always-solid")) {
        var onScroll = function () {
            header.classList.toggle("solid", window.scrollY > 40);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Mobile nav ---------- */
    var toggle = document.querySelector(".nav-toggle");
    if (toggle) {
        toggle.addEventListener("click", function () {
            document.body.classList.toggle("nav-open");
        });
        document.querySelectorAll(".nav-links a").forEach(function (a) {
            a.addEventListener("click", function () {
                document.body.classList.remove("nav-open");
            });
        });
    }

    /* ---------- Hero slideshow ---------- */
    var slides = document.querySelectorAll(".hero-slide");
    if (slides.length > 1) {
        var current = 0;
        slides[0].classList.add("on");
        setInterval(function () {
            slides[current].classList.remove("on");
            current = (current + 1) % slides.length;
            slides[current].classList.add("on");
        }, 5500);
    } else if (slides.length === 1) {
        slides[0].classList.add("on");
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- Gallery filter ---------- */
    var filterBar = document.querySelector(".filter-bar");
    if (filterBar) {
        filterBar.addEventListener("click", function (e) {
            var btn = e.target.closest("button");
            if (!btn) return;
            filterBar.querySelectorAll("button").forEach(function (b) {
                b.classList.toggle("active", b === btn);
            });
            var f = btn.dataset.filter;
            document.querySelectorAll(".gallery-grid > a").forEach(function (item) {
                item.classList.toggle("hide", f !== "*" && !item.classList.contains(f));
            });
        });
    }

    /* ---------- Lightbox ---------- */
    var lbLinks = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (lbLinks.length) {
        var lb = document.createElement("div");
        lb.className = "lightbox";
        lb.innerHTML =
            '<button class="lb-close" aria-label="Sluiten">&times;</button>' +
            '<button class="lb-prev" aria-label="Vorige">&#8249;</button>' +
            '<button class="lb-next" aria-label="Volgende">&#8250;</button>' +
            '<img alt="">';
        document.body.appendChild(lb);
        var lbImg = lb.querySelector("img");
        var idx = 0;

        var visibleLinks = function () {
            return lbLinks.filter(function (a) { return !a.classList.contains("hide"); });
        };
        var show = function (links, i) {
            idx = (i + links.length) % links.length;
            lbImg.src = links[idx].getAttribute("href");
            lb.classList.add("open");
            document.body.style.overflow = "hidden";
        };
        var close = function () {
            lb.classList.remove("open");
            lbImg.src = "";
            document.body.style.overflow = "";
        };

        lbLinks.forEach(function (a) {
            a.addEventListener("click", function (e) {
                e.preventDefault();
                var links = visibleLinks();
                show(links, links.indexOf(a));
            });
        });
        lb.querySelector(".lb-close").addEventListener("click", close);
        lb.querySelector(".lb-prev").addEventListener("click", function () { show(visibleLinks(), idx - 1); });
        lb.querySelector(".lb-next").addEventListener("click", function () { show(visibleLinks(), idx + 1); });
        lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
        document.addEventListener("keydown", function (e) {
            if (!lb.classList.contains("open")) return;
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") show(visibleLinks(), idx - 1);
            if (e.key === "ArrowRight") show(visibleLinks(), idx + 1);
        });
    }

    /* ---------- Contact form ---------- */
    var form = document.getElementById("contact-form");
    if (form) {
        var result = form.querySelector(".form-result");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var btn = form.querySelector("button[type=submit]");
            btn.disabled = true;
            btn.textContent = "Versturen…";
            result.textContent = "";
            result.className = "form-result";

            fetch("contact-handler.php", {
                method: "POST",
                body: new FormData(form),
                headers: { "X-Requested-With": "XMLHttpRequest" }
            })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data.type === "message") {
                        result.textContent = data.text;
                        result.classList.add("ok");
                        form.reset();
                        if (typeof dataLayer !== "undefined") {
                            dataLayer.push({ event: "contact_form_submitted" });
                        }
                    } else {
                        result.textContent = data.text || "Er ging iets mis. Probeer het later opnieuw.";
                        result.classList.add("err");
                    }
                })
                .catch(function () {
                    result.textContent = "Er ging iets mis. Bel of mail ons gerust rechtstreeks.";
                    result.classList.add("err");
                })
                .finally(function () {
                    btn.disabled = false;
                    btn.textContent = "Verstuur bericht";
                });
        });
    }
})();
