// ==========================================
// PRISM ADMIN PANEL
// datalabs.js
// ==========================================

const datalabClient = window.supabaseClient;

let datalabsData = [];
let editingDataLabId = null;

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeDataLabs();

});

function initializeDataLabs() {

    const addBtn = document.getElementById(
        "addDataLabBtn"
    );

    const form = document.getElementById(
        "dataLabForm"
    );

    if (addBtn) {

        addBtn.addEventListener(
            "click",
            openAddDataLabModal
        );

    }

    if (form) {

        form.addEventListener(
            "submit",
            saveDataLab
        );

    }

    loadDataLabs();

}

// ==========================================
// LOAD DATA LABS
// ==========================================

async function loadDataLabs() {

    showLoader();

    const {

        data,

        error

    } = await datalabClient

        .from(TABLES.datalabs)

        .select("*")

        .order(
            "created_at",
            {
                ascending: false
            }
        );

    hideLoader();

    if (error) {

        console.error(error);

        showToast(
            "Unable to load Data Labs.",
            "error"
        );

        return;

    }

    datalabsData = data || [];

    renderDataLabs();

}

// ==========================================
// RENDER
// ==========================================

function renderDataLabs() {

    const container = document.getElementById(
        "datalabsContainer"
    );

    if (!container) return;

    if (datalabsData.length === 0) {

        container.innerHTML = `

<div class="card">

<h3>No Data Labs Available</h3>

<p class="mt-20">

Click "Add Data Lab"
to create one.

</p>

</div>

`;

        return;

    }

    container.innerHTML = datalabsData

        .map(createDataLabCard)

        .join("");

}

// ==========================================
// CARD
// ==========================================

function createDataLabCard(item) {

    return `

<div class="faculty-card">

<div class="faculty-info">

<h3>

${item.title}

</h3>

<p>

<strong>

Category:

</strong>

${item.category}

</p>

<p>

${item.description}

</p>

<p>

${formatDate(item.created_at)}

</p>

<div class="card-actions">

<a

href="${item.file_url}"

target="_blank"

class="edit-btn">

Open File

</a>

<button

class="edit-btn"

onclick="editDataLab(${item.id})">

Edit

</button>

<button

class="delete-btn"

onclick="deleteDataLab(${item.id})">

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

function openAddDataLabModal() {

    editingDataLabId = null;

    resetForm("dataLabForm");

    document.getElementById(
        "dataLabModalTitle"
    ).textContent = "Add Data Lab";

    document.getElementById(
        "dataLabId"
    ).value = "";

    openModal("dataLabModal");

}

window.editDataLab = editDataLab;

window.deleteDataLab = deleteDataLab;

// ==========================================
// EDIT DATA LAB
// ==========================================

async function editDataLab(id) {

    const item = datalabsData.find(
        lab => lab.id === id
    );

    if (!item) return;

    editingDataLabId = id;

    document.getElementById(
        "dataLabModalTitle"
    ).textContent = "Edit Data Lab";

    document.getElementById(
        "dataLabId"
    ).value = item.id;

    document.getElementById(
        "dataLabCategory"
    ).value = item.category || "";

    document.getElementById(
        "dataLabTitle"
    ).value = item.title || "";

    document.getElementById(
        "dataLabDescription"
    ).value = item.description || "";

    openModal("dataLabModal");

}

// ==========================================
// SAVE DATA LAB
// ==========================================

async function saveDataLab(e) {

    e.preventDefault();

    showLoader();

    try {

        const category = document.getElementById(
            "dataLabCategory"
        ).value.trim();

        const title = document.getElementById(
            "dataLabTitle"
        ).value.trim();

        const description = document.getElementById(
            "dataLabDescription"
        ).value.trim();

        const fileInput = document.getElementById(
            "dataLabFile"
        );

        let fileUrl = null;

        // Upload new file

        if (
            fileInput &&
            fileInput.files.length > 0
        ) {

            fileUrl = await uploadDataLabFile(
                fileInput.files[0]
            );

        }

        // Keep previous file while editing

        if (
            !fileUrl &&
            editingDataLabId
        ) {

            const existing = datalabsData.find(
                lab => lab.id === editingDataLabId
            );

            fileUrl =
                existing?.file_url || null;

        }

        const payload = {

            category,

            title,

            description,

            file_url: fileUrl

        };

        let response;

        if (editingDataLabId) {

            response = await datalabClient

                .from(TABLES.datalabs)

                .update(payload)

                .eq(
                    "id",
                    editingDataLabId
                );

        } else {

            response = await datalabClient

                .from(TABLES.datalabs)

                .insert(payload);

        }

        if (response.error) {

            throw response.error;

        }

        showToast(

            editingDataLabId
                ? "Data Lab updated successfully."
                : "Data Lab added successfully.",

            "success"

        );

        closeModal("dataLabModal");

        resetForm("dataLabForm");

        editingDataLabId = null;

        await loadDataLabs();

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
// UPLOAD FILE
// ==========================================

async function uploadDataLabFile(file) {

    const extension =
        file.name.split(".").pop();

    const fileName =

        Date.now() +

        "_" +

        Math.random()
            .toString(36)
            .substring(2, 8) +

        "." +

        extension;

    const { error } = await datalabClient.storage

        .from(BUCKETS.documents)

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

    const { data } = datalabClient.storage

        .from(BUCKETS.documents)

        .getPublicUrl(fileName);

    return data.publicUrl;

}

// ==========================================
// DELETE DATA LAB
// ==========================================

async function deleteDataLab(id) {

    const confirmed = confirmDelete(
        "Are you sure you want to delete this Data Lab?"
    );

    if (!confirmed) return;

    showLoader();

    try {

        const item = datalabsData.find(
            lab => lab.id === id
        );

        if (!item) {

            throw new Error(
                "Data Lab not found."
            );

        }

        const { error } = await datalabClient

            .from(TABLES.datalabs)

            .delete()

            .eq("id", id);

        if (error) {

            throw error;

        }

        // Delete file from Storage

        if (item.file_url) {

            try {

                const fileName = item.file_url

                    .split("/")

                    .pop();

                if (fileName) {

                    await datalabClient.storage

                        .from(BUCKETS.documents)

                        .remove([fileName]);

                }

            } catch (storageError) {

                console.warn(
                    "Unable to delete document.",
                    storageError
                );

            }

        }

        showToast(
            "Data Lab deleted successfully.",
            "success"
        );

        await loadDataLabs();

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
// MODAL CLEANUP
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const closeBtn = document.getElementById(
            "closeDataLabModal"
        );

        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                () => {

                    editingDataLabId = null;

                    resetForm("dataLabForm");

                }
            );

        }

    }
);

// ==========================================
// REFRESH
// ==========================================

window.refreshDataLabs = async function () {

    await loadDataLabs();

};

// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.loadDataLabs =
    loadDataLabs;

window.openAddDataLabModal =
    openAddDataLabModal;

window.saveDataLab =
    saveDataLab;

window.editDataLab =
    editDataLab;

window.deleteDataLab =
    deleteDataLab;

// ==========================================
// END OF FILE
// ==========================================
