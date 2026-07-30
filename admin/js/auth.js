// ======================================
// PRISM ADMIN AUTH
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (form) {
        initializeLogin();
    }

});

function showLoader() {
    document.getElementById("loader")?.classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader")?.classList.add("hidden");
}

function showToast(message, type = "success") {

    const container = document.getElementById("toastContainer");

    if (!container) {
        alert(message);
        return;
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function initializeLogin() {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        showLoader();

        try {

            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) throw error;

            showToast("Login successful!");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } catch (err) {

            console.error(err);

            showToast(err.message, "error");

        } finally {

            hideLoader();

        }

    });

}
