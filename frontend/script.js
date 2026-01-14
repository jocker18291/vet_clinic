const loginBtn = document.getElementById("loginBtn");
const userTypeSelect = document.getElementById("userType");
const vetPanel = document.getElementById("vetPanel");
const loginPanel = document.querySelector(".login-panel");
const loginInput = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");
const clientPanel = document.getElementById("clientPanel");

let loggedId = null;

const calendarBtn = document.getElementById("calendarBtn");
const calendarPanel = document.getElementById("calendarPanel");
const backToVet = document.getElementById("backToVet");

const patientsBtn = document.getElementById("patientsBtn");
const patientsPanel = document.getElementById("patientsPanel");
const backToVet1 = document.getElementById("backToVet1");

const FidoBtn = document.getElementById("FidoBtn");
const KittyBtn = document.getElementById("KittyBtn");
const MaxBtn = document.getElementById("MaxBtn");
const LunaBtn = document.getElementById("LunaBtn");


// LOGOWANIE

loginBtn.addEventListener("click", async() => {
    const password = passwordInput.value.trim();
    const type = userTypeSelect.value;
 
    try {
        if (type === "client"){
            const email = loginInput.value.trim();
            
            if (!email || !password) {
                alert("Podaj login i hasło");
                return;
            }

           response = await fetch("/api/v1/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
        
        } else if (type === "vet"){
            const login = loginInput.value.trim();
             
             if (!login || !password) {
                alert("Podaj login i hasło");
                return;
            }

           response = await fetch("/api/v1/vet/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password })
            });
       
        }
       
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Błąd logowania");
            return;
        }

    if (type === "client"){
        loggedId = data.user.id;
        
        loginPanel.classList.add("hidden");
        clientPanel.classList.remove("hidden");
        clientPanel.classList.add("show");
    
    } else if (type === "vet"){
        loggedId = data.vet.id;
        
        loginPanel.classList.add("hidden");
        vetPanel.classList.remove("hidden");
        vetPanel.classList.add("show");
    }
    } catch (err) {
        alert(`Błąd połączenia z serwerem: ${err.message}`);
    }
});


// PANEL REJESTRACJI
const registerBtn = document.getElementById("registerBtn");
const registerPanel = document.getElementById("registerPanel");
const backToLoginBtn = document.getElementById("backToLoginBtn");

registerBtn && registerBtn.addEventListener("click", () => {
    loginPanel.classList.add("hidden");
    registerPanel.classList.remove("hidden");
    registerPanel.classList.add("show");
});

// UTWORZENIE KONTA
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regFirstName = document.getElementById("regFirstName");
const regLastName = document.getElementById("regLastName");
const regAddress = document.getElementById("regAddress");
const createAccountBtn = document.getElementById("createAccountBtn");
const userTypeRSelect = document.getElementById("userTypeR");

createAccountBtn && createAccountBtn.addEventListener("click", async () => {
    const typeR = userTypeRSelect.value; 
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();
    const firstName = regFirstName.value.trim();
    const lastName = regLastName.value.trim();
    const address = regAddress.value.trim();

    if(typeR === "client") { 
        if (!email || !password || !firstName || !lastName || !address) {
            alert("Uzupełnij wszystkie pola");
            return;
        }
    }

    if(typeR === "vet") { 
        if (!email || !password || !firstName || !lastName) {
            alert("Uzupełnij wszystkie pola");
            return;
        }
    }

    try {
        if(typeR === "client"){
            response = await fetch("/api/v1/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    address
                })
            });
       } else if(typeR === "vet") {
            response = await fetch("/api/v1/vet/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    login,
                    password,
                    firstName,
                    lastName
                })
            });
       }

            const data = await response.json();

            alert("Rejestracja zakończona sukcesem!");
            // powrót do logowania
            registerPanel.classList.add("hidden");
            loginPanel.classList.remove("hidden");
            loginPanel.classList.add("show");

        if (!response.ok) {
            alert(data.message || "Błąd rejestracji");
            return;
        }
    
    } catch (err) {
        alert(`Błąd połączenia z serwerem: ${err.message}`);
    }
});

// POWRÓT DO PANELU LOGOWANIA
backToLoginBtn && backToLoginBtn.addEventListener("click", () => {
    registerPanel.classList.add("hidden");
    loginPanel.classList.remove("hidden");
    loginPanel.classList.add("show");
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
    vetPanel.classList.add("show");
});

// PACJENCI (Weterynarz)
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
    vetPanel.classList.add("show");
});

// KLIENT DODAWANIE ZWIERZAKA
const addPetBtn = document.getElementById("addPetBtn");
const addPetPanel = document.getElementById("addPetPanel");
const savePetBtn = document.getElementById("savePetBtn");
const backToClientBtn = document.getElementById("backToClientBtn");

const petName = document.getElementById("petName");
const petSpecies = document.getElementById("petSpecies");

addPetBtn.addEventListener("click", () => {
    clientPanel.classList.add("hidden");
    addPetPanel.classList.remove("hidden");
    addPetPanel.classList.add("show");
});

// WYSYŁANIE DO BACKEND
savePetBtn.addEventListener("click", async () => {
    const name = petName.value.trim();
    const species = petSpecies.value.trim();

    if (!species || !name) {
        alert("Uzupełnij wszystkie pola");
        return;
    }


    try {
        const response = await fetch("/api/v1/animals/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                species,
                name,
                ownerId: currentUserId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Błąd dodawania zwierzaka");
            return;
        }

        alert("Zwierzak dodany!");

        addPetPanel.classList.add("hidden");
        clientPanel.classList.remove("hidden");
        clientPanel.classList.add("show");

    } catch (err) {
        alert("Błąd połączenia z serwerem");
    }
});

backToClientBtn.addEventListener("click", () => {
    addPetPanel.classList.add("hidden");
    clientPanel.classList.remove("hidden");
    clientPanel.classList.add("show");
});


