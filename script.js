let students = [];
let currentImg = "";
let editIndex = -1;

// Key untuk localStorage
const STORAGE_KEY = "biodataSiswa";

// Fungsi untuk menyimpan data ke localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Fungsi untuk memuat data dari localStorage
function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        students = JSON.parse(data);
    }
}

// Muat data saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', function () {
    loadFromStorage();
    renderTable();
});

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
    if (n === "" && p === "") {
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
        nis: document.getElementById('ins').value,
        nisn: document.getElementById('insn').value,
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

    // Simpan ke localStorage
    saveToStorage();

    renderTable();
    resetForm();
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
            <td>${s.nis} / ${s.nisn}</td>
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
        ["NIS / NISN", `${s.nis} / ${s.nisn}`],
        ["Kelas / Jurusan", `${s.kelas} / ${s.jurusan}`],
        ["TTL", s.ttl],
        ["Jenis Kelamin", s.jenis_kelamin],
        ["No HP", s.hp],
        ["Hobi", s.hobi],
        ["Cita-cita", s.cita],
        ["Alamat", s.alamat]
    ];
    let out = "";
    dataMap.forEach(r => {
        out += `<tr>
            <td class="label-col">${r[0]}</td>
            <td class="colon-col">:</td>
            <td class="value-col">${r[1] || '-'}</td>
        </tr>`;
    });
    document.getElementById('resData').innerHTML = out;
    document.getElementById('rfoto').src = s.foto;
    switchPage('p3', 'p4');
}

function editData(index) {
    const s = students[index];
    document.getElementById('inama').value = s.name;
    document.getElementById('ins').value = s.nis || '';
    document.getElementById('insn').value = s.nisn || '';
    document.getElementById('ikelas').value = s.kelas || '';
    document.getElementById('ijur').value = s.jurusan || '';
    document.getElementById('ittl').value = s.ttl || '';
    document.getElementById('ijkel').value = s.jenis_kelamin || '';
    document.getElementById('ihp').value = s.hp || '';
    document.getElementById('ihobi').value = s.hobi || '';
    document.getElementById('icita').value = s.cita || '';
    document.getElementById('ialmt').value = s.alamat || '';
    document.getElementById('pimg').src = s.foto;
    document.getElementById('pimg').style.display = "block";
    document.getElementById('pht').style.display = "none";
    currentImg = s.foto;
    editIndex = index;
    switchPage('p3', 'p2');
}

document.getElementById('ihp').addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
});

function deleteData(index) {
    if (confirm("Hapus data ini?")) {
        students.splice(index, 1);
        // Simpan ke localStorage setelah menghapus
        saveToStorage();
        renderTable();
    }
}

function resetForm() {
    document.querySelectorAll('#p2 input, #p2 textarea, #p2 select').forEach(i => {
        if (i.type !== 'file') {
            i.value = "";
        }
    });
    document.getElementById('ijkel').selectedIndex = 0;
    document.getElementById('pimg').style.display = "none";
    document.getElementById('pht').style.display = "block";
    document.getElementById('fin').value = "";
    currentImg = "";
    editIndex = -1;
}

function logout() {
    location.reload();
}

// Fungsi untuk menghapus semua data (opsional, untuk debugging)
function clearAllData() {
    if (confirm("Hapus SEMUA data siswa? Tindakan ini tidak dapat dibatalkan!")) {
        students = [];
        saveToStorage();
        renderTable();
        alert("Semua data telah dihapus!");
    }
}