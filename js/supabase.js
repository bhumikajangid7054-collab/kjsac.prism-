// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

// Replace these with your actual project values
const SUPABASE_URL = "https://tzabdsmfesbttzmmqtzn.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6YWJkc21mZXNidHR6bW1xdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzA0MzcsImV4cCI6MjEwMDY0NjQzN30.3yyWogU5ScNEX39DcpfI_dgtSIUGJ87WVo2kp_Tzwq8";

// Create client
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ==========================================
// AUTH HELPERS
// ==========================================

async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error(error);
        return null;
    }

    return data.user;
}

async function signOut() {
    await supabase.auth.signOut();
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

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            upsert: true
        });

    if (error) throw error;

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

async function deleteFile(bucket, filePath) {

    if (!filePath) return;

    const parts = filePath.split(`/${bucket}/`);

    if (parts.length < 2) return;

    await supabase.storage
        .from(bucket)
        .remove([parts[1]]);
}

// ==========================================
// DATABASE HELPERS
// ==========================================

async function fetchTable(table) {

    const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("id", { ascending: false });

    if (error) throw error;

    return data;
}

async function insertRow(table, values) {

    const { error } = await supabase
        .from(table)
        .insert(values);

    if (error) throw error;
}

async function updateRow(table, id, values) {

    const { error } = await supabase
        .from(table)
        .update(values)
        .eq("id", id);

    if (error) throw error;
}

async function deleteRow(table, id) {

    const { error } = await supabase
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
