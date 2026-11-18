console.log("JavaScript berhasil terhubung!");
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");

const progressBar = document.getElementById("progressBar");
const strengthText = document.getElementById("strengthText");
const scoreText = document.getElementById("score");
const recommendationText = document.getElementById("recommendationText");

const commonPasswords = [
    "password",
    "password123",
    "123456",
    "12345678",
    "qwerty",
    "admin",
    "admin123",
    "iloveyou",
    "welcome",
    "letmein"
];

const criteria = {
    length: document.getElementById("length"),
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    number: document.getElementById("number"),
    symbol: document.getElementById("symbol"),
    common: document.getElementById("common")
};

// Tombol tampilkan password
toggleButton.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    toggleButton.textContent = isHidden ? "Sembunyikan" : "Lihat";
});

// Fungsi utama pemeriksaan password
passwordInput.addEventListener("input", checkPassword);

function checkPassword() {
    const password = passwordInput.value;

    if (password.length === 0) {
        resetChecker();
        return;
    }

    let score = 0;
    let suggestions = [];

    // Pemeriksaan karakter
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
        common: !commonPasswords.includes(password.toLowerCase())
    };

    // Penilaian kriteria
    if (checks.length) score += 25;
    if (checks.uppercase) score += 15;
    if (checks.lowercase) score += 15;
    if (checks.number) score += 15;
    if (checks.symbol) score += 15;
    if (checks.common) score += 15;

    // Deteksi pola yang mudah ditebak
    const repeated = /(.)\1{3,}/.test(password);
    const sequential = /(?:0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf)/i.test(password);
    const weakPattern = repeated || sequential;

    if (weakPattern) {
        score -= 20;
        suggestions.push("Hindari karakter berulang atau urutan yang mudah ditebak.");
    }

    if (password.length < 12) {
        suggestions.push("Gunakan minimal 12 karakter.");
    }

    if (!checks.uppercase) {
        suggestions.push("Tambahkan huruf besar.");
    }

    if (!checks.lowercase) {
        suggestions.push("Tambahkan huruf kecil.");
    }

    if (!checks.number) {
        suggestions.push("Tambahkan angka.");
    }

    if (!checks.symbol) {
        suggestions.push("Tambahkan simbol khusus.");
    }

    if (!checks.common) {
        suggestions.push("Hindari menggunakan password yang umum.");
    }

    // Password umum tidak boleh dinilai aman
    if (!checks.common) {
        score = Math.min(score, 20);
    }

    score = Math.max(0, Math.min(score, 100));

    // Update tampilan kriteria
    Object.keys(checks).forEach(function (key) {
        criteria[key].classList.toggle("valid", checks[key]);
        criteria[key].textContent =
            (checks[key] ? "✓ " : "○ ") +
            criteria[key].textContent.substring(2);
    });

    // Menentukan kategori keamanan
    let strength = "";
    let color = "";
    let recommendation = "";

    if (score <= 20) {
        strength = "Sangat Lemah";
        color = "#ef4444";
    } else if (score <= 40) {
        strength = "Lemah";
        color = "#f97316";
    } else if (score <= 60) {
        strength = "Sedang";
        color = "#eab308";
    } else if (score <= 80) {
        strength = "Kuat";
        color = "#0ea5e9";
    } else {
        strength = "Sangat Kuat";
        color = "#16a34a";
    }

    if (suggestions.length === 0) {
        recommendation =
            "Password memenuhi seluruh kriteria dasar. " +
            "Tetap gunakan password yang unik untuk setiap akun.";
    } else {
        recommendation = suggestions.join(" ");
    }

    // Tampilkan hasil
    strengthText.textContent = strength;
    strengthText.style.color = color;

    scoreText.textContent = score + "/100";

    progressBar.style.width = score + "%";
    progressBar.style.background = color;

    recommendationText.textContent = recommendation;
}

// Reset tampilan
function resetChecker() {
    progressBar.style.width = "0%";
    progressBar.style.background = "#94a3b8";

    strengthText.textContent = "Belum diperiksa";
    strengthText.style.color = "#64748b";

    scoreText.textContent = "0/100";

    recommendationText.textContent =
        "Masukkan password untuk melihat rekomendasi keamanan.";

    Object.keys(criteria).forEach(function (key) {
        criteria[key].classList.remove("valid");
        criteria[key].textContent =
            criteria[key].textContent.replace(/^[✓○] /, "○ ");
    });
}
