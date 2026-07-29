// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

// Replace these with your actual project values
const SUPABASE_URL = "https://tzabdsmfesbttzmmqtzn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6YWJkc21mZXNidHR6bW1xdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzA0MzcsImV4cCI6MjEwMDY0NjQzN30.3yyWogU5ScNEX39DcpfI_dgtSIUGJ87WVo2kp_Tzwq8";

// Create client
const { createClient } = window.supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;
);
alert("window.supabase = " + typeof window.supabase);
alert("createClient = " + typeof window.supabase.createClient);
alert("client = " + typeof supabase);
alert("auth = " + typeof supabase.auth);
// ==========================================
// AUTH HELPERS
// ==========================================

async function getCurrentUser() {
    const { data, error } = await window.supabaseClient.auth.getUser()

    if (error) {
        console.error(error);
        return null;
    }

    return data.user;
}

async function signOut() {
    await window.supabaseClient.auth.signOut()
}

// ==========================================
// STORAGE HELPERS
// ==========================================

async function uploadFile(bucket, file, path = "") {

    if (!file) return null;

    const filename = `${Date.now()}_${file.name}`;

    const filePath = path
        ? `${path}/${filename}`
        : filename;

    const { error } = await window.supabaseClient.storage
        .from(bucket)
        .upload(filePath, file, {
            upsert: true
        });

    if (error) throw error;

    const { data } = window.supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

async function deleteFile(bucket, filePath) {

    if (!filePath) return;

    const parts = filePath.split(`/${bucket}/`);

    if (parts.length < 2) return;

    await window.supabaseClient.storage
        .from(bucket)
        .remove([parts[1]]);
}

// ==========================================
// DATABASE HELPERS
// ==========================================

async function fetchTable(table) {

    const { data, error } = await window.supabaseClient
    .from(table)
        .select("*")
        .order("id", { ascending: false });

    if (error) throw error;

    return data;
}

async function insertRow(table, values) {

    const { error } = await window.supabaseClient
    .from(table)
        .insert(values);

    if (error) throw error;
}

async function updateRow(table, id, values) {

    const { error } = window.supabaseClient
    .from(table)
        .update(values)
        .eq("id", id);

    if (error) throw error;
}

async function deleteRow(table, id) {

    const { error } = window.supabaseClient
    .from(table)
        .delete()
        .eq("id", id);

    if (error) throw error;
}

// ==========================================
// UI HELPERS
// ==========================================

function showLoader() {
    document.getElementById("loader")?.classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader")?.classList.add("hidden");
}

function showToast(message, type = "success") {

    const container = document.getElementById("toastContainer");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
