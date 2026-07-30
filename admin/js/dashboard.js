// ==========================================
// PRISM ADMIN PANEL
// dashboard.js
// ==========================================

const db = window.supabaseClient;

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});

// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

async function initializeDashboard() {

    initializeNavigation();

    await loadDashboardStats();

}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

function initializeNavigation() {

    const navItems = document.querySelectorAll(".nav-item");

    const sections = document.querySelectorAll(".content-section");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navItems.forEach(nav => {

                nav.classList.remove("active");

            });

            item.classList.add("active");

            sections.forEach(section => {

                section.classList.remove("active");

            });

            const target = item.dataset.section;

            const activeSection = document.getElementById(target);

            if (activeSection) {

                activeSection.classList.add("active");

            }

        });

    });

}

// ==========================================
// DASHBOARD COUNTS
// ==========================================

async function loadDashboardStats() {

    showLoader();

    try {

        const [
            faculty,
            datalabs,
            events,
            newsletters
        ] = await Promise.all([

            getTableCount(TABLES.faculty),

            getTableCount(TABLES.datalabs),

            getTableCount(TABLES.events),

            getTableCount(TABLES.newsletters)

        ]);

        setCount("facultyCount", faculty);

        setCount("datalabsCount", datalabs);

        setCount("eventsCount", events);

        setCount("newslettersCount", newsletters);

    }

    catch (err) {

        console.error(err);

        showToast(
            "Failed to load dashboard.",
            "error"
        );

    }

    hideLoader();

}

// ==========================================
// COUNT HELPER
// ==========================================

async function getTableCount(table) {

    const {

        count,
        error

    } = await db

        .from(table)

        .select("*", {

            count: "exact",

            head: true

        });

    if (error) {

        console.error(error);

        return 0;

    }

    return count || 0;

}

// ==========================================
// UPDATE CARD
// ==========================================

function setCount(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value;

}

// ==========================================
// REFRESH DASHBOARD
// ==========================================

window.refreshDashboard = async function () {

    await loadDashboardStats();

};

// ==========================================
// AUTO REFRESH AFTER CRUD
// ==========================================

window.updateDashboardCounts = function () {

    loadDashboardStats();

};

// ==========================================
// PAGE VISIBILITY REFRESH
// ==========================================

document.addEventListener(

    "visibilitychange",

    () => {

        if (!document.hidden) {

            loadDashboardStats();

        }

    }

);

// ==========================================
// KEYBOARD SHORTCUT
// CTRL + R (Dashboard Only)
// ==========================================

document.addEventListener(

    "keydown",

    e => {

        if (

            e.ctrlKey &&

            e.key.toLowerCase() === "r"

        ) {

            e.preventDefault();

            loadDashboardStats();

        }

    }

);
