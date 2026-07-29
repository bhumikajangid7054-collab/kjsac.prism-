// ==========================================
// DASHBOARD INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    setupNavigation();

    await loadDashboard();

    initializeFaculty();

    initializeDataLabs();

    initializeEvents();

    initializeGallery();

    initializeNewsletters();

});

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

function setupNavigation() {

    const buttons = document.querySelectorAll(".nav-btn");

    const pages = document.querySelectorAll(".page");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const section = button.dataset.section;

            buttons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            pages.forEach(page => page.classList.remove("active"));

            const target = document.getElementById(section + "Section");

            if (target) {

                target.classList.add("active");

            }

        });

    });

}

// ==========================================
// DASHBOARD COUNTS
// ==========================================

async function loadDashboard() {

    try {

        showLoader();

        const faculty = await fetchTable("faculty");

        const datalabs = await fetchTable("datalabs");

        const events = await fetchTable("events");

        const newsletters = await fetchTable("newsletters");

        document.getElementById("facultyCount").textContent =
            faculty.length;

        document.getElementById("datalabCount").textContent =
            datalabs.length;

        document.getElementById("eventCount").textContent =
            events.length;

        document.getElementById("newsletterCount").textContent =
            newsletters.length;

    }

    catch (err) {

        console.error(err);

        showToast(err.message, "error");

    }

    finally {

        hideLoader();

    }

}

// ==========================================
// PLACEHOLDER FUNCTIONS
// (implemented in later parts)
// ==========================================

function initializeFaculty() {}

function initializeDataLabs() {}

function initializeEvents() {}

function initializeGallery() {}

function initializeNewsletters() {}

// ==========================================
// FACULTY CRUD
// ==========================================

function initializeFaculty() {

    loadFaculty();

    const addBtn = document.getElementById("addFacultyBtn");
    const modal = document.getElementById("facultyModal");
    const closeBtn = document.getElementById("closeFacultyModal");
    const form = document.getElementById("facultyForm");

    addBtn?.addEventListener("click", () => {

        form.reset();

        document.getElementById("facultyId").value = "";

        document.getElementById("facultyPreview").style.display = "none";

        document.getElementById("facultyModalTitle").textContent =
            "Add Faculty";

        modal.classList.add("show");

    });

    closeBtn?.addEventListener("click", () => {

        modal.classList.remove("show");

    });

    window.addEventListener("click", e => {

        if (e.target === modal) {

            modal.classList.remove("show");

        }

    });

    document
        .getElementById("facultyImage")
        .addEventListener("change", previewFacultyImage);

    form.addEventListener("submit", saveFaculty);

}

// ==========================================
// LOAD FACULTY
// ==========================================

async function loadFaculty() {

    try {

        const faculty = await fetchTable("faculty");

        const table = document.getElementById("facultyTable");

        table.innerHTML = "";

        faculty.forEach(member => {

            table.innerHTML += `
                <tr>

                    <td>
                        <img src="${member.image}" width="70">
                    </td>

                    <td>${member.name}</td>

                    <td>${member.designation}</td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editFaculty(${member.id})">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteFaculty(${member.id})">

                            Delete

                        </button>

                    </td>

                </tr>
            `;

        });

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

}

// ==========================================
// IMAGE PREVIEW
// ==========================================

function previewFacultyImage(e){

    const file = e.target.files[0];

    if(!file) return;

    const preview = document.getElementById("facultyPreview");

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";

}

// ==========================================
// SAVE FACULTY
// ==========================================

async function saveFaculty(e){

    e.preventDefault();

    try{

        showLoader();

        const id =
            document.getElementById("facultyId").value;

        const name =
            document.getElementById("facultyName").value.trim();

        const designation =
            document.getElementById("facultyDesignation").value.trim();

        const imageFile =
            document.getElementById("facultyImage").files[0];

        let image = null;

        if(imageFile){

            image = await uploadFile(
                "faculty",
                imageFile
            );

        }

        const data = {

            name,

            designation

        };

        if(image){

            data.image = image;

        }

        if(id){

            await updateRow(
                "faculty",
                id,
                data
            );

            showToast("Faculty updated");

        }

        else{

            await insertRow(
                "faculty",
                data
            );

            showToast("Faculty added");

        }

        document
            .getElementById("facultyModal")
            .classList
            .remove("show");

        await loadFaculty();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}

// ==========================================
// EDIT FACULTY
// ==========================================

async function editFaculty(id){

    const faculty =
        await fetchTable("faculty");

    const member =
        faculty.find(f=>f.id===id);

    if(!member) return;

    document.getElementById("facultyId").value =
        member.id;

    document.getElementById("facultyName").value =
        member.name;

    document.getElementById("facultyDesignation").value =
        member.designation;

    if(member.image){

        const preview =
            document.getElementById("facultyPreview");

        preview.src =
            member.image;

        preview.style.display =
            "block";

    }

    document.getElementById("facultyModalTitle").textContent =
        "Edit Faculty";

    document.getElementById("facultyModal")
        .classList
        .add("show");

}

// ==========================================
// DELETE FACULTY
// ==========================================

async function deleteFaculty(id){

    if(!confirm("Delete this faculty member?"))
        return;

    try{

        showLoader();

        await deleteRow(
            "faculty",
            id
        );

        showToast("Faculty deleted");

        await loadFaculty();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}

// ==========================================
// DATALABS CRUD
// ==========================================

function initializeDataLabs() {

    loadDataLabs();

    const addBtn = document.getElementById("addDataLabBtn");
    const modal = document.getElementById("datalabModal");
    const closeBtn = document.getElementById("closeDataLabModal");
    const form = document.getElementById("datalabForm");

    addBtn?.addEventListener("click", () => {

        form.reset();

        document.getElementById("datalabId").value = "";

        document.getElementById("datalabPreview").style.display = "none";

        document.getElementById("datalabModalTitle").textContent =
            "Add DataLab";

        modal.classList.add("show");

    });

    closeBtn?.addEventListener("click", () => {

        modal.classList.remove("show");

    });

    window.addEventListener("click", e => {

        if (e.target === modal) {

            modal.classList.remove("show");

        }

    });

    document
        .getElementById("datalabImage")
        .addEventListener("change", previewDataLabImage);

    form.addEventListener("submit", saveDataLab);

}

// ==========================================
// LOAD DATALABS
// ==========================================

async function loadDataLabs() {

    try {

        const labs = await fetchTable("datalabs");

        const table = document.getElementById("datalabTable");

        table.innerHTML = "";

        labs.forEach(lab => {

            table.innerHTML += `
            <tr>

                <td>
                    <img src="${lab.image || ""}" width="70">
                </td>

                <td>${lab.title}</td>

                <td>${lab.description}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editDataLab(${lab.id})">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteDataLab(${lab.id})">

                        Delete

                    </button>

                </td>

            </tr>
            `;

        });

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

}

// ==========================================
// IMAGE PREVIEW
// ==========================================

function previewDataLabImage(e){

    const file = e.target.files[0];

    if(!file) return;

    const preview = document.getElementById("datalabPreview");

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";

}

// ==========================================
// SAVE DATALAB
// ==========================================

async function saveDataLab(e){

    e.preventDefault();

    try{

        showLoader();

        const id =
            document.getElementById("datalabId").value;

        const title =
            document.getElementById("datalabTitle").value.trim();

        const description =
            document.getElementById("datalabDescription").value.trim();

        const imageFile =
            document.getElementById("datalabImage").files[0];

        let image = null;

        if(imageFile){

            image = await uploadFile(
                "documents",
                imageFile
            );

        }

        const data = {

            title,

            description

        };

        if(image){

            data.image = image;

        }

        if(id){

            await updateRow(
                "datalabs",
                id,
                data
            );

            showToast("DataLab updated");

        }

        else{

            await insertRow(
                "datalabs",
                data
            );

            showToast("DataLab added");

        }

        document
            .getElementById("datalabModal")
            .classList
            .remove("show");

        await loadDataLabs();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}

// ==========================================
// EDIT DATALAB
// ==========================================

async function editDataLab(id){

    const labs = await fetchTable("datalabs");

    const lab = labs.find(l => l.id === id);

    if(!lab) return;

    document.getElementById("datalabId").value =
        lab.id;

    document.getElementById("datalabTitle").value =
        lab.title;

    document.getElementById("datalabDescription").value =
        lab.description;

    if(lab.image){

        const preview =
            document.getElementById("datalabPreview");

        preview.src =
            lab.image;

        preview.style.display =
            "block";

    }

    document.getElementById("datalabModalTitle").textContent =
        "Edit DataLab";

    document.getElementById("datalabModal")
        .classList
        .add("show");

}

// ==========================================
// DELETE DATALAB
// ==========================================

async function deleteDataLab(id){

    if(!confirm("Delete this DataLab?"))
        return;

    try{

        showLoader();

        await deleteRow(
            "datalabs",
            id
        );

        showToast("DataLab deleted");

        await loadDataLabs();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}

// ==========================================
// EVENTS CRUD
// ==========================================

function initializeEvents() {

    loadEvents();

    const addBtn = document.getElementById("addEventBtn");
    const modal = document.getElementById("eventModal");
    const closeBtn = document.getElementById("closeEventModal");
    const form = document.getElementById("eventForm");

    addBtn?.addEventListener("click", () => {

        form.reset();

        document.getElementById("eventId").value = "";

        document.getElementById("eventPreview").style.display = "none";

        document.getElementById("eventModalTitle").textContent =
            "Add Event";

        modal.classList.add("show");

    });

    closeBtn?.addEventListener("click", () => {

        modal.classList.remove("show");

    });

    window.addEventListener("click", e => {

        if (e.target === modal) {

            modal.classList.remove("show");

        }

    });

    document
        .getElementById("eventCover")
        .addEventListener("change", previewEventImage);

    form.addEventListener("submit", saveEvent);

}

// ==========================================
// LOAD EVENTS
// ==========================================

async function loadEvents() {

    try {

        const events = await fetchTable("events");

        const table = document.getElementById("eventTable");

        table.innerHTML = "";

        events.forEach(event => {

            table.innerHTML += `

            <tr>

                <td>
                    <img src="${event.image || ""}" width="70">
                </td>

                <td>${event.title}</td>

                <td>${event.date}</td>

                <td>${event.venue}</td>

                <td>

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

                </td>

            </tr>

            `;

        });

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

}

// ==========================================
// IMAGE PREVIEW
// ==========================================

function previewEventImage(e){

    const file = e.target.files[0];

    if(!file) return;

    const preview = document.getElementById("eventPreview");

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";

}

// ==========================================
// SAVE EVENT
// ==========================================

async function saveEvent(e){

    e.preventDefault();

    try{

        showLoader();

        const id =
            document.getElementById("eventId").value;

        const title =
            document.getElementById("eventTitle").value.trim();

        const description =
            document.getElementById("eventDescription").value.trim();

        const date =
            document.getElementById("eventDate").value;

        const venue =
            document.getElementById("eventVenue").value.trim();

        const imageFile =
            document.getElementById("eventCover").files[0];

        let image = null;

        if(imageFile){

            image = await uploadFile(
                "events",
                imageFile
            );

        }

        const data = {

            title,

            description,

            date,

            venue

        };

        if(image){

            data.image = image;

        }

        if(id){

            await updateRow(
                "events",
                id,
                data
            );

            showToast("Event updated");

        }

        else{

            await insertRow(
                "events",
                data
            );

            showToast("Event added");

        }

        document
            .getElementById("eventModal")
            .classList
            .remove("show");

        await loadEvents();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}

// ==========================================
// EDIT EVENT
// ==========================================

async function editEvent(id){

    const events = await fetchTable("events");

    const event = events.find(e => e.id === id);

    if(!event) return;

    document.getElementById("eventId").value =
        event.id;

    document.getElementById("eventTitle").value =
        event.title;

    document.getElementById("eventDescription").value =
        event.description;

    document.getElementById("eventDate").value =
        event.date;

    document.getElementById("eventVenue").value =
        event.venue;

    if(event.image){

        const preview =
            document.getElementById("eventPreview");

        preview.src =
            event.image;

        preview.style.display =
            "block";

    }

    document.getElementById("eventModalTitle").textContent =
        "Edit Event";

    document.getElementById("eventModal")
        .classList
        .add("show");

}

// ==========================================
// DELETE EVENT
// ==========================================

async function deleteEvent(id){

    if(!confirm("Delete this event?"))
        return;

    try{

        showLoader();

        await deleteRow(
            "events",
            id
        );

        showToast("Event deleted");

        await loadEvents();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader

            // ==========================================
// GALLERY
// ==========================================

function initializeGallery() {

    loadGallery();

    const modal = document.getElementById("galleryModal");

    document.getElementById("uploadGalleryBtn")
        ?.addEventListener("click", () => {

            document.getElementById("galleryForm").reset();

            modal.classList.add("show");

        });

    document.getElementById("closeGalleryModal")
        ?.addEventListener("click", () => {

            modal.classList.remove("show");

        });

    document.getElementById("galleryForm")
        ?.addEventListener("submit", uploadGallery);

}

async function loadGallery() {

    const gallery = await fetchTable("event_gallery");

    const grid = document.getElementById("galleryGrid");

    grid.innerHTML = "";

    gallery.forEach(item => {

        grid.innerHTML += `

        <div class="gallery-item">

            <img src="${item.image_url}" alt="">

            <div class="gallery-actions">

                <span>${item.title}</span>

                <button
                    class="delete-btn"
                    onclick="deleteGallery(${item.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

async function uploadGallery(e){

    e.preventDefault();

    try{

        showLoader();

        const title =
            document.getElementById("galleryTitle").value;

        const files =
            document.getElementById("galleryImages").files;

        for(const file of files){

            const url = await uploadFile(
                "gallery",
                file
            );

            await insertRow(
                "event_gallery",
                {

                    title,

                    image_url:url

                }
            );

        }

        showToast("Gallery updated");

        document
            .getElementById("galleryModal")
            .classList
            .remove("show");

        await loadGallery();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}

async function deleteGallery(id){

    if(!confirm("Delete image?"))
        return;

    await deleteRow(
        "event_gallery",
        id
    );

    showToast("Deleted");

    loadGallery();

}

// ==========================================
// NEWSLETTER CRUD
// ==========================================

function initializeNewsletters() {

    loadNewsletters();

    const modal = document.getElementById("newsletterModal");

    document.getElementById("addNewsletterBtn")
        ?.addEventListener("click", () => {

            document.getElementById("newsletterForm").reset();

            document.getElementById("newsletterId").value = "";

            document.getElementById("newsletterPreview").style.display = "none";

            document.getElementById("newsletterModalTitle").textContent =
                "Upload Newsletter";

            modal.classList.add("show");

        });

    document.getElementById("closeNewsletterModal")
        ?.addEventListener("click", () => {

            modal.classList.remove("show");

        });

    document.getElementById("newsletterCover")
        ?.addEventListener("change", e => {

            const file = e.target.files[0];

            if (!file) return;

            const preview = document.getElementById("newsletterPreview");

            preview.src = URL.createObjectURL(file);

            preview.style.display = "block";

        });

    document.getElementById("newsletterForm")
        ?.addEventListener("submit", saveNewsletter);

}

// ==========================================
// LOAD NEWSLETTERS
// ==========================================

async function loadNewsletters() {

    try {

        const newsletters = await fetchTable("newsletters");

        const table = document.getElementById("newsletterTable");

        table.innerHTML = "";

        newsletters.forEach(newsletter => {

            table.innerHTML += `

            <tr>

                <td>

                    <img src="${newsletter.cover_image || ""}" width="70">

                </td>

                <td>

                    ${newsletter.title}

                </td>

                <td>

                    <a href="${newsletter.pdf_url}"
                       target="_blank">

                        View PDF

                    </a>

                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteNewsletter(${newsletter.id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

}

// ==========================================
// SAVE NEWSLETTER
// ==========================================

async function saveNewsletter(e){

    e.preventDefault();

    try{

        showLoader();

        const title =
            document.getElementById("newsletterTitle").value.trim();

        const coverFile =
            document.getElementById("newsletterCover").files[0];

        const pdfFile =
            document.getElementById("newsletterPdf").files[0];

        if(!pdfFile){

            showToast("Please select a PDF","error");

            return;

        }

        let cover = "";

        if(coverFile){

            cover = await uploadFile(
                "newsletters",
                coverFile
            );

        }

        const pdf = await uploadFile(
            "newsletters",
            pdfFile
        );

        await insertRow(
            "newsletters",
            {

                title,

                cover_image:cover,

                pdf_url:pdf

            }
        );

        showToast("Newsletter uploaded");

        document
            .getElementById("newsletterModal")
            .classList
            .remove("show");

        await loadNewsletters();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}

// ==========================================
// DELETE NEWSLETTER
// ==========================================

async function deleteNewsletter(id){

    if(!confirm("Delete newsletter?"))

        return;

    try{

        showLoader();

        await deleteRow(
            "newsletters",
            id
        );

        showToast("Newsletter deleted");

        await loadNewsletters();

        await loadDashboard();

    }

    catch(err){

        console.error(err);

        showToast(err.message,"error");

    }

    finally{

        hideLoader();

    }

}
