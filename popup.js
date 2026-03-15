const leadURLsTextarea = document.getElementById("leadURLs");
const urlCountDiv = document.getElementById("urlCount");
const countrySelect = document.getElementById("country");
const professionSelect = document.getElementById("profession");
const saveBtn = document.getElementById("saveBtn");
const savedConfirmation = document.getElementById("savedConfirmation");

function parseURLs(text) {
    return text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
}

function updateURLCount() {
    const urls = parseURLs(leadURLsTextarea.value);
    urlCountDiv.textContent = `URLs: ${urls.length}`;
}

// Load saved values on popup open
chrome.storage.local.get(["liLeadURLs", "liCountry", "liProfession"], (result) => {
    if (result.liLeadURLs && result.liLeadURLs.length) {
        leadURLsTextarea.value = result.liLeadURLs.join("\n");
    }
    if (result.liCountry) {
        countrySelect.value = result.liCountry;
    }
    if (result.liProfession) {
        professionSelect.value = result.liProfession;
    }
    updateURLCount();
});

leadURLsTextarea.addEventListener("input", updateURLCount);

function saveSettings() {
    const urls = parseURLs(leadURLsTextarea.value);
    chrome.storage.local.set({
        liLeadURLs: urls,
        liCountry: countrySelect.value,
        liProfession: professionSelect.value
    }, () => {
        savedConfirmation.style.display = "block";
        setTimeout(() => { savedConfirmation.style.display = "none"; }, 1500);
    });
}

saveBtn.addEventListener("click", saveSettings);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target !== leadURLsTextarea) saveSettings();
});

// CSV Export
const exportBtn = document.getElementById("exportBtn");
const exportStatus = document.getElementById("exportStatus");
const exportConfirmation = document.getElementById("exportConfirmation");

const csvHeaders = [
    "Import #", "Status", "Email",
    "First Name", "First Name 2", "Gender",
    "Lead URL", "Full Name", "Headline", "Location",
    "Country", "Country 2",
    "Profile URL", "Profile URL 2",
    "Jobs", "Connections", "Profession"
];

function updateExportStatus() {
    chrome.storage.local.get(["liExportRecords"], (result) => {
        const records = result.liExportRecords || [];
        const newCount = records.filter(r => !r.exported).length;
        exportStatus.textContent = `New records: ${newCount}`;
        exportBtn.disabled = newCount === 0;
    });
}

updateExportStatus();

function escapeCsvField(value) {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function recordToCsvRow(r) {
    return [
        r.importNumber, r.liStatus, r.email,
        r.firstName, r.firstName, r.gender,
        r.leadURL, r.name, r.headline, r.location,
        r.country, r.country,
        r.profileURL, r.profileURL,
        r.jobs, r.connections, r.profession
    ].map(escapeCsvField).join(",");
}

exportBtn.addEventListener("click", () => {
    chrome.storage.local.get(["liExportRecords"], (result) => {
        const records = result.liExportRecords || [];
        const newRecords = records.filter(r => !r.exported);
        if (!newRecords.length) return;

        const csvContent = csvHeaders.map(escapeCsvField).join(",") + "\n"
            + newRecords.map(recordToCsvRow).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const now = new Date();
        const date = now.toISOString().slice(0, 10);
        const time = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
        a.download = `li-export-${date}_${time}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        // Mark exported records
        records.forEach(r => { r.exported = true; });
        chrome.storage.local.set({ liExportRecords: records }, () => {
            updateExportStatus();
            exportConfirmation.style.display = "block";
            setTimeout(() => { exportConfirmation.style.display = "none"; }, 1500);
        });
    });
});
