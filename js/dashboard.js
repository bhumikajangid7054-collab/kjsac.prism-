/*
=========================================
PRISM ADMIN DASHBOARD
=========================================
*/

async function loadDashboard() {

    await loadStatistics();

    await loadAnnouncements();

    await loadFaculty();

    await loadDataLabs();

    await loadEvents();

    await loadNewsletters();

}

/*
=========================================
STATISTICS
=========================================
*/

async function loadStatistics() {

    document.getElementById("announcementCount").textContent =
        (await getAnnouncements()).length;

    document.getElementById("facultyCount").textContent =
        (await getFaculty()).length;

    document.getElementById("datalabCount").textContent =
        (await getDataLabs()).length;

    document.getElementById("eventCount").textContent =
        (await getEvents()).length;

    document.getElementById("newsletterCount").textContent =
        (await getNewsletters()).length;

}

/*
=========================================
ANNOUNCEMENTS
=========================================
*/

async function loadAnnouncements() {

    const announcements = await getAnnouncements();

    const container = document.getElementById("announcementList");

    container.innerHTML = "";

    announcements.forEach(item => {

        container.innerHTML += `

        <div class="admin-card">

            <h3>${item.title}</h3>

            <p>${item.description}</p>

            <div class="actions">

                <button onclick="editAnnouncement(${item.id})">

                    Edit

                </button>

                <button onclick="deleteAnnouncement(${item.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

/*
=========================================
FACULTY
=========================================
*/

async function loadFaculty() {

    const faculty = await getFaculty();

    const container = document.getElementById("facultyList");

    container.innerHTML = "";

    faculty.forEach(member => {

        container.innerHTML += `

        <div class="admin-card">

            <h3>${member.name}</h3>

            <p>${member.designation}</p>

            <div class="actions">

                <button onclick="editFaculty(${member.id})">

                    Edit

                </button>

                <button onclick="deleteFaculty(${member.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

/*
=========================================
DATALABS
=========================================
*/

async function loadDataLabs() {

    const labs = await getDataLabs();

    const container = document.getElementById("datalabList");

    container.innerHTML = "";

    labs.forEach(item => {

        container.innerHTML += `

        <div class="admin-card">

            <h3>${item.title}</h3>

            <p>${item.category}</p>

            <div class="actions">

                <button onclick="editDataLab(${item.id})">

                    Edit

                </button>

                <button onclick="deleteDataLab(${item.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

/*
=========================================
EVENTS
=========================================
*/

async function loadEvents() {

    const events = await getEvents();

    const container = document.getElementById("eventList");

    container.innerHTML = "";

    events.forEach(event => {

        container.innerHTML += `

        <div class="admin-card">

            <h3>${event.title}</h3>

            <p>${event.description}</p>

            <div class="actions">

                <button onclick="editEvent(${event.id})">

                    Edit

                </button>

                <button onclick="deleteEvent(${event.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

/*
=========================================
NEWSLETTERS
=========================================
*/

async function loadNewsletters() {

    const newsletters = await getNewsletters();

    const container = document.getElementById("newsletterList");

    container.innerHTML = "";

    newsletters.forEach(newsletter => {

        container.innerHTML += `

        <div class="admin-card">

            <h3>${newsletter.title}</h3>

            <p>Issue ${newsletter.issue}</p>

            <div class="actions">

                <button onclick="editNewsletter(${newsletter.id})">

                    Edit

                </button>

                <button onclick="deleteNewsletter(${newsletter.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

/*
=========================================
DELETE FUNCTIONS
=========================================
*/

async function deleteAnnouncement(id) {

    if (!confirm("Delete this announcement?")) return;

    await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

    await loadDashboard();

}

async function deleteFaculty(id) {

    if (!confirm("Delete this faculty member?")) return;

    await supabase
        .from("faculty")
        .delete()
        .eq("id", id);

    await loadDashboard();

}

async function deleteDataLab(id) {

    if (!confirm("Delete this DataLab entry?")) return;

    await supabase
        .from("datalabs")
        .delete()
        .eq("id", id);

    await loadDashboard();

}

async function deleteEvent(id) {

    if (!confirm("Delete this event?")) return;

    await supabase
        .from("events")
        .delete()
        .eq("id", id);

    await loadDashboard();

}

async function deleteNewsletter(id) {

    if (!confirm("Delete this newsletter?")) return;

    await supabase
        .from("newsletters")
        .delete()
        .eq("id", id);

    await loadDashboard();

}

/*
=========================================
PLACEHOLDER EDIT FUNCTIONS
=========================================
*/

function editAnnouncement(id) {

    alert("Edit Announcement: " + id);

}

function editFaculty(id) {

    alert("Edit Faculty: " + id);

}

function editDataLab(id) {

    alert("Edit DataLab: " + id);

}

function editEvent(id) {

    alert("Edit Event: " + id);

}

function editNewsletter(id) {

    alert("Edit Newsletter: " + id);

}
/*
=========================================
ADD ANNOUNCEMENT
=========================================
*/

document.getElementById("addAnnouncement")?.addEventListener("click", async () => {

    const title = prompt("Announcement Title");

    if (!title) return;

    const description = prompt("Announcement Description");

    if (description === null) return;

    const { error } = await supabase
        .from("announcements")
        .insert([
            {
                title,
                description
            }
        ]);

    if (error) {

        alert(error.message);

        return;

    }

    await loadDashboard();

});

/*
=========================================
ADD FACULTY
=========================================
*/

document.getElementById("addFaculty")?.addEventListener("click", async () => {

    const name = prompt("Faculty Name");

    if (!name) return;

    const designation = prompt("Designation");

    if (!designation) return;

    const image_url = prompt("Faculty Image URL");

    const { error } = await supabase
        .from("faculty")
        .insert([
            {
                name,
                designation,
                image_url
            }
        ]);

    if (error) {

        alert(error.message);

        return;

    }

    await loadDashboard();

});

/*
=========================================
ADD DATALAB
=========================================
*/

document.getElementById("addDataLab")?.addEventListener("click", async () => {

    const category = prompt("Category");

    if (!category) return;

    const title = prompt("Title");

    if (!title) return;

    const description = prompt("Description");

    const file_url = prompt("Research File URL");

    const cover_image = prompt("Cover Image URL");

    const { error } = await supabase
        .from("datalabs")
        .insert([
            {
                category,
                title,
                description,
                file_url,
                cover_image
            }
        ]);

    if (error) {

        alert(error.message);

        return;

    }

    await loadDashboard();

});

/*
=========================================
ADD EVENT
=========================================
*/

document.getElementById("addEvent")?.addEventListener("click", async () => {

    const title = prompt("Event Name");

    if (!title) return;

    const description = prompt("Description");

    const cover_image = prompt("Cover Image URL");

    const { error } = await supabase
        .from("events")
        .insert([
            {
                title,
                description,
                cover_image
            }
        ]);

    if (error) {

        alert(error.message);

        return;

    }

    await loadDashboard();

});

/*
=========================================
ADD NEWSLETTER
=========================================
*/

document.getElementById("addNewsletter")?.addEventListener("click", async () => {

    const title = prompt("Newsletter Title");

    if (!title) return;

    const issue = prompt("Issue Number");

    if (!issue) return;

    const cover_image = prompt("Cover Image URL");

    const pdf_url = prompt("PDF URL");

    const { error } = await supabase
        .from("newsletters")
        .insert([
            {
                title,
                issue,
                cover_image,
                pdf_url
            }
        ]);

    if (error) {

        alert(error.message);

        return;

    }

    await loadDashboard();

});
