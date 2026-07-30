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


