// ==========================================
// PRISM ADMIN PANEL
// newsletters.js
// ==========================================

const newsletterClient = window.supabaseClient;

let newsletterData = [];
let editingNewsletterId = null;

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initializeNewsletters();
});

function initializeNewsletters() {

    const addBtn = document.getElementById("addNewsletterBtn");
    const form = document.getElementById("newsletterForm");

    if (addBtn) {
        addBtn.addEventListener("click", openAddNewsletterModal);
    }

    if (form) {
        form.addEventListener("submit", saveNewsletter);
    }

    loadNewsletters();
}

// ==========================================
// LOAD NEWSLETTERS
// ==========================================

async function loadNewsletters() {

    showLoader();

    const { data, error } = await newsletterClient

        .from(TABLES.newsletters)

        .select("*")

        .order("created_at", {
            ascending: false
        });

    hideLoader();

    if (error) {

        console.error(error);

        showToast(
            "Unable to load newsletters.",
            "error"
        );

        return;
    }

    newsletterData = data || [];

    renderNewsletters();
}

// ==========================================
// RENDER NEWSLETTERS
// ==========================================

function renderNewsletters() {

    const container = document.getElementById(
        "newsletterContainer"
    );

    if (!container) return;

    if (newsletterData.length === 0) {

        container.innerHTML = `

<div class="card">

<h3>No Newsletters</h3>

<p class="mt-20">

Click "Add Newsletter"
to publish your first newsletter.

</p>

</div>

`;

        return;

    }

    container.innerHTML = newsletterData

        .map(newsletter => createNewsletterCard(newsletter))

        .join("");

}

// ==========================================
// NEWSLETTER CARD
// ==========================================

function createNewsletterCard(newsletter) {

    return `

<div class="faculty-card">

<img
src="${newsletter.cover_image}"
alt="${newsletter.title}">

<div class="faculty-info">

<h3>${newsletter.title}</h3>

<p>

${formatDate(newsletter.created_at)}

</p>

<div class="card-actions">

<a
href="${newsletter.pdf_url}"
target="_blank"
class="edit-btn">

View PDF

</a>

<button
class="edit-btn"
onclick="editNewsletter(${newsletter.id})">

Edit

</button>

<button
class="delete-btn"
onclick="deleteNewsletter(${newsletter.id})">

Delete

</button>

</div>

</div>

</div>

`;

}

// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddNewsletterModal() {

    editingNewsletterId = null;

    resetForm("newsletterForm");

    document.getElementById(
        "newsletterModalTitle"
    ).textContent = "Add Newsletter";

    document.getElementById(
        "newsletterId"
    ).value = "";

    document.getElementById(
        "newsletterPreview"
    ).innerHTML = "No Cover";

    openModal("newsletterModal");

}

window.editNewsletter = editNewsletter;
window.deleteNewsletter = deleteNewsletter;
// ==========================================
// EDIT NEWSLETTER
// ==========================================

async function editNewsletter(id) {

    const newsletter = newsletterData.find(
        item => item.id === id
    );

    if (!newsletter) return;

    editingNewsletterId = id;

    document.getElementById(
        "newsletterModalTitle"
    ).textContent = "Edit Newsletter";

    document.getElementById(
        "newsletterId"
    ).value = newsletter.id;

    document.getElementById(
        "newsletterTitle"
    ).value = newsletter.title || "";

    const preview = document.getElementById(
        "newsletterPreview"
    );

    if (newsletter.cover_image) {

        preview.innerHTML = `
            <img
                src="${newsletter.cover_image}"
                alt="${newsletter.title}">
        `;

    } else {

        preview.innerHTML = "No Cover";

    }

    openModal("newsletterModal");

}

// ==========================================
// SAVE NEWSLETTER
// ==========================================

async function saveNewsletter(e) {

    e.preventDefault();

    showLoader();

    try {

        const title = document.getElementById(
            "newsletterTitle"
        ).value.trim();

        const coverInput = document.getElementById(
            "newsletterCover"
        );

        const pdfInput = document.getElementById(
            "newsletterPdf"
        );

        let coverImage = null;
        let pdfUrl = null;

        // Upload cover image

        if (
            coverInput &&
            coverInput.files.length > 0
        ) {

            coverImage = await uploadNewsletterCover(
                coverInput.files[0]
            );

        }

        // Upload PDF

        if (
            pdfInput &&
            pdfInput.files.length > 0
        ) {

            pdfUrl = await uploadNewsletterPdf(
                pdfInput.files[0]
            );

        }

        // Keep existing files during edit

        if (editingNewsletterId) {

            const existing = newsletterData.find(
                item => item.id === editingNewsletterId
            );

            if (!coverImage) {

                coverImage =
                    existing?.cover_image || null;

            }

            if (!pdfUrl) {

                pdfUrl =
                    existing?.pdf_url || null;

            }

        }

        const payload = {

            title,

            cover_image: coverImage,

            pdf_url: pdfUrl

        };

        let response;

        if (editingNewsletterId) {

            response = await newsletterClient

                .from(TABLES.newsletters)

                .update(payload)

                .eq(
                    "id",
                    editingNewsletterId
                );

        } else {

            response = await newsletterClient

                .from(TABLES.newsletters)

                .insert(payload);

        }

        if (response.error) {

            throw response.error;

        }

        showToast(

            editingNewsletterId
                ? "Newsletter updated successfully."
                : "Newsletter published successfully.",

            "success"

        );

        closeModal("newsletterModal");

        resetForm("newsletterForm");

        editingNewsletterId = null;

        await loadNewsletters();

    }

    catch (err) {

        console.error(err);

        showToast(
            err.message,
            "error"
        );

    }

    hideLoader();

}

// ==========================================
// UPLOAD COVER IMAGE
// ==========================================

async function uploadNewsletterCover(file) {

    const extension =
        file.name.split(".").pop();

    const fileName =

        "cover_" +

        Date.now() +

        "_" +

        Math.random()
            .toString(36)
            .substring(2, 8) +

        "." +

        extension;

    const { error } = await newsletterClient.storage

        .from(BUCKETS.newsletters)

        .upload(
            fileName,
            file,
            {
                upsert: false
            }
        );

    if (error) {

        throw error;

    }

    const { data } = newsletterClient.storage

        .from(BUCKETS.newsletters)

        .getPublicUrl(fileName);

    return data.publicUrl;

}

// ==========================================
// UPLOAD PDF
// ==========================================

async function uploadNewsletterPdf(file) {

    const extension =
        file.name.split(".").pop();

    const fileName =

        "pdf_" +

        Date.now() +

        "_" +

        Math.random()
            .toString(36)
            .substring(2, 8) +

        "." +

        extension;

    const { error } = await newsletterClient.storage

        .from(BUCKETS.newsletters)

        .upload(
            fileName,
            file,
            {
                upsert: false
            }
        );

    if (error) {

        throw error;

    }

    const { data } = newsletterClient.storage

        .from(BUCKETS.newsletters)

        .getPublicUrl(fileName);

    return data.publicUrl;

}
// ==========================================
// DELETE NEWSLETTER
// ==========================================

async function deleteNewsletter(id) {

    const confirmed = confirmDelete(
        "Are you sure you want to delete this newsletter?"
    );

    if (!confirmed) return;

    showLoader();

    try {

        const newsletter = newsletterData.find(
            item => item.id === id
        );

        if (!newsletter) {

            throw new Error(
                "Newsletter not found."
            );

        }

        const { error } = await newsletterClient

            .from(TABLES.newsletters)

            .delete()

            .eq("id", id);

        if (error) {

            throw error;

        }

        // Delete cover image

        if (newsletter.cover_image) {

            try {

                const coverFile = newsletter.cover_image

                    .split("/")

                    .pop();

                if (coverFile) {

                    await newsletterClient.storage

                        .from(BUCKETS.newsletters)

                        .remove([coverFile]);

                }

            } catch (storageError) {

                console.warn(
                    "Unable to delete cover image.",
                    storageError
                );

            }

        }

        // Delete PDF

        if (newsletter.pdf_url) {

            try {

                const pdfFile = newsletter.pdf_url

                    .split("/")

                    .pop();

                if (pdfFile) {

                    await newsletterClient.storage

                        .from(BUCKETS.newsletters)

                        .remove([pdfFile]);

                }

            } catch (storageError) {

                console.warn(
                    "Unable to delete PDF.",
                    storageError
                );

            }

        }

        showToast(
            "Newsletter deleted successfully.",
            "success"
        );

        await loadNewsletters();

    }

    catch (err) {

        console.error(err);

        showToast(
            err.message,
            "error"
        );

    }

    hideLoader();

}

// ==========================================
// INITIALIZE PREVIEW & MODAL
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (typeof previewImage === "function") {

            previewImage(
                "newsletterCover",
                "newsletterPreview"
            );

        }

        const closeBtn = document.getElementById(
            "closeNewsletterModal"
        );

        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                () => {

                    editingNewsletterId = null;

                    resetForm(
                        "newsletterForm"
                    );

                    const preview = document.getElementById(
                        "newsletterPreview"
                    );

                    if (preview) {

                        preview.innerHTML = "No Cover";

                    }

                }
            );

        }

    }
);

// ==========================================
// REFRESH
// ==========================================

window.refreshNewsletters = async function () {

    await loadNewsletters();

};

// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.loadNewsletters =
    loadNewsletters;

window.openAddNewsletterModal =
    openAddNewsletterModal;

window.saveNewsletter =
    saveNewsletter;

window.editNewsletter =
    editNewsletter;

window.deleteNewsletter =
    deleteNewsletter;

// ==========================================
// END OF FILE
// ==========================================
