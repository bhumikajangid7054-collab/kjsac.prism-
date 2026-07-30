// ======================================
// PRISM ADMIN DASHBOARD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.body.dataset.page !== "dashboard") return;

    initializeDashboard();

});

async function initializeDashboard() {

    await checkSession();

    setupNavigation();

    setupLogout();

    await loadDashboardStats();

}
// ======================================
// LOGOUT
// ======================================

function setupLogout() {

    const btn = $("logoutBtn");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        await window.supabaseClient.auth.signOut();

        window.location.href = "login.html";

    });

}
