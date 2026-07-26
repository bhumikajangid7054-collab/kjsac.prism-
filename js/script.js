// ===========================
// PRISM Website Script
// ===========================

document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // Data Labs Accordion
    // ===========================

    const accordionButtons = document.querySelectorAll(".accordion-btn");

    accordionButtons.forEach(button => {

        button.addEventListener("click", () => {

            const content = button.nextElementSibling;

            document.querySelectorAll(".accordion-content").forEach(item => {

                if(item !== content){

                    item.classList.remove("active");

                }

            });

            content.classList.toggle("active");

        });

    });

    // ===========================
    // Data Labs Search
    // ===========================

    const searchBox = document.getElementById("searchBox");

    if(searchBox){

        searchBox.addEventListener("keyup", function(){

            const value = this.value.toLowerCase();

            const cards = document.querySelectorAll(".search-item");

            cards.forEach(card=>{

                const text = card.innerText.toLowerCase();

                card.style.display = text.includes(value)
                ? "block"
                : "none";

            });

        });

    }

    // ===========================
    // Smooth Scroll
    // ===========================

    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            e.preventDefault();

            const target=document.querySelector(this.getAttribute("href"));

            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

});
