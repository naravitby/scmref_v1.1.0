const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const html2pdf = require('html2pdf.js');

const selectionHead = document.getElementById('selectionHead')
const operatingHead = document.getElementById('operatingHead')
const selectionContent = document.querySelector('.selection-content')
const operatingContent = document.querySelector('.operating-content')
const calButton = document.getElementById('calculate')
const selectRefrigerant = document.getElementById('select-refrigerant')
const selectBrand = document.getElementById('select-brand')
const selectVoltage = document.getElementById('select-voltage')
const selectSeries = document.getElementById('select-series')
const textCooling = document.getElementById('text-cooling')
const textAcceptableMins = document.getElementById('text-acceptable-mins')
const textAcceptablePlus = document.getElementById('text-acceptable-plus')
const selectModel = document.getElementById('select-model')
const textEvap = document.getElementById('text-evap')
const textRoom = document.getElementById('text-room')
const radioCooling = document.getElementById('radio-cooling')
const radioModel = document.getElementById('radio-model')
const evapTableRows = document.getElementById("evapTable").querySelectorAll("tr")
const stepTableRows = document.getElementById("step-result-table").querySelectorAll("tr")
const buttonReset = document.getElementById('reset-table-step')
const buttonSubmit = document.getElementById('submit-table-step')
const pageSelect = document.getElementById('select-page')
const radioAppLow = document.getElementById('radio-app-low')
const radioAppMed = document.getElementById('radio-app-med')
const btnExport = document.getElementById('evap-btn-export')
const selectUnit = document.getElementById('select-unit')
const siOption = document.getElementById('si')
const imperialOption = document.getElementById('imperial')

if (localStorage.getItem("units") == 1) {
    selectUnit.selectedIndex = 1
    unitChange()
}
else {
    unitChange()
}

document.getElementById('select-unit').addEventListener('change', () => {
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
pageSelect.selectedIndex = [1]

btnExport.addEventListener('click', () => {
    let fileName = document.getElementById("datasheet-head-model").innerHTML
    let opt = {
        // margin: 1,
        filename: fileName + '_Datasheet',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', format: 'a4' }
    };
    let element = document.getElementById('savePDF');
    html2pdf().set(opt).from(element).save();
})

document.getElementsByName("choice").forEach(item => {
    item.addEventListener('change', () => {
        if (radioCooling.checked == true) {
            selectModel.setAttribute("disabled", true)
            selectModel.style.opacity = 0.5
            textCooling.removeAttribute("disabled")
            textAcceptableMins.removeAttribute("disabled")
            textAcceptablePlus.removeAttribute("disabled")
            selectBrand.style.opacity = 1
            selectVoltage.style.opacity = 1
            selectSeries.style.opacity = 1
            textCooling.style.opacity = 1
        }
        else {
            textCooling.setAttribute("disabled", true)
            textAcceptableMins.setAttribute("disabled", true)
            textAcceptablePlus.setAttribute("disabled", true)
            selectModel.removeAttribute("disabled")
            selectModel.style.opacity = 1
            textAcceptableMins.style.opacity = 1
            textAcceptablePlus.style.opacity = 1
            textCooling.style.opacity = 0.5
        }
    })
})

selectionHead.addEventListener('click', () => {
    selectionContent.classList.toggle('hide');
})

operatingHead.addEventListener('click', () => {
    operatingContent.classList.toggle('hide');
})
selectBrand.setAttribute("disabled", true)
selectVoltage.setAttribute("disabled", true)
selectSeries.setAttribute("disabled", true)
textCooling.setAttribute("disabled", true)
selectModel.setAttribute("disabled", true)
radioModel.setAttribute("disabled", true)
textEvap.setAttribute("disabled", true)
textRoom.setAttribute("disabled", true)
selectModel.style.opacity = 0.5
selectBrand.style.opacity = 0.5
selectVoltage.style.opacity = 0.5
selectSeries.style.opacity = 0.5
textCooling.style.opacity = 0.5
// -----------------------------------Window Load---------------------------------------
ipc.send('evap-loaded-refrigerant', async () => {
    await ipc.send('evap-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
ipc.send('evap-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
radioAppMed.addEventListener('change', async () => {
    selectBrand.innerHTML = ""
    selectVoltage.innerHTML = ""
    selectSeries.innerHTML = ""
    selectModel.innerHTML = ""
    selectBrand.add(document.createElement("option"), selectBrand[0])
    selectVoltage.add(document.createElement("option"), selectVoltage[0])
    selectSeries.add(document.createElement("option"), selectSeries[0])
    selectModel.add(document.createElement("option"), selectModel[0])
    selectBrand.selectedIndex = 0
    selectVoltage.selectedIndex = 0
    selectSeries.selectedIndex = 0
    selectModel.selectedIndex = 0
    await ipc.send('evap-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
radioAppLow.addEventListener('change', async () => {
    selectBrand.innerHTML = ""
    selectVoltage.innerHTML = ""
    selectSeries.innerHTML = ""
    selectModel.innerHTML = ""
    selectBrand.add(document.createElement("option"), selectBrand[0])
    selectVoltage.add(document.createElement("option"), selectVoltage[0])
    selectSeries.add(document.createElement("option"), selectSeries[0])
    selectModel.add(document.createElement("option"), selectModel[0])
    selectBrand.selectedIndex = 0
    selectVoltage.selectedIndex = 0
    selectSeries.selectedIndex = 0
    selectModel.selectedIndex = 0
    await ipc.send('evap-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})

ipc.on('evap-brand-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_brand)
        newChild.appendChild(textChild)
        selectBrand.appendChild(newChild)
    }
})
ipc.on('evap-voltage-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_voltage)
        newChild.appendChild(textChild)
        selectVoltage.appendChild(newChild)
    }
})
ipc.on('evap-series-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_series)
        newChild.appendChild(textChild)
        selectSeries.appendChild(newChild)
    }
})
ipc.on('evap-model-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_model)
        newChild.appendChild(textChild)
        selectModel.appendChild(newChild)
    }
})
ipc.on('evap-refrigerant-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].evap_refrigerant == null) {
            continue;
        }
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].evap_refrigerant)
        newChild.appendChild(textChild)
        selectRefrigerant.appendChild(newChild)
    }
})
selectRefrigerant.addEventListener('change', () => {
    if (selectRefrigerant.options[selectRefrigerant.selectedIndex].value != null) {
        if (radioCooling.checked == true) {
            selectModel.setAttribute("disabled", true)
            selectModel.style.opacity = 0.5
            selectBrand.removeAttribute("disabled")
            selectVoltage.removeAttribute("disabled")
            selectSeries.removeAttribute("disabled")
            textCooling.removeAttribute("disabled")
            radioModel.removeAttribute("disabled")
            textEvap.removeAttribute("disabled")
            textRoom.removeAttribute("disabled")
            textAcceptableMins.removeAttribute("disabled")
            textAcceptablePlus.removeAttribute("disabled")
            selectBrand.style.opacity = 1
            selectVoltage.style.opacity = 1
            selectSeries.style.opacity = 1
            textCooling.style.opacity = 1
            textAcceptableMins.style.opacity = 1
            textAcceptablePlus.style.opacity = 1
        }
        else {
            selectBrand.setAttribute("disabled", true)
            selectVoltage.setAttribute("disabled", true)
            selectSeries.setAttribute("disabled", true)
            textCooling.setAttribute("disabled", true)
            textAcceptableMins.setAttribute("disabled", true)
            textAcceptablePlus.setAttribute("disabled", true)
            selectModel.removeAttribute("disabled")
            radioModel.removeAttribute("disabled")
            textEvap.removeAttribute("disabled")
            textRoom.removeAttribute("disabled")
            textAcceptableMins.setAttribute("disabled", true)
            textAcceptablePlus.setAttribute("disabled", true)
            selectModel.style.opacity = 1
            selectBrand.style.opacity = 0.5
            selectVoltage.style.opacity = 0.5
            selectSeries.style.opacity = 0.5
            textCooling.style.opacity = 0.5
            textAcceptableMins.style.opacity = 0.5
            textAcceptablePlus.style.opacity = 0.5
        }
    }
    ipc.send('evap-refrigerant-select', selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppMed.checked, radioAppLow.checked)
    ipc.once('evap-refrigerant-model', (event, data) => {
        selectModel.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------Refrigerant Select---------------------------------------
selectRefrigerant.addEventListener('change', () => {
    if (selectRefrigerant.options[selectRefrigerant.selectedIndex].value != "") {
        if (radioCooling.checked == true) {
            selectModel.setAttribute("disabled", true)
            selectModel.style.opacity = 0.5
            selectBrand.removeAttribute("disabled")
            selectVoltage.removeAttribute("disabled")
            selectSeries.removeAttribute("disabled")
            textCooling.removeAttribute("disabled")
            selectBrand.style.opacity = 1
            selectVoltage.style.opacity = 1
            selectSeries.style.opacity = 1
            textCooling.style.opacity = 1
        }
        else {
            selectBrand.setAttribute("disabled", true)
            selectVoltage.setAttribute("disabled", true)
            selectSeries.setAttribute("disabled", true)
            textCooling.setAttribute("disabled", true)
            selectModel.removeAttribute("disabled")
            selectModel.style.opacity = 1
            selectBrand.style.opacity = 0.5
            selectVoltage.style.opacity = 0.5
            selectSeries.style.opacity = 0.5
            textCooling.style.opacity = 0.5
        }
    } else if (selectRefrigerant.options[selectRefrigerant.selectedIndex].value == "") {
        radioCooling.checked = true
        selectBrand.setAttribute("disabled", true)
        selectVoltage.setAttribute("disabled", true)
        selectSeries.setAttribute("disabled", true)
        textCooling.setAttribute("disabled", true)
        textAcceptableMins.setAttribute("disabled", true)
        textAcceptablePlus.setAttribute("disabled", true)
        selectModel.setAttribute("disabled", true)
        radioModel.setAttribute("disabled", true)
        textEvap.setAttribute("disabled", true)
        textRoom.setAttribute("disabled", true)
        selectModel.style.opacity = 0.5
        selectBrand.style.opacity = 0.5
        selectVoltage.style.opacity = 0.5
        selectSeries.style.opacity = 0.5
        textCooling.style.opacity = 0.5
        textAcceptableMins.style.opacity = 0.5
        textAcceptablePlus.style.opacity = 0.5
    }
    ipc.send('evap-refrigerant-select', selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppMed.checked, radioAppLow.checked)
    ipc.once('evap-refrigerant-evapBrand', (event, data) => {
        selectBrand.innerHTML = ""
        selectBrand.selectedIndex = 0
        selectBrand.add(document.createElement("option"), selectBrand[0])
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_brand)
            newChild.appendChild(textChild)
            selectBrand.appendChild(newChild)
        }
    })
    ipc.once('evap-refrigerant-evapVoltage', (event, data) => {
        selectVoltage.innerHTML = ""
        selectVoltage.selectedIndex = 0
        selectVoltage.add(document.createElement("option"), selectVoltage[0])
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_voltage)
            newChild.appendChild(textChild)
            selectVoltage.appendChild(newChild)
        }
    })
    ipc.once('evap-refrigerant-evapSeries', (event, data) => {
        selectSeries.innerHTML = ""
        selectSeries.selectedIndex = 0
        selectSeries.add(document.createElement("option"), selectSeries[0])
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
    })
    ipc.once('evap-refrigerant-model', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.selectedIndex = 0
        selectModel.add(document.createElement("option"), selectModel[0])
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------Brand Select---------------------------------------
selectBrand.addEventListener('change', () => {
    ipc.send('evap-brand-select', selectBrand.options[selectBrand.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
    ipc.once('evap-brand-evapSeries', (event, data) => {
        selectSeries.innerHTML = ""
        selectSeries.add(document.createElement("option"), selectSeries[0])
        selectSeries.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
    })
    ipc.once('evap-brand-evapVoltage', (event, data) => {
        selectVoltage.innerHTML = ""
        selectVoltage.add(document.createElement("option"), selectVoltage[0])
        selectVoltage.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_voltage)
            newChild.appendChild(textChild)
            selectVoltage.appendChild(newChild)
        }
    })
    ipc.once('evap-brand-evapModel', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.add(document.createElement("option"), selectModel[0])
        selectModel.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------Voltage Select---------------------------------------
selectVoltage.addEventListener('change', () => {
    ipc.send('evap-voltage-select', selectVoltage.options[selectVoltage.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrand.options[selectBrand.selectedIndex].value)
    ipc.once('evap-voltage-evapSeries', (event, data) => {
        selectSeries.innerHTML = ""
        selectSeries.add(document.createElement("option"), selectSeries[0])
        selectSeries.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
    })
    // ipc.once('evap-voltage-evapBrand', (event, data) => {
    //     selectBrand.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].evap_brand)
    //         newChild.appendChild(textChild)
    //         selectBrand.appendChild(newChild)
    //     }
    // })
    ipc.once('evap-voltage-evapModel', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.add(document.createElement("option"), selectModel[0])
        selectModel.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------Series Select---------------------------------------
selectSeries.addEventListener('change', () => {
    ipc.send('evap-series-select', selectSeries.options[selectSeries.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrand.options[selectBrand.selectedIndex].value, selectVoltage.options[selectVoltage.selectedIndex].value)
    // ipc.once('evap-series-evapVoltage', (event, data) => {
    //     selectVoltage.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].evap_voltage)
    //         newChild.appendChild(textChild)
    //         selectVoltage.appendChild(newChild)
    //     }
    // })
    // ipc.once('evap-series-evapBrand', (event, data) => {
    //     selectBrand.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].evap_brand)
    //         newChild.appendChild(textChild)
    //         selectBrand.appendChild(newChild)
    //     }
    // })
    ipc.once('evap-series-evapModel', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.add(document.createElement("option"), selectModel[0])
        selectModel.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------Evap Model Select---------------------------------------
selectModel.addEventListener('change', () => {
    ipc.send('evap-model-select', selectModel.options[selectModel.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
    ipc.once('evap-model-evapVoltage', (event, data) => {
        selectVoltage.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_voltage)
            newChild.appendChild(textChild)
            selectVoltage.appendChild(newChild)
        }
    })
    ipc.once('evap-model-evapBrand', (event, data) => {
        selectBrand.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_brand)
            newChild.appendChild(textChild)
            selectBrand.appendChild(newChild)
        }
    })
    ipc.once('evap-model-evapSeries', (event, data) => {
        selectSeries.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].evap_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
    })
})
// -----------------------------------Calculate Click---------------------------------------
calButton.addEventListener('click', (e) => {
    if (radioCooling.checked) {
        let letters = /^[A-Za-zก-ฮ]+$/
        var calTempDiff = 0.0
        calTempDiff = textRoom.value - textEvap.value

        var DiffTemp = Math.abs(calTempDiff)
        console.log(textRoom.value, textEvap.value, DiffTemp)
        if (!selectRefrigerant.value) {
            ipc.send('validate-refrigerant-empty')
            return false
        }
        else if (!textEvap.value) {
            ipc.send('validate-evap-empty', selectUnit.options[selectUnit.selectedIndex].value)
            return false
        }
        else if (textEvap.value.match(letters)) {
            ipc.send('validate-letters')
            return false
        }
        if (radioAppMed.checked) {
            if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textEvap.value < -15 || textEvap.value > 10 : (parseFloat(textEvap.value) - 32) * (5 / 9) < -15 || (parseFloat(textEvap.value) - 32) * (5 / 9) > 10) {
                ipc.send('validate-evap-temp-med', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
        }
        if (radioAppLow.checked) {
            if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textEvap.value < -40 || textEvap.value > -10 : (parseFloat(textEvap.value) - 32) * (5 / 9) < -40 || (parseFloat(textEvap.value) - 32) * (5 / 9) > -10) {
                ipc.send('validate-evap-temp-low', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
        }
        if (!textRoom.value) {
            ipc.send('validate-room-empty', selectUnit.options[selectUnit.selectedIndex].value)
            return false
        }
        else if (textRoom.value.match(letters)) {
            ipc.send('validate-letters')
            return false
        }
        else if (parseInt(textRoom.value) <= parseInt(textEvap.value)) {
            ipc.send('validate-room-temp')
            return false
        }
        else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? DiffTemp > 12 : DiffTemp > 21.6) {
            ipc.send('validate-diff-temp', selectUnit.options[selectUnit.selectedIndex].value)
            return false
        }
        else if (!textCooling.value) {
            ipc.send('validate-cooling-empty')
            return false
        }
        else if (textCooling.value.match(letters)) {
            ipc.send('validate-letters')
            return false
        }

        document.getElementById("two-panel-content").setAttribute("hidden", true)
        document.getElementById("six-panel-content").setAttribute("hidden", true)
        document.getElementById("step-table-tab").removeAttribute("hidden")
        document.getElementById("datasheet-report").removeAttribute("hidden")
        // -------------------------------------------Cal Result---------------------------------------------
        ipc.send('evap-cal-click-cooling', selectBrand.options[selectBrand.selectedIndex].value, selectVoltage.options[selectVoltage.selectedIndex].value, selectSeries.options[selectSeries.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textCooling.value, textEvap.value, textRoom.value, radioAppLow.checked, radioAppMed.checked, textAcceptableMins.value, textAcceptablePlus.value, radioCooling.checked, selectUnit.options[selectUnit.selectedIndex].value)
        ipc.once('evap-cal-send-cooling', (event, data) => {
            console.log("evap-nodata", data[0])
            if (data[0] == null) {
                console.log("1")
                ipc.send('validate-data-empty')
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
                document.getElementById("three-panel").innerHTML = null
                document.getElementById("four-panel").innerHTML = null
                document.getElementById("five-panel").innerHTML = null
                // document.getElementById("two-panel-content").removeAttribute("hidden")
                // document.getElementById("six-panel-content").removeAttribute("hidden")
                document.getElementById("step-table-tab").setAttribute("hidden", true)
                document.getElementById("datasheet-report").setAttribute("hidden", true)
                return false
            }
            else if (data[0]["a_model"] == "") {
                console.log("2")
                ipc.send('validate-data-empty')
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
                document.getElementById("three-panel").innerHTML = null
                document.getElementById("four-panel").innerHTML = null
                document.getElementById("five-panel").innerHTML = null
                // document.getElementById("two-panel-content").removeAttribute("hidden")
                // document.getElementById("six-panel-content").removeAttribute("hidden")
                document.getElementById("step-table-tab").setAttribute("hidden", true)
                document.getElementById("datasheet-report").setAttribute("hidden", true)
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
                        let labelChild = `<label id="model${i + 1}" class="model-result"><input type="radio" name="model">${data[i][item]}</label>`
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
            document.getElementsByName("model")[0].checked = true
            // ----------------------------------------------------Technical Table-------------------------------------------
            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
            ipc.once('evap-data-change-send', (event, techData) => {
                let techTable = `
                        <table class="techTable">
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
                document.getElementById("three-panel").innerHTML = techTable
            })
            // ---------------------------------------First Step Table---------------------------------------
            var modelId = ""
            localStorage.clear();
            modelId = document.getElementById('model1').textContent

            // ---------------------------------------First Dimensions---------------------------------------
            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
            ipc.once('evap-data-change-send', (event, imgModel) => {
                var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
                document.getElementById("four-panel").innerHTML = imgdimen
                // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                //     document.getElementById("four-panel").innerHTML =
                //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                // } else if (imgModel[0].evap_series == "JC Series" || imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
                //     document.getElementById("four-panel").innerHTML =
                //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                // }
                // else {
                //     document.getElementById("four-panel").innerHTML =
                //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                // }
                // document.getElementById("four-panel").innerHTML = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div class = 'text-overall'>" + imgModel[0].evap_l + " Overall Length <br><br>" + imgModel[0].evap_w + " Overall Width <br><br>" + imgModel[0].evap_h + " Overall Height</div>"
            })
            // ---------------------------------------First Document---------------------------------------
            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                                        <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                        <p class="text-head-font"> Unit Coolers</p>
                                        <p class="text-head-font"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
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
                                        <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                        <p class="text-head-font"> Unit Coolers</p>
                                        <p class="text-head-font"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                    </div>
                                </div>
                            </div>`
                    document.getElementById("header-datasheet").innerHTML = techTable
                } else if (techData[0].evap_brand == "CUBO") {
                    let checkTemp = ""
                    if (radioAppLow) {
                        checkTemp = "Low Temp"
                    } else {
                        checkTemp = "Medium Temp"
                    }
                    let techTable = `
                            <div class="pdf-outer" id="savePDF">
                                <div class="pdf-header">
                                    <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                        src="../img/CUBO LOGO.png"></div>
                                    <div class="header-text" id="header-datasheet">
                                        <p class="text-head-font">Specification Sheet</p>
                                        <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                        <p class="text-head-font"> Unit Coolers</p>
                                        <p class="text-head-font"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value}</p>
                                    </div>
                                </div>
                            </div>`
                    document.getElementById("header-datasheet").innerHTML = techTable
                }

            })

            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                                <td class="pdf-table-right">${textRoom.value - textEvap.value}</td>  
                            </tr>
                            <tr>
                                <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td> 
                                <td class="pdf-table-right">${textEvap.value}</td>  
                            </tr>
                            <tr>
                                <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                            </tr>
                        </table>`
                document.getElementById("evap-top").innerHTML = techTable
            })

            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                                <td id="border-middle-left">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Volume (m<sup>3</sup>/h)' : 'Air Volume (CFM)'}</td>
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
            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
            //             Note: &nbsp&nbspThe rating condition is based on a super heating(10K) ,
            //             Subcooling
            //             within the limits of the condensing unit
            //         </td>
            //     </tr>
            // </table>
            // `
            //     document.getElementById("middle-others").innerHTML = techTable

            ipc.send('evap-data-change', document.getElementById("model1").textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
            ipc.once('evap-data-change-send', (event, imgModel) => {
                var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
                document.getElementById("dimension-datasheet").innerHTML = imgdimen
                // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                //     document.getElementById("dimension-datasheet").innerHTML =
                //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                // } else if (imgModel[0].evap_series == "JC Series" || imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
                //     document.getElementById("dimension-datasheet").innerHTML =
                //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                // }
                // else {
                //     document.getElementById("dimension-datasheet").innerHTML =
                //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                // }
            })

            if (data.length >= 5) {
                for (let m = 0; m < 5; m++) {
                    document.getElementById(`model${m + 1}`).addEventListener("change", (e) => {
                        modelId = document.getElementById(`model${m + 1}`).textContent
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
                                    <table class="techTable">
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
                            document.getElementById("three-panel").innerHTML = techTable

                        })
                        // // ------------------------------------------------Step Table----------------------------------------------
                        // // let modelId = selectModel.options[selectModel.selectedIndex].value
                        // ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        // ipc.once('evap-data-change-send', (event, data) => {
                        //     if (data[0].evap_low_temp == "1") {
                        //         document.getElementById("start-evap").value = -40
                        //         document.getElementById("start-room").value = 30
                        //         document.getElementById("step-evap").value = 5
                        //         document.getElementById("step-room").value = 2
                        //         stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        //     } else {
                        //         document.getElementById("start-evap").value = -20
                        //         document.getElementById("start-room").value = 30
                        //         document.getElementById("step-evap").value = 5
                        //         document.getElementById("step-room").value = 2
                        //         stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        //     }
                        // })
                        // buttonReset.addEventListener('click', () => {
                        //     ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        //     ipc.once('evap-data-change-send', (event, data) => {
                        //         if (data[0].evap_low_temp == "1") {
                        //             document.getElementById("start-evap").value = -40
                        //             document.getElementById("start-room").value = 30
                        //             document.getElementById("step-evap").value = 5
                        //             document.getElementById("step-room").value = 2
                        //             stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        //         } else {
                        //             document.getElementById("start-evap").value = -20
                        //             document.getElementById("start-room").value = 30
                        //             document.getElementById("step-evap").value = 5
                        //             document.getElementById("step-room").value = 2
                        //             stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        //         }
                        //     })
                        // })
                        // buttonSubmit.addEventListener("click", () => {
                        //     stepChangeCap(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        // })
                        // ---------------------------------------Dimensions---------------------------------------
                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
                            document.getElementById("four-pane").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("four-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series"|| imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
                            //     document.getElementById("four-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("four-panel").innerHTML =
                            //         "<div id='layout-dimension-evap'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                            // }
                            // document.getElementById("four-panel").innerHTML = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div class = 'text-overall'>" + imgModel[0].evap_l + " Overall Length <br><br>" + imgModel[0].evap_w + " Overall Width <br><br>" + imgModel[0].evap_h + " Overall Height</div>"
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
                                        <div class="pdf-outer" id="savePDF">
                                            <div class="pdf-header">
                                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                    src="../img/PATTON Logo_Die cut.png"></div>
                                                <div class="header-text">
                                                    <p class="text-head-font">Specification Sheet</p>
                                                    <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                                    <p class="text-head-font"> Unit Coolers</p>
                                                    <p class="text-head-font"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
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
                                                    <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                                    <p class="text-head-font"> Unit Coolers</p>
                                                    <p class="text-head-font"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                </div>
                                            </div>
                                        </div>`
                                document.getElementById("header-datasheet").innerHTML = techTable
                            } else if (techData[0].evap_brand == "CUBO") {
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
                                                    src="../img/CUBO LOGO.png"></div>
                                                <div class="header-text" id="header-datasheet">
                                                    <p class="text-head-font">Specification Sheet</p>
                                                    <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                                    <p class="text-head-font"> Unit Coolers</p>
                                                    <p class="text-head-font"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                                </div>
                                            </div>
                                        </div>`
                                document.getElementById("header-datasheet").innerHTML = techTable
                            }
                        })

                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let getCooling = evapTableRows[4].querySelectorAll("td")[m].innerText
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
                                        <td class="pdf-table-right">${textRoom.value - textEvap.value}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                        <td class="pdf-table-right">${textEvap.value}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                    </tr>
                                </table>`
                            document.getElementById("evap-top").innerHTML = techTable
                        })

                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                                        <td id="border-middle-left">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Volume (m<sup>3</sup>/h)' : 'Air Volume (CFM)'}</td>
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
                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                        // let techTable =
                        //     `<table class="pdf-table" id="middle-others">
                        //     <tr>
                        //         <td colspan="2" style="background-color: white;" id="font-note">
                        //             Note: &nbsp&nbspThe rating condition is based on a super heating(10K) ,
                        //             Subcooling
                        //             within the limits of the condensing unit
                        //         </td>
                        //     </tr>
                        // </table>
                        // `
                        // document.getElementById("middle-others").innerHTML = techTable
                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
                            document.getElementById("dimension-datasheet").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("dimension-datasheet").innerHTML =
                            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series"|| imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
                            //     document.getElementById("dimension-datasheet").innerHTML =
                            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("dimension-datasheet").innerHTML =
                            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                            // }
                        })
                    })
                }
            }
            else {
                for (let m = 0; m < data.length; m++) {
                    document.getElementById(`model${m + 1}`).addEventListener("change", (e) => {
                        modelId = document.getElementById(`model${m + 1}`).textContent
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
                                    <table class="techTable">
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
                            document.getElementById("three-panel").innerHTML = techTable

                        })
                        // ------------------------------------------------Step Table----------------------------------------------
                        // let modelId = selectModel.options[selectModel.selectedIndex].value
                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, data) => {
                            if (data[0].evap_low_temp == "1") {
                                document.getElementById("start-evap").value = -40
                                document.getElementById("start-room").value = 30
                                document.getElementById("step-evap").value = 5
                                document.getElementById("step-room").value = 2
                                stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            } else {
                                document.getElementById("start-evap").value = -20
                                document.getElementById("start-room").value = 30
                                document.getElementById("step-evap").value = 5
                                document.getElementById("step-room").value = 2
                                stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                        })
                        buttonReset.addEventListener('click', () => {
                            ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('evap-data-change-send', (event, data) => {
                                if (data[0].evap_low_temp == "1") {
                                    document.getElementById("start-evap").value = -40
                                    document.getElementById("start-room").value = 30
                                    document.getElementById("step-evap").value = 5
                                    document.getElementById("step-room").value = 2
                                    stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                } else {
                                    document.getElementById("start-evap").value = -20
                                    document.getElementById("start-room").value = 30
                                    document.getElementById("step-evap").value = 5
                                    document.getElementById("step-room").value = 2
                                    stepChangeCapDefault(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                                }
                            })
                        })
                        buttonSubmit.addEventListener("click", () => {
                            stepChangeCap(modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        })
                        // ---------------------------------------Dimensions---------------------------------------
                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
                            document.getElementById("four-panel").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("four-panel").innerHTML =
                            //         "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series"|| imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
                            //     document.getElementById("four-panel").innerHTML =
                            //         "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("four-panel").innerHTML =
                            //         "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
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
                                  <div class="pdf-outer" id="savePDF">
                                      <div class="pdf-header">
                                          <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                              src="../img/PATTON Logo_Die cut.png"></div>
                                          <div class="header-text">
                                              <p class="text-head-font">Specification Sheet</p>
                                              <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                              <p class="text-head-font"> Unit Coolers</p>
                                              <p class="text-head-font"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
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
                                              <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                              <p class="text-head-font"> Unit Coolers</p>
                                              <p class="text-head-font"> ${checkTemp} /  ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                          </div>
                                      </div>
                                  </div>`
                                document.getElementById("header-datasheet").innerHTML = techTable
                            } else if (techData[0].evap_brand == "CUBO") {
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
                                              src="../img/CUBO LOGO.png"></div>
                                          <div class="header-text" id="header-datasheet">
                                              <p class="text-head-font">Specification Sheet</p>
                                              <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                                              <p class="text-head-font"> Unit Coolers</p>
                                              <p class="text-head-font"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                                          </div>
                                      </div>
                                  </div>`
                                document.getElementById("header-datasheet").innerHTML = techTable
                            }
                        })

                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, techData) => {
                            let getCooling = evapTableRows[4].querySelectorAll("td")[m].innerText
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
                                        <td class="pdf-table-right">${textRoom.value - textEvap.value}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                                        <td class="pdf-table-right">${textEvap.value}</td>  
                                    </tr>
                                    <tr>
                                        <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Weight (Kg)' : 'Weight (lbs)'}</td>  
                                        <td class="pdf-table-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? techData[0].evap_weight : (parseFloat(techData[0].evap_weight) * 2.2046).toFixed(0)}</td>  
                                    </tr>
                                </table>`
                            document.getElementById("evap-top").innerHTML = techTable
                        })

                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                                        <td id="border-middle-left">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Volume (m<sup>3</sup>/h)' : 'Air Volume (CFM)'}</td>
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
                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                        //             Note: &nbsp&nbspThe rating condition is based on a super heating(10K) ,
                        //             Subcooling
                        //             within the limits of the condensing unit
                        //         </td>
                        //     </tr>
                        // </table>
                        // `
                        //     document.getElementById("middle-others").innerHTML = techTable
                        ipc.send('evap-data-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                        ipc.once('evap-data-change-send', (event, imgModel) => {
                            var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
                            document.getElementById("dimension-datasheet").innerHTML = imgdimen
                            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
                            //     document.getElementById("dimension-datasheet").innerHTML =
                            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // } else if (imgModel[0].evap_series == "JC Series"|| imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
                            //     document.getElementById("dimension-datasheet").innerHTML =
                            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
                            // }
                            // else {
                            //     document.getElementById("dimension-datasheet").innerHTML =
                            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
                            // }
                        })
                    })
                }
            }
            autoClick(data)
        })


    }
    else if (radioModel.checked) {
        let letters = /^[A-Za-zก-ฮ]+$/
        var calTempDiff = 0.0
        calTempDiff = textRoom.value - textEvap.value

        var DiffTemp = Math.abs(calTempDiff)
        console.log(textRoom.value, textEvap.value, DiffTemp)
        if (!selectRefrigerant.value) {
            ipc.send('validate-refrigerant-empty')
            return false
        }
        else if (!textEvap.value) {
            ipc.send('validate-evap-empty', selectUnit.options[selectUnit.selectedIndex].value)
            return false
        }
        else if (textEvap.value.match(letters)) {
            ipc.send('validate-letters')
            return false
        }
        if (radioAppMed.checked) {
            if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textEvap.value < -15 || textEvap.value > 10 : (parseFloat(textEvap.value) - 32) * (5 / 9) < -15 || (parseFloat(textEvap.value) - 32) * (5 / 9) > 10) {
                ipc.send('validate-evap-temp-med', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
        }
        if (radioAppLow.checked) {
            if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? textEvap.value < -40 || textEvap.value > -10 : (parseFloat(textEvap.value) - 32) * (5 / 9) < -40 || (parseFloat(textEvap.value) - 32) * (5 / 9) > -10) {
                ipc.send('validate-evap-temp-low', selectUnit.options[selectUnit.selectedIndex].value)
                return false
            }
        }
        if (!textRoom.value) {
            ipc.send('validate-room-empty', selectUnit.options[selectUnit.selectedIndex].value)
            return false
        }
        else if (textRoom.value.match(letters)) {
            ipc.send('validate-letters')
            return false
        }
        else if (parseInt(textRoom.value) <= parseInt(textEvap.value)) {
            ipc.send('validate-room-temp')
            return false
        }
        else if (selectUnit.options[selectUnit.selectedIndex].value == "1111" ? DiffTemp > 12 : DiffTemp > 21.6) {
            ipc.send('validate-diff-temp', selectUnit.options[selectUnit.selectedIndex].value)
            return false
        }
        else if (selectModel.value == "") {
            ipc.send('validate-selectmodel-empty')
        }
        document.getElementById("two-panel-content").setAttribute("hidden", true)
        document.getElementById("six-panel-content").setAttribute("hidden", true)
        document.getElementById("step-table-tab").removeAttribute("hidden")
        document.getElementById("datasheet-report").removeAttribute("hidden")
        // // ------------------------------------------------Model Result----------------------------------------------
        ipc.send('evap-cal-click-model', selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textEvap.value, textRoom.value, selectUnit.options[selectUnit.selectedIndex].value)
        ipc.once('evap-cal-send-model', (event, data) => {
            console.log(selectModel.options[selectModel.selectedIndex].value)
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
        ipc.send('evap-data-change', selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, techData) => {
            let techTable = `
                    <table class="techTable">
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
            document.getElementById("three-panel").innerHTML = techTable


        })
        // ------------------------------------------------Step Table----------------------------------------------
        let modelPositionId = selectModel.options[selectModel.selectedIndex].value
        ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, data) => {
            if (data[0].evap_low_temp == "1") {
                document.getElementById("start-evap").value = -40
                document.getElementById("start-room").value = 30
                document.getElementById("step-evap").value = 5
                document.getElementById("step-room").value = 2
                stepChangeCapDefault(modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
            } else {
                document.getElementById("start-evap").value = -20
                document.getElementById("start-room").value = 30
                document.getElementById("step-evap").value = 5
                document.getElementById("step-room").value = 2
                stepChangeCapDefault(modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
            }
        })
        buttonReset.addEventListener('click', () => {
            ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
            ipc.once('evap-data-change-send', (event, data) => {
                if (data[0].evap_low_temp == "1") {
                    document.getElementById("start-evap").value = -40
                    document.getElementById("start-room").value = 30
                    document.getElementById("step-evap").value = 5
                    document.getElementById("step-room").value = 2
                    stepChangeCapDefault(modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                } else {
                    document.getElementById("start-evap").value = -20
                    document.getElementById("start-room").value = 30
                    document.getElementById("step-evap").value = 5
                    document.getElementById("step-room").value = 2
                    stepChangeCapDefault(modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }
            })
        })
        buttonSubmit.addEventListener("click", () => {
            stepChangeCap(modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        })
        // ---------------------------------------First Dimensions---------------------------------------
        ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, imgModel) => {
            var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
            document.getElementById("four-panel").innerHTML = imgdimen
            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
            //     document.getElementById("four-panel").innerHTML =
            //         "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // } else if (imgModel[0].evap_series == "JC Series"|| imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
            //     document.getElementById("four-panel").innerHTML =
            //         "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // }
            // else {
            //     document.getElementById("four-panel").innerHTML =
            //         "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
            // }
        })
        // ---------------------------------------First Document---------------------------------------
        ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                             <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
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
                             <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
                             <p class="text-head-font"> Unit Coolers</p>
                             <p class="text-head-font"> ${checkTemp} / ${selectRefrigerant.options[selectRefrigerant.selectedIndex].value} </p>
                         </div>
                     </div>
                 </div>`
                document.getElementById("header-datasheet").innerHTML = techTable
            } else if (techData[0].evap_brand == "CUBO") {
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
                             src="../img/CUBO LOGO.png"></div>
                         <div class="header-text" id="header-datasheet">
                             <p class="text-head-font">Specification Sheet</p>
                             <p class="text-head-font" id="datasheet-head-model">${techData[0].evap_model}</p>
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
                    <td class="pdf-table-right">${textRoom.value - textEvap.value}</td>  
                </tr>
                <tr>
                    <td id="border-middle-top">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Design SST (Evaptemp) (°C)' : 'Design SST (Evaptemp) (°F)'} </td>  
                    <td class="pdf-table-right">${textEvap.value}</td>  
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
                    <td id="border-middle-left">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Air Volume (m<sup>3</sup>/h)' : 'Air Volume (CFM)'}</td>
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
        //             Note: &nbsp&nbspThe rating condition is based on a super heating(10K) ,
        //             Subcooling
        //             within the limits of the condensing unit
        //         </td>
        //     </tr>
        // </table>
        // `
        //     document.getElementById("middle-others").innerHTML = techTable
        ipc.send('evap-data-change', modelPositionId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
        ipc.once('evap-data-change-send', (event, imgModel) => {
            var imgdimen = "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div><div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp"
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
            document.getElementById("dimension-datasheet").innerHTML = imgdimen
            // if (imgModel[0].evap_series == "TC Series" || imgModel[0].evap_series == "S Series") {
            //     document.getElementById("dimension-datasheet").innerHTML =
            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // } else if (imgModel[0].evap_series == "JC Series"|| imgModel[0].evap_series == "JLL Series" || imgModel[0].evap_series == "JLW Series") {
            //     document.getElementById("dimension-datasheet").innerHTML =
            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span> <span id='word'> B </span>  <span id='word-underline'>" + imgModel[0].evap_b + " </span> <span id='word'> C </span>  <span id='word-underline'>" + imgModel[0].evap_c + " </span> <span id='word'> D </span>  <span id='word-underline'>" + imgModel[0].evap_d + " </span></div>"
            // }
            // else {
            //     document.getElementById("dimension-datasheet").innerHTML =
            //         "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].evap_img_dimension + ".jpg'></div> <div id='layout-word-evap'><span id='ntp-word-evap'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'> L </span><span id='word-underline'>" + imgModel[0].evap_l + "</span>  <span id='word'> W </span>  <span id='word-underline'>" + imgModel[0].evap_w + "</span> <span id='word'> H </span>  <span id='word-underline'>" + imgModel[0].evap_h + " </span>  <span id='word'> A </span>  <span id='word-underline'>" + imgModel[0].evap_a + " </span></div>"
            // }
        })
        autoClickModel()
    }
})


function stepChangeCapDefault(modelPositionId, refrigerant) {
    ipc.send('evap-step-change-default', modelPositionId, refrigerant, document.getElementById("start-room").value, document.getElementById("step-room").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value)
    ipc.once('evap-step-change-send-default', (event, resultCooling) => {
        console.log("test")
        let k = 0;
        let stepTa = [2, 3, 3, 5]
        let tempRoom = 30
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempRoom
            tempRoom += stepTa[a - 1]
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                    document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                    k++;
                    continue
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCooling[k]
                k++;
            }
        }
    })
}

function stepChangeCap(modelPositionId, refrigerant) {
    ipc.send('evap-step-change', modelPositionId, refrigerant, document.getElementById("start-room").value, document.getElementById("step-room").value, document.getElementById("start-evap").value, document.getElementById("step-evap").value)
    ipc.once('evap-step-change-send', (event, resultCooling) => {
        let k = 0;
        let tempRoom = parseFloat(document.getElementById("start-room").value)
        let tempEvap = parseFloat(document.getElementById("start-evap").value)
        for (let a = 1; a <= 5; a++) {
            stepTableRows[a].querySelectorAll("th")[0].innerHTML = tempRoom
            tempRoom += parseFloat(document.getElementById("step-room").value)
        }
        for (a = 1; a <= 8; a++) {
            stepTableRows[0].querySelectorAll("th")[a].innerHTML = tempEvap
            tempEvap += parseFloat(document.getElementById("step-evap").value)
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                if (stepTableRows[i].querySelectorAll("th")[0].innerHTML < -20 || stepTableRows[i].querySelectorAll("th")[0].innerHTML > 50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML < -50 || stepTableRows[0].querySelectorAll("th")[j + 1].innerHTML > 20) {
                    document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = "-"
                    k++;
                    continue
                }
                document.getElementById("step-result-table").querySelectorAll("tr")[i].querySelectorAll("td")[j].innerHTML = resultCooling[k]
                k++;
            }
        }
    })
}

function delay(i, last) {
    if (last) {
        setTimeout(() => {
            document.getElementById(`model1`).click()
        }, 300 * (i + 1));
    }
    else {
        setTimeout(() => {
            document.getElementById(`model${i + 1}`).click()
        }, 300 * (i + 1));
    }
}

function autoClick(data) {
    let totalTime = 0
    let elem = document.createElement('div');
    elem.innerHTML = '<div style="" id="loadingDiv"><div class="loader"></div><h1 class="textLoad"  id="percentLoad"></h1></div>';
    document.body.appendChild(elem);
    document.getElementById('outer').style.opacity = 0.05
    for (let c = 0, last = false; c <= 5; c++) {
        if (data[c].a_model == "") {
            last = true
            delay(c, last)
            totalTime += 300;
            break
        }
        else if (c == 5) {
            last = true
            delay(c, last)
            totalTime += 300;
            break
        }
        delay(c, last)
        totalTime += 300;
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
            console.log(width);
        }
    }
}

function autoClickModel() {
    let totalTime = 500
    let elem = document.createElement('div');
    elem.innerHTML = '<div style="" id="loadingDiv"><div class="loader"></div><h1 class="textLoad"  id="percentLoad"></h1></div>';
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
            console.log(width);
        }
    }
}
function unitChange() {
    if (document.getElementById('model1')) {
        if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '1111') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°C)"
            document.getElementById("label-room").innerHTML = "Room Temp (°C)"
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
            // document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°C)`
            // document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°C)`
            // document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°C)`
            // document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°C)`
            document.getElementById("text-evap").value = document.getElementById("text-evap").value ? ((parseFloat(document.getElementById("text-evap").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? ((parseFloat(document.getElementById("text-room").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) / 3.412).toFixed(0) : ""
            calButton.click()
        }
        else if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '2222') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°F)"
            document.getElementById("label-room").innerHTML = "Room Temp (°F)"
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
            // document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°F)`
            // document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°F)`
            // document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°F)`
            // document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°F)`
            document.getElementById("text-evap").value = document.getElementById("text-evap").value ? (parseFloat(document.getElementById("text-evap").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? (parseFloat(document.getElementById("text-room").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) * 3.412).toFixed(0) : ""
            calButton.click()
        }
    }
    else {
        if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '1111') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°C)"
            document.getElementById("label-room").innerHTML = "Room Temp (°C)"
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
            // document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°C)`
            // document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°C)`
            // document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°C)`
            // document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°C)`
            document.getElementById("text-evap").value = document.getElementById("text-evap").value ? ((parseFloat(document.getElementById("text-evap").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? ((parseFloat(document.getElementById("text-room").value) - 32) * (5 / 9)).toFixed(1) : ""
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) / 3.412).toFixed(0) : ""
        }
        else if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '2222') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°F)"
            document.getElementById("label-room").innerHTML = "Room Temp (°F)"
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
            // document.getElementById("datasheet-ambient-label").innerHTML = `Ambient</br> Temperature (°F)`
            // document.getElementById("datasheet-ambient-label-two").innerHTML = `Ambient</br> Temperature (°F)`
            // document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kW)</br>Evaporator Temperature (°F)`
            // document.getElementById("datasheet-power-label").innerHTML = `Input Power (kW) </br>Evaporator Temperature (°F)`
            document.getElementById("text-evap").value = document.getElementById("text-evap").value ? (parseFloat(document.getElementById("text-evap").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-room").value = document.getElementById("text-room").value ? (parseFloat(document.getElementById("text-room").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) * 3.412).toFixed(0) : ""
        }
    }
}