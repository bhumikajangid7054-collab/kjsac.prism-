// ==========================================
// PRISM ADMIN PANEL
// gallery.js
// ==========================================

const galleryClient = window.supabaseClient;

let galleryData = [];

let editingGalleryId = null;

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeGallery();

});

function initializeGallery() {

    const addBtn = document.getElementById(
        "addGalleryBtn"
    );

    const form = document.getElementById(
        "galleryForm"
    );

    if (addBtn) {

        addBtn.addEventListener(
            "click",
            openAddGalleryModal
        );

    }

    if (form) {

        form.addEventListener(
            "submit",
            saveGalleryImage
        );

    }

    loadGallery();

}

// ==========================================
// LOAD GALLERY
// ==========================================

async function loadGallery() {

    showLoader();

    const {

        data,

        error

    } = await galleryClient

        .from(TABLES.gallery)

        .select("*")

        .order("created_at", {

            ascending: false

        });

    hideLoader();

    if (error) {

        console.error(error);

        showToast(
            "Unable to load gallery.",
            "error"
        );

        return;

    }

    galleryData = data || [];

    renderGallery();

}

// ==========================================
// RENDER GALLERY
// ==========================================

function renderGallery() {

    const container = document.getElementById(
        "galleryContainer"
    );

    if (!container) return;

    if (galleryData.length === 0) {

        container.innerHTML = `

        <div class="card">

            <h3>No Gallery Images</h3>

            <p class="mt-20">

                Click "Add Image"
                to upload your first image.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = galleryData

        .map(image => createGalleryCard(image))

        .join("");

}

// ==========================================
// GALLERY CARD
// ==========================================

function createGalleryCard(image) {

    return `

<div class="faculty-card">

<img
src="${image.image_url}"
alt="Gallery">

<div class="faculty-info">

<p>

<strong>

Event ID:

${image.event_id}

</strong>

</p>

<p>

${formatDate(image.created_at)}

</p>

<div class="card-actions">

<button
class="edit-btn"
onclick="editGallery(${image.id})">

Edit

</button>

<button
class="delete-btn"
onclick="deleteGallery(${image.id})">

Delete

</button>

</div>

</div>

</div>

`;

}

// ==========================================
// OPEN MODAL
// ==========================================

function openAddGalleryModal() {

    editingGalleryId = null;

    document.getElementById(
        "galleryModalTitle"
    ).textContent = "Add Gallery Image";

    resetForm("galleryForm");

    document.getElementById(
        "galleryId"
    ).value = "";

    document.getElementById(
        "galleryPreview"
    ).innerHTML = "No Image";

    openModal("galleryModal");

}

window.editGallery = editGallery;

window.deleteGallery = deleteGallery;

// ==========================================
// EDIT GALLERY IMAGE
// ==========================================

async function editGallery(id) {

    const image = galleryData.find(
        item => item.id === id
    );

    if (!image) return;

    editingGalleryId = id;

    document.getElementById(
        "galleryModalTitle"
    ).textContent = "Edit Gallery Image";

    document.getElementById(
        "galleryId"
    ).value = image.id;

    document.getElementById(
        "galleryEventId"
    ).value = image.event_id || "";

    const preview = document.getElementById(
        "galleryPreview"
    );

    if (image.image_url) {

        preview.innerHTML = `
            <img
            src="${image.image_url}"
            alt="Gallery">
        `;

    } else {

        preview.innerHTML = "No Image";

    }

    openModal("galleryModal");

}

// ==========================================
// SAVE GALLERY IMAGE
// ==========================================

async function saveGalleryImage(e) {

    e.preventDefault();

    showLoader();

    try {

        const eventId = Number(
            document.getElementById(
                "galleryEventId"
            ).value
        );

        const imageInput = document.getElementById(
            "galleryImage"
        );

        let imageUrl = null;

        // Upload new image

        if (
            imageInput &&
            imageInput.files.length > 0
        ) {

            imageUrl = await uploadGalleryImage(
                imageInput.files[0]
            );

        }

        // Keep old image while editing

        if (!imageUrl && editingGalleryId) {

            const existing = galleryData.find(
                item => item.id === editingGalleryId
            );

            imageUrl =
                existing?.image_url || null;

        }

        const payload = {

            event_id: eventId,

            image_url: imageUrl

        };

        let response;

        if (editingGalleryId) {

            response = await galleryClient

                .from(TABLES.gallery)

                .update(payload)

                .eq(
                    "id",
                    editingGalleryId
                );

        } else {

            response = await galleryClient

                .from(TABLES.gallery)

                .insert(payload);

        }

        if (response.error) {

            throw response.error;

        }

        showToast(

            editingGalleryId
                ? "Gallery updated successfully."
                : "Image uploaded successfully.",

            "success"

        );

        closeModal("galleryModal");

        resetForm("galleryForm");

        editingGalleryId = null;

        await loadGallery();

    }

    catch(err){

        console.error(err);

        showToast(
            err.message,
            "error"
        );

    }

    hideLoader();

}

// ==========================================
// UPLOAD IMAGE
// ==========================================

async function uploadGalleryImage(file){

    const extension =
        file.name.split(".").pop();

    const fileName =

        Date.now() +

        "_" +

        Math.random()
            .toString(36)
            .substring(2,8) +

        "." +

        extension;

    const { error } = await galleryClient.storage

        .from(BUCKETS.gallery)

        .upload(

            fileName,

            file,

            {

                upsert:false

            }

        );

    if(error){

        throw error;

    }

    const { data } = galleryClient.storage

        .from(BUCKETS.gallery)

        .getPublicUrl(fileName);

    return data.publicUrl;

}
