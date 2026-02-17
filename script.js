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
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    const tab = document.getElementById(tabName);
    if(tab) tab.classList.add('active');
    const btn = document.querySelector(`.tab-btn[onclick="openTab('${tabName}')"]`);
    if(btn) btn.classList.add('active');
}

// DODAWANIE OBYWATELA
function addCitizen(){
    const first=document.getElementById('citizenFirst').value;
    const last=document.getElementById('citizenLast').value;
    const photo=document.getElementById('citizenPhoto').value;
    if(!first||!last) return alert("Podaj imię i nazwisko!");
    const ssn=Math.floor(100000000 + Math.random()*900000000);
    citizens.push({first,last,photo,ssn,wanted:0,notes:[],searches:[],history:[]});
    document.getElementById('citizenFirst').value='';
    document.getElementById('citizenLast').value='';
    document.getElementById('citizenPhoto').value='';
    displayCitizenList();
}

// LISTA OBYWATELI
function displayCitizenList(){
    const query=document.getElementById('searchInput').value.toLowerCase();
    const list = document.getElementById('citizenList');
    list.innerHTML='';
    citizens.filter(c=>c.first.toLowerCase().includes(query) || c.last.toLowerCase().includes(query))
        .forEach(c=>{
            const item=document.createElement('div');
            item.className='citizen-card';
            const status = c.searches.length>0 ? 'POSZUKIWANY' : 'W porządku';
            const barColor = c.searches.length>0 ? 'red' : '#1e40af';
            item.innerHTML = `
                <div class="citizen-info" style="cursor:pointer;" onclick="openProfile('${c.ssn}')">
                    <strong>${c.first} ${c.last}</strong>
                    <div style="background:${barColor};color:black;padding:3px;border-radius:3px;margin-top:3px;">${status}</div>
                </div>
            `;
            list.appendChild(item);
        });
}

// PROFIL OBYWATELA
function openProfile(ssn){
    const citizen = citizens.find(c=>c.ssn==ssn);
    if(!citizen) return;
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
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

// POWRÓT DO LISTY
function closeProfile(){
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
