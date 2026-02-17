let citizens = [];
let officers = [];

// Tab switching
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-btn[onclick="openTab('${tabName}')"]`).classList.add('active');
}

// Citizens
function addCitizen() {
    const first = document.getElementById('citizenFirst').value;
    const last = document.getElementById('citizenLast').value;
    const photo = document.getElementById('citizenPhoto').value;
    if(!first || !last) return alert("Podaj imię i nazwisko!");
    const ssn = Math.floor(100000000 + Math.random()*900000000);
    citizens.push({first,last,photo,ssn,notes:[],wanted:0,searches:[]});
    displayCitizens();
    document.getElementById('citizenFirst').value='';
    document.getElementById('citizenLast').value='';
    document.getElementById('citizenPhoto').value='';
}

function displayCitizens() {
    const list = document.getElementById('citizenList');
    list.innerHTML='';
    citizens.forEach(c=>{
        const card = document.createElement('div');
        card.className='citizen-card';
        card.innerHTML=`
        <img src="${c.photo||'https://via.placeholder.com/70'}" alt="photo">
        <div>
        <strong>${c.first} ${c.last}</strong> (SSN: ${c.ssn})<br>
        Wanted: <span class="wanted">${'★'.repeat(c.wanted)}</span><br>
        Notatki: ${c.notes.join(', ')}
        </div>
        `;
        list.appendChild(card);
    });
}

function searchCitizen() {
    const query=document.getElementById('searchInput').value.toLowerCase();
    const results=document.getElementById('searchResults');
    results.innerHTML='';
    citizens.filter(c=>c.first.toLowerCase().includes(query)||c.last.toLowerCase().includes(query))
    .forEach(c=>{
        const card=document.createElement('div');
        card.className='citizen-card poszukiwanie';
        card.innerHTML=`
        <img src="${c.photo||'https://via.placeholder.com/70'}" alt="photo">
        <div>
        <strong>${c.first} ${c.last}</strong> (SSN: ${c.ssn})<br>
        Wanted: <span class="wanted">${'★'.repeat(c.wanted)}</span><br>
        <button onclick="addSearch('${c.ssn}')">Dodaj poszukiwanie</button>
        <button onclick="addNote('${c.ssn}')">Dodaj notatkę</button><br>
        <input type="number" id="wanted-${c.ssn}" placeholder="Wanted 0-5" min="0" max="5">
        <div id="searches-${c.ssn}">
        ${c.searches.map(s=>`<div class="poszukiwanie">${s.desc} (ważne do: ${s.expiry})</div>`).join('')}
        </div>
        </div>
        `;
        results.appendChild(card);
    });
}

function addSearch(ssn){
    const desc=prompt("Opis poszukiwania:");
    const expiry=prompt("Data wygaśnięcia (np. 2026-02-20):");
    const citizen=citizens.find(c=>c.ssn==ssn);
    if(desc && expiry){citizen.searches.push({desc,expiry});searchCitizen();}
}

function addNote(ssn){
    const note=prompt("Treść notatki:");
    const citizen=citizens.find(c=>c.ssn==ssn);
    if(note){citizen.notes.push(note);displayCitizens();searchCitizen();}
}

document.addEventListener('input',e=>{
    if(e.target.id.startsWith('wanted-')){
        const ssn=e.target.id.replace('wanted-','');
        const val=parseInt(e.target.value)||0;
        const citizen=citizens.find(c=>c.ssn==ssn);
        citizen.wanted=Math.min(Math.max(val,0),5);
        displayCitizens();searchCitizen();
    }
});

// Officers
function addOfficer(){
    const name=document.getElementById('officerName').value;
    const badge=document.getElementById('badgeNumber').value;
    if(!name||!badge)return alert("Podaj imię i numer odznaki!");
    officers.push({name,badge});
    displayOfficers();
    document.getElementById('officerName').value='';
    document.getElementById('badgeNumber').value='';
}

function displayOfficers(){
    const list=document.getElementById('officerList');
    list.innerHTML='';
    officers.forEach(o=>{
        const card=document.createElement('div');
        card.className='officer-card';
        card.innerHTML=`<strong>${o.name}</strong> - Odznaka: ${o.badge}`;
        list.appendChild(card);
    });
}

// Open default tab
openTab('citizens');
