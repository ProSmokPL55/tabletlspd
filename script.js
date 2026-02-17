let citizens = [];
let officers = [];

const sampleSentences = [
    "Grzywna",
    "Więzienie 30 dni",
    "Więzienie 90 dni",
    "Areszt domowy 14 dni",
    "Zatrzymanie na 48h"
];

// OTWIERANIE ZAKŁADEK
function openTab(tabName){
    // Ukryj wszystkie tab-content
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    // Usuń active z przycisków
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    // Pokaż wybraną zakładkę
    const tab = document.getElementById(tabName);
    if(tab) tab.classList.add('active');
    // Ustaw active dla przycisku (tylko dla headera)
    const btn = document.querySelector(`.tab-btn[onclick="openTab('${tabName}')"]`);
    if(btn) btn.classList.add('active');
}

// OTWIERANIE PROFILU
function openProfile(ssn){
    const citizen = citizens.find(c=>c.ssn==ssn);
    if(!citizen) return;

    // Ukryj wszystkie tab-content (lista, dodawanie, policjanci)
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    // Pokaż profil
    document.getElementById('profileTab').classList.add('active');

    const profile=document.getElementById('profileContent');
    profile.innerHTML=`
        <h2>${citizen.first} ${citizen.last}</h2>
        <img src="${citizen.photo||'https://via.placeholder.com/150'}" style="width:150px;height:150px;border-radius:10px;">
        <p>SSN: ${citizen.ssn}</p>
        <p>Wanted: <span class="wanted">${'★'.repeat(citizen.wanted)}</span></p>
        <button onclick="addSearch('${citizen.ssn}')">Dodaj poszukiwanie</button>
        <button onclick="addNote('${citizen.ssn}')">Dodaj notatkę</button>
        <button onclick="addHistory('${citizen.ssn}')">Dodaj wyrok</button>
        <button onclick="editPhoto('${citizen.ssn}')">Edytuj zdjęcie</button>
        <button onclick="deleteCitizen('${citizen.ssn}')">Usuń profil</button>
        <button onclick="closeProfile()">← Powrót do listy</button>

        <div class="notes">
            <h4>Notatki</h4>
            ${citizen.notes.map(n=>`<div>${n}</div>`).join('')}
        </div>

        <div class="history">
            <h4>Historia wyroków</h4>
            ${citizen.history.map(h=>`<div>${h}</div>`).join('')}
        </div>

        <div class="searches">
            <h4>Poszukiwania</h4>
            ${citizen.searches.map(s=>`<div class="poszukiwanie">${s.desc} (ważne do: ${s.expiry})</div>`).join('')}
        </div>
    `;
}

// POWRÓT Z PROFILU
function closeProfile(){
    // Wróć do listy obywateli
    openTab('citizensTab');
}

// FUNKCJE PROFILU
function addSearch(ssn){
    const desc = prompt("Opis poszukiwania:");
    if(!desc) return;
    const expiry = prompt("Data wygaśnięcia (np. 2026-02-20):");
    const citizen = citizens.find(c=>c.ssn==ssn);
    citizen.searches.push({desc,expiry});
    displayCitizenList();
