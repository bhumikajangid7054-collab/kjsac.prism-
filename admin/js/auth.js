// ==========================================
// PRISM ADMIN PANEL
// auth.js
// ==========================================

const client = window.supabaseClient;

document.addEventListener("DOMContentLoaded", initializeAuth);

async function initializeAuth() {
    const isLoginPage = window.location.pathname.endsWith("login.html");

    try {
        const {
            data: { session },
            error
        } = await client.auth.getSession();

        if (error) {
            console.error(error);
        }

        // LOGIN PAGE
        if (isLoginPage) {

            if (session) {
                window.location.replace("dashboard.html");
                return;
            }

            const loginForm = document.getElementById("loginForm");

            if (loginForm) {
                loginForm.addEventListener("submit", loginUser);
            }

            return;
        }

        // PROTECTED PAGES
        if (!session) {
            window.location.replace("login.html");
            return;
        }

        const logoutBtn = document.getElementById("logoutBtn");

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logoutUser);
        }

    } catch (err) {
        console.error(err);
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

    try {

        const { error } = await client.auth.signInWithPassword({
            email,
            password
        });

        hideLoader();

        if (error) {
            showToast(error.message, "error");
            return;
        }

        showToast("Login successful", "success");

        window.location.replace("dashboard.html");

    } catch (err) {

        hideLoader();
        console.error(err);
        showToast("Unable to login.", "error");

    }

}

// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    if (!confirm("Are you sure you want to logout?")) return;

    showLoader();

    try {

        await client.auth.signOut();

    } finally {

        hideLoader();
        window.location.replace("login.html");

    }

}

// ==========================================
// AUTH STATE LISTENER
// ==========================================

client.auth.onAuthStateChange((_event, session) => {

    const isLoginPage = window.location.pathname.endsWith("login.html");

    if (!session && !isLoginPage) {
        window.location.replace("login.html");
    }

    if (session && isLoginPage) {
        window.location.replace("dashboard.html");
    }

});
