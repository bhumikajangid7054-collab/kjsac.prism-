// ======================================
// FACULTY MODULE
// ======================================

let editingFacultyId = null;

document.addEventListener("DOMContentLoaded", () => {

    initializeFaculty();

});

function initializeFaculty() {

    const addBtn = document.getElementById("addFacultyBtn");

    const cancelBtn = document.getElementById("cancelFaculty");

    const form = document.getElementById("facultyForm");

    if (addBtn) {

        addBtn.addEventListener("click", openFacultyModal);

    }

    if (cancelBtn) {

        cancelBtn.addEventListener("click", closeFacultyModal);

    }

    if (form) {

        form.addEventListener("submit", saveFaculty);

    }

}

function openFacultyModal() {

    editingFacultyId = null;

    document.getElementById("facultyForm").reset();

    document.getElementById("facultyModalTitle").textContent =
        "Add Faculty";

    document.getElementById("facultyModal")
        .classList.remove("hidden");

}

function closeFacultyModal() {

    document.getElementById("facultyModal")
        .classList.add("hidden");

}
async function saveFaculty(event) {

    event.preventDefault();

    showToast("Faculty module is connected successfully.");

    closeFacultyModal();

}
