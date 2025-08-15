
window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Enable Select2
    $('.js-example-basic-single').select2();

    // Table Row Colors
    active = "#72b3c0";
    update = "#f09456";
    select = "#b2b2b2";

    getRequests();
    setEventListeners();

    // Refresh View & Form
    loadView();
    loadForm();
}

//Time Global Constants
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;


//Set Attributes to Initial on Table Load
function loadView() {

    // Table Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    //loadTable (page,size,search)
    loadTable(1, cmbPageSize.value, query);
}

//Load Table & Fill Data
function loadTable(page, size, query, color=null) {
    page = page - 1;

    cdReservations = new Array(); //reservation list
    var data = httpRequest("/cd_reservation/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) cdReservations = data.content; //json

    createPagination('pagination', data.totalPages, data.number + 1, paginate); //json

    //fillTable(table_id, data_list, fill(), delete(), view())
    fillTable('tblCDReservation', cdReservations, fillForm, btnDeleteMC, viewitem); //fill the table with customer list
    clearSelection(tblCDReservation); //clear any selected row

    if(color !=null){
        if (activerowno != "") selectRow(tblCDReservation, activerowno, color); //select row if any & color
    }else{
        if (activerowno != "") selectRow(tblCDReservation, activerowno, active); //select row if any & color
    }

}

function paginate(page) {
    var paginate;
    if (oldCDReservation == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = ""
        loadForm();
        loadSearchedTable();
    }

}

//View Row Details (Print)
function viewitem(ctm, rowno) {}

//Print Row
function btnPrintRowMC() {}

//Load Initial Form
function loadForm() {

    customer = new Object();
    oldCustomer = null;

    cdReservation = new Object();
    oldCDReservation = null; //for comparison on update

    //Bind next number
    var cdreservationObj =  httpRequest("../cd_reservation/next_cdreservation_code", "GET");
    txtCdrResvCode.innerHTML = cdreservationObj.cd_reservation_code;

    datetimeExptPickUp.setAttribute("min", getCurrentDateTime('datetime'));
    datetimeExptPickUp.setAttribute("max", setMaxDate(false, 7));

    datetimeExptReturn.setAttribute("min", getCurrentDateTime('datetime'));
    datetimeExptReturn.setAttribute("max", setMaxDate(false, 7));

    fillCombo(cmbPkCategory, "Nothing selected", packageCategories, "name", "");
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
    fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
    fillTable('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    console.log(`vehicleModels ${vehicleModels}`);
    fillCombo5(cmbVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(txtPlate, "Nothing Selected", vehicles, "license_plate", "")

    fillCombo(cmbCustomerTypeNew, "Select Customer Type", customerTypes, "name", "");
    fillCombo7(cmbCustomer, "Select Customer", individualCustomers, "first_name", "last_name", "nic", "");
    cmbCustomer.disabled = true;
    $(cmbCustomer).siblings().children().children('.select2-selection--single').css('cursor', 'not-allowed');

    cdReservation.reservation_status_id = reservationStatses[1];
    setReservationStatus('new');

    cdReservation.employee_id = session.getObject('activeuser').employeeId;
    cdReservation.added_date_time = getCurrentDateTime('datetime');
    cdReservation.payment_status_id = payment_statuses[0]; // set payment status to Not-Paid

    setStyle(initialF);
    disableButtons(false, true, true);
}

//Change Color of Attributes
function setStyle(style) {
    style(datetimeExptPickUp);
    style(txtPickUpLocation);
    style(datetimeExptReturn);
    style(txtDropOffLocation);
}

//Disable Buttons by privilege and status
function disableButtons(add, upd, del) {

    if (add || !privileges.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !privileges.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privileges.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privileges.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in cdReservations) {
        if (cdReservations[index].reservation_status_id.name == "Deleted") {
            tblCDReservation.children[1].children[index].style.color = "#f03e3e"; //change row color
            tblCDReservation.children[1].children[index].style.cursor = "not-allowed";
            tblCDReservation.children[1].children[index].lastChild.children[2].disabled = true; //disable delete btn // Table Body->Row->Last Column->Delete Button
            tblCDReservation.children[1].children[index].lastChild.children[2].style.cursor = "not-allowed"; //cursor not allowed
        }
    }

}

//Get Errors of Required Fields
function getErrors() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    // check errors by the bound item property value
    if (datetimeExptPickUp.value == "") {
        invalidF(datetimeExptPickUp);
        errors = errors + "\n" + "Pick Up Date & Time Not Entered.";
    } else addvalue = 1;

    if (txtPickUpLocation.value == "") {
        invalidF(txtPickUpLocation);
        errors = errors + "\n" + "Pick Up Location Not Entered.";
    } else addvalue = 1;

    if (txtDropOffLocation.value == "") {
        invalidF(txtDropOffLocation);
        errors = errors + "\n" + "Drop Off Location Not Entered.";
    } else addvalue = 1;

    if (cdReservation.package_id == null) {
        errors = errors + "\n" + "Package Not Selected.";

    } else addvalue = 1;

    if (cdReservation.vehicle_id == null) {
        errors = errors + "\n" + "Vehicle Not Selected.";

    } else addvalue = 1;

    if (cdReservation.driver_id == null) {
        errors = errors + "\n" + "Driver Not Selected.";

    } else addvalue = 1;

    if (cdReservation.customer_id == null) {
        errors = errors + "\n" + "Customer Not Selected.";
    } else addvalue = 1;

    if (cdReservation.reservation_status_id == null) {
        errors = errors + "\n" + "Reservation Status Not Selected.";

    } else addvalue = 1;

    changeTab2();

    return errors;
}

//Button Add - Get confirmation on optional empty fields
function btnAddMC() {

    if (getErrors() == "") {
        savedata();

    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });
    }
}

//Get Confirmation & Add
function savedata() {

    //set fields before save
    cdReservation.cd_reservation_code = txtCdrResvCode.textContent;

    //Check whether customer is individual or company
    var customer_name;
    if (cdReservation.customer_id.customer_type_id.name == "Individual") {
        customer_name = cdReservation.customer_id.first_name + " " + cdReservation.customer_id.last_name;
    } else {
        customer_name = cdReservation.customer_id.company_name;
    }

    // If no ongoing reservation for the selected vehicle, vehicle status set to reserved(2)
    let onGoingReservation = new Array(httpRequest("../sd_reservation/on_going_list_by_vehicle?vehicle_id=" + cdReservation.vehicle_id.id,  "GET"),
                                             httpRequest("../cd_reservation/on_going_list_by_vehicle?vehicle_id=" + cdReservation.vehicle_id.id,  "GET"));
    if(onGoingReservation[0] == '' && onGoingReservation[1] == ''){
        cdReservation.vehicle_id.vehicle_status_id.id = 2;
    }


    swal({
        title: "Are you sure to add following Reservation...?",
        text: "\nReservatino Code: " + cdReservation.cd_reservation_code +
            "\nPick Up Date & Time: " + sqlDateTimeToLocal(cdReservation.expect_pick_up_datetime)[0] + " " + sqlDateTimeToLocal(cdReservation.expect_pick_up_datetime)[1] +
            "\nPick Up Location : " + cdReservation.pick_up_location +
            "\nReturn Date & Time : " + sqlDateTimeToLocal(cdReservation.expect_return_datetime)[0] + " " + sqlDateTimeToLocal(cdReservation.expect_return_datetime)[1] +
            "\nDrop Off Location : " + cdReservation.drop_off_location +
            "\nPackage : " + cdReservation.package_id.package_name +
            "\nVehicle : " + cdReservation.vehicle_id.model_id.brand_id.name + " " + cdReservation.vehicle_id.model_id.name +
            "\nDriver : " + cdReservation.driver_id.calling_name +
            "\nCustomer : " + customer_name +
            "\nReservation Status : " + cdReservation.reservation_status_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((save) => { //then: if user click 'Yes' then
        if (save) {
            var response = JSON.parse(httpRequest("/cd_reservation", "POST", cdReservation));
            if (response.reservation === "0") { //message 0: means successful
                // Set response text for sms & email
                let displayResponseText= "";
                displayResponseText += (response.sms === "0") ? "SMS sent succesfully!\n" : response.sms + "\n";
                displayResponseText += (response.email === "0") ? "Email sent succesfully!" : response.email;

                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Saved Successfully..!',
                    text: displayResponseText,
                    button: false,
                    timer: 3000
                });
                activepage = 1;
                activerowno = 1; //1: highlight added row which is 1 row
                loadSearchedTable();
                loadForm();
                $('#addReservationModal').modal('hide');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response.reservation,
                button: true
            });
        }
    });
}

//Fill Form - Get confirmation on second time update
function fillForm(cdr, rowno) {
    activerowno = rowno;

    if (oldCDReservation == null) { //check if previous attempt to update (value assign to oldCustomer only when fill_data() called.)
        filldata(cdr);
    } else {
        swal({
            title: "Previous attempt to update the form has not submitted... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: ["Cancel", "Discard"], dangerMode: true,
        }).then((yesUpdate) => {
            if (yesUpdate) {
                filldata(cdr);
            }
        });
    }
}

//Fill Data on Update
function filldata(cdr) {
    clearSelection(tblCDReservation);
    selectRow(tblCDReservation, activerowno, active); //color row

    cdReservation = JSON.parse(JSON.stringify(cdr));// parse to prevent referring to same object & data is in table row format
    oldCDReservation = JSON.parse(JSON.stringify(cdr));

    updateTimeAndLocationTab();
    updatePackageTab();
    updateVehicleTab();
    updateDriverTab();
    updateCustomerTab();
    updateConfirmTab();

    disableButtons(true, false, false);
    setStyle(validF);
    if (txtPickUpCharge.value != "") validF(txtPickUpCharge);
    if (txtStopLocation1.value != "") validF(txtStopLocation1);
    if (txtStopLocation2.value != "") validF(txtStopLocation2);
    if (txtStopLocation3.value != "") validF(txtStopLocation3);
    if (txtReservationNotes.value != "") validF(txtReservationNotes);

    $('#addReservationModal').modal('show');
}

//Check for Updated Values
function getUpdates() {

    var updates = "";

    if (cdReservation != null && oldCDReservation != null) {

        if (cdReservation.expect_pick_up_datetime != oldCDReservation.expect_pick_up_datetime)
            updates = updates + "\nPick Up Date is Changed: " + oldCDReservation.expect_pick_up_datetime + " --> " + cdReservation.expect_pick_up_datetime;

        if (cdReservation.pick_up_location != oldCDReservation.pick_up_location)
            updates = updates + "\nPick Up Location is Changed: " + oldCDReservation.pick_up_location + " --> " + cdReservation.pick_up_location;

        if (cdReservation.pick_up_charge != oldCDReservation.pick_up_charge)
            updates = updates + "\nPick Up Charge is Changed: " + oldCDReservation.pick_up_charge + " --> " + cdReservation.pick_up_charge;

        if (cdReservation.expect_return_datetime != oldCDReservation.expect_return_datetime)
            updates = updates + "\nReturn Date is Changed: " + oldCDReservation.expect_return_datetime + " --> " + cdReservation.expect_return_datetime;

        if (cdReservation.drop_off_location != oldCDReservation.drop_off_location)
            updates = updates + "\nDrop Off Location is Changed: " + oldCDReservation.drop_off_location + " --> " + cdReservation.drop_off_location;

        if (cdReservation.stop_location_1 != oldCDReservation.stop_location_1)
            updates = updates + "\nStop Location 1 is Changed: " + oldCDReservation.stop_location_1 + " --> " + cdReservation.stop_location_1;

        if (cdReservation.stop_location_2 != oldCDReservation.stop_location_2)
            updates = updates + "\nStop Location 2 is Changed: " + oldCDReservation.stop_location_2 + " --> " + cdReservation.stop_location_2;

        if (cdReservation.stop_location_3 != oldCDReservation.stop_location_3)
            updates = updates + "\nStop Location 3 is Changed: " + oldCDReservation.stop_location_3 + " --> " + cdReservation.stop_location_3;

        if (cdReservation.package_id.id != oldCDReservation.package_id.id)
            updates = updates + "\nPackage is Changed: " + oldCDReservation.package_id.package_name + " --> " + cdReservation.package_id.package_name;

        if (cdReservation.vehicle_id.id != oldCDReservation.vehicle_id.id)
            updates = updates + "\nVehicle is Changed: " + oldCDReservation.vehicle_id.vehicle_name + " [" + oldCDReservation.vehicle_id.license_plate + "]" +" --> " + cdReservation.vehicle_id.vehicle_name + " [" + cdReservation.vehicle_id.license_plate + "]";

        if (cdReservation.driver_id.id != oldCDReservation.driver_id.id)
            updates = updates + "\nDriver is Changed: " + oldCDReservation.driver_id.calling_name + " --> " + cdReservation.driver_id.calling_name;

        if (cdReservation.customer_id.id != oldCDReservation.customer_id.id) {
            if (cdReservation.customer_id.customer_type_id.name == "Individual" && oldCDReservation.customer_id.customer_type_id.name == "Individual") {
                updates = updates + "\nCustomer is Changed: " + oldCDReservation.customer_id.first_name + " " + cdReservation.customer_id.last_name + " --> " + cdReservation.customer_id.first_name + " " + cdReservation.customer_id.last_name;
            } else if (cdReservation.customer_id.customer_type_id.name == "Individual" && oldCDReservation.customer_id.customer_type_id.name == "Company") {
                updates = updates + "\nCustomer is Changed: " + oldCDReservation.customer_id.first_name + " " + cdReservation.customer_id.last_name + " --> " + cdReservation.customer_id.company_name;
            } else if (cdReservation.customer_id.customer_type_id.name == "Company" && oldCDReservation.customer_id.customer_type_id.name == "Individual") {
                updates = updates + "\nCustomer is Changed: " + oldCDReservation.customer_id.company_name + " --> " + cdReservation.customer_id.first_name + " " + cdReservation.customer_id.last_name;
            } else if (cdReservation.customer_id.customer_type_id.name == "Company" && oldCDReservation.customer_id.customer_type_id.name == "Company") {
                updates = updates + "\nCustomer is Changed: " + oldCDReservation.customer_id.company_name + " --> " + cdReservation.customer_id.company_name;
            }
        }

        if (cdReservation.rental_amount != oldCDReservation.rental_amount)
            updates = updates + "\nRental Amount is Changed: " + oldCDReservation.rental_amount + " --> " + cdReservation.rental_amount;

        if (cdReservation.reservation_status_id.id != oldCDReservation.reservation_status_id.id)
            updates = updates + "\nReservation Status is Changed: " + oldCDReservation.reservation_status_id.name + " --> " + cdReservation.reservation_status_id.name;

        return updates;

    }
}

//Get confirmation & Update
function btnUpdateMC() {

    if (getErrors() == "") {
        if (getUpdates() == "") {
            swal({
                title: 'Nothing to update..', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        } else {
            swal({
                title: "Are you sure to update following package details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: ["Cancel", "Update"], dangerMode: true,
            })
                .then((yesUpdate) => {
                    if (yesUpdate) {
                        var response =httpRequest("/cd_reservation", "PUT", cdReservation);
                        if (response == "0") { //message 0: means successful
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Updated Successfully!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadSearchedTable(update);
                            $('#addReservationModal').modal('hide');
                            loadForm();

                        } else swal({
                            title: 'Failed to update...', icon: "error",
                            text: 'You have following error ' + response,
                            button: true
                        });
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(cdr) {
    cdReservation = JSON.parse(JSON.stringify(cdr));

    swal({
        title: "Are you sure to delete following reservation...?",
        text: "\nReservation Number : " + cdReservation.cd_reservation_code,
        icon: "warning", buttons: ["Cancel", "Delete"], closeOnClickOutside: false, dangerMode: true,

    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/cd_reservation", "DELETE", cdReservation);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\nStatus change to delete",
                    icon: "success", button: false, timer: 2000,
                });
                loadSearchedTable();
                loadForm();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + responce,
                    icon: "error", button: true,
                });
            }
        }
    });
}

//Set the Query & Pass to LoadTable
function loadSearchedTable(color=null) {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    if(color !=null){
        loadTable(activepage, cmbPageSize.value, query, color); //call loadTable passing the query
    }else{
        loadTable(activepage, cmbPageSize.value, query); //call loadTable passing the query
    }
    //disable delete button
    disableButtons(false, true, true);

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC() {}

function sortTable(cind) {}

function setReservationStatus(reservationStatus){
    switch (reservationStatus){
        case "new":
            fillCombo(cmbReservationStatus, "Select Reservation Status", reservationStatses, "name", reservationStatses[1].name);
            cmbReservationStatus.style.pointerEvents = "none";
            break;

        case "update":
            fillCombo(cmbReservationStatus, "Select Reservation Status", resvStatusForUpdate, "name", oldCDReservation.reservation_status_id.name);
            cmbReservationStatus.style.pointerEvents = "auto";
            break;

        case "onRent":
            fillCombo(cmbReservationStatus, "Select Reservation Status", reservationStatses, "name", reservationStatses[6].name);
            break;

        case "complete":
            fillCombo(cmbReservationStatus, "Select Reservation Status", reservationStatses, "name", reservationStatses[2].name);
            break;
    }
}

function loopRetrievedVehicleList(){
    for (index in vehicles_by_package_pick_return_vmodel) {
        if (vehicles_by_package_pick_return_vmodel[index].id == oldCDReservation.vehicle_id.id) {
            vehicleTblRowNo = index;
            break;
        }
    }
}

function disableElements(reservation_type) {
    // Query Select all input fields and disable them
    let tabContentIds;
    if(reservation_type === 'sd_reservation'){
        tabContentIds = ['timeLocationTabContent','packageTabContent','vehicleTabContent', 'customerTabContent', 'confirmTabContent'];
    }else if(reservation_type === 'cd_reservation'){
         tabContentIds = ['timeLocationTabContent','packageTabContent','vehicleTabContent', 'driverTabContent', 'customerTabContent', 'confirmTabContent'];
    }

    tabContentIds.forEach(function(tabContentId) {
        let tabContent = document.getElementById(tabContentId);
        let elements = tabContent.querySelectorAll("input, textarea, select, button");

        elements.forEach(function(element) {
            element.disabled = true;
        });
    });

    // Disable more elements
    divNewCustomer.style.cursor = "not-allowed";
    lnkNewCustomer.style.pointerEvents = "none";
    openMapBtn.disabled = true;

    btnCtmSave.style.cursor = "not-allowed";
    btnUpdate.style.cursor = "not-allowed";

    // Clear X
    btnXPkCategory.style.display = "none";
    btnXPkgVModel.style.display = "none";
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";
}


function sqlDateTimeToLocal(sqlDateTime){
    var sqlDateTimeSplit = sqlDateTime.split("T");
    var localDateTime = [];
    localDateTime[0] = sqlDateTimeSplit[0];

    var t = sqlDateTime.split(/[-T:]/);
    var sqlDateTimeUTC = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4]));   // Apply each element to the Date function
    localDateTime[1] = sqlDateTimeUTC.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

    return localDateTime; // return an array
}


// Set Field Date
function setFieldDate(time) {
    var newDate = new Date(time);

    var month = newDate.getMonth() + 1; //+1: date gives an array (0-11)
    if (month < 10) month = "0" + month; //add '0' : months requires 2digits

    var date = newDate.getDate();
    if (date < 10) date = "0" + date; // add '0' : date requires 2digits

    var hours = newDate.getHours(); //[1-24]
    if (hours < 10) hours = "0" + hours;

    var minutes = newDate.getMinutes(); //[1-60]
    if (minutes < 10) minutes = "0" + minutes;

    var finalDate = newDate.getFullYear() + "-" + month + "-" + date + "T" + hours + ":" + minutes;
    return finalDate;
}

// Set Max Date
function setMaxDate(fromPick = false, numOfTime) {
    if (fromPick == false) {
        var currentDateTime = new Date(getCurrentDateTime('datetime'));
        var max = currentDateTime.getTime() + (day * numOfTime);
        var maxDateTime = new Date(max);
    } else {

        var pickDateTime = new Date(datetimeExptPickUp.value);
        var max = pickDateTime.getTime() + (day * numOfTime);
        var maxDateTime = new Date(max);
    }

    var year = maxDateTime.getFullYear();
    var month = maxDateTime.getMonth() + 1; //+1: date gives an array (0-11)
    if (month < 10) month = "0" + month // // add '0' : date requires 2digits
    var date = maxDateTime.getDate();
    if (date < 10) date = "0" + date; // add '0' : date requires 2digits

    var hours = maxDateTime.getHours(); //[1-24]
    if (hours < 10) hours = "0" + hours;
    var minutes = maxDateTime.getMinutes(); //[1-60]
    if (minutes < 10) minutes = "0" + minutes;

    var maxDateTime = year + "-" + month + "-" + date + "T" + hours + ":" + minutes;
    return maxDateTime;
}

// Clear Filter
function clearFilter(combo, btnX, functCall = null) {
    if (functCall != null) {
        functCall();
    }

    document.getElementById(combo).selectedIndex = "0";
    // $('#' + combo).val('').change(); //for select2
    initialF('#' + combo);

    document.getElementById(btnX).style.display = "none";

}

//Show X (btnClearFilter)
function showX(combo, btnX) {
    if (document.getElementById(combo).selectedIndex != 0) {
        document.getElementById(btnX).style.display = "flex";
    }
}

//Clear Table Selection
function clearSelection(tableid) {
    var rows = tableid.children[1].children;
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.background = '';
        // $(rows[i]).children().children().prop('checked', false)
    }
}

function getRequests(){
    //Request Privileges
    privileges = httpRequest("../privilege?module=CDRESERVATION", "GET");

    //Request Lists for Combo box
    vehicles = httpRequest("../vehicle/list", "GET");
    vehicleTypes = httpRequest("../vehicle_type/list", "GET");
    vehicleModels = httpRequest("../vehicle_model/list", "GET");

    packages = httpRequest("../package/cdr_list", "GET");
    packageKilometers = httpRequest("../package/kilometer_list", "GET");
    packageCategories = httpRequest("../package_category/list", "GET");
    packageDurations = httpRequest("../package_duration/cdr_list", "GET");

    customerTypes = httpRequest("../customer_type/list", "GET");
    individualCustomers = httpRequest("../customer/list_individual", "GET");
    companyCustomers = httpRequest("../customer/list_company", "GET");

    reservationStatses = httpRequest("../reservation_status/list", "GET");
    resvStatusForUpdate = new Array(reservationStatses[1], reservationStatses[3], reservationStatses[4]);

    payment_statuses = httpRequest("../payment_status/list", "GET");
    employees = httpRequest("../employee/list", "GET");
}
function setEventListeners(){
    btnAdd.addEventListener("click", btnAddMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    datetimeExptPickUp.addEventListener("change", datetimeExptPickUpCH);
    datetimeExptReturn.addEventListener("change", datetimeExptReturnCH);
    txtPickUpLocation.addEventListener("keyup", txtPickUpLocationCH);
    chargeDistanceNo.addEventListener("click", chargeDistanceNoCH);
    txtDropOffLocation.addEventListener("keyup", txtDropOffLocationCH);
    radiMStopsNo.addEventListener("click", radiMStopsNoCH);
    btnGetDuration.addEventListener("click", btnGetDurationCH);
    packageTab.addEventListener("click", packageTabCH);
    cmbPkCategory.addEventListener("change", cmbPkCategoryCH);
    cmbPkKm.addEventListener("change", cmbPkKmCH);
    vehicleTab.addEventListener("click", vehicleTabCH);
    driverTab.addEventListener("click", driverTabCH);
    txtDriver.addEventListener("keyup", txtDriverCH);
    cmbCustomerTypeNew.addEventListener("change", cmbCustomerTypeNewCH);
    cmbCustomerType.addEventListener("change", cmbCustomerTypeCH);
    btnCtmSave.addEventListener("click", btnCtmSaveCL);
    confirmTab.addEventListener("click", confirmTabCH);
}


function changeTab2() {

    if (cdReservation.reservation_status_id == null) {
        changeTab3(confirmTab, confirmTabContent);
    }

    if (cdReservation.customer_id == null) {
        changeTab3(customerTab, customerTabContent);
    }

    if (cdReservation.driver_id == null) {
        changeTab3(driverTab, driverTabContent);
    }

    if (cdReservation.vehicle_id == null) {
        changeTab3(vehicleTab, vehicleTabContent);
    }

    if (cdReservation.package_id == null) {
        changeTab3(packageTab, packageTabContent);
    }

    if (txtDropOffLocation.value == "") {
        changeTab3(timeLocationTab, timeLocationTabContent);
    }

    if (txtPickUpLocation.value == "") {
        changeTab3(timeLocationTab, timeLocationTabContent);
    }

    if (datetimeExptPickUp.value == "") {
        changeTab3(timeLocationTab, timeLocationTabContent);
    }

}

function changeTab3(switchTab, switchTabContent) {

    timeLocationTabContent.classList.remove('show');
    timeLocationTabContent.classList.remove('active');
    timeLocationTab.classList.remove('active');

    packageTabContent.classList.remove('show');
    packageTabContent.classList.remove('active');
    packageTab.classList.remove('active');

    vehicleTabContent.classList.remove('show');
    vehicleTabContent.classList.remove('active');
    vehicleTab.classList.remove('active');

    driverTabContent.classList.remove('show');
    driverTabContent.classList.remove('active');
    driverTab.classList.remove('active');

    customerTabContent.classList.remove('show');
    customerTabContent.classList.remove('active');
    customerTab.classList.remove('active');

    confirmTabContent.classList.remove('show');
    confirmTabContent.classList.remove('active');
    confirmTab.classList.remove('active');

    switchTabContent.classList.add('show');
    switchTabContent.classList.add('active');
    switchTab.classList.add('active');
}
