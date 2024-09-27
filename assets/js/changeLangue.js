
var button_changeLangue = document.getElementById("changeLangue");

if (localStorage.getItem("lng")) {
    var currentLang = localStorage.getItem("lng");
    button_changeLangue.innerHTML = currentLang;
}
else{
    var currentLang = 'ENG'; 
    localStorage.setItem("lng", currentLang);
    button_changeLangue.innerHTML = currentLang;
}


const translations = {
    'FRS': translationsFR,
    'ENG': transaltionsEN
};



function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lng", lang);

    button_changeLangue.innerHTML = lang;
    
    
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach((element) => {
        const key = element.getAttribute('data-key');
        element.textContent = translations[lang][key] || key;
    });

    

}


button_changeLangue.addEventListener("click",()=>{
    if (currentLang == "ENG") {
        changeLanguage("FRS");
    }
    else{
        changeLanguage("ENG");
    }
})

// Chargement initial de la langue par défaut
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
});