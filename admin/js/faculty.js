// ==========================================
// PRISM ADMIN PANEL
// faculty.js
// ==========================================

const client = window.supabaseClient;

let facultyData = [];

let editingFacultyId = null;

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeFaculty();

});

function initializeFaculty() {

    const addBtn = document.getElementById("addFacultyBtn");

    const form = document.getElementById("facultyForm");

    if (addBtn) {

        addBtn.addEventListener("click", openAddFacultyModal);

    }

    if (form) {

        form.addEventListener("submit", saveFaculty);

    }

    loadFaculty();

}

// ==========================================
// LOAD FACULTY
// ==========================================

async function loadFaculty() {

    showLoader();

    const {

        data,

        error

    } = await client

        .from(TABLES.faculty)

        .select("*")

        .order("created_at", {

            ascending: false

        });

    hideLoader();

    if (error) {

        console.error(error);

        showToast(

            "Unable to load faculty.",

            "error"

        );

        return;

    }

    facultyData = data || [];

    renderFaculty();

}

// ==========================================
// RENDER
// ==========================================

function renderFaculty() {

    const container = document.getElementById(

        "facultyContainer"

    );

    if (!container) return;

    if (facultyData.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h3>No Faculty Found</h3>

                <p class="mt-20">

                    Click "Add Faculty" to create
                    your first faculty member.

                </p>

            </div>

        `;

        return;

    }

    container.innerHTML = facultyData

        .map(member => createFacultyCard(member))

        .join("");

}

// ==========================================
// CARD
// ==========================================

function createFacultyCard(member) {

    return `

<div class="faculty-card">

<img
src="${member.image_url || ''}"
alt="${member.name}">

<div class="faculty-info">

<h3>${member.name}</h3>

<p>

<strong>${member.designation}</strong>

</p>

<p>

${member.subtitle || ""}

</p>

<div class="card-actions">

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

</div>

</div>

</div>

`;

}

// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddFacultyModal() {

    editingFacultyId = null;

    document.getElementById(

        "facultyModalTitle"

    ).textContent = "Add Faculty";

    resetForm("facultyForm");

    document.getElementById(

        "facultyId"

    ).value = "";

    document.getElementById(

        "facultyPreview"

    ).innerHTML = "No Image";

    openModal("facultyModal");

}

window.editFaculty = editFaculty;

window.deleteFaculty = deleteFaculty;
// ==========================================
// EDIT FACULTY
// ==========================================

async function editFaculty(id) {

    const member = facultyData.find(item => item.id === id);

    if (!member) return;

    editingFacultyId = id;

    document.getElementById(
        "facultyModalTitle"
    ).textContent = "Edit Faculty";

    document.getElementById(
        "facultyId"
    ).value = member.id;

    document.getElementById(
        "facultyName"
    ).value = member.name || "";

    document.getElementById(
        "facultyDesignation"
    ).value = member.designation || "";

    document.getElementById(
        "facultySubtitle"
    ).value = member.subtitle || "";

    const preview = document.getElementById(
        "facultyPreview"
    );

    if (member.image_url) {

        preview.innerHTML = `
            <img
            src="${member.image_url}"
            alt="${member.name}">
        `;

    } else {

        preview.innerHTML = "No Image";

    }

    openModal("facultyModal");

}

// ==========================================
// SAVE FACULTY
// ==========================================

async function saveFaculty(e) {

    e.preventDefault();

    showLoader();

    try {

        const name = document
            .getElementById("facultyName")
            .value
            .trim();

        const designation = document
            .getElementById("facultyDesignation")
            .value
            .trim();

        const subtitle = document
            .getElementById("facultySubtitle")
            .value
            .trim();

        const imageInput =
            document.getElementById(
                "facultyImage"
            );

        let imageUrl = null;

        // Upload new image if selected

        if (imageInput.files.length > 0) {

            imageUrl = await uploadFacultyImage(
                imageInput.files[0]
            );

        }

        // Keep existing image while editing

        if (!imageUrl && editingFacultyId) {

            const existing =
                facultyData.find(
                    item => item.id === editingFacultyId
                );

            imageUrl = existing?.image_url || null;

        }

        const payload = {

            name,

            designation,

            subtitle,

            image_url: imageUrl

        };

        let response;

        if (editingFacultyId) {

            response = await client

                .from(TABLES.faculty)

                .update(payload)

                .eq(
                    "id",
                    editingFacultyId
                );

        } else {

            response = await client

                .from(TABLES.faculty)

                .insert(payload);

        }

        if (response.error) {

            throw response.error;

        }

        showToast(

            editingFacultyId
                ? "Faculty updated successfully."
                : "Faculty added successfully.",

            "success"

        );

        closeModal(
            "facultyModal"
        );

        resetForm(
            "facultyForm"
        );

        editingFacultyId = null;

        await loadFaculty();

        updateDashboardCounts();

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
// IMAGE UPLOAD
// ==========================================

async function uploadFacultyImage(file) {

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

    const {

        error

    } = await client.storage

        .from(BUCKETS.faculty)

        .upload(

            fileName,

            file,

            {

                upsert:false

            }

        );

    if (error) {

        throw error;

    }

    const {

        data

    } = client.storage

        .from(BUCKETS.faculty)

        .getPublicUrl(fileName);

    return data.publicUrl;

}
// ==========================================
// DELETE FACULTY
// ==========================================

async function deleteFaculty(id) {

    const confirmed = confirmDelete(
        "Are you sure you want to delete this faculty member?"
    );

    if (!confirmed) return;

    showLoader();

    try {

        const member = facultyData.find(
            item => item.id === id
        );

        if (!member) {

            throw new Error(
                "Faculty not found."
            );

        }

        // Delete database record

        const { error } = await client

            .from(TABLES.faculty)

            .delete()

            .eq("id", id);

        if (error) {

            throw error;

        }

        // Try deleting image from storage
        // (Only works if stored inside your bucket)

        if (member.image_url) {

            try {

                const path = member.image_url.split("/").pop();

                if (path) {

                    await client.storage

                        .from(BUCKETS.faculty)

                        .remove([path]);

                }

            }

            catch(storageError){

                console.warn(
                    "Image could not be deleted.",
                    storageError
                );

            }

        }

        showToast(
            "Faculty deleted successfully.",
            "success"
        );

        await loadFaculty();

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
// CLOSE MODAL AFTER SAVE
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const closeButton = document.getElementById(
            "closeFacultyModal"
        );

        if (closeButton) {

            closeButton.addEventListener(
                "click",

                () => {

                    resetForm("facultyForm");

                    editingFacultyId = null;

                }

            );

        }

    }

);

// ==========================================
// REFRESH FACULTY
// ==========================================

window.refreshFaculty = async function () {

    await loadFaculty();

};

// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.loadFaculty = loadFaculty;

window.openAddFacultyModal =
    openAddFacultyModal;

window.saveFaculty =
    saveFaculty;

// ==========================================
// END OF FILE
// ==========================================
