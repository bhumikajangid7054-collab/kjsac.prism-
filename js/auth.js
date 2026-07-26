// ===========================================
// PRISM Authentication
// ===========================================

// Login user
async function loginUser(email, password) {

    try {

        await login(email, password);

        window.location.href = "dashboard.html";

    } catch (error) {

        alert(error.message);

    }

}

// Logout user
async function logoutUser() {

    await logout();

}

// Check if user is logged in
async function checkLogin() {

    const user = await getCurrentUser();

    if (!user) {

        window.location.href = "login.html";

    }

}

// Show current user email
async function showUser(id) {

    const user = await getCurrentUser();

    if (!user) return;

    const element = document.getElementById(id);

    if (element) {

        element.innerText = user.email;

    }

}
