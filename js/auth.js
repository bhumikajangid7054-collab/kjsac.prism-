// ==========================================
// ADMIN AUTH
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Login Page
    if (document.getElementById("loginForm")) {
        initializeLogin();
    }

    // Dashboard
    if (document.body.dataset.page === "dashboard") {
        protectDashboard();
        setupLogout();
    }

});

// ==========================================
// LOGIN
// ==========================================

function initializeLogin() {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

alert("Login button clicked");
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

try {

    showLoader();

    alert("Before signIn");

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    alert("After signIn");

    if (error) throw error;

    showToast("Login successful");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 700);

} catch (err) {

    console.error(err);

    alert(err.message);

} finally {

    hideLoader();

}

    });

}

// ==========================================
// SESSION CHECK
// ==========================================

async function protectDashboard() {

    const user = await getCurrentUser();

    if (!user) {

        window.location.href = "login.html";

        return;

    }

}

// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {

    const btn = document.getElementById("logoutBtn");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        await signOut();

        window.location.href = "login.html";

    });

}
