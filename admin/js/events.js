// ==========================================
// PRISM ADMIN PANEL
// events.js
// ==========================================

const eventClient = window.supabaseClient;

let eventsData = [];

let editingEventId = null;

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeEvents();

});

function initializeEvents() {

    const addBtn = document.getElementById("addEventBtn");

    const form = document.getElementById("eventForm");

    if (addBtn) {

        addBtn.addEventListener(
            "click",
            openAddEventModal
        );

    }

    if (form) {

        form.addEventListener(
            "submit",
            saveEvent
        );

    }

    loadEvents();

}

// ==========================================
// LOAD EVENTS
// ==========================================

async function loadEvents() {

    showLoader();

    const {

        data,

        error

    } = await eventClient

        .from(TABLES.events)

        .select("*")

        .order("created_at", {

            ascending: false

        });

    hideLoader();

    if (error) {

        console.error(error);

        showToast(
            "Unable to load events.",
            "error"
        );

        return;

    }

    eventsData = data || [];

    renderEvents();

}

// ==========================================
// RENDER EVENTS
// ==========================================

function renderEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );

    if (!container) return;

    if (eventsData.length === 0) {

        container.innerHTML = `

        <div class="card">

            <h3>No Events Found</h3>

            <p class="mt-20">

                Click "Add Event"
                to create your first event.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = eventsData

        .map(event => createEventCard(event))

        .join("");

}

// ==========================================
// EVENT CARD
// ==========================================

function createEventCard(event) {

    return `

<div class="faculty-card">

<img
src="${event.cover_image || ''}"
alt="${event.title}">

<div class="faculty-info">

<h3>${event.title}</h3>

<p>

<strong>

${formatDate(event.created_at)}

</strong>

</p>

<p>

${event.description || ""}

</p>

<div class="card-actions">

<button
class="edit-btn"
onclick="editEvent(${event.id})">

Edit

</button>

<button
class="delete-btn"
onclick="deleteEvent(${event.id})">

Delete

</button>

</div>

</div>

</div>

`;

}

// ==========================================
// OPEN ADD EVENT MODAL
// ==========================================

function openAddEventModal() {

    editingEventId = null;

    document.getElementById(
        "eventModalTitle"
    ).textContent = "Add Event";

    resetForm("eventForm");

    document.getElementById(
        "eventId"
    ).value = "";

    openModal("eventModal");

}

window.editEvent = editEvent;

window.deleteEvent = deleteEvent;

// ==========================================
// EDIT EVENT
// ==========================================

async function editEvent(id) {

    const event = eventsData.find(
        item => item.id === id
    );

    if (!event) return;

    editingEventId = id;

    document.getElementById(
        "eventModalTitle"
    ).textContent = "Edit Event";

    document.getElementById(
        "eventId"
    ).value = event.id;

    document.getElementById(
        "eventTitle"
    ).value = event.title || "";

    document.getElementById(
        "eventDescription"
    ).value = event.description || "";

    const preview = document.getElementById(
        "eventPreview"
    );

    if (preview) {

        if (event.cover_image) {

            preview.innerHTML = `
                <img
                src="${event.cover_image}"
                alt="${event.title}">
            `;

        } else {

            preview.innerHTML = "No Image";

        }

    }

    openModal("eventModal");

}

// ==========================================
// SAVE EVENT
// ==========================================

async function saveEvent(e) {

    e.preventDefault();

    showLoader();

    try {

        const title = document
            .getElementById("eventTitle")
            .value
            .trim();

        const description = document
            .getElementById("eventDescription")
            .value
            .trim();

        const imageInput =
            document.getElementById("eventImage");

        let coverImage = null;

        // Upload new image

        if (imageInput && imageInput.files.length > 0) {

            coverImage = await uploadEventImage(
                imageInput.files[0]
            );

        }

        // Keep existing image during edit

        if (!coverImage && editingEventId) {

            const existing = eventsData.find(
                item => item.id === editingEventId
            );

            coverImage =
                existing?.cover_image || null;

        }

        const payload = {

            title,

            description,

            cover_image: coverImage

        };

        let response;

        if (editingEventId) {

            response = await eventClient

                .from(TABLES.events)

                .update(payload)

                .eq("id", editingEventId);

        } else {

            response = await eventClient

                .from(TABLES.events)

                .insert(payload);

        }

        if (response.error) {

            throw response.error;

        }

        showToast(

            editingEventId
                ? "Event updated successfully."
                : "Event created successfully.",

            "success"

        );

        closeModal("eventModal");

        resetForm("eventForm");

        editingEventId = null;

        await loadEvents();

        updateDashboardCounts();

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
// UPLOAD EVENT IMAGE
// ==========================================

async function uploadEventImage(file){

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

    const { error } = await eventClient.storage

        .from(BUCKETS.events)

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

    const { data } = eventClient.storage

        .from(BUCKETS.events)

        .getPublicUrl(fileName);

    return data.publicUrl;

}
// ==========================================
// DELETE EVENT
// ==========================================

async function deleteEvent(id) {

    const confirmed = confirmDelete(
        "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    showLoader();

    try {

        const event = eventsData.find(
            item => item.id === id
        );

        if (!event) {

            throw new Error(
                "Event not found."
            );

        }

        // Delete database record

        const { error } = await eventClient

            .from(TABLES.events)

            .delete()

            .eq("id", id);

        if (error) {

            throw error;

        }

        // Delete cover image (best effort)

        if (event.cover_image) {

            try {

                const filePath = event.cover_image
                    .split("/")
                    .pop();

                if (filePath) {

                    await eventClient.storage

                        .from(BUCKETS.events)

                        .remove([filePath]);

                }

            }

            catch(storageError){

                console.warn(
                    "Unable to delete event image.",
                    storageError
                );

            }

        }

        showToast(
            "Event deleted successfully.",
            "success"
        );

        await loadEvents();

        updateDashboardCounts();

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
// CLOSE MODAL
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const closeBtn = document.getElementById(
            "closeEventModal"
        );

        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                () => {

                    resetForm("eventForm");

                    editingEventId = null;

                    const preview =
                        document.getElementById(
                            "eventPreview"
                        );

                    if (preview) {

                        preview.innerHTML =
                            "No Image";

                    }

                }
            );

        }

        // Image preview

        if (typeof previewImage === "function") {

            previewImage(
                "eventImage",
                "eventPreview"
            );

        }

    }
);

// ==========================================
// REFRESH EVENTS
// ==========================================

window.refreshEvents = async function () {

    await loadEvents();

};

// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.loadEvents = loadEvents;

window.openAddEventModal =
    openAddEventModal;

window.saveEvent =
    saveEvent;

window.editEvent =
    editEvent;

window.deleteEvent =
    deleteEvent;

// ==========================================
// END OF FILE
// ==========================================

