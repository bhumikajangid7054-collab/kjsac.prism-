// ===========================================
// PRISM - Supabase Configuration
// Department of Political Science
// K. J. Somaiya College of Arts & Commerce
// ===========================================

// STEP 1:
// Replace these with your own Supabase Project URL
// and Publishable (Anon) Key.

const SUPABASE_URL = "https://tzabdsmfesbttzmmqtzn.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_cVv8S6VexH6_DUfHLtytHQ_Zy7CT4YL";


// ===========================================
// DO NOT EDIT BELOW THIS LINE
// ===========================================

// Supabase Client
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ===========================================
// Authentication
// ===========================================

// Login
async function login(email, password){

    const { data, error } =
    await supabase.auth.signInWithPassword({

        email: email,

        password: password

    });

    if(error){

        throw error;

    }

    return data;

}


// Logout
async function logout(){

    await supabase.auth.signOut();

    window.location.href = "login.html";

}


// Get Current User
async function getCurrentUser(){

    const {

        data:{user}

    } = await supabase.auth.getUser();

    return user;

}


// Protect Admin Pages
async function protectPage(){

    const user = await getCurrentUser();

    if(!user){

        window.location.href = "login.html";

    }

}


// ===========================================
// EVENTS
// ===========================================

// Get Events
async function getEvents(){

    const {data,error} = await supabase

    .from("events")

    .select("*")

    .order("created_at",{ascending:false});

    if(error){

        console.error(error);

        return [];

    }

    return data;

}


// Add Event
async function addEvent(event){

    const {error} = await supabase

    .from("events")

    .insert([event]);

    if(error){

        alert(error.message);

    }

}


// Delete Event
async function deleteEvent(id){

    const {error}=await supabase

    .from("events")

    .delete()

    .eq("id",id);

    if(error){

        alert(error.message);

    }

}


// ===========================================
// NEWSLETTERS
// ===========================================

async function getNewsletters(){

    const {data,error}=await supabase

    .from("newsletters")

    .select("*")

    .order("created_at",{ascending:false});

    if(error){

        return [];

    }

    return data;

}


async function addNewsletter(newsletter){

    const {error}=await supabase

    .from("newsletters")

    .insert([newsletter]);

    if(error){

        alert(error.message);

    }

}


// ===========================================
// DATALABS
// ===========================================

async function getResearch(){

    const {data,error}=await supabase

    .from("datalabs")

    .select("*")

    .order("created_at",{ascending:false});

    if(error){

        return [];

    }

    return data;

}


async function addResearch(item){

    const {error}=await supabase

    .from("datalabs")

    .insert([item]);

    if(error){

        alert(error.message);

    }

}


// ===========================================
// FACULTY
// ===========================================

async function getFaculty(){

    const {data,error}=await supabase

    .from("faculty")

    .select("*")

    .order("created_at",{ascending:false});

    if(error){

        return [];

    }

    return data;

}


async function addFaculty(member){

    const {error}=await supabase

    .from("faculty")

    .insert([member]);

    if(error){

        alert(error.message);

    }

}


// ===========================================
// ANNOUNCEMENTS
// ===========================================

async function getAnnouncements(){

    const {data,error}=await supabase

    .from("announcements")

    .select("*")

    .order("created_at",{ascending:false});

    if(error){

        return [];

    }

    return data;

}


async function addAnnouncement(item){

    const {error}=await supabase

    .from("announcements")

    .insert([item]);

    if(error){

        alert(error.message);

    }

}


// ===========================================
// STORAGE
// ===========================================

// Upload Image

async function uploadImage(file,bucket){

    const filename =

    Date.now()+"-"+file.name;

    const {error}=await supabase

    .storage

    .from(bucket)

    .upload(filename,file);

    if(error){

        throw error;

    }

    const {

        data

    } = supabase

    .storage

    .from(bucket)

    .getPublicUrl(filename);

    return data.publicUrl;

}
