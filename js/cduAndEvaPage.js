const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const html2pdf = require('html2pdf.js');
const pageSelect = document.getElementById('select-page')
const selectionHeadCdu = document.getElementById('cdu-selectionHead')
const operatingHead = document.getElementById('operatingHead')
const selectionContentCdu = document.querySelector('.cdu-selection-content')
const operatingContent = document.querySelector('.operating-content')
const calButton = document.getElementById('calculate')
const selectRefrigerant = document.getElementById('cdu-select-refrigerant')
const selectBrandCdu = document.getElementById('cdu-select-brand')
const selectTypeCdu = document.getElementById('cdu-select-type')
const selectSeriesCdu = document.getElementById('cdu-select-series')
const textCoolingCdu = document.getElementById('cdu-text-cooling')
const selectModelCdu = document.getElementById('cdu-select-model')
const cduTable = document.getElementById('cduTable')
const textSst = document.getElementById('text-sst')
const textAmbient = document.getElementById('text-ambient')
const radioCoolingCdu = document.getElementById('cdu-radio-cooling')
const radioModelCdu = document.getElementById('cdu-radio-model')
const cduTableRows = document.getElementById("cduTable").querySelectorAll("tr")
const stepTableRows = document.getElementById("step-result-table").querySelectorAll("tr")
const buttonResetCdu = document.getElementById('cdu-reset-table-step')
const buttonSubmitCdu = document.getElementById('cdu-submit-table-step')
const radioAppLow = document.getElementById('radio-app-low')
const radioAppMed = document.getElementById('radio-app-med')
const steptableDataSheetCap = document.getElementById('step-table-datasheet-cap').querySelectorAll("tr")
const steptableDataSheetInput = document.getElementById('step-table-datasheet-powerinput').querySelectorAll("tr")
const btnExport = document.getElementById('cdu-btn-export')
const btnExport2 = document.getElementById('cdu-btn-export2')
const checkAccept = document.getElementById("cdu-radio-cooling")
const selectUnit = document.getElementById('select-unit')
const radioTabLimit = document.getElementById('one')

const selectionHeadEvap = document.getElementById('evap-selectionHead')
const selectionContentEvap = document.querySelector('.evap-selection-content')
const selectBrandEvap = document.getElementById('evap-select-brand')
const selectVoltageEvap = document.getElementById('evap-select-voltage')
const selectSeriesEvap = document.getElementById('evap-select-series')
const textCoolingEvap = document.getElementById('evap-text-cooling')
const selectModelEvap = document.getElementById('evap-select-model')
const textRoom = document.getElementById('text-room')
const radioCoolingEvap = document.getElementById('evap-radio-cooling')
const radioModelEvap = document.getElementById('evap-radio-model')
const evapTableRows = document.getElementById("evapTable").querySelectorAll("tr")
const btnExportEvap = document.getElementById('evap-btn-export')
const textAcceptableMins = document.getElementById('text-acceptable-mins')
const textAcceptablePlus = document.getElementById('text-acceptable-plus')
const checkAcceptEvap = document.getElementById("evap-radio-cooling")
const evapTap = document.getElementById('evap')

if (selectUnit.options[selectUnit.selectedIndex].value == "1111") {
    var labelYChart = "Condensing temperature (°C)"
    var labelXChart = "Evaporating temperature (°C)"
}
else {
    var labelYChart = "Condensing temperature (°F)"
    var labelXChart = "Evaporating temperature (°F)"
}

if (localStorage.getItem("units") == 1) {
    selectUnit.selectedIndex = 1
    unitChange()
}
else {
    unitChange()
}

document.getElementById('select-unit').addEventListener('change', () => {
    if (selectUnit.options[selectUnit.selectedIndex].value == "1111") {
        labelYChart = "Condensing temperature (°C)"
        labelXChart = "Evaporating temperature (°C)"
    }
    else {
        labelYChart = "Condensing temperature (°F)"
        labelXChart = "Evaporating temperature (°F)"
    }
    unitChange()
    localStorage.setItem("units", selectUnit.selectedIndex);
})


document.getElementById('back-btn').addEventListener('click', () => {
    ipc.send('back-click')
    let currentWindow = remote.getCurrentWindow();
    currentWindow.close();
})

pageSelect.addEventListener('change', () => {
    ipc.send('page-select', pageSelect.options[pageSelect.selectedIndex].value)
    if (pageSelect.options[pageSelect.selectedIndex].value) {
        let currentWindow = remote.getCurrentWindow();
        currentWindow.close();
    }
})
pageSelect.selectedIndex = [2]

btnExport.addEventListener('click', () => {
    let fileName = document.getElementById("datasheet-head-model-cdu").innerHTML
    let opt = {
        // margin: 1,
        filename: fileName + '_Datasheet',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    let element = document.getElementById('savePDF-cdu');
    html2pdf().set(opt).from(element).save();
})

btnExport2.addEventListener('click', () => {
    let fileName = document.getElementById("IS-head-model").innerHTML
    let opt = {
        // margin: 1,
        filename: fileName + '_Operating Summary',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    let element = document.getElementById('savePDF2');
    html2pdf().set(opt).from(element).save();
})

btnExportEvap.addEventListener('click', () => {
    let fileName = document.getElementById("datasheet-head-model-evap").innerHTML
    let opt = {
        // margin: 1,
        filename: fileName + '_Datasheet',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    let element = document.getElementById('savePDF');
    html2pdf().set(opt).from(element).save();
})

document.getElementsByName("cdu-choice").forEach(item => {
    item.addEventListener('change', () => {
        if (radioCoolingCdu.checked == true) {
            selectModelCdu.setAttribute("disabled", true)
            selectModelCdu.style.opacity = 0.5
            selectBrandCdu.removeAttribute("disabled")
            selectTypeCdu.removeAttribute("disabled")
            selectSeriesCdu.removeAttribute("disabled")
            selectBrandEvap.removeAttribute("disabled")
            selectVoltageEvap.removeAttribute("disabled")
            selectSeriesEvap.removeAttribute("disabled")
            textCoolingCdu.removeAttribute("disabled")
            textAcceptableMins.removeAttribute("disabled")
            textAcceptablePlus.removeAttribute("disabled")
            // selectBrandCdu.style.opacity = 1
            // selectTypeCdu.style.opacity = 1
            // selectSeriesCdu.style.opacity = 1
            textCoolingCdu.style.opacity = 1
            radioModelEvap.removeAttribute("disabled")
        }
        else {
            selectBrandCdu.removeAttribute("disabled")
            selectTypeCdu.removeAttribute("disabled")
            selectSeriesCdu.removeAttribute("disabled")
            selectBrandEvap.removeAttribute("disabled")
            selectVoltageEvap.removeAttribute("disabled")
            selectSeriesEvap.removeAttribute("disabled")
            textCoolingEvap.setAttribute("disabled", true)
            textCoolingCdu.setAttribute("disabled", true)
            textAcceptableMins.setAttribute("disabled", true)
            textAcceptablePlus.setAttribute("disabled", true)
            selectModelCdu.removeAttribute("disabled")
            selectModelCdu.style.opacity = 1
            // selectBrandCdu.style.opacity = 0.5
            // selectTypeCdu.style.opacity = 0.5
            // selectSeriesCdu.style.opacity = 0.5
            textCoolingCdu.style.opacity = 0.5
            radioModelEvap.setAttribute("disabled", true)
        }
    })
})

document.getElementsByName("evap-choice").forEach(item => {
    // textCoolingEvap.setAttribute("disabled", true)
    // textCoolingEvap.style.opacity = 0.5
    textCoolingEvap.style.opacity = 1
    item.addEventListener('change', () => {
        if (radioCoolingEvap.checked == true) {
            selectModelEvap.setAttribute("disabled", true)
            selectModelEvap.style.opacity = 0.5
            // selectBrandEvap.removeAttribute("disabled")
            // selectVoltageEvap.removeAttribute("disabled")
            // selectSeriesEvap.removeAttribute("disabled")
            textAcceptableMins.removeAttribute("disabled")
            textAcceptablePlus.removeAttribute("disabled")
            // selectBrandEvap.style.opacity = 1
            // selectVoltageEvap.style.opacity = 1
            // selectSeriesEvap.style.opacity = 1
            // textCoolingEvap.style.opacity = 1
            radioModelCdu.removeAttribute("disabled")
            textCoolingCdu.removeAttribute("disabled")
            textCoolingEvap.removeAttribute("disabled")
        }
        else {
            // selectBrandEvap.setAttribute("disabled", true)
            // selectVoltageEvap.setAttribute("disabled", true)
            // selectSeriesEvap.setAttribute("disabled", true)
            textAcceptableMins.setAttribute("disabled", true)
            textAcceptablePlus.setAttribute("disabled", true)
            // textCoolingEvap.setAttribute("disabled", true)
            selectModelEvap.removeAttribute("disabled")
            selectModelEvap.style.opacity = 1
            // selectBrandEvap.style.opacity = 0.5
            // selectVoltageEvap.style.opacity = 0.5
            // selectSeriesEvap.style.opacity = 0.5
            // textCoolingEvap.style.opacity = 0.5
            radioModelCdu.setAttribute("disabled", true)
            textCoolingCdu.setAttribute("disabled", true)
            textCoolingEvap.setAttribute("disabled", true)
        }
    })
})

selectionHeadCdu.addEventListener('click', () => {
    selectionContentCdu.classList.toggle('hide');
})

selectionHeadEvap.addEventListener('click', () => {
    selectionContentEvap.classList.toggle('hide');
})

operatingHead.addEventListener('click', () => {
    operatingContent.classList.toggle('hide');
})
textSst.setAttribute("disabled", true)
textAmbient.setAttribute("disabled", true)
textRoom.setAttribute("disabled", true)
selectBrandCdu.setAttribute("disabled", true)
selectTypeCdu.setAttribute("disabled", true)
selectSeriesCdu.setAttribute("disabled", true)
textCoolingCdu.setAttribute("disabled", true)
radioModelCdu.setAttribute("disabled", true)
textAcceptableMins.setAttribute("disabled", true)
textAcceptablePlus.setAttribute("disabled", true)
selectModelCdu.style.opacity = 0.5
selectBrandCdu.style.opacity = 0.5
selectTypeCdu.style.opacity = 0.5
selectSeriesCdu.style.opacity = 0.5
textCoolingCdu.style.opacity = 0.5
textAcceptableMins.style.opacity = 0.5
textAcceptablePlus.style.opacity = 0.5

selectBrandEvap.setAttribute("disabled", true)
selectVoltageEvap.setAttribute("disabled", true)
selectSeriesEvap.setAttribute("disabled", true)
textCoolingEvap.setAttribute("disabled", true)
radioModelEvap.setAttribute("disabled", true)
selectModelEvap.style.opacity = 0.5
selectBrandEvap.style.opacity = 0.5
selectVoltageEvap.style.opacity = 0.5
selectSeriesEvap.style.opacity = 0.5
textCoolingEvap.style.opacity = 0.5
// -----------------------------------Window Load---------------------------------------
ipc.send('cdu-loaded-refrigerant', async () => {
    await ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
radioAppMed.addEventListener('change', async () => {
    selectBrandCdu.innerHTML = ""
    selectTypeCdu.innerHTML = ""
    selectSeriesCdu.innerHTML = ""
    selectModelCdu.innerHTML = ""
    selectBrandCdu.add(document.createElement("option"), selectBrandCdu[0])
    selectTypeCdu.add(document.createElement("option"), selectTypeCdu[0])
    selectSeriesCdu.add(document.createElement("option"), selectSeriesCdu[0])
    selectModelCdu.add(document.createElement("option"), selectModelCdu[0])
    selectBrandCdu.selectedIndex = 0
    selectTypeCdu.selectedIndex = 0
    selectSeriesCdu.selectedIndex = 0
    selectModelCdu.selectedIndex = 0
    await ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
radioAppLow.addEventListener('change', async () => {
    selectBrandCdu.innerHTML = ""
    selectTypeCdu.innerHTML = ""
    selectSeriesCdu.innerHTML = ""
    selectModelCdu.innerHTML = ""
    selectBrandCdu.add(document.createElement("option"), selectBrandCdu[0])
    selectTypeCdu.add(document.createElement("option"), selectTypeCdu[0])
    selectSeriesCdu.add(document.createElement("option"), selectSeriesCdu[0])
    selectModelCdu.add(document.createElement("option"), selectModelCdu[0])
    selectBrandCdu.selectedIndex = 0
    selectTypeCdu.selectedIndex = 0
    selectSeriesCdu.selectedIndex = 0
    selectModelCdu.selectedIndex = 0
    await ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
ipc.on('cdu-brand-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_brand)
        newChild.appendChild(textChild)
        selectBrandCdu.appendChild(newChild)
    }
})
ipc.on('cdu-type-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_standard_type)
        newChild.appendChild(textChild)
        selectTypeCdu.appendChild(newChild)
    }
})
ipc.on('cdu-series-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_series)
        newChild.appendChild(textChild)
        selectSeriesCdu.appendChild(newChild)
    }
})
ipc.on('cdu-model-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_model)
        newChild.appendChild(textChild)
        selectModelCdu.appendChild(newChild)
    }
})

ipc.on('cdu-refrigerant-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].product_refrigerant == null) {
            continue;
        }
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_refrigerant)
        newChild.appendChild(textChild)
        selectRefrigerant.appendChild(newChild)
    }
})
selectRefrigerant.addEventListener('change', () => {
    if (selectRefrigerant.options[selectRefrigerant.selectedIndex].value != "") {
        if (radioCoolingCdu.checked == true && radioCoolingEvap.checked == true) {
            selectModelCdu.setAttribute("disabled", true)
            selectModelCdu.style.opacity = 0.5
            selectBrandCdu.removeAttribute("disabled")
            selectTypeCdu.removeAttribute("disabled")
            selectSeriesCdu.removeAttribute("disabled")
            textCoolingCdu.removeAttribute("disabled")
            radioModelCdu.removeAttribute("disabled")
            textSst.removeAttribute("disabled")
            textAmbient.removeAttribute("disabled")
            textRoom.removeAttribute("disabled")
            textAcceptableMins.removeAttribute("disabled")
            textAcceptablePlus.removeAttribute("disabled")
            selectBrandCdu.style.opacity = 1
            selectTypeCdu.style.opacity = 1
            selectSeriesCdu.style.opacity = 1
            textCoolingCdu.style.opacity = 1
            textAcceptableMins.style.opacity = 1
            textAcceptablePlus.style.opacity = 1
            textSst.style.opacity = 1
            textAmbient.style.opacity = 1
            textRoom.style.opacity = 1

            selectModelEvap.setAttribute("disabled", true)
            selectModelEvap.style.opacity = 0.5
            selectBrandEvap.removeAttribute("disabled")
            selectVoltageEvap.removeAttribute("disabled")
            selectSeriesEvap.removeAttribute("disabled")
            textCoolingEvap.removeAttribute("disabled")
            radioModelEvap.removeAttribute("disabled")
            selectBrandEvap.style.opacity = 1
            selectVoltageEvap.style.opacity = 1
            selectSeriesEvap.style.opacity = 1
            textCoolingEvap.style.opacity = 1
        }
        else if (radioCoolingCdu.checked == true && radioCoolingEvap.checked == false) {
            selectBrandCdu.removeAttribute("disabled")
            selectTypeCdu.removeAttribute("disabled")
            selectSeriesCdu.removeAttribute("disabled")
            selectBrandEvap.removeAttribute("disabled")
            selectVoltageEvap.removeAttribute("disabled")
            selectSeriesEvap.removeAttribute("disabled")
            textCoolingCdu.setAttribute("disabled", true)
            selectModelCdu.setAttribute("disabled", true)
            radioModelCdu.setAttribute("disabled", true)
            textSst.removeAttribute("disabled")
            textAmbient.removeAttribute("disabled")
            textRoom.removeAttribute("disabled")
            selectModelCdu.style.opacity = 0.5
            textCoolingCdu.style.opacity = 0.5
            selectBrandCdu.style.opacity = 1
            selectTypeCdu.style.opacity = 1
            selectSeriesCdu.style.opacity = 1
            selectBrandEvap.style.opacity = 1
            selectVoltageEvap.style.opacity = 1
            selectSeriesEvap.style.opacity = 1
        }
        else if (radioCoolingCdu.checked == false && radioCoolingEvap.checked == true) {
            selectBrandCdu.removeAttribute("disabled")
            selectTypeCdu.removeAttribute("disabled")
            selectSeriesCdu.removeAttribute("disabled")
            selectBrandEvap.removeAttribute("disabled")
            selectVoltageEvap.removeAttribute("disabled")
            selectSeriesEvap.removeAttribute("disabled")
            textCoolingCdu.setAttribute("disabled", true)
            selectModelEvap.setAttribute("disabled", true)
            radioModelEvap.setAttribute("disabled", true)
            textSst.removeAttribute("disabled")
            textAmbient.removeAttribute("disabled")
            textRoom.removeAttribute("disabled")
            selectModelEvap.style.opacity = 0.5
            textCoolingCdu.style.opacity = 0.5
            selectBrandCdu.style.opacity = 1
            selectTypeCdu.style.opacity = 1
            selectSeriesCdu.style.opacity = 1
            selectBrandEvap.style.opacity = 1
            selectVoltageEvap.style.opacity = 1
            selectSeriesEvap.style.opacity = 1
        }
    } else if (selectRefrigerant.options[selectRefrigerant.selectedIndex].value == "") {
        radioCoolingCdu.checked = true
        radioCoolingEvap.checked = true
        selectBrandCdu.setAttribute("disabled", true)
        selectBrandEvap.setAttribute("disabled", true)
        selectTypeCdu.setAttribute("disabled", true)
        selectVoltageEvap.setAttribute("disabled", true)
        selectSeriesCdu.setAttribute("disabled", true)
        selectSeriesEvap.setAttribute("disabled", true)
        textCoolingCdu.setAttribute("disabled", true)
        textCoolingEvap.setAttribute("disabled", true)
        textAcceptableMins.setAttribute("disabled", true)
        textAcceptablePlus.setAttribute("disabled", true)
        selectModelCdu.setAttribute("disabled", true)
        selectModelEvap.setAttribute("disabled", true)
        radioModelCdu.setAttribute("disabled", true)
        radioModelEvap.setAttribute("disabled", true)
        textSst.setAttribute("disabled", true)
        textRoom.setAttribute("disabled", true)
        textAmbient.setAttribute("disabled", true)
        selectModelCdu.style.opacity = 0.5
        selectModelEvap.style.opacity = 0.5
        selectBrandCdu.style.opacity = 0.5
        selectBrandEvap.style.opacity = 0.5
        selectTypeCdu.style.opacity = 0.5
        selectVoltageEvap.style.opacity = 0.5
        selectSeriesCdu.style.opacity = 0.5
        selectSeriesEvap.style.opacity = 0.5
        textCoolingCdu.style.opacity = 0.5
        textCoolingEvap.style.opacity = 0.5
        textAcceptableMins.style.opacity = 0.5
        textAcceptablePlus.style.opacity = 0.5
        textSst.style.opacity = 0.5
        textRoom.style.opacity = 0.5
        textAmbient.style.opacity = 0.5

    }
    ipc.send('cdu-refrigerant-select', selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppMed.checked, radioAppLow.checked)
    ipc.once('cdu-refrigerant-brand', (event, data) => {
        selectBrandCdu.innerHTML = ""
        selectBrandCdu.add(document.createElement("option"), selectBrandCdu[0])
        selectBrandCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_brand)
            newChild.appendChild(textChild)
            selectBrandCdu.appendChild(newChild)
        }
    })
    ipc.once('cdu-refrigerant-type', (event, data) => {
        selectTypeCdu.innerHTML = ""
        selectTypeCdu.add(document.createElement("option"), selectTypeCdu[0])
        selectTypeCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_standard_type)
            newChild.appendChild(textChild)
            selectTypeCdu.appendChild(newChild)
        }
    })
    ipc.once('cdu-refrigerant-series', (event, data) => {
        selectSeriesCdu.innerHTML = ""
        selectSeriesCdu.add(document.createElement("option"), selectSeriesCdu[0])
        selectSeriesCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeriesCdu.appendChild(newChild)
        }
    })
    ipc.once('cdu-refrigerant-model', (event, data) => {
        selectModelCdu.innerHTML = ""
        selectModelCdu.add(document.createElement("option"), selectModelCdu[0])
        selectModelCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModelCdu.appendChild(newChild)
        }
    })

    ipc.send('evap-refrigerant-select', selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppMed.checked, radioAppLow.checked)
    ipc.once('evap-refrigerant-evapBrand', (event, data) => {
        selectBrandEvap.innerHTML = ""
        selectBrandEvap.add(document.createElement("option"), selectBrandEvap[0])
        selectBrandEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_brand)
            newChild.appendChild(textChild)
            selectBrandEvap.appendChild(newChild)
        }
    })
    ipc.once('evap-refrigerant-evapVoltage', (event, data) => {
        selectVoltageEvap.innerHTML = ""
        selectVoltageEvap.add(document.createElement("option"), selectVoltageEvap[0])
        selectVoltageEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_voltage)
            newChild.appendChild(textChild)
            selectVoltageEvap.appendChild(newChild)
        }
    })
    ipc.once('evap-refrigerant-evapSeries', (event, data) => {
        selectSeriesEvap.innerHTML = ""
        selectSeriesEvap.add(document.createElement("option"), selectSeriesEvap[0])
        selectSeriesEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeriesEvap.appendChild(newChild)
        }
    })
    ipc.once('evap-refrigerant-model', (event, data) => {
        selectModelEvap.innerHTML = ""
        selectModelEvap.add(document.createElement("option"), selectModelEvap[0])
        selectModelEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModelEvap.appendChild(newChild)
        }
    })
})

// -----------------------------------Window Load---------------------------------------
ipc.send('evap-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
radioAppMed.addEventListener('change', async () => {
    selectBrandEvap.innerHTML = ""
    selectVoltageEvap.innerHTML = ""
    selectSeriesEvap.innerHTML = ""
    selectModelEvap.innerHTML = ""
    selectBrandEvap.add(document.createElement("option"), selectBrandEvap[0])
    selectVoltageEvap.add(document.createElement("option"), selectVoltageEvap[0])
    selectSeriesEvap.add(document.createElement("option"), selectSeriesEvap[0])
    selectModelEvap.add(document.createElement("option"), selectModelEvap[0])
    selectBrandEvap.selectedIndex = 0
    selectVoltageEvap.selectedIndex = 0
    selectSeriesEvap.selectedIndex = 0
    selectModelEvap.selectedIndex = 0
    await ipc.send('evap-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
radioAppLow.addEventListener('change', async () => {
    selectBrandEvap.innerHTML = ""
    selectVoltageEvap.innerHTML = ""
    selectSeriesEvap.innerHTML = ""
    selectModelEvap.innerHTML = ""
    selectBrandEvap.add(document.createElement("option"), selectBrandEvap[0])
    selectVoltageEvap.add(document.createElement("option"), selectVoltageEvap[0])
    selectSeriesEvap.add(document.createElement("option"), selectSeriesEvap[0])
    selectModelEvap.add(document.createElement("option"), selectModelEvap[0])
    selectBrandEvap.selectedIndex = 0
    selectVoltageEvap.selectedIndex = 0
    selectSeriesEvap.selectedIndex = 0
    selectModelEvap.selectedIndex = 0
    await ipc.send('evap-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
ipc.on('evap-brand-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_brand)
        newChild.appendChild(textChild)
        selectBrandEvap.appendChild(newChild)
    }
})
ipc.on('evap-voltage-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_voltage)
        newChild.appendChild(textChild)
        selectVoltageEvap.appendChild(newChild)
    }
})
ipc.on('evap-series-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_series)
        newChild.appendChild(textChild)
        selectSeriesEvap.appendChild(newChild)
    }
})
ipc.on('evap-model-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_model)
        newChild.appendChild(textChild)
        selectModelEvap.appendChild(newChild)
    }
})


// -----------------------------------CDU Brand Select---------------------------------------
selectBrandCdu.addEventListener('change', () => {
    ipc.send('cdu-brand-select', selectBrandCdu.options[selectBrandCdu.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
    ipc.once('cdu-brand-productSeries', (event, data) => {
        selectSeriesCdu.innerHTML = ""
        selectSeriesCdu.add(document.createElement("option"), selectSeriesCdu[0])
        selectSeriesCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeriesCdu.appendChild(newChild)
        }
    })
    ipc.once('cdu-brand-productType', (event, data) => {
        selectTypeCdu.innerHTML = ""
        selectTypeCdu.add(document.createElement("option"), selectTypeCdu[0])
        selectTypeCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_standard_type)
            newChild.appendChild(textChild)
            selectTypeCdu.appendChild(newChild)
        }
    })
    ipc.once('cdu-brand-productModel', (event, data) => {
        selectModelCdu.innerHTML = ""
        selectModelCdu.add(document.createElement("option"), selectModelCdu[0])
        selectModelCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModelCdu.appendChild(newChild)
        }
    })
})

// -----------------------------------CDU Type Select---------------------------------------
selectTypeCdu.addEventListener('change', () => {
    ipc.send('cdu-type-select', selectTypeCdu.options[selectTypeCdu.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrandCdu.options[selectBrandCdu.selectedIndex].value)
    ipc.once('cdu-type-productSeries', (event, data) => {
        selectSeriesCdu.innerHTML = ""
        selectSeriesCdu.add(document.createElement("option"), selectSeriesCdu[0])
        selectSeriesCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeriesCdu.appendChild(newChild)
        }
    })
    // ipc.once('cdu-type-productBrand', (event, data) => {
    //     selectBrandCdu.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].product_brand)
    //         newChild.appendChild(textChild)
    //         selectBrandCdu.appendChild(newChild)
    //     }
    // })
    ipc.once('cdu-type-productModel', (event, data) => {
        selectModelCdu.innerHTML = ""
        selectModelCdu.add(document.createElement("option"), selectModelCdu[0])
        selectModelCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModelCdu.appendChild(newChild)
        }
    })
})

// -----------------------------------CDU Series Select---------------------------------------
selectSeriesCdu.addEventListener('change', () => {
    ipc.send('cdu-series-select', selectSeriesCdu.options[selectSeriesCdu.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrandCdu.options[selectBrandCdu.selectedIndex].value, selectTypeCdu.options[selectTypeCdu.selectedIndex].value)
    // ipc.once('cdu-series-productType', (event, data) => {
    //     selectTypeCdu.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].product_standard_type)
    //         newChild.appendChild(textChild)
    //         selectTypeCdu.appendChild(newChild)
    //     }
    // })
    // ipc.once('cdu-series-productBrand', (event, data) => {
    //     selectBrandCdu.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].product_brand)
    //         newChild.appendChild(textChild)
    //         selectBrandCdu.appendChild(newChild)
    //     }
    // })
    ipc.once('cdu-series-productModel', (event, data) => {
        selectModelCdu.innerHTML = ""
        selectModelCdu.add(document.createElement("option"), selectModelCdu[0])
        selectModelCdu.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModelCdu.appendChild(newChild)
        }
    })
})

// -----------------------------------CDU Model Select---------------------------------------
selectModelCdu.addEventListener('change', () => {
    ipc.send('cdu-model-select', selectModelCdu.options[selectModelCdu.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
    ipc.once('cdu-model-productType', (event, data) => {
        selectTypeCdu.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_standard_type)
            newChild.appendChild(textChild)
            selectTypeCdu.appendChild(newChild)
        }
    })
    ipc.once('cdu-model-productBrand', (event, data) => {
        selectBrandCdu.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_brand)
            newChild.appendChild(textChild)
            selectBrandCdu.appendChild(newChild)
        }
    })
    ipc.once('cdu-model-productSeries', (event, data) => {
        selectSeriesCdu.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeriesCdu.appendChild(newChild)
        }
    })
})

// -----------------------------------Evap Brand Select---------------------------------------
selectBrandEvap.addEventListener('change', () => {
    ipc.send('evap-brand-select', selectBrandEvap.options[selectBrandEvap.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
    ipc.once('evap-brand-evapSeries', (event, data) => {
        selectSeriesEvap.innerHTML = ""
        selectSeriesEvap.add(document.createElement("option"), selectSeriesEvap[0])
        selectSeriesEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeriesEvap.appendChild(newChild)
        }
    })
    ipc.once('evap-brand-evapVoltage', (event, data) => {
        selectVoltageEvap.innerHTML = ""
        selectVoltageEvap.add(document.createElement("option"), selectVoltageEvap[0])
        selectVoltageEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_voltage)
            newChild.appendChild(textChild)
            selectVoltageEvap.appendChild(newChild)
        }
    })
    ipc.once('evap-brand-evapModel', (event, data) => {
        selectModelEvap.innerHTML = ""
        selectModelEvap.add(document.createElement("option"), selectModelEvap[0])
        selectModelEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModelEvap.appendChild(newChild)
        }
    })
})

// -----------------------------------Evap Type Select---------------------------------------
selectVoltageEvap.addEventListener('change', () => {
    ipc.send('evap-voltage-select', selectVoltageEvap.options[selectVoltageEvap.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrandEvap.options[selectBrandEvap.selectedIndex].value)
    ipc.once('evap-voltage-evapSeries', (event, data) => {
        selectSeriesEvap.innerHTML = ""
        selectSeriesEvap.add(document.createElement("option"), selectSeriesEvap[0])
        selectSeriesEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeriesEvap.appendChild(newChild)
        }
    })
    // ipc.once('evap-voltage-evapBrand', (event, data) => {
    //     selectBrandEvap.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].evap_brand)
    //         newChild.appendChild(textChild)
    //         selectBrandEvap.appendChild(newChild)
    //     }
    // })
    ipc.once('evap-voltage-evapModel', (event, data) => {
        selectModelEvap.innerHTML = ""
        selectModelEvap.add(document.createElement("option"), selectModelEvap[0])
        selectModelEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModelEvap.appendChild(newChild)
        }
    })
})

// -----------------------------------Evap Series Select---------------------------------------
selectSeriesEvap.addEventListener('change', () => {
    ipc.send('evap-series-select', selectSeriesEvap.options[selectSeriesEvap.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrandEvap.options[selectBrandEvap.selectedIndex].value, selectVoltageEvap.options[selectVoltageEvap.selectedIndex].value)
    // ipc.once('evap-series-evapVoltage', (event, data) => {
    //     selectVoltageEvap.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].evap_voltage)
    //         newChild.appendChild(textChild)
    //         selectVoltageEvap.appendChild(newChild)
    //     }
    // })
    // ipc.once('evap-series-evapBrand', (event, data) => {
    //     selectBrandEvap.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].evap_brand)
    //         newChild.appendChild(textChild)
    //         selectBrandEvap.appendChild(newChild)
    //     }
    // })
    ipc.once('evap-series-evapModel', (event, data) => {
        selectModelEvap.innerHTML = ""
        selectModelEvap.add(document.createElement("option"), selectModelEvap[0])
        selectModelEvap.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModelEvap.appendChild(newChild)
        }
    })
})

// -----------------------------------Evap Model Select---------------------------------------
selectModelEvap.addEventListener('change', () => {
    ipc.send('evap-model-select', selectModelEvap.options[selectModelEvap.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
    ipc.once('evap-model-evapVoltage', (event, data) => {
        selectVoltageEvap.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_voltage)
            newChild.appendChild(textChild)
            selectVoltageEvap.appendChild(newChild)
        }
    })
    ipc.once('evap-model-evapBrand', (event, data) => {
        selectBrandEvap.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_brand)
            newChild.appendChild(textChild)
            selectBrandEvap.appendChild(newChild)
        }
    })
    ipc.once('evap-model-evapSeries', (event, data) => {
        selectSeriesEvap.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeriesEvap.appendChild(newChild)
        }
    })
})

var modelId = ""
// -----------------------------------Calculate Click---------------------------------------
calButton.addEventListener('click', (e) => {
    if ((radioCoolingCdu.checked && radioCoolingEvap.checked) || radioModelCdu.checked) {
        if (radioCoolingCdu.checked) {
            // -------------------------Validate-----------------------------------
            let letters = /^[A-Za-zก-ฮ]+$/
            var calTempDiff = 0.0
            calTempDiff = textRoom.value - textSst.value
            var DiffTemp = Math.abs(calTempDiff)
            if (!selectRefrigerant.value) {
                ipc.send('validate-refrigerant-empty')
                return false
            }
            else if (textSst.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (!textSst.value) {
                ipc.send('validate-evap-empty', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            if (radioAppMed.checked) {
                if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textSst.value < -15 || textSst.value > 10 : (parseFloat(textSst.value) - 32) * (5 / 9) < -15 || (parseFloat(textSst.value) - 32) * (5 / 9) > 10) {
                    ipc.send('validate-evap-temp-med', selectUnit.options[selectUnit.selectedIndex].value)
                    return false
                }
            }
            if (radioAppLow.checked) {
                if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textSst.value < -40 || textSst.value > -10 : (parseFloat(textSst.value) - 32) * (5 / 9) < -40 || (parseFloat(textSst.value) - 32) * (5 / 9) > -10) {
                    ipc.send('validate-evap-temp-low', selectUnit.options[selectUnit.selectedIndex].value)
                    return false
                }
            }
            if (!textAmbient.value) {
                ipc.send('validate-ambient-empty', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (textAmbient.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textAmbient.value < -20 || textAmbient.value > 50 : (parseFloat(textAmbient.value) - 32) * (5 / 9) < -20 || (parseFloat(textAmbient.value) - 32) * (5 / 9) > 50) {
                ipc.send('validate-ambient-temp', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (textRoom.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (!textRoom.value) {
                ipc.send('validate-room-empty', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (parseInt(textRoom.value) <= parseInt(textSst.value)) {
                ipc.send('validate-room-temp')
                return false
            } else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? DiffTemp > 12 : DiffTemp > 21.6) {
                ipc.send('validate-diff-temp', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (textCoolingCdu.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (!textCoolingCdu.value) {
                ipc.send('validate-cooling-empty')
                return false
            }
            else if (textAcceptableMins.value.match(letters) || textAcceptablePlus.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (!textAcceptableMins.value || !textAcceptablePlus.value) {
                ipc.send('validate-acceptable-empty')
                return false
            }
            chart.destroy()
            chart2.destroy()
            // -----------------------------------------------Show Tab Contents------------------------------------------
            // document.getElementById("one-panel-content").setAttribute("hidden", true)
            // document.getElementById("two-panel-content").setAttribute("hidden", true)
            // document.getElementById("six-panel-content").setAttribute("hidden", true)
            // document.getElementById("seven-cdu-panel-content").setAttribute("hidden", true)
            // document.getElementById("ten-panel-content").setAttribute("hidden", true)
            document.getElementById("step-table-tab").removeAttribute("hidden")
            document.getElementById("datasheet-report").removeAttribute("hidden")
            document.getElementById("datasheet-report-evap").removeAttribute("hidden")
            document.getElementById("IS-report").removeAttribute("hidden")
            document.getElementById("chart-div").removeAttribute("hidden")
            document.getElementById("seven-panel").style.visibility = "visible"
            document.getElementById("eight-panel").style.visibility = "visible"
            document.getElementById("nine-panel").style.visibility = "visible"
            document.getElementById("ten-panel").style.visibility = "visible"
            // evapTap.removeAttribute("hidden")



            // -------------------------------------------Cal Result---------------------------------------------
            // if select brand 
            ipc.send('cdu-cal-click-cooling', selectBrandCdu.options[selectBrandCdu.selectedIndex].value, selectTypeCdu.options[selectTypeCdu.selectedIndex].value, selectSeriesCdu.options[selectSeriesCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textCoolingCdu.value, textSst.value, textAmbient.value, radioAppLow.checked, radioAppMed.checked, textAcceptableMins.value, textAcceptablePlus.value, checkAcceptEvap.checked, selectUnit.options[selectUnit.selectedIndex].value)
            ipc.once('cdu-cal-send-cooling', (event, data) => {
                if (data[0] == null) {
                    ipc.send('validate-data-empty')
                    for (let i = 0; i < 5; i++) {
                        let j = 0
                        for (let k = 0; k < cduTableRows.length; k++) {
                            cduTableRows[k].querySelectorAll("td")[i].innerHTML = null
                            cduTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                        }
                        for (let item in data[i]) {
                            if (item == "a_model") {
                                cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                j++;
                            }
                            else {
                                cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                j++;
                            }
                        }
                    }
                    evapTap.setAttribute("disabled", true)
                    document.getElementById("three-panel").innerHTML = null
                    document.getElementById("four-panel").innerHTML = null
                    document.getElementById("five-panel").innerHTML = null

                    document.getElementById("step-table-tab").setAttribute("hidden", true)
                    document.getElementById("datasheet-report").setAttribute("hidden", true)
                    document.getElementById("IS-report").setAttribute("hidden", true)
                    document.getElementById("chart-div").setAttribute("hidden", true)
                    document.getElementById("chart-alert").setAttribute("hidden", true)
                    document.getElementById("chart-note").setAttribute("hidden", true)

                    return false
                } else if (data[0]["a_model"] == "") {
                    ipc.send('validate-data-empty')
                    for (let i = 0; i < 5; i++) {
                        let j = 0
                        for (let k = 0; k < cduTableRows.length; k++) {
                            cduTableRows[k].querySelectorAll("td")[i].innerHTML = null
                            cduTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                        }
                        for (let item in data[i]) {
                            if (item == "a_model") {
                                cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                j++;
                            }
                            else {
                                cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                j++;
                            }
                        }
                    }
                    evapTap.setAttribute("disabled", true)
                    document.getElementById("three-panel").innerHTML = null
                    document.getElementById("four-panel").innerHTML = null
                    document.getElementById("five-panel").innerHTML = null

                    document.getElementById("step-table-tab").setAttribute("hidden", true)
                    document.getElementById("datasheet-report").setAttribute("hidden", true)
                    document.getElementById("IS-report").setAttribute("hidden", true)
                    document.getElementById("chart-div").setAttribute("hidden", true)
                    document.getElementById("chart-alert").setAttribute("hidden", true)
                    document.getElementById("chart-note").setAttribute("hidden", true)
                    return false
                }
                for (let i = 0; i < 5; i++) {
                    let j = 0
                    for (let k = 0; k < cduTableRows.length; k++) {
                        cduTableRows[k].querySelectorAll("td")[i].innerHTML = null
                        cduTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                    }
                    for (let item in data[i]) {
                        if (i == 0) {
                            cduTableRows[j].querySelectorAll("td")[i].classList.add("active")
                        }
                        if (item == "a_model") {
                            let labelChild = `<label id="model${i + 1}" class="model-result"><input type="radio" name="model">${data[i][item]}</label>`
                            cduTableRows[j].querySelectorAll("td")[i].innerHTML = labelChild
                            j++;
                        }
                        else {
                            cduTableRows[j].querySelectorAll("td")[i].innerHTML = `<div class="model-result-detail">${data[i][item]}</div>`

                            if (item == "d_coolingStep") {
                                cduTableRows[j].querySelectorAll("td")[i].style.fontWeight = "800"
                                if (parseFloat(data[i][item]) < 100) {
                                    cduTableRows[j].querySelectorAll("td")[i].style.color = "red"
                                }
                                else {
                                    cduTableRows[j].querySelectorAll("td")[i].style.color = "green"
                                }
                            }
                            j++;
                        }
                    }
                }

                // -----------------------------------------Tabs-----------------------------------------------------
                document.getElementsByName("model")[0].checked = true
                // ---------------------------------------First Technical Data---------------------------------------
                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_type_cooled == "Water cooled") {
                        let techTable = `
                      <table class="techTable">
                          <tr>
                              <th>Compressor</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Model Name</th>
                              <td>${techData[0].product_model}</td>
                          </tr>
                          <tr>
                              <th>Max Current (A)</th>
                              <td>${techData[0].tech_max_current}</td>
                          </tr>
                          <tr>
                              <th>Locked Rotor Amp (A)</th>
                              <td>${techData[0].tech_locked_rotor_current}</td>
                          </tr>
                          <tr>
                              <th>Voltage (V/Ph/Hz)</th>
                              <td>${techData[0].tech_compresser_voltage}</td>
                          </tr>
                          <tr>
                              <th>Oil Type</th>
                              <td>${techData[0].tech_oil_type}</td>
                          </tr>
                          <tr>
                              <th>Oil Recharge (Liters)</th>
                              <td>${techData[0].tech_oil_recharge}</td>
                          </tr>
                          <tr>
                              <th>Condenser</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Serface Area (m<sup>2<sup>)</th>
                              <td>${techData[0].tech_serface_area}</td>
                          </tr>
                          <tr>
                              <th>Heat exchanger</th>
                              <td>${techData[0].tech_number_of_curcuits}</td>
                          </tr>
                          <tr>
                              <th>Water Volume (Liters)</th>
                              <td>${techData[0].tech_water_volume}</td>
                          </tr>
                          <tr>
                              <th>Water IN/OUT Diameter (Inch)</th>
                              <td>${techData[0].tech_water_diameter}</td>
                          </tr>
                          <tr>
                          </tr>
                          <tr>
                              <th>Others</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Oil Seperator Volume (Liters)</th>
                              <td>${techData[0].tech_oil_seperator_volume}</td>
                          </tr>
                          <tr>
                              <th>Receiver Volume (Liters)</th>
                              <td>${techData[0].tech_receiver_volume}</td>
                          </tr>
                          <tr>
                              <th>Pipe Suction OD (Inch)</th>
                              <td>${techData[0].tech_pipes_suction}</td>
                          </tr>
                          <tr>
                              <th>Liquid OD (Inch)</th>
                              <td>${techData[0].tech_pipes_liquid}</td>
                          </tr>
                          <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                      </table>`
                        document.getElementById("three-panel").innerHTML = techTable
                    } else {
                        let techTable = `
                      <table class="techTable">
                          <tr>
                              <th>Compressor</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Model Name</th>
                              <td>${techData[0].product_model}</td>
                          </tr>
                          <tr>
                              <th>Max Current (A)</th>
                              <td>${techData[0].tech_max_current}</td>
                          </tr>
                          <tr>
                              <th>Locked Rotor Amp (A)</th>
                              <td>${techData[0].tech_locked_rotor_current}</td>
                          </tr>
                          <tr>
                              <th>Voltage (V/Ph/Hz)</th>
                              <td>${techData[0].tech_compresser_voltage}</td>
                          </tr>
                          <tr>
                              <th>Oil Type</th>
                              <td>${techData[0].tech_oil_type}</td>
                          </tr>
                          <tr>
                              <th>Oil Recharge (Liters)</th>
                              <td>${techData[0].tech_oil_recharge}</td>
                          </tr>
                          <tr>
                              <th>Fan Motor</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Number of Fan (Piece)</th>
                              <td>${techData[0].tech_number_of_fan}</td>
                          </tr>
                          <tr>
                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                          </tr>
                          <tr>
                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                          </tr>
                          <tr>
                              <th>Voltage (V/Ph/Hz)</th>
                              <td>${techData[0].tech_condenser_voltage}</td>
                          </tr>
                          <tr>
                              <th>Total Fan Motor Power (Watts)</th>
                              <td>${techData[0].tech_total_fan_power}</td>
                          </tr>
                          <tr>
                              <th>Others</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Oil Seperator Volume (Liters)</th>
                              <td>${techData[0].tech_oil_seperator_volume}</td>
                          </tr>
                          <tr>
                              <th>Receiver Volume (Liters)</th>
                              <td>${techData[0].tech_receiver_volume}</td>
                          </tr>
                          <tr>
                              <th>Pipe Suction OD (Inch)</th>
                              <td>${techData[0].tech_pipes_suction}</td>
                          </tr>
                          <tr>
                              <th>Liquid OD (Inch)</th>
                              <td>${techData[0].tech_pipes_liquid}</td>
                          </tr>
                          <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                      </table>`
                        document.getElementById("three-panel").innerHTML = techTable
                    }
                })

                // ---------------------------------------First Step Table---------------------------------------
                modelId = document.getElementById('model1').textContent
                ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                ipc.once('cdu-product-change-send', (event, data) => {
                    if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                        document.getElementById("start-evap").value = -40
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                        document.getElementById("step-ambient").value = 2
                        if (document.getElementById("table-step-dropdown").value == "Capacity") {
                            stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                            stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                            stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                            stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "COP") {
                            stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "Current") {
                            stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                            stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }

                    } else {
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                        document.getElementById("step-ambient").value = 2
                        if (document.getElementById("table-step-dropdown").value == "Capacity") {
                            stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                            stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                            stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                            stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "COP") {
                            stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "Current") {
                            stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                            stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                    }

                    document.getElementById("table-step-dropdown").addEventListener("change", () => {
                        if (document.getElementById("table-step-dropdown").value == "Capacity") {
                            if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                document.getElementById("start-evap").value = -40
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            } else {
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            }
                            stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)

                        }
                        else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                            if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                document.getElementById("start-evap").value = -40
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            } else {
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            }
                            stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)

                        }
                        else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                            if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                document.getElementById("start-evap").value = -40
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            } else {
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            }
                            stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                            if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                document.getElementById("start-evap").value = -40
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            } else {
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            }
                            stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "COP") {
                            if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                document.getElementById("start-evap").value = -40
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            } else {
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            }
                            stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "Current") {
                            if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                document.getElementById("start-evap").value = -40
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            } else {
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            }
                            stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                        else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                            if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                document.getElementById("start-evap").value = -40
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            } else {
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                document.getElementById("step-ambient").value = 2
                            }
                            stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        }
                    })

                    //--------------------------------------------------------------button reset----------------------------------------
                    buttonResetCdu.addEventListener('click', () => {
                        if (radioCoolingCdu.checked) {
                            ipc.send('cdu-product-change', modelId)
                            ipc.once('cdu-product-change-send', (event, data) => {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                        stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                        stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                        stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                        stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                                        stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                                        stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                        stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }


                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                        stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                        stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                        stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                        stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                                        stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                                        stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                        stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                }
                            })
                        }
                    })

                    //--------------------------------------------------------------button submit----------------------------------------
                    buttonSubmitCdu.addEventListener("click", () => {
                        if (radioCoolingCdu.checked) {
                            if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                stepChangeCap(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                stepChangePowerInput(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                stepChangeCondensing(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                stepChangeHeatReject(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "COP") {
                                stepChangeCOP(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Current") {
                                stepChangeCurrent(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                stepChangeMassFlow(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                        }

                    })
                })
                // --------------------------------------First Chart-------------------------------------------
                var plot = []
                ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                ipc.once('cdu-graph-point-send', (event, result) => {
                    let condensingValue = result.g_condensing;
                    let chartNote = result.tech_note
                    ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-plot-graph-send', (event, data) => {

                        // -----------------------------------Chart--------------------------------------
                        let ArrayPointX = []
                        let ArrayPointY = []
                        let array = []
                        let count1 = 0
                        for (const key in data[0]) {
                            let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                            let ObjectPoint = { "x": '', "y": '' }

                            if (key == "envelope_model" || key == "envelope_refrigerant") {
                                continue
                            }
                            else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                array.push(ObjectPoint)
                                ArrayPointX[count1] = data[0][key]
                                array[count1].x = data[0][key]
                            }
                            else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                ArrayPointY[count1 - arrayLength1] = data[0][key]
                                array[count1 - arrayLength1].y = data[0][key]
                            }
                            count1++
                        }
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            for (i = 0; i < array.length; i++) {
                                array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                            }
                        }
                        array.push(array[0])
                        plot = array
                        let MinX = Math.min.apply(Math, ArrayPointX)
                        let MaxX = Math.max.apply(Math, ArrayPointX)
                        let MinY = Math.min.apply(Math, ArrayPointY)
                        let MaxY = Math.max.apply(Math, ArrayPointY)
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                            MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                            MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                            MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                            condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                        }
                        let textEvapTemp = textSst.value
                        chartChange(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote)
                    })
                })

                // ---------------------------------------First Dimensions---------------------------------------
                ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                ipc.once('cdu-product-change-send', (event, imgModel) => {
                    document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-bot-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                })

                // ---------------------------------------First Document---------------------------------------
                ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                ipc.once('cdu-product-change-send', (event, docData) => {
                    if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                    } else if ((docData[0].product_document != "" || docData[0].product_document != null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                    } else if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure != "" || docData[0].product_brochure != null)) {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                    } else {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                    }
                    let classLink = document.getElementsByClassName("link-web")
                    for (let i = 0; i < classLink.length; i++) {
                        classLink[i].addEventListener('click', (event) => {
                            event.preventDefault();
                            require("electron").shell.openExternal("https://scmrefthai.com/");
                        })
                    }
                })
                // ---------------------------------------First DataSheet---------------------------------------
                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_brand == "PATTON") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div class="pdf-outer" id="savePDF-cdu">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/PATTON Logo_Die cut.png"></div>
                                <div class="header-text">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                    <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                </div>
                            </div>
                        </div>`
                        document.getElementById("header-datasheet").innerHTML = techTable
                    } else if (techData[0].product_brand == "KALTMER") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div class="pdf-outer" id="savePDF-cdu">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                <div class="header-text" id="header-datasheet">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                </div>
                            </div>
                        </div>`
                        document.getElementById("header-datasheet").innerHTML = techTable
                    } else if (techData[0].product_brand == "CUBO") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div class="pdf-outer" id="savePDF-cdu">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/CUBO LOGO.png"></div>
                                <div class="header-text" id="header-datasheet">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                </div>
                            </div>
                        </div>`
                        document.getElementById("header-datasheet").innerHTML = techTable
                    }
                })


                stepChangeCapDataSheet(document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)
                stepChangePowerInputDataSheet(document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)


                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {

                    let techTable =
                        `
                        <table class="pdf-table" id="middle-left">
                            <tr>
                                <th colspan="2" id="head-middle-left">Compressor</th>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Model Name</td>
                                <td class="pdf-table-right">${techData[0].tech_model_comp}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Max Current (A)</td>
                                <td class="pdf-table-right">${techData[0].tech_max_current}</td> 
                            </tr>
                            <tr>
                                <td id="border-middle-left">Locked Rotor Amp (A)</td>
                                <td class="pdf-table-right">${techData[0].tech_locked_rotor_current}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Voltage (V/Ph/Hz)</td>
                                <td class="pdf-table-right">${techData[0].tech_compresser_voltage}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Oil Type</td>
                                <td class="pdf-table-right">${techData[0].tech_oil_type}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Oil Recharge (Liters)</td>
                                <td class="pdf-table-right">${techData[0].tech_oil_recharge}</td>
                            </tr>
                        </table>             
                        `
                    document.getElementById("middle-left").innerHTML = techTable
                })
                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_type_cooled == "Water cooled") {
                        let techTable =
                            `<table class="pdf-table" id="middle-right">
                    <tr>
                        <th colspan="2" id="head-middle-right">Fan Motor</th>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Serface Area (m<sup>2</sup>)
                        </td>
                        <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Number of Curcuits</td>
                        <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Water Volume (Liters)</td>
                        <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                        <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                        <td class="pdf-table-right">-</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">&nbsp</td>
                        <td class="pdf-table-right">&nbsp</td>
                    </tr>
                </table>`
                        document.getElementById("middle-right").innerHTML = techTable
                    }
                    else {
                        let techTable =
                            `<table class="pdf-table" id="middle-right">
                    <tr>
                        <th colspan="2" id="head-middle-right">Fan Motor</th>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Number of Fan (Pieces)</td>
                        <td class="pdf-table-right">${techData[0].tech_number_of_fan}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Diameter (mm.)</td>
                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</td>
                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Voltage (V/Ph/Hz)</td>
                        <td class="pdf-table-right">${techData[0].tech_condenser_voltage}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                        <td class="pdf-table-right">${techData[0].tech_total_fan_power}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">&nbsp</td>
                        <td class="pdf-table-right">&nbsp</td>
                    </tr>
                </table>
                `
                        document.getElementById("middle-right").innerHTML = techTable
                    }

                })
                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    let techTable =
                        ` 
                <table class="pdf-table" id="middle-others">
                    <tr id="head-other">
                        <th colspan="2" >Others</th>
                    </tr>
                    <tr>
                        <td id="other-td-border">Oil Separator Volume (Liters)</td>
                        <td class="pdf-table-right">${techData[0].tech_oil_seperator_volume}</td>
                    </tr>
                    <tr>
                        <td  id="other-td-border">Receiver Volume (Liters)</td>
                        <td class="pdf-table-right">${techData[0].tech_receiver_volume}</td>
                    </tr>
                    <tr>
                        <td  id="other-td-border">Pipes Suction OD (Inch)</td>
                        <td class="pdf-table-right">${techData[0].tech_pipes_suction}</td>
                    </tr>
                    <tr>
                        <td id="other-td-border">Liquid OD (Inch)</td>
                        <td class="pdf-table-right">${techData[0].tech_pipes_liquid}</td>
                    </tr>
                    <tr>
                        <td id="other-td-border">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>
                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                    </tr>
                    <tr id="other-border-note">
                        <td colspan="2" id='font-note'>
                            Note: &nbsp&nbsp ${techData[0].tech_note}
                        </td>
                    </tr>
                </table>
                 `
                    document.getElementById("middle-others").innerHTML = techTable
                })
                ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                ipc.once('cdu-product-change-send', (event, imgModel) => {
                    document.getElementById("dimension-datasheet").innerHTML =
                        "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                })
                // ---------------------------------- First Operating Summary ------------------
                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_brand == "PATTON") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div id="header-IS">
                            <div class="IS-header">
                                <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                 src="../img/PATTON Logo_Die cut.png"></div>
                            <div class="IS-text">
                                <p class="IS-head-font">Operating Summary</p>
                                <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                            </div>
                        </div>
                    </div> `
                        document.getElementById("header-IS").innerHTML = techTable
                    } else if (techData[0].product_brand == "KALTMER") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div id="header-IS">
                            <div class="IS-header">
                                <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                 src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                <div class="IS-text">
                                    <p class="IS-head-font">Operating Summary</p>
                                    <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                    <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                </div>
                            </div>
                        </div> `
                        document.getElementById("header-IS").innerHTML = techTable
                    } else if (techData[0].product_brand == "CUBO") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div id="header-IS">
                            <div class="IS-header">
                                <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                 src=".../img/CUBO LOGO.png"></div>
                                <div class="IS-text">
                                    <p class="IS-head-font">Operating Summary</p>
                                    <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                    <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                </div>
                            </div>
                        </div> `
                        document.getElementById("header-IS").innerHTML = techTable
                    }

                })

                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    let checkTemp = ""
                    if (techData[0].product_med_temp == "1") {
                        if(radioAppLow.checked == false)
                            checkTemp = "Medium Temp"
                        else{
                            checkTemp = "Low Temp"
                        }
                    } else {
                        checkTemp = "Low Temp"
                    }
                    let techTable = `
                        <table class="IS-table" id="IS-top">
                        <tr>
                            <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                        </tr>
                        <tr>
                            <td id="border-IS-right">CDU Model</td>
                            <td class="IS-table-right">${techData[0].product_model}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">Brand</td>
                            <td class="IS-table-right">${techData[0].product_brand} </td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">Series</td>
                            <td class="IS-table-right">${techData[0].product_series}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">Refrigerant</td>
                            <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                            <td class="IS-table-right">${cutunit(data[0].e_cooling)}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">Application Temp</td>
                            <td class="IS-table-right">${checkTemp}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                            <td class="IS-table-right">${cutunit(data[0].f_powerInput)}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'}</td>
                            <td class="IS-table-right">${cutunit(data[0].h_heatReject)}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                            <td class="IS-table-right">${cutunit(data[0].i_cop)}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">Compressor Current (A) </td>
                            <td class="IS-table-right">${cutunit(data[0].j_compressor)}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                            <td class="IS-table-right">${cutunit(data[0].k_massflow)}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                            <td class="IS-table-right">${cutunit(data[0].g_condensing)}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design SST (Evap temp) (˚C)' : 'Design SST (Evap temp) (˚F)'}</td>
                            <td class="IS-table-right">${textSst.value}</td>
                        </tr>
                        <tr>
                            <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                            <td class="IS-table-right">${textAmbient.value}</td>
                        </tr>
                        </table> `
                    document.getElementById("IS-top").innerHTML = techTable
                })

                ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    let techTable = `<table class="IS-table" id="IS-Note-mid">
                    <tr>
                        <td >
                        Note: &nbsp&nbsp ${techData[0].tech_note}
                        </td>
                    </tr>
                </table> `
                    document.getElementById("IS-Note-mid").innerHTML = techTable
                })

                // --------------------------------------First  Operating Summary  Chart-------------------------------------------
                let plot2 = []
                ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                ipc.once('cdu-graph-point-send', (event, result) => {
                    let condensingValue = result.g_condensing;
                    ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-plot-graph-send', (event, data) => {

                        // -----------------------------------Chart--------------------------------------
                        let ArrayPointX = []
                        let ArrayPointY = []
                        let array = []
                        let count1 = 0
                        for (const key in data[0]) {
                            let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                            let ObjectPoint = { "x": '', "y": '' }

                            if (key == "envelope_model" || key == "envelope_refrigerant") {
                                continue
                            }
                            else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                array.push(ObjectPoint)
                                ArrayPointX[count1] = data[0][key]
                                array[count1].x = data[0][key]
                            }
                            else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                ArrayPointY[count1 - arrayLength1] = data[0][key]
                                array[count1 - arrayLength1].y = data[0][key]
                            }
                            count1++
                        }
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            for (i = 0; i < array.length; i++) {
                                array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                            }
                        }
                        array.push(array[0])
                        plot2 = array
                        let MinX = Math.min.apply(Math, ArrayPointX)
                        let MaxX = Math.max.apply(Math, ArrayPointX)
                        let MaxY = Math.max.apply(Math, ArrayPointY)
                        let MinY = Math.min.apply(Math, ArrayPointY)
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                            MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                            MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                            MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                            condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                        }
                        let textEvapTemp = textSst.value

                        chartChange2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId)
                    })
                })
                if (data.length >= 5) {
                    for (let m = 0; m < 5; m++) {
                        document.getElementById(`model${m + 1}`).addEventListener("change", (e) => {
                            modelId = document.getElementById(`model${m + 1}`).textContent
                            for (i = 0; i < cduTableRows.length; i++) {
                                for (j = 0; j < 5; j++) {
                                    cduTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                }
                                cduTableRows[i].querySelectorAll("td")[m].classList.add("active")
                            }
                            // ---------------------------------------Technical Data---------------------------------------
                            ipc.send('cdu-tech-change', document.getElementById(`model${m + 1}`).textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable = `
                        <table class="techTable">
                            <tr>
                                <th>Compressor</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Model Name</th>
                                <td>${techData[0].product_model}</td>
                            </tr>
                            <tr>
                                <th>Max Current (A)</th>
                                <td>${techData[0].tech_max_current}</td>
                            </tr>
                            <tr>
                                <th>Locked Rotor Amp (A)</th>
                                <td>${techData[0].tech_locked_rotor_current}</td>
                            </tr>
                            <tr>
                                <th>Voltage (V/Ph/Hz)</th>
                                <td>${techData[0].tech_compresser_voltage}</td>
                            </tr>
                            <tr>
                                <th>Oil Type</th>
                                <td>${techData[0].tech_oil_type}</td>
                            </tr>
                            <tr>
                                <th>Oil Recharge (Liters)</th>
                                <td>${techData[0].tech_oil_recharge}</td>
                            </tr>
                            <tr>
                                <th>Fan Motor</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Number of Fan (Piece)</th>
                                <td>${techData[0].tech_number_of_fan}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                            </tr>
                            <tr>
                                <th>Voltage (V/Ph/Hz)</th>
                                <td>${techData[0].tech_condenser_voltage}</td>
                            </tr>
                            <tr>
                                <th>Total Fan Motor Power (Watts)</th>
                                <td>${techData[0].tech_total_fan_power}</td>
                            </tr>
                            <tr>
                                <th>Others</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Oil Seperator Volume (Liters)</th>
                                <td>${techData[0].tech_oil_seperator_volume}</td>
                            </tr>
                            <tr>
                                <th>Receiver Volume (Liters)</th>
                                <td>${techData[0].tech_receiver_volume}</td>
                            </tr>
                            <tr>
                                <th>Pipe Suction OD (Inch)</th>
                                <td>${techData[0].tech_pipes_suction}</td>
                            </tr>
                            <tr>
                                <th>Liquid OD (Inch)</th>
                                <td>${techData[0].tech_pipes_liquid}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                        </table>`
                                document.getElementById("three-panel").innerHTML = techTable
                            })
                            // ---------------------------------------Step Table---------------------------------------
                            dropDownType = document.getElementById("table-step-dropdown").value
                            modelPositionId = document.getElementById(`model${m + 1}`).textContent
                            ipc.send('cdu-product-change', modelId)
                            ipc.once('cdu-product-change-send', (event, data) => {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2

                                }
                                if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                    stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                    stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                    stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                    stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "COP") {
                                    stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "Current") {
                                    stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                    stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }

                            })

                            // ---------------------------------------Dimensions---------------------------------------
                            ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                            ipc.once('cdu-product-change-send', (event, imgModel) => {
                                document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-bot-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                            })
                            // ---------------------------------------Document------------------------------------------
                            ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                            ipc.once('cdu-product-change-send', (event, docData) => {
                                if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                        "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                } else if ((docData[0].product_document != "" || docData[0].product_document != null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                        "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                } else if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure != "" || docData[0].product_brochure != null)) {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                        "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                } else {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                        "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                }
                                let classLink = document.getElementsByClassName("link-web")
                                for (let i = 0; i < classLink.length; i++) {
                                    classLink[i].addEventListener('click', (event) => {
                                        event.preventDefault();
                                        require("electron").shell.openExternal("https://scmrefthai.com/");
                                    })
                                }
                            })

                            ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                            ipc.once('cdu-graph-point-send', (event, result) => {
                                let condensingValue = result.g_condensing;
                                let chartNote = result.tech_note;
                                ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-plot-graph-send', (event, data) => {

                                    // -----------------------------------Chart--------------------------------------
                                    let ArrayPointX = []
                                    let ArrayPointY = []
                                    let array = []
                                    let count1 = 0
                                    for (const key in data[0]) {
                                        let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                        let ObjectPoint = { "x": '', "y": '' }

                                        if (key == "envelope_model" || key == "envelope_refrigerant") {
                                            continue
                                        }
                                        else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            array.push(ObjectPoint)
                                            ArrayPointX[count1] = data[0][key]
                                            array[count1].x = data[0][key]
                                        }
                                        else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            ArrayPointY[count1 - arrayLength1] = data[0][key]
                                            array[count1 - arrayLength1].y = data[0][key]
                                        }
                                        count1++
                                    }
                                    //test
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        for (i = 0; i < array.length; i++) {
                                            array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                            array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                        }
                                    }
                                    array.push(array[0])
                                    plot = array
                                    let MinX = Math.min.apply(Math, ArrayPointX)
                                    let MaxX = Math.max.apply(Math, ArrayPointX)
                                    let MinY = Math.min.apply(Math, ArrayPointY)
                                    let MaxY = Math.max.apply(Math, ArrayPointY)
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                        MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                        MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                        MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                        condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                    }
                                    let textEvapTemp = textSst.value
                                    updateChart(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote)
                                })
                            })
                            // ---------------------------------------DataSheet Result > 5---------------------------------------
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                if (techData[0].product_brand == "PATTON") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                    <div class="pdf-outer" id="savePDF-cdu">
                                        <div class="pdf-header">
                                            <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/PATTON Logo_Die cut.png"></div>
                                            <div class="header-text">
                                                <p class="text-head-font">Specification Sheet</p>
                                                <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                            </div>
                                        </div>
                                    </div>`
                                    document.getElementById("header-datasheet").innerHTML = techTable
                                } else if (techData[0].product_brand == "KALTMER") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                    <div class="pdf-outer" id="savePDF-cdu">
                                        <div class="pdf-header">
                                            <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                            <div class="header-text" id="header-datasheet">
                                                <p class="text-head-font">Specification Sheet</p>
                                                <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                            </div>
                                        </div>
                                    </div>`
                                    document.getElementById("header-datasheet").innerHTML = techTable
                                } else if (techData[0].product_brand == "CUBO") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                    <div class="pdf-outer" id="savePDF-cdu">
                                        <div class="pdf-header">
                                            <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/CUBO LOGO.png"></div>
                                            <div class="header-text" id="header-datasheet">
                                                <p class="text-head-font">Specification Sheet</p>
                                                <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                            </div>
                                        </div>
                                    </div>`
                                    document.getElementById("header-datasheet").innerHTML = techTable
                                }
                            })
                            stepChangeCapDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)
                            stepChangePowerInputDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)

                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable =
                                    `
                                <table class="pdf-table" id="middle-left">
                                    <tr>
                                        <th colspan="2" id="head-middle-left">Compressor</th>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Model Name</td>
                                        <td class="pdf-table-right">${techData[0].tech_model_comp}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Max Current (A)</td>
                                        <td class="pdf-table-right">${techData[0].tech_max_current}</td> 
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Locked Rotor Amp (A)</td>
                                        <td class="pdf-table-right">${techData[0].tech_locked_rotor_current}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Voltage (V/Ph/Hz)</td>
                                        <td class="pdf-table-right">${techData[0].tech_compresser_voltage}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Oil Type</td>
                                        <td class="pdf-table-right">${techData[0].tech_oil_type}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Oil Recharge (Liters)</td>
                                        <td class="pdf-table-right">${techData[0].tech_oil_recharge}</td>
                                    </tr>
                                </table>             
                                `
                                document.getElementById("middle-left").innerHTML = techTable
                            })
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                if (techData[0].product_type_cooled == "Water cooled") {
                                    let techTable =
                                        `<table class="pdf-table" id="middle-right">
                                        <tr>
                                            <th colspan="2" id="head-middle-right">Fan Motor</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Serface Area (m<sup>2</sup>)</td>
                                            <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Number of Curcuits</td>
                                            <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Water Volume (Liters)</td>
                                            <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                                         </tr>
                                        <tr>
                                             <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                                             <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                            <td class="pdf-table-right">-</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">&nbsp</td>
                                            <td class="pdf-table-right">&nbsp</td>
                                        </tr>
                                    </table>`
                                    document.getElementById("middle-right").innerHTML = techTable
                                }
                                else {
                                    let techTable =
                                        `<table class="pdf-table" id="middle-right">
                                        <tr>
                                            <th colspan="2" id="head-middle-right">Fan Motor</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Number of Fan (Pieces)</td>
                                            <td class="pdf-table-right">${techData[0].tech_number_of_fan}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Diameter (mm.)</td>
                                            <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</td>
                                            <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Voltage (V/Ph/Hz)</td>
                                            <td class="pdf-table-right">${techData[0].tech_condenser_voltage}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                            <td class="pdf-table-right">${techData[0].tech_total_fan_power}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">&nbsp</td>
                                            <td class="pdf-table-right">&nbsp</td>
                                        </tr>
                                    </table>`
                                    document.getElementById("middle-right").innerHTML = techTable
                                }

                            })
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable =
                                    ` 
                            <table class="pdf-table" id="middle-others">
                                <tr id="head-other">
                                    <th colspan="2" >Others</th>
                                </tr>
                                <tr>
                                    <td id="other-td-border">Oil Separator Volume (Liters)</td>
                                    <td class="pdf-table-right">${techData[0].tech_oil_seperator_volume}</td>
                                </tr>
                                <tr>
                                    <td  id="other-td-border">Receiver Volume (Liters)</td>
                                    <td class="pdf-table-right">${techData[0].tech_receiver_volume}</td>
                                </tr>
                                <tr>
                                    <td  id="other-td-border">Pipes Suction OD (Inch)</td>
                                    <td class="pdf-table-right">${techData[0].tech_pipes_suction}</td>
                                </tr>
                                <tr>
                                    <td id="other-td-border">Liquid OD (Inch)</td>
                                    <td class="pdf-table-right">${techData[0].tech_pipes_liquid}</td>
                                </tr>
                                <tr>
                                    <td id="other-td-border">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>
                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                                </tr>
                                <tr id="other-border-note">
                                    <td colspan="2" id='font-note'>
                                        Note: &nbsp&nbsp ${techData[0].tech_note}
                                    </td>
                                </tr>
                            </table>
                             `
                                document.getElementById("middle-others").innerHTML = techTable
                            })
                            ipc.send('cdu-product-change', modelId)
                            ipc.once('cdu-product-change-send', (event, imgModel) => {
                                document.getElementById("dimension-datasheet").innerHTML =
                                    "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                            })
                            // ----------------------------------  Operating Summary >5 ------------------
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                if (techData[0].product_brand == "PATTON") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                    <div id="header-IS">
                                        <div class="IS-header">
                                            <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                             src="../img/PATTON Logo_Die cut.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                                    document.getElementById("header-IS").innerHTML = techTable
                                } else if (techData[0].product_brand == "KALTMER") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                    <div id="header-IS">
                                        <div class="IS-header">
                                            <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                             src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                            <div class="IS-text">
                                                <p class="IS-head-font">Operating Summary</p>
                                                <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                            </div>
                                        </div>
                                    </div> `
                                    document.getElementById("header-IS").innerHTML = techTable
                                } else if (techData[0].product_brand == "CUBO") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                    <div id="header-IS">
                                        <div class="IS-header">
                                            <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                             src=".../img/CUBO LOGO.png"></div>
                                            <div class="IS-text">
                                                <p class="IS-head-font">Operating Summary</p>
                                                <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                            </div>
                                        </div>
                                    </div> `
                                    document.getElementById("header-IS").innerHTML = techTable
                                }

                            })

                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                    <table class="IS-table" id="IS-top">
                                    <tr>
                                        <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">CDU Model</td>
                                        <td class="IS-table-right">${techData[0].product_model}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">Brand</td>
                                        <td class="IS-table-right">${techData[0].product_brand} </td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">Series</td>
                                        <td class="IS-table-right">${techData[0].product_series}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">Refrigerant</td>
                                        <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                                        <td class="IS-table-right">${cutunit(data[m].e_cooling)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">Application Temp</td>
                                        <td class="IS-table-right">${checkTemp}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                                        <td class="IS-table-right">${cutunit(data[m].f_powerInput)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'} </td>
                                        <td class="IS-table-right">${cutunit(data[m].h_heatReject)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                                        <td class="IS-table-right">${cutunit(data[m].i_cop)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">Compressor Current (A) </td>
                                        <td class="IS-table-right">${cutunit(data[m].j_compressor)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                                        <td class="IS-table-right">${cutunit(data[m].k_massflow)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                                        <td class="IS-table-right">${cutunit(data[m].g_condensing)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>
                                        <td class="IS-table-right">${textSst.value}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                                        <td class="IS-table-right">${textAmbient.value}</td>
                                    </tr>
                                    </table> `
                                document.getElementById("IS-top").innerHTML = techTable
                            })
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable = `
                                <table class="IS-table" id="IS-Note-mid">
                                    <tr>
                                        <td >
                                            Note: &nbsp&nbsp ${techData[0].tech_note}
                                         </td>
                                    </tr>
                                </table> `
                                document.getElementById("IS-Note-mid").innerHTML = techTable
                            })

                            // ------------------------  Operating Summary chart madol data > 5 -------------------
                            ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                            ipc.once('cdu-graph-point-send', (event, result) => {
                                let condensingValue = result.g_condensing;
                                ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-plot-graph-send', (event, data) => {

                                    // ----------------------------------- Operating Summary Chart  model data   > 5 --------------------------------------
                                    let ArrayPointX = []
                                    let ArrayPointY = []
                                    let array = []
                                    let count1 = 0
                                    for (const key in data[0]) {
                                        let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                        let ObjectPoint = { "x": '', "y": '' }

                                        if (key == "envelope_model" || key == "envelope_refrigerant") {
                                            continue
                                        }
                                        else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            array.push(ObjectPoint)
                                            ArrayPointX[count1] = data[0][key]
                                            array[count1].x = data[0][key]
                                        }
                                        else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            ArrayPointY[count1 - arrayLength1] = data[0][key]
                                            array[count1 - arrayLength1].y = data[0][key]
                                        }
                                        count1++
                                    }
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        for (i = 0; i < array.length; i++) {
                                            array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                            array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                        }
                                    }
                                    array.push(array[0])
                                    plot2 = array
                                    let MinX = Math.min.apply(Math, ArrayPointX)
                                    let MaxX = Math.max.apply(Math, ArrayPointX)
                                    let MinY = Math.min.apply(Math, ArrayPointY)
                                    let MaxY = Math.max.apply(Math, ArrayPointY)
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                        MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                        MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                        MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                        condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                    }
                                    let textEvapTemp = textSst.value
                                    updateChart2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId)
                                })
                            })
                        })
                    }
                }
                else {
                    for (let m = 0; m < data.length; m++) {
                        document.getElementById(`model${m + 1}`).addEventListener("change", (e) => {
                            modelId = document.getElementById(`model${m + 1}`).textContent
                            for (i = 0; i < cduTableRows.length; i++) {
                                for (j = 0; j < 5; j++) {
                                    cduTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                }
                                cduTableRows[i].querySelectorAll("td")[m].classList.add("active")
                            }
                            // ---------------------------------------Technical Data---------------------------------------
                            ipc.send('cdu-tech-change', document.getElementById(`model${m + 1}`).textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable = `
                        <table class="techTable">
                            <tr>
                                <th>Compressor</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Model Name</th>
                                <td>${techData[0].product_model}</td>
                            </tr>
                            <tr>
                                <th>Max Current (A)</th>
                                <td>${techData[0].tech_max_current}</td>
                            </tr>
                            <tr>
                                <th>Locked Rotor Amp (A)</th>
                                <td>${techData[0].tech_locked_rotor_current}</td>
                            </tr>
                            <tr>
                                <th>Voltage (V/Ph/Hz)</th>
                                <td>${techData[0].tech_compresser_voltage}</td>
                            </tr>
                            <tr>
                                <th>Oil Type</th>
                                <td>${techData[0].tech_oil_type}</td>
                            </tr>
                            <tr>
                                <th>Oil Recharge (Liters)</th>
                                <td>${techData[0].tech_oil_recharge}</td>
                            </tr>
                            <tr>
                                <th>Fan Motor</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Number of Fan (Piece)</th>
                                <td>${techData[0].tech_number_of_fan}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                            </tr>
                            <tr>
                                <th>Voltage (V/Ph/Hz)</th>
                                <td>${techData[0].tech_condenser_voltage}</td>
                            </tr>
                            <tr>
                                <th>Total Fan Motor Power (Watts)</th>
                                <td>${techData[0].tech_total_fan_power}</td>
                            </tr>
                            <tr>
                                <th>Others</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Oil Seperator Volume (Liters)</th>
                                <td>${techData[0].tech_oil_seperator_volume}</td>
                            </tr>
                            <tr>
                                <th>Receiver Volume (Liters)</th>
                                <td>${techData[0].tech_receiver_volume}</td>
                            </tr>
                            <tr>
                                <th>Pipe Suction OD (Inch)</th>
                                <td>${techData[0].tech_pipes_suction}</td>
                            </tr>
                            <tr>
                                <th>Liquid OD (Inch)</th>
                                <td>${techData[0].tech_pipes_liquid}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                        </table>`
                                document.getElementById("three-panel").innerHTML = techTable
                            })
                            // ---------------------------------------Step Table---------------------------------------
                            dropDownType = document.getElementById("table-step-dropdown").value
                            modelPositionId = document.getElementById(`model${m + 1}`).textContent
                            ipc.send('cdu-product-change', modelId)
                            ipc.once('cdu-product-change-send', (event, data) => {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2

                                }
                                if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                    stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                    stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                    stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                    stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "COP") {
                                    stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "Current") {
                                    stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                                else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                    stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }

                            })

                            // ---------------------------------------Dimensions---------------------------------------
                            ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                            ipc.once('cdu-product-change-send', (event, imgModel) => {
                                document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-bot-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                            })
                            // ---------------------------------------Document------------------------------------------
                            ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                            ipc.once('cdu-product-change-send', (event, docData) => {
                                if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                        "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                } else if ((docData[0].product_document != "" || docData[0].product_document != null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                        "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                } else if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure != "" || docData[0].product_brochure != null)) {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                        "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                } else {
                                    document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                        "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                }
                                let classLink = document.getElementsByClassName("link-web")
                                for (let i = 0; i < classLink.length; i++) {
                                    classLink[i].addEventListener('click', (event) => {
                                        event.preventDefault();
                                        require("electron").shell.openExternal("https://scmrefthai.com/");
                                    })
                                }
                            })

                            ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                            ipc.once('cdu-graph-point-send', (event, result) => {
                                let condensingValue = result.g_condensing;
                                let chartNote = result.tech_note;
                                ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-plot-graph-send', (event, data) => {

                                    // -----------------------------------Chart--------------------------------------
                                    let ArrayPointX = []
                                    let ArrayPointY = []
                                    let array = []
                                    let count1 = 0
                                    for (const key in data[0]) {
                                        let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                        let ObjectPoint = { "x": '', "y": '' }

                                        if (key == "envelope_model" || key == "envelope_refrigerant") {
                                            continue
                                        }
                                        else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            array.push(ObjectPoint)
                                            ArrayPointX[count1] = data[0][key]
                                            array[count1].x = data[0][key]
                                        }
                                        else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            ArrayPointY[count1 - arrayLength1] = data[0][key]
                                            array[count1 - arrayLength1].y = data[0][key]
                                        }
                                        count1++
                                    }
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        for (i = 0; i < array.length; i++) {
                                            array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                            array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                        }
                                    }
                                    array.push(array[0])
                                    plot = array
                                    let MinX = Math.min.apply(Math, ArrayPointX)
                                    let MaxX = Math.max.apply(Math, ArrayPointX)
                                    let MinY = Math.min.apply(Math, ArrayPointY)
                                    let MaxY = Math.max.apply(Math, ArrayPointY)
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                        MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                        MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                        MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                        condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                    }
                                    let textEvapTemp = textSst.value
                                    updateChart(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote)
                                })
                            })
                        })
                        // ---------------------------------------DataSheet Result < 5---------------------------------------
                        ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-tech-change-send', (event, techData) => {

                            if (techData[0].product_brand == "PATTON") {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                <div class="pdf-outer" id="savePDF-cdu">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/PATTON Logo_Die cut.png"></div>
                                        <div class="header-text">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div>`
                                document.getElementById("header-datasheet").innerHTML = techTable
                            } else if (techData[0].product_brand == "KALTMER") {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                <div class="pdf-outer" id="savePDF-cdu">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                        <div class="header-text" id="header-datasheet">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div>`
                                document.getElementById("header-datasheet").innerHTML = techTable
                            } else if (techData[0].product_brand == "CUBO") {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                <div class="pdf-outer" id="savePDF-cdu">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/CUBO LOGO.png"></div>
                                        <div class="header-text" id="header-datasheet">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div>`
                                document.getElementById("header-datasheet").innerHTML = techTable
                            }
                        })
                        stepChangeCapDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)
                        stepChangePowerInputDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)

                        ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-tech-change-send', (event, techData) => {
                            let techTable =
                                `
                            <table class="pdf-table" id="middle-left">
                                <tr>
                                    <th colspan="2" id="head-middle-left">Compressor</th>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Model Name</td>
                                    <td class="pdf-table-right">${techData[0].tech_model_comp}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Max Current (A)</td>
                                    <td class="pdf-table-right">${techData[0].tech_max_current}</td> 
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Locked Rotor Amp (A)</td>
                                    <td class="pdf-table-right">${techData[0].tech_locked_rotor_current}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Voltage (V/Ph/Hz)</td>
                                    <td class="pdf-table-right">${techData[0].tech_compresser_voltage}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Oil Type</td>
                                    <td class="pdf-table-right">${techData[0].tech_oil_type}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Oil Recharge (Liters)</td>
                                    <td class="pdf-table-right">${techData[0].tech_oil_recharge}</td>
                                </tr>
                            </table>             
                            `
                            document.getElementById("middle-left").innerHTML = techTable
                        })
                        ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-tech-change-send', (event, techData) => {
                            if (techData[0].product_type_cooled == "Water cooled") {
                                let techTable =
                                    `<table class="pdf-table" id="middle-right">
                                        <tr>
                                            <th colspan="2" id="head-middle-right">Fan Motor</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Serface Area (m<sup>2</sup>)</td>
                                            <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Number of Curcuits</td>
                                            <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Water Volume (Liters)</td>
                                            <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                                         </tr>
                                        <tr>
                                             <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                                             <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                            <td class="pdf-table-right">-</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">&nbsp</td>
                                            <td class="pdf-table-right">&nbsp</td>
                                        </tr>
                                    </table>`
                                document.getElementById("middle-right").innerHTML = techTable
                            }
                            else {
                                let techTable =
                                    `<table class="pdf-table" id="middle-right">
                                        <tr>
                                            <th colspan="2" id="head-middle-right">Fan Motor</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Number of Fan (Pieces)</td>
                                            <td class="pdf-table-right">${techData[0].tech_number_of_fan}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Diameter (mm.)</td>
                                            <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</td>
                                            <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Voltage (V/Ph/Hz)</td>
                                            <td class="pdf-table-right">${techData[0].tech_condenser_voltage}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                            <td class="pdf-table-right">${techData[0].tech_total_fan_power}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">&nbsp</td>
                                            <td class="pdf-table-right">&nbsp</td>
                                        </tr>
                                    </table>`
                                document.getElementById("middle-right").innerHTML = techTable
                            }
                        })
                        ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-tech-change-send', (event, techData) => {
                            let techTable =
                                ` 
                        <table class="pdf-table" id="middle-others">
                            <tr id="head-other">
                                <th colspan="2" >Others</th>
                            </tr>
                            <tr>
                                <td id="other-td-border">Oil Separator Volume (Liters)</td>
                                <td class="pdf-table-right">${techData[0].tech_oil_seperator_volume}</td>
                            </tr>
                            <tr>
                                <td  id="other-td-border">Receiver Volume (Liters)</td>
                                <td class="pdf-table-right">${techData[0].tech_receiver_volume}</td>
                            </tr>
                            <tr>
                                <td  id="other-td-border">Pipes Suction OD (Inch)</td>
                                <td class="pdf-table-right">${techData[0].tech_pipes_suction}</td>
                            </tr>
                            <tr>
                                <td id="other-td-border">Liquid OD (Inch)</td>
                                <td class="pdf-table-right">${techData[0].tech_pipes_liquid}</td>
                            </tr>
                            <tr>
                                <td id="other-td-border">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>
                                <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                            <tr id="other-border-note">
                                <td colspan="2" id='font-note'>
                                    Note: &nbsp&nbsp ${techData[0].tech_note}
                                </td>
                            </tr>
                        </table>
                         `
                            document.getElementById("middle-others").innerHTML = techTable
                        })
                        ipc.send('cdu-product-change', modelId)
                        ipc.once('cdu-product-change-send', (event, imgModel) => {
                            document.getElementById("dimension-datasheet").innerHTML =
                                "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                        })
                        // ----------------------------------  Operating Summary <5 ------------------
                        ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-tech-change-send', (event, techData) => {
                            if (techData[0].product_brand == "PATTON") {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                <div id="header-IS">
                                    <div class="IS-header">
                                        <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                         src="../img/PATTON Logo_Die cut.png"></div>
                                    <div class="IS-text">
                                        <p class="IS-head-font">Operating Summary</p>
                                        <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                        <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                        <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                    </div>
                                </div>
                            </div> `
                                document.getElementById("header-IS").innerHTML = techTable
                            } else if (techData[0].product_brand == "KALTMER") {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                <div id="header-IS">
                                    <div class="IS-header">
                                        <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                         src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                                document.getElementById("header-IS").innerHTML = techTable
                            } else if (techData[0].product_brand == "CUBO") {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                <div id="header-IS">
                                    <div class="IS-header">
                                        <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                         src=".../img/CUBO LOGO.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                                document.getElementById("header-IS").innerHTML = techTable
                            }

                        })

                        ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-tech-change-send', (event, techData) => {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <table class="IS-table" id="IS-top">
                                <tr>
                                    <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">CDU Model</td>
                                    <td class="IS-table-right">${techData[0].product_model}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Brand</td>
                                    <td class="IS-table-right">${techData[0].product_brand} </td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Series</td>
                                    <td class="IS-table-right">${techData[0].product_series}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Refrigerant</td>
                                    <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                                    <td class="IS-table-right">${cutunit(data[m].e_cooling)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Application Temp</td>
                                    <td class="IS-table-right">${checkTemp}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                                    <td class="IS-table-right">${cutunit(data[m].f_powerInput)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'} </td>
                                    <td class="IS-table-right">${cutunit(data[m].h_heatReject)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                                    <td class="IS-table-right">${cutunit(data[m].i_cop)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Compressor Current (A) </td>
                                    <td class="IS-table-right">${cutunit(data[m].j_compressor)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                                    <td class="IS-table-right">${cutunit(data[m].k_massflow)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                                    <td class="IS-table-right">${cutunit(data[m].g_condensing)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>
                                    <td class="IS-table-right">${textSst.value}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                                    <td class="IS-table-right">${textAmbient.value}</td>
                                </tr>
                                </table> `
                            document.getElementById("IS-top").innerHTML = techTable
                        })
                        ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-tech-change-send', (event, techData) => {
                            let techTable = `
                            <table class="IS-table" id="IS-Note-mid">
                                <tr>
                                    <td >
                                        Note: &nbsp&nbsp ${techData[0].tech_note}
                                     </td>
                                </tr>
                            </table> `
                            document.getElementById("IS-Note-mid").innerHTML = techTable
                        })

                        // ------------------------  Operating Summary chart madol data > 5 -------------------
                        ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                        ipc.once('cdu-graph-point-send', (event, result) => {
                            let condensingValue = result.g_condensing;
                            ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-plot-graph-send', (event, data) => {

                                // ----------------------------------- Operating Summary Chart  model data   > 5 --------------------------------------
                                let ArrayPointX = []
                                let ArrayPointY = []
                                let array = []
                                let count1 = 0
                                for (const key in data[0]) {
                                    let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                    let ObjectPoint = { "x": '', "y": '' }

                                    if (key == "envelope_model" || key == "envelope_refrigerant") {
                                        continue
                                    }
                                    else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                        if ((data[0][key]) == null) {
                                            count1++
                                            continue
                                        }
                                        array.push(ObjectPoint)
                                        ArrayPointX[count1] = data[0][key]
                                        array[count1].x = data[0][key]
                                    }
                                    else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                        if ((data[0][key]) == null) {
                                            count1++
                                            continue
                                        }
                                        ArrayPointY[count1 - arrayLength1] = data[0][key]
                                        array[count1 - arrayLength1].y = data[0][key]
                                    }
                                    count1++
                                }
                                if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                    for (i = 0; i < array.length; i++) {
                                        array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                        array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                    }
                                }
                                array.push(array[0])
                                plot2 = array
                                let MinX = Math.min.apply(Math, ArrayPointX)
                                let MaxX = Math.max.apply(Math, ArrayPointX)
                                let MinY = Math.min.apply(Math, ArrayPointY)
                                let MaxY = Math.max.apply(Math, ArrayPointY)
                                if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                    MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                    MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                    MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                    MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                    condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                }
                                let textEvapTemp = textSst.value
                                updateChart2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId)
                            })
                        })
                    }
                }
                if (radioCoolingEvap.checked) {
                    // document.getElementById("seven-panel-content").setAttribute("hidden", true)
                    // document.getElementById("step-table-tab").removeAttribute("hidden")
                    // -------------------------------------------Cal Result---------------------------------------------
                    ipc.send('evap-cal-click-cooling', selectBrandEvap.options[selectBrandEvap.selectedIndex].value, selectVoltageEvap.options[selectVoltageEvap.selectedIndex].value, selectSeriesEvap.options[selectSeriesEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textCoolingEvap.value, textSst.value, textRoom.value, radioAppLow.checked, radioAppMed.checked, textAcceptableMins.value, textAcceptablePlus.value, checkAccept.checked, selectUnit.options[selectUnit.selectedIndex].value)

                    ipc.once('evap-cal-send-cooling', (event, data) => {
                        if (data[0] == null || data[0]["a_model"] == "") {
                            // ipc.send('validate-data-empty')
                            for (let i = 0; i < 5; i++) {
                                let j = 0
                                for (let k = 0; k < evapTableRows.length; k++) {
                                    evapTableRows[k].querySelectorAll("td")[i].innerHTML = null
                                    evapTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                                }
                                for (let item in data[i]) {
                                    if (item == "a_model") {
                                        evapTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                        j++;
                                    }
                                    else {
                                        evapTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                        j++;
                                    }
                                }
                            }
                            document.getElementById("seven-panel").style.visibility = "hidden"
                            document.getElementById("eight-panel").style.visibility = "hidden"
                            document.getElementById("nine-panel").style.visibility = "hidden"
                            document.getElementById("ten-panel").style.visibility = "hidden"

                            // document.getElementById("step-table-tab").setAttribute("hidden", true)
                            document.getElementById("datasheet-report-evap").setAttribute("hidden", true)

                            return false
                        }
                        for (let i = 0; i < 5; i++) {
                            let j = 0
                            for (let k = 0; k < evapTableRows.length; k++) {
                                evapTableRows[k].querySelectorAll("td")[i].innerHTML = null
                                evapTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                            }
                            for (let item in data[i]) {
                                if (i == 0) {
                                    evapTableRows[j].querySelectorAll("td")[i].classList.add("active")
                                }
                                if (item == "a_model") {
                                    let labelChild = `<label id="model-evap${i + 1}" class="model-result"><input type="radio" name="model-evap">${data[i][item]}</label>`
                                    evapTableRows[j].querySelectorAll("td")[i].innerHTML = labelChild
                                    j++;
                                }
                                else {
                                    evapTableRows[j].querySelectorAll("td")[i].innerHTML = `<div class="model-result-detail">${data[i][item]}</div>`

                                    if (item == "d_coolingStep") {
                                        evapTableRows[j].querySelectorAll("td")[i].style.fontWeight = "800"
                                        if (parseFloat(data[i][item]) < 100) {
                                            evapTableRows[j].querySelectorAll("td")[i].style.color = "red"
                                        }
                                        else {
                                            evapTableRows[j].querySelectorAll("td")[i].style.color = "green"
                                        }
                                    }
                                    j++;
                                }
                            }
                        }
                        // -----------------------------------------Tabs-----------------------------------------------------
                        document.getElementsByName("model-evap")[0].checked = true
                        // ----------------------------------------------------Technical Table-------------------------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let techTable = `
                                      <table class="techTableEvap">
                                          <tr>
                                              <th>Unit Coolers</th>
                                              <td></td>
                                          </tr>
                                          <tr>
                                              <th>Model Name</th>
                                              <td>${techData[0].evap_model}</td>
                                          </tr>
                                          <tr>
                                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                          </tr>
                                          <tr>
                                              <th>Fan Motor</th>
                                              <td></td>
                                          </tr>
                                          <tr>
                                              <th>Number of Fan (Pieces)</th>
                                              <td>${techData[0].evap_number_of_fan}</td>
                                          </tr>
                                          <tr>
                                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                          </tr>
                                          <tr>
                                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                          </tr>
                                          <tr>
                                              <th>Voltage (V/Ph/Hz)</th>
                                              <td>${techData[0].evap_voltage}</td>
                                          </tr>
                                          <tr>
                                              <th>Total Fan Motor Power (Watts)</th>
                                              <td>${techData[0].evap_total_fan_motor_power}</td>
                                          </tr>
                                          <tr>
                                              <th>Coil</th>
                                              <td></td>
                                          </tr>
                                          <tr>
                                              <th>Curcuit Volume</th>
                                              <td>${techData[0].evap_curcuit_volume}</td>
                                          </tr>
                                          <tr>
                                              <th>Distributor Inlet (Inch)</th>
                                              <td>${techData[0].evap_distributor_inlet}</td>
                                          </tr>
                                          <tr>
                                              <th>Suction Outlet (Inch)</th>
                                              <td>${techData[0].evap_suction_outlet}</td>
                                          </tr>
                                          <tr>
                                              <th>FPI</th>
                                              <td>${techData[0].evap_fpi}</td>
                                          </tr>
                                          <tr>
                                              <th>Defrost (Watts)</th>
                                              <td>${techData[0].evap_defrost_heater}</td>
                                          </tr>         
                                      </table>`
                            document.getElementById("seven-panel").innerHTML = techTable
                        })
                        // ---------------------------------------First Dimensions---------------------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                            if(imgModel[0].evap_l != '-'){
                                imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                            }
                            if(imgModel[0].evap_w != '-'){
                                imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                            }
                            if(imgModel[0].evap_h != '-'){
                                imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                            }
                            if(imgModel[0].evap_a != '-'){
                                imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                            }
                            if(imgModel[0].evap_b != '-'){
                                imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                            }
                            if(imgModel[0].evap_c != '-'){
                                imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                            }
                            if(imgModel[0].evap_d != '-'){
                                imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                            }
                            imgdimen += "</div>"
                            document.getElementById("eight-panel").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("eight-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series") {
                            //     document.getElementById("eight-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("eight-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                            // }
                        })
                        // ---------------------------------------First Document---------------------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, docData) => {
                            if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                    "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                            } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                    "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                            } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                    "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                            } else {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                    "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                            }
                            let classLink = document.getElementsByClassName("link-web-evap")
                            for (let i = 0; i < classLink.length; i++) {
                                classLink[i].addEventListener('click', (event) => {
                                    event.preventDefault();
                                    require("electron").shell.openExternal("https://scmrefthai.com/");
                                })
                            }
                        })
                        //------------------------------------------ Data sheet--------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            if (techData[0].evap_brand == "PATTON") {
                                let checkTemp = ""
                                if (radioAppLow.checked) {
                                    checkTemp = "Low Temp"
                                } else {
                                    checkTemp = "Medium Temp"
                                }
                                let techTable = `
                                        <div class="pdf-outer-evap" id="savePDF">
                                            <div class="pdf-header-evap">
                                                <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                    src="../img/PATTON Logo_Die cut.png"></div>
                                                <div class="header-text-evap">
                                                    <p class="text-head-font-evap">Specification Sheet</p>
                                                    <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                    <p class="text-head-font-evap"> Unit Coolers</p>
                                                    <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                </div>
                                            </div>
                                        </div>`
                                document.getElementById("header-datasheet-evap").innerHTML = techTable
                            } else if (techData[0].evap_brand == "KALTMER") {
                                let checkTemp = ""
                                if (radioAppLow.checked) {
                                    checkTemp = "Low Temp"
                                } else {
                                    checkTemp = "Medium Temp"
                                }
                                let techTable = `
                                        <div class="pdf-outer-evap" id="savePDF">
                                            <div class="pdf-header-evap">
                                                <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                    src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                <div class="header-text-evap" id="header-datasheet-evap">
                                                    <p class="text-head-font-evap">Specification Sheet</p>
                                                    <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                    <p class="text-head-font-evap"> Unit Coolers</p>
                                                    <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                </div>
                                            </div>
                                        </div>`
                                document.getElementById("header-datasheet-evap").innerHTML = techTable
                            } else if (techData[0].evap_brand == "CUBO") {
                                let checkTemp = ""
                                if (radioAppLow.checked) {
                                    checkTemp = "Low Temp"
                                } else {
                                    checkTemp = "Medium Temp"
                                }
                                let techTable = `
                                        <div class="pdf-outer-evap" id="savePDF">
                                            <div class="pdf-header-evap">
                                                <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                    src="../img/CUBO LOGO.png"></div>
                                                <div class="header-text-evap" id="header-datasheet-evap">
                                                    <p class="text-head-font-evap">Specification Sheet</p>
                                                    <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                    <p class="text-head-font-evap"> Unit Coolers</p>
                                                    <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                                </div>
                                            </div>
                                        </div>`
                                document.getElementById("header-datasheet-evap").innerHTML = techTable
                            }

                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let getCooling = evapTableRows[4].querySelector("td").textContent
                            let coolingValue = parseFloat(getCooling)
                            let checkTemp = ""
                            if (radioAppLow.checked) {
                                checkTemp = "Low Temp"
                            } else {
                                checkTemp = "Medium Temp"
                            }
                            let techTable = `
                                    <table class="pdf-table-evap" id="evap-top-evap">
                                        <tr>
                                            <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">Model Name</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">Series</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                                            <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">Refrigerant</td>  
                                            <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                                        </tr>
                                        <tr >
                                            <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                                            <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">Application Temp</td>  
                                            <td class="pdf-table-right-evap">${checkTemp}</td>  
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'}</td>  
                                            <td class="pdf-table-right-evap">${textRoom.value}</td>  
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">Design TD (K) </td>  
                                            <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                            <td class="pdf-table-right-evap">${textSst.value}</td>  
                                        </tr>
                                        <tr>
                                            <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                            <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                        </tr>
                                    </table>`
                            document.getElementById("evap-top-evap").innerHTML = techTable
                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let techTable =
                                `
                                    <table class="pdf-table-evap" id="middle-left-evap">
                                        <tr>
                                            <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                            <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                                            <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                                        </tr>
                                        <tr>
                                            <td id="border-middle-left-evap">Fan Qty</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                                        </tr>
                                    </table>             
                                  `
                            document.getElementById("middle-left-evap").innerHTML = techTable
                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let techTable =
                                `<table class="pdf-table-evap" id="middle-right-evap">
                                            <tr>
                                                <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                                                <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                                                <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                                                <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                                                <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-right-evap">FPI</td>
                                                <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                                            </tr>
                                        </table>
                                        `
                            document.getElementById("middle-right-evap").innerHTML = techTable
                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                            if(imgModel[0].evap_l != '-'){
                                imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                            }
                            if(imgModel[0].evap_w != '-'){
                                imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                            }
                            if(imgModel[0].evap_h != '-'){
                                imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                            }
                            if(imgModel[0].evap_a != '-'){
                                imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                            }
                            if(imgModel[0].evap_b != '-'){
                                imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                            }
                            if(imgModel[0].evap_c != '-'){
                                imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                            }
                            if(imgModel[0].evap_d != '-'){
                                imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                            }
                            imgdimen += "</div>"
                            document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("dimension-datasheet-evap").innerHTML =
                            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series") {
                            //     document.getElementById("dimension-datasheet-evap").innerHTML =
                            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("dimension-datasheet-evap").innerHTML =
                            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                            // }
                        })
                        if (data.length >= 5) {
                            for (let m = 0; m < 5; m++) {
                                document.getElementById(`model-evap${m + 1}`).addEventListener("change", (e) => {
                                    modelId = document.getElementById(`model-evap${m + 1}`).textContent
                                    for (i = 0; i < evapTableRows.length; i++) {
                                        for (j = 0; j < 5; j++) {
                                            evapTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                        }
                                        evapTableRows[i].querySelectorAll("td")[m].classList.add("active")
                                    }
                                    // ----------------------------------------------------Technical Table-------------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable = `
                                                <table class="techTableEvap">
                                                    <tr>
                                                        <th>Unit Coolers</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Model Name</th>
                                                        <td>${techData[0].evap_model}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                                        <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Fan Motor</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Number of Fan (Pieces)</th>
                                                        <td>${techData[0].evap_number_of_fan}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                                        <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                                        <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Voltage (V/Ph/Hz)</th>
                                                        <td>${techData[0].evap_voltage}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Total Fan Motor Power (Watts)</th>
                                                        <td>${techData[0].evap_total_fan_motor_power}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Coil</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Curcuit Volume</th>
                                                        <td>${techData[0].evap_curcuit_volume}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Distributor Inlet (Inch)</th>
                                                        <td>${techData[0].evap_distributor_inlet}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Suction Outlet (Inch)</th>
                                                        <td>${techData[0].evap_suction_outlet}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>FPI</th>
                                                        <td>${techData[0].evap_fpi}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Defrost (Watts)</th>
                                                        <td>${techData[0].evap_defrost_heater}</td>
                                                    </tr>
                                                    
                                                
                                                </table>`
                                        document.getElementById("seven-panel").innerHTML = techTable

                                    })
                                    // ---------------------------------------Dimensions---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("eight-panel").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                    // ---------------------------------------Document---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, docData) => {
                                        if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        } else {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        }
                                        let classLink = document.getElementsByClassName("link-web")
                                        for (let i = 0; i < classLink.length; i++) {
                                            classLink[i].addEventListener('click', (event) => {
                                                event.preventDefault();
                                                require("electron").shell.openExternal("https://scmrefthai.com/");
                                            })
                                        }
                                    })
                                    //------------------------------------------ Data sheet--------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        if (techData[0].evap_brand == "PATTON") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                    <div class="pdf-outer-evap" id="savePDF">
                                                        <div class="pdf-header-evap">
                                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                                src="../img/PATTON Logo_Die cut.png"></div>
                                                            <div class="header-text-evap">
                                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                                <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                            </div>
                                                        </div>
                                                    </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "KALTMER") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                    <div class="pdf-outer-evap" id="savePDF">
                                                        <div class="pdf-header-evap">
                                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                                src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                            <div class="header-text-evap" id="header-datasheet-evap">
                                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                                <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                            </div>
                                                        </div>
                                                    </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "CUBO") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                    <div class="pdf-outer-evap" id="savePDF">
                                                        <div class="pdf-header-evap">
                                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                                src="../img/CUBO LOGO.png"></div>
                                                            <div class="header-text-evap" id="header-datasheet-evap">
                                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                                <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                                            </div>
                                                        </div>
                                                    </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        }

                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let getCooling = evapTableRows[4].querySelector("td").textContent
                                        let coolingValue = parseFloat(getCooling)
                                        let checkTemp = ""
                                        if (radioAppLow.checked) {
                                            checkTemp = "Low Temp"
                                        } else {
                                            checkTemp = "Medium Temp"
                                        }
                                        let techTable = `
                                                <table class="pdf-table-evap" id="evap-top-evap">
                                                    <tr>
                                                        <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Model Name</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Series</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                                                        <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Refrigerant</td>  
                                                        <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                                                    </tr>
                                                    <tr >
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                                                        <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Application Temp</td>  
                                                        <td class="pdf-table-right-evap">${checkTemp}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'}</td>  
                                                        <td class="pdf-table-right-evap">${textRoom.value}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Design TD (K) </td>  
                                                        <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                                        <td class="pdf-table-right-evap">${textSst.value}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                                    </tr>
                                                </table>`
                                        document.getElementById("evap-top-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `
                                                <table class="pdf-table-evap" id="middle-left-evap">
                                                    <tr>
                                                        <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Fan Qty</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                                                    </tr>
                                                </table>             
                                            `
                                        document.getElementById("middle-left-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `<table class="pdf-table-evap" id="middle-right-evap">
                                                        <tr>
                                                            <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">FPI</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                                                        </tr>
                                                    </table>
                                                    `
                                        document.getElementById("middle-right-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                })
                            }
                        }
                        else {
                            for (let m = 0; m < data.length; m++) {
                                document.getElementById(`model-evap${m + 1}`).addEventListener("change", (e) => {
                                    modelId = document.getElementById(`model-evap${m + 1}`).textContent
                                    for (i = 0; i < evapTableRows.length; i++) {
                                        for (j = 0; j < data.length; j++) {
                                            evapTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                        }
                                        evapTableRows[i].querySelectorAll("td")[m].classList.add("active")
                                    }
                                    // ----------------------------------------------------Technical Table-------------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable = `
                                                <table class="techTableEvap">
                                                    <tr>
                                                        <th>Unit Coolers</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Model Name</th>
                                                        <td>${techData[0].evap_model}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                                        <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Fan Motor</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Number of Fan (Pieces)</th>
                                                        <td>${techData[0].evap_number_of_fan}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                                        <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                                        <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Voltage (V/Ph/Hz)</th>
                                                        <td>${techData[0].evap_voltage}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Total Fan Motor Power (Watts)</th>
                                                        <td>${techData[0].evap_total_fan_motor_power}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Coil</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Curcuit Volume</th>
                                                        <td>${techData[0].evap_curcuit_volume}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Distributor Inlet (Inch)</th>
                                                        <td>${techData[0].evap_distributor_inlet}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Suction Outlet (Inch)</th>
                                                        <td>${techData[0].evap_suction_outlet}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>FPI</th>
                                                        <td>${techData[0].evap_fpi}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Defrost (Watts)</th>
                                                        <td>${techData[0].evap_defrost_heater}</td>
                                                    </tr>
                                                    
                                                
                                                </table>`
                                        document.getElementById("seven-panel").innerHTML = techTable

                                    })
                                    // ---------------------------------------Dimensions---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("eight-panel").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                    // ---------------------------------------Document---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, docData) => {
                                        if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        } else {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        }
                                        let classLink = document.getElementsByClassName("link-web")
                                        for (let i = 0; i < classLink.length; i++) {
                                            classLink[i].addEventListener('click', (event) => {
                                                event.preventDefault();
                                                require("electron").shell.openExternal("https://scmrefthai.com/");
                                            })
                                        }
                                    })
                                    //------------------------------------------ Data sheet--------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        if (techData[0].evap_brand == "PATTON") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                    <div class="pdf-outer-evap" id="savePDF">
                                                        <div class="pdf-header-evap">
                                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                                src="../img/PATTON Logo_Die cut.png"></div>
                                                            <div class="header-text-evap">
                                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                                <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                            </div>
                                                        </div>
                                                    </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "KALTMER") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                    <div class="pdf-outer-evap" id="savePDF">
                                                        <div class="pdf-header-evap">
                                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                                src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                            <div class="header-text-evap" id="header-datasheet-evap">
                                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                                <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                            </div>
                                                        </div>
                                                    </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "CUBO") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                    <div class="pdf-outer-evap" id="savePDF">
                                                        <div class="pdf-header-evap">
                                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                                src="../img/CUBO LOGO.png"></div>
                                                            <div class="header-text-evap" id="header-datasheet-evap">
                                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                                <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                                            </div>
                                                        </div>
                                                    </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        }

                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let getCooling = evapTableRows[4].querySelector("td").textContent
                                        let coolingValue = parseFloat(getCooling)
                                        let checkTemp = ""
                                        if (radioAppLow.checked) {
                                            checkTemp = "Low Temp"
                                        } else {
                                            checkTemp = "Medium Temp"
                                        }
                                        let techTable = `
                                                <table class="pdf-table-evap" id="evap-top-evap">
                                                    <tr>
                                                        <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Model Name</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Series</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                                                        <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Refrigerant</td>  
                                                        <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                                                    </tr>
                                                    <tr >
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                                                        <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Application Temp</td>  
                                                        <td class="pdf-table-right-evap">${checkTemp}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'}</td>  
                                                        <td class="pdf-table-right-evap">${textRoom.value}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">Design TD (K) </td>  
                                                        <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                                        <td class="pdf-table-right-evap">${textSst.value}</td>  
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                                    </tr>
                                                </table>`
                                        document.getElementById("evap-top-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `
                                                <table class="pdf-table-evap" id="middle-left-evap">
                                                    <tr>
                                                        <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Fan Qty</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                                                    </tr>
                                                </table>             
                                            `
                                        document.getElementById("middle-left-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `<table class="pdf-table-evap" id="middle-right-evap">
                                                        <tr>
                                                            <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                                                        </tr>
                                                        <tr>
                                                            <td id="border-middle-right-evap">FPI</td>
                                                            <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                                                        </tr>
                                                    </table>
                                                    `
                                        document.getElementById("middle-right-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                })
                            }
                        }
                        // autoClick(data)
                    })
                } else if (radioModelEvap.checked) {
                    let letters = /^[A-Za-zก-ฮ]+$/
                    var calTempDiff = 0.0
                    calTempDiff = textRoom.value - textSst.value
                    var DiffTemp = Math.abs(calTempDiff)
                    if (selectModelEvap.options[selectModelEvap.selectedIndex].value == "") {
                        ipc.send('validate-selectmodel-empty')
                        return false
                    }
                    else if (!textSst.value) {
                        ipc.send('validate-evap-empty', selectUnit.options[selectUnit.selectedIndex].value)
                        return false
                    }
                    else if (!textRoom.value) {
                        ipc.send('validate-room-empty', selectUnit.options[selectUnit.selectedIndex].value)
                        return false
                    }
                    else if (textSst.value.match(letters) || textRoom.value.match(letters) || textCoolingEvap.value.match(letters)) {
                        ipc.send('validate-letters')
                        return false
                    }
                    else if (parseInt(textRoom.value) <= parseInt(textSst.value)) {
                        ipc.send('validate-room-temp')
                        return false
                    }
                    else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? DiffTemp > 12 : DiffTemp > 21.6) {
                        ipc.send('validate-diff-temp', selectUnit.options[selectUnit.selectedIndex].value)
                        return false
                    }
                    else if (selectModelEvap.value == "") {
                        ipc.send('validate-selectmodel-empty')
                    }
                    // ------------------------------------------------Model Result----------------------------------------------
                    ipc.send('evap-cal-click-model', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textSst.value, textRoom.value, selectUnit.options[selectUnit.selectedIndex].value)
                    ipc.once('evap-cal-send-model', (event, data) => {
                        let i = 0;
                        for (let j = 0; j < 5; j++) {
                            for (let k = 0; k < evapTableRows.length; k++) {
                                evapTableRows[k].querySelectorAll("td")[j].innerHTML = null
                                evapTableRows[k].querySelectorAll("td")[j].classList.remove("active")
                            }
                        }
                        for (let item in data) {
                            if (i == 0) {
                                evapTableRows[i].querySelector("td").innerHTML = `<div id="model1" class="model-result-detail">${data[item]}</div>`
                                i++;
                                continue;
                            }
                            evapTableRows[i].querySelector("td").innerHTML = `<div class='model-result-detail'>${data[item]}</div>`
                            if (item == "d_coolingStep") {
                                evapTableRows[i].querySelector("td").style.fontWeight = "800"
                                if (parseFloat(data[item]) < 100) {
                                    evapTableRows[i].querySelector("td").style.color = "red"
                                }
                                else {
                                    evapTableRows[i].querySelector("td").style.color = "green"
                                }
                            }
                            i++;
                        }

                    })
                    // ----------------------------------------------------Technical Table-------------------------------------------
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let techTable = `
                                  <table class="techTableEvap">
                                      <tr>
                                          <th>Unit Coolers</th>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <th>Model Name</th>
                                          <td>${techData[0].evap_model}</td>
                                      </tr>
                                      <tr>
                                          <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                          <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                      </tr>
                                      <tr>
                                          <th>Fan Motor</th>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <th>Number of Fan (Pieces)</th>
                                          <td>${techData[0].evap_number_of_fan}</td>
                                      </tr>
                                      <tr>
                                          <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                          <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                      </tr>
                                      <tr>
                                          <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                          <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                      </tr>
                                      <tr>
                                          <th>Voltage (V/Ph/Hz)</th>
                                          <td>${techData[0].evap_voltage}</td>
                                      </tr>
                                      <tr>
                                          <th>Total Fan Motor Power (Watts)</th>
                                          <td>${techData[0].evap_total_fan_motor_power}</td>
                                      </tr>
                                      <tr>
                                          <th>Coil</th>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <th>Curcuit Volume</th>
                                          <td>${techData[0].evap_curcuit_volume}</td>
                                      </tr>
                                      <tr>
                                          <th>Distributor Inlet (Inch)</th>
                                          <td>${techData[0].evap_distributor_inlet}</td>
                                      </tr>
                                      <tr>
                                          <th>Suction Outlet (Inch)</th>
                                          <td>${techData[0].evap_suction_outlet}</td>
                                      </tr>
                                      <tr>
                                          <th>FPI</th>
                                          <td>${techData[0].evap_fpi}</td>
                                      </tr>
                                      <tr>
                                          <th>Defrost (Watts)</th>
                                          <td>${techData[0].evap_defrost_heater}</td>
                                      </tr>
                                      
                                     
                                  </table>`
                        document.getElementById("seven-panel").innerHTML = techTable
                    })
                    // ---------------------------------------First Dimensions---------------------------------------
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, imgModel) => {
                        var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                        if(imgModel[0].evap_l != '-'){
                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                        }
                        if(imgModel[0].evap_w != '-'){
                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                        }
                        if(imgModel[0].evap_h != '-'){
                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                        }
                        if(imgModel[0].evap_a != '-'){
                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                        }
                        if(imgModel[0].evap_b != '-'){
                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                        }
                        if(imgModel[0].evap_c != '-'){
                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                        }
                        if(imgModel[0].evap_d != '-'){
                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                        }
                        imgdimen += "</div>"
                        document.getElementById("eight-panel").innerHTML = imgdimen
                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // } else if (imgModel[0].evap_series == "JC Series") {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // }
                        // else {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                        // }
                    })
                    // ---------------------------------------First Document---------------------------------------
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, docData) => {
                        if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                        } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                        } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                        } else {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                        }
                        let classLink = document.getElementsByClassName("link-web-evap")
                        for (let i = 0; i < classLink.length; i++) {
                            classLink[i].addEventListener('click', (event) => {
                                event.preventDefault();
                                require("electron").shell.openExternal("https://scmrefthai.com/");
                            })
                        }
                    })
                    //------------------------------------------ Data sheet--------------------------
                    let modelPositionId = selectModelEvap.options[selectModelEvap.selectedIndex].value
                    ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        if (techData[0].evap_brand == "PATTON") {
                            let checkTemp = ""
                            if (radioAppLow.checked) {
                                checkTemp = "Low Temp"
                            } else {
                                checkTemp = "Medium Temp"
                            }
                            let techTable = `
                                <div class="pdf-outer" id="savePDF">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/PATTON Logo_Die cut.png"></div>
                                        <div class="header-text">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font">${techData[0].evap_model}</p>
                                            <p class="text-head-font"> Unit Coolers</p>
                                            <p class="text-head-font"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                        </div>
                                    </div>
                                </div>`
                            document.getElementById("header-datasheet").innerHTML = techTable
                        } else if (techData[0].evap_brand == "KALTMER") {
                            let checkTemp = ""
                            if (radioAppLow.checked) {
                                checkTemp = "Low Temp"
                            } else {
                                checkTemp = "Medium Temp"
                            }
                            let techTable = `
                                <div class="pdf-outer" id="savePDF">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                        <div class="header-text" id="header-datasheet">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font">${techData[0].evap_model}</p>
                                            <p class="text-head-font"> Unit Coolers</p>
                                            <p class="text-head-font"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                        </div>
                                    </div>
                                </div>`
                            document.getElementById("header-datasheet").innerHTML = techTable
                        } else if (techData[0].product_brand == "CUBO") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <div class="pdf-outer" id="savePDF">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/CUBO LOGO.png"></div>
                                        <div class="header-text" id="header-datasheet">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font">${techData[0].evap_model}</p>
                                            <p class="text-head-font"> Unit Coolers</p>
                                            <p class="text-head-font"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                        </div>
                                    </div>
                                </div>`
                            document.getElementById("header-datasheet").innerHTML = techTable
                        }

                    })

                    ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let getCooling = evapTableRows[4].querySelector("td").textContent
                        let coolingValue = parseFloat(getCooling)
                        let checkTemp = ""
                        if (radioAppLow.checked) {
                            checkTemp = "Low Temp"
                        } else {
                            checkTemp = "Medium Temp"
                        }
                        let techTable = `
                            <table class="pdf-table" id="evap-top">
                                <tr>
                                    <th  colspan="2" id="head-middle-top">Unit coolers</th>
                                </tr>
                                <tr>
                                    <td id="border-middle-top">Model Name</td>
                                    <td class="pdf-table-right">${techData[0].evap_model}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-top">Series</td>
                                    <td class="pdf-table-right">${techData[0].evap_series}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-top">Voltage (V/Ph/Hz)</td>  
                                    <td class="pdf-table-right">${techData[0].evap_voltage}</td>  
                                </tr>
                                <tr>
                                    <td id="border-middle-top">Refrigerant</td>  
                                    <td class="pdf-table-right">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                                </tr>
                                <tr >
                                    <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>
                                    <td class="pdf-table-right">${coolingValue.toFixed(2)}</td>  
                                </tr>
                                <tr>
                                    <td id="border-middle-top">Application Temp</td>  
                                    <td class="pdf-table-right">${checkTemp}</td>  
                                </tr>
                                <tr>
                                    <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'} </td>
                                    <td class="pdf-table-right">${textRoom.value}</td>  
                                </tr>
                                <tr>
                                    <td id="border-middle-top">Design TD (K) </td>  
                                    <td class="pdf-table-right">${textRoom.value - textSst.value}</td>  
                                </tr>
                                <tr>
                                    <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td> 
                                    <td class="pdf-table-right">${textSst.value}</td>  
                                </tr>
                                <tr>
                                    <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                </tr>
                            </table>`
                        document.getElementById("evap-top").innerHTML = techTable
                    })

                    ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let techTable =
                            `
                            <table class="pdf-table" id="middle-left">
                                <tr>
                                    <th colspan="2" id="head-middle-left">Fan Motor Data</th>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Air Volume (m<sup>3</sup>/h)</td>
                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Fan Qty</td>
                                    <td class="pdf-table-right">${techData[0].evap_number_of_fan}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Fan Motor Power (Watts)</td>
                                    <td class="pdf-table-right">${techData[0].evap_total_fan_motor_power}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-left">Fan Motor Current (Amps)</td>
                                    <td class="pdf-table-right">${techData[0].evap_total_fan_motor_current}</td>
                                </tr>
                            </table>             
                        `
                        document.getElementById("middle-left").innerHTML = techTable
                    })
                    ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let techTable =
                            `<table class="pdf-table" id="middle-right">
                            <tr>
                                <th colspan="2" id="head-middle-right">Coil Data</th>
                            </tr>
                            <tr>
                                <td id="border-middle-right">Internal Volume (dm<sup>3</sup>)</td>
                                <td class="pdf-table-right">${techData[0].evap_curcuit_volume}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-right">Coil Inlet (Inch)</td>
                                <td class="pdf-table-right">${techData[0].evap_distributor_inlet}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-right">Suct Outlet (Inch)</td>
                                <td class="pdf-table-right">${techData[0].evap_suction_outlet}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-right">Defrost Heater (Watts)</td>
                                <td class="pdf-table-right">${techData[0].evap_defrost_heater}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-right">FPI</td>
                                <td class="pdf-table-right">${techData[0].evap_fpi}</td>
                            </tr>
                        </table>
                        `
                        document.getElementById("middle-right").innerHTML = techTable
                    })
                    //     let techTable =
                    //         `<table class="pdf-table" id="middle-others">
                    //     <tr>
                    //         <td colspan="2" style="background-color: white;" id="font-note">
                    //             Note: &nbsp&nbsp rating condition is based on a super heating(10K) ,
                    //             Subcooling
                    //             within the limits of the condensing unit
                    //         </td>
                    //     </tr>
                    // </table>
                    // `
                    //     document.getElementById("middle-others").innerHTML = techTable
                    ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, imgModel) => {
                        var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                        if(imgModel[0].evap_l != '-'){
                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                        }
                        if(imgModel[0].evap_w != '-'){
                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                        }
                        if(imgModel[0].evap_h != '-'){
                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                        }
                        if(imgModel[0].evap_a != '-'){
                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                        }
                        if(imgModel[0].evap_b != '-'){
                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                        }
                        if(imgModel[0].evap_c != '-'){
                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                        }
                        if(imgModel[0].evap_d != '-'){
                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                        }
                        imgdimen += "</div>"
                        document.getElementById("eight-panel").innerHTML = imgdimen
                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // } else if (imgModel[0].evap_series == "JC Series") {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // }
                        // else {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                        // }
                    })
                    // ----------------------------------  Operating Summary >5 ------------------
                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        if (techData[0].product_brand == "PATTON") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                    <div id="header-IS">
                                        <div class="IS-header">
                                            <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/PATTON Logo_Die cut.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                    </div> `
                            document.getElementById("header-IS").innerHTML = techTable
                        } else if (techData[0].product_brand == "KALTMER") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <div id="header-IS">
                                    <div class="IS-header">
                                        <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                        src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                            document.getElementById("header-IS").innerHTML = techTable
                        } else if (techData[0].product_brand == "CUBO") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <div id="header-IS">
                                    <div class="IS-header">
                                        <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                        src=".../img/CUBO LOGO.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                            document.getElementById("header-IS").innerHTML = techTable
                        }

                    })

                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                                <table class="IS-table" id="IS-top">
                                <tr>
                                    <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">CDU Model</td>
                                    <td class="IS-table-right">${techData[0].product_model}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Brand</td>
                                    <td class="IS-table-right">${techData[0].product_brand} </td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Series</td>
                                    <td class="IS-table-right">${techData[0].product_series}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Refrigerant</td>
                                    <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                                    <td class="IS-table-right">${cutunit(data.e_cooling)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Application Temp</td>
                                    <td class="IS-table-right">${checkTemp}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                                    <td class="IS-table-right">${cutunit(data.f_powerInput)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'} </td>
                                    <td class="IS-table-right">${cutunit(data.h_heatReject)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                                    <td class="IS-table-right">${cutunit(data.i_cop)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Compressor Current (A) </td>
                                    <td class="IS-table-right">${cutunit(data.j_compressor)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                                    <td class="IS-table-right">${cutunit(data.k_massflow)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                                    <td class="IS-table-right">${cutunit(data.g_condensing)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>
                                    <td class="IS-table-right">${textSst.value}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                                    <td class="IS-table-right">${textAmbient.value}</td>
                                </tr>
                                </table> `
                        document.getElementById("IS-top").innerHTML = techTable
                    })
                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        let techTable = `
                            <table class="IS-table" id="IS-Note-mid">
                                <tr>
                                    <td >
                                        Note: &nbsp&nbsp ${techData[0].tech_note}
                                    </td>
                                </tr>
                            </table> `
                        document.getElementById("IS-Note-mid").innerHTML = techTable
                    })

                    // ------------------------  Operating Summary chart madol data > 5 -------------------
                    ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                    ipc.once('cdu-graph-point-send', (event, result) => {
                        let condensingValue = result.g_condensing;
                        ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-plot-graph-send', (event, data) => {

                            // ----------------------------------- Operating Summary Chart  model data   > 5 --------------------------------------
                            let ArrayPointX = []
                            let ArrayPointY = []
                            let array = []
                            let count1 = 0
                            for (const key in data[0]) {
                                let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                let ObjectPoint = { "x": '', "y": '' }

                                if (key == "envelope_model" || key == "envelope_refrigerant") {
                                    continue
                                }
                                else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                    if ((data[0][key]) == null) {
                                        count1++
                                        continue
                                    }
                                    array.push(ObjectPoint)
                                    ArrayPointX[count1] = data[0][key]
                                    array[count1].x = data[0][key]
                                }
                                else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                    if ((data[0][key]) == null) {
                                        count1++
                                        continue
                                    }
                                    ArrayPointY[count1 - arrayLength1] = data[0][key]
                                    array[count1 - arrayLength1].y = data[0][key]
                                }
                                count1++
                            }
                            if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                for (i = 0; i < array.length; i++) {
                                    array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                    array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                }
                            }
                            array.push(array[0])
                            plot2 = array
                            let MinX = Math.min.apply(Math, ArrayPointX)
                            let MaxX = Math.max.apply(Math, ArrayPointX)
                            let MinY = Math.min.apply(Math, ArrayPointY)
                            let MaxY = Math.max.apply(Math, ArrayPointY)
                            if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                            }
                            let textEvapTemp = textSst.value
                            updateChart2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId)
                        })
                    })
                }
                autoClick(data)
            })

            // brand is null
        }
        else if (radioModelCdu.checked) {
            chart.destroy()
            chart2.destroy()
            // -----------------------------------------------Show Tab Contents------------------------------------------
            // document.getElementById("one-panel-content").setAttribute("hidden", true)
            // document.getElementById("two-panel-content").setAttribute("hidden", true)
            // document.getElementById("six-panel-content").setAttribute("hidden", true)
            // document.getElementById("seven-cdu-panel-content").setAttribute("hidden", true)
            // document.getElementById("ten-panel-content").setAttribute("hidden", true)
            document.getElementById("step-table-tab").removeAttribute("hidden")
            document.getElementById("datasheet-report").removeAttribute("hidden")
            document.getElementById("datasheet-report-evap").removeAttribute("hidden")
            document.getElementById("IS-report").removeAttribute("hidden")
            document.getElementById("chart-div").removeAttribute("hidden")
            document.getElementById("seven-panel").style.visibility = "visible"
            document.getElementById("eight-panel").style.visibility = "visible"
            document.getElementById("nine-panel").style.visibility = "visible"
            document.getElementById("ten-panel").style.visibility = "visible"
            if (selectModelCdu.value == "") {
                ipc.send('validate-selectmodel-empty')
            }
            // document.getElementById("text-acceptable").value = "check"
            // ------------------------------------------------Model Result----------------------------------------------
            ipc.send('cdu-cal-click-model', selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textSst.value, textAmbient.value, selectUnit.options[selectUnit.selectedIndex].value)
            ipc.once('cdu-cal-send-model', (event, data) => {
                let i = 0;
                for (let j = 0; j < 5; j++) {
                    for (let k = 0; k < cduTableRows.length; k++) {
                        cduTableRows[k].querySelectorAll("td")[j].innerHTML = null
                        cduTableRows[k].querySelectorAll("td")[j].classList.remove("active")
                    }
                }
                for (let item in data) {
                    if (i == 0) {
                        cduTableRows[i].querySelector("td").innerHTML = `<div id="model1" class="model-result-detail">${data[item]}</div>`
                        i++;
                        continue;
                    }
                    cduTableRows[i].querySelector("td").innerHTML = `<div class="model-result-detail">${data[item]}</div>`
                    if (item == "d_coolingStep") {
                        cduTableRows[i].querySelector("td").style.fontWeight = "800"
                        if (parseFloat(data[item]) < 100) {
                            cduTableRows[i].querySelector("td").style.color = "red"
                        }
                        else {
                            cduTableRows[i].querySelector("td").style.color = "green"
                        }
                    }
                    i++;
                }
                // ------------------------------------------------technical----------------------------------------------
                ipc.send('cdu-tech-change', cduTableRows[0].querySelector("td").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_type_cooled == "Water cooled") {
                        let techTable = `
                        <table class="techTable">
                            <tr>
                                <th>Compressor</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Model Name</th>
                                <td>${techData[0].product_model}</td>
                            </tr>
                            <tr>
                                <th>Max Current (A)</th>
                                <td>${techData[0].tech_max_current}</td>
                            </tr>
                            <tr>
                                <th>Locked Rotor Amp (A)</th>
                                <td>${techData[0].tech_locked_rotor_current}</td>
                            </tr>
                            <tr>
                                <th>Voltage (V/Ph/Hz)</th>
                                <td>${techData[0].tech_compresser_voltage}</td>
                            </tr>
                            <tr>
                                <th>Oil Type</th>
                                <td>${techData[0].tech_oil_type}</td>
                            </tr>
                            <tr>
                                <th>Oil Recharge (Liters)</th>
                                <td>${techData[0].tech_oil_recharge}</td>
                            </tr>
                            <tr>
                                <th>Condenser</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Serface Area (m<sup>2<sup>)</th>
                                <td>${techData[0].tech_serface_area}</td>
                            </tr>
                            <tr>
                                <th>Heat exchanger</th>
                                <td>${techData[0].tech_number_of_curcuits}</td>
                            </tr>
                            <tr>
                                <th>Water Volume (Liters)</th>
                                <td>${techData[0].tech_water_volume}</td>
                            </tr>
                            <tr>
                                <th>Water IN/OUT Diameter (Inch)</th>
                                <td>${techData[0].tech_water_diameter}</td>
                            </tr>
                            <tr>
                            </tr>
                            <tr>
                                <th>Others</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Oil Seperator Volume (Liters)</th>
                                <td>${techData[0].tech_oil_seperator_volume}</td>
                            </tr>
                            <tr>
                                <th>Receiver Volume (Liters)</th>
                                <td>${techData[0].tech_receiver_volume}</td>
                            </tr>
                            <tr>
                                <th>Pipe Suction OD (Inch)</th>
                                <td>${techData[0].tech_pipes_suction}</td>
                            </tr>
                            <tr>
                                <th>Liquid OD (Inch)</th>
                                <td>${techData[0].tech_pipes_liquid}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                        </table>`
                        document.getElementById("three-panel").innerHTML = techTable
                    } else {
                        let techTable = `
                        <table class="techTable">
                            <tr>
                                <th>Compressor</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Model Name</th>
                                <td>${techData[0].product_model}</td>
                            </tr>
                            <tr>
                                <th>Max Current (A)</th>
                                <td>${techData[0].tech_max_current}</td>
                            </tr>
                            <tr>
                                <th>Locked Rotor Amp (A)</th>
                                <td>${techData[0].tech_locked_rotor_current}</td>
                            </tr>
                            <tr>
                                <th>Voltage (V/Ph/Hz)</th>
                                <td>${techData[0].tech_compresser_voltage}</td>
                            </tr>
                            <tr>
                                <th>Oil Type</th>
                                <td>${techData[0].tech_oil_type}</td>
                            </tr>
                            <tr>
                                <th>Oil Recharge (Liters)</th>
                                <td>${techData[0].tech_oil_recharge}</td>
                            </tr>
                            <tr>
                                <th>Fan Motor</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Number of Fan (Piece)</th>
                                <td>${techData[0].tech_number_of_fan}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                            </tr>
                            <tr>
                                <th>Voltage (V/Ph/Hz)</th>
                                <td>${techData[0].tech_condenser_voltage}</td>
                            </tr>
                            <tr>
                                <th>Total Fan Motor Power (Watts)</th>
                                <td>${techData[0].tech_total_fan_power}</td>
                            </tr>
                            <tr>
                                <th>Others</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Oil Seperator Volume (Liters)</th>
                                <td>${techData[0].tech_oil_seperator_volume}</td>
                            </tr>
                            <tr>
                                <th>Receiver Volume (Liters)</th>
                                <td>${techData[0].tech_receiver_volume}</td>
                            </tr>
                            <tr>
                                <th>Pipe Suction OD (Inch)</th>
                                <td>${techData[0].tech_pipes_suction}</td>
                            </tr>
                            <tr>
                                <th>Liquid OD (Inch)</th>
                                <td>${techData[0].tech_pipes_liquid}</td>
                            </tr>
                            <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                        </table>`
                        document.getElementById("three-panel").innerHTML = techTable
                    }
                })
                // ------------------------------------------------Step Table----------------------------------------------
                let modelPositionId = cduTableRows[0].querySelector("td").textContent
                ipc.send('cdu-product-change', selectModelCdu.options[selectModelCdu.selectedIndex].value)
                ipc.once('cdu-product-change-send', (event, data) => {
                    if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                        document.getElementById("start-evap").value = -40
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                        document.getElementById("step-ambient").value = 2

                    } else {
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                        document.getElementById("step-ambient").value = 2

                    }

                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                        stepChangeCapDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                        stepChangePowerInputDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                        stepChangeCondensingDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                        stepChangeHeatRejectDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                        stepChangeCOPDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                        stepChangeCurrentDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                        stepChangeMassFlowDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }


                    //--------------------------------------------------------------button reset----------------------------------------

                    buttonResetCdu.addEventListener('click', () => {
                        if (radioModelCdu.checked) {
                            ipc.send('cdu-product-change', selectModelCdu.options[selectModelCdu.selectedIndex].value)
                            ipc.once('cdu-product-change-send', (event, data) => {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                        stepChangeCapDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                        stepChangePowerInputDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                        stepChangeCondensingDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                        stepChangeHeatRejectDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                                        stepChangeCOPDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                                        stepChangeCurrentDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                        stepChangeMassFlowDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }


                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                        stepChangeCapDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                        stepChangePowerInputDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                        stepChangeCondensingDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                        stepChangeHeatRejectDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                                        stepChangeCOPDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                                        stepChangeCurrentDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                        stepChangeMassFlowDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                }
                            })
                        }
                    })

                    buttonSubmitCdu.addEventListener("click", () => {
                        if (radioModelCdu.checked) {
                            if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                stepChangeCap(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                stepChangePowerInput(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                stepChangeCondensing(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                stepChangeHeatReject(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "COP") {
                                stepChangeCOP(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Current") {
                                stepChangeCurrent(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                stepChangeMassFlow(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                        }
                    })

                    document.getElementById('table-step-dropdown').addEventListener("change", () => {
                        if (radioModelCdu.checked) {
                            if (document.getElementById('table-step-dropdown').value == "Capacity") {
                                stepChangeCapDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById('table-step-dropdown').value == "PowerInput") {
                                stepChangePowerInputDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById('table-step-dropdown').value == "Condensing") {
                                stepChangeCondensingDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById('table-step-dropdown').value == "HeatReject") {
                                stepChangeHeatRejectDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById('table-step-dropdown').value == "COP") {
                                stepChangeCOPDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById('table-step-dropdown').value == "Current") {
                                stepChangeCurrentDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById('table-step-dropdown').value == "MassFlow") {
                                stepChangeMassFlowDefault(selectModelCdu.options[selectModelCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                        }
                    })
                })

                // ------------------------------------------------dimensions----------------------------------------------
                ipc.send('cdu-product-change', cduTableRows[0].querySelector("td").textContent)
                ipc.once('cdu-product-change-send', (event, imgModel) => {
                    document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-bot-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                })
                // ------------------------------------------------document----------------------------------------------
                ipc.send('cdu-product-change', cduTableRows[0].querySelector("td").textContent)
                ipc.once('cdu-product-change-send', (event, docData) => {
                    if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                    } else if ((docData[0].product_document != "" || docData[0].product_document != null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                    } else if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure != "" || docData[0].product_brochure != null)) {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                    } else {
                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                    }
                    let classLink = document.getElementsByClassName("link-web")
                    for (let i = 0; i < classLink.length; i++) {
                        classLink[i].addEventListener('click', (event) => {
                            event.preventDefault();
                            require("electron").shell.openExternal("https://scmrefthai.com/");
                        })
                    }
                })

                ipc.send('cdu-tech-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_brand == "PATTON") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div class="pdf-outer" id="savePDF-cdu">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/PATTON Logo_Die cut.png"></div>
                                <div class="header-text">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                </div>
                            </div>
                        </div>`
                        document.getElementById("header-datasheet").innerHTML = techTable
                    } else if (techData[0].product_brand == "KALTMER") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div class="pdf-outer" id="savePDF-cdu">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                <div class="header-text" id="header-datasheet">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                </div>
                            </div>
                        </div>`
                        document.getElementById("header-datasheet").innerHTML = techTable
                    } else if (techData[0].product_brand == "CUBO") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                        <div class="pdf-outer" id="savePDF-cdu">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/CUBO LOGO.png"></div>
                                <div class="header-text" id="header-datasheet">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                </div>
                            </div>
                        </div>`
                        document.getElementById("header-datasheet").innerHTML = techTable
                    }
                })
                stepChangeCapDataSheet(modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)
                stepChangePowerInputDataSheet(modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)

                ipc.send('cdu-tech-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    let techTable =
                        `
                        <table class="pdf-table" id="middle-left">
                            <tr>
                                <th colspan="2" id="head-middle-left">Compressor</th>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Model Name</td>
                                <td class="pdf-table-right">${techData[0].tech_model_comp}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Max Current (A)</td>
                                <td class="pdf-table-right">${techData[0].tech_max_current}</td> 
                            </tr>
                            <tr>
                                <td id="border-middle-left">Locked Rotor Amp (A)</td>
                                <td class="pdf-table-right">${techData[0].tech_locked_rotor_current}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Voltage (V/Ph/Hz)</td>
                                <td class="pdf-table-right">${techData[0].tech_compresser_voltage}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Oil Type</td>
                                <td class="pdf-table-right">${techData[0].tech_oil_type}</td>
                            </tr>
                            <tr>
                                <td id="border-middle-left">Oil Recharge (Liters)</td>
                                <td class="pdf-table-right">${techData[0].tech_oil_recharge}</td>
                            </tr>
                        </table>             
                        `
                    document.getElementById("middle-left").innerHTML = techTable
                })
                ipc.send('cdu-tech-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_type_cooled == "Water cooled") {
                        let techTable =
                            `<table class="pdf-table" id="middle-right">
                                <tr>
                                    <th colspan="2" id="head-middle-right">Fan Motor</th>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Serface Area (m<sup>2</sup>)</td>
                                    <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Number of Curcuits</td>
                                    <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Water Volume (Liters)</td>
                                    <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                                    <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                    <td class="pdf-table-right">-</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">&nbsp</td>
                                    <td class="pdf-table-right">&nbsp</td>
                                </tr>
                            </table>`
                        document.getElementById("middle-right").innerHTML = techTable
                    }
                    else {
                        let techTable =
                            `<table class="pdf-table" id="middle-right">
                                <tr>
                                    <th colspan="2" id="head-middle-right">Fan Motor</th>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Number of Fan (Pieces)</td>
                                    <td class="pdf-table-right">${techData[0].tech_number_of_fan}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Diameter (mm.)</td>
                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</td>
                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Voltage (V/Ph/Hz)</td>
                                    <td class="pdf-table-right">${techData[0].tech_condenser_voltage}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                    <td class="pdf-table-right">${techData[0].tech_total_fan_power}</td>
                                </tr>
                                <tr>
                                    <td id="border-middle-right">&nbsp</td>
                                    <td class="pdf-table-right">&nbsp</td>
                                </tr>
                            </table>`
                        document.getElementById("middle-right").innerHTML = techTable
                    }
                })
                ipc.send('cdu-tech-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    let techTable =
                        ` 
                        <table class="pdf-table" id="middle-others">
                            <tr id="head-other">
                                <th colspan="2" >Others</th>
                            </tr>
                            <tr>
                                <td id="other-td-border">Oil Separator Volume (Liters)</td>
                                <td class="pdf-table-right">${techData[0].tech_oil_seperator_volume}</td>
                            </tr>
                            <tr>
                                <td  id="other-td-border">Receiver Volume (Liters)</td>
                                <td class="pdf-table-right">${techData[0].tech_receiver_volume}</td>
                            </tr>
                            <tr>
                                <td  id="other-td-border">Pipes Suction OD (Inch)</td>
                                <td class="pdf-table-right">${techData[0].tech_pipes_suction}</td>
                            </tr>
                            <tr>
                                <td id="other-td-border">Liquid OD (Inch)</td>
                                <td class="pdf-table-right">${techData[0].tech_pipes_liquid}</td>
                            </tr>
                            <tr>
                                <td id="other-td-border">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>
                                <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                            <tr id="other-border-note">
                                <td colspan="2" id='font-note'>
                                    Note: &nbsp&nbsp ${techData[0].tech_note}
                                </td>
                            </tr>
                        </table>
                        `
                    document.getElementById("middle-others").innerHTML = techTable
                })
                ipc.send('cdu-product-change', modelPositionId)
                ipc.once('cdu-product-change-send', (event, imgModel) => {
                    document.getElementById("dimension-datasheet").innerHTML =
                        "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                })

                //-------------------------------------------------Chart-------------------------------------------------
                ipc.send('cdu-graph-point', modelPositionId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                ipc.once('cdu-graph-point-send', (event, result) => {
                    let condensingValue = result.g_condensing;
                    let chartNote = result.tech_note;
                    ipc.send('cdu-plot-graph', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-plot-graph-send', (event, data) => {

                        // -----------------------------------Chart--------------------------------------
                        let ArrayPointX = []
                        let ArrayPointY = []
                        let array = []
                        let count1 = 0
                        for (const key in data[0]) {
                            let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                            let ObjectPoint = { "x": '', "y": '' }

                            if (key == "envelope_model" || key == "envelope_refrigerant") {
                                continue
                            }
                            else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                array.push(ObjectPoint)
                                ArrayPointX[count1] = data[0][key]
                                array[count1].x = data[0][key]
                            }
                            else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                ArrayPointY[count1 - arrayLength1] = data[0][key]
                                array[count1 - arrayLength1].y = data[0][key]
                            }
                            count1++
                        }
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            for (i = 0; i < array.length; i++) {
                                array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                            }
                        }
                        array.push(array[0])
                        plot = array
                        let MinX = Math.min.apply(Math, ArrayPointX)
                        let MaxX = Math.max.apply(Math, ArrayPointX)
                        let MinY = Math.min.apply(Math, ArrayPointY)
                        let MaxY = Math.max.apply(Math, ArrayPointY)
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                            MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                            MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                            MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                            condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                        }
                        let textEvapTemp = textSst.value
                        chartChange(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelPositionId, chartNote)
                    })
                })
                // ----------------------------------  Operating Summary  model  radioModel.checked------------------
                ipc.send('cdu-tech-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    if (techData[0].product_brand == "PATTON") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                            <div id="header-IS">
                                <div class="IS-header">
                                <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                src="../img/PATTON Logo_Die cut.png"></div>
                                    <div class="IS-text">
                                    <p class="IS-head-font">Operating Summary</p>
                                    <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                    <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                    <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                    </div>
                                </div>
                            </div> `
                        document.getElementById("header-IS").innerHTML = techTable
                    } else if (techData[0].product_brand == "KALTMER") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                            <div id="header-IS">
                                <div class="IS-header">
                                    <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                    <div class="IS-text">
                                        <p class="IS-head-font">Operating Summary</p>
                                        <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                        <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                        <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                    </div>
                                </div>
                            </div> `
                        document.getElementById("header-IS").innerHTML = techTable
                    } else if (techData[0].product_brand == "CUBO") {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                            <div id="header-IS">
                                <div class="IS-header">
                                    <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                    src=".../img/CUBO LOGO.png"></div>
                                    <div class="IS-text">
                                        <p class="IS-head-font">Operating Summary</p>
                                        <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                        <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                        <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                    </div>
                                </div>
                            </div> `
                        document.getElementById("header-IS").innerHTML = techTable
                    }

                })

                ipc.send('cdu-tech-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    for (let item in data) {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                            <table class="IS-table" id="IS-top">
                            <tr>
                                <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                            </tr>
                            <tr>
                                <td id="border-IS-right">CDU Model</td>
                                <td class="IS-table-right">${techData[0].product_model}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">Brand</td>
                                <td class="IS-table-right">${techData[0].product_brand} </td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">Series</td>
                                <td class="IS-table-right">${techData[0].product_series}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">Refrigerant</td>
                                <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                                <td class="IS-table-right">${cutunit(data.e_cooling)}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">Application Temp</td>
                                <td class="IS-table-right">${checkTemp}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                                <td class="IS-table-right">${cutunit(data.f_powerInput)}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'} </td>
                                <td class="IS-table-right">${cutunit(data.h_heatReject)}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                                <td class="IS-table-right">${cutunit(data.i_cop)}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">Compressor Current (A) </td>
                                <td class="IS-table-right">${cutunit(data.j_compressor)}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                                <td class="IS-table-right">${cutunit(data.k_massflow)}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                                <td class="IS-table-right">${cutunit(data.g_condensing)}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>
                                <td class="IS-table-right">${textSst.value}</td>
                            </tr>
                            <tr>
                                <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                                <td class="IS-table-right">${textAmbient.value}</td>
                            </tr>
                            </table> `
                        document.getElementById("IS-top").innerHTML = techTable
                    }
                })
                ipc.send('cdu-tech-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                ipc.once('cdu-tech-change-send', (event, techData) => {
                    let techTable = `<table class="IS-table" id="IS-Note-mid">
                        <tr>
                            <td >
                            Note: &nbsp&nbsp ${techData[0].tech_note}
                            </td>
                        </tr>
                    </table> `
                    document.getElementById("IS-Note-mid").innerHTML = techTable

                })


                //----------------------------    Operating Summary Chart    radioModel.checked  -------
                let plot2 = []
                ipc.send('cdu-graph-point', modelPositionId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                ipc.once('cdu-graph-point-send', (event, result) => {
                    let condensingValue = result.g_condensing;
                    ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-plot-graph-send', (event, data) => {


                        // -----------------------------------Chart--------------------------------------
                        let ArrayPointX = []
                        let ArrayPointY = []
                        let array = []
                        let count1 = 0
                        for (const key in data[0]) {
                            let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                            let ObjectPoint = { "x": '', "y": '' }

                            if (key == "envelope_model" || key == "envelope_refrigerant") {
                                continue
                            }
                            else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                array.push(ObjectPoint)
                                ArrayPointX[count1] = data[0][key]
                                array[count1].x = data[0][key]
                            }
                            else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                if ((data[0][key]) == null) {
                                    count1++
                                    continue
                                }
                                ArrayPointY[count1 - arrayLength1] = data[0][key]
                                array[count1 - arrayLength1].y = data[0][key]
                            }
                            count1++
                        }
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            for (i = 0; i < array.length; i++) {
                                array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                            }
                        }
                        array.push(array[0])
                        plot2 = array
                        let MinX = Math.min.apply(Math, ArrayPointX)
                        let MaxX = Math.max.apply(Math, ArrayPointX)
                        let MinY = Math.min.apply(Math, ArrayPointY)
                        let MaxY = Math.max.apply(Math, ArrayPointY)
                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                            MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                            MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                            MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                            MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                            condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                        }
                        let textEvapTemp = textSst.value
                        chartChange2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId)
                    })
                })
                if (radioCoolingEvap.checked) {
                    let coolingFromCdu = parseFloat(cduTableRows[4].querySelector("td").textContent);
                    textCoolingEvap.value = coolingFromCdu;

                    // document.getElementById("seven-panel-content").setAttribute("hidden", true)
                    // document.getElementById("step-table-tab").removeAttribute("hidden")

                    // -------------------------------------------Cal Result---------------------------------------------
                    ipc.send('evap-cal-click-cooling', selectBrandEvap.options[selectBrandEvap.selectedIndex].value, selectVoltageEvap.options[selectVoltageEvap.selectedIndex].value, selectSeriesEvap.options[selectSeriesEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, coolingFromCdu, textSst.value, textRoom.value, radioAppLow.checked, radioAppMed.checked, textAcceptableMins.value, textAcceptablePlus.value, checkAccept.checked, selectUnit.options[selectUnit.selectedIndex].value)

                    ipc.once('evap-cal-send-cooling', (event, data) => {
                        if (data[0] == null || data[0]["a_model"] == "") {
                            // ipc.send('validate-data-empty')
                            for (let i = 0; i < 5; i++) {
                                let j = 0
                                for (let k = 0; k < evapTableRows.length; k++) {
                                    evapTableRows[k].querySelectorAll("td")[i].innerHTML = null
                                    evapTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                                }
                                for (let item in data[i]) {
                                    if (item == "a_model") {
                                        evapTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                        j++;
                                    }
                                    else {
                                        evapTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                        j++;
                                    }
                                }
                            }
                            // document.getElementById("seven-panel").setAttribute("hidden", true)
                            // document.getElementById("eight-panel").setAttribute("hidden", true)
                            // document.getElementById("nine-panel").setAttribute("hidden", true)
                            // document.getElementById("ten-panel").setAttribute("hidden", true)
                            document.getElementById("seven-panel").style.visibility = "hidden"
                            document.getElementById("eight-panel").style.visibility = "hidden"
                            document.getElementById("nine-panel").style.visibility = "hidden"
                            document.getElementById("ten-panel").style.visibility = "hidden"

                            // document.getElementById("step-table-tab").setAttribute("hidden", true)
                            document.getElementById("datasheet-report-evap").setAttribute("hidden", true)

                            return false
                        }
                        for (let i = 0; i < 5; i++) {
                            let j = 0
                            for (let k = 0; k < evapTableRows.length; k++) {
                                evapTableRows[k].querySelectorAll("td")[i].innerHTML = null
                                evapTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                            }
                            for (let item in data[i]) {
                                if (i == 0) {
                                    evapTableRows[j].querySelectorAll("td")[i].classList.add("active")
                                }
                                if (item == "a_model") {
                                    let labelChild = `<label id="model-evap${i + 1}" class="model-result"><input type="radio" name="model-evap">${data[i][item]}</label>`
                                    evapTableRows[j].querySelectorAll("td")[i].innerHTML = labelChild
                                    j++;
                                }
                                else {
                                    evapTableRows[j].querySelectorAll("td")[i].innerHTML = `<div class="model-result-detail">${data[i][item]}</div>`

                                    if (item == "d_coolingStep") {
                                        evapTableRows[j].querySelectorAll("td")[i].style.fontWeight = "800"
                                        if (parseFloat(data[i][item]) < 100) {
                                            evapTableRows[j].querySelectorAll("td")[i].style.color = "red"
                                        }
                                        else {
                                            evapTableRows[j].querySelectorAll("td")[i].style.color = "green"
                                        }
                                    }

                                    j++;
                                }
                            }
                        }
                        // -----------------------------------------Tabs-----------------------------------------------------
                        document.getElementsByName("model-evap")[0].checked = true
                        // ----------------------------------------------------Technical Table-------------------------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let techTable = `
                                  <table class="techTableEvap">
                                      <tr>
                                          <th>Unit Coolers</th>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <th>Model Name</th>
                                          <td>${techData[0].evap_model}</td>
                                      </tr>
                                      <tr>
                                          <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                          <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                      </tr>
                                      <tr>
                                          <th>Fan Motor</th>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <th>Number of Fan (Pieces)</th>
                                          <td>${techData[0].evap_number_of_fan}</td>
                                      </tr>
                                      <tr>
                                          <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                          <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                      </tr>
                                      <tr>
                                          <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                          <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                      </tr>
                                      <tr>
                                          <th>Voltage (V/Ph/Hz)</th>
                                          <td>${techData[0].evap_voltage}</td>
                                      </tr>
                                      <tr>
                                          <th>Total Fan Motor Power (Watts)</th>
                                          <td>${techData[0].evap_total_fan_motor_power}</td>
                                      </tr>
                                      <tr>
                                          <th>Coil</th>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <th>Curcuit Volume</th>
                                          <td>${techData[0].evap_curcuit_volume}</td>
                                      </tr>
                                      <tr>
                                          <th>Distributor Inlet (Inch)</th>
                                          <td>${techData[0].evap_distributor_inlet}</td>
                                      </tr>
                                      <tr>
                                          <th>Suction Outlet (Inch)</th>
                                          <td>${techData[0].evap_suction_outlet}</td>
                                      </tr>
                                      <tr>
                                          <th>FPI</th>
                                          <td>${techData[0].evap_fpi}</td>
                                      </tr>
                                      <tr>
                                          <th>Defrost (Watts)</th>
                                          <td>${techData[0].evap_defrost_heater}</td>
                                      </tr>         
                                  </table>`
                            document.getElementById("seven-panel").innerHTML = techTable
                        })
                        // ---------------------------------------First Dimensions---------------------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                            if(imgModel[0].evap_l != '-'){
                                imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                            }
                            if(imgModel[0].evap_w != '-'){
                                imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                            }
                            if(imgModel[0].evap_h != '-'){
                                imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                            }
                            if(imgModel[0].evap_a != '-'){
                                imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                            }
                            if(imgModel[0].evap_b != '-'){
                                imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                            }
                            if(imgModel[0].evap_c != '-'){
                                imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                            }
                            if(imgModel[0].evap_d != '-'){
                                imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                            }
                            imgdimen += "</div>"
                            document.getElementById("eight-panel").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("eight-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series") {
                            //     document.getElementById("eight-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("eight-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                            // }
                        })
                        // ---------------------------------------First Document---------------------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, docData) => {
                            if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                    "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                            } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                    "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                            } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                    "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                            } else {
                                document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                    "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                            }
                            let classLink = document.getElementsByClassName("link-web-evap")
                            for (let i = 0; i < classLink.length; i++) {
                                classLink[i].addEventListener('click', (event) => {
                                    event.preventDefault();
                                    require("electron").shell.openExternal("https://scmrefthai.com/");
                                })
                            }
                        })

                        //------------------------------------------ Data sheet--------------------------
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            if (techData[0].evap_brand == "PATTON") {
                                let checkTemp = ""
                                if (radioAppLow.checked) {
                                    checkTemp = "Low Temp"
                                } else {
                                    checkTemp = "Medium Temp"
                                }
                                let techTable = `
                                    <div class="pdf-outer-evap" id="savePDF">
                                        <div class="pdf-header-evap">
                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                src="../img/PATTON Logo_Die cut.png"></div>
                                            <div class="header-text-evap">
                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                            </div>
                                        </div>
                                    </div>`
                                document.getElementById("header-datasheet-evap").innerHTML = techTable
                            } else if (techData[0].evap_brand == "KALTMER") {
                                let checkTemp = ""
                                if (radioAppLow.checked) {
                                    checkTemp = "Low Temp"
                                } else {
                                    checkTemp = "Medium Temp"
                                }
                                let techTable = `
                                    <div class="pdf-outer-evap" id="savePDF">
                                        <div class="pdf-header-evap">
                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                            <div class="header-text-evap" id="header-datasheet-evap">
                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                            </div>
                                        </div>
                                    </div>`
                                document.getElementById("header-datasheet-evap").innerHTML = techTable
                            } else if (techData[0].evap_brand == "CUBO") {
                                let checkTemp = ""
                                if (radioAppLow.checked) {
                                    checkTemp = "Low Temp"
                                } else {
                                    checkTemp = "Medium Temp"
                                }
                                let techTable = `
                                    <div class="pdf-outer-evap" id="savePDF">
                                        <div class="pdf-header-evap">
                                            <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                src="../img/CUBO LOGO.png"></div>
                                            <div class="header-text-evap" id="header-datasheet-evap">
                                                <p class="text-head-font-evap">Specification Sheet</p>
                                                <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                <p class="text-head-font-evap"> Unit Coolers</p>
                                                <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                            </div>
                                        </div>
                                    </div>`
                                document.getElementById("header-datasheet-evap").innerHTML = techTable
                            }

                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let getCooling = evapTableRows[4].querySelector("td").textContent
                            let coolingValue = parseFloat(getCooling)
                            let checkTemp = ""
                            if (radioAppLow.checked) {
                                checkTemp = "Low Temp"
                            } else {
                                checkTemp = "Medium Temp"
                            }
                            let techTable = `
                                <table class="pdf-table-evap" id="evap-top-evap">
                                    <tr>
                                        <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">Model Name</td>
                                        <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">Series</td>
                                        <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                                        <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">Refrigerant</td>  
                                        <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                                    </tr>
                                    <tr >
                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                                        <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">Application Temp</td>  
                                        <td class="pdf-table-right-evap">${checkTemp}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'}</td>  
                                        <td class="pdf-table-right-evap">${textRoom.value}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">Design TD (K) </td>  
                                        <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                        <td class="pdf-table-right-evap">${textSst.value}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                    </tr>
                                </table>`
                            document.getElementById("evap-top-evap").innerHTML = techTable
                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let techTable =
                                `
                                <table class="pdf-table-evap" id="middle-left-evap">
                                    <tr>
                                        <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                                        <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left-evap">Fan Qty</td>
                                        <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                                        <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                                        <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                                    </tr>
                                </table>             
                            `
                            document.getElementById("middle-left-evap").innerHTML = techTable
                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let techTable =
                                `<table class="pdf-table-evap" id="middle-right-evap">
                                        <tr>
                                            <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right-evap">FPI</td>
                                            <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                                        </tr>
                                    </table>
                                    `
                            document.getElementById("middle-right-evap").innerHTML = techTable
                        })
                        ipc.send('evap-data-change', document.getElementById("model-evap1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                            if(imgModel[0].evap_l != '-'){
                                imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                            }
                            if(imgModel[0].evap_w != '-'){
                                imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                            }
                            if(imgModel[0].evap_h != '-'){
                                imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                            }
                            if(imgModel[0].evap_a != '-'){
                                imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                            }
                            if(imgModel[0].evap_b != '-'){
                                imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                            }
                            if(imgModel[0].evap_c != '-'){
                                imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                            }
                            if(imgModel[0].evap_d != '-'){
                                imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                            }
                            imgdimen += "</div>"
                            document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("dimension-datasheet-evap").innerHTML =
                            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series") {
                            //     document.getElementById("dimension-datasheet-evap").innerHTML =
                            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("dimension-datasheet-evap").innerHTML =
                            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                            // }
                        })

                        if (data.length >= 5) {
                            for (let m = 0; m < 5; m++) {
                                document.getElementById(`model-evap${m + 1}`).addEventListener("change", (e) => {
                                    modelId = document.getElementById(`model-evap${m + 1}`).textContent
                                    for (i = 0; i < evapTableRows.length; i++) {
                                        for (j = 0; j < 5; j++) {
                                            evapTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                        }
                                        evapTableRows[i].querySelectorAll("td")[m].classList.add("active")
                                    }
                                    // ----------------------------------------------------Technical Table-------------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable = `
                                            <table class="techTableEvap">
                                                <tr>
                                                    <th>Unit Coolers</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Model Name</th>
                                                    <td>${techData[0].evap_model}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fan Motor</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Number of Fan (Pieces)</th>
                                                    <td>${techData[0].evap_number_of_fan}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Voltage (V/Ph/Hz)</th>
                                                    <td>${techData[0].evap_voltage}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total Fan Motor Power (Watts)</th>
                                                    <td>${techData[0].evap_total_fan_motor_power}</td>
                                                </tr>
                                                <tr>
                                                    <th>Coil</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Curcuit Volume</th>
                                                    <td>${techData[0].evap_curcuit_volume}</td>
                                                </tr>
                                                <tr>
                                                    <th>Distributor Inlet (Inch)</th>
                                                    <td>${techData[0].evap_distributor_inlet}</td>
                                                </tr>
                                                <tr>
                                                    <th>Suction Outlet (Inch)</th>
                                                    <td>${techData[0].evap_suction_outlet}</td>
                                                </tr>
                                                <tr>
                                                    <th>FPI</th>
                                                    <td>${techData[0].evap_fpi}</td>
                                                </tr>
                                                <tr>
                                                    <th>Defrost (Watts)</th>
                                                    <td>${techData[0].evap_defrost_heater}</td>
                                                </tr>
                                                
                                            
                                            </table>`
                                        document.getElementById("seven-panel").innerHTML = techTable

                                    })
                                    // ---------------------------------------Dimensions---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("eight-panel").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                    // ---------------------------------------Document---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, docData) => {
                                        if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        } else {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        }
                                        let classLink = document.getElementsByClassName("link-web")
                                        for (let i = 0; i < classLink.length; i++) {
                                            classLink[i].addEventListener('click', (event) => {
                                                event.preventDefault();
                                                require("electron").shell.openExternal("https://scmrefthai.com/");
                                            })
                                        }
                                    })

                                    //------------------------------------------ Data sheet--------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        if (techData[0].evap_brand == "PATTON") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                 <div class="pdf-outer-evap" id="savePDF">
                                                     <div class="pdf-header-evap">
                                                         <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                             src="../img/PATTON Logo_Die cut.png"></div>
                                                         <div class="header-text-evap">
                                                             <p class="text-head-font-evap">Specification Sheet</p>
                                                             <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                             <p class="text-head-font-evap"> Unit Coolers</p>
                                                             <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                         </div>
                                                     </div>
                                                 </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "KALTMER") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                 <div class="pdf-outer-evap" id="savePDF">
                                                     <div class="pdf-header-evap">
                                                         <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                             src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                         <div class="header-text-evap" id="header-datasheet-evap">
                                                             <p class="text-head-font-evap">Specification Sheet</p>
                                                             <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                             <p class="text-head-font-evap"> Unit Coolers</p>
                                                             <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                         </div>
                                                     </div>
                                                 </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "CUBO") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                 <div class="pdf-outer-evap" id="savePDF">
                                                     <div class="pdf-header-evap">
                                                         <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                             src="../img/CUBO LOGO.png"></div>
                                                         <div class="header-text-evap" id="header-datasheet-evap">
                                                             <p class="text-head-font-evap">Specification Sheet</p>
                                                             <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                             <p class="text-head-font-evap"> Unit Coolers</p>
                                                             <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                                         </div>
                                                     </div>
                                                 </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        }

                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let getCooling = evapTableRows[4].querySelector("td").textContent
                                        let coolingValue = parseFloat(getCooling)
                                        let checkTemp = ""
                                        if (radioAppLow.checked) {
                                            checkTemp = "Low Temp"
                                        } else {
                                            checkTemp = "Medium Temp"
                                        }
                                        let techTable = `
                                             <table class="pdf-table-evap" id="evap-top-evap">
                                                 <tr>
                                                     <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">Model Name</td>
                                                     <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">Series</td>
                                                     <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                                                     <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">Refrigerant</td>  
                                                     <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                                                 </tr>
                                                 <tr >
                                                     <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                                                     <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">Application Temp</td>  
                                                     <td class="pdf-table-right-evap">${checkTemp}</td>  
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'} </td>  
                                                     <td class="pdf-table-right-evap">${textRoom.value}</td>  
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">Design TD (K) </td>  
                                                     <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                                     <td class="pdf-table-right-evap">${textSst.value}</td>  
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                                     <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                                 </tr>
                                             </table>`
                                        document.getElementById("evap-top-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `
                                             <table class="pdf-table-evap" id="middle-left-evap">
                                                 <tr>
                                                     <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                                     <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                                                     <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-left-evap">Fan Qty</td>
                                                     <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                                                     <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                                                 </tr>
                                                 <tr>
                                                     <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                                                     <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                                                 </tr>
                                             </table>             
                                         `
                                        document.getElementById("middle-left-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `<table class="pdf-table-evap" id="middle-right-evap">
                                                     <tr>
                                                         <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                                                     </tr>
                                                     <tr>
                                                         <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                                                         <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                                                     </tr>
                                                     <tr>
                                                         <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                                                         <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                                                     </tr>
                                                     <tr>
                                                         <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                                                         <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                                                     </tr>
                                                     <tr>
                                                         <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                                                         <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                                                     </tr>
                                                     <tr>
                                                         <td id="border-middle-right-evap">FPI</td>
                                                         <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                                                     </tr>
                                                 </table>
                                                 `
                                        document.getElementById("middle-right-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                })
                            }
                        }
                        else {
                            for (let m = 0; m < data.length; m++) {
                                document.getElementById(`model-evap${m + 1}`).addEventListener("change", (e) => {
                                    modelId = document.getElementById(`model-evap${m + 1}`).textContent
                                    for (i = 0; i < evapTableRows.length; i++) {
                                        for (j = 0; j < data.length; j++) {
                                            evapTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                        }
                                        evapTableRows[i].querySelectorAll("td")[m].classList.add("active")
                                    }
                                    // ----------------------------------------------------Technical Table-------------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable = `
                                            <table class="techTableEvap">
                                                <tr>
                                                    <th>Unit Coolers</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Model Name</th>
                                                    <td>${techData[0].evap_model}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fan Motor</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Number of Fan (Pieces)</th>
                                                    <td>${techData[0].evap_number_of_fan}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Voltage (V/Ph/Hz)</th>
                                                    <td>${techData[0].evap_voltage}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total Fan Motor Power (Watts)</th>
                                                    <td>${techData[0].evap_total_fan_motor_power}</td>
                                                </tr>
                                                <tr>
                                                    <th>Coil</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Curcuit Volume</th>
                                                    <td>${techData[0].evap_curcuit_volume}</td>
                                                </tr>
                                                <tr>
                                                    <th>Distributor Inlet (Inch)</th>
                                                    <td>${techData[0].evap_distributor_inlet}</td>
                                                </tr>
                                                <tr>
                                                    <th>Suction Outlet (Inch)</th>
                                                    <td>${techData[0].evap_suction_outlet}</td>
                                                </tr>
                                                <tr>
                                                    <th>FPI</th>
                                                    <td>${techData[0].evap_fpi}</td>
                                                </tr>
                                                <tr>
                                                    <th>Defrost (Watts)</th>
                                                    <td>${techData[0].evap_defrost_heater}</td>
                                                </tr>
                                                
                                            
                                            </table>`
                                        document.getElementById("seven-panel").innerHTML = techTable

                                    })
                                    // ---------------------------------------Dimensions---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("eight-panel").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("eight-panel").innerHTML =
                                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                    // ---------------------------------------Document---------------------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, docData) => {
                                        if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                        } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        } else {
                                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                        }
                                        let classLink = document.getElementsByClassName("link-web")
                                        for (let i = 0; i < classLink.length; i++) {
                                            classLink[i].addEventListener('click', (event) => {
                                                event.preventDefault();
                                                require("electron").shell.openExternal("https://scmrefthai.com/");
                                            })
                                        }
                                    })
                                    //------------------------------------------ Data sheet--------------------------
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        if (techData[0].evap_brand == "PATTON") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                <div class="pdf-outer-evap" id="savePDF">
                                                    <div class="pdf-header-evap">
                                                        <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                            src="../img/PATTON Logo_Die cut.png"></div>
                                                        <div class="header-text-evap">
                                                            <p class="text-head-font-evap">Specification Sheet</p>
                                                            <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                            <p class="text-head-font-evap"> Unit Coolers</p>
                                                            <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                        </div>
                                                    </div>
                                                </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "KALTMER") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                <div class="pdf-outer-evap" id="savePDF">
                                                    <div class="pdf-header-evap">
                                                        <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                            src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                        <div class="header-text-evap" id="header-datasheet-evap">
                                                            <p class="text-head-font-evap">Specification Sheet</p>
                                                            <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                            <p class="text-head-font-evap"> Unit Coolers</p>
                                                            <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                        </div>
                                                    </div>
                                                </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        } else if (techData[0].evap_brand == "CUBO") {
                                            let checkTemp = ""
                                            if (radioAppLow.checked) {
                                                checkTemp = "Low Temp"
                                            } else {
                                                checkTemp = "Medium Temp"
                                            }
                                            let techTable = `
                                                <div class="pdf-outer-evap" id="savePDF">
                                                    <div class="pdf-header-evap">
                                                        <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                                            src="../img/CUBO LOGO.png"></div>
                                                        <div class="header-text-evap" id="header-datasheet-evap">
                                                            <p class="text-head-font-evap">Specification Sheet</p>
                                                            <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                                            <p class="text-head-font-evap"> Unit Coolers</p>
                                                            <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                                        </div>
                                                    </div>
                                                </div>`
                                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                                        }

                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let getCooling = evapTableRows[4].querySelector("td").textContent
                                        let coolingValue = parseFloat(getCooling)
                                        let checkTemp = ""
                                        if (radioAppLow.checked) {
                                            checkTemp = "Low Temp"
                                        } else {
                                            checkTemp = "Medium Temp"
                                        }
                                        let techTable = `
                                            <table class="pdf-table-evap" id="evap-top-evap">
                                                <tr>
                                                    <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">Model Name</td>
                                                    <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">Series</td>
                                                    <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                                                    <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">Refrigerant</td>  
                                                    <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                                                </tr>
                                                <tr >
                                                    <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                                                    <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">Application Temp</td>  
                                                    <td class="pdf-table-right-evap">${checkTemp}</td>  
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'}</td>  
                                                    <td class="pdf-table-right-evap">${textRoom.value}</td>  
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">Design TD (K) </td>  
                                                    <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                                    <td class="pdf-table-right-evap">${textSst.value}</td>  
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                                    <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                                </tr>
                                            </table>`
                                        document.getElementById("evap-top-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `
                                            <table class="pdf-table-evap" id="middle-left-evap">
                                                <tr>
                                                    <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                                    <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                                                    <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left-evap">Fan Qty</td>
                                                    <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                                                    <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                                                    <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                                                </tr>
                                            </table>             
                                        `
                                        document.getElementById("middle-left-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, techData) => {
                                        let techTable =
                                            `<table class="pdf-table-evap" id="middle-right-evap">
                                                    <tr>
                                                        <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right-evap">FPI</td>
                                                        <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                                                    </tr>
                                                </table>
                                                `
                                        document.getElementById("middle-right-evap").innerHTML = techTable
                                    })
                                    ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('evap-data-change-send', (event, imgModel) => {
                                        var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                                        if(imgModel[0].evap_l != '-'){
                                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                                        }
                                        if(imgModel[0].evap_w != '-'){
                                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                                        }
                                        if(imgModel[0].evap_h != '-'){
                                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                                        }
                                        if(imgModel[0].evap_a != '-'){
                                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                                        }
                                        if(imgModel[0].evap_b != '-'){
                                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                                        }
                                        if(imgModel[0].evap_c != '-'){
                                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                                        }
                                        if(imgModel[0].evap_d != '-'){
                                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                                        }
                                        imgdimen += "</div>"
                                        document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
                                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // } else if (imgModel[0].evap_series == "JC Series") {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                                        // }
                                        // else {
                                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                                        // }
                                    })
                                })
                            }
                        }
                        // autoClick(data)
                    })
                } else if (radioModelEvap.checked) {
                    let letters = /^[A-Za-zก-ฮ]+$/
                    var calTempDiff = 0.0
                    calTempDiff = textRoom.value - textSst.value
                    var DiffTemp = Math.abs(calTempDiff)
                    if (selectModelEvap.options[selectModelEvap.selectedIndex].value == "") {
                        ipc.send('validate-selectmodel-empty')
                        return false
                    }
                    else if (!textSst.value) {
                        ipc.send('validate-evap-empty', selectUnit.options[selectUnit.selectedIndex].value)
                        return false
                    }
                    else if (!textRoom.value) {
                        ipc.send('validate-room-empty', selectUnit.options[selectUnit.selectedIndex].value)
                        return false
                    }
                    else if (textSst.value.match(letters) || textRoom.value.match(letters) || textCoolingEvap.value.match(letters)) {
                        ipc.send('validate-letters')
                        return false
                    }
                    else if (parseInt(textRoom.value) <= parseInt(textSst.value)) {
                        ipc.send('validate-room-temp')
                        return false
                    }
                    else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? DiffTemp > 12 : DiffTemp > 21.6) {
                        ipc.send('validate-diff-temp', selectUnit.options[selectUnit.selectedIndex].value)
                        return false
                    }
                    else if (selectModelEvap.value == "") {
                        ipc.send('validate-selectmodel-empty')
                    }
                    // ------------------------------------------------Model Result----------------------------------------------
                    ipc.send('evap-cal-click-model', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textSst.value, textRoom.value, selectUnit.options[selectUnit.selectedIndex].value)
                    ipc.once('evap-cal-send-model', (event, data) => {
                        let i = 0;
                        for (let j = 0; j < 5; j++) {
                            for (let k = 0; k < evapTableRows.length; k++) {
                                evapTableRows[k].querySelectorAll("td")[j].innerHTML = null
                                evapTableRows[k].querySelectorAll("td")[j].classList.remove("active")
                            }
                        }
                        for (let item in data) {
                            if (i == 0) {
                                evapTableRows[i].querySelector("td").innerHTML = `<div id="model1" class="model-result-detail">${data[item]}</div>`
                                i++;
                                continue;
                            }
                            evapTableRows[i].querySelector("td").innerHTML = `<div class='model-result-detail'>${data[item]}</div>`
                            if (item == "d_coolingStep") {
                                evapTableRows[i].querySelector("td").style.fontWeight = "800"
                                if (parseFloat(data[item]) < 100) {
                                    evapTableRows[i].querySelector("td").style.color = "red"
                                }
                                else {
                                    evapTableRows[i].querySelector("td").style.color = "green"
                                }
                            }
                            i++;

                        }

                    })
                    // ----------------------------------------------------Technical Table-------------------------------------------
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let techTable = `
                              <table class="techTableEvap">
                                  <tr>
                                      <th>Unit Coolers</th>
                                      <td></td>
                                  </tr>
                                  <tr>
                                      <th>Model Name</th>
                                      <td>${techData[0].evap_model}</td>
                                  </tr>
                                  <tr>
                                      <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                                      <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                      <th>Fan Motor</th>
                                      <td></td>
                                  </tr>
                                  <tr>
                                      <th>Number of Fan (Pieces)</th>
                                      <td>${techData[0].evap_number_of_fan}</td>
                                  </tr>
                                  <tr>
                                      <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                      <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                      <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                      <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                                  </tr>
                                  <tr>
                                      <th>Voltage (V/Ph/Hz)</th>
                                      <td>${techData[0].evap_voltage}</td>
                                  </tr>
                                  <tr>
                                      <th>Total Fan Motor Power (Watts)</th>
                                      <td>${techData[0].evap_total_fan_motor_power}</td>
                                  </tr>
                                  <tr>
                                      <th>Coil</th>
                                      <td></td>
                                  </tr>
                                  <tr>
                                      <th>Curcuit Volume</th>
                                      <td>${techData[0].evap_curcuit_volume}</td>
                                  </tr>
                                  <tr>
                                      <th>Distributor Inlet (Inch)</th>
                                      <td>${techData[0].evap_distributor_inlet}</td>
                                  </tr>
                                  <tr>
                                      <th>Suction Outlet (Inch)</th>
                                      <td>${techData[0].evap_suction_outlet}</td>
                                  </tr>
                                  <tr>
                                      <th>FPI</th>
                                      <td>${techData[0].evap_fpi}</td>
                                  </tr>
                                  <tr>
                                      <th>Defrost (Watts)</th>
                                      <td>${techData[0].evap_defrost_heater}</td>
                                  </tr>
                                  
                                 
                              </table>`
                        document.getElementById("seven-panel").innerHTML = techTable
                    })
                    // ---------------------------------------First Dimensions---------------------------------------
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, imgModel) => {
                        var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                        if(imgModel[0].evap_l != '-'){
                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                        }
                        if(imgModel[0].evap_w != '-'){
                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                        }
                        if(imgModel[0].evap_h != '-'){
                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                        }
                        if(imgModel[0].evap_a != '-'){
                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                        }
                        if(imgModel[0].evap_b != '-'){
                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                        }
                        if(imgModel[0].evap_c != '-'){
                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                        }
                        if(imgModel[0].evap_d != '-'){
                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                        }
                        imgdimen += "</div>"
                        document.getElementById("eight-panel").innerHTML = imgdimen
                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // } else if (imgModel[0].evap_series == "JC Series") {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // }
                        // else {
                        //     document.getElementById("eight-panel").innerHTML =
                        //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                        // }
                    })
                    // ---------------------------------------First Document---------------------------------------
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, docData) => {
                        if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                        } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
                        } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                        } else {
                            document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                        }
                        let classLink = document.getElementsByClassName("link-web-evap")
                        for (let i = 0; i < classLink.length; i++) {
                            classLink[i].addEventListener('click', (event) => {
                                event.preventDefault();
                                require("electron").shell.openExternal("https://scmrefthai.com/");
                            })
                        }
                    })
                    //------------------------------------------ Data sheet--------------------------
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        if (techData[0].evap_brand == "PATTON") {
                            let checkTemp = ""
                            if (radioAppLow.checked) {
                                checkTemp = "Low Temp"
                            } else {
                                checkTemp = "Medium Temp"
                            }
                            let techTable = `
                             <div class="pdf-outer-evap" id="savePDF">
                                 <div class="pdf-header-evap">
                                     <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                         src="../img/PATTON Logo_Die cut.png"></div>
                                     <div class="header-text-evap">
                                         <p class="text-head-font-evap">Specification Sheet</p>
                                         <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                         <p class="text-head-font-evap"> Unit Coolers</p>
                                         <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                     </div>
                                 </div>
                             </div>`
                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                        } else if (techData[0].evap_brand == "KALTMER") {
                            let checkTemp = ""
                            if (radioAppLow.checked) {
                                checkTemp = "Low Temp"
                            } else {
                                checkTemp = "Medium Temp"
                            }
                            let techTable = `
                             <div class="pdf-outer-evap" id="savePDF">
                                 <div class="pdf-header-evap">
                                     <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                         src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                     <div class="header-text-evap" id="header-datasheet-evap">
                                         <p class="text-head-font-evap">Specification Sheet</p>
                                         <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                         <p class="text-head-font-evap"> Unit Coolers</p>
                                         <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                     </div>
                                 </div>
                             </div>`
                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                        } else if (techData[0].evap_brand == "CUBO") {
                            let checkTemp = ""
                            if (radioAppLow.checked) {
                                checkTemp = "Low Temp"
                            } else {
                                checkTemp = "Medium Temp"
                            }
                            let techTable = `
                             <div class="pdf-outer-evap" id="savePDF">
                                 <div class="pdf-header-evap">
                                     <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                                         src="../img/CUBO LOGO.png"></div>
                                     <div class="header-text-evap" id="header-datasheet-evap">
                                         <p class="text-head-font-evap">Specification Sheet</p>
                                         <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                                         <p class="text-head-font-evap"> Unit Coolers</p>
                                         <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                     </div>
                                 </div>
                             </div>`
                            document.getElementById("header-datasheet-evap").innerHTML = techTable
                        }

                    })
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let getCooling = evapTableRows[4].querySelector("td").textContent
                        let coolingValue = parseFloat(getCooling)
                        let checkTemp = ""
                        if (radioAppLow.checked) {
                            checkTemp = "Low Temp"
                        } else {
                            checkTemp = "Medium Temp"
                        }
                        let techTable = `
                         <table class="pdf-table-evap" id="evap-top-evap">
                             <tr>
                                 <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">Model Name</td>
                                 <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">Series</td>
                                 <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                                 <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">Refrigerant</td>  
                                 <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                             </tr>
                             <tr >
                                 <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                                 <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">Application Temp</td>  
                                 <td class="pdf-table-right-evap">${checkTemp}</td>  
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'}</td>  
                                 <td class="pdf-table-right-evap">${textRoom.value}</td>  
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">Design TD (K) </td>  
                                 <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'}</td>  
                                 <td class="pdf-table-right-evap">${textSst.value}</td>  
                             </tr>
                             <tr>
                                 <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                 <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                             </tr>
                         </table>`
                        document.getElementById("evap-top-evap").innerHTML = techTable
                    })
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let techTable =
                            `
                         <table class="pdf-table-evap" id="middle-left-evap">
                             <tr>
                                 <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                             </tr>
                             <tr>
                                 <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                                 <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                             </tr>
                             <tr>
                                 <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                                 <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                             </tr>
                             <tr>
                                 <td id="border-middle-left-evap">Fan Qty</td>
                                 <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                             </tr>
                             <tr>
                                 <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                                 <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                             </tr>
                             <tr>
                                 <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                                 <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                             </tr>
                         </table>             
                       `
                        document.getElementById("middle-left-evap").innerHTML = techTable
                    })
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, techData) => {
                        let techTable =
                            `<table class="pdf-table-evap" id="middle-right-evap">
                                 <tr>
                                     <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                                 </tr>
                                 <tr>
                                     <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                                     <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                                 </tr>
                                 <tr>
                                     <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                                     <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                                 </tr>
                                 <tr>
                                     <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                                     <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                                 </tr>
                                 <tr>
                                     <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                                     <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                                 </tr>
                                 <tr>
                                     <td id="border-middle-right-evap">FPI</td>
                                     <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                                 </tr>
                             </table>
                             `
                        document.getElementById("middle-right-evap").innerHTML = techTable
                    })
                    ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('evap-data-change-send', (event, imgModel) => {
                        var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
                        if(imgModel[0].evap_l != '-'){
                            imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
                        }
                        if(imgModel[0].evap_w != '-'){
                            imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
                        }
                        if(imgModel[0].evap_h != '-'){
                            imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
                        }
                        if(imgModel[0].evap_a != '-'){
                            imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
                        }
                        if(imgModel[0].evap_b != '-'){
                            imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
                        }
                        if(imgModel[0].evap_c != '-'){
                            imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
                        }
                        if(imgModel[0].evap_d != '-'){
                            imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
                        }
                        imgdimen += "</div>"
                        document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
                        // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // } else if (imgModel[0].evap_series == "JC Series") {
                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                        // }
                        // else {
                        //     document.getElementById("dimension-datasheet-evap").innerHTML =
                        //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                        // }
                    })
                }
            })
            autoClickModel()
        }
        //------------------------------------------cdu inside evap----------------------------------------------------------------------------------------------------
    } else if (radioModelEvap.checked) {
        if (radioModelEvap.checked) {
            // -------------------------Validate-----------------------------------
            let letters = /^[A-Za-zก-ฮ]+$/
            var calTempDiff = 0.0
            calTempDiff = textRoom.value - textSst.value
            var DiffTemp = Math.abs(calTempDiff)
            if (!selectRefrigerant.value) {
                ipc.send('validate-refrigerant-empty')
                return false
            }
            else if (textSst.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (!textSst.value) {
                ipc.send('validate-evap-empty', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            if (radioAppMed.checked) {
                if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textSst.value < -15 || textSst.value > 10 : (parseFloat(textSst.value) - 32) * (5 / 9) < -15 || (parseFloat(textSst.value) - 32) * (5 / 9) > 10) {
                    ipc.send('validate-evap-temp-med', selectUnit.options[selectUnit.selectedIndex].value)
                    return false
                }
            }
            if (radioAppLow.checked) {
                if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textSst.value < -40 || textSst.value > -10 : (parseFloat(textSst.value) - 32) * (5 / 9) < -40 || (parseFloat(textSst.value) - 32) * (5 / 9) > -10) {
                    ipc.send('validate-evap-temp-low', selectUnit.options[selectUnit.selectedIndex].value)
                    return false
                }
            }
            if (!textAmbient.value) {
                ipc.send('validate-ambient-empty', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (textAmbient.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textAmbient.value < -20 || textAmbient.value > 50 : (parseFloat(textAmbient.value) - 32) * (5 / 9) < -20 || (parseFloat(textAmbient.value) - 32) * (5 / 9) > 50) {
                ipc.send('validate-ambient-temp', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (textRoom.value.match(letters)) {
                ipc.send('validate-letters')
                return false
            }
            else if (!textRoom.value) {
                ipc.send('validate-room-empty', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (parseInt(textRoom.value) <= parseInt(textSst.value)) {
                ipc.send('validate-room-temp')
                return false
            } else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? DiffTemp > 12 : DiffTemp > 21.6) {
                ipc.send('validate-diff-temp', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
            else if (selectModelEvap.value == "") {
                ipc.send('validate-selectmodel-empty')
            }

        }
        // ------------------------------------------------Model Result----------------------------------------------
        ipc.send('evap-cal-click-model', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textSst.value, textRoom.value, selectUnit.options[selectUnit.selectedIndex].value)
        ipc.once('evap-cal-send-model', (event, data) => {
            let i = 0;
            for (let j = 0; j < 5; j++) {
                for (let k = 0; k < evapTableRows.length; k++) {
                    evapTableRows[k].querySelectorAll("td")[j].innerHTML = null
                    evapTableRows[k].querySelectorAll("td")[j].classList.remove("active")
                }
            }
            for (let item in data) {
                evapTableRows[i].querySelector("td").innerHTML = `<div class='model-result-detail'>${data[item]}</div>`
                if (item == "d_coolingStep") {
                    evapTableRows[i].querySelector("td").style.fontWeight = "800"
                    if (parseFloat(data[item]) < 100) {
                        evapTableRows[i].querySelector("td").style.color = "red"
                    }
                    else {
                        evapTableRows[i].querySelector("td").style.color = "green"
                    }
                }
                i++;

            }

            // --------------------------CDU from Evap----------------------
            let coolingFromEvap = parseFloat(evapTableRows[4].querySelector("td").textContent);
            textCoolingCdu.value = coolingFromEvap;
            if (radioCoolingCdu.checked) {
                // -------------------------Validate-----------------------------------
                // let letters = /^[A-Za-zก-ฮ]+$/
                // if (!textCoolingCdu.value) {
                //     ipc.send('validate-cooling-empty')
                //     return false
                // } else if (!textSst.value) {
                //     ipc.send('validate-evap-empty')
                //     return false
                // }
                // else if (!textAmbient.value) {
                //     ipc.send('validate-ambient-empty')
                //     return false
                // }
                // else if (!textRoom.value) {
                //     ipc.send('validate-room-empty')
                //     return false
                // }
                // else if (textSst.value.match(letters) || textAmbient.value.match(letters) || textCoolingCdu.value.match(letters)) {
                //     ipc.send('validate-letters')
                //     return false
                // }
                // else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textSst.value < -40 || textSst.value > 20 : (parseFloat(textSst.value) - 32) * (5 / 9) < -40 || (parseFloat(textSst.value) - 32) * (5 / 9) > 20) {
                //     ipc.send('validate-evap-temp')
                //     return false
                // }
                // else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textAmbient.value < -20 || textAmbient.value > 50 : (parseFloat(textAmbient.value) - 32) * (5 / 9) < -20 || (parseFloat(textAmbient.value) - 32) * (5 / 9) > 50) {
                //     ipc.send('validate-ambient-temp')
                //     return false
                // }
                chart.destroy()
                chart2.destroy()
                // -----------------------------------------------Show Tab Contents------------------------------------------
                // document.getElementById("one-panel-content").setAttribute("hidden", true)
                // document.getElementById("two-panel-content").setAttribute("hidden", true)
                // document.getElementById("six-panel-content").setAttribute("hidden", true)
                // document.getElementById("seven-cdu-panel-content").setAttribute("hidden", true)
                // document.getElementById("ten-panel-content").setAttribute("hidden", true)
                document.getElementById("step-table-tab").removeAttribute("hidden")
                document.getElementById("datasheet-report").removeAttribute("hidden")
                document.getElementById("datasheet-report-evap").removeAttribute("hidden")
                document.getElementById("IS-report").removeAttribute("hidden")
                document.getElementById("chart-div").removeAttribute("hidden")
                document.getElementById("seven-panel").style.visibility = "visible"
                document.getElementById("eight-panel").style.visibility = "visible"
                document.getElementById("nine-panel").style.visibility = "visible"
                document.getElementById("ten-panel").style.visibility = "visible"



                // -------------------------------------------Cal Result---------------------------------------------
                // if select brand 
                ipc.send('cdu-cal-click-cooling', selectBrandCdu.options[selectBrandCdu.selectedIndex].value, selectTypeCdu.options[selectTypeCdu.selectedIndex].value, selectSeriesCdu.options[selectSeriesCdu.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, coolingFromEvap, textSst.value, textAmbient.value, radioAppLow.checked, radioAppMed.checked, textAcceptableMins.value, textAcceptablePlus.value, checkAcceptEvap.checked, selectUnit.options[selectUnit.selectedIndex].value)
                ipc.once('cdu-cal-send-cooling', (event, data) => {
                    if (data[0] == null) {
                        ipc.send('validate-data-empty')
                        for (let i = 0; i < 5; i++) {
                            let j = 0
                            for (let k = 0; k < cduTableRows.length; k++) {
                                cduTableRows[k].querySelectorAll("td")[i].innerHTML = null
                                cduTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                            }
                            for (let item in data[i]) {
                                if (item == "a_model") {
                                    cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                    j++;
                                }
                                else {
                                    cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                    j++;
                                }
                            }
                        }
                        evapTap.setAttribute("disabled", true)
                        document.getElementById("three-panel").innerHTML = null
                        document.getElementById("four-panel").innerHTML = null
                        document.getElementById("five-panel").innerHTML = null

                        document.getElementById("step-table-tab").setAttribute("hidden", true)
                        document.getElementById("datasheet-report").setAttribute("hidden", true)
                        document.getElementById("IS-report").setAttribute("hidden", true)
                        document.getElementById("chart-div").setAttribute("hidden", true)
                        document.getElementById("chart-alert").setAttribute("hidden", true)
                        document.getElementById("chart-note").setAttribute("hidden", true)

                        return false
                    } else if (data[0]["a_model"] == "") {
                        ipc.send('validate-data-empty')
                        for (let i = 0; i < 5; i++) {
                            let j = 0
                            for (let k = 0; k < cduTableRows.length; k++) {
                                cduTableRows[k].querySelectorAll("td")[i].innerHTML = null
                                cduTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                            }
                            for (let item in data[i]) {
                                if (item == "a_model") {
                                    cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                    j++;
                                }
                                else {
                                    cduTableRows[j].querySelectorAll("td")[i].innerHTML = null
                                    j++;
                                }
                            }
                        }
                        evapTap.setAttribute("disabled", true)
                        document.getElementById("three-panel").innerHTML = null
                        document.getElementById("four-panel").innerHTML = null
                        document.getElementById("five-panel").innerHTML = null

                        document.getElementById("step-table-tab").setAttribute("hidden", true)
                        document.getElementById("datasheet-report").setAttribute("hidden", true)
                        document.getElementById("IS-report").setAttribute("hidden", true)
                        document.getElementById("chart-div").setAttribute("hidden", true)
                        document.getElementById("chart-alert").setAttribute("hidden", true)
                        document.getElementById("chart-note").setAttribute("hidden", true)
                        return false
                    }
                    for (let i = 0; i < 5; i++) {
                        let j = 0
                        for (let k = 0; k < cduTableRows.length; k++) {
                            cduTableRows[k].querySelectorAll("td")[i].innerHTML = null
                            cduTableRows[k].querySelectorAll("td")[i].classList.remove("active")
                        }
                        for (let item in data[i]) {
                            if (i == 0) {
                                cduTableRows[j].querySelectorAll("td")[i].classList.add("active")
                            }
                            if (item == "a_model") {
                                let labelChild = `<label id="model${i + 1}" class="model-result"><input type="radio" name="model">${data[i][item]}</label>`
                                cduTableRows[j].querySelectorAll("td")[i].innerHTML = labelChild
                                j++;
                            }
                            else {
                                cduTableRows[j].querySelectorAll("td")[i].innerHTML = `<div class="model-result-detail">${data[i][item]}</div>`

                                if (item == "d_coolingStep") {
                                    cduTableRows[j].querySelectorAll("td")[i].style.fontWeight = "800"
                                    if (parseFloat(data[i][item]) < 100) {
                                        cduTableRows[j].querySelectorAll("td")[i].style.color = "red"
                                    }
                                    else {
                                        cduTableRows[j].querySelectorAll("td")[i].style.color = "green"
                                    }
                                }
                                j++;
                            }
                        }
                    }

                    // -----------------------------------------Tabs-----------------------------------------------------
                    document.getElementsByName("model")[0].checked = true
                    // ---------------------------------------First Technical Data---------------------------------------
                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        if (techData[0].product_type_cooled == "Water cooled") {
                            let techTable = `
                          <table class="techTable">
                              <tr>
                                  <th>Compressor</th>
                                  <td></td>
                              </tr>
                              <tr>
                                  <th>Model Name</th>
                                  <td>${techData[0].product_model}</td>
                              </tr>
                              <tr>
                                  <th>Max Current (A)</th>
                                  <td>${techData[0].tech_max_current}</td>
                              </tr>
                              <tr>
                                  <th>Locked Rotor Amp (A)</th>
                                  <td>${techData[0].tech_locked_rotor_current}</td>
                              </tr>
                              <tr>
                                  <th>Voltage (V/Ph/Hz)</th>
                                  <td>${techData[0].tech_compresser_voltage}</td>
                              </tr>
                              <tr>
                                  <th>Oil Type</th>
                                  <td>${techData[0].tech_oil_type}</td>
                              </tr>
                              <tr>
                                  <th>Oil Recharge (Liters)</th>
                                  <td>${techData[0].tech_oil_recharge}</td>
                              </tr>
                              <tr>
                                  <th>Condenser</th>
                                  <td></td>
                              </tr>
                              <tr>
                                  <th>Serface Area (m<sup>2<sup>)</th>
                                  <td>${techData[0].tech_serface_area}</td>
                              </tr>
                              <tr>
                                  <th>Heat exchanger</th>
                                  <td>${techData[0].tech_number_of_curcuits}</td>
                              </tr>
                              <tr>
                                  <th>Water Volume (Liters)</th>
                                  <td>${techData[0].tech_water_volume}</td>
                              </tr>
                              <tr>
                                  <th>Water IN/OUT Diameter (Inch)</th>
                                  <td>${techData[0].tech_water_diameter}</td>
                              </tr>
                              <tr>
                              </tr>
                              <tr>
                                  <th>Others</th>
                                  <td></td>
                              </tr>
                              <tr>
                                  <th>Oil Seperator Volume (Liters)</th>
                                  <td>${techData[0].tech_oil_seperator_volume}</td>
                              </tr>
                              <tr>
                                  <th>Receiver Volume (Liters)</th>
                                  <td>${techData[0].tech_receiver_volume}</td>
                              </tr>
                              <tr>
                                  <th>Pipe Suction OD (Inch)</th>
                                  <td>${techData[0].tech_pipes_suction}</td>
                              </tr>
                              <tr>
                                  <th>Liquid OD (Inch)</th>
                                  <td>${techData[0].tech_pipes_liquid}</td>
                              </tr>
                              <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                          </table>`
                            document.getElementById("three-panel").innerHTML = techTable
                        } else {
                            let techTable = `
                          <table class="techTable">
                              <tr>
                                  <th>Compressor</th>
                                  <td></td>
                              </tr>
                              <tr>
                                  <th>Model Name</th>
                                  <td>${techData[0].product_model}</td>
                              </tr>
                              <tr>
                                  <th>Max Current (A)</th>
                                  <td>${techData[0].tech_max_current}</td>
                              </tr>
                              <tr>
                                  <th>Locked Rotor Amp (A)</th>
                                  <td>${techData[0].tech_locked_rotor_current}</td>
                              </tr>
                              <tr>
                                  <th>Voltage (V/Ph/Hz)</th>
                                  <td>${techData[0].tech_compresser_voltage}</td>
                              </tr>
                              <tr>
                                  <th>Oil Type</th>
                                  <td>${techData[0].tech_oil_type}</td>
                              </tr>
                              <tr>
                                  <th>Oil Recharge (Liters)</th>
                                  <td>${techData[0].tech_oil_recharge}</td>
                              </tr>
                              <tr>
                                  <th>Fan Motor</th>
                                  <td></td>
                              </tr>
                              <tr>
                                  <th>Number of Fan (Piece)</th>
                                  <td>${techData[0].tech_number_of_fan}</td>
                              </tr>
                              <tr>
                                  <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                  <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                              </tr>
                              <tr>
                                  <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                  <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                              </tr>
                              <tr>
                                  <th>Voltage (V/Ph/Hz)</th>
                                  <td>${techData[0].tech_condenser_voltage}</td>
                              </tr>
                              <tr>
                                  <th>Total Fan Motor Power (Watts)</th>
                                  <td>${techData[0].tech_total_fan_power}</td>
                              </tr>
                              <tr>
                                  <th>Others</th>
                                  <td></td>
                              </tr>
                              <tr>
                                  <th>Oil Seperator Volume (Liters)</th>
                                  <td>${techData[0].tech_oil_seperator_volume}</td>
                              </tr>
                              <tr>
                                  <th>Receiver Volume (Liters)</th>
                                  <td>${techData[0].tech_receiver_volume}</td>
                              </tr>
                              <tr>
                                  <th>Pipe Suction OD (Inch)</th>
                                  <td>${techData[0].tech_pipes_suction}</td>
                              </tr>
                              <tr>
                                  <th>Liquid OD (Inch)</th>
                                  <td>${techData[0].tech_pipes_liquid}</td>
                              </tr>
                              <tr>
                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                            </tr>
                          </table>`
                            document.getElementById("three-panel").innerHTML = techTable
                        }
                    })

                    // ---------------------------------------First Step Table---------------------------------------
                    modelId = document.getElementById('model1').textContent
                    ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                    ipc.once('cdu-product-change-send', (event, data) => {
                        if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                            document.getElementById("start-evap").value = -40
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                            document.getElementById("step-ambient").value = 2
                            if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "COP") {
                                stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Current") {
                                stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }

                        } else {
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                            document.getElementById("step-ambient").value = 2
                            if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "COP") {
                                stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Current") {
                                stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                        }

                        document.getElementById("table-step-dropdown").addEventListener("change", () => {
                            if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                }
                                stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                }
                                stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                }
                                stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                }
                                stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "COP") {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                }
                                stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Current") {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                }
                                stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                    document.getElementById("start-evap").value = -40
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                } else {
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                    selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                    document.getElementById("step-ambient").value = 2
                                }
                                stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                        })
                    })
                    // --------------------------------------First Chart-------------------------------------------
                    var plot = []
                    ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                    ipc.once('cdu-graph-point-send', (event, result) => {
                        let condensingValue = result.g_condensing;
                        let chartNote = result.tech_note;
                        ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-plot-graph-send', (event, data) => {

                            // -----------------------------------Chart--------------------------------------
                            let ArrayPointX = []
                            let ArrayPointY = []
                            let array = []
                            let count1 = 0
                            for (const key in data[0]) {
                                let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                let ObjectPoint = { "x": '', "y": '' }

                                if (key == "envelope_model" || key == "envelope_refrigerant") {
                                    continue
                                }
                                else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                    if ((data[0][key]) == null) {
                                        count1++
                                        continue
                                    }
                                    array.push(ObjectPoint)
                                    ArrayPointX[count1] = data[0][key]
                                    array[count1].x = data[0][key]
                                }
                                else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                    if ((data[0][key]) == null) {
                                        count1++
                                        continue
                                    }
                                    ArrayPointY[count1 - arrayLength1] = data[0][key]
                                    array[count1 - arrayLength1].y = data[0][key]
                                }
                                count1++
                            }
                            if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                for (i = 0; i < array.length; i++) {
                                    array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                    array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                }
                            }
                            array.push(array[0])
                            plot = array
                            let MinX = Math.min.apply(Math, ArrayPointX)
                            let MaxX = Math.max.apply(Math, ArrayPointX)
                            let MinY = Math.min.apply(Math, ArrayPointY)
                            let MaxY = Math.max.apply(Math, ArrayPointY)
                            if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                            }
                            let textEvapTemp = textSst.value
                            chartChange(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote)
                        })
                    })

                    // ---------------------------------------First Dimensions---------------------------------------
                    ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                    ipc.once('cdu-product-change-send', (event, imgModel) => {
                        document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-bot-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                    })

                    // ---------------------------------------First Document---------------------------------------
                    ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                    ipc.once('cdu-product-change-send', (event, docData) => {
                        if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                        } else if ((docData[0].product_document != "" || docData[0].product_document != null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                        } else if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure != "" || docData[0].product_brochure != null)) {
                            document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                        } else {
                            document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                        }
                        let classLink = document.getElementsByClassName("link-web")
                        for (let i = 0; i < classLink.length; i++) {
                            classLink[i].addEventListener('click', (event) => {
                                event.preventDefault();
                                require("electron").shell.openExternal("https://scmrefthai.com/");
                            })
                        }
                    })
                    // ---------------------------------------First DataSheet---------------------------------------
                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        if (techData[0].product_brand == "PATTON") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <div class="pdf-outer" id="savePDF-cdu">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/PATTON Logo_Die cut.png"></div>
                                        <div class="header-text">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
                                            <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                        </div>
                                    </div>
                                </div>`
                            document.getElementById("header-datasheet").innerHTML = techTable
                        } else if (techData[0].product_brand == "KALTMER") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <div class="pdf-outer" id="savePDF-cdu">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                        <div class="header-text" id="header-datasheet">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div>`
                            document.getElementById("header-datasheet").innerHTML = techTable
                        } else if (techData[0].product_brand == "CUBO") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                    <div class="pdf-outer" id="savePDF-cdu">
                                        <div class="pdf-header">
                                            <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/CUBO LOGO.png"></div>
                                            <div class="header-text" id="header-datasheet">
                                                <p class="text-head-font">Specification Sheet</p>
                                                <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                            </div>
                                        </div>
                                    </div>`
                            document.getElementById("header-datasheet").innerHTML = techTable
                        }
                    })


                    stepChangeCapDataSheet(document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)
                    stepChangePowerInputDataSheet(document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)




                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {

                        let techTable =
                            `
                                <table class="pdf-table" id="middle-left">
                                    <tr>
                                        <th colspan="2" id="head-middle-left">Compressor</th>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Model Name</td>
                                        <td class="pdf-table-right">${techData[0].tech_model_comp}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Max Current (A)</td>
                                        <td class="pdf-table-right">${techData[0].tech_max_current}</td> 
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Locked Rotor Amp (A)</td>
                                        <td class="pdf-table-right">${techData[0].tech_locked_rotor_current}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Voltage (V/Ph/Hz)</td>
                                        <td class="pdf-table-right">${techData[0].tech_compresser_voltage}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Oil Type</td>
                                        <td class="pdf-table-right">${techData[0].tech_oil_type}</td>
                                    </tr>
                                    <tr>
                                        <td id="border-middle-left">Oil Recharge (Liters)</td>
                                        <td class="pdf-table-right">${techData[0].tech_oil_recharge}</td>
                                    </tr>
                                </table>             
                                `
                        document.getElementById("middle-left").innerHTML = techTable
                    })
                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        if (techData[0].product_type_cooled == "Water cooled") {
                            let techTable =
                                `<table class="pdf-table" id="middle-right">
                                        <tr>
                                            <th colspan="2" id="head-middle-right">Fan Motor</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Serface Area (m<sup>2</sup>)
                                            </td>
                                            <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Number of Curcuits</td>
                                            <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Water Volume (Liters)</td>
                                            <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                                            <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                            <td class="pdf-table-right">-</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">&nbsp</td>
                                            <td class="pdf-table-right">&nbsp</td>
                                        </tr>
                                    </table>`
                            document.getElementById("middle-right").innerHTML = techTable
                        }
                        else {
                            let techTable =
                                `<table class="pdf-table" id="middle-right">
                                        <tr>
                                            <th colspan="2" id="head-middle-right">Fan Motor</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Number of Fan (Pieces)</td>
                                            <td class="pdf-table-right">${techData[0].tech_number_of_fan}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Diameter (mm.)</td>
                                            <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</td>
                                            <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Voltage (V/Ph/Hz)</td>
                                            <td class="pdf-table-right">${techData[0].tech_condenser_voltage}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                            <td class="pdf-table-right">${techData[0].tech_total_fan_power}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">&nbsp</td>
                                            <td class="pdf-table-right">&nbsp</td>
                                        </tr>
                                    </table>
                                    `
                            document.getElementById("middle-right").innerHTML = techTable
                        }

                    })
                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        let techTable =
                            ` 
                                <table class="pdf-table" id="middle-others">
                                    <tr id="head-other">
                                        <th colspan="2" >Others</th>
                                    </tr>
                                    <tr>
                                        <td id="other-td-border">Oil Separator Volume (Liters)</td>
                                        <td class="pdf-table-right">${techData[0].tech_oil_seperator_volume}</td>
                                    </tr>
                                    <tr>
                                        <td  id="other-td-border">Receiver Volume (Liters)</td>
                                        <td class="pdf-table-right">${techData[0].tech_receiver_volume}</td>
                                    </tr>
                                    <tr>
                                        <td  id="other-td-border">Pipes Suction OD (Inch)</td>
                                        <td class="pdf-table-right">${techData[0].tech_pipes_suction}</td>
                                    </tr>
                                    <tr>
                                        <td id="other-td-border">Liquid OD (Inch)</td>
                                        <td class="pdf-table-right">${techData[0].tech_pipes_liquid}</td>
                                    </tr>
                                    <tr>
                                        <td id="other-td-border">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>
                                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                                    </tr>
                                    <tr id="other-border-note">
                                        <td colspan="2" id='font-note'>
                                            Note: &nbsp&nbsp ${techData[0].tech_note}
                                        </td>
                                    </tr>
                                </table>
                                `
                        document.getElementById("middle-others").innerHTML = techTable
                    })
                    ipc.send('cdu-product-change', document.getElementById("model1").textContent)
                    ipc.once('cdu-product-change-send', (event, imgModel) => {
                        document.getElementById("dimension-datasheet").innerHTML =
                            "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                    })
                    // ---------------------------------- First Operating Summary ------------------
                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        if (techData[0].product_brand == "PATTON") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                    <div id="header-IS">
                                        <div class="IS-header">
                                            <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/PATTON Logo_Die cut.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                            document.getElementById("header-IS").innerHTML = techTable
                        } else if (techData[0].product_brand == "KALTMER") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <div id="header-IS">
                                    <div class="IS-header">
                                        <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                        src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                            document.getElementById("header-IS").innerHTML = techTable
                        } else if (techData[0].product_brand == "CUBO") {
                            let checkTemp = ""
                            if (techData[0].product_med_temp == "1") {
                                if(radioAppLow.checked == false)
                                    checkTemp = "Medium Temp"
                                else{
                                    checkTemp = "Low Temp"
                                }
                            } else {
                                checkTemp = "Low Temp"
                            }
                            let techTable = `
                                <div id="header-IS">
                                    <div class="IS-header">
                                        <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                        src=".../img/CUBO LOGO.png"></div>
                                        <div class="IS-text">
                                            <p class="IS-head-font">Operating Summary</p>
                                            <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                            <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                            <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                        </div>
                                    </div>
                                </div> `
                            document.getElementById("header-IS").innerHTML = techTable
                        }

                    })

                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        let checkTemp = ""
                        if (techData[0].product_med_temp == "1") {
                            if(radioAppLow.checked == false)
                                checkTemp = "Medium Temp"
                            else{
                                checkTemp = "Low Temp"
                            }
                        } else {
                            checkTemp = "Low Temp"
                        }
                        let techTable = `
                                <table class="IS-table" id="IS-top">
                                <tr>
                                    <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">CDU Model</td>
                                    <td class="IS-table-right">${techData[0].product_model}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Brand</td>
                                    <td class="IS-table-right">${techData[0].product_brand} </td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Series</td>
                                    <td class="IS-table-right">${techData[0].product_series}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Refrigerant</td>
                                    <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                                    <td class="IS-table-right">${cutunit(data[0].e_cooling)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Application Temp</td>
                                    <td class="IS-table-right">${checkTemp}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                                    <td class="IS-table-right">${cutunit(data[0].f_powerInput)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'}</td>
                                    <td class="IS-table-right">${cutunit(data[0].h_heatReject)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                                    <td class="IS-table-right">${cutunit(data[0].i_cop)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">Compressor Current (A) </td>
                                    <td class="IS-table-right">${cutunit(data[0].j_compressor)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                                    <td class="IS-table-right">${cutunit(data[0].k_massflow)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                                    <td class="IS-table-right">${cutunit(data[0].g_condensing)}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design SST (Evap temp) (˚C)' : 'Design SST (Evap temp) (˚F)'}</td>
                                    <td class="IS-table-right">${textSst.value}</td>
                                </tr>
                                <tr>
                                    <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                                    <td class="IS-table-right">${textAmbient.value}</td>
                                </tr>
                                </table> `
                        document.getElementById("IS-top").innerHTML = techTable
                    })

                    ipc.send('cdu-tech-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        let techTable = `<table class="IS-table" id="IS-Note-mid">
                                <tr>
                                    <td >
                                    Note: &nbsp&nbsp ${techData[0].tech_note}
                                    </td>
                                </tr>
                            </table> `
                        document.getElementById("IS-Note-mid").innerHTML = techTable
                    })

                    // --------------------------------------First  Operating Summary  Chart-------------------------------------------
                    let plot2 = []
                    ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                    ipc.once('cdu-graph-point-send', (event, result) => {
                        let condensingValue = result.g_condensing;
                        ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('cdu-plot-graph-send', (event, data) => {

                            // -----------------------------------Chart--------------------------------------
                            let ArrayPointX = []
                            let ArrayPointY = []
                            let array = []
                            let count1 = 0
                            for (const key in data[0]) {
                                let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                let ObjectPoint = { "x": '', "y": '' }

                                if (key == "envelope_model" || key == "envelope_refrigerant") {
                                    continue
                                }
                                else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                    if ((data[0][key]) == null) {
                                        count1++
                                        continue
                                    }
                                    array.push(ObjectPoint)
                                    ArrayPointX[count1] = data[0][key]
                                    array[count1].x = data[0][key]
                                }
                                else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                    if ((data[0][key]) == null) {
                                        count1++
                                        continue
                                    }
                                    ArrayPointY[count1 - arrayLength1] = data[0][key]
                                    array[count1 - arrayLength1].y = data[0][key]
                                }
                                count1++
                            }
                            if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                for (i = 0; i < array.length; i++) {
                                    array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                    array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                }
                            }
                            array.push(array[0])
                            plot2 = array
                            let MinX = Math.min.apply(Math, ArrayPointX)
                            let MaxX = Math.max.apply(Math, ArrayPointX)
                            let MaxY = Math.max.apply(Math, ArrayPointY)
                            let MinY = Math.min.apply(Math, ArrayPointY)
                            if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                            }
                            let textEvapTemp = textSst.value

                            chartChange2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId)
                        })
                    })
                    if (data.length >= 5) {
                        for (let m = 0; m < 5; m++) {
                            document.getElementById(`model${m + 1}`).addEventListener("change", (e) => {
                                modelId = document.getElementById(`model${m + 1}`).textContent
                                for (i = 0; i < cduTableRows.length; i++) {
                                    for (j = 0; j < 5; j++) {
                                        cduTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                    }
                                    cduTableRows[i].querySelectorAll("td")[m].classList.add("active")
                                }
                                // ---------------------------------------Technical Data---------------------------------------
                                ipc.send('cdu-tech-change', document.getElementById(`model${m + 1}`).textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    let techTable = `
                                        <table class="techTable">
                                            <tr>
                                                <th>Compressor</th>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <th>Model Name</th>
                                                <td>${techData[0].product_model}</td>
                                            </tr>
                                            <tr>
                                                <th>Max Current (A)</th>
                                                <td>${techData[0].tech_max_current}</td>
                                            </tr>
                                            <tr>
                                                <th>Locked Rotor Amp (A)</th>
                                                <td>${techData[0].tech_locked_rotor_current}</td>
                                            </tr>
                                            <tr>
                                                <th>Voltage (V/Ph/Hz)</th>
                                                <td>${techData[0].tech_compresser_voltage}</td>
                                            </tr>
                                            <tr>
                                                <th>Oil Type</th>
                                                <td>${techData[0].tech_oil_type}</td>
                                            </tr>
                                            <tr>
                                                <th>Oil Recharge (Liters)</th>
                                                <td>${techData[0].tech_oil_recharge}</td>
                                            </tr>
                                            <tr>
                                                <th>Fan Motor</th>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <th>Number of Fan (Piece)</th>
                                                <td>${techData[0].tech_number_of_fan}</td>
                                            </tr>
                                            <tr>
                                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                            </tr>
                                            <tr>
                                                <th>Voltage (V/Ph/Hz)</th>
                                                <td>${techData[0].tech_condenser_voltage}</td>
                                            </tr>
                                            <tr>
                                                <th>Total Fan Motor Power (Watts)</th>
                                                <td>${techData[0].tech_total_fan_power}</td>
                                            </tr>
                                            <tr>
                                                <th>Others</th>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <th>Oil Seperator Volume (Liters)</th>
                                                <td>${techData[0].tech_oil_seperator_volume}</td>
                                            </tr>
                                            <tr>
                                                <th>Receiver Volume (Liters)</th>
                                                <td>${techData[0].tech_receiver_volume}</td>
                                            </tr>
                                            <tr>
                                                <th>Pipe Suction OD (Inch)</th>
                                                <td>${techData[0].tech_pipes_suction}</td>
                                            </tr>
                                            <tr>
                                                <th>Liquid OD (Inch)</th>
                                                <td>${techData[0].tech_pipes_liquid}</td>
                                            </tr>
                                            <tr>
                                                <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                                <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                                            </tr>
                                        </table>`
                                    document.getElementById("three-panel").innerHTML = techTable
                                })
                                // ---------------------------------------Step Table---------------------------------------
                                dropDownType = document.getElementById("table-step-dropdown").value
                                modelPositionId = document.getElementById(`model${m + 1}`).textContent
                                ipc.send('cdu-product-change', modelId)
                                ipc.once('cdu-product-change-send', (event, data) => {

                                    if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                        document.getElementById("start-evap").value = -40
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                        document.getElementById("step-ambient").value = 2
                                    } else {
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                        document.getElementById("step-ambient").value = 2

                                    }
                                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                        stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                        stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                        stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                        stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                                        stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                                        stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                        stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }

                                })

                                // ---------------------------------------Dimensions---------------------------------------
                                ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                                ipc.once('cdu-product-change-send', (event, imgModel) => {
                                    document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-bot-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                                })
                                // ---------------------------------------Document------------------------------------------
                                ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                                ipc.once('cdu-product-change-send', (event, docData) => {
                                    if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                    } else if ((docData[0].product_document != "" || docData[0].product_document != null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                    } else if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure != "" || docData[0].product_brochure != null)) {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                    } else {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                    }
                                    let classLink = document.getElementsByClassName("link-web")
                                    for (let i = 0; i < classLink.length; i++) {
                                        classLink[i].addEventListener('click', (event) => {
                                            event.preventDefault();
                                            require("electron").shell.openExternal("https://scmrefthai.com/");
                                        })
                                    }
                                })

                                ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                                ipc.once('cdu-graph-point-send', (event, result) => {
                                    let condensingValue = result.g_condensing;
                                    let chartNote = result.tech_note;
                                    ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('cdu-plot-graph-send', (event, data) => {

                                        // -----------------------------------Chart--------------------------------------
                                        let ArrayPointX = []
                                        let ArrayPointY = []
                                        let array = []
                                        let count1 = 0
                                        for (const key in data[0]) {
                                            let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                            let ObjectPoint = { "x": '', "y": '' }

                                            if (key == "envelope_model" || key == "envelope_refrigerant") {
                                                continue
                                            }
                                            else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                                if ((data[0][key]) == null) {
                                                    count1++
                                                    continue
                                                }
                                                array.push(ObjectPoint)
                                                ArrayPointX[count1] = data[0][key]
                                                array[count1].x = data[0][key]
                                            }
                                            else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                                if ((data[0][key]) == null) {
                                                    count1++
                                                    continue
                                                }
                                                ArrayPointY[count1 - arrayLength1] = data[0][key]
                                                array[count1 - arrayLength1].y = data[0][key]
                                            }
                                            count1++
                                        }
                                        //test
                                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                            for (i = 0; i < array.length; i++) {
                                                array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                                array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                            }
                                        }
                                        array.push(array[0])
                                        plot = array
                                        let MinX = Math.min.apply(Math, ArrayPointX)
                                        let MaxX = Math.max.apply(Math, ArrayPointX)
                                        let MinY = Math.min.apply(Math, ArrayPointY)
                                        let MaxY = Math.max.apply(Math, ArrayPointY)
                                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                            MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                            MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                            MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                            MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                            condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                        }
                                        let textEvapTemp = textSst.value
                                        updateChart(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote)
                                    })
                                })
                                // ---------------------------------------DataSheet Result > 5---------------------------------------
                                ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    if (techData[0].product_brand == "PATTON") {
                                        let checkTemp = ""
                                        if (techData[0].product_med_temp == "1") {
                                            if(radioAppLow.checked == false)
                                                checkTemp = "Medium Temp"
                                            else{
                                                checkTemp = "Low Temp"
                                            }
                                        } else {
                                            checkTemp = "Low Temp"
                                        }
                                        let techTable = `
                                            <div class="pdf-outer" id="savePDF-cdu">
                                                <div class="pdf-header">
                                                    <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                        src="../img/PATTON Logo_Die cut.png"></div>
                                                    <div class="header-text">
                                                        <p class="text-head-font">Specification Sheet</p>
                                                        <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                        <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                        <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                    </div>
                                                </div>
                                            </div>`
                                        document.getElementById("header-datasheet").innerHTML = techTable
                                    } else if (techData[0].product_brand == "KALTMER") {
                                        let checkTemp = ""
                                        if (techData[0].product_med_temp == "1") {
                                            if(radioAppLow.checked == false)
                                                checkTemp = "Medium Temp"
                                            else{
                                                checkTemp = "Low Temp"
                                            }
                                        } else {
                                            checkTemp = "Low Temp"
                                        }
                                        let techTable = `
                                            <div class="pdf-outer" id="savePDF-cdu">
                                                <div class="pdf-header">
                                                    <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                        src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                    <div class="header-text" id="header-datasheet">
                                                        <p class="text-head-font">Specification Sheet</p>
                                                        <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                        <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                        <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                    </div>
                                                </div>
                                            </div>`
                                        document.getElementById("header-datasheet").innerHTML = techTable
                                    } else if (techData[0].product_brand == "CUBO") {
                                        let checkTemp = ""
                                        if (techData[0].product_med_temp == "1") {
                                            if(radioAppLow.checked == false)
                                                checkTemp = "Medium Temp"
                                            else{
                                                checkTemp = "Low Temp"
                                            }
                                        } else {
                                            checkTemp = "Low Temp"
                                        }
                                        let techTable = `
                                            <div class="pdf-outer" id="savePDF-cdu">
                                                <div class="pdf-header">
                                                    <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                        src="../img/CUBO LOGO.png"></div>
                                                    <div class="header-text" id="header-datasheet">
                                                        <p class="text-head-font">Specification Sheet</p>
                                                        <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                        <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                        <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                    </div>
                                                </div>
                                            </div>`
                                        document.getElementById("header-datasheet").innerHTML = techTable
                                    }
                                })
                                stepChangeCapDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)
                                stepChangePowerInputDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)

                                ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    let techTable =
                                        `
                                            <table class="pdf-table" id="middle-left">
                                                <tr>
                                                    <th colspan="2" id="head-middle-left">Compressor</th>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left">Model Name</td>
                                                    <td class="pdf-table-right">${techData[0].tech_model_comp}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left">Max Current (A)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_max_current}</td> 
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left">Locked Rotor Amp (A)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_locked_rotor_current}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left">Voltage (V/Ph/Hz)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_compresser_voltage}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left">Oil Type</td>
                                                    <td class="pdf-table-right">${techData[0].tech_oil_type}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-left">Oil Recharge (Liters)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_oil_recharge}</td>
                                                </tr>
                                            </table>             
                                            `
                                    document.getElementById("middle-left").innerHTML = techTable
                                })
                                ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    if (techData[0].product_type_cooled == "Water cooled") {
                                        let techTable =
                                            `<table class="pdf-table" id="middle-right">
                                                    <tr>
                                                        <th colspan="2" id="head-middle-right">Fan Motor</th>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Serface Area (m<sup>2</sup>)</td>
                                                        <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Number of Curcuits</td>
                                                        <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Water Volume (Liters)</td>
                                                        <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                                                        <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                                        <td class="pdf-table-right">-</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">&nbsp</td>
                                                        <td class="pdf-table-right">&nbsp</td>
                                                    </tr>
                                                </table>`
                                        document.getElementById("middle-right").innerHTML = techTable
                                    }
                                    else {
                                        let techTable =
                                            `<table class="pdf-table" id="middle-right">
                                                    <tr>
                                                        <th colspan="2" id="head-middle-right">Fan Motor</th>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Number of Fan (Pieces)</td>
                                                        <td class="pdf-table-right">${techData[0].tech_number_of_fan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Diameter (mm.)</td>
                                                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</td>
                                                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Voltage (V/Ph/Hz)</td>
                                                        <td class="pdf-table-right">${techData[0].tech_condenser_voltage}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                                        <td class="pdf-table-right">${techData[0].tech_total_fan_power}</td>
                                                    </tr>
                                                    <tr>
                                                        <td id="border-middle-right">&nbsp</td>
                                                        <td class="pdf-table-right">&nbsp</td>
                                                    </tr>
                                                </table>`
                                        document.getElementById("middle-right").innerHTML = techTable
                                    }

                                })
                                ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    let techTable =
                                        ` 
                                            <table class="pdf-table" id="middle-others">
                                                <tr id="head-other">
                                                    <th colspan="2" >Others</th>
                                                </tr>
                                                <tr>
                                                    <td id="other-td-border">Oil Separator Volume (Liters)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_oil_seperator_volume}</td>
                                                </tr>
                                                <tr>
                                                    <td  id="other-td-border">Receiver Volume (Liters)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_receiver_volume}</td>
                                                </tr>
                                                <tr>
                                                    <td  id="other-td-border">Pipes Suction OD (Inch)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_pipes_suction}</td>
                                                </tr>
                                                <tr>
                                                    <td id="other-td-border">Liquid OD (Inch)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_pipes_liquid}</td>
                                                </tr>
                                                <tr>
                                                    <td id="other-td-border">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>
                                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                                                </tr>
                                                <tr id="other-border-note">
                                                    <td colspan="2" id='font-note'>
                                                        Note: &nbsp&nbsp ${techData[0].tech_note}
                                                    </td>
                                                </tr>
                                            </table>
                                            `
                                    document.getElementById("middle-others").innerHTML = techTable
                                })
                                ipc.send('cdu-product-change', modelId)
                                ipc.once('cdu-product-change-send', (event, imgModel) => {
                                    document.getElementById("dimension-datasheet").innerHTML =
                                        "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                                })
                                // ----------------------------------  Operating Summary >5 ------------------
                                ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    if (techData[0].product_brand == "PATTON") {
                                        let checkTemp = ""
                                        if (techData[0].product_med_temp == "1") {
                                            if(radioAppLow.checked == false)
                                                checkTemp = "Medium Temp"
                                            else{
                                                checkTemp = "Low Temp"
                                            }
                                        } else {
                                            checkTemp = "Low Temp"
                                        }
                                        let techTable = `
                                            <div id="header-IS">
                                                <div class="IS-header">
                                                    <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                                    src="../img/PATTON Logo_Die cut.png"></div>
                                                <div class="IS-text">
                                                    <p class="IS-head-font">Operating Summary</p>
                                                    <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                    <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                    <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                </div>
                                            </div>
                                            </div> `
                                        document.getElementById("header-IS").innerHTML = techTable
                                    } else if (techData[0].product_brand == "KALTMER") {
                                        let checkTemp = ""
                                        if (techData[0].product_med_temp == "1") {
                                            if(radioAppLow.checked == false)
                                                checkTemp = "Medium Temp"
                                            else{
                                                checkTemp = "Low Temp"
                                            }
                                        } else {
                                            checkTemp = "Low Temp"
                                        }
                                        let techTable = `
                                            <div id="header-IS">
                                                <div class="IS-header">
                                                    <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                                    src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                    <div class="IS-text">
                                                        <p class="IS-head-font">Operating Summary</p>
                                                        <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                        <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                        <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                    </div>
                                                </div>
                                            </div> `
                                        document.getElementById("header-IS").innerHTML = techTable
                                    } else if (techData[0].product_brand == "CUBO") {
                                        let checkTemp = ""
                                        if (techData[0].product_med_temp == "1") {
                                            if(radioAppLow.checked == false)
                                                checkTemp = "Medium Temp"
                                            else{
                                                checkTemp = "Low Temp"
                                            }
                                        } else {
                                            checkTemp = "Low Temp"
                                        }
                                        let techTable = `
                                            <div id="header-IS">
                                                <div class="IS-header">
                                                    <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                                    src=".../img/CUBO LOGO.png"></div>
                                                    <div class="IS-text">
                                                        <p class="IS-head-font">Operating Summary</p>
                                                        <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                        <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                        <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                    </div>
                                                </div>
                                            </div> `
                                        document.getElementById("header-IS").innerHTML = techTable
                                    }

                                })

                                ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                            <table class="IS-table" id="IS-top">
                                            <tr>
                                                <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">CDU Model</td>
                                                <td class="IS-table-right">${techData[0].product_model}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">Brand</td>
                                                <td class="IS-table-right">${techData[0].product_brand} </td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">Series</td>
                                                <td class="IS-table-right">${techData[0].product_series}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">Refrigerant</td>
                                                <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                                                <td class="IS-table-right">${cutunit(data[m].e_cooling)}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">Application Temp</td>
                                                <td class="IS-table-right">${checkTemp}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                                                <td class="IS-table-right">${cutunit(data[m].f_powerInput)}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'} </td>
                                                <td class="IS-table-right">${cutunit(data[m].h_heatReject)}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                                                <td class="IS-table-right">${cutunit(data[m].i_cop)}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">Compressor Current (A) </td>
                                                <td class="IS-table-right">${cutunit(data[m].j_compressor)}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                                                <td class="IS-table-right">${cutunit(data[m].k_massflow)}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                                                <td class="IS-table-right">${cutunit(data[m].g_condensing)}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>
                                                <td class="IS-table-right">${textSst.value}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                                                <td class="IS-table-right">${textAmbient.value}</td>
                                            </tr>
                                            </table> `
                                    document.getElementById("IS-top").innerHTML = techTable
                                })
                                ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    let techTable = `
                                        <table class="IS-table" id="IS-Note-mid">
                                            <tr>
                                                <td >
                                                    Note: &nbsp&nbsp ${techData[0].tech_note}
                                                </td>
                                            </tr>
                                        </table> `
                                    document.getElementById("IS-Note-mid").innerHTML = techTable
                                })

                                // ------------------------  Operating Summary chart madol data > 5 -------------------
                                ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                                ipc.once('cdu-graph-point-send', (event, result) => {
                                    let condensingValue = result.g_condensing;
                                    ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('cdu-plot-graph-send', (event, data) => {

                                        // ----------------------------------- Operating Summary Chart  model data   > 5 --------------------------------------
                                        let ArrayPointX = []
                                        let ArrayPointY = []
                                        let array = []
                                        let count1 = 0
                                        for (const key in data[0]) {
                                            let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                            let ObjectPoint = { "x": '', "y": '' }

                                            if (key == "envelope_model" || key == "envelope_refrigerant") {
                                                continue
                                            }
                                            else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                                if ((data[0][key]) == null) {
                                                    count1++
                                                    continue
                                                }
                                                array.push(ObjectPoint)
                                                ArrayPointX[count1] = data[0][key]
                                                array[count1].x = data[0][key]
                                            }
                                            else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                                if ((data[0][key]) == null) {
                                                    count1++
                                                    continue
                                                }
                                                ArrayPointY[count1 - arrayLength1] = data[0][key]
                                                array[count1 - arrayLength1].y = data[0][key]
                                            }
                                            count1++
                                        }
                                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                            for (i = 0; i < array.length; i++) {
                                                array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                                array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                            }
                                        }
                                        array.push(array[0])
                                        plot2 = array
                                        let MinX = Math.min.apply(Math, ArrayPointX)
                                        let MaxX = Math.max.apply(Math, ArrayPointX)
                                        let MinY = Math.min.apply(Math, ArrayPointY)
                                        let MaxY = Math.max.apply(Math, ArrayPointY)
                                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                            MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                            MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                            MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                            MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                            condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                        }
                                        let textEvapTemp = textSst.value
                                        updateChart2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue)
                                    })
                                })
                            })
                        }
                    }
                    else {
                        for (let m = 0; m < data.length; m++) {
                            document.getElementById(`model${m + 1}`).addEventListener("change", (e) => {
                                modelId = document.getElementById(`model${m + 1}`).textContent
                                for (i = 0; i < cduTableRows.length; i++) {
                                    for (j = 0; j < 5; j++) {
                                        cduTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                                    }
                                    cduTableRows[i].querySelectorAll("td")[m].classList.add("active")
                                }
                                // ---------------------------------------Technical Data---------------------------------------
                                ipc.send('cdu-tech-change', document.getElementById(`model${m + 1}`).textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-tech-change-send', (event, techData) => {
                                    let techTable = `
                                            <table class="techTable">
                                                <tr>
                                                    <th>Compressor</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Model Name</th>
                                                    <td>${techData[0].product_model}</td>
                                                </tr>
                                                <tr>
                                                    <th>Max Current (A)</th>
                                                    <td>${techData[0].tech_max_current}</td>
                                                </tr>
                                                <tr>
                                                    <th>Locked Rotor Amp (A)</th>
                                                    <td>${techData[0].tech_locked_rotor_current}</td>
                                                </tr>
                                                <tr>
                                                    <th>Voltage (V/Ph/Hz)</th>
                                                    <td>${techData[0].tech_compresser_voltage}</td>
                                                </tr>
                                                <tr>
                                                    <th>Oil Type</th>
                                                    <td>${techData[0].tech_oil_type}</td>
                                                </tr>
                                                <tr>
                                                    <th>Oil Recharge (Liters)</th>
                                                    <td>${techData[0].tech_oil_recharge}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fan Motor</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Number of Fan (Piece)</th>
                                                    <td>${techData[0].tech_number_of_fan}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Voltage (V/Ph/Hz)</th>
                                                    <td>${techData[0].tech_condenser_voltage}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total Fan Motor Power (Watts)</th>
                                                    <td>${techData[0].tech_total_fan_power}</td>
                                                </tr>
                                                <tr>
                                                    <th>Others</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Oil Seperator Volume (Liters)</th>
                                                    <td>${techData[0].tech_oil_seperator_volume}</td>
                                                </tr>
                                                <tr>
                                                    <th>Receiver Volume (Liters)</th>
                                                    <td>${techData[0].tech_receiver_volume}</td>
                                                </tr>
                                                <tr>
                                                    <th>Pipe Suction OD (Inch)</th>
                                                    <td>${techData[0].tech_pipes_suction}</td>
                                                </tr>
                                                <tr>
                                                    <th>Liquid OD (Inch)</th>
                                                    <td>${techData[0].tech_pipes_liquid}</td>
                                                </tr>
                                                <tr>
                                                    <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</th>
                                                    <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                                                </tr>
                                            </table>`
                                    document.getElementById("three-panel").innerHTML = techTable
                                })
                                // ---------------------------------------Step Table---------------------------------------
                                dropDownType = document.getElementById("table-step-dropdown").value
                                modelPositionId = document.getElementById(`model${m + 1}`).textContent
                                ipc.send('cdu-product-change', modelId)
                                ipc.once('cdu-product-change-send', (event, data) => {
                                    if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                                        document.getElementById("start-evap").value = -40
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                        document.getElementById("step-ambient").value = 2
                                    } else {
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                                        selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                                        document.getElementById("step-ambient").value = 2

                                    }
                                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                        stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                        stepChangePowerInputDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                        stepChangeCondensingDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                        stepChangeHeatRejectDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                                        stepChangeCOPDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                                        stepChangeCurrentDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }
                                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                        stepChangeMassFlowDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    }

                                })

                                // ---------------------------------------Dimensions---------------------------------------
                                ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                                ipc.once('cdu-product-change-send', (event, imgModel) => {
                                    document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-bot-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                                })
                                // ---------------------------------------Document------------------------------------------
                                ipc.send('cdu-product-change', document.getElementById(`model${m + 1}`).textContent)
                                ipc.once('cdu-product-change-send', (event, docData) => {
                                    if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                    } else if ((docData[0].product_document != "" || docData[0].product_document != null) && (docData[0].product_brochure == "" || docData[0].product_brochure == null)) {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                            "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div><hr>"
                                    } else if ((docData[0].product_document == "" || docData[0].product_document == null) && (docData[0].product_brochure != "" || docData[0].product_brochure != null)) {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web'> www.scmrefthai.com <a></div>" +
                                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                    } else {
                                        document.getElementById("five-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].product_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                                            "<hr><div><a href='../document/brochure/" + docData[0].product_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
                                    }
                                    let classLink = document.getElementsByClassName("link-web")
                                    for (let i = 0; i < classLink.length; i++) {
                                        classLink[i].addEventListener('click', (event) => {
                                            event.preventDefault();
                                            require("electron").shell.openExternal("https://scmrefthai.com/");
                                        })
                                    }
                                })

                                ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                                ipc.once('cdu-graph-point-send', (event, result) => {
                                    let condensingValue = result.g_condensing;
                                    let chartNote = result.tech_note;
                                    ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                    ipc.once('cdu-plot-graph-send', (event, data) => {

                                        // -----------------------------------Chart--------------------------------------
                                        let ArrayPointX = []
                                        let ArrayPointY = []
                                        let array = []
                                        let count1 = 0
                                        for (const key in data[0]) {
                                            let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                            let ObjectPoint = { "x": '', "y": '' }

                                            if (key == "envelope_model" || key == "envelope_refrigerant") {
                                                continue
                                            }
                                            else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                                if ((data[0][key]) == null) {
                                                    count1++
                                                    continue
                                                }
                                                array.push(ObjectPoint)
                                                ArrayPointX[count1] = data[0][key]
                                                array[count1].x = data[0][key]
                                            }
                                            else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                                if ((data[0][key]) == null) {
                                                    count1++
                                                    continue
                                                }
                                                ArrayPointY[count1 - arrayLength1] = data[0][key]
                                                array[count1 - arrayLength1].y = data[0][key]
                                            }
                                            count1++
                                        }
                                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                            for (i = 0; i < array.length; i++) {
                                                array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                                array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                            }
                                        }
                                        array.push(array[0])
                                        plot = array
                                        let MinX = Math.min.apply(Math, ArrayPointX)
                                        let MaxX = Math.max.apply(Math, ArrayPointX)
                                        let MinY = Math.min.apply(Math, ArrayPointY)
                                        let MaxY = Math.max.apply(Math, ArrayPointY)
                                        if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                            MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                            MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                            MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                            MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                            condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                        }
                                        let textEvapTemp = textSst.value
                                        updateChart(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote)
                                    })
                                })
                            })
                            // ---------------------------------------DataSheet Result < 5---------------------------------------
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {

                                if (techData[0].product_brand == "PATTON") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                        <div class="pdf-outer" id="savePDF-cdu">
                                            <div class="pdf-header">
                                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                    src="../img/PATTON Logo_Die cut.png"></div>
                                                <div class="header-text">
                                                    <p class="text-head-font">Specification Sheet</p>
                                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                </div>
                                            </div>
                                        </div>`
                                    document.getElementById("header-datasheet").innerHTML = techTable
                                } else if (techData[0].product_brand == "KALTMER") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                        <div class="pdf-outer" id="savePDF-cdu">
                                            <div class="pdf-header">
                                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                    src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                <div class="header-text" id="header-datasheet">
                                                    <p class="text-head-font">Specification Sheet</p>
                                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                </div>
                                            </div>
                                        </div>`
                                    document.getElementById("header-datasheet").innerHTML = techTable
                                } else if (techData[0].product_brand == "CUBO") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                        <div class="pdf-outer" id="savePDF-cdu">
                                            <div class="pdf-header">
                                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                    src="../img/CUBO LOGO.png"></div>
                                                <div class="header-text" id="header-datasheet">
                                                    <p class="text-head-font">Specification Sheet</p>
                                                    <p class="text-head-font" id="datasheet-head-model-cdu">${techData[0].product_model}</p>
                                                    <p class="text-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                    <p class="text-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                </div>
                                            </div>
                                        </div>`
                                    document.getElementById("header-datasheet").innerHTML = techTable
                                }
                            })
                            stepChangeCapDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)
                            stepChangePowerInputDataSheet(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppLow.checked, radioAppMed.checked)

                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable =
                                    `
                                        <table class="pdf-table" id="middle-left">
                                            <tr>
                                                <th colspan="2" id="head-middle-left">Compressor</th>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-left">Model Name</td>
                                                <td class="pdf-table-right">${techData[0].tech_model_comp}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-left">Max Current (A)</td>
                                                <td class="pdf-table-right">${techData[0].tech_max_current}</td> 
                                            </tr>
                                            <tr>
                                                <td id="border-middle-left">Locked Rotor Amp (A)</td>
                                                <td class="pdf-table-right">${techData[0].tech_locked_rotor_current}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-left">Voltage (V/Ph/Hz)</td>
                                                <td class="pdf-table-right">${techData[0].tech_compresser_voltage}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-left">Oil Type</td>
                                                <td class="pdf-table-right">${techData[0].tech_oil_type}</td>
                                            </tr>
                                            <tr>
                                                <td id="border-middle-left">Oil Recharge (Liters)</td>
                                                <td class="pdf-table-right">${techData[0].tech_oil_recharge}</td>
                                            </tr>
                                        </table>             
                                        `
                                document.getElementById("middle-left").innerHTML = techTable
                            })
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                if (techData[0].product_type_cooled == "Water cooled") {
                                    let techTable =
                                        `<table class="pdf-table" id="middle-right">
                                                <tr>
                                                    <th colspan="2" id="head-middle-right">Fan Motor</th>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Serface Area (m<sup>2</sup>)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Number of Curcuits</td>
                                                    <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Water Volume (Liters)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                                    <td class="pdf-table-right">-</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">&nbsp</td>
                                                    <td class="pdf-table-right">&nbsp</td>
                                                </tr>
                                            </table>`
                                    document.getElementById("middle-right").innerHTML = techTable
                                }
                                else {
                                    let techTable =
                                        `<table class="pdf-table" id="middle-right">
                                                <tr>
                                                    <th colspan="2" id="head-middle-right">Fan Motor</th>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Number of Fan (Pieces)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_number_of_fan}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Diameter (mm.)</td>
                                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_diameter_fan : (parseFloat(techData[0].tech_diameter_fan) * 0.03937).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</td>
                                                    <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_air_flow : (parseFloat(techData[0].tech_air_flow) * 0.5886).toFixed(0)}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Voltage (V/Ph/Hz)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_condenser_voltage}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">Total Fan Motor Power (Watts)</td>
                                                    <td class="pdf-table-right">${techData[0].tech_total_fan_power}</td>
                                                </tr>
                                                <tr>
                                                    <td id="border-middle-right">&nbsp</td>
                                                    <td class="pdf-table-right">&nbsp</td>
                                                </tr>
                                            </table>`
                                    document.getElementById("middle-right").innerHTML = techTable
                                }
                            })
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable =
                                    ` 
                                        <table class="pdf-table" id="middle-others">
                                            <tr id="head-other">
                                                <th colspan="2" >Others</th>
                                            </tr>
                                            <tr>
                                                <td id="other-td-border">Oil Separator Volume (Liters)</td>
                                                <td class="pdf-table-right">${techData[0].tech_oil_seperator_volume}</td>
                                            </tr>
                                            <tr>
                                                <td  id="other-td-border">Receiver Volume (Liters)</td>
                                                <td class="pdf-table-right">${techData[0].tech_receiver_volume}</td>
                                            </tr>
                                            <tr>
                                                <td  id="other-td-border">Pipes Suction OD (Inch)</td>
                                                <td class="pdf-table-right">${techData[0].tech_pipes_suction}</td>
                                            </tr>
                                            <tr>
                                                <td id="other-td-border">Liquid OD (Inch)</td>
                                                <td class="pdf-table-right">${techData[0].tech_pipes_liquid}</td>
                                            </tr>
                                            <tr>
                                                <td id="other-td-border">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>
                                                <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].tech_weight : (parseFloat(techData[0].tech_weight) * 2.2046).toFixed(0)}</td>
                                            </tr>
                                            <tr id="other-border-note">
                                                <td colspan="2" id='font-note'>
                                                    Note: &nbsp&nbsp ${techData[0].tech_note}
                                                </td>
                                            </tr>
                                        </table>
                                        `
                                document.getElementById("middle-others").innerHTML = techTable
                            })
                            ipc.send('cdu-product-change', modelId)
                            ipc.once('cdu-product-change-send', (event, imgModel) => {
                                document.getElementById("dimension-datasheet").innerHTML =
                                    "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
                            })
                            // ----------------------------------  Operating Summary >5 ------------------
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                if (techData[0].product_brand == "PATTON") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                        <div id="header-IS">
                                            <div class="IS-header">
                                                <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/PATTON Logo_Die cut.png"></div>
                                            <div class="IS-text">
                                                <p class="IS-head-font">Operating Summary</p>
                                                <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                            </div>
                                        </div>
                                        </div> `
                                    document.getElementById("header-IS").innerHTML = techTable
                                } else if (techData[0].product_brand == "KALTMER") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                        <div id="header-IS">
                                            <div class="IS-header">
                                                <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                                <div class="IS-text">
                                                    <p class="IS-head-font">Operating Summary</p>
                                                    <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                    <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                    <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                </div>
                                            </div>
                                        </div> `
                                    document.getElementById("header-IS").innerHTML = techTable
                                } else if (techData[0].product_brand == "CUBO") {
                                    let checkTemp = ""
                                    if (techData[0].product_med_temp == "1") {
                                        if(radioAppLow.checked == false)
                                            checkTemp = "Medium Temp"
                                        else{
                                            checkTemp = "Low Temp"
                                        }
                                    } else {
                                        checkTemp = "Low Temp"
                                    }
                                    let techTable = `
                                        <div id="header-IS">
                                            <div class="IS-header">
                                                <div class="IS-logo"><img id="logo-data-sheet" width="90%"
                                                src=".../img/CUBO LOGO.png"></div>
                                                <div class="IS-text">
                                                    <p class="IS-head-font">Operating Summary</p>
                                                    <p class="IS-head-font" id="IS-head-model">${techData[0].product_model}</p>
                                                    <p class="IS-head-font">${techData[0].product_standard_type}  ${techData[0].product_series} CDU</p>
                                                    <p class="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
                                                </div>
                                            </div>
                                        </div> `
                                    document.getElementById("header-IS").innerHTML = techTable
                                }

                            })

                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let checkTemp = ""
                                if (techData[0].product_med_temp == "1") {
                                    if(radioAppLow.checked == false)
                                        checkTemp = "Medium Temp"
                                    else{
                                        checkTemp = "Low Temp"
                                    }
                                } else {
                                    checkTemp = "Low Temp"
                                }
                                let techTable = `
                                        <table class="IS-table" id="IS-top">
                                        <tr>
                                            <th colspan="2" id="css-bg-Condensing">Condensing Units</th>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">CDU Model</td>
                                            <td class="IS-table-right">${techData[0].product_model}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">Brand</td>
                                            <td class="IS-table-right">${techData[0].product_brand} </td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">Series</td>
                                            <td class="IS-table-right">${techData[0].product_series}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">Refrigerant</td>
                                            <td class="IS-table-right">${techData[0].product_refrigerant}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Cooling Capacity (kW)' : 'Cooling Capacity (kBTU/h)'}</td>
                                            <td class="IS-table-right">${cutunit(data[m].e_cooling)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">Application Temp</td>
                                            <td class="IS-table-right">${checkTemp}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Total Power Input (kW)' : 'Total Power Input (kBTU/h)'} </td>
                                            <td class="IS-table-right">${cutunit(data[m].f_powerInput)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'} </td>
                                            <td class="IS-table-right">${cutunit(data[m].h_heatReject)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'COP' : 'EER (BTU/h/W)'}</td>
                                            <td class="IS-table-right">${cutunit(data[m].i_cop)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">Compressor Current (A) </td>
                                            <td class="IS-table-right">${cutunit(data[m].j_compressor)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Mass Flow (g/s)' : 'Mass Flow (lbs/h)'}</td>
                                            <td class="IS-table-right">${cutunit(data[m].k_massflow)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Condensing Temp (˚C)' : 'Condensing Temp (˚F)'}</td>
                                            <td class="IS-table-right">${cutunit(data[m].g_condensing)}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>
                                            <td class="IS-table-right">${textSst.value}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-IS-right" >${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design Ambient Temp (˚C)' : 'Design Ambient Temp (˚F)'}</td>
                                            <td class="IS-table-right">${textAmbient.value}</td>
                                        </tr>
                                        </table> `
                                document.getElementById("IS-top").innerHTML = techTable
                            })
                            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-tech-change-send', (event, techData) => {
                                let techTable = `
                                    <table class="IS-table" id="IS-Note-mid">
                                        <tr>
                                            <td >
                                                Note: &nbsp&nbsp ${techData[0].tech_note}
                                            </td>
                                        </tr>
                                    </table> `
                                document.getElementById("IS-Note-mid").innerHTML = techTable
                            })

                            // ------------------------  Operating Summary chart madol data > 5 -------------------
                            ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                            ipc.once('cdu-graph-point-send', (event, result) => {
                                let condensingValue = result.g_condensing;
                                ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                ipc.once('cdu-plot-graph-send', (event, data) => {

                                    // ----------------------------------- Operating Summary Chart  model data   > 5 --------------------------------------
                                    let ArrayPointX = []
                                    let ArrayPointY = []
                                    let array = []
                                    let count1 = 0
                                    for (const key in data[0]) {
                                        let arrayLength1 = (Object.keys(data[0]).length - 2) / 2
                                        let ObjectPoint = { "x": '', "y": '' }

                                        if (key == "envelope_model" || key == "envelope_refrigerant") {
                                            continue
                                        }
                                        else if (count1 < ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            array.push(ObjectPoint)
                                            ArrayPointX[count1] = data[0][key]
                                            array[count1].x = data[0][key]
                                        }
                                        else if (count1 >= ((Object.keys(data[0]).length - 2) / 2)) {
                                            if ((data[0][key]) == null) {
                                                count1++
                                                continue
                                            }
                                            ArrayPointY[count1 - arrayLength1] = data[0][key]
                                            array[count1 - arrayLength1].y = data[0][key]
                                        }
                                        count1++
                                    }
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        for (i = 0; i < array.length; i++) {
                                            array[i].x = ((parseFloat(array[i].x) * (9 / 5)) + 32).toFixed(0)
                                            array[i].y = ((parseFloat(array[i].y) * (9 / 5)) + 32).toFixed(0)
                                        }
                                    }
                                    array.push(array[0])
                                    plot2 = array
                                    let MinX = Math.min.apply(Math, ArrayPointX)
                                    let MaxX = Math.max.apply(Math, ArrayPointX)
                                    let MinY = Math.min.apply(Math, ArrayPointY)
                                    let MaxY = Math.max.apply(Math, ArrayPointY)
                                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                                        MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                                        MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                                        MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                                        MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                                        condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                                    }
                                    let textEvapTemp = textSst.value
                                    updateChart2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId)
                                })
                            })
                        }

                    }
                    autoClick(data)
                })

                // brand is null
            }
            // -------------------------End CDU from Evap-------------------
        })
        // ----------------------------------------------------Technical Table-------------------------------------------
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, techData) => {
            let techTable = `
                      <table class="techTableEvap">
                          <tr>
                              <th>Unit Coolers</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Model Name</th>
                              <td>${techData[0].evap_model}</td>
                          </tr>
                          <tr>
                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</th>
                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                          </tr>
                          <tr>
                              <th>Fan Motor</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Number of Fan (Pieces)</th>
                              <td>${techData[0].evap_number_of_fan}</td>
                          </tr>
                          <tr>
                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</th>
                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_diameter : (parseFloat(techData[0].evap_diameter) * 0.03937).toFixed(2)}</td>
                          </tr>
                          <tr>
                              <th>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Flow (m<sup>3</sup>/h)' : 'Air Flow (CFM)'}</th>
                              <td>${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td>
                          </tr>
                          <tr>
                              <th>Voltage (V/Ph/Hz)</th>
                              <td>${techData[0].evap_voltage}</td>
                          </tr>
                          <tr>
                              <th>Total Fan Motor Power (Watts)</th>
                              <td>${techData[0].evap_total_fan_motor_power}</td>
                          </tr>
                          <tr>
                              <th>Coil</th>
                              <td></td>
                          </tr>
                          <tr>
                              <th>Curcuit Volume</th>
                              <td>${techData[0].evap_curcuit_volume}</td>
                          </tr>
                          <tr>
                              <th>Distributor Inlet (Inch)</th>
                              <td>${techData[0].evap_distributor_inlet}</td>
                          </tr>
                          <tr>
                              <th>Suction Outlet (Inch)</th>
                              <td>${techData[0].evap_suction_outlet}</td>
                          </tr>
                          <tr>
                              <th>FPI</th>
                              <td>${techData[0].evap_fpi}</td>
                          </tr>
                          <tr>
                              <th>Defrost (Watts)</th>
                              <td>${techData[0].evap_defrost_heater}</td>
                          </tr>
                          
                         
                      </table>`
            document.getElementById("seven-panel").innerHTML = techTable
        })
        // ---------------------------------------First Dimensions---------------------------------------
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, imgModel) => {
            var imgdimen = "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
            if(imgModel[0].evap_l != '-'){
                imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
            }
            if(imgModel[0].evap_w != '-'){
                imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
            }
            if(imgModel[0].evap_h != '-'){
                imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
            }
            if(imgModel[0].evap_a != '-'){
                imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
            }
            if(imgModel[0].evap_b != '-'){
                imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
            }
            if(imgModel[0].evap_c != '-'){
                imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
            }
            if(imgModel[0].evap_d != '-'){
                imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
            }
            imgdimen += "</div>"
            document.getElementById("eight-panel").innerHTML = imgdimen
            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
            //     document.getElementById("eight-panel").innerHTML =
            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // } else if (imgModel[0].evap_series == "JC Series") {
            //     document.getElementById("eight-panel").innerHTML =
            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // }
            // else {
            //     document.getElementById("eight-panel").innerHTML =
            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
            // }
        })
        // ---------------------------------------First Document---------------------------------------
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, docData) => {
            if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                    "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
            } else if ((docData[0].evap_document != "" || docData[0].evap_document != null) && (docData[0].evap_brochure == "" || docData[0].evap_brochure == null)) {
                document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                    "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div><hr>"
            } else if ((docData[0].evap_document == "" || docData[0].evap_document == null) && (docData[0].evap_brochure != "" || docData[0].evap_brochure != null)) {
                document.getElementById("nine-panel").innerHTML = "<hr><div><a><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram are available to download at <a href='#' class='link-web-evap'> www.scmrefthai.com <a></div>" +
                    "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
            } else {
                document.getElementById("nine-panel").innerHTML = "<hr><div><a href='../document/wriring/" + docData[0].evap_document + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Wiring Diagram.pdf</div>" +
                    "<hr><div><a href='../document/brochure/" + docData[0].evap_brochure + ".pdf' download><img class= 'img-pdf-download' src='../img/pdf_download_icon.png'></a> &nbsp&nbsp&nbsp Brochure.pdf</div><hr>"
            }
            let classLink = document.getElementsByClassName("link-web-evap")
            for (let i = 0; i < classLink.length; i++) {
                classLink[i].addEventListener('click', (event) => {
                    event.preventDefault();
                    require("electron").shell.openExternal("https://scmrefthai.com/");
                })
            }
        })
        //------------------------------------------ Data sheet--------------------------
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, techData) => {
            if (techData[0].evap_brand == "PATTON") {
                let checkTemp = ""
                if (radioAppLow.checked) {
                    checkTemp = "Low Temp"
                } else {
                    checkTemp = "Medium Temp"
                }
                let techTable = `
                   <div class="pdf-outer-evap" id="savePDF">
                       <div class="pdf-header-evap">
                           <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                               src="../img/PATTON Logo_Die cut.png"></div>
                           <div class="header-text-evap">
                               <p class="text-head-font-evap">Specification Sheet</p>
                               <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                               <p class="text-head-font-evap"> Unit Coolers</p>
                               <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                           </div>
                       </div>
                   </div>`
                document.getElementById("header-datasheet-evap").innerHTML = techTable
            } else if (techData[0].evap_brand == "KALTMER") {
                let checkTemp = ""
                if (radioAppLow.checked) {
                    checkTemp = "Low Temp"
                } else {
                    checkTemp = "Medium Temp"
                }
                let techTable = `
                   <div class="pdf-outer-evap" id="savePDF">
                       <div class="pdf-header-evap">
                           <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                               src="../img/Kaltmer_Gradient_Diecut.png"></div>
                           <div class="header-text-evap" id="header-datasheet-evap">
                               <p class="text-head-font-evap">Specification Sheet</p>
                               <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                               <p class="text-head-font-evap"> Unit Coolers</p>
                               <p class="text-head-font-evap"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                           </div>
                       </div>
                   </div>`
                document.getElementById("header-datasheet-evap").innerHTML = techTable
            } else if (techData[0].evap_brand == "CUBO") {
                let checkTemp = ""
                if (radioAppLow.checked) {
                    checkTemp = "Low Temp"
                } else {
                    checkTemp = "Medium Temp"
                }
                let techTable = `
                   <div class="pdf-outer-evap" id="savePDF">
                       <div class="pdf-header-evap">
                           <div class="pdf-logo-evap"><img id="logo-data-sheet-evap" width="90%"
                               src="../img/CUBO LOGO.png"></div>
                           <div class="header-text-evap" id="header-datasheet-evap">
                               <p class="text-head-font-evap">Specification Sheet</p>
                               <p class="text-head-font-evap" id="datasheet-head-model-evap">${techData[0].evap_model}</p>
                               <p class="text-head-font-evap"> Unit Coolers</p>
                               <p class="text-head-font-evap"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                           </div>
                       </div>
                   </div>`
                document.getElementById("header-datasheet-evap").innerHTML = techTable
            }

        })
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, techData) => {
            let getCooling = evapTableRows[4].querySelector("td").textContent
            let coolingValue = parseFloat(getCooling)
            let checkTemp = ""
            if (radioAppLow.checked) {
                checkTemp = "Low Temp"
            } else {
                checkTemp = "Medium Temp"
            }
            let techTable = `
               <table class="pdf-table-evap" id="evap-top-evap">
                   <tr>
                       <th  colspan="2" id="head-middle-top-evap">Unit coolers</th>
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">Model Name</td>
                       <td class="pdf-table-right-evap">${techData[0].evap_model}</td>
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">Series</td>
                       <td class="pdf-table-right-evap">${techData[0].evap_series}</td>
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">Voltage (V/Ph/Hz)</td>  
                       <td class="pdf-table-right-evap">${techData[0].evap_voltage}</td>  
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">Refrigerant</td>  
                       <td class="pdf-table-right-evap">${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</td>  
                   </tr>
                   <tr >
                       <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Adjusted Capacity (kW)' : 'Adjusted Capacity (kBTU/h)'}</td>  
                       <td class="pdf-table-right-evap">${coolingValue.toFixed(2)}</td>  
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">Application Temp</td>  
                       <td class="pdf-table-right-evap">${checkTemp}</td>  
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design Air on Temp (°C)' : 'Design Air on Temp (°F)'}</td>  
                       <td class="pdf-table-right-evap">${textRoom.value}</td>  
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">Design TD (K) </td>  
                       <td class="pdf-table-right-evap">${textRoom.value - textSst.value}</td>  
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                       <td class="pdf-table-right-evap">${textSst.value}</td>  
                   </tr>
                   <tr>
                       <td id="border-middle-top-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                       <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                   </tr>
               </table>`
            document.getElementById("evap-top-evap").innerHTML = techTable
        })
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, techData) => {
            let techTable =
                `
               <table class="pdf-table-evap" id="middle-left-evap">
                   <tr>
                       <th colspan="2" id="head-middle-left-evap">Fan Motor Data</th>
                   </tr>
                   <tr>
                       <td id="border-middle-left-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Throw (m)' : 'Air Throw (feet)'}</td>
                       <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_throw : techData[0].evap_air_throw == '-' ? '-' : (parseFloat(techData[0].evap_air_throw) * 3.2808).toFixed(2)}</td>
                   </tr>
                   <tr>
                       <td id="border-middle-left-evap">Air Volume (m<sup>3</sup>/h)</td>
                       <td class="pdf-table-right-evap">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_air_flow : (parseFloat(techData[0].evap_air_flow) * 0.5886).toFixed(0)}</td> 
                   </tr>
                   <tr>
                       <td id="border-middle-left-evap">Fan Qty</td>
                       <td class="pdf-table-right-evap">${techData[0].evap_number_of_fan}</td>
                   </tr>
                   <tr>
                       <td id="border-middle-left-evap">Fan Motor Power (Watts)</td>
                       <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_power}</td>
                   </tr>
                   <tr>
                       <td id="border-middle-left-evap">Fan Motor Current (Amps)</td>
                       <td class="pdf-table-right-evap">${techData[0].evap_total_fan_motor_current}</td>
                   </tr>
               </table>             
             `
            document.getElementById("middle-left-evap").innerHTML = techTable
        })
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, techData) => {
            let techTable =
                `<table class="pdf-table-evap" id="middle-right-evap">
                       <tr>
                           <th colspan="2" id="head-middle-right-evap">Coil Data</th>
                       </tr>
                       <tr>
                           <td id="border-middle-right-evap">Internal Volume (dm<sup>3</sup>)</td>
                           <td class="pdf-table-right-evap">${techData[0].evap_curcuit_volume}</td>
                       </tr>
                       <tr>
                           <td id="border-middle-right-evap">Coil Inlet (Inch)</td>
                           <td class="pdf-table-right-evap">${techData[0].evap_distributor_inlet}</td>
                       </tr>
                       <tr>
                           <td id="border-middle-right-evap">Suct Outlet (Inch)</td>
                           <td class="pdf-table-right-evap">${techData[0].evap_suction_outlet}</td>
                       </tr>
                       <tr>
                           <td id="border-middle-right-evap">Defrost Heater (Watts)</td>
                           <td class="pdf-table-right-evap">${techData[0].evap_defrost_heater}</td>
                       </tr>
                       <tr>
                           <td id="border-middle-right-evap">FPI</td>
                           <td class="pdf-table-right-evap">${techData[0].evap_fpi}</td>
                       </tr>
                   </table>
                   `
            document.getElementById("middle-right-evap").innerHTML = techTable
        })
        ipc.send('evap-data-change', selectModelEvap.options[selectModelEvap.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, imgModel) => {
            var imgdimen = "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
            if(imgModel[0].evap_l != '-'){
                imgdimen += "<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span> "
            }
            if(imgModel[0].evap_w != '-'){
                imgdimen += "<span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> "
            }
            if(imgModel[0].evap_h != '-'){
                imgdimen += "<span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span> "
            }
            if(imgModel[0].evap_a != '-'){
                imgdimen += "<span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> "
            }
            if(imgModel[0].evap_b != '-'){
                imgdimen += "<span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> "
            }
            if(imgModel[0].evap_c != '-'){
                imgdimen += "<span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> "
            }
            if(imgModel[0].evap_d != '-'){
                imgdimen += "<span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span> "
            }
            imgdimen += "</div>"
            document.getElementById("dimension-datasheet-evap").innerHTML = imgdimen
            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
            //     document.getElementById("dimension-datasheet-evap").innerHTML =
            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // } else if (imgModel[0].evap_series == "JC Series") {
            //     document.getElementById("dimension-datasheet-evap").innerHTML =
            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // }
            // else {
            //     document.getElementById("dimension-datasheet-evap").innerHTML =
            //         "<div><img class= 'pdf-img-bot-evap' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
            // }
        })
    }
})

// ----------------------------------------Function-------------------------------------------
var chart
chart = new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
        datasets: [{
            // data: [{ x: 0, y: 0 }],
            label: "Operating Area",
            borderColor: "#3e95cd",
            fill: false,
            lineTension: 0,
        },
        {
            data: [{ x: 0, y: 0 }],
            label: "Operating Point",
            borderColor: "#8cc66f",
            fill: false,
            lineTension: 0,
        }
        ],
    },
    options: {
        title: {
            display: true,
        },
        scales: {
            yAxes: [{
                type: 'linear',
                position: 'left',
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Condensing temperature'
                }
            }],
            xAxes: [{
                type: 'linear',
                position: 'left',
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Evaporating temperature'
                }
            }]
        },
    }
});

function chartChange(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote) {
    MinX = parseFloat(MinX)
    MaxX = parseFloat(MaxX)
    MinY = parseFloat(MinY)
    MaxY = parseFloat(MaxY)
    //tran formt plot to arrayXY
    arrayXY = []
    for (let i = 0; i < plot.length; i++) {
        arrayXY.push([plot[i].x, plot[i].y])
    }

    chart = new Chart(document.getElementById("myChart"), {
        type: 'line',
        data: {
            datasets: [{
                data: plot,
                label: "Operating Area",
                borderColor: "#3e95cd",
                fill: false,
                lineTension: 0,
            }, {
                data: [{ x: textEvapTemp, y: condensingValue }],
                label: "Operating Point",
                borderColor: "#8cc66f",
                fill: false,
                lineTension: 0,
                backgroundColor: "#8cc66f",
                borderWidth: 5
            }
            ],
        },
        options: {
            title: {
                display: true,
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        suggestedMin: MinY - 10,
                        suggestedMax: MaxY + 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: labelYChart
                    }
                }],
                xAxes: [{
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        suggestedMin: MinX - 15,
                        suggestedMax: MaxX + 15
                    },
                    scaleLabel: {
                        display: true,
                        labelString: labelXChart
                    }
                }]
            },
        }
    });
    let polygon = []
    for (let i = 0; i < plot.length; i++) {
        polygon.push([parseFloat(plot[i].x), parseFloat(plot[i].y)])
    }
    if (inside([textEvapTemp, condensingValue], polygon) == false) {
        document.getElementById("two").setAttribute("disabled", true)
        document.getElementById("three").setAttribute("disabled", true)
        document.getElementById("four").setAttribute("disabled", true)
        document.getElementById("five").setAttribute("disabled", true)
        document.getElementById("six").setAttribute("disabled", true)
        document.getElementById("seven-cdu").setAttribute("disabled", true)

        document.getElementById('chart-note').setAttribute("hidden", true)
        document.getElementById('cdu-note').removeAttribute("hidden")
        document.getElementById('cdu-note').innerHTML = 'This operating point is out of the compressor operating envelop.<br>' +
            'Please contact SCM staffs at SalesSCM@scmrefthai.com OR call 02-181-9771-5 ext.307'
        radioTabLimit.checked = true;
        if (cduTableRows[0].querySelectorAll('td')[0].textContent == modelId && inside([textEvapTemp, condensingValue], polygon) == false) {
            for (let i = 3; i < 11; i++) {
                cduTableRows[i].querySelectorAll('td')[0].innerHTML = null
            }
        }
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 5; j++) {
                cduTableRows[i].querySelectorAll('td')[j].classList.remove("text-color-alert")
            }
        }

        if (cduTableRows[0].querySelectorAll('td')[0].textContent == modelId) {
            for (let i = 0; i < 11; i++) {
                cduTableRows[i].querySelectorAll('td')[0].classList.add("text-color-alert")
            }
        }

    } else {
        document.getElementById('chart-alert').innerHTML = null
        document.getElementById('chart-div').removeAttribute("hidden")
        document.getElementById('chart-note').removeAttribute("hidden")
        document.getElementById('cdu-note').setAttribute("hidden", true)
        document.getElementById("two").removeAttribute("disabled")
        document.getElementById("three").removeAttribute("disabled")
        document.getElementById("four").removeAttribute("disabled")
        document.getElementById("five").removeAttribute("disabled")
        document.getElementById("six").removeAttribute("disabled")
        document.getElementById("seven-cdu").removeAttribute("disabled")

        document.getElementById('chart-note').innerHTML = "Note : " + chartNote

        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 5; j++) {
                cduTableRows[i].querySelectorAll('td')[j].classList.remove("text-color-alert")
            }
        }
    }
}
function updateChart(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote) {
    MinX = parseFloat(MinX)
    MaxX = parseFloat(MaxX)
    MinY = parseFloat(MinY)
    MaxY = parseFloat(MaxY)
    arrayXY = []
    for (let i = 0; i < plot.length; i++) {
        arrayXY.push([plot[i].x, plot[i].y])
    }

    chart.data.datasets[0].data = plot
    chart.options.scales.xAxes.ticks = {
        suggestedMin: MinX - 15,
        suggestedMax: MaxX + 15
    }
    chart.options.scales.yAxes.ticks = {
        suggestedMin: MinY - 10,
        suggestedMax: MaxY + 10
    }
    chart.data.datasets[1].data = [{ x: textEvapTemp, y: condensingValue }]
    let polygon = []
    for (let i = 0; i < plot.length; i++) {
        polygon.push([parseFloat(plot[i].x), parseFloat(plot[i].y)])
    }
    if (inside([textEvapTemp, condensingValue], polygon) == false) {
        // document.getElementById("chart-div").setAttribute("hidden", true)
        document.getElementById("two-panel-content").setAttribute("hidden", true)
        document.getElementById("three-panel").innerHTML = null
        document.getElementById("four-panel").innerHTML = null
        document.getElementById("five-panel").innerHTML = null
        document.getElementById("step-table-tab").setAttribute("hidden", true)
        document.getElementById("datasheet-report").setAttribute("hidden", true)
        document.getElementById('cdu-note').removeAttribute("hidden")
        document.getElementById('cdu-note').innerHTML = 'This operating point is out of the compressor operating envelop.<br>' +
            'Please contact SCM staffs at SalesSCM@scmrefthai.com OR call 02-181-9771-5 ext.307'
        document.getElementById("IS-report").setAttribute("hidden", true)
        document.getElementById("one").checked = true;
        document.getElementById("two").setAttribute("disabled", true)
        document.getElementById("three").setAttribute("disabled", true)
        document.getElementById("four").setAttribute("disabled", true)
        document.getElementById("five").setAttribute("disabled", true)
        document.getElementById("six").setAttribute("disabled", true)
        document.getElementById("seven-cdu").setAttribute("disabled", true)
        document.getElementById('chart-note').setAttribute("hidden", true)
        radioTabLimit.checked = true;
        for (let j = 1; j < 5; j++) {
            if (cduTableRows[0].querySelectorAll('td')[j].textContent == modelId && inside([textEvapTemp, condensingValue], polygon) == false) {
                for (let i = 3; i < 11; i++) {
                    cduTableRows[i].querySelectorAll('td')[j].innerHTML = null
                }
            }
        }
    } else {

        document.getElementById('chart-alert').innerHTML = null
        document.getElementById('chart-div').removeAttribute("hidden")
        document.getElementById('chart-note').removeAttribute("hidden")
        document.getElementById('cdu-note').setAttribute("hidden", true)
        document.getElementById("step-table-tab").removeAttribute("hidden")
        document.getElementById("datasheet-report").removeAttribute("hidden")

        document.getElementById("two").removeAttribute("disabled")
        document.getElementById("three").removeAttribute("disabled")
        document.getElementById("four").removeAttribute("disabled")
        document.getElementById("five").removeAttribute("disabled")
        document.getElementById("six").removeAttribute("disabled")
        document.getElementById("seven-cdu").removeAttribute("disabled")
        document.getElementById('chart-note').innerHTML = "Note : " + chartNote

    }
    chart.update()
}

var chart2
chart2 = new Chart(document.getElementById("myChart2"))
function chartChange2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue) {
    MinX = parseFloat(MinX)
    MaxX = parseFloat(MaxX)
    MinY = parseFloat(MinY)
    MaxY = parseFloat(MaxY)
    //tran formt plot to arrayXY
    arrayXY = []
    for (let i = 0; i < plot2.length; i++) {
        arrayXY.push([plot2[i].x, plot2[i].y])
    }
    chart2 = new Chart(document.getElementById("myChart2"), {
        type: 'line',
        data: {
            datasets: [{
                data: plot2,
                label: "Operating Area",
                borderColor: "#3e95cd",
                fill: false,
                lineTension: 0,
            }, {
                data: [{ x: textEvapTemp, y: condensingValue }],
                label: "Operating Point",
                borderColor: "#8cc66f",
                fill: false,
                lineTension: 0,
                backgroundColor: "#8cc66f",
                borderWidth: 5
            }
            ],
        },
        options: {
            title: {
                display: true,
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        suggestedMin: MinY - 10,
                        suggestedMax: MaxY + 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: labelYChart
                    }
                }],
                xAxes: [{
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        suggestedMin: MinX - 15,
                        suggestedMax: MaxX + 15
                    },
                    scaleLabel: {
                        display: true,
                        labelString: labelXChart
                    }
                }]
            },
        }
    });
    let polygon = []
    for (let i = 0; i < plot2.length; i++) {
        polygon.push([parseFloat(plot2[i].x), parseFloat(plot2[i].y)])
    }
    if (inside([textEvapTemp, condensingValue], polygon) == false) {
        // document.getElementById("chart-div").setAttribute("hidden", true)
        // document.getElementById("two-panel-content").setAttribute("hidden", true)
        // document.getElementById("three-panel").innerHTML = null
        // document.getElementById("four-panel").innerHTML = null
        // document.getElementById("five-panel").innerHTML = null
        // document.getElementById("step-table-tab").setAttribute("hidden", true)
        // document.getElementById("datasheet-report").setAttribute("hidden", true)
        document.getElementById("two").setAttribute("disabled", true)
        document.getElementById("three").setAttribute("disabled", true)
        document.getElementById("four").setAttribute("disabled", true)
        document.getElementById("five").setAttribute("disabled", true)
        document.getElementById("six").setAttribute("disabled", true)
        document.getElementById("seven-cdu").setAttribute("disabled", true)


        document.getElementById('cdu-note').removeAttribute("hidden")
        document.getElementById('cdu-note').innerHTML = 'This operating point is out of the compressor operating envelop.<br>' +
            'Please contact SCM staffs at SalesSCM@scmrefthai.com OR call 02-181-9771-5 ext.307'
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 5; j++) {
                cduTableRows[i].querySelectorAll('td')[j].classList.remove("text-color-alert")
            }
        }

        if (cduTableRows[0].querySelectorAll('td')[0].textContent == modelId) {
            for (let i = 0; i < 11; i++) {
                cduTableRows[i].querySelectorAll('td')[0].classList.add("text-color-alert")
            }
        }

    } else {
        document.getElementById('chart-alert').innerHTML = null
        document.getElementById('chart-div').removeAttribute("hidden")
        document.getElementById('cdu-note').setAttribute("hidden", true)
        document.getElementById("two").removeAttribute("disabled")
        document.getElementById("three").removeAttribute("disabled")
        document.getElementById("four").removeAttribute("disabled")
        document.getElementById("five").removeAttribute("disabled")
        document.getElementById("six").removeAttribute("disabled")
        document.getElementById("seven-cdu").removeAttribute("disabled")


        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 5; j++) {
                cduTableRows[i].querySelectorAll('td')[j].classList.remove("text-color-alert")
            }
        }
    }
}
function updateChart2(plot2, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId) {
    MinX = parseFloat(MinX)
    MaxX = parseFloat(MaxX)
    MinY = parseFloat(MinY)
    MaxY = parseFloat(MaxY)
    arrayXY = []
    for (let i = 0; i < plot2.length; i++) {
        arrayXY.push([plot2[i].x, plot2[i].y])
    }
    //Netto 
    chart2.data.datasets[0].data = plot2
    chart2.options.scales.xAxes.ticks = {
        suggestedMin: MinX - 15,
        suggestedMax: MaxX + 15
    }
    chart2.options.scales.yAxes.ticks = {
        suggestedMin: MinY - 10,
        suggestedMax: MaxY + 10
    }
    chart2.data.datasets[1].data = [{ x: textEvapTemp, y: condensingValue }]
    let polygon = []
    for (let i = 0; i < plot2.length; i++) {
        polygon.push([parseFloat(plot2[i].x), parseFloat(plot2[i].y)])
    }
    if (inside([textEvapTemp, condensingValue], polygon) == false) {
        // document.getElementById("chart-div").setAttribute("hidden", true)
        document.getElementById("two-panel-content").setAttribute("hidden", true)
        document.getElementById("three-panel").innerHTML = null
        document.getElementById("four-panel").innerHTML = null
        document.getElementById("five-panel").innerHTML = null
        document.getElementById("step-table-tab").setAttribute("hidden", true)
        document.getElementById("datasheet-report").setAttribute("hidden", true)
        document.getElementById("IS-report").setAttribute("hidden", true)
        document.getElementById('cdu-note').removeAttribute("hidden")
        document.getElementById('cdu-note').innerHTML = 'This operating point is out of the compressor operating envelop.<br>' +
            'Please contact SCM staffs at SalesSCM@scmrefthai.com OR call 02-181-9771-5 ext.307'
        document.getElementById("one").checked = true;
        document.getElementById("two").setAttribute("disabled", true)
        document.getElementById("three").setAttribute("disabled", true)
        document.getElementById("four").setAttribute("disabled", true)
        document.getElementById("five").setAttribute("disabled", true)
        document.getElementById("six").setAttribute("disabled", true)
        document.getElementById("seven-cdu").setAttribute("disabled", true)


        if (cduTableRows[0].querySelectorAll('td')[1].textContent == modelId) {
            for (let i = 0; i < 11; i++) {
                cduTableRows[i].querySelectorAll('td')[1].classList.add("text-color-alert")
            }
        } else if (cduTableRows[0].querySelectorAll('td')[2].textContent == modelId) {
            for (let i = 1; i < 11; i++) {
                cduTableRows[i].querySelectorAll('td')[2].classList.add("text-color-alert")
            }
        } else if (cduTableRows[0].querySelectorAll('td')[3].textContent == modelId) {
            for (let i = 1; i < 11; i++) {
                cduTableRows[i].querySelectorAll('td')[3].classList.add("text-color-alert")
            }
        } else if (cduTableRows[0].querySelectorAll('td')[4].textContent == modelId) {
            for (let i = 1; i < 11; i++) {
                cduTableRows[i].querySelectorAll('td')[4].classList.add("text-color-alert")
            }
        }

    } else {

        document.getElementById('chart-alert').innerHTML = null
        document.getElementById('chart-div').removeAttribute("hidden")
        document.getElementById('cdu-note').setAttribute("hidden", true)
        document.getElementById("step-table-tab").removeAttribute("hidden")
        document.getElementById("datasheet-report").removeAttribute("hidden")
        document.getElementById("IS-report").removeAttribute("hidden")

        document.getElementById("two").removeAttribute("disabled")
        document.getElementById("three").removeAttribute("disabled")
        document.getElementById("four").removeAttribute("disabled")
        document.getElementById("five").removeAttribute("disabled")
        document.getElementById("six").removeAttribute("disabled")
        document.getElementById("seven-cdu").removeAttribute("disabled")

    }
    chart2.update()
}

function inside(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi >= y) != (yj >= y))
            && (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
function stepChangeCap(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let tempAmbient = parseFloat(document.getElementById("start-ambient").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += parseFloat(document.getElementById("step-ambient").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCooling[k]
                k++;
            }
        }
    })
}
function stepChangePowerInput(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let tempAmbient = parseFloat(document.getElementById("start-ambient").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += parseFloat(document.getElementById("step-ambient").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultPowerInput[k]
                k++;
            }
        }
    })
}
function stepChangeCondensing(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let tempAmbient = parseFloat(document.getElementById("start-ambient").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += parseFloat(document.getElementById("step-ambient").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCondensing[k]
                k++;
            }
        }
    })
}
function stepChangeHeatReject(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let tempAmbient = parseFloat(document.getElementById("start-ambient").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += parseFloat(document.getElementById("step-ambient").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultHeatReject[k]
                k++;
            }
        }
    })
}
function stepChangeCOP(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let tempAmbient = parseFloat(document.getElementById("start-ambient").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += parseFloat(document.getElementById("step-ambient").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCOP[k]
                k++;
            }
        }
    })
}
function stepChangeCurrent(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let tempAmbient = parseFloat(document.getElementById("start-ambient").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += parseFloat(document.getElementById("step-ambient").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCurrent[k]
                k++;
            }
        }
    })
}
function stepChangeMassFlow(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let tempAmbient = parseFloat(document.getElementById("start-ambient").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += parseFloat(document.getElementById("step-ambient").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultMassFlow[k]
                k++;
            }
        }
    })
}

function stepChangeCapDefault(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change-default', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send-default', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [2, 3, 3, 5] : [10, 10, 10, 10]
        let tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 30 : 80
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCooling[k]
                k++;
            }
        }
    })
}

function stepChangePowerInputDefault(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change-default', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send-default', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [2, 3, 3, 5] : [10, 10, 10, 10]
        let tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 30 : 80
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultPowerInput[k]
                k++;
            }
        }
    })
}
function stepChangeCondensingDefault(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change-default', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send-default', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [2, 3, 3, 5] : [10, 10, 10, 10]
        let tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 30 : 80
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCondensing[k]
                k++;
            }
        }
    })
}
function stepChangeHeatRejectDefault(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change-default', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send-default', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [2, 3, 3, 5] : [10, 10, 10, 10]
        let tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 30 : 80
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultHeatReject[k]
                k++;
            }
        }
    })
}
function stepChangeCOPDefault(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change-default', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send-default', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [2, 3, 3, 5] : [10, 10, 10, 10]
        let tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 30 : 80
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCOP[k]
                k++;
            }
        }
    })
}
function stepChangeCurrentDefault(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change-default', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send-default', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [2, 3, 3, 5] : [10, 10, 10, 10]
        let tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 30 : 80
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCurrent[k]
                k++;
            }
        }
    })
}
function stepChangeMassFlowDefault(modelPositionId, refrigerant) {
    ipc.send('cdu-step-change-default', modelPositionId, refrigerant, document.getElementById("start-ambient").value, document.getElementById("step-ambient").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-change-send-default', (event, resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow) => {
        let k = 0;
        let stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [2, 3, 3, 5] : [10, 10, 10, 10]
        let tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 30 : 80
        let tempEvap = parseFloat(document.getElementById("start-evap").value)

        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempAmbient
            tempAmbient += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectUnit.options[selectUnit.selectedIndex].value == '1111') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                else if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                    if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -4 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 122 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -58 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 68) {
                        document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                        k++;
                        continue
                    }
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultMassFlow[k]
                k++;
            }
        }
    })
}

//-------------------------------------------------------------Function DataSheet--------------------------------------------------------------------
function stepChangeCapDataSheet(modelPositionId, refrigerant, radioAppLow, radioAppMed) {
    ipc.send('cdu-step-table-datasheet', modelPositionId, refrigerant, radioAppLow, radioAppMed, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-table-datasheet-send', (event, resultCooling, resultPowerInput, typeCooled) => {
        if (typeCooled == "Water cooled") {
            if(selectUnit.options[selectUnit.selectedIndex].value == '1111'){
                document.getElementById('datasheet-ambient-label').innerHTML = `Water Inlet</br> Temperature (°C)`
            }else{
                document.getElementById('datasheet-ambient-label').innerHTML = `Water Inlet</br> Temperature (°F)`
            }
        }
        else if (typeCooled == "Air cooled") {
            if(selectUnit.options[selectUnit.selectedIndex].value == '1111'){
                document.getElementById('datasheet-ambient-label').innerHTML = `Ambient</br> Temperature (°C)`
            }else{
                document.getElementById('datasheet-ambient-label').innerHTML = `Ambient</br> Temperature (°F)`
            }
        }
        if (radioAppMed) {
            let k = 0;
            let stepTa
            let s
            let tempAmbient
            if (typeCooled == "Air cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 6, 5] : [0, 10, 10]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -20 : -10
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 32 : 90
            }
            else if (typeCooled == "Water cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 18, 10] : [0, 30, 20]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -20 : -10
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 7 : 45
            }
            for (let a = 2; a < 5; a++) {
                steptableDataSheetCap[a].querySelectorAll("th")[0].innerHTML = tempAmbient
                tempAmbient += stepTa[a - 1]
            }
            for (a = 1; a < 8; a++) {
                steptableDataSheetCap[1].querySelectorAll("th")[a - 1].innerHTML = s
                s += 5
            }
            for (let i = 2; i < 5; i++) {
                for (let j = 0; j < 7; j++) {
                    document.getElementById("step-table-datasheet-cap").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCooling[k]
                    k++;
                }
            }
        } else if (radioAppLow) {
            let k = 0;
            let stepTa
            let s
            let tempAmbient
            if (typeCooled == "Air cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 6, 5] : [0, 10, 10]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -40 : -40
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 32 : 90
            }
            else if (typeCooled == "Water cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 18, 10] : [0, 30, 20]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -40 : -40
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 7 : 45
            }
            for (let a = 2; a < 5; a++) {
                steptableDataSheetCap[a].querySelectorAll("th")[0].innerHTML = tempAmbient
                tempAmbient += stepTa[a - 1]
            }
            for (a = 1; a < 8; a++) {
                steptableDataSheetCap[1].querySelectorAll("th")[a - 1].innerHTML = s
                s += 5
            }
            for (let i = 2; i < 5; i++) {
                for (let j = 0; j < 7; j++) {
                    document.getElementById("step-table-datasheet-cap").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCooling[k]
                    k++;
                }
            }
        }
    })
}
function stepChangePowerInputDataSheet(modelPositionId, refrigerant, radioAppLow, radioAppMed) {
    ipc.send('cdu-step-table-datasheet', modelPositionId, refrigerant, radioAppLow, radioAppMed, selectUnit.options[selectUnit.selectedIndex].value)
    ipc.once('cdu-step-table-datasheet-send', (event, resultCooling, resultPowerInput, typeCooled) => {
        if (typeCooled == "Water cooled") {
            if(selectUnit.options[selectUnit.selectedIndex].value == '1111'){
                document.getElementById('datasheet-ambient-label-two').innerHTML = `Water Inlet</br> Temperature (°C)`
            }else{
                document.getElementById('datasheet-ambient-label-two').innerHTML = `Water Inlet</br> Temperature (°F)`
            }
        }
        else if (typeCooled == "Air cooled") {
            if(selectUnit.options[selectUnit.selectedIndex].value == '1111'){
                document.getElementById('datasheet-ambient-label-two').innerHTML = `Ambient</br> Temperature (°C)`
            }else{
                document.getElementById('datasheet-ambient-label-two').innerHTML = `Ambient</br> Temperature (°F)`
            }
        }
        if (radioAppLow) {
            let k = 0;
            let stepTa
            let s
            let tempAmbient
            if (typeCooled == "Air cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 6, 5] : [0, 10, 10]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -40 : -40
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 32 : 90
            }
            else if (typeCooled == "Water cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 18, 10] : [0, 30, 20]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -40 : -40
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 7 : 45
            }
            for (let a = 2; a < 5; a++) {
                steptableDataSheetInput[a].querySelectorAll("th")[0].innerHTML = tempAmbient
                tempAmbient += stepTa[a - 1]
            }
            for (a = 1; a < 8; a++) {
                steptableDataSheetInput[1].querySelectorAll("th")[a - 1].innerHTML = s
                s += 5
            }
            for (let i = 2; i < 5; i++) {
                for (let j = 0; j < 7; j++) {
                    document.getElementById("step-table-datasheet-powerinput").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultPowerInput[k]
                    k++;
                }
            }

        } else if (radioAppMed) {
            let k = 0;
            let stepTa
            let s
            let tempAmbient
            if (typeCooled == "Air cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 6, 5] : [0, 10, 10]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -20 : -10
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 32 : 90
            }
            else if (typeCooled == "Water cooled") {
                stepTa = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? [0, 18, 10] : [0, 30, 20]
                s = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? -20 : -10
                tempAmbient = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 7 : 45
            }
            for (let a = 2; a < 5; a++) {
                steptableDataSheetInput[a].querySelectorAll("th")[0].innerHTML = tempAmbient
                tempAmbient += stepTa[a - 1]
            }
            for (a = 1; a < 8; a++) {
                steptableDataSheetInput[1].querySelectorAll("th")[a - 1].innerHTML = s
                s += 5
            }
            for (let i = 2; i < 5; i++) {
                for (let j = 0; j < 7; j++) {
                    document.getElementById("step-table-datasheet-powerinput").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultPowerInput[k]
                    k++;
                }
            }

        }
    })
}

function delay(i, last) {
    if (last) {
        setTimeout(() => {
            document.getElementById(`model1`).click()
        }, 1200 * (i + 1));
    }
    else {
        setTimeout(() => {
            document.getElementById(`model${i + 1}`).click()
        }, 1200 * (i + 1));
    }
}

function autoClick(data) {
    let totalTime = 0
    let elem = document.createElement('div');
    elem.innerHTML = '<div id="loadingDiv"><div class="loader" ></div><h1 class="textLoad"  id="percentLoad"></h1></div>';
    document.body.appendChild(elem);
    document.getElementById('outer').style.opacity = 0.05
    for (let c = 0, last = false; c <= 5; c++) {
        if (data[c].a_model == "") {
            last = true
            delay(c, last)
            totalTime += 1200;  //2000
            break
        }
        else if (c == 5) {
            last = true
            delay(c, last)
            totalTime += 1200; //1500
            break
        }
        delay(c, last)
        totalTime += 1200; //1500
    }
    setTimeout(() => {
        document.getElementById('outer').style.opacity = 1
        document.body.removeChild(elem)
    }, totalTime);
    let timeToPercent = totalTime / 100
    let Percent = setInterval(frame, timeToPercent)
    let width = 0
    let percentLoad = document.getElementById("percentLoad");
    function frame() {

        if (width >= 100) {
            clearInterval(Percent)
            percentLoad.innerHTML = '';
        } else {
            width++;
            percentLoad.innerHTML = width * 1 + '%';
        }
    }
}
function autoClickModel() {
    let totalTime = 500
    let elem = document.createElement('div');
    elem.innerHTML = '<div id="loadingDiv"><div class="loader" ></div><h1 class="textLoad"  id="percentLoad"></h1></div>';
    document.body.appendChild(elem);
    document.getElementById('outer').style.opacity = 0.05

    setTimeout(() => {
        document.getElementById('outer').style.opacity = 1
        document.body.removeChild(elem)
    }, totalTime);
    let timeToPercent = totalTime / 100
    let Percent = setInterval(frame, timeToPercent)
    let width = 0
    let percentLoad = document.getElementById("percentLoad");
    function frame() {

        if (width >= 100) {
            clearInterval(Percent)
            percentLoad.innerHTML = '';
        } else {
            width++;
            percentLoad.innerHTML = width * 1 + '%';

        }
    }
}
function cutunit(text) {
    let res = text.split(" ");
    return res[0]
}

function unitChange() {
    if (document.getElementById('model1')) {
        if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '1111') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°C)"
            document.getElementById("label-ambient").innerHTML = "Ambient Temp (°C)"
            document.getElementById("label-room").innerHTML = "Room Temp (°C)"
            document.getElementById("cdu-label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
            document.getElementById("evap-label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
            document.getElementById("result-cop-label").innerHTML = "COP"
            document.getElementById("step-dropdown-cooling").innerHTML = "Cooling Capacity (kW)"
            document.getElementById("step-dropdown-power").innerHTML = "Total Power Input (kW)"
            document.getElementById("step-dropdown-condensing").innerHTML = "Condensing Temp (°C)"
            document.getElementById("step-dropdown-heatreject").innerHTML = "Heat Reject (kW)"
            document.getElementById("step-dropdown-cop").innerHTML = "COP"
            document.getElementById("step-dropdown-massflow").innerHTML = "Mass Flow (g/s)"
            document.getElementById("start-evap-unit").innerHTML = " °C"
            document.getElementById("start-ambient-unit").innerHTML = " °C"
            document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°C)`
            document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°C)`
            document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°C)`
            document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°C)`
            document.getElementById("text-sst").value = document.getElementById("text-sst").value ? ((parseFloat(document.getElementById("text-sst").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("text-ambient").value = document.getElementById("text-ambient").value ? ((parseFloat(document.getElementById("text-ambient").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("cdu-text-cooling").value = document.getElementById("cdu-text-cooling").value ? (parseFloat(document.getElementById("cdu-text-cooling").value) / 3.412).toFixed(0) : ""
            document.getElementById("evap-text-cooling").value = document.getElementById("evap-text-cooling").value ? (parseFloat(document.getElementById("evap-text-cooling").value) / 3.412).toFixed(0) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? ((parseFloat(document.getElementById("text-room").value) - 32) * (5 / 9)).toFixed(1) : ""
            calButton.click()
        }
        else if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '2222') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°F)"
            document.getElementById("label-ambient").innerHTML = "Ambient Temp (°F)"
            document.getElementById("label-room").innerHTML = "Room Temp (°F)"
            document.getElementById("result-cop-label").innerHTML = "EER"
            document.getElementById("cdu-label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
            document.getElementById("evap-label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
            document.getElementById("step-dropdown-cooling").innerHTML = "Cooling Capacity (kBTU/h)"
            document.getElementById("step-dropdown-power").innerHTML = "Total Power Input (kBTU/h)"
            document.getElementById("step-dropdown-condensing").innerHTML = "Condensing Temp (°F)"
            document.getElementById("step-dropdown-heatreject").innerHTML = "Heat Reject (kBTU/h)"
            document.getElementById("step-dropdown-cop").innerHTML = "EER (BTU/h/W)"
            document.getElementById("step-dropdown-massflow").innerHTML = "Mass Flow (lbs/h)"
            document.getElementById("start-evap-unit").innerHTML = " °F"
            document.getElementById("start-ambient-unit").innerHTML = " °F"
            document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°F)`
            document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°F)`
            document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°F)`
            document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°F)`
            document.getElementById("text-sst").value = document.getElementById("text-sst").value ? (parseFloat(document.getElementById("text-sst").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-ambient").value = document.getElementById("text-ambient").value ? (parseFloat(document.getElementById("text-ambient").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("cdu-text-cooling").value = document.getElementById("cdu-text-cooling").value ? (parseFloat(document.getElementById("cdu-text-cooling").value) * 3.412).toFixed(0) : ""
            document.getElementById("evap-text-cooling").value = document.getElementById("evap-text-cooling").value ? (parseFloat(document.getElementById("evap-text-cooling").value) * 3.412).toFixed(0) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? (parseFloat(document.getElementById("text-room").value) * (9 / 5) + 32).toFixed(1) : ""
            calButton.click()
        }
    }
    else {
        if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '1111') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°C)"
            document.getElementById("label-ambient").innerHTML = "Ambient Temp (°C)"
            document.getElementById("label-room").innerHTML = "Room Temp (°C)"
            document.getElementById("cdu-label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
            document.getElementById("evap-label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
            document.getElementById("result-cop-label").innerHTML = "COP"
            document.getElementById("step-dropdown-cooling").innerHTML = "Cooling Capacity (kW)"
            document.getElementById("step-dropdown-power").innerHTML = "Total Power Input (kW)"
            document.getElementById("step-dropdown-condensing").innerHTML = "Condensing Temp (°C)"
            document.getElementById("step-dropdown-heatreject").innerHTML = "Heat Reject (kW)"
            document.getElementById("step-dropdown-cop").innerHTML = "COP"
            document.getElementById("step-dropdown-massflow").innerHTML = "Mass Flow (g/s)"
            document.getElementById("start-evap-unit").innerHTML = " °C"
            document.getElementById("start-ambient-unit").innerHTML = " °C"
            document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°C)`
            document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°C)`
            document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°C)`
            document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°C)`
            document.getElementById("text-sst").value = document.getElementById("text-sst").value ? ((parseFloat(document.getElementById("text-sst").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("text-ambient").value = document.getElementById("text-ambient").value ? ((parseFloat(document.getElementById("text-ambient").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("cdu-text-cooling").value = document.getElementById("cdu-text-cooling").value ? (parseFloat(document.getElementById("cdu-text-cooling").value) / 3.412).toFixed(0) : ""
            document.getElementById("evap-text-cooling").value = document.getElementById("evap-text-cooling").value ? (parseFloat(document.getElementById("evap-text-cooling").value) / 3.412).toFixed(0) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? ((parseFloat(document.getElementById("text-room").value) - 32) * (5 / 9)).toFixed(1) : ""
        }
        else if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '2222') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°F)"
            document.getElementById("label-ambient").innerHTML = "Ambient Temp (°F)"
            document.getElementById("label-room").innerHTML = "Room Temp (°F)"
            document.getElementById("cdu-label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
            document.getElementById("evap-label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
            document.getElementById("result-cop-label").innerHTML = "EER"
            document.getElementById("step-dropdown-cooling").innerHTML = "Cooling Capacity (kBTU/h)"
            document.getElementById("step-dropdown-power").innerHTML = "Total Power Input (kBTU/h)"
            document.getElementById("step-dropdown-condensing").innerHTML = "Condensing Temp (°F)"
            document.getElementById("step-dropdown-heatreject").innerHTML = "Heat Reject (kBTU/h)"
            document.getElementById("step-dropdown-cop").innerHTML = "EER (BTU/h/W)"
            document.getElementById("step-dropdown-massflow").innerHTML = "Mass Flow (lbs/h)"
            document.getElementById("start-evap-unit").innerHTML = " °F"
            document.getElementById("start-ambient-unit").innerHTML = " °F"
            document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°F)`
            document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°F)`
            document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°F)`
            document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°F)`
            document.getElementById("text-sst").value = document.getElementById("text-sst").value ? (parseFloat(document.getElementById("text-sst").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-ambient").value = document.getElementById("text-ambient").value ? (parseFloat(document.getElementById("text-ambient").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("cdu-text-cooling").value = document.getElementById("cdu-text-cooling").value ? (parseFloat(document.getElementById("cdu-text-cooling").value) * 3.412).toFixed(0) : ""
            document.getElementById("evap-text-cooling").value = document.getElementById("evap-text-cooling").value ? (parseFloat(document.getElementById("evap-text-cooling").value) * 3.412).toFixed(0) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? (parseFloat(document.getElementById("text-room").value) * (9 / 5) + 32).toFixed(1) : ""
        }
    }
}