// ======================================
// PRISM ADMIN DASHBOARD
// ======================================

document.addEventListener("DOMContentLoaded", async () => {
    await initializeDashboard();
});

async function initializeDashboard() {

    const isLoggedIn = await checkSession();

    if (!isLoggedIn) return;

    setupNavigation();
    setupLogout();
    await loadDashboardStats();

}

// ======================================
// AUTHENTICATION
// ======================================

async function checkSession() {

    try {

        const { data, error } =
            await window.supabaseClient.auth.getSession();

        if (error) {
            console.error(error);
            location.replace("login.html");
            return false;
        }

        if (!data.session) {
            location.replace("login.html");
            return false;
        }

        return true;

    } catch (err) {

        console.error(err);
        location.replace("login.html");
        return false;

    }

}

// ======================================
// LOGOUT
// ======================================

function setupLogout() {

    const btn = document.getElementById("logoutBtn");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        await window.supabaseClient.auth.signOut();

        location.replace("login.html");

    });

}

// ======================================
// SIDEBAR NAVIGATION
// ======================================

function setupNavigation() {

    const buttons = document.querySelectorAll(".sidebar button");
    const sections = document.querySelectorAll(".content-section");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            if (button.id === "logoutBtn") return;

            buttons.forEach(b => b.classList.remove("active"));

            button.classList.add("active");

            const target =
                button.dataset.section;

            sections.forEach(section => {

                section.classList.remove("active");

            });

            const activeSection =
                document.getElementById(target);

            if (activeSection) {

                activeSection.classList.add("active");

            }

        });

    });

}

// ======================================
// DASHBOARD STATS
// ======================================

async function loadDashboardStats() {

    try {

        showLoader();

        const [
            faculty,
            datalabs,
            events,
            newsletters
        ] = await Promise.all([

            window.supabaseClient
                .from("faculty")
                .select("*", { count: "exact", head: true }),

            window.supabaseClient
                .from("datalabs")
                .select("*", { count: "exact", head: true }),

            window.supabaseClient
                .from("events")
                .select("*", { count: "exact", head: true }),

            window.supabaseClient
                .from("newsletters")
                .select("*", { count: "exact", head: true })

        ]);

        if (document.getElementById("facultyCount"))
            document.getElementById("facultyCount").textContent =
                faculty.count ?? 0;

        if (document.getElementById("datalabsCount"))
            document.getElementById("datalabsCount").textContent =
                datalabs.count ?? 0;

        if (document.getElementById("eventsCount"))
            document.getElementById("eventsCount").textContent =
                events.count ?? 0;

        if (document.getElementById("newslettersCount"))
            document.getElementById("newslettersCount").textContent =
                newsletters.count ?? 0;

    } catch (err) {

        console.error(err);

        showToast("Failed to load dashboard", "error");

    } finally {

        hideLoader();

    }

}
