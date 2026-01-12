const loginBtn = document.getElementById("loginBtn");
const userTypeSelect = document.getElementById("userType");
const clientPanel = document.getElementById("clientPanel");
const vetPanel = document.getElementById("vetPanel");
const loginPanel = document.querySelector(".login-panel");

const calendarBtn = document.getElementById("calendarBtn");
const calendarPanel = document.getElementById("calendarPanel");
const backToVet = document.getElementById("backToVet");

const calendarpatientsBtnBtn = document.getElementById("patientsBtn");
const patientsPanel = document.getElementById("patientsPanel");
const backToVet1 = document.getElementById("backToVet1");

const FidoBtn = document.getElementById("FidoBtn");
const KittyBtn = document.getElementById("KittyBtn");
const MaxBtn = document.getElementById("MaxBtn");
const LunaBtn = document.getElementById("LunaBtn");

loginBtn.addEventListener("click", () => { 
    const type = userTypeSelect.value;
    loginPanel.classList.add("hidden");

    if(type === "client") { 
        clientPanel.classList.remove("hidden");
        clientPanel.classList.add("show"); 
    } else if(type === "vet") { 
        vetPanel.classList.remove("hidden"); 
        vetPanel.classList.add("show"); 
    } 
});

// KALENDARZ
calendarBtn.addEventListener("click", () => {
    vetPanel.classList.add("hidden");
    calendarPanel.classList.remove("hidden");
    calendarPanel.classList.add("show");
});

// POWRÓT DO VET PANEL
backToVet.addEventListener("click", () => {
    calendarPanel.classList.add("hidden");
    vetPanel.classList.remove("hidden");
    vetPanel.classList.remove("show");
});

// PACJENCI
patientsBtn.addEventListener("click", () => {
    vetPanel.classList.add("hidden");
    patientsPanel.classList.remove("hidden");
    patientsPanel.classList.add("show");
});

[FidoBtn, KittyBtn, MaxBtn, LunaBtn].forEach(btn => {
    btn.addEventListener("click", () => {
        alert(`Wybrano pacjenta: ${btn.textContent}`);
    });
});

// POWRÓT DO VET PANEL
backToVet1.addEventListener("click", () => {
    patientsPanel.classList.add("hidden");
    vetPanel.classList.remove("hidden");
    vetPanel.classList.remove("show");
});


