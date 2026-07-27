/*
=========================================
PRISM DEPARTMENT PAGE
=========================================
*/

async function loadFacultyMembers() {

    const faculty = await getFaculty();

    const grid = document.getElementById("facultyGrid");

    if (!grid) return;

    grid.innerHTML = "";

    faculty.forEach(member => {

        grid.innerHTML += `

        <div class="member-card">

            <img
    src="${member.image_url}"
    alt="${member.name}"
    style="width:120px;height:120px;border-radius:50%;border:3px solid red;">

            <h3>${member.name}</h3>

            <h4>${member.designation}</h4>

        </div>

        `;

    });

}

document.addEventListener("DOMContentLoaded", () => {

    loadFacultyMembers();

});
