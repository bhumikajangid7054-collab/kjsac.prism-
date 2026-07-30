// ======================================
// PRISM ADMIN UI HELPERS
// ======================================

function showLoader() {

    document
        .getElementById("loader")
        ?.classList.remove("hidden");

}

function hideLoader() {

    document
        .getElementById("loader")
        ?.classList.add("hidden");

}

function showToast(message, type = "success") {

    const container =
        document.getElementById("toastContainer");

    if (!container) {

        alert(message);

        return;

    }

    const toast =
        document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

function $(id){

    return document.getElementById(id);

}

function createElement(tag, className=""){

    const el =
        document.createElement(tag);

    if(className){

        el.className = className;

    }

    return el;

}
