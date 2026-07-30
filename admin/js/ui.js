// ==========================================
// PRISM ADMIN PANEL
// ui.js
// ==========================================

// -------------------------------
// LOADER
// -------------------------------

const loader = document.getElementById("loader");

function showLoader() {

    if (loader) {
        loader.classList.remove("hidden");
    }

}

function hideLoader() {

    if (loader) {
        loader.classList.add("hidden");
    }

}

window.showLoader = showLoader;
window.hideLoader = hideLoader;

// -------------------------------
// TOAST
// -------------------------------

const toastContainer = document.getElementById("toastContainer");

function showToast(message, type = "success") {

    if (!toastContainer) return;

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

window.showToast = showToast;

// -------------------------------
// MODALS
// -------------------------------

function openModal(modalId) {

    const modal = document.getElementById(modalId);

    if (modal) {

        modal.classList.add("active");

    }

}

function closeModal(modalId) {

    const modal = document.getElementById(modalId);

    if (modal) {

        modal.classList.remove("active");

    }

}

window.openModal = openModal;
window.closeModal = closeModal;

// -------------------------------
// CLOSE MODAL BUTTONS
// -------------------------------

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("close-modal")) {

        const modal = e.target.closest(".modal");

        if (modal) {

            modal.classList.remove("active");

        }

    }

});

// -------------------------------
// CLICK OUTSIDE MODAL
// -------------------------------

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("modal")) {

        e.target.classList.remove("active");

    }

});

// -------------------------------
// ESC KEY CLOSE
// -------------------------------

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        document.querySelectorAll(".modal").forEach(modal => {

            modal.classList.remove("active");

        });

    }

});

// -------------------------------
// IMAGE PREVIEW
// -------------------------------

function previewImage(inputId, previewId) {

    const input = document.getElementById(inputId);

    const preview = document.getElementById(previewId);

    if (!input || !preview) return;

    input.addEventListener("change", () => {

        const file = input.files[0];

        if (!file) {

            preview.innerHTML = "No Image";

            return;

        }

        const reader = new FileReader();

        reader.onload = function(event) {

            preview.innerHTML = "";

            const img = document.createElement("img");

            img.src = event.target.result;

            preview.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

}

window.previewImage = previewImage;

// -------------------------------
// RESET FORM
// -------------------------------

function resetForm(formId) {

    const form = document.getElementById(formId);

    if (!form) return;

    form.reset();

}

window.resetForm = resetForm;

// -------------------------------
// FORMAT DATE
// -------------------------------

function formatDate(dateString) {

    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString();

}

window.formatDate = formatDate;

// -------------------------------
// CONFIRM DELETE
// -------------------------------

function confirmDelete(message = "Delete this item?") {

    return confirm(message);

}

window.confirmDelete = confirmDelete;

// -------------------------------
// IMAGE PREVIEWS
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {

    previewImage(
        "facultyImage",
        "facultyPreview"
    );

    previewImage(
        "galleryImage",
        "galleryPreview"
    );

});
