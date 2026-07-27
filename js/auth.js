/*
=========================================
PRISM ADMIN AUTHENTICATION
=========================================
*/

/*
=========================================
LOGIN
=========================================
*/

async function login(email, password) {

    const { error } = await supabase.auth.signInWithPassword({

        email: email,

        password: password

    });

    if (error) {

        alert(error.message);

        return false;

    }

    window.location.href = "dashboard.html";

    return true;

}

/*
=========================================
LOGOUT
=========================================
*/

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "login.html";

}

/*
=========================================
CURRENT USER
=========================================
*/

async function getCurrentUser() {

    const {

        data: {

            user

        }

    } = await supabase.auth.getUser();

    return user;

}

/*
=========================================
PROTECT DASHBOARD
=========================================
*/

async function protectDashboard() {

    const user = await getCurrentUser();

    if (!user) {

        window.location.href = "login.html";

    }

}

/*
=========================================
REDIRECT IF LOGGED IN
=========================================
*/

async function redirectIfLoggedIn() {

    const user = await getCurrentUser();

    if (user) {

        window.location.href = "dashboard.html";

    }

}
