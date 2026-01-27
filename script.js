let students = [];
let currentImg = "";
let editIndex = -1;

function switchPage(oldP, showP) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById(showP).classList.add('active');
}

document.getElementById('luser').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('lpass').focus();
    }
});

document.getElementById('lpass').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        goLogin();
    }
});

function goLogin() {
    const n = document.getElementById('luser').value;
    const p = document.getElementById('lpass').value;
    if (n === "12345" && p === "admin123") {
        switchPage('p1', 'p2');
    } else {
        alert("Akses Ditolak!");
    }
}

function loadImg(e) {
    let r = new FileReader();
    r.onload = function () {
        document.getElementById('pimg').src = r.result;
        document.getElementById('pimg').style.display = "block";
        document.getElementById('pht').style.display = "none";
        currentImg = r.result;
    }
    if (e.target.files[0]) r.readAsDataURL(e.target.files[0]);
}

function saveData() {
    const name = document.getElementById('inama').value;
    if (!name) return alert("Harap isi nama!");

    const studentData = {
        name: name,
        kelas: document.getElementById('ikelas').value,
        jurusan: document.getElementById('ijur').value,
        ttl: document.getElementById('ittl').value,
        jenis_kelamin: document.getElementById('ijkel').value,
        hp: document.getElementById('ihp').value,
        hobi: document.getElementById('ihobi').value,
        cita: document.getElementById('icita').value,
        alamat: document.getElementById('ialmt').value,
        foto: currentImg || "https://via.placeholder.com/120x160"
    };

    if (editIndex === -1) {
        students.push(studentData);
    } else {
        students[editIndex] = studentData;
    }

    renderTable();
    alert("Data Berhasil Disimpan!");
    switchPage('p2', 'p3');
}

function renderTable() {
    let html = "";
    students.forEach((s, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td><img src="${s.foto}" width="40" height="50" style="object-fit:cover; border-radius:6px;"></td>
            <td><b>${s.name}</b></td>
            <td>${s.kelas} / ${s.jurusan}</td>
            <td>
                <button class="btn btn-view" onclick="viewProfile(${index})"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-print-green" onclick="printDirect(${index})"><i class="fa-solid fa-print"></i></button>
                <button class="btn btn-yellow" onclick="editData(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-red" onclick="deleteData(${index})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    document.getElementById('tableBody').innerHTML = html;
}

function printDirect(index) {
    viewProfile(index);
    setTimeout(() => { window.print(); }, 500);
}

function viewProfile(index) {
    const s = students[index];
    const dataMap = [
        ["Nama Lengkap", s.name],
        ["Kelas / Jurusan", `${s.kelas} / ${s.jurusan}`],
        ["TTL", s.ttl], ["Jenis Kelamin", s.jenis_kelamin], ["No HP", s.hp], ["Hobi", s.hobi], ["Alamat", s.alamat]
    ];
    let out = "";
    dataMap.forEach(r => { out += `<tr><td style="font-weight:600; width:150px">${r[0]}</td><td>: ${r[1] || '-'}</td></tr>`; });
    document.getElementById('resData').innerHTML = out;
    document.getElementById('rfoto').src = s.foto;
    switchPage('p3', 'p4');
}

function editData(index) {
    const s = students[index];
    document.getElementById('inama').value = s.name;
    document.getElementById('pimg').src = s.foto;
    document.getElementById('pimg').style.display = "block";
    document.getElementById('pht').style.display = "none";
    currentImg = s.foto;
    editIndex = index;
    switchPage('p3', 'p2');
}

ihp.addEventListener("input", (e) => {
    ihp.value = ihp.value.replace(/[^0-9]/g, "");
})

function deleteData(index) {
    if (confirm("Hapus data?")) {
        students.splice(index, 1);
        renderTable();
    }
}

function resetForm() {
    document.querySelectorAll('input, textarea').forEach(i => i.value = "");
    document.getElementById('pimg').style.display = "none";
    document.getElementById('pht').style.display = "block";
    currentImg = "";
    editIndex = -1;
}

function logout() {
    location.reload();
}