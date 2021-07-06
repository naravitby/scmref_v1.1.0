const electron = require('electron');
const url = require('url');
const path = require('path');
const ipc = require('electron').ipcMain;
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: '../scmdatabase.db',
    },
    useNullAsDefault: true
});

const { app, BrowserWindow, dialog } = electron;

const request = require('request');
const $ = require('cheerio');
var mainWindow;
let window;
var prefsWindow;

request('https://scmrefthai.com/software/', function (error, response, body) {
    let versionOnWeb = $('.elementor-heading-title', body).text();
    if (versionOnWeb != "") {
        if (versionOnWeb.split(" ")[2].split(")")[0] > "1.1.0") {
            modalWindow = new BrowserWindow({
                icon: __dirname + "./img/icon.png",
                webPreferences: {
                    nodeIntegration: true
                },
                show: true,
                width: 400,
                height: 200,
                frame: false
            });
            // modalWindow.removeMenu();
            modalWindow.loadURL(url.format({
                pathname: path.join(__dirname, './html/' + 'modalVersion' + '.html'),
                protocol: 'file',
                slashes: true
            }));
        }
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        icon: __dirname + "./img/icon.png",
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        minWidth: 1300,
        minHeight: 800,
    });
    mainWindow.maximize();
    // mainWindow.setMenu(null);
    // mainWindow.removeMenu();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './html/mainMenu.html'),
        protocol: 'file',
        slashes: true
    }));
});

app.on("window-all-closed", () => {
    app.quit()
})

function createWindow(windowName) {
    window = new BrowserWindow({
        icon: __dirname + "./img/icon.png",
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        minWidth: 1300,
        minHeight: 800,
    });
    // window.removeMenu();
    window.maximize();
    // window.setMenu(null);
    window.loadURL(url.format({
        pathname: path.join(__dirname, './html/' + windowName + '.html'),
        protocol: 'file',
        slashes: true
    }));
}



// ipc.on('get-unit-data', (event, page) => {
//     if (page == 'cdu') {
//         let unit = knex.select('cdu_units').from('units')
//         unit.then(function (rows) {
//             event.sender.send('res-unit-data', rows)
//         })
//     }
//     else if (page == 'evap') {
//         let unit = knex.select('unit_coolers_units').from('units')
//         unit.then(function (rows) {
//             event.sender.send('res-unit-data', rows)
//         })
//     }
//     else if (page == 'cduAndEvap') {
//         let unit = knex.select('cdu_and_unit_coolers_units').from('units')
//         unit.then(function (rows) {
//             event.sender.send('res-unit-data', rows)
//         })
//     }
// })

// ipc.on('update-units', (event, page, index) => {
//     if (page == 'cdu') {
//         if (index == 1) {
//             let unit = knex.select('cdu_units').from('units')
//             unit.then(function (rows) {
//                 return knex('units').update('cdu_units', 1)
//             })
//                 .then(function () {
//                     knex('units').update('cdu_units', 1)
//                 })
//         }
//         else {
//             let unit = knex.select('cdu_units').from('units')
//             unit.then(function (rows) {
//                 return knex('units').update('cdu_units', 0)
//             })
//                 .then(function () {
//                     knex('units').update('cdu_units', 0)
//                 })
//         }
//     }
//     else if (page == 'evap') {
//         if (index == 1) {
//             let unit = knex.select('unit_coolers_units').from('units')
//             unit.then(function (rows) {
//                 return knex('units').update('unit_coolers_units', 1)
//             })
//                 .then(function () {
//                     knex('units').update('unit_coolers_units', 1)
//                 })
//         }
//         else {
//             let unit = knex.select('unit_coolers_units').from('units')
//             unit.then(function (rows) {
//                 return knex('units').update('unit_coolers_units', 0)
//             })
//                 .then(function () {
//                     knex('units').update('unit_coolers_units', 0)
//                 })
//         }
//     }
//     else if (page == 'cduAndEvap') {
//         if (index == 1) {
//             let unit = knex.select('cdu_and_unit_coolers_units').from('units')
//             unit.then(function (rows) {
//                 return knex('units').update('cdu_and_unit_coolers_units', 1)
//             })
//                 .then(function () {
//                     knex('units').update('cdu_and_unit_coolers_units', 1)
//                 })
//         }
//         else {
//             let unit = knex.select('cdu_and_unit_coolers_units').from('units')
//             unit.then(function (rows) {
//                 return knex('units').update('cdu_and_unit_coolers_units', 0)
//             })
//                 .then(function () {
//                     knex('units').update('cdu_and_unit_coolers_units', 0)
//                 })
//         }
//     }
// })

ipc.on('validate-diff-temp', (event, selectUnit) => {
    if (selectUnit == "1111") {
        let options = {
            type: "info",
            title: "Error",
            message: "Room Temperature range requirement must not exceed from the difference of 12 (°C)"
        }
        dialog.showMessageBox(options)
    } else if (selectUnit == "2222") {
        let options = {
            type: "info",
            title: "Error",
            message: "Room Temperature range requirement must not exceed from the difference of 21 (°F)"
        }
        dialog.showMessageBox(options)
    }
})
ipc.on('validate-refrigerant-empty', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "Please enter refrigerant"
    }
    dialog.showMessageBox(options)
})
ipc.on('validate-data-empty', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "There is no data for the model you selected."
    }
    dialog.showMessageBox(options)
})
ipc.on('validate-selectmodel-empty', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "Please enter Model"
    }
    dialog.showMessageBox(options)
})
ipc.on('validate-cooling-empty', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "Please enter the Cooling Capacity"
    }
    dialog.showMessageBox(options)
})
ipc.on('validate-evap-empty', (event, selectUnit) => {
    if (selectUnit == "1111") {
        let options = {
            type: "info",
            title: "Error",
            message: "Please enter the Evaporating temperature (°C)"
        }
        dialog.showMessageBox(options)
    }
    else if (selectUnit == "2222") {
        let options = {
            type: "info",
            title: "Error",
            message: "Please enter the Evaporating temperature (°F)"
        }
        dialog.showMessageBox(options)
    }
})
ipc.on('validate-ambient-empty', (event, selectUnit) => {
    if (selectUnit == "1111") {
        let options = {
            type: "info",
            title: "Error",
            message: "Please enter the Ambient temperature (°C)"
        }
        dialog.showMessageBox(options)
    }
    else if (selectUnit == "2222") {
        let options = {
            type: "info",
            title: "Error",
            message: "Please enter the Ambient temperature (°F)"
        }
        dialog.showMessageBox(options)
    }
})
ipc.on('validate-room-empty', (event, selectUnit) => {
    if (selectUnit == "1111") {
        let options = {
            type: "info",
            title: "Error",
            message: "Please enter the Room temperature (°C)"
        }
        dialog.showMessageBox(options)
    }
    else if (selectUnit == "2222") {
        let options = {
            type: "info",
            title: "Error",
            message: "Please enter the Room temperature (°F)"
        }
        dialog.showMessageBox(options)
    }
})
ipc.on('validate-acceptable-empty', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "Please enter the Acceptable Range (%) "
    }
    dialog.showMessageBox(options)
})
ipc.on('validate-letters', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "Enter Only Numbers"
    }
    dialog.showMessageBox(options)
})
ipc.on('validate-evap-temp-med', (event, selectUnit) => {
    if (selectUnit == "1111") {
        let options = {
            type: "info",
            title: "Error",
            message: "Evaporating temperature range requirement must be in between -15 to 10 °C"
        }
        dialog.showMessageBox(options)
    }
    else if (selectUnit == "2222") {
        let options = {
            type: "info",
            title: "Error",
            message: "Evaporating temperature range requirement must be in between 5 to 50 °F"
        }
        dialog.showMessageBox(options)
    }
})
ipc.on('validate-evap-temp-low', (event, selectUnit) => {
    if (selectUnit == "1111") {
        let options = {
            type: "info",
            title: "Error",
            message: "Evaporating temperature range requirement must be in between -40 to -10 °C"
        }
        dialog.showMessageBox(options)
    }
    else if (selectUnit == "2222") {
        let options = {
            type: "info",
            title: "Error",
            message: "Evaporating temperature range requirement must be in between -40 to 14 °F"
        }
        dialog.showMessageBox(options)
    }
})
ipc.on('validate-ambient-temp', (event, selectUnit) => {
    if (selectUnit == "1111") {
        let options = {
            type: "info",
            title: "Error",
            message: "Ambient temperature range requirement must be in between -20 to 50 °C"
        }
        dialog.showMessageBox(options)
    } else if (selectUnit == "2222") {
        let options = {
            type: "info",
            title: "Error",
            message: "Ambient temperature range requirement must be in between -4 to 122 °F"
        }
        dialog.showMessageBox(options)
    }
})
ipc.on('validate-room-temp', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "Room temperature must be greater than Evaporating temperature"
    }
    dialog.showMessageBox(options)
})
ipc.on('validate-check-step-value', () => {
    let options = {
        type: "info",
        title: "Error",
        message: "Enter numbers greater than 0."
    }
    dialog.showMessageBox(options)
})
ipc.on('back-click', () => {
    mainWindow = new BrowserWindow({
        icon: __dirname + "./img/icon.png",
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        minWidth: 1300,
        minHeight: 800,
    });
    mainWindow.on('close', function () { mainWindow = null })
    mainWindow.maximize();
    mainWindow.removeMenu();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './html/mainMenu.html'),
        protocol: 'file',
        slashes: true
    }));
})

ipc.on('page-select', (event, data) => {
    if (data == 'Condensing Units') {
        createWindow('cduPage');
    }
    else if (data == 'Unit Coolers') {
        createWindow('evaporatorPage')
    }
    else if (data == 'CDU and Unit Coolers') {
        createWindow('cduAndEvaPage');
    }
})

ipc.on('cduOpenWindow', () => {
    createWindow('cduPage');
    mainWindow.close();
})
ipc.on('evaOpenWindow', () => {
    createWindow('evaporatorPage');
    mainWindow.close();
})
ipc.on('cduAndEvaWindow', () => {
    createWindow('cduAndEvaPage');
    mainWindow.close();
})

ipc.on('cdu-loaded-refrigerant', (event) => {
    let refrigerant = knex.select('product_refrigerant').distinct().from('cdu_data')
    refrigerant.then(function (rows) {
        event.sender.send('cdu-refrigerant-dropdown', rows)
    })
})

ipc.on('cdu-loaded', (event, radioAppMed, radioAppLow, refrigerant) => {
    if (radioAppMed) {
        if (refrigerant == "") {
            let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_med_temp', '1')
            brand.then(function (rows) {
                event.sender.send('cdu-brand-dropdown', rows)
            })
            let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_med_temp', '1')
            type.then(function (rows) {
                event.sender.send('cdu-type-dropdown', rows)
            })
            let series = knex.select('product_series').distinct().from('cdu_data').where('product_med_temp', '1')
            series.then(function (rows) {
                event.sender.send('cdu-series-dropdown', rows)
            })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_med_temp', '1')
            model.then(function (rows) {
                event.sender.send('cdu-model-dropdown', rows)
            })
        }
        else {
            let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('cdu-brand-dropdown', rows)
            })
            let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            type.then(function (rows) {
                event.sender.send('cdu-type-dropdown', rows)
            })
            let series = knex.select('product_series').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('cdu-series-dropdown', rows)
            })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('cdu-model-dropdown', rows)
            })
        }
    }
    else if (radioAppLow) {
        if (refrigerant == "") {
            let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_low_temp', '1')
            brand.then(function (rows) {
                event.sender.send('cdu-brand-dropdown', rows)
            })
            let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_low_temp', '1')
            type.then(function (rows) {
                event.sender.send('cdu-type-dropdown', rows)
            })
            let series = knex.select('product_series').distinct().from('cdu_data').where('product_low_temp', '1')
            series.then(function (rows) {
                event.sender.send('cdu-series-dropdown', rows)
            })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_low_temp', '1')
            model.then(function (rows) {
                event.sender.send('cdu-model-dropdown', rows)
            })
        }
        else {
            let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('cdu-brand-dropdown', rows)
            })
            let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            type.then(function (rows) {
                event.sender.send('cdu-type-dropdown', rows)
            })
            let series = knex.select('product_series').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('cdu-series-dropdown', rows)
            })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('cdu-model-dropdown', rows)
            })
        }
    }
})
// -----------------------------------Refrigerant CDU Select---------------------------------------
ipc.on('cdu-refrigerant-select', (event, data, radioAppMed, radioAppLow) => {
    // console.log("med",radioAppMed,"low",radioAppLow)
    if (radioAppMed) {
        let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_med_temp', '1')
        brand.then(function (rows) {
            event.sender.send('cdu-refrigerant-brand', rows)
        })
        let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_med_temp', '1')
        type.then(function (rows) {
            event.sender.send('cdu-refrigerant-type', rows)
        })
        let series = knex.select('product_series').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_med_temp', '1')
        series.then(function (rows) {
            event.sender.send('cdu-refrigerant-series', rows)
        })
        let model = knex.select('product_model').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_med_temp', '1')
        model.then(function (rows) {
            event.sender.send('cdu-refrigerant-model', rows)
        })
    } else if (radioAppLow) {
        let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_low_temp', '1')
        brand.then(function (rows) {
            event.sender.send('cdu-refrigerant-brand', rows)
        })
        let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_low_temp', '1')
        type.then(function (rows) {
            event.sender.send('cdu-refrigerant-type', rows)
        })
        let series = knex.select('product_series').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_low_temp', '1')
        series.then(function (rows) {
            event.sender.send('cdu-refrigerant-series', rows)
        })
        let model = knex.select('product_model').distinct().from('cdu_data').where('product_refrigerant', data).andWhere('product_low_temp', '1')
        model.then(function (rows) {
            event.sender.send('cdu-refrigerant-model', rows)
        })
    }
})
// -----------------------------------Refrigerant EVAP Select---------------------------------------
ipc.on('evap-refrigerant-select', (event, data, radioAppMed, radioAppLow) => {
    if (radioAppMed) {
        let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        brand.then(function (rows) {
            event.sender.send('evap-refrigerant-evapBrand', rows)
        })
        let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        voltage.then(function (rows) {
            event.sender.send('evap-refrigerant-evapVoltage', rows)
        })
        let series = knex.select('evap_series').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        series.then(function (rows) {
            event.sender.send('evap-refrigerant-evapSeries', rows)
        })
        let model = knex.select('evap_model').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        model.then(function (rows) {
            event.sender.send('evap-refrigerant-model', rows)
        })
    } else if (radioAppLow) {
        let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        brand.then(function (rows) {
            event.sender.send('evap-refrigerant-evapBrand', rows)
        })
        let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        voltage.then(function (rows) {
            event.sender.send('evap-refrigerant-evapVoltage', rows)
        })
        let series = knex.select('evap_series').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        series.then(function (rows) {
            event.sender.send('evap-refrigerant-evapSeries', rows)
        })
        let model = knex.select('evap_model').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        model.then(function (rows) {
            event.sender.send('evap-refrigerant-model', rows)
        })
    }
})
// -----------------------------------Brand Select---------------------------------------
ipc.on('cdu-brand-select', async (event, data, radioAppMed, radioAppLow, refrigerant, selectType, selectSeries) => {
    if (data == "") {
        if (radioAppMed) {
            let type = await knex.select('product_standard_type').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // type.then(function (rows) {
            event.sender.send('cdu-brand-productType', type)
            // })
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // series.then(function (rows) {
            event.sender.send('cdu-brand-productSeries', series)
            // })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('cdu-brand-productModel', rows)
            })
        } else if (radioAppLow) {
            let type = await knex.select('product_standard_type').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            // type.then(function (rows) {
            event.sender.send('cdu-brand-productType', type)
            // })
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            // series.then(function (rows) {
            event.sender.send('cdu-brand-productSeries', series)
            // })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('cdu-brand-productModel', rows)
            })
        }
    }
    else {
        if (radioAppMed) {
            let type = await knex.select('product_standard_type').distinct().from('cdu_data').where('product_brand', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // type.then(function (rows) {
            event.sender.send('cdu-brand-productType', type)
            // })
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_brand', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // series.then(function (rows) {
            event.sender.send('cdu-brand-productSeries', series)
            // })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_brand', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('cdu-brand-productModel', rows)
            })
        } else if (radioAppLow) {
            let type = await knex.select('product_standard_type').distinct().from('cdu_data').where('product_brand', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            // type.then(function (rows) {
            event.sender.send('cdu-brand-productType', type)
            // })
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_brand', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            // series.then(function (rows) {
            event.sender.send('cdu-brand-productSeries', series)
            // })
            let model = knex.select('product_model').distinct().from('cdu_data').where('product_brand', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('cdu-brand-productModel', rows)
            })
        }
    }
})
// -----------------------------------Type Select---------------------------------------
ipc.on('cdu-type-select', async (event, data, radioAppMed, radioAppLow, refrigerant, selectBrand) => {
    if (data == "") {
        if (radioAppMed) {
            if (selectBrand != "") {
                // let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
                // brand.then(function (rows) {
                //     event.sender.send('cdu-type-productBrand', rows)
                // })
                let series = await knex.select('product_series').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
                // series.then(function (rows) {
                event.sender.send('cdu-type-productSeries', series)
                // })
                let model = await knex.select('product_model').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
                // model.then(function (rows) {
                event.sender.send('cdu-type-productModel', model)
                // })
            }
            else {
                let series = await knex.select('product_series').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
                // series.then(function (rows) {
                event.sender.send('cdu-type-productSeries', series)
                // })
                let model = await knex.select('product_model').distinct().from('cdu_data').where('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
                // model.then(function (rows) {
                event.sender.send('cdu-type-productModel', model)
                // })
            }

        } else if (radioAppLow) {
            if (selectBrand != "") {
                // let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
                // brand.then(function (rows) {
                //     event.sender.send('cdu-type-productBrand', rows)
                // })
                let series = await knex.select('product_series').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
                // series.then(function (rows) {
                event.sender.send('cdu-type-productSeries', series)
                // })
                let model = await knex.select('product_model').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
                // model.then(function (rows) {
                event.sender.send('cdu-type-productModel', model)
                // })
            }
            else {
                let series = await knex.select('product_series').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
                // series.then(function (rows) {
                event.sender.send('cdu-type-productSeries', series)
                // })
                let model = await knex.select('product_model').distinct().from('cdu_data').where('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
                // model.then(function (rows) {
                event.sender.send('cdu-type-productModel', model)
                // })
            }
        }
    }
    if (radioAppMed) {
        if (selectBrand != "") {
            // let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // brand.then(function (rows) {
            //     event.sender.send('cdu-type-productBrand', rows)
            // })
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
            // series.then(function (rows) {
            event.sender.send('cdu-type-productSeries', series)
            // })
            let model = await knex.select('product_model').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
            // model.then(function (rows) {
            event.sender.send('cdu-type-productModel', model)
            // })
        }
        else {
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // series.then(function (rows) {
            event.sender.send('cdu-type-productSeries', series)
            // })
            let model = await knex.select('product_model').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // model.then(function (rows) {
            event.sender.send('cdu-type-productModel', model)
            // })
        }

    } else if (radioAppLow) {
        if (selectBrand != "") {
            // let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
            // brand.then(function (rows) {
            //     event.sender.send('cdu-type-productBrand', rows)
            // })
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
            // series.then(function (rows) {
            event.sender.send('cdu-type-productSeries', series)
            // })
            let model = await knex.select('product_model').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant).andWhere('product_brand', selectBrand)
            // model.then(function (rows) {
            event.sender.send('cdu-type-productModel', model)
            // })
        }
        else {
            let series = await knex.select('product_series').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            // series.then(function (rows) {
            event.sender.send('cdu-type-productSeries', series)
            // })
            let model = await knex.select('product_model').distinct().from('cdu_data').where('product_standard_type', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
            // model.then(function (rows) {
            event.sender.send('cdu-type-productModel', model)
            // })
        }
    }
})
// -----------------------------------Series Select---------------------------------------
ipc.on('cdu-series-select', (event, data, radioAppMed, radioAppLow, refrigerant, selectBrand, selectType) => {
    if (radioAppMed) {
        let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_series', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
        type.then(function (rows) {
            event.sender.send('cdu-series-productType', rows)
        })
        let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_series', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
        brand.then(function (rows) {
            event.sender.send('cdu-series-productBrand', rows)
        })
        let model = knex.select('product_model').distinct().from('cdu_data').where('product_series', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
        model.then(function (rows) {
            event.sender.send('cdu-series-productModel', rows)
        })
    } else if (radioAppLow) {
        let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_series', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
        type.then(function (rows) {
            event.sender.send('cdu-series-productType', rows)
        })
        let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_series', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
        brand.then(function (rows) {
            event.sender.send('cdu-series-productBrand', rows)
        })
        let model = knex.select('product_model').distinct().from('cdu_data').where('product_series', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
        model.then(function (rows) {
            event.sender.send('cdu-series-productModel', rows)
        })
    }
})
// -----------------------------------CDU Model Select---------------------------------------
// ipc.on('cdu-model-select', (event, data, radioAppMed, radioAppLow, refrigerant) => {
//     if (radioAppMed) {
//         let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_model', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
//         type.then(function (rows) {
//             event.sender.send('cdu-model-productType', rows)
//         })
//         let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_model', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
//         brand.then(function (rows) {
//             event.sender.send('cdu-model-productBrand', rows)
//         })
//         let series = knex.select('product_series').distinct().from('cdu_data').where('product_model', data).andWhere('product_med_temp', '1').andWhere('product_refrigerant', refrigerant)
//         series.then(function (rows) {
//             event.sender.send('cdu-model-productSeries', rows)
//         })
//     } else if (radioAppLow) {
//         let type = knex.select('product_standard_type').distinct().from('cdu_data').where('product_model', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
//         type.then(function (rows) {
//             event.sender.send('cdu-model-productType', rows)
//         })
//         let brand = knex.select('product_brand').distinct().from('cdu_data').where('product_model', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
//         brand.then(function (rows) {
//             event.sender.send('cdu-model-productBrand', rows)
//         })
//         let series = knex.select('product_series').distinct().from('cdu_data').where('product_model', data).andWhere('product_low_temp', '1').andWhere('product_refrigerant', refrigerant)
//         series.then(function (rows) {
//             event.sender.send('cdu-model-productSeries', rows)
//         })
//     }
// })

ipc.on('cdu-testtest', (event, data) => {
    let type = knex.select('*').distinct().from('cdu_data').where('technical_product_model', data)
    type.then(function (rows) {
        event.sender.send('cdu-test-send', rows)
    })
})
// -----------------------------------Calculate---------------------------------------
ipc.on('cdu-cal-click-cooling', async (event, brand, type, series, refrigerant, textCooling, s, Ta, radioAppLow, radioAppMed, textAcceptableMins, textAcceptablePlus, checkAcceptEvap, selectUnit) => {
    if (selectUnit == "2222") {
        textCooling = parseFloat(textCooling) / 3.412
        s = ((parseFloat(s) - 32) * (5 / 9)).toFixed(1)
        Ta = ((parseFloat(Ta) - 32) * (5 / 9)).toFixed(1)
    }
    if (radioAppLow) {
        let resultArray = []
        let calArray = []
        let model
        if (brand == "" && type == "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_refrigerant', refrigerant).andWhere('product_low_temp', '1')
            // console.log("modellll", model)
        }
        else if (brand != "" && type == "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_low_temp', '1')
        }
        else if (brand == "" && type != "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_standard_type', type).andWhere('product_refrigerant', refrigerant).andWhere('product_low_temp', '1')
        }
        else if (brand == "" && type == "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_series', series).andWhere('product_refrigerant', refrigerant).andWhere('product_low_temp', '1')
        }
        else if (brand != "" && type != "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_low_temp', '1').andWhere('product_standard_type', type)
        }
        else if (brand != "" && type == "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_low_temp', '1').andWhere('product_series', series)
        }
        else if (brand == "" && type != "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_standard_type', type).andWhere('product_refrigerant', refrigerant).andWhere('product_low_temp', '1').andWhere('product_series', series)
        }
        else if (brand != "" && type != "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_low_temp', '1').andWhere('product_standard_type', type).andWhere('product_series', series)
        }
        // model.then(function (rows) {
        // console.log("test1")
        for (let i = 0; i < model.length; i++) {
            let delT = 0.0
            let resultObject = { "a_model": '', "b_brand": '', "c_series": '', "d_coolingStep": '', "e_cooling": '', "f_powerInput": '', "g_condensing": '', "h_heatReject": '', "i_cop": '', "j_compressor": '', "k_massflow": '' }
            let calObject = { "model": '', "brand": '', "series": '', "coolingStep": '', "cooling": '', "powerInput": '', "condensing": '', "heatReject": '', "priority": '', "cop": '', "compressor": '', "massflow": '' }
            resultArray.push(resultObject)
            calArray.push(calObject)
            s = parseFloat(s)
            Ta = parseFloat(Ta)
            textCooling = parseFloat(textCooling)
            let k = parseFloat(model[i].product_k)
            // ---------------------------------Find Delt----------------------------------------
            for (test = 0; test < 50; test += 0.01) {
                delT = test.toFixed(2)
                delT = parseFloat(delT)
                let calDelT = [
                    (parseFloat(model[i].c0)) +
                    (parseFloat(model[i].c1) * s) +
                    (parseFloat(model[i].c2) * (Ta + delT)) +
                    (parseFloat(model[i].c3) * (s * s)) +
                    (parseFloat(model[i].c4) * s * (Ta + delT)) +
                    (parseFloat(model[i].c5) * (Ta + delT) * (Ta + delT)) +
                    (parseFloat(model[i].c6) * (s * s * s)) +
                    (parseFloat(model[i].c7) * (Ta + delT) * (s * s)) +
                    (parseFloat(model[i].c8) * s * ((Ta + delT) * (Ta + delT))) +
                    (parseFloat(model[i].c9) * ((Ta + delT) * (Ta + delT) * (Ta + delT))) +
                    (parseFloat(model[i].p0)) +
                    (parseFloat(model[i].p1) * s) +
                    (parseFloat(model[i].p2) * (Ta + delT)) +
                    (parseFloat(model[i].p3) * (s * s)) +
                    (parseFloat(model[i].p4) * s * (Ta + delT)) +
                    (parseFloat(model[i].p5) * (Ta + delT) * (Ta + delT)) +
                    (parseFloat(model[i].p6) * (s * s * s)) +
                    (parseFloat(model[i].p7) * (Ta + delT) * (s * s)) +
                    (parseFloat(model[i].p8) * s * ((Ta + delT) * (Ta + delT))) +
                    (parseFloat(model[i].p9) * ((Ta + delT) * (Ta + delT) * (Ta + delT)))
                ]
                calDelT = parseFloat(calDelT)
                // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
                //     delT = delT.toFixed(1)
                //     break;
                // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
                //     delT = delT.toFixed(1)
                //     break;
                // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
                //     delT = delT.toFixed(1)
                //     break;
                // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
                //     delT = delT.toFixed(2)
                //     break;
                // }
                if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                    delT = delT.toFixed(3)
                    break;
                } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                    delT = delT.toFixed(2)
                    break;
                } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                    delT = delT.toFixed(1)
                    break;
                }
                
            }
            let d = Ta + parseFloat(delT)
            d = parseFloat(d)
            let coolingCap = (
                (parseFloat(model[i].c0)) +
                (parseFloat(model[i].c1) * s) +
                (parseFloat(model[i].c2) * (d)) +
                (parseFloat(model[i].c3) * (s * s)) +
                (parseFloat(model[i].c4) * s * (d)) +
                (parseFloat(model[i].c5) * (d) * (d)) +
                (parseFloat(model[i].c6) * (s * s * s)) +
                (parseFloat(model[i].c7) * (d) * (s * s)) +
                (parseFloat(model[i].c8) * s * ((d) * (d))) +
                (parseFloat(model[i].c9) * ((d) * (d) * (d)))
            )
            let powerInput = (
                (parseFloat(model[i].p0)) +
                (parseFloat(model[i].p1) * s) +
                (parseFloat(model[i].p2) * (d)) +
                (parseFloat(model[i].p3) * (s * s)) +
                (parseFloat(model[i].p4) * s * (d)) +
                (parseFloat(model[i].p5) * (d) * (d)) +
                (parseFloat(model[i].p6) * (s * s * s)) +
                (parseFloat(model[i].p7) * (d) * (s * s)) +
                (parseFloat(model[i].p8) * s * ((d) * (d))) +
                (parseFloat(model[i].p9) * ((d) * (d) * (d)))
            )
            let compressor = (
                (parseFloat(model[i].a0)) +
                (parseFloat(model[i].a1) * s) +
                (parseFloat(model[i].a2) * (d)) +
                (parseFloat(model[i].a3) * (s * s)) +
                (parseFloat(model[i].a4) * s * (d)) +
                (parseFloat(model[i].a5) * (d) * (d)) +
                (parseFloat(model[i].a6) * (s * s * s)) +
                (parseFloat(model[i].a7) * (d) * (s * s)) +
                (parseFloat(model[i].a8) * s * ((d) * (d))) +
                (parseFloat(model[i].a9) * ((d) * (d) * (d)))
            )
            let massflow = (
                (parseFloat(model[i].m0)) +
                (parseFloat(model[i].m1) * s) +
                (parseFloat(model[i].m2) * (d)) +
                (parseFloat(model[i].m3) * (s * s)) +
                (parseFloat(model[i].m4) * s * (d)) +
                (parseFloat(model[i].m5) * (d) * (d)) +
                (parseFloat(model[i].m6) * (s * s * s)) +
                (parseFloat(model[i].m7) * (d) * (s * s)) +
                (parseFloat(model[i].m8) * s * ((d) * (d))) +
                (parseFloat(model[i].m9) * ((d) * (d) * (d)))
            )

            var fanPowerInput
            if (model[0].tech_total_fan_power == null) {
                fanPowerInput = 0
            }
            else {
                fanPowerInput = parseFloat(model[0].tech_total_fan_power) / 1000
            }
            let totalPowerInput = fanPowerInput + powerInput
            let heatReject = coolingCap + powerInput
            let cop = coolingCap / totalPowerInput
            calArray[i].model = model[i].product_model
            calArray[i].brand = model[i].product_brand
            calArray[i].series = model[i].product_series
            calArray[i].coolingStep = ((coolingCap.toFixed(1) / textCooling) * 100).toFixed(0)
            calArray[i].cooling = coolingCap.toFixed(2)
            calArray[i].powerInput = totalPowerInput.toFixed(2)
            calArray[i].condensing = d.toFixed(1)
            calArray[i].heatReject = heatReject.toFixed(2)
            calArray[i].cop = cop.toFixed(2)
            calArray[i].compressor = compressor.toFixed(1)
            calArray[i].massflow = massflow.toFixed(1)
            if (coolingCap > textCooling) {
                calArray[i].priority = coolingCap - textCooling
            }
            else {
                calArray[i].priority = textCooling - coolingCap
            }


        }
        // -------------------------------------------Put Data in ResultArray-------------------------------------------
        calArray.sort((a, b) => {
            const A = parseFloat(a.priority)
            const B = parseFloat(b.priority)

            let comparison = 0;
            if (A > B) {
                comparison = 1;
            } else if (A < B) {
                comparison = -1;
            }
            return comparison
        });
        if (checkAcceptEvap) {
            let minAcceptable = 100 - parseInt(textAcceptableMins)
            let maxAcceptable = 100 + parseInt(textAcceptablePlus)
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                // console.log("%1 = ",calArray[i].coolingStep);
                if (calArray[i].coolingStep >= minAcceptable && calArray[i].coolingStep <= maxAcceptable) {
                    if (selectUnit == "1111") {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = calArray[i].cooling + " kW"
                        resultArray[j].f_powerInput = calArray[i].powerInput + " kW"
                        resultArray[j].g_condensing = calArray[i].condensing + " °C"
                        resultArray[j].h_heatReject = calArray[i].heatReject + " kW"
                        resultArray[j].i_cop = calArray[i].cop
                        resultArray[j].j_compressor = calArray[i].compressor + " A"
                        // console.log("Mass", calArray[i].massflow)
                        if (calArray[i].massflow == '0.0') {
                            resultArray[j].k_massflow = "N/A"
                        }
                        else {
                            resultArray[j].k_massflow = calArray[i].massflow + " g/s"
                        }
                    }
                    else if (selectUnit == "2222") {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].f_powerInput = (parseFloat(calArray[i].powerInput) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].g_condensing = (parseFloat(calArray[i].condensing) * (9 / 5) + 32).toFixed(1) + " °F"
                        resultArray[j].h_heatReject = (parseFloat(calArray[i].heatReject) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].i_cop = (parseFloat(calArray[i].cop) * 3.412).toFixed(2) + " BTU/h/W"
                        resultArray[j].j_compressor = calArray[i].compressor + " A"
                        // console.log("Mass", calArray[i].massflow)
                        if (calArray[i].massflow == '0.0') {
                            resultArray[j].k_massflow = "N/A"
                        }
                        else {
                            resultArray[j].k_massflow = (parseFloat(calArray[i].massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                        }
                    }
                } else {
                    j = j - 1
                    continue;
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            event.reply('cdu-cal-send-cooling', resultArray)
        }
        else {
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                // console.log("%2 = ",calArray[i].coolingStep);
                if (selectUnit == "1111") {
                    resultArray[j].a_model = calArray[i].model
                    resultArray[j].b_brand = calArray[i].brand
                    resultArray[j].c_series = calArray[i].series
                    resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                    resultArray[j].e_cooling = calArray[i].cooling + " kW"
                    resultArray[j].f_powerInput = calArray[i].powerInput + " kW"
                    resultArray[j].g_condensing = calArray[i].condensing + " °C"
                    resultArray[j].h_heatReject = calArray[i].heatReject + " kW"
                    resultArray[j].i_cop = calArray[i].cop
                    resultArray[j].j_compressor = calArray[i].compressor + " A"
                    // console.log("Mass", calArray[i].massflow)
                    if (calArray[i].massflow == '0.0') {
                        resultArray[j].k_massflow = "N/A"
                    }
                    else {
                        resultArray[j].k_massflow = calArray[i].massflow + " g/s"
                    }
                }
                else if (selectUnit == "2222") {
                    resultArray[j].a_model = calArray[i].model
                    resultArray[j].b_brand = calArray[i].brand
                    resultArray[j].c_series = calArray[i].series
                    resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                    resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                    resultArray[j].f_powerInput = (parseFloat(calArray[i].powerInput) * 3.412).toFixed(2) + " kBTU/h"
                    resultArray[j].g_condensing = (parseFloat(calArray[i].condensing) * (9 / 5) + 32).toFixed(1) + " °F"
                    resultArray[j].h_heatReject = (parseFloat(calArray[i].heatReject) * 3.412).toFixed(2) + " kBTU/h"
                    resultArray[j].i_cop = (parseFloat(calArray[i].cop) * 3.412).toFixed(2) + " BTU/h/W"
                    resultArray[j].j_compressor = calArray[i].compressor + " A"
                    // console.log("Mass", calArray[i].massflow)
                    if (calArray[i].massflow == '0.0') {
                        resultArray[j].k_massflow = "N/A"
                    }
                    else {
                        resultArray[j].k_massflow = (parseFloat(calArray[i].massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                    }
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            event.reply('cdu-cal-send-cooling', resultArray)
        }

    } else if (radioAppMed) {
        let resultArray = []
        let calArray = []
        let model
        let polygon = []
        if (brand == "" && type == "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_refrigerant', refrigerant).andWhere('product_med_temp', '1')
        }
        else if (brand != "" && type == "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_med_temp', '1')
        }
        else if (brand == "" && type != "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_standard_type', type).andWhere('product_refrigerant', refrigerant).andWhere('product_med_temp', '1')
        }
        else if (brand == "" && type == "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_series', series).andWhere('product_refrigerant', refrigerant).andWhere('product_med_temp', '1')
        }
        else if (brand != "" && type != "" && series == "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_med_temp', '1').andWhere('product_standard_type', type)
        }
        else if (brand != "" && type == "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_med_temp', '1').andWhere('product_series', series)
        }
        else if (brand == "" && type != "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_standard_type', type).andWhere('product_refrigerant', refrigerant).andWhere('product_med_temp', '1').andWhere('product_series', series)
        }
        else if (brand != "" && type != "" && series != "") {
            model = await knex.select('*').distinct().from('cdu_data').where('product_brand', brand).andWhere('product_refrigerant', refrigerant).andWhere('product_med_temp', '1').andWhere('product_standard_type', type).andWhere('product_series', series)
        }
        // console.log("polygon", polygon)
        for (let i = 0; i < model.length; i++) {
            let plot = []
            let plotQuery = await knex.select('*').distinct().from('envelope_limits').where('envelope_model', model[i].product_model).andWhere('envelope_refrigerant', refrigerant)
            for (const key in plotQuery[0]) {
                if (key == "envelope_model" || key == "envelope_refrigerant" || plotQuery[0][key] == null) {
                    continue
                }
                plot.push(plotQuery[0][key])
            }
            plot.push(plot[0])
            plot.push(plot[1])

            let testArray = []
            for (let j = 0; j < plot.length; j++) {
                testArray.push([parseFloat(plot[j]), parseFloat(plot[j + 1])])
                j++
            }
            polygon = testArray
            let delT = 0.0
            let resultObject = { "a_model": '', "b_brand": '', "c_series": '', "d_coolingStep": '', "e_cooling": '', "f_powerInput": '', "g_condensing": '', "h_heatReject": '', "i_cop": '', "j_compressor": '', "k_massflow": '' }
            let calObject = { "model": '', "brand": '', "series": '', "coolingStep": '', "cooling": '', "powerInput": '', "condensing": '', "heatReject": '', "priority": '', "cop": '', "compressor": '', "massflow": '', "polygon": '' }
            resultArray.push(resultObject)
            calArray.push(calObject)
            s = parseFloat(s)
            Ta = parseFloat(Ta)
            textCooling = parseFloat(textCooling)
            let k = parseFloat(model[i].product_k)
            // ---------------------------------Find Delt----------------------------------------
            for (test = 0; test < 50; test += 0.01) {
                delT = test.toFixed(2)
                delT = parseFloat(delT)
                let calDelT = [
                    (parseFloat(model[i].c0)) +
                    (parseFloat(model[i].c1) * s) +
                    (parseFloat(model[i].c2) * (Ta + delT)) +
                    (parseFloat(model[i].c3) * (s * s)) +
                    (parseFloat(model[i].c4) * s * (Ta + delT)) +
                    (parseFloat(model[i].c5) * (Ta + delT) * (Ta + delT)) +
                    (parseFloat(model[i].c6) * (s * s * s)) +
                    (parseFloat(model[i].c7) * (Ta + delT) * (s * s)) +
                    (parseFloat(model[i].c8) * s * ((Ta + delT) * (Ta + delT))) +
                    (parseFloat(model[i].c9) * ((Ta + delT) * (Ta + delT) * (Ta + delT))) +
                    (parseFloat(model[i].p0)) +
                    (parseFloat(model[i].p1) * s) +
                    (parseFloat(model[i].p2) * (Ta + delT)) +
                    (parseFloat(model[i].p3) * (s * s)) +
                    (parseFloat(model[i].p4) * s * (Ta + delT)) +
                    (parseFloat(model[i].p5) * (Ta + delT) * (Ta + delT)) +
                    (parseFloat(model[i].p6) * (s * s * s)) +
                    (parseFloat(model[i].p7) * (Ta + delT) * (s * s)) +
                    (parseFloat(model[i].p8) * s * ((Ta + delT) * (Ta + delT))) +
                    (parseFloat(model[i].p9) * ((Ta + delT) * (Ta + delT) * (Ta + delT)))
                ]
                calDelT = parseFloat(calDelT)
                // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
                //     delT = delT.toFixed(1)
                //     break;
                // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
                //     delT = delT.toFixed(1)
                //     break;
                // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
                //     delT = delT.toFixed(1)
                //     break;
                // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
                //     delT = delT.toFixed(2)
                //     break;
                // }

                if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                    delT = delT.toFixed(3)
                    break;
                } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                    delT = delT.toFixed(2)
                    break;
                } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                    delT = delT.toFixed(1)
                    break;
                }
                
            }
            let d = Ta + parseFloat(delT)
            d = parseFloat(d)
            let coolingCap = (
                (parseFloat(model[i].c0)) +
                (parseFloat(model[i].c1) * s) +
                (parseFloat(model[i].c2) * (d)) +
                (parseFloat(model[i].c3) * (s * s)) +
                (parseFloat(model[i].c4) * s * (d)) +
                (parseFloat(model[i].c5) * (d) * (d)) +
                (parseFloat(model[i].c6) * (s * s * s)) +
                (parseFloat(model[i].c7) * (d) * (s * s)) +
                (parseFloat(model[i].c8) * s * ((d) * (d))) +
                (parseFloat(model[i].c9) * ((d) * (d) * (d)))
            )
            let powerInput = (
                (parseFloat(model[i].p0)) +
                (parseFloat(model[i].p1) * s) +
                (parseFloat(model[i].p2) * (d)) +
                (parseFloat(model[i].p3) * (s * s)) +
                (parseFloat(model[i].p4) * s * (d)) +
                (parseFloat(model[i].p5) * (d) * (d)) +
                (parseFloat(model[i].p6) * (s * s * s)) +
                (parseFloat(model[i].p7) * (d) * (s * s)) +
                (parseFloat(model[i].p8) * s * ((d) * (d))) +
                (parseFloat(model[i].p9) * ((d) * (d) * (d)))
            )
            let compressor = (
                (parseFloat(model[i].a0)) +
                (parseFloat(model[i].a1) * s) +
                (parseFloat(model[i].a2) * (d)) +
                (parseFloat(model[i].a3) * (s * s)) +
                (parseFloat(model[i].a4) * s * (d)) +
                (parseFloat(model[i].a5) * (d) * (d)) +
                (parseFloat(model[i].a6) * (s * s * s)) +
                (parseFloat(model[i].a7) * (d) * (s * s)) +
                (parseFloat(model[i].a8) * s * ((d) * (d))) +
                (parseFloat(model[i].a9) * ((d) * (d) * (d)))
            )
            let massflow = (
                (parseFloat(model[i].m0)) +
                (parseFloat(model[i].m1) * s) +
                (parseFloat(model[i].m2) * (d)) +
                (parseFloat(model[i].m3) * (s * s)) +
                (parseFloat(model[i].m4) * s * (d)) +
                (parseFloat(model[i].m5) * (d) * (d)) +
                (parseFloat(model[i].m6) * (s * s * s)) +
                (parseFloat(model[i].m7) * (d) * (s * s)) +
                (parseFloat(model[i].m8) * s * ((d) * (d))) +
                (parseFloat(model[i].m9) * ((d) * (d) * (d)))
            )

            var fanPowerInput
            if (model[0].tech_total_fan_power == null) {
                fanPowerInput = 0
            }
            else {
                fanPowerInput = parseFloat(model[0].tech_total_fan_power) / 1000
            }
            let totalPowerInput = fanPowerInput + powerInput
            let heatReject = coolingCap + powerInput
            let cop = coolingCap / totalPowerInput

            calArray[i].model = model[i].product_model
            calArray[i].brand = model[i].product_brand
            calArray[i].series = model[i].product_series
            calArray[i].coolingStep = ((coolingCap.toFixed(1) / textCooling) * 100).toFixed(0)
            calArray[i].cooling = coolingCap.toFixed(2)
            calArray[i].powerInput = totalPowerInput.toFixed(2)
            calArray[i].condensing = d.toFixed(1)
            calArray[i].heatReject = heatReject.toFixed(2)
            calArray[i].cop = cop.toFixed(2)
            calArray[i].compressor = compressor.toFixed(1)
            calArray[i].massflow = massflow.toFixed(1)
            if (coolingCap > textCooling) {
                calArray[i].priority = coolingCap - textCooling
            }
            else {
                calArray[i].priority = textCooling - coolingCap
            }
            calArray[i].polygon = polygon

            // console.log("aaaa", inside([parseFloat(s), parseFloat(d)], polygon))

        }
        // console.log("polygonaaaaaaa", polygon[0], model[0].product_model)
        // -------------------------------------------Put Data in ResultArray-------------------------------------------
        // console.log("%CalArray = ",calArray.length);
        // console.log("%Model = ",model.length);
        calArray.sort((a, b) => {
            const A = parseFloat(a.priority)
            const B = parseFloat(b.priority)

            let comparison = 0;
            if (A > B) {
                comparison = 1;
            } else if (A < B) {
                comparison = -1;
            }
            return comparison
        });
        if (checkAcceptEvap) {
            let minAcceptable = 100 - parseInt(textAcceptableMins)
            let maxAcceptable = 100 + parseInt(textAcceptablePlus)
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                if (calArray[i].coolingStep >= minAcceptable && calArray[i].coolingStep <= maxAcceptable) {
                    if (selectUnit == "1111") {
                        if (inside([parseFloat(s), parseFloat(calArray[i].condensing)], calArray[i].polygon) == true) {
                            resultArray[j].a_model = calArray[i].model
                            resultArray[j].b_brand = calArray[i].brand
                            resultArray[j].c_series = calArray[i].series
                            resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                            resultArray[j].e_cooling = calArray[i].cooling + " kW"
                            resultArray[j].f_powerInput = calArray[i].powerInput + " kW"
                            resultArray[j].g_condensing = calArray[i].condensing + " °C"
                            resultArray[j].h_heatReject = calArray[i].heatReject + " kW"
                            resultArray[j].i_cop = calArray[i].cop
                            resultArray[j].j_compressor = calArray[i].compressor + " A"
                            if (calArray[i].massflow == '0.0') {
                                resultArray[j].k_massflow = "N/A"
                            }
                            else {
                                resultArray[j].k_massflow = calArray[i].massflow + " g/s"
                            }
                        } else {
                            j = j - 1
                            continue;
                        }
                    }
                    else if (selectUnit == "2222") {
                        if (inside([parseFloat(s), parseFloat(calArray[i].condensing)], calArray[i].polygon) == true) {
                            resultArray[j].a_model = calArray[i].model
                            resultArray[j].b_brand = calArray[i].brand
                            resultArray[j].c_series = calArray[i].series
                            resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                            resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                            resultArray[j].f_powerInput = (parseFloat(calArray[i].powerInput) * 3.412).toFixed(2) + " kBTU/h"
                            resultArray[j].g_condensing = (parseFloat(calArray[i].condensing) * (9 / 5) + 32).toFixed(1) + " °F"
                            resultArray[j].h_heatReject = (parseFloat(calArray[i].heatReject) * 3.412).toFixed(2) + " kBTU/h"
                            resultArray[j].i_cop = (parseFloat(calArray[i].cop) * 3.412).toFixed(2) + " BTU/h/W"
                            resultArray[j].j_compressor = calArray[i].compressor + " A"
                            // console.log("Mass", calArray[i].massflow)
                            if (calArray[i].massflow == '0.0') {
                                resultArray[j].k_massflow = "N/A"
                            }
                            else {
                                resultArray[j].k_massflow = (parseFloat(calArray[i].massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                            }
                        } else {
                            j = j - 1
                            continue;
                        }
                    }
                } else {
                    j = j - 1
                    continue;
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            // console.log("result",resultArray)
            event.reply('cdu-cal-send-cooling', resultArray)
        }
        else {
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                // console.log("%4 = ",calArray[i].coolingStep);
                if (selectUnit == "1111") {
                    if (inside([parseFloat(s), parseFloat(calArray[i].condensing)], calArray[i].polygon) == true) {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = calArray[i].cooling + " kW"
                        resultArray[j].f_powerInput = calArray[i].powerInput + " kW"
                        resultArray[j].g_condensing = calArray[i].condensing + " °C"
                        resultArray[j].h_heatReject = calArray[i].heatReject + " kW"
                        resultArray[j].i_cop = calArray[i].cop
                        resultArray[j].j_compressor = calArray[i].compressor + " A"
                        // console.log("Mass", calArray[i].massflow)
                        if (calArray[i].massflow == '0.0') {
                            resultArray[j].k_massflow = "N/A"
                        }
                        else {
                            resultArray[j].k_massflow = calArray[i].massflow + " g/s"
                        }
                    } else {
                        j = j - 1
                        continue;
                    }
                }
                else if (selectUnit == "2222") {
                    if (inside([parseFloat(s), parseFloat(calArray[i].condensing)], calArray[i].polygon) == true) {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].f_powerInput = (parseFloat(calArray[i].powerInput) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].g_condensing = (parseFloat(calArray[i].condensing) * (9 / 5) + 32).toFixed(1) + " °F"
                        resultArray[j].h_heatReject = (parseFloat(calArray[i].heatReject) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].i_cop = (parseFloat(calArray[i].cop) * 3.412).toFixed(2) + " BTU/h/W"
                        resultArray[j].j_compressor = calArray[i].compressor + " A"
                        // console.log("Mass", calArray[i].massflow)
                        if (calArray[i].massflow == '0.0') {
                            resultArray[j].k_massflow = "N/A"
                        }
                        else {
                            resultArray[j].k_massflow = (parseFloat(calArray[i].massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                        }
                    } else {
                        j = j - 1
                        continue;
                    }
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            event.reply('cdu-cal-send-cooling', resultArray)
        }
    }
})
ipc.on('cdu-cal-click-model', (event, model, refrigerant, s, Ta, selectUnit) => {
    if (selectUnit == "2222") {
        s = (parseFloat(s) - 32) * (5 / 9)
        Ta = (parseFloat(Ta) - 32) * (5 / 9)
    }
    let result = { "a_model": '', "b_brand": '', "c_series": '', "d_coolingStep": '', "e_cooling": '', "f_powerInput": '', "g_condensing": '', "h_heatReject": '', "i_cop": '', "j_compressor": '', "k_massflow": '' }
    let model1 = knex.select('*').from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
    model1.then(function (rows) {
        let delT = 0.0
        result.a_model = rows[0].product_model
        result.b_brand = rows[0].product_brand
        result.c_series = rows[0].product_series
        s = parseFloat(s)
        Ta = parseFloat(Ta)
        let k = parseFloat(rows[0].product_k)
        // console.log("k = ", rows[0].product_k)
        for (test = 0; test < 50; test += 0.01) {
            delT = test.toFixed(2)
            delT = parseFloat(delT)
            let calDelT = [
                (
                    (parseFloat(rows[0].c0)) +
                    (parseFloat(rows[0].c1) * s) +
                    (parseFloat(rows[0].c2) * (Ta + delT)) +
                    (parseFloat(rows[0].c3) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].c4) * s * (Ta + delT)) +
                    (parseFloat(rows[0].c5) * Math.pow(Ta + delT, 2)) +
                    (parseFloat(rows[0].c6) * Math.pow(s, 3)) +
                    (parseFloat(rows[0].c7) * (Ta + delT) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].c8) * s * (Math.pow(Ta + delT, 2))) +
                    (parseFloat(rows[0].c9) * Math.pow(Ta + delT, 3))
                )
                + (
                    (parseFloat(rows[0].p0)) +
                    (parseFloat(rows[0].p1) * s) +
                    (parseFloat(rows[0].p2) * (Ta + delT)) +
                    (parseFloat(rows[0].p3) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].p4) * s * (Ta + delT)) +
                    (parseFloat(rows[0].p5) * Math.pow(Ta + delT, 2)) +
                    (parseFloat(rows[0].p6) * Math.pow(s, 3)) +
                    (parseFloat(rows[0].p7) * (Ta + delT) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].p8) * s * (Math.pow(Ta + delT, 2))) +
                    (parseFloat(rows[0].p9) * Math.pow(Ta + delT, 3))
                )
            ]
            calDelT = parseFloat(calDelT)
            // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
            //     delT = delT.toFixed(1)
            //     break;
            // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
            //     delT = delT.toFixed(1)
            //     break;
            // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
            //     delT = delT.toFixed(1)
            //     break;
            // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
            //     delT = delT.toFixed(2)
            //     break;
            // }
        

            if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                delT = delT.toFixed(3)
                break;
            } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                delT = delT.toFixed(2)
                break;
            } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                delT = delT.toFixed(1)
                break;
            }
        
        }
        let d = Ta + parseFloat(delT)
        d = parseFloat(d)
        let coolingCap =
            (
                (parseFloat(rows[0].c0)) +
                (parseFloat(rows[0].c1) * s) +
                (parseFloat(rows[0].c2) * d) +
                (parseFloat(rows[0].c3) * (s * s)) +
                (parseFloat(rows[0].c4) * (s) * (d)) +
                (parseFloat(rows[0].c5) * (d * d)) +
                (parseFloat(rows[0].c6) * (s * s * s)) +
                (parseFloat(rows[0].c7) * (d) * (s * s)) +
                (parseFloat(rows[0].c8) * (s) * (d * d)) +
                (parseFloat(rows[0].c9) * (d * d * d))
            )
        let powerInput = (
            (parseFloat(rows[0].p0)) +
            (parseFloat(rows[0].p1) * s) +
            (parseFloat(rows[0].p2) * d) +
            (parseFloat(rows[0].p3) * (s * s)) +
            (parseFloat(rows[0].p4) * (s) * (d)) +
            (parseFloat(rows[0].p5) * (d * d)) +
            (parseFloat(rows[0].p6) * (s * s * s)) +
            (parseFloat(rows[0].p7) * (d) * (s * s)) +
            (parseFloat(rows[0].p8) * (s) * (d * d)) +
            (parseFloat(rows[0].p9) * (d * d * d))
        )
        let compressor = (
            (parseFloat(rows[0].a0)) +
            (parseFloat(rows[0].a1) * s) +
            (parseFloat(rows[0].a2) * d) +
            (parseFloat(rows[0].a3) * (s * s)) +
            (parseFloat(rows[0].a4) * (s) * (d)) +
            (parseFloat(rows[0].a5) * (d * d)) +
            (parseFloat(rows[0].a6) * (s * s * s)) +
            (parseFloat(rows[0].a7) * (d) * (s * s)) +
            (parseFloat(rows[0].a8) * (s) * (d * d)) +
            (parseFloat(rows[0].a9) * (d * d * d))
        )
        let massflow = (
            (parseFloat(rows[0].m0)) +
            (parseFloat(rows[0].m1) * s) +
            (parseFloat(rows[0].m2) * d) +
            (parseFloat(rows[0].m3) * (s * s)) +
            (parseFloat(rows[0].m4) * (s) * (d)) +
            (parseFloat(rows[0].m5) * (d * d)) +
            (parseFloat(rows[0].m6) * (s * s * s)) +
            (parseFloat(rows[0].m7) * (d) * (s * s)) +
            (parseFloat(rows[0].m8) * (s) * (d * d)) +
            (parseFloat(rows[0].m9) * (d * d * d))
        )
        var fanPowerInput
        if (rows[0].tech_total_fan_power == null) {
            fanPowerInput = 0
        }
        else {
            fanPowerInput = parseFloat(rows[0].tech_total_fan_power) / 1000
        }

        let totalPowerInput = fanPowerInput + powerInput
        let heatReject = coolingCap + powerInput
        let cop = coolingCap / totalPowerInput

        if (selectUnit == "1111") {
            result.d_coolingStep = "100 %"
            result.e_cooling = coolingCap.toFixed(2) + " kW"
            result.f_powerInput = totalPowerInput.toFixed(2) + " kW"
            result.g_condensing = d.toFixed(1) + " °C"
            result.h_heatReject = heatReject.toFixed(2) + " kW"
            result.i_cop = cop.toFixed(2)
            result.j_compressor = compressor.toFixed(1) + " A"
            // result.k_massflow = massflow.toFixed(1) + " g/s"
            // console.log("mass",massflow);
            if (parseFloat(massflow).toFixed(1) == 0.0) {
                result.k_massflow = "N/A"
            }
            else {
                result.k_massflow = massflow.toFixed(1) + " g/s"
            }
        }
        else if (selectUnit == "2222") {
            result.d_coolingStep = "100 %"
            result.e_cooling = (parseFloat(coolingCap) * 3.412).toFixed(2) + " kBTU/h"
            result.f_powerInput = (parseFloat(totalPowerInput) * 3.412).toFixed(2) + " kBTU/h"
            result.g_condensing = (parseFloat(d) * (9 / 5) + 32).toFixed(1) + " °F"
            result.h_heatReject = (parseFloat(heatReject) * 3.412).toFixed(2) + " kBTU/h"
            result.i_cop = (parseFloat(cop) * 3.412).toFixed(2) + " BTU/h/W"
            result.j_compressor = compressor.toFixed(1) + " A"
            // result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
            // console.log("mass",massflow);
            if (parseFloat(massflow).toFixed(1) == 0.0) {
                result.k_massflow = "N/A"
            }
            else {
                result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
            }
        }

        event.reply('cdu-cal-send-model', result, rows)
    })
})

ipc.on('cdu-tech-change', (event, model, refrigerant) => {
    let tech = knex.select('*').distinct().from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
    tech.then(function (rows) {
        event.reply('cdu-tech-change-send', rows)
    })
})
ipc.on('cdu-product-change', (event, model) => {
    let product = knex.select('*').distinct().from('cdu_data').where('product_model', model)
    product.then(function (rows) {
        event.reply('cdu-product-change-send', rows)
    })
})

ipc.on('cdu-step-change', async (event, model, refrigerant, startAmbient, stepAmbient, startEvap, stepEvap, selectUnit) => {
    if (selectUnit == "2222") {
        startAmbient = (parseFloat(startAmbient) - 32) * (5 / 9)
        startEvap = (parseFloat(startEvap) - 32) * (5 / 9)
    }
    // console.log(refrigerant)
    let resultCooling = []
    let resultPowerInput = []
    let resultCondensing = []
    let resultHeatReject = []
    let resultCOP = []
    let resultCurrent = []
    let resultMassFlow = []
    stepAmbient = selectUnit == "1111" ? parseFloat(stepAmbient) : parseFloat(stepAmbient) / 1.8
    stepEvap = selectUnit == "1111" ? parseFloat(stepEvap) : parseFloat(stepEvap) / 1.8
    let Ta = parseFloat(startAmbient)
    let s = parseFloat(startEvap)
    let plot = []

    let plotQuery = await knex.select('*').distinct().from('envelope_limits').where('envelope_model', model).andWhere('envelope_refrigerant', refrigerant)
    for (const key in plotQuery[0]) {
        if (key == "envelope_model" || key == "envelope_refrigerant" || plotQuery[0][key] == null) {
            continue
        }
        plot.push(plotQuery[0][key])
    }
    plot.push(plot[0])
    plot.push(plot[1])

    let polygon = []
    for (let i = 0; i < plot.length; i++) {
        polygon.push([parseFloat(plot[i]), parseFloat(plot[i + 1])])
        i++
    }
    if (selectUnit == "2222") {
        for (let i = 0; i < plot.length; i++) {
            plot[i] = ((parseFloat(plot[i]) * (9 / 5)) + 32).toFixed(0)
        }
    }

    let model1 = knex.from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
    model1.then(function (rows) {
        for (let i = 0; i < 5; i++) {
            s = parseFloat(startEvap)
            for (let j = 0; j < 8; j++) {
                let delT = 0.0
                // s = parseFloat(s)
                // Ta = parseFloat(Ta)
                let k = parseFloat(rows[0].product_k)
                for (test = 0; test < 50; test += 0.01) { //kiy
                    delT = test.toFixed(2)
                    delT = parseFloat(delT)
                    let calDelT = [
                        (
                            (parseFloat(rows[0].c0)) +
                            (parseFloat(rows[0].c1) * s) +
                            (parseFloat(rows[0].c2) * (Ta + delT)) +
                            (parseFloat(rows[0].c3) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].c4) * s * (Ta + delT)) +
                            (parseFloat(rows[0].c5) * Math.pow(Ta + delT, 2)) +
                            (parseFloat(rows[0].c6) * Math.pow(s, 3)) +
                            (parseFloat(rows[0].c7) * (Ta + delT) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].c8) * s * (Math.pow(Ta + delT, 2))) +
                            (parseFloat(rows[0].c9) * Math.pow(Ta + delT, 3))
                        )
                        + (
                            (parseFloat(rows[0].p0)) +
                            (parseFloat(rows[0].p1) * s) +
                            (parseFloat(rows[0].p2) * (Ta + delT)) +
                            (parseFloat(rows[0].p3) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].p4) * s * (Ta + delT)) +
                            (parseFloat(rows[0].p5) * Math.pow(Ta + delT, 2)) +
                            (parseFloat(rows[0].p6) * Math.pow(s, 3)) +
                            (parseFloat(rows[0].p7) * (Ta + delT) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].p8) * s * (Math.pow(Ta + delT, 2))) +
                            (parseFloat(rows[0].p9) * Math.pow(Ta + delT, 3))
                        )
                    ]
                    calDelT = parseFloat(calDelT)
                    // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
                    //     delT = delT.toFixed(1)
                    //     break;
                    // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
                    //     delT = delT.toFixed(1)
                    //     break;
                    // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
                    //     delT = delT.toFixed(1)
                    //     break;
                    // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
                    //     delT = delT.toFixed(2)
                    //     break;
                    // }
            
                    
                    if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                        delT = delT.toFixed(3)
                        break;
                    } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                        delT = delT.toFixed(2)
                        break;
                    } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                        delT = delT.toFixed(1)
                        break;
                    }
                    
                }
                let d = Ta + parseFloat(delT)
                d = parseFloat(d)
                let coolingCap =
                    (
                        (parseFloat(rows[0].c0)) +
                        (parseFloat(rows[0].c1) * s) +
                        (parseFloat(rows[0].c2) * d) +
                        (parseFloat(rows[0].c3) * (s * s)) +
                        (parseFloat(rows[0].c4) * (s) * (d)) +
                        (parseFloat(rows[0].c5) * (d * d)) +
                        (parseFloat(rows[0].c6) * (s * s * s)) +
                        (parseFloat(rows[0].c7) * (d) * (s * s)) +
                        (parseFloat(rows[0].c8) * (s) * (d * d)) +
                        (parseFloat(rows[0].c9) * (d * d * d))
                    )
                let powerInput =
                    (
                        (parseFloat(rows[0].p0)) +
                        (parseFloat(rows[0].p1) * s) +
                        (parseFloat(rows[0].p2) * d) +
                        (parseFloat(rows[0].p3) * (s * s)) +
                        (parseFloat(rows[0].p4) * (s) * (d)) +
                        (parseFloat(rows[0].p5) * (d * d)) +
                        (parseFloat(rows[0].p6) * (s * s * s)) +
                        (parseFloat(rows[0].p7) * (d) * (s * s)) +
                        (parseFloat(rows[0].p8) * (s) * (d * d)) +
                        (parseFloat(rows[0].p9) * (d * d * d))
                    )
                let compressor =
                    (
                        (parseFloat(rows[0].a0)) +
                        (parseFloat(rows[0].a1) * s) +
                        (parseFloat(rows[0].a2) * d) +
                        (parseFloat(rows[0].a3) * (s * s)) +
                        (parseFloat(rows[0].a4) * (s) * (d)) +
                        (parseFloat(rows[0].a5) * (d * d)) +
                        (parseFloat(rows[0].a6) * (s * s * s)) +
                        (parseFloat(rows[0].a7) * (d) * (s * s)) +
                        (parseFloat(rows[0].a8) * (s) * (d * d)) +
                        (parseFloat(rows[0].a9) * (d * d * d))
                    )
                let massflow =
                    (
                        (parseFloat(rows[0].m0)) +
                        (parseFloat(rows[0].m1) * s) +
                        (parseFloat(rows[0].m2) * d) +
                        (parseFloat(rows[0].m3) * (s * s)) +
                        (parseFloat(rows[0].m4) * (s) * (d)) +
                        (parseFloat(rows[0].m5) * (d * d)) +
                        (parseFloat(rows[0].m6) * (s * s * s)) +
                        (parseFloat(rows[0].m7) * (d) * (s * s)) +
                        (parseFloat(rows[0].m8) * (s) * (d * d)) +
                        (parseFloat(rows[0].m9) * (d * d * d))
                    )
                var fanPowerInput
                if (rows[0].tech_total_fan_power == null) {
                    fanPowerInput = 0
                }
                else {
                    fanPowerInput = parseFloat(rows[0].tech_total_fan_power) / 1000
                }

                let totalPowerInput = fanPowerInput + powerInput
                let heatReject = coolingCap + powerInput
                let cop = coolingCap / totalPowerInput

                if (selectUnit == "1111") {
                    if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                        resultCooling.push(coolingCap.toFixed(2))
                        resultPowerInput.push(totalPowerInput.toFixed(2))
                        resultCondensing.push(d.toFixed(2))
                        resultHeatReject.push(heatReject.toFixed(2))
                        resultCOP.push(cop.toFixed(2))
                        resultCurrent.push(compressor.toFixed(1))
                        // resultMassFlow.push(massflow.toFixed(1))
                        // console.log("mass",massflow)
                        if (parseFloat(massflow).toFixed(1) == 0.0) {
                            // result.k_massflow = "N/A"
                            resultMassFlow.push("N/A")
                        }
                        else {
                            // result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                            resultMassFlow.push(massflow.toFixed(1))
                        }
                        s += stepEvap
                    }
                    else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                        resultCooling.push('-')
                        resultPowerInput.push('-')
                        resultCondensing.push('-')
                        resultHeatReject.push('-')
                        resultCOP.push('-')
                        resultCurrent.push('-')
                        resultMassFlow.push('-')
                        s += stepEvap
                    }
                }
                else if (selectUnit == "2222") {
                    if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                        resultCooling.push((parseFloat(coolingCap) * 3.412).toFixed(2))
                        resultPowerInput.push((parseFloat(totalPowerInput) * 3.412).toFixed(2))
                        resultCondensing.push((parseFloat(d) * (9 / 5) + 32).toFixed(2))
                        resultHeatReject.push((parseFloat(heatReject) * 3.412).toFixed(2))
                        resultCOP.push((parseFloat(cop) * 3.412).toFixed(2))
                        resultCurrent.push(compressor.toFixed(1))
                        // resultMassFlow.push((parseFloat(massflow) / 7.93664144).toFixed(1))
                        // console.log("mass",massflow)
                        if (parseFloat(massflow).toFixed(1) == 0.0) {
                            // result.k_massflow = "N/A"
                            resultMassFlow.push("N/A")
                        }
                        else {
                            // result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                            resultMassFlow.push((parseFloat(massflow) / 7.93664144).toFixed(1))
                        }
                        s += stepEvap
                    }
                    else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                        resultCooling.push('-')
                        resultPowerInput.push('-')
                        resultCondensing.push('-')
                        resultHeatReject.push('-')
                        resultCOP.push('-')
                        resultCurrent.push('-')
                        resultMassFlow.push('-')
                        s += stepEvap
                    }
                }
            }
            Ta += stepAmbient
        }

        event.reply('cdu-step-change-send', resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow)
    })
})

ipc.on('cdu-graph-point', (event, model, s, Ta, refrigerant, selectUnit) => {
    if (selectUnit == "2222") {
        s = (parseFloat(s) - 32) * (5 / 9)
        Ta = (parseFloat(Ta) - 32) * (5 / 9)
    }
    let result = { "g_condensing": '', "tech_note": '' }
    let plot = knex.from('cdu_data').innerJoin('envelope_limits', 'product_model', 'envelope_model').where('product_model', model).andWhere('product_refrigerant', refrigerant)
    plot.then(function (rows) {
        // console.log(rows[0].tech_note)
        let delT = 0.0
        // result.t_note = rows[0].tech_note
        result.a_model = rows[0].product_model
        result.b_brand = rows[0].product_brand
        result.c_series = rows[0].product_series
        s = parseFloat(s)
        Ta = parseFloat(Ta)
        let k = parseFloat(rows[0].product_k)
        for (test = 0; test < 50; test += 0.01) {
            delT = test.toFixed(2)
            delT = parseFloat(delT)
            let calDelT = [
                (
                    (parseFloat(rows[0].c0)) +
                    (parseFloat(rows[0].c1) * s) +
                    (parseFloat(rows[0].c2) * (Ta + delT)) +
                    (parseFloat(rows[0].c3) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].c4) * s * (Ta + delT)) +
                    (parseFloat(rows[0].c5) * Math.pow(Ta + delT, 2)) +
                    (parseFloat(rows[0].c6) * Math.pow(s, 3)) +
                    (parseFloat(rows[0].c7) * (Ta + delT) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].c8) * s * (Math.pow(Ta + delT, 2))) +
                    (parseFloat(rows[0].c9) * Math.pow(Ta + delT, 3))
                )
                + (
                    (parseFloat(rows[0].p0)) +
                    (parseFloat(rows[0].p1) * s) +
                    (parseFloat(rows[0].p2) * (Ta + delT)) +
                    (parseFloat(rows[0].p3) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].p4) * s * (Ta + delT)) +
                    (parseFloat(rows[0].p5) * Math.pow(Ta + delT, 2)) +
                    (parseFloat(rows[0].p6) * Math.pow(s, 3)) +
                    (parseFloat(rows[0].p7) * (Ta + delT) * Math.pow(s, 2)) +
                    (parseFloat(rows[0].p8) * s * (Math.pow(Ta + delT, 2))) +
                    (parseFloat(rows[0].p9) * Math.pow(Ta + delT, 3))
                )
            ]
            calDelT = parseFloat(calDelT)
            // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
            //     delT = delT.toFixed(1)
            //     break;
            // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
            //     delT = delT.toFixed(1)
            //     break;
            // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
            //     delT = delT.toFixed(1)
            //     break;
            // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
            //     delT = delT.toFixed(2)
            //     break;
            // }
          
            
            if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                delT = delT.toFixed(3)
                break;
            } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                delT = delT.toFixed(2)
                break;
            } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                delT = delT.toFixed(1)
                break;
            }
            
        }
        let d = Ta + parseFloat(delT)
        d = parseFloat(d)

        result.g_condensing = d.toFixed(1)
        result.tech_note = rows[0].tech_note
        event.reply('cdu-graph-point-send', result)
    })
})

ipc.on('cdu-plot-graph', (event, model, refrigerant) => {
    let plot = knex.select('*').distinct().from('envelope_limits').where('envelope_model', model).andWhere('envelope_refrigerant', refrigerant)
    plot.then(function (rows) {
        event.reply('cdu-plot-graph-send', rows)
        // console.log("test",rows)
    })
})


ipc.on('cdu-step-change-default', async (event, model, refrigerant, startAmbient, stepAmbient, startEvap, stepEvap, selectUnit) => {
    if (selectUnit == "2222") {
        startAmbient = (parseFloat(startAmbient) - 32) * (5 / 9)
        startEvap = (parseFloat(startEvap) - 32) * (5 / 9)
    }
    let resultCooling = []
    let resultPowerInput = []
    let resultCondensing = []
    let resultHeatReject = []
    let resultCOP = []
    let resultCurrent = []
    let resultMassFlow = []
    stepAmbient = selectUnit == "1111" ? parseFloat(stepAmbient) : parseFloat(stepAmbient) / 1.8
    stepEvap = selectUnit == "1111" ? parseFloat(stepEvap) : parseFloat(stepEvap) / 1.8
    // let Ta = parseFloat(startAmbient)
    let stepTa = selectUnit == "1111" ? [2, 3, 3, 5] : [10 / 1.8, 10 / 1.8, 10 / 1.8, 10 / 1.8]
    let Ta = selectUnit == "1111" ? 30 : 26.7
    let s = selectUnit == "1111" ? parseFloat(startEvap) : (parseFloat(startEvap) - 32) * (5 / 9)
    // console.log("num",s)

    let plot = []

    let plotQuery = await knex.select('*').distinct().from('envelope_limits').where('envelope_model', model).andWhere('envelope_refrigerant', refrigerant)
    for (const key in plotQuery[0]) {
        if (key == "envelope_model" || key == "envelope_refrigerant" || plotQuery[0][key] == null) {
            continue
        }
        plot.push(plotQuery[0][key])
    }
    plot.push(plot[0])
    plot.push(plot[1])

    let polygon = []
    for (let i = 0; i < plot.length; i++) {
        polygon.push([parseFloat(plot[i]), parseFloat(plot[i + 1])])
        i++
    }
    if (selectUnit == "2222") {
        for (let i = 0; i < plot.length; i++) {
            plot[i] = ((parseFloat(plot[i]) * (9 / 5)) + 32).toFixed(0)
        }
    }

    let model1 = knex.from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
    model1.then(function (rows) {
        for (let i = 0; i < 5; i++) {
            s = parseFloat(startEvap)
            for (let j = 0; j < 8; j++) {
                let delT = 0.0
                s = parseFloat(s)
                Ta = parseFloat(Ta)
                let k = parseFloat(rows[0].product_k)
                for (test = 0; test < 50; test += 0.01) {
                    delT = test.toFixed(2)
                    delT = parseFloat(delT)
                    let calDelT = [
                        (
                            (parseFloat(rows[0].c0)) +
                            (parseFloat(rows[0].c1) * s) +
                            (parseFloat(rows[0].c2) * (Ta + delT)) +
                            (parseFloat(rows[0].c3) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].c4) * s * (Ta + delT)) +
                            (parseFloat(rows[0].c5) * Math.pow(Ta + delT, 2)) +
                            (parseFloat(rows[0].c6) * Math.pow(s, 3)) +
                            (parseFloat(rows[0].c7) * (Ta + delT) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].c8) * s * (Math.pow(Ta + delT, 2))) +
                            (parseFloat(rows[0].c9) * Math.pow(Ta + delT, 3))
                        )
                        + (
                            (parseFloat(rows[0].p0)) +
                            (parseFloat(rows[0].p1) * s) +
                            (parseFloat(rows[0].p2) * (Ta + delT)) +
                            (parseFloat(rows[0].p3) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].p4) * s * (Ta + delT)) +
                            (parseFloat(rows[0].p5) * Math.pow(Ta + delT, 2)) +
                            (parseFloat(rows[0].p6) * Math.pow(s, 3)) +
                            (parseFloat(rows[0].p7) * (Ta + delT) * Math.pow(s, 2)) +
                            (parseFloat(rows[0].p8) * s * (Math.pow(Ta + delT, 2))) +
                            (parseFloat(rows[0].p9) * Math.pow(Ta + delT, 3))
                        )
                    ]
                    calDelT = parseFloat(calDelT)
                    // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
                    //     delT = delT.toFixed(1)
                    //     break;
                    // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
                    //     delT = delT.toFixed(1)
                    //     break;
                    // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
                    //     delT = delT.toFixed(1)
                    //     break;
                    // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
                    //     delT = delT.toFixed(2)
                    //     break;
                    // }
                
                    
                    if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                        delT = delT.toFixed(3)
                        break;
                    } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                        delT = delT.toFixed(2)
                        break;
                    } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                        delT = delT.toFixed(1)
                        break;
                    }
                
                }
                let d = Ta + parseFloat(delT)
                d = parseFloat(d)
                let coolingCap =
                    (
                        (parseFloat(rows[0].c0)) +
                        (parseFloat(rows[0].c1) * s) +
                        (parseFloat(rows[0].c2) * d) +
                        (parseFloat(rows[0].c3) * (s * s)) +
                        (parseFloat(rows[0].c4) * (s) * (d)) +
                        (parseFloat(rows[0].c5) * (d * d)) +
                        (parseFloat(rows[0].c6) * (s * s * s)) +
                        (parseFloat(rows[0].c7) * (d) * (s * s)) +
                        (parseFloat(rows[0].c8) * (s) * (d * d)) +
                        (parseFloat(rows[0].c9) * (d * d * d))
                    )
                let powerInput =
                    (
                        (parseFloat(rows[0].p0)) +
                        (parseFloat(rows[0].p1) * s) +
                        (parseFloat(rows[0].p2) * d) +
                        (parseFloat(rows[0].p3) * (s * s)) +
                        (parseFloat(rows[0].p4) * (s) * (d)) +
                        (parseFloat(rows[0].p5) * (d * d)) +
                        (parseFloat(rows[0].p6) * (s * s * s)) +
                        (parseFloat(rows[0].p7) * (d) * (s * s)) +
                        (parseFloat(rows[0].p8) * (s) * (d * d)) +
                        (parseFloat(rows[0].p9) * (d * d * d))
                    )
                let compressor =
                    (
                        (parseFloat(rows[0].a0)) +
                        (parseFloat(rows[0].a1) * s) +
                        (parseFloat(rows[0].a2) * d) +
                        (parseFloat(rows[0].a3) * (s * s)) +
                        (parseFloat(rows[0].a4) * (s) * (d)) +
                        (parseFloat(rows[0].a5) * (d * d)) +
                        (parseFloat(rows[0].a6) * (s * s * s)) +
                        (parseFloat(rows[0].a7) * (d) * (s * s)) +
                        (parseFloat(rows[0].a8) * (s) * (d * d)) +
                        (parseFloat(rows[0].a9) * (d * d * d))
                    )
                let massflow =
                    (
                        (parseFloat(rows[0].m0)) +
                        (parseFloat(rows[0].m1) * s) +
                        (parseFloat(rows[0].m2) * d) +
                        (parseFloat(rows[0].m3) * (s * s)) +
                        (parseFloat(rows[0].m4) * (s) * (d)) +
                        (parseFloat(rows[0].m5) * (d * d)) +
                        (parseFloat(rows[0].m6) * (s * s * s)) +
                        (parseFloat(rows[0].m7) * (d) * (s * s)) +
                        (parseFloat(rows[0].m8) * (s) * (d * d)) +
                        (parseFloat(rows[0].m9) * (d * d * d))
                    )
                var fanPowerInput
                if (rows[0].tech_total_fan_power == null) {
                    fanPowerInput = 0
                }
                else {
                    fanPowerInput = parseFloat(rows[0].tech_total_fan_power) / 1000
                }

                let totalPowerInput = fanPowerInput + powerInput
                let heatReject = coolingCap + powerInput
                let cop = coolingCap / totalPowerInput

                if (selectUnit == "1111") {
                    // resultCooling.push(coolingCap.toFixed(2))
                    // resultPowerInput.push(totalPowerInput.toFixed(2))
                    // resultCondensing.push(d.toFixed(2))
                    // resultHeatReject.push(heatReject.toFixed(2))
                    // resultCOP.push(cop.toFixed(2))
                    // resultCurrent.push(compressor.toFixed(1))
                    // // resultMassFlow.push(massflow.toFixed(1))
                    // // console.log("mass",massflow)
                    // if (parseFloat(massflow).toFixed(1) == 0.0) {
                    //     // result.k_massflow = "N/A"
                    //     resultMassFlow.push("N/A")
                    // }
                    // else {
                    //     // result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                    //     resultMassFlow.push(massflow.toFixed(1))
                    // }
                    // s += stepEvap
                    if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                        resultCooling.push(coolingCap.toFixed(2))
                        resultPowerInput.push(totalPowerInput.toFixed(2))
                        resultCondensing.push(d.toFixed(2))
                        resultHeatReject.push(heatReject.toFixed(2))
                        resultCOP.push(cop.toFixed(2))
                        resultCurrent.push(compressor.toFixed(1))
                        // resultMassFlow.push(massflow.toFixed(1))
                        // console.log("mass",massflow)
                        if (parseFloat(massflow).toFixed(1) == 0.0) {
                            // result.k_massflow = "N/A"
                            resultMassFlow.push("N/A")
                        }
                        else {
                            // result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                            resultMassFlow.push(massflow.toFixed(1))
                        }
                        s += stepEvap
                    }
                    else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                        resultCooling.push('-')
                        resultPowerInput.push('-')
                        resultCondensing.push('-')
                        resultHeatReject.push('-')
                        resultCOP.push('-')
                        resultCurrent.push('-')
                        resultMassFlow.push('-')
                        s += stepEvap
                    }
                }
                else if (selectUnit == "2222") {
                    // resultCooling.push((parseFloat(coolingCap) * 3.412).toFixed(2))
                    // resultPowerInput.push((parseFloat(totalPowerInput) * 3.412).toFixed(2))
                    // resultCondensing.push((parseFloat(d) * (9 / 5) + 32).toFixed(2))
                    // resultHeatReject.push((parseFloat(heatReject) * 3.412).toFixed(2))
                    // resultCOP.push((parseFloat(cop) * 3.412).toFixed(2))
                    // resultCurrent.push(compressor.toFixed(1))
                    // // resultMassFlow.push((parseFloat(massflow) / 7.93664144).toFixed(1))
                    // // console.log("mass",massflow)
                    // if (parseFloat(massflow).toFixed(1) == 0.0) {
                    //     // result.k_massflow = "N/A"
                    //     resultMassFlow.push("N/A")
                    // }
                    // else {
                    //     // result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                    //     resultMassFlow.push((parseFloat(massflow) / 7.93664144).toFixed(1))
                    // }
                    // s += stepEvap
                    if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                        resultCooling.push((parseFloat(coolingCap) * 3.412).toFixed(2))
                        resultPowerInput.push((parseFloat(totalPowerInput) * 3.412).toFixed(2))
                        resultCondensing.push((parseFloat(d) * (9 / 5) + 32).toFixed(2))
                        resultHeatReject.push((parseFloat(heatReject) * 3.412).toFixed(2))
                        resultCOP.push((parseFloat(cop) * 3.412).toFixed(2))
                        resultCurrent.push(compressor.toFixed(1))
                        // resultMassFlow.push((parseFloat(massflow) / 7.93664144).toFixed(1))
                        // console.log("mass",massflow)
                        if (parseFloat(massflow).toFixed(1) == 0.0) {
                            // result.k_massflow = "N/A"
                            resultMassFlow.push("N/A")
                        }
                        else {
                            // result.k_massflow = (parseFloat(massflow) / 7.93664144).toFixed(1) + " Ibs/h"
                            resultMassFlow.push((parseFloat(massflow) / 7.93664144).toFixed(1))
                        }
                        s += stepEvap
                    }
                    else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                        resultCooling.push('-')
                        resultPowerInput.push('-')
                        resultCondensing.push('-')
                        resultHeatReject.push('-')
                        resultCOP.push('-')
                        resultCurrent.push('-')
                        resultMassFlow.push('-')
                        s += stepEvap
                    }
                }
            }
            Ta += stepTa[i]
        }
        event.reply('cdu-step-change-send-default', resultCooling, resultPowerInput, resultCondensing, resultHeatReject, resultCOP, resultCurrent, resultMassFlow)
    })
})



//--------------------------------------------------------------------Evaporator Page----------------------------------------------------------------------------
ipc.on('evap-loaded-refrigerant', (event) => {
    let refrigerant = knex.select('evap_refrigerant').distinct().from('evap_data')
    refrigerant.then(function (rows) {
        event.sender.send('evap-refrigerant-dropdown', rows)
    })
})
ipc.on('evap-loaded', (event, radioAppMed, radioAppLow, refrigerant) => {
    if (radioAppMed) {
        if (refrigerant == "") {
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_med_temp', '1')
            brand.then(function (rows) {
                event.sender.send('evap-brand-dropdown', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_med_temp', '1')
            voltage.then(function (rows) {
                event.sender.send('evap-voltage-dropdown', rows)
            })
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_med_temp', '1')
            series.then(function (rows) {
                event.sender.send('evap-series-dropdown', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_med_temp', '1')
            model.then(function (rows) {
                event.sender.send('evap-model-dropdown', rows)
            })
        }
        else {
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('evap-brand-dropdown', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-voltage-dropdown', rows)
            })
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-series-dropdown', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-model-dropdown', rows)
            })
        }
    }
    else if (radioAppLow) {
        if (refrigerant == "") {
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_low_temp', '1')
            brand.then(function (rows) {
                event.sender.send('evap-brand-dropdown', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_low_temp', '1')
            voltage.then(function (rows) {
                event.sender.send('evap-voltage-dropdown', rows)
            })
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_low_temp', '1')
            series.then(function (rows) {
                event.sender.send('evap-series-dropdown', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_low_temp', '1')
            model.then(function (rows) {
                event.sender.send('evap-model-dropdown', rows)
            })
        }
        else {
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('evap-brand-dropdown', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-voltage-dropdown', rows)
            })
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-series-dropdown', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-model-dropdown', rows)
            })
        }

    }
})
// -----------------------------------Refrigerant Select---------------------------------------
ipc.on('evap-refrigerant-select', (event, data, radioAppMed, radioAppLow) => {
    if (radioAppMed) {
        let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        brand.then(function (rows) {
            event.sender.send('evap-refrigerant-evapBrand', rows)
        })
        let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        voltage.then(function (rows) {
            event.sender.send('evap-refrigerant-evapVoltage', rows)
        })
        let series = knex.select('evap_series').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        series.then(function (rows) {
            event.sender.send('evap-refrigerant-evapSeries', rows)
        })
        let model = knex.select('evap_model').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_med_temp', '1')
        model.then(function (rows) {
            event.sender.send('evap-refrigerant-model', rows)
        })
    } else if (radioAppLow) {
        let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        brand.then(function (rows) {
            event.sender.send('evap-refrigerant-evapBrand', rows)
        })
        let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        voltage.then(function (rows) {
            event.sender.send('evap-refrigerant-evapVoltage', rows)
        })
        let series = knex.select('evap_series').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        series.then(function (rows) {
            event.sender.send('evap-refrigerant-evapSeries', rows)
        })
        let model = knex.select('evap_model').distinct().from('evap_data').where('evap_refrigerant', data).andWhere('evap_low_temp', '1')
        model.then(function (rows) {
            event.sender.send('evap-refrigerant-model', rows)
        })
    }
})
// -----------------------------------Brand Select---------------------------------------
ipc.on('evap-brand-select', (event, data, radioAppMed, radioAppLow, refrigerant) => {
    if (data == "") {
        if (radioAppMed) {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-brand-evapSeries', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-brand-evapVoltage', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-brand-evapModel', rows)
            })
        } else if (radioAppLow) {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-brand-evapSeries', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-brand-evapVoltage', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-brand-evapModel', rows)
            })
        }
    }
    else {
        if (radioAppMed) {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_brand', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-brand-evapSeries', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_brand', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-brand-evapVoltage', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_brand', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-brand-evapModel', rows)
            })
        } else if (radioAppLow) {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_brand', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-brand-evapSeries', rows)
            })
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_brand', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-brand-evapVoltage', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_brand', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-brand-evapModel', rows)
            })
        }
    }
})
// -----------------------------------Type Select---------------------------------------
ipc.on('evap-voltage-select', (event, data, radioAppMed, radioAppLow, refrigerant, selectBrand) => {
    if (data == "") {
        if (radioAppMed) {
            if (selectBrand != "") {
                let series = knex.select('evap_series').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                series.then(function (rows) {
                    event.sender.send('evap-voltage-evapSeries', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                brand.then(function (rows) {
                    event.sender.send('evap-voltage-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                model.then(function (rows) {
                    event.sender.send('evap-voltage-evapModel', rows)
                })
            }
            else {
                let series = knex.select('evap_series').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
                series.then(function (rows) {
                    event.sender.send('evap-voltage-evapSeries', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
                brand.then(function (rows) {
                    event.sender.send('evap-voltage-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
                model.then(function (rows) {
                    event.sender.send('evap-voltage-evapModel', rows)
                })
            }
        } else if (radioAppLow) {
            if (selectBrand != "") {
                let series = knex.select('evap_series').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                series.then(function (rows) {
                    event.sender.send('evap-voltage-evapSeries', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                brand.then(function (rows) {
                    event.sender.send('evap-voltage-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                model.then(function (rows) {
                    event.sender.send('evap-voltage-evapModel', rows)
                })
            }
            else {
                let series = knex.select('evap_series').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
                series.then(function (rows) {
                    event.sender.send('evap-voltage-evapSeries', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
                brand.then(function (rows) {
                    event.sender.send('evap-voltage-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
                model.then(function (rows) {
                    event.sender.send('evap-voltage-evapModel', rows)
                })
            }
        }
    }
    if (radioAppMed) {
        if (selectBrand != "") {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
            series.then(function (rows) {
                event.sender.send('evap-voltage-evapSeries', rows)
            })
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
            brand.then(function (rows) {
                event.sender.send('evap-voltage-evapBrand', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
            model.then(function (rows) {
                event.sender.send('evap-voltage-evapModel', rows)
            })
        }
        else {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-voltage-evapSeries', rows)
            })
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('evap-voltage-evapBrand', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-voltage-evapModel', rows)
            })
        }
    } else if (radioAppLow) {
        if (selectBrand || selectBrand != "") {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
            series.then(function (rows) {
                event.sender.send('evap-voltage-evapSeries', rows)
            })
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
            brand.then(function (rows) {
                event.sender.send('evap-voltage-evapBrand', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
            model.then(function (rows) {
                event.sender.send('evap-voltage-evapModel', rows)
            })
        }
        else {
            let series = knex.select('evap_series').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            series.then(function (rows) {
                event.sender.send('evap-voltage-evapSeries', rows)
            })
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('evap-voltage-evapBrand', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_voltage', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-voltage-evapModel', rows)
            })
        }
    }
})
// -----------------------------------Series Select---------------------------------------
ipc.on('evap-series-select', (event, data, radioAppMed, radioAppLow, refrigerant, selectBrand, selectVoltage) => {
    if (radioAppMed) {
        if (selectBrand || selectBrand != "") {
            if (selectVoltage || selectVoltage != "") {
                let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand).andWhere('evap_voltage', selectVoltage)
                voltage.then(function (rows) {
                    event.sender.send('evap-series-evapVoltage', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand).andWhere('evap_voltage', selectVoltage)
                brand.then(function (rows) {
                    event.sender.send('evap-series-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand).andWhere('evap_voltage', selectVoltage)
                model.then(function (rows) {
                    event.sender.send('evap-series-evapModel', rows)
                })
            }
            else {
                let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                voltage.then(function (rows) {
                    event.sender.send('evap-series-evapVoltage', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                brand.then(function (rows) {
                    event.sender.send('evap-series-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                model.then(function (rows) {
                    event.sender.send('evap-series-evapModel', rows)
                })
            }
        }
        else {
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-series-evapVoltage', rows)
            })
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('evap-series-evapBrand', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_series', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-series-evapModel', rows)
            })
        }
    } else if (radioAppLow) {
        if (selectBrand || selectBrand != "") {
            if (selectVoltage || selectVoltage != "") {
                let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand).andWhere('evap_voltage', selectVoltage)
                voltage.then(function (rows) {
                    event.sender.send('evap-series-evapVoltage', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand).andWhere('evap_voltage', selectVoltage)
                brand.then(function (rows) {
                    event.sender.send('evap-series-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand).andWhere('evap_voltage', selectVoltage)
                model.then(function (rows) {
                    event.sender.send('evap-series-evapModel', rows)
                })
            }
            else {
                let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                voltage.then(function (rows) {
                    event.sender.send('evap-series-evapVoltage', rows)
                })
                let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                brand.then(function (rows) {
                    event.sender.send('evap-series-evapBrand', rows)
                })
                let model = knex.select('evap_model').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant).andWhere('evap_brand', selectBrand)
                model.then(function (rows) {
                    event.sender.send('evap-series-evapModel', rows)
                })
            }
        }
        else {
            let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            voltage.then(function (rows) {
                event.sender.send('evap-series-evapVoltage', rows)
            })
            let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            brand.then(function (rows) {
                event.sender.send('evap-series-evapBrand', rows)
            })
            let model = knex.select('evap_model').distinct().from('evap_data').where('evap_series', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
            model.then(function (rows) {
                event.sender.send('evap-series-evapModel', rows)
            })
        }
    }
})
// -----------------------------------Evap Model Select---------------------------------------
// ipc.on('evap-model-select', (event, data, radioAppMed, radioAppLow, refrigerant) => {
//     if (radioAppMed) {
//         // console.log("aaaaa", data)
//         let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_model', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
//         voltage.then(function (rows) {
//             event.sender.send('evap-model-evapVoltage', rows)
//         })
//         let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_model', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
//         brand.then(function (rows) {
//             event.sender.send('evap-model-evapBrand', rows)
//         })
//         let series = knex.select('evap_series').distinct().from('evap_data').where('evap_model', data).andWhere('evap_med_temp', '1').andWhere('evap_refrigerant', refrigerant)
//         series.then(function (rows) {
//             event.sender.send('evap-model-evapSeries', rows)
//         })
//     } else if (radioAppLow) {
//         let voltage = knex.select('evap_voltage').distinct().from('evap_data').where('evap_model', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
//         voltage.then(function (rows) {
//             event.sender.send('evap-model-evapVoltage', rows)
//         })
//         let brand = knex.select('evap_brand').distinct().from('evap_data').where('evap_model', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
//         brand.then(function (rows) {
//             event.sender.send('evap-model-evapBrand', rows)
//         })
//         let series = knex.select('evap_series').distinct().from('evap_data').where('evap_model', data).andWhere('evap_low_temp', '1').andWhere('evap_refrigerant', refrigerant)
//         series.then(function (rows) {
//             event.sender.send('evap-model-evapSeries', rows)
//         })
//     }
// })




ipc.on('evap-step-change-default', (event, model, refrigerant, startRoom, stepRoom, startEvap, stepEvap) => {
    let resultCooling = []
    stepRoom = parseFloat(stepRoom)
    stepEvap = parseFloat(stepEvap)
    // let Ta = parseFloat(startAmbient)
    let stepTa = [2, 3, 3, 5]
    let Ta = 30
    let s = parseFloat(startEvap)
    // console.log("num",s)
    let model1 = knex.from('evap_data').where('evap_model', model).andWhere('evap_refrigerant', refrigerant)
    model1.then(function (rows) {
        for (let i = 0; i < 5; i++) {
            s = parseFloat(startEvap)
            for (let j = 0; j < 8; j++) {
                let KTDe = 0.0
                let FactorET = 0.0
                var Cap_KTDe = 0.0
                KTDe = Ta - s
                if (rows[0].evap_med_temp == "1") {
                    Cap_KTDe = rows[0].evap_cap_for_med_temp
                } else {
                    if (s >= -15 && s <= 20) {
                        Cap_KTDe = rows[0].evap_cap_for_med_temp
                    } else {
                        Cap_KTDe = rows[0].evap_cap_for_low_temp
                    }
                }
                //-------------------------- Med Temp Tabale----------------------------------
                if (s == -15) {
                    FactorET = 0.93
                } else if (s == -10) {
                    FactorET = 0.94
                } else if (s == -5) {
                    FactorET = 0.99
                } else if (s == 0) {
                    FactorET = 1.07
                } else if (s == 5) {
                    FactorET = 1.17
                } else if (s == 10) {
                    FactorET = 1.17
                } else if (s == 15) {
                    FactorET = 1.17
                } else if (s == 20) {
                    FactorET = 1.17
                } else if (s < -10 && s > -15) {
                    FactorET = 0.93 - ((Math.abs(s) - 10) * 0.012)
                } else if (s < -5 && s > -10) {
                    FactorET = 0.99 - ((Math.abs(s) - 5) * 0.012)
                } else if (s < 0 && s > -5) {
                    FactorET = 1.07 - ((Math.abs(s)) * 0.016)
                } else if (s > 0 && s < 5) {
                    FactorET = 1.07 + (s * 0.02)
                } else if (s > 5 && s < 10) {
                    FactorET = 1.17 + ((s - 5) * 0.02)
                } else if (s > 10 && s < 15) {
                    FactorET = 1.17 + ((s - 10) * 0.02)
                } else if (s > 15 && s < 20) {
                    FactorET = 1.17 + ((s - 15) * 0.02)
                }

                //-------------------------- Low Temp Tabale----------------------------------
                if (s == -16) {
                    FactorET = 1.068
                } else if (s == -20) {
                    FactorET = 1.06
                } else if (s == -25) {
                    FactorET = 0.99
                } else if (s == -30) {
                    FactorET = 0.89
                } else if (s == -35) {
                    FactorET = 0.8
                } else if (s == -40) {
                    FactorET = 0.71
                } else if (s < -16 && s > -20) {
                    FactorET = 1.068 - ((Math.abs(s) - 16) * 0.002)
                } else if (s < -25) {
                    FactorET = 1.06 - ((Math.abs(s) - 20) * 0.014)
                } else if (s < -30) {
                    FactorET = 0.99 - ((Math.abs(s) - 25) * 0.02)
                } else if (s < -35) {
                    FactorET = 0.89 - ((Math.abs(s) - 30) * 0.018)
                } else if (s < -40) {
                    FactorET = 0.8 - ((Math.abs(s) - 35) * 0.018)
                }


                let coolingCap = Cap_KTDe * KTDe * FactorET;
                resultCooling.push(coolingCap.toFixed(2))

                s += stepEvap
            }
            Ta += stepTa[i]
        }
        event.reply('evap-step-change-send-default', resultCooling)
    })
})

ipc.on('evap-step-change', (event, model, refrigerant, startRoom, stepRoom, startEvap, stepEvap) => {
    let resultCooling = []

    stepRoom = parseFloat(stepRoom)
    stepEvap = parseFloat(stepEvap)
    let Ta = parseFloat(startRoom)
    let s = parseFloat(startEvap)
    let model1 = knex.from('evap_data').where('evap_model', model).andWhere('evap_refrigerant', refrigerant)
    model1.then(function (rows) {
        for (let i = 0; i < 5; i++) {
            s = parseFloat(startEvap)
            for (let j = 0; j < 8; j++) {

                let KTDe = 0.0
                let FactorET = 0.0
                var Cap_KTDe = 0.0
                KTDe = Ta - s
                if (rows[0].evap_med_temp == "1") {
                    Cap_KTDe = rows[0].evap_cap_for_med_temp
                } else {
                    if (s >= -15 && s <= 20) {
                        Cap_KTDe = rows[0].evap_cap_for_med_temp
                    } else {
                        Cap_KTDe = rows[0].evap_cap_for_low_temp
                    }
                }
                //-------------------------- Med Temp Tabale----------------------------------
                if (s == -15) {
                    FactorET = 0.93
                } else if (s == -10) {
                    FactorET = 0.94
                } else if (s == -5) {
                    FactorET = 0.99
                } else if (s == 0) {
                    FactorET = 1.07
                } else if (s == 5) {
                    FactorET = 1.17
                } else if (s == 10) {
                    FactorET = 1.17
                } else if (s == 15) {
                    FactorET = 1.17
                } else if (s == 20) {
                    FactorET = 1.17
                } else if (s < -10 && s > -15) {
                    FactorET = 0.93 - ((Math.abs(s) - 10) * 0.012)
                } else if (s < -5 && s > -10) {
                    FactorET = 0.99 - ((Math.abs(s) - 5) * 0.012)
                } else if (s < 0 && s > -5) {
                    FactorET = 1.07 - ((Math.abs(s)) * 0.016)
                } else if (s > 0 && s < 5) {
                    FactorET = 1.07 + (s * 0.02)
                } else if (s > 5 && s < 10) {
                    FactorET = 1.17 + ((s - 5) * 0.02)
                } else if (s > 10 && s < 15) {
                    FactorET = 1.17 + ((s - 10) * 0.02)
                } else if (s > 15 && s < 20) {
                    FactorET = 1.17 + ((s - 15) * 0.02)
                }

                //-------------------------- Low Temp Tabale----------------------------------
                if (s == -16) {
                    FactorET = 1.068
                } else if (s == -20) {
                    FactorET = 1.06
                } else if (s == -25) {
                    FactorET = 0.99
                } else if (s == -30) {
                    FactorET = 0.89
                } else if (s == -35) {
                    FactorET = 0.8
                } else if (s == -40) {
                    FactorET = 0.71
                } else if (s < -16 && s > -20) {
                    FactorET = 1.068 - ((Math.abs(s) - 16) * 0.002)
                } else if (s < -25) {
                    FactorET = 1.06 - ((Math.abs(s) - 20) * 0.014)
                } else if (s < -30) {
                    FactorET = 0.99 - ((Math.abs(s) - 25) * 0.02)
                } else if (s < -35) {
                    FactorET = 0.89 - ((Math.abs(s) - 30) * 0.018)
                } else if (s < -40) {
                    FactorET = 0.8 - ((Math.abs(s) - 35) * 0.018)
                }

                let coolingCap = Cap_KTDe * KTDe * FactorET;
                resultCooling.push(coolingCap.toFixed(2))
                s += stepEvap
            }
            Ta += stepRoom
        }
        event.reply('evap-step-change-send', resultCooling)
    })
})

ipc.on('evap-cal-click-model', (event, model, refrigerant, evapTemp, roomTemp, selectUnit) => {
    if (selectUnit == "2222") {
        evapTemp = ((parseFloat(evapTemp) - 32) * (5 / 9)).toFixed(0)
        roomTemp = ((parseFloat(roomTemp) - 32) * (5 / 9)).toFixed(0)
    }
    let result = { "a_model": '', "b_brand": '', "c_series": '', "d_coolingStep": '', "e_cooling": '', "f_designTD": '' }
    let model1 = knex.from('evap_data').where('evap_model', model).andWhere('evap_refrigerant', refrigerant)
    model1.then(function (rows) {
        evapTemp = parseFloat(evapTemp)
        roomTemp = parseFloat(roomTemp)
        result.a_model = rows[0].evap_model
        result.b_brand = rows[0].evap_brand
        result.c_series = rows[0].evap_series
        let KTDe = 0.0
        let FactorET = 0.0
        var Cap_KTDe = 0.0
        KTDe = roomTemp - evapTemp
        if (rows[0].evap_med_temp == "1") {
            if (rows[0].evap_low_temp == "1") {
                if (evapTemp >= -15 && evapTemp <= 20) {
                    Cap_KTDe = rows[0].evap_cap_for_med_temp
                } else {
                    Cap_KTDe = rows[0].evap_cap_for_low_temp
                }
            } else {
                Cap_KTDe = rows[0].evap_cap_for_med_temp
            }
        } else {
            Cap_KTDe = rows[0].evap_cap_for_low_temp
        }
        //-------------------------- Med Temp Tabale----------------------------------
        if (evapTemp == -15) {
            FactorET = 0.93
        } else if (evapTemp == -10) {
            FactorET = 0.94
        } else if (evapTemp == -5) {
            FactorET = 0.99
        } else if (evapTemp == -4) {
            FactorET = 1
        } else if (evapTemp == 0) {
            FactorET = 1.07
        } else if (evapTemp < -10 && evapTemp > -15) {
            FactorET = 0.93 + ((15 - (Math.abs(evapTemp))) * 0.002)
        } else if (evapTemp < -5 && evapTemp > -10) {
            FactorET = 0.94 + ((10 - (Math.abs(evapTemp))) * 0.01)
        } else if (evapTemp < 0 && evapTemp > -4) {
            FactorET = 1 + ((4 - (Math.abs(evapTemp))) * 0.0175)
        } else if (evapTemp > 0 && evapTemp < 5) {
            FactorET = 1.07 + (evapTemp * 0.02)
        } else if (evapTemp >= 5 && evapTemp <= 20) {
            FactorET = 1.17
        }

        //-------------------------- Low Temp Tabale----------------------------------
        else if (evapTemp == -16) {
            FactorET = 1.068
        } else if (evapTemp == -20) {
            FactorET = 1.06
        } else if (evapTemp == -24) {
            FactorET = 1
        } else if (evapTemp == -25) {
            FactorET = 0.99
        } else if (evapTemp == -30) {
            FactorET = 0.89
        } else if (evapTemp == -35) {
            FactorET = 0.8
        } else if (evapTemp == -40) {
            FactorET = 0.71
        } else if (evapTemp < -16 && evapTemp > -20) {
            FactorET = 1.068 - ((Math.abs(evapTemp) - 16) * 0.002)
        } else if (evapTemp > -25) {
            FactorET = 1.06 - ((Math.abs(evapTemp) - 20) * 0.015)
        } else if (evapTemp > -30) {
            FactorET = 0.99 - ((Math.abs(evapTemp) - 25) * 0.02)
        } else if (evapTemp > -35) {
            FactorET = 0.89 - ((Math.abs(evapTemp) - 30) * 0.018)
        } else if (evapTemp > -40) {
            FactorET = 0.8 - ((Math.abs(evapTemp) - 35) * 0.018)
        }

        // console.log("FAC",FactorET)
        let coolingCap = Cap_KTDe * KTDe * FactorET;
        // console.log("cooling=", coolingCap, "Cap_KTDe=", Cap_KTDe, "KTDe=", KTDe, "FactorET=", FactorET,"Evap=", evapTemp)

        if (selectUnit == "1111") {
            result.d_coolingStep = "100 %"
            result.e_cooling = coolingCap.toFixed(2) + " kW"
            result.f_designTD = roomTemp - evapTemp + " K"
        }

        else if (selectUnit == "2222") {
            result.d_coolingStep = "100 %"
            result.e_cooling = (parseFloat(coolingCap) * 3.412).toFixed(2) + " kBTU/h"
            result.f_designTD = ((roomTemp - evapTemp) * 1.8).toFixed(0) + " K"
        }

        event.reply('evap-cal-send-model', result)
    })
})
ipc.on('evap-data-change', (event, model, refrigerant) => {
    let evap = knex.select('*').distinct().from('evap_data').where('evap_model', model).andWhere('evap_refrigerant', refrigerant)
    evap.then(function (rows) {
        event.reply('evap-data-change-send', rows)
    })
})




// -----------------------------------Calculate---------------------------------------
ipc.on('evap-cal-click-cooling', async (event, brand, voltage, series, refrigerant, textCooling, evapTemp, roomTemp, radioAppLow, radioAppMed, textAcceptableMins, textAcceptablePlus, checkAccept, selectUnit) => {
    if (selectUnit == "2222") {
        textCooling = parseFloat(textCooling) / 3.412
        evapTemp = ((parseFloat(evapTemp) - 32) * (5 / 9)).toFixed(0)
        roomTemp = ((parseFloat(roomTemp) - 32) * (5 / 9)).toFixed(0)
    }

    if (radioAppLow) {
        let resultArray = []
        let calArray = []
        let model
        if (brand == "" && voltage == "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        else if (brand != "" && voltage == "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        else if (brand == "" && voltage != "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_voltage', voltage).andWhere('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        else if (brand == "" && voltage == "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        else if (brand != "" && voltage != "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_voltage', voltage).andWhere('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        else if (brand != "" && voltage == "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        else if (brand == "" && voltage != "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_voltage', voltage).andWhere('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        else if (brand != "" && voltage != "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_voltage', voltage).andWhere('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_low_temp', '1')
        }
        // console.log("rows",rows)
        for (let i = 0; i < model.length; i++) {
            let resultObject = { "a_model": '', "b_brand": '', "c_series": '', "d_coolingStep": '', "e_cooling": '', "f_designTD": '' }
            let calObject = { "model": '', "brand": '', "series": '', "coolingStep": '', "cooling": '', "designTD": '' }
            resultArray.push(resultObject)
            calArray.push(calObject)
            evapTemp = parseInt(evapTemp)
            roomTemp = parseFloat(roomTemp)
            textCooling = parseFloat(textCooling)
            let KTDe = 0.0
            let FactorET = 0.0
            var Cap_KTDe = 0.0
            KTDe = roomTemp - evapTemp
            if (model[i].evap_med_temp == "1") {
                if (model[i].evap_low_temp == "1") {
                    if (evapTemp >= -15 && evapTemp <= 20) {
                        Cap_KTDe = model[i].evap_cap_for_med_temp
                        // console.log("meddd")
                    } else {
                        Cap_KTDe = model[i].evap_cap_for_low_temp
                        // console.log("lowww")
                    }
                } else {
                    Cap_KTDe = model[i].evap_cap_for_med_temp
                }
            } else {
                Cap_KTDe = model[i].evap_cap_for_low_temp
            }
            //-------------------------- Med Temp Tabale----------------------------------
            if (evapTemp == -15) {
                FactorET = 0.93
            } else if (evapTemp == -10) {
                FactorET = 0.94
            } else if (evapTemp == -5) {
                FactorET = 0.99
            } else if (evapTemp == -4) {
                FactorET = 1
            } else if (evapTemp == 0) {
                FactorET = 1.07
            } else if (evapTemp < -10 && evapTemp > -15) {
                FactorET = 0.93 + ((15 - (Math.abs(evapTemp))) * 0.002)
            } else if (evapTemp < -5 && evapTemp > -10) {
                FactorET = 0.94 + ((10 - (Math.abs(evapTemp))) * 0.01)
            } else if (evapTemp < 0 && evapTemp > -4) {
                FactorET = 1 + ((4 - (Math.abs(evapTemp))) * 0.0175)
            } else if (evapTemp > 0 && evapTemp < 5) {
                FactorET = 1.07 + (evapTemp * 0.02)
            } else if (evapTemp >= 5 && evapTemp <= 20) {
                FactorET = 1.17
            }

            //-------------------------- Low Temp Tabale----------------------------------
            else if (evapTemp == -16) {
                FactorET = 1.068
            } else if (evapTemp == -20) {
                FactorET = 1.06
            } else if (evapTemp == -24) {
                FactorET = 1
            } else if (evapTemp == -25) {
                FactorET = 0.99
            } else if (evapTemp == -30) {
                FactorET = 0.89
            } else if (evapTemp == -35) {
                FactorET = 0.8
            } else if (evapTemp == -40) {
                FactorET = 0.71
            } else if (evapTemp < -16 && evapTemp > -20) {
                FactorET = 1.068 - ((Math.abs(evapTemp) - 16) * 0.002)
            } else if (evapTemp > -25) {
                FactorET = 1.06 - ((Math.abs(evapTemp) - 20) * 0.015)
            } else if (evapTemp > -30) {
                FactorET = 0.99 - ((Math.abs(evapTemp) - 25) * 0.02)
            } else if (evapTemp > -35) {
                FactorET = 0.89 - ((Math.abs(evapTemp) - 30) * 0.018)
            } else if (evapTemp > -40) {
                FactorET = 0.8 - ((Math.abs(evapTemp) - 35) * 0.018)
            }


            let coolingCap = Cap_KTDe * KTDe * FactorET;

            calArray[i].model = model[i].evap_model
            calArray[i].brand = model[i].evap_brand
            calArray[i].series = model[i].evap_series
            calArray[i].coolingStep = ((coolingCap.toFixed(1) / textCooling) * 100).toFixed(0)
            calArray[i].cooling = coolingCap.toFixed(2)
            calArray[i].designTD = roomTemp - evapTemp
            if (coolingCap > textCooling) {
                calArray[i].priority = coolingCap - textCooling
            }
            else {
                calArray[i].priority = textCooling - coolingCap
            }
        }
        // -------------------------------------------Put Data in ResultArray-------------------------------------------
        calArray.sort((a, b) => {
            const A = parseFloat(a.priority)
            const B = parseFloat(b.priority)

            let comparison = 0;
            if (A > B) {
                comparison = 1;
            } else if (A < B) {
                comparison = -1;
            }
            return comparison
        });

        if (checkAccept) {
            let minAcceptable = 100 - parseInt(textAcceptableMins)
            let maxAcceptable = 100 + parseInt(textAcceptablePlus)
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                // console.log("%5 = ",calArray[i].coolingStep);
                if (calArray[i].coolingStep >= minAcceptable && calArray[i].coolingStep <= maxAcceptable) {
                    if (selectUnit == "1111") {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = calArray[i].cooling + " kW"
                        resultArray[j].f_designTD = calArray[i].designTD + " K"
                    }
                    else if (selectUnit == "2222") {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].f_designTD = (calArray[i].designTD * 1.8).toFixed(0) + " K"
                    }
                } else {
                    j = j - 1
                    continue;
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            event.reply('evap-cal-send-cooling', resultArray)

        } else {
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                // console.log("%6 = ",calArray[i].coolingStep);
                if (selectUnit == "1111") {
                    resultArray[j].a_model = calArray[i].model
                    resultArray[j].b_brand = calArray[i].brand
                    resultArray[j].c_series = calArray[i].series
                    resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                    resultArray[j].e_cooling = calArray[i].cooling + " kW"
                    resultArray[j].f_designTD = calArray[i].designTD + " K"
                }
                else if (selectUnit == "2222") {
                    resultArray[j].a_model = calArray[i].model
                    resultArray[j].b_brand = calArray[i].brand
                    resultArray[j].c_series = calArray[i].series
                    resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                    resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                    resultArray[j].f_designTD = (calArray[i].designTD * 1.8).toFixed(0) + " K"
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            event.reply('evap-cal-send-cooling', resultArray)
        }

    } else if (radioAppMed) {
        let resultArray = []
        let calArray = []
        let model
        if (brand == "" && voltage == "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        else if (brand != "" && voltage == "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        else if (brand == "" && voltage != "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_voltage', voltage).andWhere('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        else if (brand == "" && voltage == "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        else if (brand != "" && voltage != "" && series == "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_voltage', voltage).andWhere('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        else if (brand != "" && voltage == "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        else if (brand == "" && voltage != "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_voltage', voltage).andWhere('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        else if (brand != "" && voltage != "" && series != "") {
            model = await knex.select('*').distinct().from('evap_data').where('evap_brand', brand).andWhere('evap_voltage', voltage).andWhere('evap_series', series).andWhere('evap_refrigerant', refrigerant).andWhere('evap_med_temp', '1')
        }
        // console.log("modellll", model)
        for (let i = 0; i < model.length; i++) {
            let resultObject = { "a_model": '', "b_brand": '', "c_series": '', "d_coolingStep": '', "e_cooling": '' }
            let calObject = { "model": '', "brand": '', "series": '', "coolingStep": '', "cooling": '' }
            resultArray.push(resultObject)
            calArray.push(calObject)
            evapTemp = parseInt(evapTemp)
            roomTemp = parseFloat(roomTemp)
            textCooling = parseFloat(textCooling)
            let KTDe = 0.0
            let FactorET = 0.0
            var Cap_KTDe = 0.0
            KTDe = roomTemp - evapTemp
            if (model[i].evap_med_temp == "1") {
                if (model[i].evap_low_temp == "1") {
                    if (evapTemp >= -15 && evapTemp <= 20) {
                        Cap_KTDe = model[i].evap_cap_for_med_temp
                        // console.log("meddd")
                    } else {
                        Cap_KTDe = model[i].evap_cap_for_low_temp
                        // console.log("lowww")
                    }
                } else {
                    Cap_KTDe = model[i].evap_cap_for_med_temp
                }
            } else {
                Cap_KTDe = model[i].evap_cap_for_low_temp
            }
            //-------------------------- Med Temp Tabale----------------------------------
            if (evapTemp == -15) {
                FactorET = 0.93
            } else if (evapTemp == -10) {
                FactorET = 0.94
            } else if (evapTemp == -5) {
                FactorET = 0.99
            } else if (evapTemp == -4) {
                FactorET = 1
            } else if (evapTemp == 0) {
                FactorET = 1.07
            } else if (evapTemp < -10 && evapTemp > -15) {
                FactorET = 0.93 + ((15 - (Math.abs(evapTemp))) * 0.002)
            } else if (evapTemp < -5 && evapTemp > -10) {
                FactorET = 0.94 + ((10 - (Math.abs(evapTemp))) * 0.01)
            } else if (evapTemp < 0 && evapTemp > -4) {
                FactorET = 1 + ((4 - (Math.abs(evapTemp))) * 0.0175)
            } else if (evapTemp > 0 && evapTemp < 5) {
                FactorET = 1.07 + (evapTemp * 0.02)
            } else if (evapTemp >= 5 && evapTemp <= 20) {
                FactorET = 1.17
            }

            //-------------------------- Low Temp Tabale----------------------------------
            else if (evapTemp == -16) {
                FactorET = 1.068
            } else if (evapTemp == -20) {
                FactorET = 1.06
            } else if (evapTemp == -24) {
                FactorET = 1
            } else if (evapTemp == -25) {
                FactorET = 0.99
            } else if (evapTemp == -30) {
                FactorET = 0.89
            } else if (evapTemp == -35) {
                FactorET = 0.8
            } else if (evapTemp == -40) {
                FactorET = 0.71
            } else if (evapTemp < -16 && evapTemp > -20) {
                FactorET = 1.068 - ((Math.abs(evapTemp) - 16) * 0.002)
            } else if (evapTemp > -25) {
                FactorET = 1.06 - ((Math.abs(evapTemp) - 20) * 0.015)
            } else if (evapTemp > -30) {
                FactorET = 0.99 - ((Math.abs(evapTemp) - 25) * 0.02)
            } else if (evapTemp > -35) {
                FactorET = 0.89 - ((Math.abs(evapTemp) - 30) * 0.018)
            } else if (evapTemp > -40) {
                FactorET = 0.8 - ((Math.abs(evapTemp) - 35) * 0.018)
            }


            let coolingCap = Cap_KTDe * KTDe * FactorET;

            calArray[i].model = model[i].evap_model
            calArray[i].brand = model[i].evap_brand
            calArray[i].series = model[i].evap_series
            calArray[i].coolingStep = ((coolingCap.toFixed(1) / textCooling) * 100).toFixed(0)
            calArray[i].cooling = coolingCap.toFixed(2)
            calArray[i].designTD = roomTemp - evapTemp
            if (coolingCap > textCooling) {
                calArray[i].priority = coolingCap - textCooling
            }
            else {
                calArray[i].priority = textCooling - coolingCap
            }
        }
        // -------------------------------------------Put Data in ResultArray-------------------------------------------
        calArray.sort((a, b) => {
            const A = parseFloat(a.priority)
            const B = parseFloat(b.priority)

            let comparison = 0;
            if (A > B) {
                comparison = 1;
            } else if (A < B) {
                comparison = -1;
            }
            return comparison
        });

        if (checkAccept) {
            // console.log("yoyo")
            let minAcceptable = 100 - parseInt(textAcceptableMins)
            // console.log("Mins", minAcceptable)
            let maxAcceptable = 100 + parseInt(textAcceptablePlus)
            // console.log("Mins", maxAcceptable)
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                // console.log("%7 = ",calArray[i].coolingStep);
                if (calArray[i].coolingStep >= minAcceptable && calArray[i].coolingStep <= maxAcceptable) {
                    if (selectUnit == "1111") {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = calArray[i].cooling + " kW"
                        resultArray[j].f_designTD = calArray[i].designTD + " K"
                    }
                    else if (selectUnit == "2222") {
                        resultArray[j].a_model = calArray[i].model
                        resultArray[j].b_brand = calArray[i].brand
                        resultArray[j].c_series = calArray[i].series
                        resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                        resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                        resultArray[j].f_designTD = (calArray[i].designTD * 1.8).toFixed(0) + " K"
                    }
                } else {
                    j = j - 1
                    continue;
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            event.reply('evap-cal-send-cooling', resultArray)

        } else {
            for (i = 0, j = 0; i < calArray.length; i++, j++) {
                // console.log("%8 = ",calArray[i].coolingStep);
                if (selectUnit == "1111") {
                    resultArray[j].a_model = calArray[i].model
                    resultArray[j].b_brand = calArray[i].brand
                    resultArray[j].c_series = calArray[i].series
                    resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                    resultArray[j].e_cooling = calArray[i].cooling + " kW"
                    resultArray[j].f_designTD = calArray[i].designTD + " K"
                }
                else if (selectUnit == "2222") {
                    resultArray[j].a_model = calArray[i].model
                    resultArray[j].b_brand = calArray[i].brand
                    resultArray[j].c_series = calArray[i].series
                    resultArray[j].d_coolingStep = calArray[i].coolingStep + " %"
                    resultArray[j].e_cooling = (parseFloat(calArray[i].cooling) * 3.412).toFixed(2) + " kBTU/h"
                    resultArray[j].f_designTD = (calArray[i].designTD * 1.8).toFixed(0) + " K"
                }
            }
            resultArray = resultArray.slice(0, 5)
            resultArray.sort((a, b) => {
                const A = parseFloat(a.d_coolingStep)
                const B = parseFloat(b.d_coolingStep)

                let comparison = 0;
                if (A > B) {
                    comparison = 1;
                } else if (A < B) {
                    comparison = -1;
                }
                return comparison
            });
            resultArray.push({ 'a_model': '' })
            event.reply('evap-cal-send-cooling', resultArray)
        }

    }

})

// -----------------------------------Calculate---------------------------------------


ipc.on('cdu-step-table-datasheet', async (event, model, refrigerant, radioAppLow, radioAppMed, selectUnit) => {
    if (radioAppLow) {
        let typeCooled = await knex.select('product_type_cooled').from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
        let resultCooling = []
        let resultPowerInput = []
        let stepTa
        let Ta
        let s
        if (typeCooled[0].product_type_cooled == "Air cooled") {
            stepTa = selectUnit == "1111" ? [6, 5] : [10 / 1.8, 10 / 1.8]
            Ta = selectUnit == "1111" ? 32 : (90 - 32) * (5 / 9)
            s = -40
        }
        else if (typeCooled[0].product_type_cooled == "Water cooled") {
            stepTa = selectUnit == "1111" ? [18, 10] : [30 / 1.8, 20 / 1.8]
            Ta = selectUnit == "1111" ? 7 : (45 - 32) * (5 / 9)
            s = -40
        }
        let plot = []

        let plotQuery = await knex.select('*').distinct().from('envelope_limits').where('envelope_model', model).andWhere('envelope_refrigerant', refrigerant)
        for (const key in plotQuery[0]) {
            if (key == "envelope_model" || key == "envelope_refrigerant" || plotQuery[0][key] == null) {
                continue
            }
            plot.push(plotQuery[0][key])
        }
        plot.push(plot[0])
        plot.push(plot[1])

        let polygon = []
        for (let i = 0; i < plot.length; i++) {
            polygon.push([parseFloat(plot[i]), parseFloat(plot[i + 1])])
            i++
        }
        if (selectUnit == "2222") {
            for (let i = 0; i < plot.length; i++) {
                plot[i] = ((parseFloat(plot[i]) * (9 / 5)) + 32).toFixed(0)
            }
        }

        let model1 = knex.from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
        model1.then(function (rows) {
            for (let i = 0; i < 3; i++) {
                s = -40
                for (let j = 1; j < 8; j++) {
                    let delT = 0.0
                    let k = parseFloat(rows[0].product_k)
                    for (test = 0; test < 50; test += 0.01) {
                        delT = test.toFixed(2)
                        delT = parseFloat(delT)
                        let calDelT = [
                            (
                                (parseFloat(rows[0].c0)) +
                                (parseFloat(rows[0].c1) * s) +
                                (parseFloat(rows[0].c2) * (Ta + delT)) +
                                (parseFloat(rows[0].c3) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].c4) * s * (Ta + delT)) +
                                (parseFloat(rows[0].c5) * Math.pow(Ta + delT, 2)) +
                                (parseFloat(rows[0].c6) * Math.pow(s, 3)) +
                                (parseFloat(rows[0].c7) * (Ta + delT) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].c8) * s * (Math.pow(Ta + delT, 2))) +
                                (parseFloat(rows[0].c9) * Math.pow(Ta + delT, 3))
                            )
                            + (
                                (parseFloat(rows[0].p0)) +
                                (parseFloat(rows[0].p1) * s) +
                                (parseFloat(rows[0].p2) * (Ta + delT)) +
                                (parseFloat(rows[0].p3) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].p4) * s * (Ta + delT)) +
                                (parseFloat(rows[0].p5) * Math.pow(Ta + delT, 2)) +
                                (parseFloat(rows[0].p6) * Math.pow(s, 3)) +
                                (parseFloat(rows[0].p7) * (Ta + delT) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].p8) * s * (Math.pow(Ta + delT, 2))) +
                                (parseFloat(rows[0].p9) * Math.pow(Ta + delT, 3))
                            )
                        ]
                        calDelT = parseFloat(calDelT)
                        // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
                        //     delT = delT.toFixed(1)
                        //     break;
                        // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
                        //     delT = delT.toFixed(1)
                        //     break;
                        // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
                        //     delT = delT.toFixed(1)
                        //     break;
                        // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
                        //     delT = delT.toFixed(2)
                        //     break;
                        // }
                    
                        
                        if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                            delT = delT.toFixed(3)
                            break;
                        } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                            delT = delT.toFixed(2)
                            break;
                        } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                            delT = delT.toFixed(1)
                            break;
                        }

                    }
                    let d = Ta + parseFloat(delT)
                    d = parseFloat(d)
                    let coolingCap =
                        (
                            (parseFloat(rows[0].c0)) +
                            (parseFloat(rows[0].c1) * s) +
                            (parseFloat(rows[0].c2) * d) +
                            (parseFloat(rows[0].c3) * (s * s)) +
                            (parseFloat(rows[0].c4) * (s) * (d)) +
                            (parseFloat(rows[0].c5) * (d * d)) +
                            (parseFloat(rows[0].c6) * (s * s * s)) +
                            (parseFloat(rows[0].c7) * (d) * (s * s)) +
                            (parseFloat(rows[0].c8) * (s) * (d * d)) +
                            (parseFloat(rows[0].c9) * (d * d * d))
                        )
                    let powerInput =
                        (
                            (parseFloat(rows[0].p0)) +
                            (parseFloat(rows[0].p1) * s) +
                            (parseFloat(rows[0].p2) * d) +
                            (parseFloat(rows[0].p3) * (s * s)) +
                            (parseFloat(rows[0].p4) * (s) * (d)) +
                            (parseFloat(rows[0].p5) * (d * d)) +
                            (parseFloat(rows[0].p6) * (s * s * s)) +
                            (parseFloat(rows[0].p7) * (d) * (s * s)) +
                            (parseFloat(rows[0].p8) * (s) * (d * d)) +
                            (parseFloat(rows[0].p9) * (d * d * d))
                        )
                    var fanPowerInput
                    if (rows[0].tech_total_fan_power == null) {
                        fanPowerInput = 0
                    }
                    else {
                        fanPowerInput = parseFloat(rows[0].tech_total_fan_power) / 1000
                    }
                    let totalPowerInput = fanPowerInput + powerInput


                    if (selectUnit == "1111") {
                        if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                            resultCooling.push(coolingCap.toFixed(2))
                            resultPowerInput.push(totalPowerInput.toFixed(2))
                            s += 5
                        }
                        else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                            resultCooling.push('-')
                            resultPowerInput.push('-')
                            s += 5
                        }
                    }
                    else if (selectUnit == "2222") {
                        if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                            resultCooling.push((parseFloat(coolingCap) * 3.412).toFixed(2))
                            resultPowerInput.push((parseFloat(totalPowerInput) * 3.412).toFixed(2))
                            s += 5 / 1.8
                        }
                        else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                            resultCooling.push('-')
                            resultPowerInput.push('-')
                            s += 5 / 1.8
                        }
                    }
                    // s += 5
                }
                // console.log(Ta)
                Ta += stepTa[i]

            }
            // console.log(resultCooling)
            event.reply('cdu-step-table-datasheet-send', resultCooling, resultPowerInput, typeCooled[0].product_type_cooled)
        })
    } else if (radioAppMed) {
        let typeCooled = await knex.select('product_type_cooled').from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
        let resultCooling = []
        let resultPowerInput = []
        let stepTa
        let Ta
        let s
        if (typeCooled[0].product_type_cooled == "Air cooled") {
            stepTa = selectUnit == "1111" ? [6, 5] : [10 / 1.8, 10 / 1.8]
            s = selectUnit == "1111" ? -20 : (-10 - 32) * (5 / 9)
            Ta = selectUnit == "1111" ? 32 : (90 - 32) * (5 / 9)
        }
        else if (typeCooled[0].product_type_cooled == "Water cooled") {
            stepTa = selectUnit == "1111" ? [18, 10] : [30 / 1.8, 20 / 1.8]
            s = selectUnit == "1111" ? -20 : (-10 - 32) * (5 / 9)
            Ta = selectUnit == "1111" ? 7 : (45 - 32) * (5 / 9)
        }
        let plot = []

        let plotQuery = await knex.select('*').distinct().from('envelope_limits').where('envelope_model', model).andWhere('envelope_refrigerant', refrigerant)
        for (const key in plotQuery[0]) {
            if (key == "envelope_model" || key == "envelope_refrigerant" || plotQuery[0][key] == null) {
                continue
            }
            plot.push(plotQuery[0][key])
        }
        plot.push(plot[0])
        plot.push(plot[1])

        let polygon = []
        for (let i = 0; i < plot.length; i++) {
            polygon.push([parseFloat(plot[i]), parseFloat(plot[i + 1])])
            i++
        }
        if (selectUnit == "2222") {
            for (let i = 0; i < plot.length; i++) {
                plot[i] = ((parseFloat(plot[i]) * (9 / 5)) + 32).toFixed(0)
            }
        }
        let model1 = knex.from('cdu_data').where('product_model', model).andWhere('product_refrigerant', refrigerant)
        model1.then(function (rows) {
            for (let i = 0; i < 3; i++) {
                s = selectUnit == "1111" ? -20 : (-10 - 32) * (5 / 9)
                for (let j = 1; j < 8; j++) {
                    let delT = 0.0
                    let k = parseFloat(rows[0].product_k)
                    for (test = 0; test < 50; test += 0.01) {
                        delT = test.toFixed(2)
                        delT = parseFloat(delT)
                        let calDelT = [
                            (
                                (parseFloat(rows[0].c0)) +
                                (parseFloat(rows[0].c1) * s) +
                                (parseFloat(rows[0].c2) * (Ta + delT)) +
                                (parseFloat(rows[0].c3) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].c4) * s * (Ta + delT)) +
                                (parseFloat(rows[0].c5) * Math.pow(Ta + delT, 2)) +
                                (parseFloat(rows[0].c6) * Math.pow(s, 3)) +
                                (parseFloat(rows[0].c7) * (Ta + delT) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].c8) * s * (Math.pow(Ta + delT, 2))) +
                                (parseFloat(rows[0].c9) * Math.pow(Ta + delT, 3))
                            )
                            + (
                                (parseFloat(rows[0].p0)) +
                                (parseFloat(rows[0].p1) * s) +
                                (parseFloat(rows[0].p2) * (Ta + delT)) +
                                (parseFloat(rows[0].p3) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].p4) * s * (Ta + delT)) +
                                (parseFloat(rows[0].p5) * Math.pow(Ta + delT, 2)) +
                                (parseFloat(rows[0].p6) * Math.pow(s, 3)) +
                                (parseFloat(rows[0].p7) * (Ta + delT) * Math.pow(s, 2)) +
                                (parseFloat(rows[0].p8) * s * (Math.pow(Ta + delT, 2))) +
                                (parseFloat(rows[0].p9) * Math.pow(Ta + delT, 3))
                            )
                        ]
                        calDelT = parseFloat(calDelT)
                        // if (calDelT.toFixed(1) == ((k.toFixed(3) * delT).toFixed(1))) {
                        //     delT = delT.toFixed(1)
                        //     break;
                        // } else if (calDelT.toFixed(1) == ((k.toFixed(2) * delT).toFixed(1))) {
                        //     delT = delT.toFixed(1)
                        //     break;
                        // } else if (calDelT.toFixed(1) == ((k.toFixed(1) * delT).toFixed(1))) {
                        //     delT = delT.toFixed(1)
                        //     break;
                        // } else if (calDelT.toFixed(2) == ((k.toFixed(1) * delT).toFixed(2))) {
                        //     delT = delT.toFixed(2)
                        //     break;
                        // }
                     
                        
                        if (calDelT.toFixed(3) == ((k * delT).toFixed(3))) {
                            delT = delT.toFixed(3)
                            break;
                        } else if (calDelT.toFixed(2) == ((k * delT).toFixed(2))) {
                            delT = delT.toFixed(2)
                            break;
                        } else if (calDelT.toFixed(1) == ((k * delT).toFixed(1))) {
                            delT = delT.toFixed(1)
                            break;
                        }

                    }
                    let d = Ta + parseFloat(delT)
                    d = parseFloat(d)
                    let coolingCap =
                        (
                            (parseFloat(rows[0].c0)) +
                            (parseFloat(rows[0].c1) * s) +
                            (parseFloat(rows[0].c2) * d) +
                            (parseFloat(rows[0].c3) * (s * s)) +
                            (parseFloat(rows[0].c4) * (s) * (d)) +
                            (parseFloat(rows[0].c5) * (d * d)) +
                            (parseFloat(rows[0].c6) * (s * s * s)) +
                            (parseFloat(rows[0].c7) * (d) * (s * s)) +
                            (parseFloat(rows[0].c8) * (s) * (d * d)) +
                            (parseFloat(rows[0].c9) * (d * d * d))
                        )
                    let powerInput =
                        (
                            (parseFloat(rows[0].p0)) +
                            (parseFloat(rows[0].p1) * s) +
                            (parseFloat(rows[0].p2) * d) +
                            (parseFloat(rows[0].p3) * (s * s)) +
                            (parseFloat(rows[0].p4) * (s) * (d)) +
                            (parseFloat(rows[0].p5) * (d * d)) +
                            (parseFloat(rows[0].p6) * (s * s * s)) +
                            (parseFloat(rows[0].p7) * (d) * (s * s)) +
                            (parseFloat(rows[0].p8) * (s) * (d * d)) +
                            (parseFloat(rows[0].p9) * (d * d * d))
                        )
                    var fanPowerInput
                    if (rows[0].tech_total_fan_power == null) {
                        fanPowerInput = 0
                    }
                    else {
                        fanPowerInput = parseFloat(rows[0].tech_total_fan_power) / 1000
                    }
                    let totalPowerInput = fanPowerInput + powerInput


                    if (selectUnit == "1111") {
                        if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                            resultCooling.push(coolingCap.toFixed(2))
                            resultPowerInput.push(totalPowerInput.toFixed(2))
                            s += 5
                        }
                        else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                            resultCooling.push('-')
                            resultPowerInput.push('-')
                            s += 5
                        }
                    }
                    else if (selectUnit == "2222") {
                        if (inside([parseFloat(s), parseFloat(d)], polygon) == true) {
                            resultCooling.push((parseFloat(coolingCap) * 3.412).toFixed(2))
                            resultPowerInput.push((parseFloat(totalPowerInput) * 3.412).toFixed(2))
                            s += 5 / 1.8
                        }
                        else if (inside([parseFloat(s), parseFloat(d)], polygon) == false) {
                            resultCooling.push('-')
                            resultPowerInput.push('-')
                            s += 5 / 1.8
                        }
                    }
                }
                // console.log(Ta)
                Ta += stepTa[i]

            }
            // console.log("tttt",resultCooling,"xxxx",resultPowerInput)
            event.reply('cdu-step-table-datasheet-send', resultCooling, resultPowerInput, typeCooled[0].product_type_cooled)
        })
    }
})

function inside(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
