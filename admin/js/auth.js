// ==========================================
// PRISM ADMIN PANEL
// auth.js
// ==========================================

const client = window.supabaseClient;

document.addEventListener("DOMContentLoaded", () => {
    initializeAuth();
});

async function initializeAuth() {

    const isLoginPage = window.location.pathname.includes("login.html");

    const {
        data: { session }
    } = await client.auth.getSession();

    // -----------------------------
    // LOGIN PAGE
    // -----------------------------

    if (isLoginPage) {

        if (session) {
            window.location.href = "dashboard.html";
            return;
        }

        const loginForm = document.getElementById("loginForm");

        if (loginForm) {

            loginForm.addEventListener("submit", loginUser);

        }

        return;
    }

    // -----------------------------
    // DASHBOARD
    // -----------------------------

    if (!session) {

        window.location.href = "login.html";
        return;

    }

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", logoutUser);

    }

}

// ==========================================
// LOGIN
// ==========================================

async function loginUser(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    showLoader();

    const { error } = await client.auth.signInWithPassword({

        email,
        password

    });

    hideLoader();

    if (error) {

        showToast(error.message, "error");
        return;

    }

    showToast("Login Successful", "success");

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 700);

}

// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    showLoader();

    await client.auth.signOut();

    hideLoader();

    window.location.href = "login.html";

}

// ==========================================
// AUTH STATE LISTENER
// ==========================================

client.auth.onAuthStateChange((event, session) => {

    const isLoginPage =
        window.location.pathname.includes("login.html");

    if (!session && !isLoginPage) {

        window.location.href = "login.html";

    }

    if (session && isLoginPage) {

        window.location.href = "dashboard.html";

    }

});
