/*
=========================================
PRISM ADMIN DASHBOARD
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

/*
=========================================
DASHBOARD
=========================================
*/

async function loadDashboard() {
    await loadStatistics();
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

    const faculty = await getFaculty();
    const datalabs = await getDataLabs();
    const events = await getEvents();
    const newsletters = await getNewsletters();

    const facultyCount = document.getElementById("facultyCount");
    const datalabCount = document.getElementById("datalabCount");
    const eventCount = document.getElementById("eventCount");
    const newsletterCount = document.getElementById("newsletterCount");

    if (facultyCount) facultyCount.textContent = faculty.length;
    if (datalabCount) datalabCount.textContent = datalabs.length;
    if (eventCount) eventCount.textContent = events.length;
    if (newsletterCount) newsletterCount.textContent = newsletters.length;
}

/*
=========================================
FACULTY
=========================================
*/

async function loadFaculty() {

    const container = document.getElementById("facultyList");

    if (!container) return;

    container.innerHTML = "";

    const faculty = await getFaculty();

    faculty.forEach(member => {

        container.innerHTML += `
        <div class="admin-card">

            <img
                src="${member.image_url || ""}"
                alt="${member.name}"
                class="faculty-preview">

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
DELETE FACULTY
=========================================
*/

async function deleteFaculty(id) {

    if (!confirm("Delete this faculty member?")) return;

    const { error } = await supabase
        .from("faculty")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    await loadDashboard();
}

/*
=========================================
EDIT FACULTY
=========================================
*/

async function editFaculty(id) {

    alert("Faculty editing will be added in Part B.");
}

/*
=========================================
ADD FACULTY
=========================================
*/

const addFacultyBtn = document.getElementById("addFaculty");

if (addFacultyBtn) {

    addFacultyBtn.addEventListener("click", async () => {

        const name = prompt("Faculty Name");
        if (!name) return;

        const designation = prompt("Designation");
        if (!designation) return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async () => {

            const file = input.files[0];

            if (!file) return;

            const image_url = await uploadFile("faculty", file);

            if (!image_url) {
                alert("Image upload failed.");
                return;
            }

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

            alert("Faculty added successfully.");

            await loadDashboard();
        };

        input.click();

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
ADD FACULTY
=========================================
*/

document.getElementById("addFaculty")?.addEventListener("click", async () => {

    const name = prompt("Faculty Name");

    if (!name) return;

    const designation = prompt("Designation");

    if (!designation) return;

    const fileInput = document.createElement("input");

fileInput.type = "file";

fileInput.accept = "image/*";

fileInput.click();

fileInput.onchange = async () => {

    const file = fileInput.files[0];

    if (!file) return;

    const image_url = await uploadFile("faculty", file);

};

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

    const fileInput = document.createElement("input");

fileInput.type = "file";

fileInput.accept = "image/*";

fileInput.click();

fileInput.onchange = async () => {

    const file = fileInput.files[0];

    if (!file) return;

    const cover_image = await uploadFile("events", file);

    await supabase
        .from("events")
        .insert([
            {
                title,
                description,
                cover_image
            }
        ]);

    await loadDashboard();

};

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
