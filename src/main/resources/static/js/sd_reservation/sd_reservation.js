window.addEventListener("load", initialize);

//Time Global Constants
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//Initializing Functions
function initialize() {

    //Enable bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Enable Select2
    $('.js-example-basic-single').select2();

    // Table Row Colors
    active = "#72b3c0";
    update = "#f09456";
    select = "#b2b2b2";

    getRequests();
    setEventListeners();

    loadView();
    loadForm();
}

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
function loadTable(page, size, query, color = null) {
    page = page - 1;

    sdReservations = new Array(); //reservation list
    var data = httpRequest("/sd_reservation/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) sdReservations = data.content; //json

    createPagination('pagination', data.totalPages, data.number + 1, paginate); //json

    //fillTable2(table_id, data_list, fill(), delete(), view())
    fillTable2('tblSDReservation', sdReservations, fillForm, btnDeleteMC, viewitem); //fill the table with customer list
    clearSelection(tblSDReservation); //clear any selected row

    if (color != null) {
        if (activerowno != "") selectRow(tblSDReservation, activerowno, color); //select row if any & color
    } else {
        if (activerowno != "") selectRow(tblSDReservation, activerowno, active); //select row if any & color
    }

}

function paginate(page) {
    var paginate;
    if (oldSDReservation == null) {
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

    sdReservation = new Object();
    oldSDReservation = null; //for comparison on update

    //check out, check in tab hide
    navCheckOut.classList.add('d-none');
    navCheckIn.classList.add('d-none');


    //Bind next number
    var sdreservationObj = httpRequest("../sd_reservation/next_sdreservation_code", "GET");
    txtSdrResvCode.innerHTML = sdreservationObj.sd_reservation_code;

    datetimetPickUp.setAttribute("min", getCurrentDateTime('datetime'));
    datetimetPickUp.setAttribute("max", setMaxDate(false, 7));

    datetimeExptReturn.setAttribute("min", getCurrentDateTime('datetime'));
    datetimeExptReturn.setAttribute("max", setMaxDate(false, 31));

    validF(nmbRequiredRentalDays);
    sdReservation.required_rental_days = nmbRequiredRentalDays.value;

    fillCombo(cmbPickUpLocation, "Nothing selected", pickUpLocations, "name", "");
    fillCombo(cmbReturnLocation, "Nothing selected", returnLocations, "name", "");

    fillCombo(cmbPkCategory, "Nothing selected", packageCategories, "name", "");
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
    fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
    fillTable2('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    fillCombo5(cmbVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(txtPlate, "Nothing Selected", vehicles, "license_plate", "");

    fillCombo(cmbCustomerTypeNew, "Select Customer Type", customerTypes, "name", "");
    fillCombo7(cmbCustomer, "Select Customer", individualCustomers, "first_name", "last_name", "license_no", "", true);
    cmbCustomer.disabled = true;
    $(cmbCustomer).siblings().children().children('.select2-selection--single').css('cursor', 'not-allowed');

    sdReservation.reservation_status_id = reservationStatses[1];
    setReservationStatus('new');

    sdReservation.added_by = session.getObject('activeuser').employeeId;
    sdReservation.added_date_time = getCurrentDateTime('datetime');
    sdReservation.payment_status_id = payment_statuses[0]; // set payment status to Not-Paid

    setStyle(initialF);
    disableButtons(false, true, true);
}

//Change Color of Attributes
function setStyle(style) {
    style(datetimetPickUp);
    style(cmbPickUpLocation);
    style(datetimeExptReturn);
    style(cmbReturnLocation);
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
    for (index in sdReservations) {
        if (sdReservations[index].reservation_status_id.name == "Deleted") {
            tblSDReservation.children[1].children[index].style.color = "#f03e3e"; //change row color
            tblSDReservation.children[1].children[index].style.cursor = "not-allowed";
            tblSDReservation.children[1].children[index].lastChild.children[1].disabled = true; //disable delete btn // Table Body->Row->Last Column->Delete Button
            tblSDReservation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed"; //cursor not allowed

        }
    }

}

//Get Errors of Required Fields
function getErrors() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    // check errors by the bound item property value
    if (datetimetPickUp.value == "") {
        invalidF(datetimetPickUp);
        errors = errors + "\n" + "Pick Up Date & Time Not Entered.";
    } else addvalue = 1;

    if (cmbPickUpLocation.value == "") {
        invalidF(cmbPickUpLocation);
        errors = errors + "\n" + "Pick Up Location Not Entered.";
    } else addvalue = 1;

    if (sdReservation.pick_up_location_id !== undefined) {
        if(sdReservation.pick_up_location_id.id == 2 && sdReservation.other_pick_up_location == null){
            invalidF(txtOtherPickUpLocation);
            errors = errors + "\n" + "Pick Up Location Not Entered.";
        }
    }

    if (cmbReturnLocation.value == "") {
        invalidF(cmbReturnLocation);
        errors = errors + "\n" + "Return Location Not Entered.";
    } else addvalue = 1;

    if (sdReservation.package_id == null) {
        errors = errors + "\n" + "Package Not Selected.";

    } else addvalue = 1;

    if (sdReservation.vehicle_id == null) {
        errors = errors + "\n" + "Vehicle Not Selected.";

    } else addvalue = 1;


    if (sdReservation.customer_id == null) {
        errors = errors + "\n" + "Customer Not Selected.";

    } else addvalue = 1;

    // if customer individual
    if (sdReservation.customer_id != null && sdReservation.customer_id.customer_type_id.name == "Individual") {
        if (dteLicenseExp.value == "") {
            errors = errors + "\n" + "License Expire Not Selected.";
            invalidF(dteLicenseExp);

        } else addvalue = 1;

        if (new Date(dteLicenseExp.value).getTime() <= new Date(datetimeExptReturn.value).getTime()) {
            errors = errors + "\n" + "License is Expired.";
            invalidF(dteLicenseExp);

        } else addvalue = 1;

        // if customer company
    } else if (sdReservation.customer_id != null && sdReservation.customer_id.customer_type_id.name == "Company") {
        if (customer.contact_person_name == null) {
            invalidF(txtContactPersonName);
            txtContactPersonName.focus();
            errors = errors + "\n" + "Contact Person Not Entered.";
        } else addvalue = 1;

        if (customer.contact_person_phone == null) {
            invalidF(txtContactPersonPhone);
            txtContactPersonPhone.focus();
            errors = errors + "\n" + "Contact Person Phone Not Entered.";
        } else addvalue = 1;

        if (customer.contact_person_nic == null) {
            invalidF(txtContactPersonNIC);
            txtContactPersonNIC.focus();
            errors = errors + "\n" + "Contact Person NIC Not Entered.";
        } else addvalue = 1;
    }


    if (sdReservation.reservation_status_id == null) {
        errors = errors + "\n" + "Reservation Status Not Selected.";
        invalidF(cmbReservationStatus);

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
    sdReservation.sd_reservation_code = txtSdrResvCode.textContent;
    sdReservation.package_refundable_deposit = sdReservation.package_id.refundable_deposit;

    //Check whether customer is individual or company
    var customer_name;
    if (sdReservation.customer_id.customer_type_id.name == "Individual") {
        customer_name = sdReservation.customer_id.first_name + " " + sdReservation.customer_id.last_name;
    } else {
        customer_name = sdReservation.customer_id.company_name;
    }

    var pick_up_location;
    if (sdReservation.pick_up_location_id.id == 2) {
        pick_up_location = sdReservation.other_pick_up_location;
    } else {
        pick_up_location = sdReservation.pick_up_location_id.name;
    }

    var required_additional_hours;
    if (sdReservation.required_additional_hours != null) {
        required_additional_hours = sdReservation.required_additional_hours;
    } else {
        required_additional_hours = 'none';
    }

    // If no ongoing reservation, vehicle status set to reserved(2)
    let onGoingReservation = new Array(httpRequest("../sd_reservation/on_going_list_by_vehicle?vehicle_id=" + sdReservation.vehicle_id.id,  "GET"),
                                             httpRequest("../cd_reservation/on_going_list_by_vehicle?vehicle_id=" + sdReservation.vehicle_id.id,  "GET"));
   if(onGoingReservation[0] == '' && onGoingReservation[1] == ''){
       sdReservation.vehicle_id.vehicle_status_id.id = 2;
   }

    swal({
        title: "Are you sure to add following Reservation...?",
        text: "\nReservation Code: " + sdReservation.sd_reservation_code +
            "\nCustomer : " + customer_name +
            "\nPick Up Date: " + sqlDateTimeToLocalC(sdReservation.pick_up_datetime) +
            "\nReturn Date : " + sqlDateTimeToLocalC(sdReservation.expect_return_datetime) +
            "\nPick Up Location : " + pick_up_location +
            "\nReturn Location : " + sdReservation.return_location_id.name +
            "\nPackage : " + sdReservation.package_id.package_name +
            "\nVehicle Model : " + sdReservation.vehicle_id.model_id.brand_id.name + " " + sdReservation.vehicle_id.model_id.name +
            "\nRental Days : " + sdReservation.required_rental_days + " Day" +
            "\nAdditional hours : " + (required_additional_hours > 1 ? required_additional_hours + ' Hour' : ' none') +
            "\nTotal Amount : Rs. " + sdReservation.rental_amount +
            "\nReservation Status : " + sdReservation.reservation_status_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((save) => { //then: if user click 'Yes' then
        if (save) {
            var response = httpRequest("/sd_reservation", "POST", sdReservation);//Post: because it's a Add
            if (response == "0") { //message 0: means successful
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1800
                });
                activepage = 1;
                activerowno = 1; //1: highlight added row which is 1 row
                loadSearchedTable();
                loadForm();
                $('#addReservationModal').modal('hide');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });


}

//Fill Form - Get confirmation on second time update
function fillForm(sdr, rowno) {
    activerowno = rowno;

    if (oldSDReservation == null) { //check if previous attempt to update (value assign to oldCustomer only when fill_data() called.)
        filldata(sdr);
    } else {
        swal({
            title: "Previous attempt to update the form has not submitted... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: ["Cancel", "Discard"], dangerMode: true,
        }).then((yesUpdate) => {
            if (yesUpdate) {
                showPaymentCHI();
                showPaymentCHO();
                filldata(sdr);
            }

        });
    }

}

//Fill Data on Update // Check Out & Check In take effect
function filldata(sdr) {
    clearSelection(tblSDReservation);
    selectRow(tblSDReservation, activerowno, select); //color row

    sdReservation = JSON.parse(JSON.stringify(sdr));// parse to prevent referring to same object & data is in table row format
    oldSDReservation = JSON.parse(JSON.stringify(sdr));

    customerPayment = new Object();

    //check out, check in tab hide
    navCheckOut.classList.add('d-none');
    navCheckIn.classList.add('d-none');

    updateTimeAndLocationTab();
    updatePackageTab();
    updateVehicleTab();
    updateCustomerTab();
    updateConfirmTab();

    // ~~~~ Complete  ~~~~ //
    if (oldSDReservation.reservation_status_id.id === 3) { // 3 = completed
        showRentalAgreement();
        loadReceiptCHI();
        setReservationStatus('complete');
        disableElements();
        focusCheckInTab();
    }

    // Open The Modal
    $('#addReservationModal').modal('show');
}

function getReservationStatus(){
    if(oldSDReservation.reservation_status_id.id === 2){
        return true;
    }
}

function disableElements() {
    // Query Select all input fields and disable them
    let tabContentIds = ['timeLocationTabContent','packageTabContent','vehicleTabContent', 'customerTabContent', 'confirmTabContent'];

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

    btnCtmSave.style.cursor = "not-allowed";
    btnUpdate.style.cursor = "not-allowed";

    // Clear X
    btnXPkCategory.style.display = "none";
    btnXPkgVModel.style.display = "none";
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";
}

function setReservationStatus(reservationStatus){
    switch (reservationStatus){
        case "new":
            fillCombo(cmbReservationStatus, "Select Reservation Status", reservationStatses, "name", reservationStatses[1].name);
            cmbReservationStatus.style.pointerEvents = "none";
            break;

        case "update":
            fillCombo(cmbReservationStatus, "Select Reservation Status", resvStatusForUpdate, "name", oldSDReservation.reservation_status_id.name);
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


//Check for Updated Values
function getUpdates() {

    var updates = "";

    if (sdReservation != null && oldSDReservation != null) {

        if (sdReservation.pick_up_datetime != oldSDReservation.pick_up_datetime)
            updates = updates + "\nPick Up Date is Changed: " + oldSDReservation.pick_up_datetime + " --> " + sdReservation.pick_up_datetime;

        if (sdReservation.pick_up_location_id.id != oldSDReservation.pick_up_location_id.id) {
            if (sdReservation.pick_up_location_id.id == 2) {
                updates = updates + "\nPick Up Location is Changed: " + oldSDReservation.pick_up_location_id.name + " --> " + sdReservation.other_pick_up_location;
            } else {
                updates = updates + "\nPick Up Location is Changed: " + oldSDReservation.pick_up_location_id.name + " --> " + sdReservation.pick_up_location_id.name;
            }
        }

        if (sdReservation.pick_up_charge != oldSDReservation.pick_up_charge)
            updates = updates + "\nPick Up Charge is Changed: " + oldSDReservation.pick_up_charge + " --> " + sdReservation.pick_up_charge;


        if (sdReservation.return_location_id.id != oldSDReservation.return_location_id.id)
            updates = updates + "\nReturn Location is Changed: " + oldSDReservation.return_location_id.name + " --> " + sdReservation.return_location_id.name;

        if (sdReservation.required_rental_days != oldSDReservation.required_rental_days)
            updates = updates + "\nRental Days are Changed: " + oldSDReservation.required_rental_days + " --> " + sdReservation.required_rental_days;

        if (sdReservation.expect_return_datetime != oldSDReservation.expect_return_datetime)
            updates = updates + "\nReturn Date is Changed: " + oldSDReservation.expect_return_datetime + " --> " + sdReservation.expect_return_datetime;


        if (sdReservation.package_id.id != oldSDReservation.package_id.id)
            updates = updates + "\nPackage is Changed: " + oldSDReservation.package_id.package_name + " --> " + sdReservation.package_id.package_name;

        if (sdReservation.vehicle_id.id != oldSDReservation.vehicle_id.id)
            updates = updates + "\nVehicle is Changed: " + oldSDReservation.vehicle_id.vehicle_name + " [" + oldSDReservation.vehicle_id.license_plate + "]" + " --> " + sdReservation.vehicle_id.vehicle_name + " [" + sdReservation.vehicle_id.license_plate + "]";

        if (sdReservation.customer_id.id != oldSDReservation.customer_id.id) {
            if (sdReservation.customer_id.customer_type_id.name == "Individual" && oldSDReservation.customer_id.customer_type_id.name == "Individual") {
                updates = updates + "\nCustomer is Changed: " + oldSDReservation.customer_id.first_name + " " + sdReservation.customer_id.last_name + " --> " + sdReservation.customer_id.first_name + " " + sdReservation.customer_id.last_name;
            } else if (sdReservation.customer_id.customer_type_id.name == "Individual" && oldSDReservation.customer_id.customer_type_id.name == "Company") {
                updates = updates + "\nCustomer is Changed: " + oldSDReservation.customer_id.first_name + " " + sdReservation.customer_id.last_name + " --> " + sdReservation.customer_id.company_name;
            } else if (sdReservation.customer_id.customer_type_id.name == "Company" && oldSDReservation.customer_id.customer_type_id.name == "Individual") {
                updates = updates + "\nCustomer is Changed: " + oldSDReservation.customer_id.company_name + " --> " + sdReservation.customer_id.first_name + " " + sdReservation.customer_id.last_name;
            } else if (sdReservation.customer_id.customer_type_id.name == "Company" && oldSDReservation.customer_id.customer_type_id.name == "Company") {
                updates = updates + "\nCustomer is Changed: " + oldSDReservation.customer_id.company_name + " --> " + sdReservation.customer_id.company_name;
            }
        }

        if (sdReservation.rental_amount != oldSDReservation.rental_amount)
            updates = updates + "\nRental Amount is Changed: " + oldSDReservation.rental_amount + " --> " + sdReservation.rental_amount;

        if (sdReservation.reservation_status_id.id != oldSDReservation.reservation_status_id.id)
            updates = updates + "\nReservation Status is Changed: " + oldSDReservation.reservation_status_id.name + " --> " + sdReservation.reservation_status_id.name;

        return updates;

    }
}

//Get confirmation & Update
function btnUpdateMC() {
    if (getErrors() == "") {
        if (getUpdates() == "") {
            swal({
                title: 'Nothing to update..', icon: "warning",
                text: '\n',cmbReservationStatus,
                button: false,
                timer: 1800
            });
        } else {
            swal({
                title: "Are you sure to update following package details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: ["Cancel", "Update"], dangerMode: true,
            })
                .then((yesUpdate) => {
                    if (yesUpdate) {
                        var response = httpRequest("/sd_reservation", "PUT", sdReservation);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Updated Successfully..!',
                                text: '\n',
                                button: false,
                                timer: 1800
                            });
                            loadSearchedTable(update);
                            // $('#addReservationModal').modal('hide');
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

function btnDeleteMC(sdr) {
    sdReservation = JSON.parse(JSON.stringify(sdr));

    swal({
        title: "Are you sure to delete following reservation...?",
        text: "\nReservation Number : " + sdReservation.sd_reservation_code,
        icon: "warning", buttons: ["Cancel", "Delete"], closeOnClickOutside: false, dangerMode: true,

    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/sd_reservation", "DELETE", sdReservation);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to delete",
                    icon: "success", button: false, timer: 1200,
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
function loadSearchedTable(color = null) {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    if (color != null) {
        loadTable(activepage, cmbPageSize.value, query, color); //call loadTable passing the query

    } else {
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

function chnagePageSize() {
    activepage = 1;
    btnSearchMC();
};

function getReservationType(id){
    for (index in reservation_types) {
        if (reservation_types[index].id === id) {
            return reservation_types[index];
        }
    }
}

function getPaymentStatus(id){
    for (index in payment_statuses) {
        if (payment_statuses[index].id === id) {
            return advancePaidStatus = payment_statuses[index];
        }
    }
}

function convertSqlDateTimeToLocal(sqlDateTime) {
    var sqlDateTimeSplit = sqlDateTime.split("T");
    var localDateTime = [];
    localDateTime[0] = sqlDateTimeSplit[0];

    var datetime = new Date(sqlDateTime);
    localDateTime[1] = localDate + " " + datetime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    return localDateTime; // return an array
}

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

function setMaxDate(fromPick = false, numOfTime) {
    if (fromPick == false) {
        var currentDateTime = new Date(getCurrentDateTime('datetime'));
        var max = currentDateTime.getTime() + (day * numOfTime);
        var maxDateTime = new Date(max);
    } else {

        var pickDateTime = new Date(datetimetPickUp.value);
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
    }
}

function changeTab2() {

    if (sdReservation.reservation_status_id == null) {
        changeTab3(confirmTab, confirmTabContent);
    }

    if (sdReservation.customer_id == null) {
        changeTab3(customerTab, customerTabContent);
    }

    // if customer individual
    if (sdReservation.customer_id != null && sdReservation.customer_id.customer_type_id.name == "Individual") {
        if (dteLicenseExp.value == "" || (new Date(dteLicenseExp.value).getTime() <= new Date(datetimeExptReturn.value).getTime())) {
            changeTab3(customerTab, customerTabContent);
        }
    } else if (sdReservation.customer_id != null && sdReservation.customer_id.customer_type_id.name == "Company") {
        if (customer.contact_person_name == null || customer.contact_person_phone == null || customer.contact_person_nic == null) {
            changeTab3(customerTab, customerTabContent);
        }
    }


    if (sdReservation.vehicle_id == null) {
        changeTab3(vehicleTab, vehicleTabContent);
    }

    if (sdReservation.package_id == null) {
        changeTab3(packageTab, packageTabContent);
    }

    if (cmbReturnLocation.value == "") {
        changeTab3(timeLocationTab, timeLocationTabContent);
    }

    if (cmbPickUpLocation.value == "") {
        changeTab3(timeLocationTab, timeLocationTabContent);
    }

    if (sdReservation.pick_up_location_id !== undefined) {
        if( sdReservation.pick_up_location_id.id == 2 && sdReservation.other_pick_up_location == null){
            changeTab3(timeLocationTab, timeLocationTabContent);
        }
    }

    if (datetimetPickUp.value == "") {
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

function getRequests(){
    //Request Privileges
    privileges = httpRequest("../privilege?module=SDRESERVATION", "GET");

    //Request Lists for Combo box
    pickUpLocations = httpRequest("../pick_up_location/list", "GET");
    returnLocations = httpRequest("../return_location/list", "GET");

    vehicles = httpRequest("../vehicle/list", "GET");
    vehicleTypes = httpRequest("../vehicle_type/list", "GET");
    vehicleModels = httpRequest("../vehicle_model/list", "GET");

    packages = httpRequest("../package/sdr_list", "GET");
    packageKilometers = httpRequest("../package/kilometer_list_sdr", "GET");
    packageCategories = httpRequest("../package_category/list", "GET");
    packageDurations = httpRequest("../package_duration/list_sdr", "GET");

    customerTypes = httpRequest("../customer_type/list", "GET");
    individualCustomers = httpRequest("../customer/list_individual", "GET");
    companyCustomers = httpRequest("../customer/list_company", "GET");

    reservationStatses = httpRequest("../reservation_status/list", "GET");
    resvStatusForUpdate = new Array(reservationStatses[1], reservationStatses[3], reservationStatses[4]);

    reservation_types = httpRequest("../reservation_type/list", "GET");
    payment_statuses = httpRequest("../payment_status/list", "GET");
    refundableDepositStatuses = httpRequest("../refundable_deposit_status/list", "GET");
    employees = httpRequest("../employee/list", "GET");
}

function setEventListeners(){
    cmbPageSize.addEventListener("change", chnagePageSize);
    btnAdd.addEventListener("click", btnAddMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    txtCurrentPassword.addEventListener("keyup", () => textFieldBinder(txtCurrentPassword, '^[0-9]{5,}$', 'changePassword', 'currentPassword', 'oldChangePassword'));
    txtOtherPickUpLocation.addEventListener("keyup", () => textFieldBinder(txtOtherPickUpLocation, '', 'sdReservation','other_pick_up_location','oldSDReservation'));
    txtPickUpCharge.addEventListener("keyup", () => textFieldBinder(txtPickUpCharge, '', 'sdReservation','pick_up_charge','oldSDReservation'));
    txtRegisterNo.addEventListener("keyup", () => textFieldBinder(txtRegisterNo, '^[0-9]{10}$', 'customer','register_no','oldCustomer', true));
    txtNIC.addEventListener("keyup", () => textFieldBinder(txtNIC, '^([0-9]{9}[vV]|[0-9]{12})$','customer', 'nic','oldCustomer', true));
    txtLicense.addEventListener("keyup", () => textFieldBinder(txtLicense, '^([B][0-9]{7})$','customer', 'license_no','oldCustomer', true));
    txtCompanyName.addEventListener("keyup", () => textFieldBinder(txtCompanyName, '', 'customer','company_name','oldCustomer', true));
    txtFirstName.addEventListener("keyup", () => textFieldBinder(txtFirstName, '^[a-zA-Z\'.-]+$', 'customer','first_name','oldCustomer', true));
    txtLastName.addEventListener("keyup", () => textFieldBinder(txtLastName, '^[a-zA-Z\'.-]+$', 'customer','last_name','oldCustomer',true));
    txtPhone.addEventListener("keyup", () => textFieldBinder(txtPhone, '^[0][0-9]{9}$','customer', 'phone','oldCustomer', true));
    txtEmail.addEventListener("keyup", () => textFieldBinder(txtEmail, '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$','customer', 'email','oldCustomer', true));
    txtCompanyPhone.addEventListener("keyup", () => textFieldBinder(txtCompanyPhone, '^[0][0-9]{9}$','customer', 'company_phone','oldCustomer', true));
    txtCompanyEmail.addEventListener("keyup", () => textFieldBinder(txtCompanyEmail, '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$','customer', 'company_email','oldCustomer', true));
    txtContactPersonName.addEventListener("keyup", () => textFieldBinder(txtContactPersonName, '^[a-zA-Z\'.-]+$', 'customer','contact_person_name','oldCustomer', true));
    txtContactPersonPhone.addEventListener("keyup", () => textFieldBinder(txtContactPersonPhone, '^[0][0-9]{9}$','customer', 'contact_person_phone','oldCustomer', true));
    txtContactPersonNIC.addEventListener("keyup", () => textFieldBinder(txtContactPersonNIC, '^([0-9]{9}[vV]|[0-9]{12})$','customer', 'contact_person_nic','oldCustomer', true));
    txtAddress.addEventListener("keyup", () => textFieldBinder(txtAddress, '','customer', 'address','oldCustomer', true));
    txtCompanyAddress.addEventListener("keyup", () => textFieldBinder(txtCompanyAddress, '^[0-9a-zA-Z\'#:;. ,/-]+$','customer', 'company_address','oldCustomer', true), () => showCustomerBindings());
    txtReservationNotes.addEventListener("keyup", () => textFieldBinder(txtReservationNotes, '','sdReservation', 'trip_notes','oldSDReservation'));
    txtOdometerOutPayCHO.addEventListener("keyup", txtOdometerOutPayCHOCH);
    txtCashPayCHO.addEventListener("keyup", txtCashPayCHOCH);
    txtNewPassword.addEventListener("keyup", () => passwordFieldBinder(txtNewPassword, txtConfirmPassword, '^[0-9]{5,}$', 'changePassword', '', 'oldChangePassword'));
    txtConfirmPassword.addEventListener("keyup", () => passwordFieldBinder(txtNewPassword, txtConfirmPassword, '^[0-9]{5,}$', 'changePassword', 'newPassword', 'oldChangePassword'));
    cmbPickUpLocation.addEventListener("change", () => comboBoxBinder(cmbPickUpLocation,'','sdReservation','pick_up_location_id','oldSDReservation'));
    cmbReturnLocation.addEventListener("change", () => comboBoxBinder(cmbReturnLocation,'','sdReservation','return_location_id','oldSDReservation'));
    chargeDistanceNo.addEventListener("change", hidePickUpCharge);
    chargeDistanceYes.addEventListener("change", showPickUpCharge);
    cmbPkCategory.addEventListener("change", () => showX('cmbPkCategory','btnXPkCategory'));
    cmbPkgVModel.addEventListener("change", () => cmbPkgVModelCH(), () => showX('cmbPkgVModel','btnXPkgVModel'));
    cmbPkKm.addEventListener("change", () => showX('cmbPkKm','btnXPkKm'));
    cmbPkDuration.addEventListener("change", () => cmbPkDurationCH(), () => showX('cmbPkDuration','btnXPkDuration'));
    cmbVType.addEventListener("change", () => showX('cmbVType','btnXVType'));
    cmbCustomerType.addEventListener("change", () => comboBoxBinder(cmbCustomerType,'','customer','customer_type_id','oldCustomer', true));
    cmbReservationStatus.addEventListener("change", () => comboBoxBinder(cmbReservationStatus,'','sdReservation','reservation_status_id','oldSDReservation'));
    chkRefundableDepositPayCHO.addEventListener("change", chkRefundableDepositPayCHOCH);
    dateTimeReturnPayCHI.addEventListener("change", onChangeReturnDateCHI);
    nmbDiscountPercentagePayCHI.addEventListener("change", onChangeDiscountPercentageCHI);
    chkRefDepositPayCHI.addEventListener("change", onToggleRefDepositCHI);
    txtCashPayCHI.addEventListener("blur", onChangeCashCHI);
    txtDiscountPayCHI.addEventListener("blur", onChangeDiscountCHI);
    datetimetPickUp.addEventListener("change", datetimetPickUpCH);
    datetimeExptReturn.addEventListener("change", datetimeExptReturnCH);
    nmbRequiredRentalDays.addEventListener("change", nmbRequiredRentalDaysCH);
    cmbPickUpLocation.addEventListener("change", cmbPickUpLocationCH);
    chargeDistanceNo.addEventListener("click", chargeDistanceNoCH);
    nmbOdometerInPayCHI.addEventListener("keyup", onChangeOdometerInCHI);
    cmbPkCategory.addEventListener("change", cmbPkCategoryCH);
    cmbPkKm.addEventListener("change", cmbPkKmCH);
    vehicleTab.addEventListener("click", vehicleTabCH);
    cmbCustomerTypeNew.addEventListener("change", cmbCustomerTypeNewCH);
    cmbCustomerType.addEventListener("change", cmbCustomerTypeCH);
    dteLicenseExp.addEventListener("change", dteLicenseExpCH);
    btnCtmSave.addEventListener("click", btnCtmSaveCL);
    confirmTab.addEventListener("click", confirmTabCH);
    signOut.addEventListener("click", btnSignoutMC);
    btnPrintTable.addEventListener("click", btnPrintTableMC);
    btnModalClose.addEventListener("click", () => modalCloseBtnClick(tblSDReservation));
    btnXPkgVModel.addEventListener("click", () => clearFilter('cmbPkgVModel','btnXPkgVModel', pkgVehicleModelClear));
    btnXPkKm.addEventListener("click", () => clearFilter('cmbPkKm','btnXPkKm', pkgKmClear));
    btnXPkDuration.addEventListener("click", () => clearFilter('cmbPkDuration','btnXPkDuration', pkgDurationClear));
    btnXVType.addEventListener("click", () => clearFilter('cmbVType','btnXVType'));
    btnXPkCategory.addEventListener("click", () => clearFilter('cmbPkCategory','btnXPkCategory' , pkgCategoryClear));
    divNewCustomer.addEventListener("click", lnkNewCustomerCH);
    btnPrintAgreement.addEventListener("click", btnPrintAgreementMC);
    btnAddPaymentCHO.addEventListener("click", btnAddPaymentCHOCH);
    btnPrintCheckInBill.addEventListener("click", btnPrintCheckInBillMC);
    btnAddPaymentCHI.addEventListener("click", onClickAddPaymentCHI);
    btnPrintRow.addEventListener("click", btnPrintRowMC);
    btnSaveChangePassword.addEventListener("click", btnSaveChangePasswordMC);
}
