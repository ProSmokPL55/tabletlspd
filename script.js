let citizens = [];
let officers = [];

// Tabs
function openTab(tabName){
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-btn[onclick="openTab('${tabName}')"]`).classList.add('active');
}

// Add citizen
function addCitizen(){
    const first=document.getElementById('citizenFirst').value;
    const last=document.getElementById('citizenLast').value;
    const photo=document.getElementById('citizenPhoto').value;
    if(!first||!last) return alert("Podaj imię i nazwisko!");
    const ssn=Math.floor(100000000 + Math.random()*900000000);
    citizens.push({
        first,last,photo,ssn,
        notes:[], wanted:0,
        searches:[], history:[]
    });
    document.getElementById('citizenFirst').value='';
    document.getElementById('citizenLast').value='';
    document.getElementById('citizenPhoto').value='';
    searchCitizen();
}

// Search citizen
function searchCitizen(){
    const query=document.getElementById('searchInput')?.value.toLowerCase()||'';
    const results=document.getElementById('searchResults');
    results.innerHTML='';
    citizens.filter(c=>c.first.toLowerCase().includes(query)||c.last.toLowerCase().includes(query))
    .forEach(c=>{
        const card=document.createElement('div');
        card.className='citizen-card';
        const isWanted=c.searches.length>0;
        card.innerHTML=`
            <img src="${c.photo||'https://via.placeholder.com/100'}" alt="photo">
            <div class="citizen-info">
                ${isWanted?'<div class="poszukiwanie-bar">POSZUKIWANY</div>':''}
                <strong>${c.first} ${c.last}</strong> (SSN: ${c.ssn})<br>
                Wanted: <span class="wanted">${'★'.repeat(c.wanted)}</span><br>
                <button onclick="addSearch('${c.ssn}')">Dodaj poszukiwanie</button>
                <button onclick="addNote('${c.ssn}')">Dodaj notatkę</button>
                <button onclick="addHistory('${c.ssn}')">Dodaj wyrok</button>

                <div class="notes">
                    <h4>Notatki</h4>
                    ${c.notes.map(n=>`<div>${n}</div>`).join('')}
                </div>

                <div class="history">
                    <h4>Historia wyroków</h4>
                    ${c.history.map(h=>`<div>${h}</div>`).join('')}
                </div>
            </div>
        `;
        results.appendChild(card);
    });
}

// Add search
function addSearch(ssn){
    const desc=prompt("Opis poszukiwania:");
    if(!desc) return;
    const expiry=prompt("Data wygaśnięcia (np. 2026-02-20):");
    const citizen=citizens.find(c=>c.ssn==ssn);
    citizen.searches.push({desc,expiry});
    searchCitizen();
}

// Add note
function addNote(ssn){
    const note=prompt("Treść notatki:");
    if(!note) return;
    const citizen=citizens.find(c=>c.ssn==ssn);
    citizen.notes.push(note);
    searchCitizen();
}

// Add history
function addHistory(ssn){
    const h=prompt("Dodaj wyrok / wydarzenie:");
    if(!h) return;
    const citizen=citizens.find(c=>c.ssn==ssn);
    citizen.history.push(h);
    searchCitizen();
}

// Wanted level
document.addEventListener('input',e=>{
    if(e.target.id?.startsWith('wanted-')){
        const ssn=e.target.id.replace('wanted-','');
        const val=parseInt(e.target.value)||0;
        const citizen=citizens.find(c=>c.ssn==ssn);
        citizen.wanted=Math.min(Math.max(val,0),5);
        searchCitizen();
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
openTab('addCitizenTab');
