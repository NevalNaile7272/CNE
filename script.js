/* =========================================================
   CNE BİTKİ DOKTORUNUZ
   TEK VERİ SİSTEMİ

   Bitki
      ↓
   Referans değerleri
      ↓
   Deneyap sensörleri
      ↓
   Sulama hesabı
      ↓
   Sonuç
========================================================= */


/* =========================================================
   1 — BİTKİLER
========================================================= */

const EV_BITKILERI = [
    "Deve Tabanı",
    "Monstera Adansonii",
    "Barış Çiçeği",
    "Areka Palmiyesi",
    "Salon Sarmaşığı",
    "Benjamin",
    "Yucca",
    "Paşa Kılıcı",
    "Zamioculcas",
    "Aloe Vera",
    "Kauçuk",
    "Dua Çiçeği",
    "Calathea",
    "Fittonia",
    "Peperomia",
    "Şeflera",
    "Dracaena",
    "Aglaonema",
    "Antoryum",
    "Orkide",
    "Begonya",
    "Menekşe",
    "Salon Eğrelti Otu",
    "Ficus Lyrata",
    "Ficus Ginseng",
    "Dieffenbachia",
    "Tradescantia",
    "Telgraf Çiçeği",
    "Çin Herdem Yeşili",
    "Benjamin Bonsai",
    "Şans Bambusu",
    "Para Ağacı",
    "Yelken Çiçeği",
    "Croton",
    "Tillandsia",
    "Fil Kulağı",
    "Alacalı Kauçuk",
    "Zebra Bitkisi",
    "Şamdan Çiçeği",
    "Kurdele Çiçeği",
    "Kaktüs",
    "Mini Kaktüs",
    "Sedum",
    "Echeveria",
    "Haworthia",
    "Crassula",
    "Peperomia Obtusifolia",
    "Ficus Elastica",
    "Maranta",
    "Ananas Çiçeği"
];

const SERA_BITKILERI = [
    "Domates",
    "Çeri Domates",
    "Biber",
    "Kapya Biber",
    "Acı Biber",
    "Salatalık",
    "Kornişon",
    "Patlıcan",
    "Kabak",
    "Sakız Kabağı",
    "Bal Kabağı",
    "Çilek",
    "Nane",
    "Fesleğen",
    "Maydanoz",
    "Dereotu",
    "Roka",
    "Marul",
    "Kıvırcık Marul",
    "Aysberg Marul",
    "Ispanak",
    "Pazı",
    "Semizotu",
    "Tere",
    "Reyhan",
    "Mercanköşk",
    "Kekik",
    "Frenk Soğanı",
    "Yeşil Soğan",
    "Turp",
    "Havuç",
    "Pancar",
    "Şalgam",
    "Lahana",
    "Kırmızı Lahana",
    "Brokoli",
    "Karnabahar",
    "Brüksel Lahanası",
    "Bezelye",
    "Fasulye",
    "Taze Fasulye",
    "Barbunya",
    "Nohut",
    "Bakla",
    "Yer Fıstığı",
    "Mısır",
    "Mini Mısır",
    "Kavun",
    "Karpuz",
    "Çilek Albion",
    "Ahududu",
    "Böğürtlen",
    "Yaban Mersini",
    "Frenk Üzümü",
    "Bektaşi Üzümü",
    "Üzüm",
    "İncir",
    "Limon",
    "Mandalina",
    "Portakal",
    "Greyfurt",
    "Kamkat",
    "Nar",
    "Şeftali",
    "Nektarin",
    "Kayısı",
    "Erik",
    "Kiraz",
    "Vişne",
    "Armut",
    "Elma",
    "Aronia",
    "Stevia",
    "Melisa",
    "Adamotu",
    "Safran",
    "Papatya",
    "Kadife Çiçeği",
    "Petunya",
    "Begonya Sera",
    "Gerbera",
    "Ortanca",
    "Gül",
    "Lale",
    "Sümbül",
    "Nergis",
    "Frezya",
    "Glayöl",
    "Zinya",
    "Aslanağzı",
    "Mine Çiçeği",
    "Verbena",
    "Gazanya",
    "Çuha Çiçeği",
    "Menekşe Sera",
    "Şebboy",
    "Karışık Yeşillik",
    "Microgreen",
    "Alabaş",
    "Enginar",
    "Kereviz"
];

const plants = [];

EV_BITKILERI.forEach((name, index) => {
    plants.push({
        id: `ev-${index}`,
        name,
        type: "Ev",
        icon: "🌸"
    });
});

SERA_BITKILERI.forEach((name, index) => {
    plants.push({
        id: `sera-${index}`,
        name,
        type: "Sera",
        icon: "🌱"
    });
});


/* =========================================================
   2 — SEÇİLİ BİTKİ
========================================================= */

let selectedPlant = null;


/* =========================================================
   3 — DENeyap SENSÖR VERİSİ
   BURADA ASLA RASTGELE DEĞER YOK
========================================================= */

const sensorData = {
    connected: false,
    soil: null,
    temperature: null,
    humidity: null,
    light: null,
    pump: null,
    flow: null,
    address: null,
    updated: null
};


/* =========================================================
   4 — REFERANS VERİLERİ
   HER BİTKİ KENDİ VERİSİNİ LOCALSTORAGE'DA TUTAR
========================================================= */

function referenceKey(plantId) {
    return `cne_reference_${plantId}`;
}

function getReference(plantId) {

    const saved = localStorage.getItem(referenceKey(plantId));

    if (!saved) {
        return null;
    }

    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
}

function saveReference(plantId, data) {
    localStorage.setItem(
        referenceKey(plantId),
        JSON.stringify(data)
    );
}


/* =========================================================
   5 — BITKİ LİSTESİ
========================================================= */

let activeFilter = "all";
let searchText = "";

const grid = document.getElementById("plantGrid");
const count = document.getElementById("count");

function renderPlants() {

    const filtered = plants.filter(plant => {

        const filterOK =
            activeFilter === "all" ||
            plant.type === activeFilter;

        const searchOK =
            plant.name
                .toLocaleLowerCase("tr-TR")
                .includes(searchText.toLocaleLowerCase("tr-TR"));

        return filterOK && searchOK;
    });

    count.textContent = filtered.length;

    grid.innerHTML = filtered.map(plant => {

        return `
            <article class="plant-card">

                <div class="plant-icon">
                    ${plant.icon}
                </div>

                <span class="plant-type">
                    ${plant.type === "Ev" ? "🏠 Ev Bitkisi" : "🌱 Sera Bitkisi"}
                </span>

                <h3>${plant.name}</h3>

                <p>
                    Bu bitkinin referans değerlerini kendin
                    kaydedebilir ve sensör verileriyle
                    sulama hesabında kullanabilirsin.
                </p>

                <div class="card-buttons">

                    <button
                        class="info-btn"
                        onclick="showPlantInfo('${plant.id}')">
                        🌿 Bitki Bilgisi
                    </button>

                    <button
                        class="water-btn"
                        onclick="openWaterCalculator('${plant.id}')">
                        💧 Sulamayı Hesapla
                    </button>

                </div>

            </article>
        `;
    });
}


/* =========================================================
   6 — NAVİGASYON
========================================================= */

document.querySelectorAll(".nav-btn").forEach(button => {

    button.addEventListener("click", () => {

        const page = button.dataset.page;

        document.querySelectorAll(".nav-btn")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelectorAll(".page")
            .forEach(section => section.classList.remove("active"));

        button.classList.add("active");

        document.getElementById(page)
            .classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});


/* =========================================================
   7 — FİLTRE
========================================================= */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        activeFilter = button.dataset.filter;

        document.querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        renderPlants();
    });
});


/* =========================================================
   8 — ARAMA
========================================================= */

document.getElementById("search")
    .addEventListener("input", event => {

        searchText = event.target.value;

        renderPlants();
    });


/* =========================================================
   9 — MODAL
========================================================= */

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

function openModal() {
    modal.classList.add("show");
}

function closeModal() {
    modal.classList.remove("show");
}

document.getElementById("closeModal")
    .addEventListener("click", closeModal);

modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeModal();
    }
});


/* =========================================================
   10 — BİTKİ BİLGİSİ
========================================================= */

function showPlantInfo(plantId) {

    const plant = plants.find(p => p.id === plantId);

    if (!plant) return;

    selectedPlant = plant;

    const reference = getReference(plantId);

    modalContent.innerHTML = `

        <h2 class="modal-title">
            ${plant.icon} ${plant.name}
        </h2>

        <div class="info-section">

            <strong>Bitki Türü</strong>

            <p>
                ${plant.type === "Ev"
                    ? "Ev bitkisi"
                    : "Sera bitkisi"}
            </p>

        </div>

        <div class="info-section">

            <strong>Bitki Bilgisi</strong>

            <p>
                Bu alan seçilen bitkinin yetişme ortamı,
                bakım özellikleri ve bitkiye özel bilgiler
                için kullanılmaktadır.
            </p>

        </div>

        <div class="info-section">

            <strong>Köken</strong>

            <p>
                Bitkiye ait köken bilgisi burada tutulur.
            </p>

        </div>

        <div class="info-section">

            <strong>Kaydedilmiş Referans</strong>

            <p>
                ${
                    reference
                    ? "Bu bitki için referans değerleri kaydedilmiş."
                    : "Bu bitki için henüz referans değeri girilmemiş."
                }
            </p>

        </div>

        <button
            class="save-reference"
            onclick="openWaterCalculator('${plantId}')">
            ⚙️ Referans / Sulama Hesabına Git
        </button>
    `;

    openModal();
}


/* =========================================================
   11 — SULAMA HESABI
========================================================= */

function openWaterCalculator(plantId) {

    const plant = plants.find(p => p.id === plantId);

    if (!plant) return;

    selectedPlant = plant;

    const reference = getReference(plantId);

    const currentSoil =
        sensorData.soil !== null
            ? sensorData.soil
            : "";

    modalContent.innerHTML = `

        <h2 class="modal-title">
            💧 ${plant.name}
        </h2>

        <p style="margin-bottom:18px;color:#68736c;">
            Bu bitkinin referans değerlerini kaydet.
            Sensör bağlıysa mevcut toprak nemi otomatik kullanılır.
        </p>

        <div class="form-grid">

            <div class="form-group">

                <label>
                    Mevcut Toprak Nemi (%)
                </label>

                <input
                    id="currentMoisture"
                    type="number"
                    value="${currentSoil}"
                    placeholder="Sensörden gelir">

            </div>

            <div class="form-group">

                <label>
                    Hedef Toprak Nemi (%)
                </label>

                <input
                    id="targetMoisture"
                    type="number"
                    value="${reference?.targetMoisture ?? ""}"
                    placeholder="Örn. 60">

            </div>

            <div class="form-group">

                <label>
                    Saksı / Toprak Hacmi (L)
                </label>

                <input
                    id="volume"
                    type="number"
                    step="0.1"
                    value="${reference?.volume ?? ""}"
                    placeholder="Örn. 5">

            </div>

            <div class="form-group">

                <label>
                    Temel Su Oranı (mL/L)
                </label>

                <input
                    id="waterRate"
                    type="number"
                    step="0.1"
                    value="${reference?.waterRate ?? ""}"
                    placeholder="Bitkiye göre gir">

            </div>

            <div class="form-group">

                <label>
                    Toprak Katsayısı
                </label>

                <input
                    id="soilCoefficient"
                    type="number"
                    step="0.01"
                    value="${reference?.soilCoefficient ?? ""}"
                    placeholder="Örn. 1">

            </div>

            <div class="form-group">

                <label>
                    Bitki Boyutu Katsayısı
                </label>

                <input
                    id="plantCoefficient"
                    type="number"
                    step="0.01"
                    value="${reference?.plantCoefficient ?? ""}"
                    placeholder="Örn. 1">

            </div>

            <div class="form-group">

                <label>
                    Ortam Katsayısı
                </label>

                <input
                    id="environmentCoefficient"
                    type="number"
                    step="0.01"
                    value="${reference?.environmentCoefficient ?? ""}"
                    placeholder="Örn. 1">

            </div>

        </div>

        <button
            class="save-reference"
            onclick="savePlantReference()">
            💾 Bu Bitkinin Referanslarını Kaydet
        </button>

        <button
            class="calculate-button"
            onclick="calculateWater()">
            💧 Sulama Miktarını Hesapla
        </button>

        <div id="calculationResult"></div>
    `;

    openModal();
}


/* =========================================================
   12 — REFERANS KAYDET
========================================================= */

function savePlantReference() {

    if (!selectedPlant) return;

    const reference = {

        targetMoisture:
            Number(document.getElementById("targetMoisture").value),

        volume:
            Number(document.getElementById("volume").value),

        waterRate:
            Number(document.getElementById("waterRate").value),

        soilCoefficient:
            Number(document.getElementById("soilCoefficient").value),

        plantCoefficient:
            Number(document.getElementById("plantCoefficient").value),

        environmentCoefficient:
            Number(document.getElementById("environmentCoefficient").value)
    };

    const valid =
        Object.values(reference).every(
            value => Number.isFinite(value) && value >= 0
        );

    if (!valid) {

        alert("Lütfen bütün referans değerlerini gir.");

        return;
    }

    saveReference(selectedPlant.id, reference);

    alert(
        `${selectedPlant.name} için referans değerleri kaydedildi.`
    );
}


/* =========================================================
   13 — SULAMA HESABI
========================================================= */

function calculateWater() {

    if (!selectedPlant) return;

    const currentInput =
        document.getElementById("currentMoisture");

    const current =
        currentInput.value !== ""
            ? Number(currentInput.value)
            : sensorData.soil;

    const target =
        Number(document.getElementById("targetMoisture").value);

    const volume =
        Number(document.getElementById("volume").value);

    const rate =
        Number(document.getElementById("waterRate").value);

    const soilK =
        Number(document.getElementById("soilCoefficient").value);

    const plantK =
        Number(document.getElementById("plantCoefficient").value);

    const environmentK =
        Number(document.getElementById("environmentCoefficient").value);


    if (
        current === null ||
        !Number.isFinite(current) ||
        !Number.isFinite(target) ||
        !Number.isFinite(volume) ||
        !Number.isFinite(rate) ||
        !Number.isFinite(soilK) ||
        !Number.isFinite(plantK) ||
        !Number.isFinite(environmentK)
    ) {

        document.getElementById("calculationResult").innerHTML = `

            <div class="result">
                Önce eksik referans değerlerini gir.
                <br><br>
                Sensör bağlı değilse mevcut toprak nemini
                elle girmen gerekir.
            </div>
        `;

        return;
    }


    const moistureDifference =
        Math.max(0, target - current);


    const amount =
        volume *
        rate *
        (moistureDifference / 100) *
        soilK *
        plantK *
        environmentK;


    const rounded =
        Math.max(0, Math.round(amount * 10) / 10);


    document.getElementById("calculationResult").innerHTML = `

        <div class="result">

            🌱 <strong>${selectedPlant.name}</strong>

            <br><br>

            Mevcut toprak nemi:
            ${current}%

            <br>

            Hedef toprak nemi:
            ${target}%

            <br><br>

            💧 Önerilen sulama miktarı:

            <br>

            <strong style="font-size:28px;">
                ${rounded} mL
            </strong>

            <br><br>

            ${
                rounded === 0
                ? "Toprak nemi hedef değerin üzerinde veya eşit."
                : "Bu sonuç seçilen bitkinin kendi referans değerleriyle hesaplandı."
            }

        </div>
    `;
}


/* =========================================================
   14 — GERÇEK DENeyap VERİSİNİ AL
=========================================================

   Deneyap Kart 1 tarafından tarayıcıya veri gönderildiğinde
   SADECE bu fonksiyon çağrılacak.

   ÖRNEK:

   updateSensorData({
       soil: 42,
       temperature: 24.5,
       humidity: 58,
       light: 8200,
       pump: false,
       flow: 0,
       address: "192.168.4.1"
   });

========================================================= */

window.updateSensorData = function(data) {

    sensorData.connected = true;

    if ("soil" in data)
        sensorData.soil = data.soil;

    if ("temperature" in data)
        sensorData.temperature = data.temperature;

    if ("humidity" in data)
        sensorData.humidity = data.humidity;

    if ("light" in data)
        sensorData.light = data.light;

    if ("pump" in data)
        sensorData.pump = data.pump;

    if ("flow" in data)
        sensorData.flow = data.flow;

    if ("address" in data)
        sensorData.address = data.address;

    sensorData.updated = new Date();

    updateSensorScreen();
};


/* =========================================================
   15 — SENSÖR EKRANI
========================================================= */

function displayValue(value) {

    if (value === null || value === undefined) {
        return "--";
    }

    return value;
}


function updateSensorScreen() {

    document.getElementById("soilValue").textContent =
        displayValue(sensorData.soil);

    document.getElementById("temperatureValue").textContent =
        displayValue(sensorData.temperature);

    document.getElementById("humidityValue").textContent =
        displayValue(sensorData.humidity);

    document.getElementById("lightValue").textContent =
        displayValue(sensorData.light);

    document.getElementById("flowValue").textContent =
        displayValue(sensorData.flow);


    document.getElementById("pumpValue").textContent =

        sensorData.pump === null
            ? "--"
            : sensorData.pump
                ? "Açık"
                : "Kapalı";


    document.getElementById("deviceAddress").textContent =
        sensorData.address ?? "--";


    document.getElementById("connectionText").textContent =
        sensorData.connected
            ? "Deneyap Kart bağlı"
            : "Deneyap Kart bağlı değil";


    document.getElementById("deviceConnection").textContent =
        sensorData.connected
            ? "Bağlı"
            : "Bekleniyor";


    const dot =
        document.getElementById("connectionDot");

    dot.classList.toggle(
        "online",
        sensorData.connected
    );

    dot.classList.toggle(
        "offline",
        !sensorData.connected
    );


    document.getElementById("lastUpdate").textContent =
        sensorData.updated
            ? "Son güncelleme: " +
              sensorData.updated.toLocaleTimeString("tr-TR")
            : "Son güncelleme: --";
}


/* =========================================================
   16 — İLK ÇALIŞTIRMA
========================================================= */

renderPlants();
updateSensorScreen();

// ======================================================
// DENEYAP KART 1 BAĞLANTISI
// ======================================================

// Arduino Serial Monitor'da çıkan IP adresini buraya yaz.
// Örnek:
// const DENEYAP_IP = "192.168.1.50";

const DENEYAP_IP = "192.168.1.50";


// ======================================================
// DENeyAP'TAN VERİ AL
// ======================================================

async function deneyapVerileriniAl() {

    try {

        const response = await fetch(
            `http://${DENEYAP_IP}/api/data`,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Deneyap Kart cevap vermedi.");
        }

        const data = await response.json();

        console.log(
            "Deneyap Kart verileri:",
            data
        );


        // ------------------------------------------------
        // SERA DURUMU
        // ------------------------------------------------

        const toprakRaw =
            document.getElementById("toprakRaw");

        const sicaklik =
            document.getElementById("sicaklik");

        const havaNem =
            document.getElementById("havaNem");

        const isikRaw =
            document.getElementById("isikRaw");

        const pompaDurum =
            document.getElementById("pompaDurum");


        // ------------------------------------------------
        // VERİLERİ EKRANA YAZ
        // ------------------------------------------------

        if (toprakRaw) {

            toprakRaw.textContent =
                data.soilRaw;
        }


        if (sicaklik) {

            if (data.temperature === null) {

                sicaklik.textContent =
                    "Ölçülemiyor";

            } else {

                sicaklik.textContent =
                    data.temperature + " °C";
            }
        }


        if (havaNem) {

            if (data.airHumidity === null) {

                havaNem.textContent =
                    "Ölçülemiyor";

            } else {

                havaNem.textContent =
                    data.airHumidity + " %";
            }
        }


        if (isikRaw) {

            isikRaw.textContent =
                data.lightRaw;
        }


        if (pompaDurum) {

            pompaDurum.textContent =
                data.pumpRunning
                    ? "Sulama yapılıyor"
                    : "Pompa kapalı";
        }


    } catch (error) {

        console.error(
            "Deneyap bağlantı hatası:",
            error
        );

        const pompaDurum =
            document.getElementById("pompaDurum");

        if (pompaDurum) {

            pompaDurum.textContent =
                "Deneyap bağlantısı yok";
        }
    }
}


// ======================================================
// HER 2 SANİYEDE BİR GÜNCELLE
// ======================================================

setInterval(
    deneyapVerileriniAl,
    2000
);


// İlk çalıştırma
deneyapVerileriniAl();


// ======================================================
// SULAMA BAŞLAT
// ======================================================
// Örnek:
// sulamayiBaslat(100);
// = 100 mL gönder
// ======================================================

async function sulamayiBaslat(miktarMl) {

    try {

        const response = await fetch(
            `http://${DENEYAP_IP}/api/water?ml=${encodeURIComponent(miktarMl)}`
        );

        const data =
            await response.json();

        console.log(
            "Sulama sonucu:",
            data
        );

        if (!data.success) {

            alert(
                data.error ||
                "Sulama başlatılamadı."
            );

            return;
        }

        deneyapVerileriniAl();

    } catch (error) {

        console.error(error);

        alert(
            "Deneyap Kart'a bağlanılamadı."
        );
    }
}


// ======================================================
// SULAMAYI DURDUR
// ======================================================

async function sulamayiDurdur() {

    try {

        await fetch(
            `http://${DENEYAP_IP}/api/stop`
        );

        deneyapVerileriniAl();

    } catch (error) {

        console.error(error);
    }
}