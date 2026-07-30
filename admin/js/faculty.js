// ======================================
// FACULTY MODULE - PART 1
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    initializeFaculty();

});

function initializeFaculty() {

    loadFaculty();

}

// ======================================
// LOAD FACULTY
// ======================================

async function loadFaculty() {

    const container = document.getElementById("facultyContainer");

    if (!container) return;

    showLoader();

    try {

        const { data, error } = await window.supabaseClient
            .from("faculty")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {

            container.innerHTML = `
                <p>No faculty members found.</p>
            `;

            return;

        }

        container.innerHTML = "";

        data.forEach(member => {

            container.innerHTML += `

                <div class="faculty-card">

                    <img
                        src="${member.image_url}"
                        alt="${member.name}"
                        class="faculty-image">

                    <div class="faculty-details">

                        <h3>${member.name}</h3>

                        <p><strong>${member.designation}</strong></p>

                        <p>${member.subtitle}</p>

                        <div class="faculty-actions">

                            <button onclick="editFaculty(${member.id})">
                                Edit
                            </button>

                            <button onclick="deleteFaculty(${member.id})">
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            `;

        });

    } catch (err) {

        console.error(err);

        showToast("Unable to load faculty.", "error");

    } finally {

        hideLoader();

    }

}

// ======================================
// PLACEHOLDERS
// ======================================

function editFaculty(id) {

    showToast("Edit will be added in Part 4.");

}

function deleteFaculty(id) {

    showToast("Delete will be added in Part 5.");

}

