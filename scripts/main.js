
/* PSARPONG TECH: navigation, footer year and enquiry form */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");

  if (menuButton && primaryNav) {
    menuButton.addEventListener("click", () => {
      const expanded =
        menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("is-open", !expanded);

      const label = menuButton.querySelector(".sr-only");
      const icon = menuButton.querySelector(".menu-icon");

      if (label) {
        label.textContent = expanded
          ? "Open navigation menu"
          : "Close navigation menu";
      }

      if (icon) icon.textContent = expanded ? "☰" : "✕";
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");

        const label = menuButton.querySelector(".sr-only");
        const icon = menuButton.querySelector(".menu-icon");

        if (label) label.textContent = "Open navigation menu";
        if (icon) icon.textContent = "☰";
      });
    });
  }

  // Automatically display the current year
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Contact form: review, edit and confirm
  const form = document.querySelector("#contact-form");

  if (!form) return;

  const feedback = document.querySelector("#form-feedback");
  const submitButton = form.querySelector('button[type="submit"]');

  // Create an accessible review panel after the form
  const review = document.createElement("section");
  review.id = "enquiry-review";
  review.className = "contact-form";
  review.hidden = true;
  review.setAttribute("aria-labelledby", "review-heading");

  review.innerHTML = `
    <h2 id="review-heading">Review your enquiry</h2>
    <p>Please check your details before sending.</p>
    <dl id="review-details"></dl>
    <p id="review-status" role="status" aria-live="polite"></p>
    <div class="form-row">
      <button class="button" type="button" id="edit-enquiry">
        Edit details
      </button>
      <button class="button" type="button" id="confirm-enquiry">
        Confirm and send
      </button>
    </div>
  `;

  form.insertAdjacentElement("afterend", review);

  const reviewDetails = review.querySelector("#review-details");
  const reviewStatus = review.querySelector("#review-status");
  const editButton = review.querySelector("#edit-enquiry");
  const confirmButton = review.querySelector("#confirm-enquiry");

  const fields = [
    ["name", "Full name"],
    ["email", "Email address"],
    ["business", "Business or organization"],
    ["service", "Service"],
    ["message", "Enquiry message"]
  ];

  function showReview() {
    reviewDetails.replaceChildren();

    fields.forEach(([name, label]) => {
      const field = form.elements.namedItem(name);
      const term = document.createElement("dt");
      const description = document.createElement("dd");

      term.textContent = label;
      description.textContent = field.value.trim() || "Not provided";

      reviewDetails.append(term, description);
    });

    form.hidden = true;
    review.hidden = false;
    reviewStatus.textContent = "";
    review.scrollIntoView({ behavior: "smooth", block: "start" });
    confirmButton.disabled = false;
    confirmButton.textContent = "Confirm and send";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    // Honeypot: silently reject likely automated spam.
    const honeypot = form.elements.namedItem("botcheck");

    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    showReview();
  });

  editButton.addEventListener("click", () => {
    review.hidden = true;
    form.hidden = false;
    reviewStatus.textContent = "";

    const firstField = form.elements.namedItem("name");
    if (firstField) firstField.focus();

    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  confirmButton.addEventListener("click", async () => {
    if (!form.reportValidity()) {
      review.hidden = true;
      form.hidden = false;
      form.reportValidity();
      return;
    }

    const accessKey = form.elements.namedItem("access_key");

    if (!accessKey || !accessKey.value.trim() ||
        accessKey.value === "PASTE_YOUR_ACCESS_KEY_HERE") {
      reviewStatus.textContent =
        "The form has not been configured yet. Please try again later.";
      return;
    }

    confirmButton.disabled = true;
    editButton.disabled = true;
    confirmButton.textContent = "Sending...";
    reviewStatus.textContent = "Sending your enquiry securely...";

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: new FormData(form)
        }
      );

      // Read text first so an HTML error page cannot cause
      // an unhandled "Unexpected token '<'" JSON error.
      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The service returned an unexpected response. Please try again later."
        );
      }

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
          result.body?.message ||
          "Your enquiry could not be sent. Please try again."
        );
      }

      //Successful submission: open the Thank You page.
      window.location.href = "thank-you.html";
      return;
      
    } catch (error) {
      reviewStatus.textContent =
        error.message ||
        "We couldn't send your enquiry. Check your connection and try again.";

      confirmButton.disabled = false;
      editButton.disabled = false;
      confirmButton.textContent = "Try sending again";
    }
  });
});
