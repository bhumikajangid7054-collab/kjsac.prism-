// ======================================
// PRISM ADMIN DASHBOARD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.body.dataset.page !== "dashboard") return;

    initializeDashboard();

});

async function checkSession() {

    const { data: sessionData } =
        await window.supabaseClient.auth.getSession();

    if (!sessionData.session) {

        window.location.href = "login.html";
        return;

    }

}

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
