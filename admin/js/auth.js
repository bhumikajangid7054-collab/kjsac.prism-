alert("auth.js loaded");
// ======================================
// PRISM ADMIN AUTH
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (form) {
        initializeLogin();
    }

});

function initializeLogin() {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        showLoader();

        try {

            const { error } =
                await supabase.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) throw error;

            showToast("Login successful");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (err) {

            console.error(err);

            showToast(err.message, "error");

        } finally {

            hideLoader();

        }

    });

}

