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
const selectType = document.getElementById('select-type')
const selectSeries = document.getElementById('select-series')
const textCooling = document.getElementById('text-cooling')
const selectModel = document.getElementById('select-model')
const textSst = document.getElementById('text-sst')
const textAmbient = document.getElementById('text-ambient')
const textAcceptableMins = document.getElementById('text-acceptable-mins')
const textAcceptablePlus = document.getElementById('text-acceptable-plus')
const radioCooling = document.getElementById('radio-cooling')
const radioModel = document.getElementById('radio-model')
const cduTableRows = document.getElementById("cduTable").querySelectorAll("tr")
const stepTableRows = document.getElementById("step-result-table").querySelectorAll("tr")
const buttonReset = document.getElementById('reset-table-step')
const buttonSubmit = document.getElementById('submit-table-step')
const pageSelect = document.getElementById('select-page')
const radioAppLow = document.getElementById('radio-app-low')
const radioAppMed = document.getElementById('radio-app-med')
const btnExport = document.getElementById('cdu-btn-export')
const btnExport2 = document.getElementById('cdu-btn-export2')
const steptableDataSheetCap = document.getElementById('step-table-datasheet-cap').querySelectorAll("tr")
const steptableDataSheetInput = document.getElementById('step-table-datasheet-powerinput').querySelectorAll("tr")
const selectUnit = document.getElementById('select-unit')
const radioTabLimit = document.getElementById('one')

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
pageSelect.selectedIndex = [0]

btnExport.addEventListener('click', () => {
    let fileName = document.getElementById("datasheet-head-model").innerHTML
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

selectBrand.setAttribute("disabled", true)
selectType.setAttribute("disabled", true)
selectSeries.setAttribute("disabled", true)
textCooling.setAttribute("disabled", true)
selectModel.setAttribute("disabled", true)
radioModel.setAttribute("disabled", true)
textSst.setAttribute("disabled", true)
textAmbient.setAttribute("disabled", true)
textAcceptableMins.setAttribute("disabled", true)
textAcceptablePlus.setAttribute("disabled", true)
selectModel.style.opacity = 0.5
selectBrand.style.opacity = 0.5
selectType.style.opacity = 0.5
selectSeries.style.opacity = 0.5
textCooling.style.opacity = 0.5
textAcceptableMins.style.opacity = 0.5
textAcceptablePlus.style.opacity = 0.5
textSst.style.opacity = 0.5
textAmbient.style.opacity = 0.5

document.getElementsByName("choice").forEach(item => {
    item.addEventListener('change', () => {
        if (radioCooling.checked == true) {
            selectModel.setAttribute("disabled", true)
            selectModel.style.opacity = 0.5
            textCooling.removeAttribute("disabled")
            textAcceptableMins.removeAttribute("disabled")
            textAcceptablePlus.removeAttribute("disabled")
            selectBrand.style.opacity = 1
            selectType.style.opacity = 1
            selectSeries.style.opacity = 1
            textCooling.style.opacity = 1
            textAcceptableMins.style.opacity = 1
            textAcceptablePlus.style.opacity = 1
        }
        else {
            textAcceptableMins.setAttribute("disabled", true)
            textAcceptablePlus.setAttribute("disabled", true)
            textCooling.setAttribute("disabled", true)
            selectModel.removeAttribute("disabled")
            selectModel.style.opacity = 1
            textCooling.style.opacity = 0.5
            textAcceptableMins.style.opacity = 0.5
            textAcceptablePlus.style.opacity = 0.5
        }
    })
})

selectionHead.addEventListener('click', () => {
    selectionContent.classList.toggle('hide');
})

operatingHead.addEventListener('click', () => {
    operatingContent.classList.toggle('hide');
})

// -----------------------------------Window Load---------------------------------------
ipc.send('cdu-loaded-refrigerant', async () => {
    await ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
radioAppMed.addEventListener('change', async () => {
    selectBrand.innerHTML = ""
    selectType.innerHTML = ""
    selectSeries.innerHTML = ""
    selectModel.innerHTML = ""
    selectBrand.add(document.createElement("option"), selectBrand[0])
    selectType.add(document.createElement("option"), selectType[0])
    selectSeries.add(document.createElement("option"), selectSeries[0])
    selectModel.add(document.createElement("option"), selectModel[0])
    selectBrand.selectedIndex = 0
    selectType.selectedIndex = 0
    selectSeries.selectedIndex = 0
    selectModel.selectedIndex = 0
    await ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
radioAppLow.addEventListener('change', async () => {
    selectBrand.innerHTML = ""
    selectType.innerHTML = ""
    selectSeries.innerHTML = ""
    selectModel.innerHTML = ""
    selectBrand.add(document.createElement("option"), selectBrand[0])
    selectType.add(document.createElement("option"), selectType[0])
    selectSeries.add(document.createElement("option"), selectSeries[0])
    selectModel.add(document.createElement("option"), selectModel[0])
    selectBrand.selectedIndex = 0
    selectType.selectedIndex = 0
    selectSeries.selectedIndex = 0
    selectModel.selectedIndex = 0
    await ipc.send('cdu-loaded', radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
})
ipc.on('cdu-brand-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_brand)
        newChild.appendChild(textChild)
        selectBrand.appendChild(newChild)
    }
})
ipc.on('cdu-type-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_standard_type)
        newChild.appendChild(textChild)
        selectType.appendChild(newChild)
    }
})
ipc.on('cdu-series-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_series)
        newChild.appendChild(textChild)
        selectSeries.appendChild(newChild)
    }
})
ipc.on('cdu-model-dropdown', (event, data) => {
    for (let i = 0; i < data.length; i++) {
        let newChild = document.createElement('option')
        let textChild = document.createTextNode(data[i].product_model)
        newChild.appendChild(textChild)
        selectModel.appendChild(newChild)
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
        if (radioCooling.checked == true) {
            selectModel.setAttribute("disabled", true)
            selectModel.style.opacity = 0.5
            selectBrand.removeAttribute("disabled")
            selectType.removeAttribute("disabled")
            selectSeries.removeAttribute("disabled")
            textCooling.removeAttribute("disabled")
            radioModel.removeAttribute("disabled")
            textSst.removeAttribute("disabled")
            textAmbient.removeAttribute("disabled")
            textAcceptableMins.removeAttribute("disabled")
            textAcceptablePlus.removeAttribute("disabled")
            selectBrand.style.opacity = 1
            selectType.style.opacity = 1
            selectSeries.style.opacity = 1
            textCooling.style.opacity = 1
            textAcceptableMins.style.opacity = 1
            textAcceptablePlus.style.opacity = 1
            textSst.style.opacity = 1
            textAmbient.style.opacity = 1
        }
        else {
            selectBrand.removeAttribute("disabled")
            selectType.removeAttribute("disabled")
            selectSeries.removeAttribute("disabled")
            textCooling.setAttribute("disabled", true)
            textAcceptableMins.setAttribute("disabled", true)
            textAcceptablePlus.setAttribute("disabled", true)
            selectModel.removeAttribute("disabled")
            radioModel.removeAttribute("disabled")
            textSst.removeAttribute("disabled")
            textAmbient.removeAttribute("disabled")
            selectModel.style.opacity = 1
            selectBrand.style.opacity = 1
            selectType.style.opacity = 1
            selectSeries.style.opacity = 1
            textCooling.style.opacity = 0.5
            textAcceptableMins.style.opacity = 0.5
            textAcceptablePlus.style.opacity = 0.5
            textSst.style.opacity = 1
            textAmbient.style.opacity = 1
        }
    } else if (selectRefrigerant.options[selectRefrigerant.selectedIndex].value == "") {
        radioCooling.checked = true
        selectBrand.setAttribute("disabled", true)
        selectType.setAttribute("disabled", true)
        selectSeries.setAttribute("disabled", true)
        textCooling.setAttribute("disabled", true)
        textAcceptableMins.setAttribute("disabled", true)
        textAcceptablePlus.setAttribute("disabled", true)
        selectModel.setAttribute("disabled", true)
        radioModel.setAttribute("disabled", true)
        textSst.setAttribute("disabled", true)
        textAmbient.setAttribute("disabled", true)
        selectModel.style.opacity = 0.5
        selectBrand.style.opacity = 0.5
        selectType.style.opacity = 0.5
        selectSeries.style.opacity = 0.5
        textCooling.style.opacity = 0.5
        textAcceptableMins.style.opacity = 0.5
        textAcceptablePlus.style.opacity = 0.5
        textSst.style.opacity = 0.5
        textAmbient.style.opacity = 0.5
    }

    ipc.send('cdu-refrigerant-select', selectRefrigerant.options[selectRefrigerant.selectedIndex].value, radioAppMed.checked, radioAppLow.checked)
    ipc.once('cdu-refrigerant-model', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.add(document.createElement("option"), selectModel[0])
        selectModel.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
    ipc.once('cdu-refrigerant-brand', (event, data) => {
        selectBrand.innerHTML = ""
        selectBrand.add(document.createElement("option"), selectBrand[0])
        selectBrand.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_brand)
            newChild.appendChild(textChild)
            selectBrand.appendChild(newChild)
        }
    })
    ipc.once('cdu-refrigerant-type', (event, data) => {
        selectType.innerHTML = ""
        selectType.add(document.createElement("option"), selectType[0])
        selectType.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_standard_type)
            newChild.appendChild(textChild)
            selectType.appendChild(newChild)
        }
    })
    ipc.once('cdu-refrigerant-series', (event, data) => {
        selectSeries.innerHTML = ""
        selectSeries.add(document.createElement("option"), selectSeries[0])
        selectSeries.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
    })
})



// -----------------------------------Brand Select---------------------------------------
selectBrand.addEventListener('change', () => {
    ipc.send('cdu-brand-select', selectBrand.options[selectBrand.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectType.options[selectType.selectedIndex].value, selectSeries.options[selectSeries.selectedIndex].value)
    ipc.once('cdu-brand-productSeries', (event, data) => {
        selectSeries.innerHTML = ""
        selectSeries.add(document.createElement("option"), selectSeries[0])
        selectSeries.selectedIndex = 0

        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
    })
    ipc.once('cdu-brand-productType', (event, data) => {
        selectType.innerHTML = ""
        selectType.add(document.createElement("option"), selectType[0])
        selectType.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_standard_type)
            newChild.appendChild(textChild)
            selectType.appendChild(newChild)
        }
    })
    ipc.once('cdu-brand-productModel', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.add(document.createElement("option"), selectModel[0])
        selectModel.selectedIndex = 0

        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------Type Select---------------------------------------
selectType.addEventListener('change', () => {
    ipc.send('cdu-type-select', selectType.options[selectType.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrand.options[selectBrand.selectedIndex].value)
    ipc.once('cdu-type-productSeries', (event, data) => {
        selectSeries.innerHTML = ""
        selectSeries.add(document.createElement("option"), selectSeries[0])
        selectSeries.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
    })
    // ipc.once('cdu-type-productBrand', (event, data) => {
    //     selectBrand.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].product_brand)
    //         newChild.appendChild(textChild)
    //         selectBrand.appendChild(newChild)
    //     }
    // })
    ipc.once('cdu-type-productModel', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.add(document.createElement("option"), selectModel[0])
        selectModel.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------Series Select---------------------------------------
selectSeries.addEventListener('change', () => {
    ipc.send('cdu-series-select', selectSeries.options[selectSeries.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectBrand.options[selectBrand.selectedIndex].value, selectType.options[selectType.selectedIndex].value)
    // ipc.once('cdu-series-productType', (event, data) => {
    //     selectType.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].product_standard_type)
    //         newChild.appendChild(textChild)
    //         selectType.appendChild(newChild)
    //     }
    // })
    // ipc.once('cdu-series-productBrand', (event, data) => {
    //     selectBrand.innerHTML = ""
    //     for (let i = 0; i < data.length; i++) {
    //         let newChild = document.createElement('option')
    //         let textChild = document.createTextNode(data[i].product_brand)
    //         newChild.appendChild(textChild)
    //         selectBrand.appendChild(newChild)
    //     }
    // })
    ipc.once('cdu-series-productModel', (event, data) => {
        selectModel.innerHTML = ""
        selectModel.add(document.createElement("option"), selectModel[0])
        selectModel.selectedIndex = 0
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_model)
            newChild.appendChild(textChild)
            selectModel.appendChild(newChild)
        }
    })
})

// -----------------------------------CDU Model Select---------------------------------------
selectModel.addEventListener('change', () => {
    ipc.send('cdu-model-select', selectModel.options[selectModel.selectedIndex].value, radioAppMed.checked, radioAppLow.checked, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
    ipc.once('cdu-model-productType', (event, data) => {
        selectType.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_standard_type)
            newChild.appendChild(textChild)
            selectType.appendChild(newChild)
        }
        // let index
        // for (i = 0; i < selectType.options.length; i++) {
        //     if (selectType.options[i].value == data[0].product_standard_type) {
        //         index = i
        //     }
        // }
        // selectType.selectedIndex = index

    })
    ipc.once('cdu-model-productBrand', (event, data) => {
        selectBrand.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_brand)
            newChild.appendChild(textChild)
            selectBrand.appendChild(newChild)
        }
        // let index
        // for (i = 0; i < selectBrand.options.length; i++) {
        //     if (selectBrand.options[i].value == data[0].product_brand) {
        //         index = i
        //     }
        // }
        // selectBrand.selectedIndex = index
    })
    ipc.once('cdu-model-productSeries', (event, data) => {
        selectSeries.innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            let newChild = document.createElement('option')
            let textChild = document.createTextNode(data[i].product_series)
            newChild.appendChild(textChild)
            selectSeries.appendChild(newChild)
        }
        // let index
        // for (i = 0; i < selectSeries.options.length; i++) {
        //     if (selectSeries.options[i].value == data[0].product_series) {
        //         index = i
        //     }
        // }
        // selectSeries.selectedIndex = index
    })
})
var modelId = ""
// -----------------------------------Calculate Click---------------------------------------
calButton.addEventListener('click', (e) => {
    if (radioCooling.checked) {
        // -------------------------Validate-----------------------------------
        let letters = /^[A-Za-zก-ฮ]+$/
        if (!selectRefrigerant.value) {
            ipc.send('validate-refrigerant-empty')++
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
        else if (!textCooling.value) {
            ipc.send('validate-cooling-empty')
            return false
        }
        else if (textCooling.value.match(letters)) {
            ipc.send('validate-letters')
            return false
        }
        chart.destroy()
        chart2.destroy()
        // -----------------------------------------------Show Tab Contents------------------------------------------
        document.getElementById("one-panel-content").setAttribute("hidden", true)
        document.getElementById("two-panel-content").setAttribute("hidden", true)
        document.getElementById("six-panel-content").setAttribute("hidden", true)
        document.getElementById("seven-panel-content").setAttribute("hidden", true)
        document.getElementById("step-table-tab").removeAttribute("hidden")
        document.getElementById("datasheet-report").removeAttribute("hidden")
        document.getElementById("IS-report").removeAttribute("hidden")
        document.getElementById("chart-div").removeAttribute("hidden")
        // -------------------------------------------Cal Result---------------------------------------------
        // if select brand 
        ipc.send('cdu-cal-click-cooling', selectBrand.options[selectBrand.selectedIndex].value, selectType.options[selectType.selectedIndex].value, selectSeries.options[selectSeries.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textCooling.value, textSst.value, textAmbient.value, radioAppLow.checked, radioAppMed.checked, textAcceptableMins.value, textAcceptablePlus.value, radioCooling.checked, selectUnit.options[selectUnit.selectedIndex].value)
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
                                <td>${techData[0].tech_model_comp}</td>
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
                                <th>Serface Area (m<sup>2</sup>)</th>
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
                                <td>${techData[0].tech_model_comp}</td>
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
            // localStorage.clear();
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

                //--------------------------------------------------------------button reset----------------------------------------

                buttonReset.addEventListener('click', () => {
                    if (radioCooling.checked) {
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
                buttonSubmit.addEventListener("click", () => {
                    if (radioCooling.checked) {
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
                    let MaxY = Math.max.apply(Math, ArrayPointY)
                    let MinY = Math.min.apply(Math, ArrayPointY)
                    if (selectUnit.options[selectUnit.selectedIndex].value == '2222') {
                        MinX = ((parseFloat(MinX) * (9 / 5)) + 32).toFixed(0)
                        MaxX = ((parseFloat(MaxX) * (9 / 5)) + 32).toFixed(0)
                        MaxY = ((parseFloat(MaxY) * (9 / 5)) + 32).toFixed(0)
                        MinY = ((parseFloat(MinY) * (9 / 5)) + 32).toFixed(0)
                        condensingValue = ((parseFloat(condensingValue) * (9 / 5)) + 32).toFixed(1)
                    }
                    // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
                    let textEvapTemp = textSst.value
                    chartChange(plot, MinX, MaxX, MinY, MaxY, textEvapTemp, condensingValue, modelId, chartNote)
                })
            })

            // ---------------------------------------First Dimensions---------------------------------------
            ipc.send('cdu-product-change', document.getElementById("model1").textContent)
            ipc.once('cdu-product-change-send', (event, imgModel) => {
                document.getElementById("four-panel").innerHTML =
                    "<div><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div ><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
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
                        <div class="pdf-outer" id="savePDF">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/PATTON Logo_Die cut.png"></div>
                                <div class="header-text">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
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
                        <div class="pdf-outer" id="savePDF">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                <div class="header-text" id="header-datasheet">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
                                    <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                        <div class="pdf-outer" id="savePDF">
                            <div class="pdf-header">
                                <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                    src="../img/CUBO LOGO.png"></div>
                                <div class="header-text" id="header-datasheet">
                                    <p class="text-head-font">Specification Sheet</p>
                                    <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
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
                        <th colspan="2" id="head-middle-right">Condenser</th>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Serface Area (m<sup>2</sup>)
                        </td>
                        <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                    </tr>
                    <tr>
                        <td id="border-middle-right">Heat exchanger</td>
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
                        <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</td>
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
                    "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div  id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word-datasheet'>L</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_l + "</span> <span id='word-datasheet'>W</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_w + "</span> <span id='word-datasheet'>H</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_h + " </span></div>"
            })
            // ---------------------------------- First Indivdaul Specification ------------------
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
                                    <p class="IS-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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

            // --------------------------------------First  Indivdaul Specification  Chart-------------------------------------------
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
                    // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
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

            // -----------------------  model in data > 5---------------------------------------
            if (data.length >= 5) {
                for (let m = 0; m < 5; m++) {
                    document.getElementById(`model${m + 1}`).addEventListener("change", (e) => {
                        // -------------------------Validate-----------------------------------
                        let letters = /^[A-Za-zก-ฮ]+$/
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
                        else if (!textCooling.value) {
                            ipc.send('validate-cooling-empty')
                            return false
                        }
                        else if (textCooling.value.match(letters)) {
                            ipc.send('validate-letters')
                            return false
                        }
                        document.getElementById("one-panel-content").setAttribute("hidden", true)
                        document.getElementById("two-panel-content").setAttribute("hidden", true)
                        document.getElementById("six-panel-content").setAttribute("hidden", true)
                        document.getElementById("seven-panel-content").setAttribute("hidden", true)
                        document.getElementById("step-table-tab").removeAttribute("hidden")
                        document.getElementById("datasheet-report").removeAttribute("hidden")
                        document.getElementById("IS-report").removeAttribute("hidden")
                        document.getElementById("chart-div").removeAttribute("hidden")
                        modelId = document.getElementById(`model${m + 1}`).textContent
                        // document.getElementById('outer').style.opacity = 0.05
                        // test()
                        for (i = 0; i < cduTableRows.length; i++) {
                            for (j = 0; j < 5; j++) {
                                cduTableRows[i].querySelectorAll("td")[j].classList.remove("active")
                            }
                            cduTableRows[i].querySelectorAll("td")[m].classList.add("active")
                        }
                        // ---------------------------------------Technical Data---------------------------------------
                        ipc.send('cdu-tech-change', document.getElementById(`model${m + 1}`).textContent, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                                            <td>${techData[0].tech_model_comp}</td>
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
                                            <th>Serface Area (m<sup>2</sup>)</th>
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
                                            <td>${techData[0].tech_model_comp}</td>
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
                            document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
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
                            let chartNote = result.tech_note

                            ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-plot-graph-send', (event, data) => {

                                // -----------------------------------Chart model data > 5--------------------------------------
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
                                // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
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
                                    <div class="pdf-outer" id="savePDF">
                                        <div class="pdf-header">
                                            <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/PATTON Logo_Die cut.png"></div>
                                            <div class="header-text">
                                                <p class="text-head-font">Specification Sheet</p>
                                                <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
                                                <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                    <div class="pdf-outer" id="savePDF">
                                        <div class="pdf-header">
                                            <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                            <div class="header-text" id="header-datasheet">
                                                <p class="text-head-font">Specification Sheet</p>
                                                <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
                                                <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                    <div class="pdf-outer" id="savePDF">
                                        <div class="pdf-header">
                                            <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                                src="../img/CUBO LOGO.png"></div>
                                            <div class="header-text" id="header-datasheet">
                                                <p class="text-head-font">Specification Sheet</p>
                                                <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
                                                <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                        <th colspan="2" id="head-middle-right">Condenser</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Serface Area (m<sup>2</sup>)
                                            </td>
                                            <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Heat exchanger</td>
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
                                        <td id="border-middle-right">&nbsp</td>
                                        <td class="pdf-table-right">&nbsp</td>
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
                                            <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</td>
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
                                "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><br> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word-datasheet'>L</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_l + "</span> <span id='word-datasheet'>W</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_w + "</span> <span id='word-datasheet'>H</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_h + " </span></div>"
                        })
                        // ----------------------------------  Indivdaul Specification >5 ------------------
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
                                            <p class="IS-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                                <p class="IS-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                                <p class="IS-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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

                        // ------------------------  Indivdaul Specification chart madol data > 5 -------------------
                        ipc.send('cdu-graph-point', modelId, textSst.value, textAmbient.value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, selectUnit.options[selectUnit.selectedIndex].value)
                        ipc.once('cdu-graph-point-send', (event, result) => {
                            let condensingValue = result.g_condensing;
                            ipc.send('cdu-plot-graph', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            ipc.once('cdu-plot-graph-send', (event, data) => {

                                // ----------------------------------- Indivdaul Specification Chart  model data   > 5 --------------------------------------
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
                                // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
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
                        // -------------------------Validate-----------------------------------
                        let letters = /^[A-Za-zก-ฮ]+$/
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
                        else if (!textCooling.value) {
                            ipc.send('validate-cooling-empty')
                            return false
                        }
                        else if (textCooling.value.match(letters)) {
                            ipc.send('validate-letters')
                            return false
                        }
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
                            if (techData[0].product_type_cooled == "Water cooled") {
                                let techTable = `
                                    <table class="techTable">
                                        <tr>
                                            <th>Compressor</th>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <th>Model Name</th>
                                            <td>${techData[0].tech_model_comp}</td>
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
                                            <th>Serface Area (m<sup>2</sup>)</th>
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
                                            <td>${techData[0].tech_model_comp}</td>
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
                            document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
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
                                let MinY = Math.min.apply(Math, ArrayPointX)
                                let MaxY = Math.max.apply(Math, ArrayPointY)
                                // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
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
                                <div class="pdf-outer" id="savePDF">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/PATTON Logo_Die cut.png"></div>
                                        <div class="header-text">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                <div class="pdf-outer" id="savePDF">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/Kaltmer_Gradient_Diecut.png"></div>
                                        <div class="header-text" id="header-datasheet">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                <div class="pdf-outer" id="savePDF">
                                    <div class="pdf-header">
                                        <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                            src="../img/CUBO LOGO.png"></div>
                                        <div class="header-text" id="header-datasheet">
                                            <p class="text-head-font">Specification Sheet</p>
                                            <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
                                            <p class="text-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                            <th colspan="2" id="head-middle-right">Condenser</th>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Serface Area (m<sup>2</sup>)
                                            </td>
                                            <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">Heat exchanger</td>
                                            <td class="pdf-table-right">${techData[0].tech_number_of_curcuits}</td>
                                        </tr>
                                            <td id="border-middle-right">Water Volume (Liters)</td>
                                            <td class="pdf-table-right">${techData[0].tech_water_volume}</td>
                                         </tr>
                                        <tr>
                                             <td id="border-middle-right">Water IN/OUT Diameter (Inch)</td>
                                             <td class="pdf-table-right">${techData[0].tech_water_diameter}</td>
                                        </tr>
                                        <tr>
                                            <td id="border-middle-right">&nbsp</td>
                                            <td class="pdf-table-right">&nbsp</td>
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
                                            <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</td>
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
                            "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><br> <div id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word'>L</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_l + "</span> <span id='word-datasheet'>W</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_w + "</span> <span id='word-datasheet'>H</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_h + " </span></div>"
                    })

                    // ----------------------------------  Indivdaul Specification <5 ------------------
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
                                         <p class="IS-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                             <p class="IS-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
                                             <pclass="IS-head-font">${techData[0].product_type_cooled} / ${checkTemp} / ${techData[0].product_refrigerant}</p>
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
                                             <p class="IS-head-font">${techData[0].product_standard_type} ${techData[0].product_series} CDU</p>
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
                                     <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Heat Reject (kW)' : 'Heat Reject (kBTU/h)'} </td>
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
                    ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    ipc.once('cdu-tech-change-send', (event, techData) => {
                        let techTable = `
                            <table class="IS-table" id="IS-Note-mid">
                            <tr>
                                <td>
                                Note: &nbsp&nbsp ${techData[0].tech_note}
                                </td>
                            </tr>
                            </table> `
                        document.getElementById("IS-Note-mid").innerHTML = techTable

                    })

                    // -------------------------------  Indivdaul Specification model data Chart < 5 --------------------
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
                            let MinY = Math.min.apply(Math, ArrayPointX)
                            let MaxY = Math.max.apply(Math, ArrayPointY)
                            // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
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
    else if (radioModel.checked) {
        // -------------------------Validate-----------------------------------
        let letters = /^[A-Za-zก-ฮ]+$/
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
        else if (selectModel.value == "") {
            ipc.send('validate-selectmodel-empty')
        }
        chart.destroy()
        chart2.destroy()
        // -----------------------------------------------Show Tab Contents------------------------------------------
        document.getElementById("one-panel-content").setAttribute("hidden", true)
        document.getElementById("two-panel-content").setAttribute("hidden", true)
        document.getElementById("six-panel-content").setAttribute("hidden", true)
        document.getElementById("seven-panel-content").setAttribute("hidden", true)
        document.getElementById("step-table-tab").removeAttribute("hidden")
        document.getElementById("datasheet-report").removeAttribute("hidden")
        document.getElementById("IS-report").removeAttribute("hidden")
        document.getElementById("chart-div").removeAttribute("hidden")
        // ------------------------------------------------Model Result----------------------------------------------
        let modelId = selectModel.options[selectModel.selectedIndex].value
        ipc.send('cdu-cal-click-model', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value, textSst.value, textAmbient.value, selectUnit.options[selectUnit.selectedIndex].value)
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
            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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
                                <td>${techData[0].tech_model_comp}</td>
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
                                <th>Serface Area (m<sup>2</sup>)</th>
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
                                <td>${techData[0].tech_model_comp}</td>
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
                    stepChangeCapDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }
                else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                    stepChangePowerInputDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }
                else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                    stepChangeCondensingDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }
                else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                    stepChangeHeatRejectDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }
                else if (document.getElementById("table-step-dropdown").value == "COP") {
                    stepChangeCOPDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }
                else if (document.getElementById("table-step-dropdown").value == "Current") {
                    stepChangeCurrentDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }
                else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                    stepChangeMassFlowDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                }



                document.getElementById('table-step-dropdown').addEventListener("change", () => {
                    if (document.getElementById('table-step-dropdown').value == "Capacity") {
                        stepChangeCapDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById('table-step-dropdown').value == "PowerInput") {
                        stepChangePowerInputDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById('table-step-dropdown').value == "Condensing") {
                        stepChangeCondensingDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById('table-step-dropdown').value == "HeatReject") {
                        stepChangeHeatRejectDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById('table-step-dropdown').value == "COP") {
                        stepChangeCOPDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById('table-step-dropdown').value == "Current") {
                        stepChangeCurrentDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById('table-step-dropdown').value == "MassFlow") {
                        stepChangeMassFlowDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                })
            })
            buttonSubmit.addEventListener("click", () => {
                if (radioModel.checked) {
                    if (document.getElementById("table-step-dropdown").value == "Capacity") {
                        stepChangeCap(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                        stepChangePowerInput(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                        stepChangeCondensing(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                        stepChangeHeatReject(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "COP") {
                        stepChangeCOP(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "Current") {
                        stepChangeCurrent(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                    else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                        stepChangeMassFlow(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                    }
                }

            })
            buttonReset.addEventListener('click', () => {
                if (radioModel.checked) {
                    ipc.send('cdu-product-change', selectModel.options[selectModel.selectedIndex].value)
                    ipc.once('cdu-product-change-send', (event, data) => {
                        // console.log("click", data[0].product_low_temp)
                        if (data[0].product_low_temp == "1" && radioAppLow.checked == true) {
                            document.getElementById("start-evap").value = -40
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                            document.getElementById("step-ambient").value = 2
                            if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                stepChangeCapDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                stepChangePowerInputDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                stepChangeCondensingDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                stepChangeHeatRejectDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "COP") {
                                stepChangeCOPDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Current") {
                                stepChangeCurrentDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                stepChangeMassFlowDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }


                        } else {
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-evap").value = -20 : document.getElementById("start-evap").value = -10
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("start-ambient").value = 30 : document.getElementById("start-ambient").value = 80
                            selectUnit.options[selectUnit.selectedIndex].value == '1111' ? document.getElementById("step-evap").value = 5 : document.getElementById("step-evap").value = 10
                            document.getElementById("step-ambient").value = 2
                            if (document.getElementById("table-step-dropdown").value == "Capacity") {
                                stepChangeCapDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "PowerInput") {
                                stepChangePowerInputDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Condensing") {
                                stepChangeCondensingDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "HeatReject") {
                                stepChangeHeatRejectDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "COP") {
                                stepChangeCOPDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "Current") {
                                stepChangeCurrentDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }
                            else if (document.getElementById("table-step-dropdown").value == "MassFlow") {
                                stepChangeMassFlowDefault(selectModel.options[selectModel.selectedIndex].value, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
                            }


                        }
                    })
                }
            })
            // ------------------------------------------------dimensions----------------------------------------------
            ipc.send('cdu-product-change', modelId)
            ipc.once('cdu-product-change-send', (event, imgModel) => {
                document.getElementById("four-panel").innerHTML = "<div id='layout-dimension'><img class= 'img-dimension' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><div id='layout-word'><span id='ntp-word'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span id='word'>L</span> <span id='word-underline'>" + imgModel[0].dimension_l + "</span> <span id='word'>W</span> <span id='word-underline'>" + imgModel[0].dimension_w + "</span> <span id='word'>H</span> <span id='word-underline'>" + imgModel[0].dimension_h + " </span></div>"
            })
            // ------------------------------------------------document----------------------------------------------
            ipc.send('cdu-product-change', modelId)
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
            //-------------------------------------------------Chart-------------------------------------------------
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
                    // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
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
            // ---------------------------------------DataSheet Result Model---------------------------------------
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
                     <div class="pdf-outer" id="savePDF">
                         <div class="pdf-header">
                             <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                 src="../img/PATTON Logo_Die cut.png"></div>
                             <div class="header-text">
                                 <p class="text-head-font">Specification Sheet</p>
                                 <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
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
                     <div class="pdf-outer" id="savePDF">
                         <div class="pdf-header">
                             <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                 src="../img/Kaltmer_Gradient_Diecut.png"></div>
                             <div class="header-text" id="header-datasheet">
                                 <p class="text-head-font">Specification Sheet</p>
                                 <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
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
                     <div class="pdf-outer" id="savePDF">
                         <div class="pdf-header">
                             <div class="pdf-logo"><img id="logo-data-sheet" width="90%"
                                 src="../img/CUBO LOGO.png"></div>
                             <div class="header-text" id="header-datasheet">
                                 <p class="text-head-font">Specification Sheet</p>
                                 <p class="text-head-font" id="datasheet-head-model">${techData[0].product_model}</p>
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
                            <th colspan="2" id="head-middle-right">Condenser</th>
                        </tr>
                        <tr>
                            <td id="border-middle-right">Serface Area (m<sup>2</sup>)
                            </td>
                            <td class="pdf-table-right">${techData[0].tech_serface_area}</td>
                        </tr>
                        <tr>
                            <td id="border-middle-right">Heat exchanger</td>
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
                            <td id="border-middle-right">&nbsp</td>
                            <td class="pdf-table-right">&nbsp</td>
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
                            <td id="border-middle-right">${selectUnit.options[selectUnit.selectedIndex].value == "1111" ? 'Diameter (mm)' : 'Diameter (Inch)'}</td>
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
                    "<div><img class= 'pdf-img-bot' src='../img/img_dimensions/" + imgModel[0].product_img_dimension + ".jpg'></div><br> <div  id='layout-word-datasheet'><span id='ntp-word-datasheet'>NTS (mm)</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id='word-datasheet'>L</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_l + "</span> <span id='word-datasheet'>W</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_w + "</span> <span id='word-datasheet'>H</span> <span id='word-underline-datasheet'>" + imgModel[0].dimension_h + " </span></div>"
            })
            // ----------------------------------  Indivdaul Specification  model  radioModel.checked------------------
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
                        <td id="border-IS-right">${selectUnit.options[selectUnit.selectedIndex].value == '1111' ? 'Design SST (Evap temp) (˚C)' : 'Design SST (Evap temp) (˚F)'}</td>
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
            ipc.send('cdu-tech-change', modelId, selectRefrigerant.options[selectRefrigerant.selectedIndex].value)
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


            //----------------------------    Indivdaul Specification Chart    radioModel.checked  -------
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
                    let MinY = Math.min.apply(Math, ArrayPointY)
                    let MaxY = Math.max.apply(Math, ArrayPointY)
                    // let textEvapTemp = selectUnit.options[selectUnit.selectedIndex].value == '1111' ? textSst.value : ((parseFloat(textSst.value) - 32) * (5 / 9))
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
        })
        autoClickModel()
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
        document.getElementById("seven").setAttribute("disabled", true)

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
        document.getElementById("seven").removeAttribute("disabled")

        document.getElementById('chart-note').innerHTML = "Note : " + chartNote
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
    //Netto 
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
        document.getElementById("seven").removeAttribute("disabled")
        document.getElementById("seven").removeAttribute("disabled")

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
        document.getElementById("seven").setAttribute("disabled", true)


        document.getElementById('cdu-note').removeAttribute("hidden")
        document.getElementById('cdu-note').innerHTML = 'This operating point is out of the compressor operating envelop.<br>' +
            'Please contact SCM staffs at SalesSCM@scmrefthai.com OR call 02-181-9771-5 ext.307'
        // for (let i = 0; i < 11; i++) {
        //     for (let j = 0; j < 5; j++) {
        //         cduTableRows[i].querySelectorAll('td')[j].classList.remove("text-color-alert")
        //     }
        // }

        // if (cduTableRows[0].querySelectorAll('td')[0].textContent == modelId) {
        //     for (let i = 0; i < 11; i++) {
        //         cduTableRows[i].querySelectorAll('td')[0].classList.add("text-color-alert")
        //     }
        // }

    } else {

        document.getElementById('chart-alert').innerHTML = null
        document.getElementById('chart-div').removeAttribute("hidden")
        document.getElementById('cdu-note').setAttribute("hidden", true)
        document.getElementById("two").removeAttribute("disabled")
        document.getElementById("three").removeAttribute("disabled")
        document.getElementById("four").removeAttribute("disabled")
        document.getElementById("five").removeAttribute("disabled")
        document.getElementById("six").removeAttribute("disabled")
        document.getElementById("seven").removeAttribute("disabled")


        // for (let i = 0; i < 11; i++) {
        //     for (let j = 0; j < 5; j++) {
        //         cduTableRows[i].querySelectorAll('td')[j].classList.remove("text-color-alert")
        //     }
        // }
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
        document.getElementById("seven").setAttribute("disabled", true)


        // if (cduTableRows[0].querySelectorAll('td')[1].textContent == modelId) {
        //     for (let i = 0; i < 11; i++) {
        //         cduTableRows[i].querySelectorAll('td')[1].classList.add("text-color-alert")
        //     }
        // } else if (cduTableRows[0].querySelectorAll('td')[2].textContent == modelId) {
        //     for (let i = 1; i < 11; i++) {
        //         cduTableRows[i].querySelectorAll('td')[2].classList.add("text-color-alert")
        //     }
        // } else if (cduTableRows[0].querySelectorAll('td')[3].textContent == modelId) {
        //     for (let i = 1; i < 11; i++) {
        //         cduTableRows[i].querySelectorAll('td')[3].classList.add("text-color-alert")
        //     }
        // } else if (cduTableRows[0].querySelectorAll('td')[4].textContent == modelId) {
        //     for (let i = 1; i < 11; i++) {
        //         cduTableRows[i].querySelectorAll('td')[4].classList.add("text-color-alert")
        //     }
        // }

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
        document.getElementById("seven").removeAttribute("disabled")

    }
    chart2.update()
}

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
            if(selectUnit.options[selectUnit.selectedIndex].value=='1111'){
                document.getElementById('datasheet-ambient-label').innerHTML = `Water Inlet</br> Temperature (°C)`
            }else{
                document.getElementById('datasheet-ambient-label').innerHTML = `Water Inlet</br> Temperature (°F)`
            }
        }
        else if (typeCooled == "Air cooled") {
            if(selectUnit.options[selectUnit.selectedIndex].value=='1111'){
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
function test() {
    document.body.appendChild(elem);
    setTimeout(() => {
        document.getElementById('outer').style.opacity = 1
        document.body.removeChild(elem)
    }, 500);
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
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
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
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) / 3.412).toFixed(0) : ""
            calButton.click()
        }
        else if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '2222') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°F)"
            document.getElementById("label-ambient").innerHTML = "Ambient Temp (°F)"
            document.getElementById("result-cop-label").innerHTML = "EER"
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
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
            document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kBTU/h)</br>Evaporator Temperature (°F)`
            document.getElementById("datasheet-power-label").innerHTML = `Input Power (kBTU/h) </br>Evaporator Temperature (°F)`
            document.getElementById("text-sst").value = document.getElementById("text-sst").value ? (parseFloat(document.getElementById("text-sst").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-ambient").value = document.getElementById("text-ambient").value ? (parseFloat(document.getElementById("text-ambient").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) * 3.412).toFixed(0) : ""
            calButton.click()
        }
    }
    else {
        if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '1111') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°C)"
            document.getElementById("label-ambient").innerHTML = "Ambient Temp (°C)"
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kW)"
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
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) / 3.412).toFixed(0) : ""
        }
        else if (document.getElementById('select-unit').options[document.getElementById('select-unit').selectedIndex].value == '2222') {
            document.getElementById("label-evap").innerHTML = "Evaporating SST (°F)"
            document.getElementById("label-ambient").innerHTML = "Ambient Temp (°F)"
            document.getElementById("label-cooling").innerHTML = "Cooling Capacity Requirement (kBTU/h)"
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
            document.getElementById("datasheet-cooling-label").innerHTML = `Capacity (kBTU/h)</br>Evaporator Temperature (°F)`
            document.getElementById("datasheet-power-label").innerHTML = `Input Power (kBTU/h) </br>Evaporator Temperature (°F)`
            document.getElementById("text-sst").value = document.getElementById("text-sst").value ? (parseFloat(document.getElementById("text-sst").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-ambient").value = document.getElementById("text-ambient").value ? (parseFloat(document.getElementById("text-ambient").value) * (9 / 5) + 32).toFixed(1) : ""
            document.getElementById("text-cooling").value = document.getElementById("text-cooling").value ? (parseFloat(document.getElementById("text-cooling").value) * 3.412).toFixed(0) : ""
        }
    }
}

