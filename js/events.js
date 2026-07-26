// ===========================================
// PRISM Admin - Events Management
// ===========================================

protectPage();

const form = document.getElementById("eventForm");
const eventsList = document.getElementById("eventsList");

// Load Events
async function loadEvents() {

    eventsList.innerHTML = "<p>Loading events...</p>";

    const events = await getEvents();

    if (events.length === 0) {

        eventsList.innerHTML = `
            <div class="event-card">
                <h3>No Events Found</h3>
                <p>Create your first event.</p>
            </div>
        `;

        return;
    }

    eventsList.innerHTML = "";

    events.forEach(event => {

        const card = document.createElement("div");

        card.className = "event-card";

        card.innerHTML = `

            ${event.cover_image
                ? `<img src="${event.cover_image}"
                    style="width:100%;height:220px;object-fit:cover;border-radius:10px;margin-bottom:15px;">`
                : ""
            }

            <h3>${event.title}</h3>

            <p>${event.description || ""}</p>

            <button
                class="delete-btn"
                onclick="removeEvent(${event.id})">

                Delete Event

            </button>

        `;

        eventsList.appendChild(card);

    });

}

// Add Event

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const event = {

        title: document.getElementById("title").value,

        description: document.getElementById("description").value,

        cover_image: document.getElementById("cover").value,

        gallery: []

    };

    await addEvent(event);

    form.reset();

    loadEvents();

});

// Delete Event

async function removeEvent(id){

    const confirmDelete = confirm(

        "Delete this event?"

    );

    if(!confirmDelete) return;

    await deleteEvent(id);

    loadEvents();

}

// Initial Load

loadEvents();
