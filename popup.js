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
    "LI Import Number", "LI Status", "Email",
    "First Name", "LI First Name", "LI Gender",
    "LI SN URL", "LI Display Name", "LI Headline", "LI Location",
    "Country", "LI Country",
    "LI Profile URL", "LinkedIn Profile",
    "LI Job History", "LI Connections Count", "LI Profession"
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

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function getTimestamp() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
    return `${date}_${time}`;
}

exportBtn.addEventListener("click", () => {
    chrome.storage.local.get(["liExportRecords", "liLeadURLs"], (result) => {
        const records = result.liExportRecords || [];
        const leadURLs = result.liLeadURLs || [];
        const newRecords = records.filter(r => !r.exported);
        if (!newRecords.length) return;

        const timestamp = getTimestamp();

        // Export CSV with new records
        const csvContent = csvHeaders.map(escapeCsvField).join(",") + "\n"
            + newRecords.map(recordToCsvRow).join("\n");
        downloadFile(csvContent, `li-export-${timestamp}.csv`, "text/csv;charset=utf-8;");

        // Export all SN URLs
        const urlsContent = leadURLs.join("\n");
        downloadFile(urlsContent, `li-sn-urls-export-${timestamp}.txt`, "text/plain;charset=utf-8;");

        // Mark exported records
        records.forEach(r => { r.exported = true; });
        chrome.storage.local.set({ liExportRecords: records }, () => {
            updateExportStatus();
            exportConfirmation.style.display = "block";
            setTimeout(() => { exportConfirmation.style.display = "none"; }, 1500);
        });
    });
});
