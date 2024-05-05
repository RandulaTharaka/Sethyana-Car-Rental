window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    //EventListeners
    txtSearchName.addEventListener("keyup", btnSearchMC);
    txtPickOdometer.addEventListener("keyup", txtPickOdometerCH);
    btnStartTrip.addEventListener("click", btnStartTripCH);
    txtEndOdometerGoing.addEventListener("keyup", txtEndOdometerGoingCH);
    btnEndTripGoing.addEventListener("click", btnEndTripGoingCH);
    txtCashPayment.addEventListener("keyup", txtCashPaymentCH);
    btnCollectCash.addEventListener("click", btnCollectCashCH);

    //Request Privileges
    privileges = httpRequest("../privilege?module=DRIVERPORTAL", "GET");

    //Request Lists for Combo box
    payment_statuses = httpRequest("../payment_status/list", "GET");
    reservation_types = httpRequest("../reservation_type/list", "GET");

    //Request Lists for Combo box

    //Colors
    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#72b3c0";
    update = "#f29d63";
    // active = "#ef8944";
    // active = "#f29d63";

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

    //Table Search Area
    txtSearchName.value = ""
    txtSearchName.style.background = "";

    activerowno = "";
    activepage = 1;
    var query = "&searchtext=&userid=" + session.getObject("activeuser").employeeId.id;
    //loadTable (page,size,search)
    loadTable(1, cmbPageSize.value, query);
}

//Load Table & Fill Data
function loadTable(page, size, query) {
    page = page - 1;

    cdReservations = new Array(); //cdReservation list
    var data = httpRequest("/cd_reservation/findAllByDriver?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) cdReservations = data.content; //json

    createPagination('pagination', data.totalPages, data.number + 1, paginate); //json

    //fillTable(table_id, data_list, fill(), delete(), view())
    fillTable('tblCDReservation', cdReservations, null, null, viewitem, null, null, moveFirstSide); //fill the table with customer list
    clearSelection(tblCDReservation); //clear any selected row
    if (activerowno != "") selectRow(cdReservations, activerowno, active); //select row if any & color

}

//When reservation clicked
function moveFirstSide(innerob, rowindex) {
    //Binding Row
    driverReservation = JSON.parse(JSON.stringify(innerob));
    activerowindex = rowindex;

    //Check if on-going row is there
    var onGoingResId = 0;
    for (index in cdReservations) {
        if (cdReservations[index].reservation_status_id.id == 7) {
            onGoing = true;
            onGoingResId = cdReservations[index].id;
            break;
        }
    }

    //if on-going = true
    if (onGoing) {
        //if clicked row is the on-going reservation
        if (onGoingResId == driverReservation.id) {
                //show trip start page
                if (driverReservation.pick_up_odometer == null) {

                    txtPickOdometer.value = "";
                    initialF(txtPickOdometer);
                    txtEndOdometerGoing.value = "";
                    initialF(txtEndOdometerGoing);
                    txtCashPayment.value = "";
                    initialF(txtCashPayment);

                    showStartTripDiv();
                    $('#reservationCarousel').carousel(1);

                    //show trip end page
                } else if (driverReservation.drop_off_odometer == null) {

                    txtEndOdometerGoing.value = "";
                    initialF(txtEndOdometerGoing);
                    txtCashPayment.value = "";
                    initialF(txtCashPayment);

                    showTripEndDiv();
                    $('#reservationCarousel').carousel(1);

                    //show trip payment page
                } else if (driverReservation.payment_status_id.id == 1) {
                    txtCashPayment.value = "";
                    initialF(txtCashPayment);

                    calculateTripDetails();
                    $('#reservationCarousel').carousel(2);
                }
            //if clicked not the on-going
        } else {
            swal({
                title: 'Please Complete On-Going Reservation', icon: "warning",
                text: '\n',
                button: false,
                timer: 1500
            });
        }

        //if no-ongoing reservation
    } else {
        //if complete reservation
        if (driverReservation.reservation_status_id.id == 3) {
            swal({
                title: 'Completed Reservation', icon: "warning",
                text: '\n',
                button: false,
                timer: 1500
            });
            //if reserved reservation
        } else if (driverReservation.reservation_status_id.id == 2) {

            txtPickOdometer.value = "";
            initialF(txtPickOdometer);
            txtEndOdometerGoing.value = "";
            initialF(txtEndOdometerGoing);
            txtCashPayment.value = "";
            initialF(txtCashPayment);

            showStartTripDiv();
            $('#reservationCarousel').carousel(1);

        }
    }
}

//## Trip Start Page ##//
function showStartTripDiv() {

    divOnGoing.classList.add("d-none");
    divData.classList.remove("d-none");

    //Start Trip Details
    lblResNo.innerHTML = driverReservation.cd_reservation_code;
    if (driverReservation.customer_id.customer_type_id.name == 'Individual') {
        lblCustomerName.innerHTML = driverReservation.customer_id.first_name + " " + driverReservation.customer_id.last_name;
    } else if (driverReservation.customer_id.customer_type_id.name == 'Company') {
        lblCustomerName.innerHTML = driverReservation.customer_id.company_name;
    }
    lblVehicleModel.innerHTML = driverReservation.vehicle_id.model_id.brand_id.name + " " + driverReservation.vehicle_id.model_id.name;
    lblLicensePlate.innerHTML = driverReservation.vehicle_id.license_plate;
    lblPickLocation.innerHTML = driverReservation.pick_up_location;
    lblReturnLocation.innerHTML = driverReservation.drop_off_location;

    if (driverReservation.stop_location_1 != null && driverReservation.stop_location_1 != undefined) {
        divMultipleStop1.classList.remove('d-none');
        lblMultipleStop1.innerHTML = driverReservation.stop_location_1;
    }

    if (driverReservation.stop_location_2 != null && driverReservation.stop_location_2 != undefined) {
        divMultipleStop2.classList.remove('d-none');
        lblMultipleStop2.innerHTML = driverReservation.stop_location_2;

    }

    if (driverReservation.stop_location_3 != null && driverReservation.stop_location_3 != undefined) {
        divMultipleStop3.classList.remove('d-none');
        lblMultipleStop3.innerHTML = driverReservation.stop_location_3;

    }

    // lblPickTime.innerHTML =sqlDateTimeToLocal(driverReservation.expect_pick_up_datetime)[0] + " " + sqlDateTimeToLocal(driverReservation.expect_pick_up_datetime)[1];
    lblPickTime.innerHTML = sqlDateTimeToLocalC(driverReservation.expect_pick_up_datetime);


    lblReturnTime.innerHTML = sqlDateTimeToLocalC(driverReservation.expect_return_datetime);
    lblPackageDuration.innerHTML = driverReservation.package_duration_id.name + " " + driverReservation.package_duration_id.package_duration_type_id.name
    lblPackageKm.innerHTML = driverReservation.package_km + " " + "Km";

    if (driverReservation.trip_notes != null && driverReservation.trip_notes != "") {
        divlblResNote.classList.remove('d-none');
        divtxtResNote.classList.remove('d-none');
        txtResNote.innerHTML = driverReservation.trip_notes;
    }
}

function txtPickOdometerCH() {
    if (parseInt(txtPickOdometer.value) >= parseInt(driverReservation.vehicle_id.current_odometer) && txtPickOdometer.value != "") {
        driverReservation.pick_up_odometer = txtPickOdometer.value;
        validF(txtPickOdometer);
        btnStartTrip.disabled = false;
    } else {
        invalidF(txtPickOdometer);
        btnStartTrip.disabled = true;
    }
}

function btnStartTripCH() {
    if (driverReservation.pick_up_odometer != null) {

        driverReservation.trip_start_datetime = getCurrentDateTime('datetime');
        driverReservation.reservation_status_id.id = 7;

        driverReservation.vehicle_id.current_odometer = driverReservation.pick_up_odometer;
        driverReservation.vehicle_id.vehicle_status_id.id = 3;

        driverReservation.driver_id = driverReservation.driver_id;
        driverReservation.driver_id.driver_status_id.id = 2;

        var response1 = httpRequest("/cd_reservation", "PUT", driverReservation);//Post: because it's a Add

        if (response1 == "0") { //message 0: means successful
            swal({
                position: 'center',
                icon: 'success',
                title: 'New Trip is Starting...',
                text: '\n',
                button: false,
                timer: 2200
            });

            backToTableStart.classList.add('d-none');
            onGoing = true;
            showTripEndDiv();
            clearSelection(tblCDReservation);
            selectRow(tblCDReservation, activerowindex, update);

        } else swal({
            title: 'Trip can not be started, You have following errors', icon: "error",
            text: '\n ' + response1 ,
            button: true
        });

    }
}

//## Trip End Page ##//

function showTripEndDiv() {
    divData.classList.add("d-none");
    divOnGoing.classList.remove("d-none");

    //On-Going Trip Details
    lblResNoGoing.innerHTML = driverReservation.cd_reservation_code;
    if (driverReservation.customer_id.customer_type_id.name == 'Individual') {
        lblCustomerNameGoing.innerHTML = driverReservation.customer_id.first_name + " " + driverReservation.customer_id.last_name;
    } else if (driverReservation.customer_id.customer_type_id.name == 'Company') {
        lblCustomerNameGoing.innerHTML = driverReservation.customer_id.company_name;
    }

    lblReturnLocationGoing.innerHTML = driverReservation.drop_off_location;

    if (driverReservation.stop_location_1 != null && driverReservation.stop_location_1 != undefined) {
        divMultipleStop1Going.classList.remove('d-none');
        lblMultipleStop1Going.innerHTML = driverReservation.stop_location_1;
    }

    if (driverReservation.stop_location_2 != null && driverReservation.stop_location_2 != undefined) {
        divMultipleStop2Going.classList.remove('d-none');
        lblMultipleStop2Going.innerHTML = driverReservation.stop_location_2;

    }

    if (driverReservation.stop_location_3 != null && driverReservation.stop_location_3 != undefined) {
        divMultipleStop3Going.classList.remove('d-none');
        lblMultipleStop3Going.innerHTML = driverReservation.stop_location_3;

    }

    lblReturnTimeGoing.innerHTML = sqlDateTimeToLocalC(driverReservation.expect_return_datetime);
    lblPackageDuration.innerHTML = driverReservation.package_duration_id.name + " " + driverReservation.package_duration_id.package_duration_type_id.name
    lblPackageKm.innerHTML = driverReservation.package_km;

    lblStartOdometerGoing.innerHTML = driverReservation.pick_up_odometer;

    if (driverReservation.trip_notes != null && driverReservation.trip_notes != "") {
        divlblResNoteOnGoing.classList.remove('d-none');
        divtxtResNoteOnGoing.classList.remove('d-none');
        txtResNoteOnGoing.innerHTML = driverReservation.trip_notes;
    }
}

function txtEndOdometerGoingCH() {

    if (parseInt(txtEndOdometerGoing.value) > parseInt(driverReservation.pick_up_odometer) && txtEndOdometerGoing.value != "") {
        driverReservation.drop_off_odometer = txtEndOdometerGoing.value;
        driverReservation.vehicle_id.current_odometer = driverReservation.drop_off_odometer;

        validF(txtEndOdometerGoing);
        btnEndTripGoing.disabled = false;
    } else {
        invalidF(txtEndOdometerGoing);
        btnEndTripGoing.disabled = true;
    }

}

function btnEndTripGoingCH() {
    if (driverReservation.drop_off_odometer != null) { // check from binding

        driverReservation.trip_end_datetime = getCurrentDateTime('datetime');
        calculateTripDetails();
        driverReservation.final_trip_distance_km = tripDistance;
        driverReservation.final_trip_duration = duration;
        // driverReservation.additional_duration = addtionalTimeMinutes;
        driverReservation.additional_km = additionalKm;

        driverReservation.vehicle_id.current_odometer = driverReservation.drop_off_odometer; // set vehicle odometer

        var response1 = httpRequest("/cd_reservation", "PUT", driverReservation);//Post: because it's a Add
        if (response1 == "0") { //message 0: means successful
            swal({
                position: 'center',
                icon: 'success',
                title: 'Processing Payment...',
                text: '\n',
                button: false,
                timer: 2000
            });

            $('#reservationCarousel').carousel('next');

        } else swal({
            title: 'Trip can not be ended, You have following errors', icon: "error",
            text: '\n ' + response1,
            button: true
        });

    }
}

//## Trip Payment Page ##//

function calculateTripDetails() {

    //reservation code
    lblResNoPayment.innerHTML = driverReservation.cd_reservation_code;
    resNoPrint.innerHTML = driverReservation.cd_reservation_code;

    //customer name
    if (driverReservation.customer_id.customer_type_id.name == 'Individual') {
        lblCustomerPayment.innerHTML = driverReservation.customer_id.first_name + " " + driverReservation.customer_id.last_name;
        customerPrint.innerHTML = driverReservation.customer_id.first_name + " " + driverReservation.customer_id.last_name;
    } else if (driverReservation.customer_id.customer_type_id.name == 'Company') {
        lblCustomerPayment.innerHTML = driverReservation.customer_id.company_name;
        customerPrint.innerHTML = driverReservation.customer_id.company_name;
    }

    packagePrice = 0.00;
    addtionalHourCharge = 0.00;
    additionalKmsCharge = 0.00;
    pickUPCharge = 0.00;
    additional_charges = 0.00;

    subTotal = 0.00;
    discount = 0.00;
    totalPayable = 0.00;
    cash = 0.00;
    change = 0.00;
    paid = 0.00;
    dueBalance = 0.00;

    //package price
    packagePrice = parseFloat(driverReservation.package_id.package_price).toFixed(2);
    lblPackagePrice.innerHTML = 'Rs ' + packagePrice;
    packagePricePrint.innerHTML = 'Rs ' + packagePrice;

    //additional hour charge
    if (driverReservation.trip_end_datetime != null && driverReservation.trip_start_datetime != null) {
        var pickDateTime = new Date(driverReservation.trip_start_datetime);
        var returnDateTime = new Date(driverReservation.trip_end_datetime);
        // var returnDateTime = new Date('2022-05-23T18:06:00');
        duration = returnDateTime.getTime() - pickDateTime.getTime();

        if (driverReservation.package_duration_id.package_duration_type_id.name = "Hour") {
            var pkgDurationInTime = new Date(driverReservation.package_duration_id.name * hour).getTime();

        } else if (driverReservation.package_duration_id.package_duration_type_id.name = "Day") {
            var pkgDurationInTime = new Date(driverReservation.package_duration_id.name * day).getTime();
        }

        if (duration > pkgDurationInTime) {
            var addtionalTime = Math.abs(duration - pkgDurationInTime);
            addtionalTimeMinutes = Math.floor((addtionalTime / minute)).toFixed(0);
            driverReservation.additional_duration = addtionalTimeMinutes;
            addtionalHourCharge = parseFloat((driverReservation.additional_hour_price / 60) * addtionalTimeMinutes).toFixed(2);

            lblAddHourCharge.innerHTML = '<span class="form-label d-block">' + 'Rs ' + addtionalHourCharge + '</span>' + '(' + addtionalTimeMinutes + ' Minutes X Rs ' + parseFloat((driverReservation.additional_hour_price / 60)).toFixed(2) + ')';
            addTimeChargePrint.innerHTML = '<span class="d-block">' + 'Rs ' + addtionalHourCharge + '</span>' + '(' + addtionalTimeMinutes + ' Minutes X Rs ' + parseFloat((driverReservation.additional_hour_price / 60)).toFixed(2) + ')';

        }

    }

    //addtional km charge
    tripDistance = parseInt(driverReservation.drop_off_odometer) - parseInt(driverReservation.pick_up_odometer);
    additionalKm = tripDistance - parseInt(driverReservation.package_km);
    additionalKmsCharge = parseFloat((additionalKm * parseInt(driverReservation.additional_km_price)).toFixed(2)).toFixed(2);
    lblAddKmCharge.innerHTML = '<span class="form-label d-block">' + 'Rs ' + additionalKmsCharge + '</span>' + '(' + additionalKm + ' Km X Rs ' + parseFloat(driverReservation.additional_km_price).toFixed(2) + ')';
    addKmChargePrint.innerHTML = '<span class="d-block">' + 'Rs ' + additionalKmsCharge + '</span>' + '(' + additionalKm + ' Km X Rs ' + parseFloat(driverReservation.additional_km_price).toFixed(2) + ')';
    // lblAddKmCharge.innerHTML = 'Rs ' + additionalKmsCharge;

    //pick up charge
    if (driverReservation.pick_up_charge != null && driverReservation.pick_up_charge != '') {
        pickUPCharge = parseFloat(driverReservation.pick_up_charge).toFixed(2);
        lblPickUpCharge.innerHTML = 'Rs ' + pickUPCharge;
        pickUpChargePrint.innerHTML = 'Rs ' + pickUPCharge;
    }

    //sub total
    subTotal = parseFloat(parseFloat(packagePrice) + parseFloat(addtionalHourCharge) + parseFloat(additionalKmsCharge) + parseFloat(pickUPCharge)).toFixed(2);
    lblSubTotal.innerHTML = 'Rs ' + subTotal;
    subTotalPrint.innerHTML = 'Rs ' + subTotal;


    //total payable
    totalPayable = parseFloat(parseFloat(subTotal) - parseFloat(discount)).toFixed(2);
    lblTotalPayable.innerHTML = 'Rs ' + totalPayable;
    totalPrint.innerHTML = 'Rs ' + totalPayable;

    //trip duration
    lblTripDurationPayment.innerHTML = getDurationC(driverReservation.trip_start_datetime, driverReservation.trip_end_datetime);
    tripDurationPrint.innerHTML = getDurationC(driverReservation.trip_start_datetime, driverReservation.trip_end_datetime);

    //trip km
    lblTripKmPayment.innerHTML = tripDistance + ' Km'
    tripDistancePrint.innerHTML = tripDistance + ' Km'

}

function txtCashPaymentCH() {
    if (parseFloat(txtCashPayment.value) >= totalPayable) {
        cash = parseFloat(txtCashPayment.value).toFixed(2);
        validF(txtCashPayment);
        btnCollectCash.disabled = false;

        //change
        change = cash - totalPayable;
        lblChange.innerHTML = parseFloat(change).toFixed(2);
        changePrint.innerHTML = parseFloat(change).toFixed(2);
        paid = totalPayable;
    } else {
        invalidF(txtCashPayment);
        btnCollectCash.disabled = true;
        cash=0.00;
        lblChange.innerHTML = '-';
        changePrint.innerHTML = '-';
        change = 0.00;
        paid=0.00;
    }
}

function btnCollectCashCH() {
    cdPayment = new Object();

    //nextPayInvoiceNo
    var payObject= httpRequest("../customer_payment/next_pay_invoice_no", "GET");

    //reservaton type
    for (index in reservation_types) {
        var cdReservationType;
        if (reservation_types[index].id == 1) {
            cdReservationType = reservation_types[index];
            break;
        }
    }

    //payment status
    for (index in payment_statuses) {
        var paidToDriverPayStatus;
        if (payment_statuses[index].id == 3) {
            paidToDriverPayStatus = payment_statuses[index];
            break;
        }
    }

    cdPayment.invoice_number = payObject.invoice_number;
    cdPayment.reservation_type_id = cdReservationType;
    cdPayment.chauffeur_drive_reservation_id = driverReservation;
    cdPayment.rental_period_charge = packagePrice;
    cdPayment.additional_hour_charges_total = addtionalHourCharge;
    cdPayment.additional_km_charges_total = additionalKmsCharge;
    cdPayment.pick_up_charge = pickUPCharge;
    cdPayment.total_payable = totalPayable;
    cdPayment.cash = cash;
    cdPayment.change_amount = change;
    cdPayment.paid = paid;
    cdPayment.due_balance = dueBalance;
    cdPayment.payment_status_id = paidToDriverPayStatus;
    cdPayment.paid_date_time = getCurrentDateTime('datetime');
    cdPayment.employee_id = session.getObject('activeuser').employeeId;

    //update reservation details
    cdPayment.chauffeur_drive_reservation_id.rental_amount = totalPayable;
    cdPayment.chauffeur_drive_reservation_id.reservation_status_id.id = 3;
    cdPayment.chauffeur_drive_reservation_id.paid_amount = cdPayment.paid;
    cdPayment.chauffeur_drive_reservation_id.due_balance = cdPayment.due_balance;
    cdPayment.chauffeur_drive_reservation_id.payment_status_id.id = 3;

    //update vehicle details
    cdPayment.chauffeur_drive_reservation_id.vehicle_id = driverReservation.vehicle_id;
    cdPayment.chauffeur_drive_reservation_id.vehicle_id.current_odometer = driverReservation.drop_off_odometer;
    cdPayment.chauffeur_drive_reservation_id.vehicle_id.vehicle_status_id.id = 1;

    //update driver details
    cdPayment.chauffeur_drive_reservation_id.driver_id = driverReservation.driver_id;
    cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km += tripDistance;
    cdPayment.chauffeur_drive_reservation_id.driver_id.driver_status_id.id = 1;
    // set driver level
    if(cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km >= 500 && cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km < 1000){
        cdPayment.chauffeur_drive_reservation_id.driver_id.level = 2;
    }else if(cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km >= 1000 && cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km < 5000){
        cdPayment.chauffeur_drive_reservation_id.driver_id.level = 3;
    }else if(cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km >= 5000 && cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km < 10000){
        cdPayment.chauffeur_drive_reservation_id.driver_id.level = 4;
    }else if(cdPayment.chauffeur_drive_reservation_id.driver_id.drove_trip_km >= 10000){
        cdPayment.chauffeur_drive_reservation_id.driver_id.level = 5;
    }

    swal({
        title: "Please Confirm Payment...",
        text: "\nReservation No: " + driverReservation.cd_reservation_code +
            "\nTotal Payable : " + "Rs " + totalPayable +
            "\nCash : " + cash +
            "\nChange : " + change,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((save) => { //then: if user click 'Yes' then
        if (save) {
            var responsePay = httpRequest("/customer_payment", "POST", cdPayment);//Post: because it's a Add
            if (responsePay == "0") { //message 0: means successful
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Payment Completed Succesfuly! ',
                    text: '\n',
                    button: false,
                    timer: 2000
                });

                txtCashPayment.disabled = true;
                btnCollectCash.disabled = true;
                btnPrintPayment.disabled = false;

                fillReceipt();
                $('#paymentPrintModal').modal('show');

                //call print
                // activepage = 1;
                // activerowno = activerowindex;
                initialize();
                selectRow(tblCDReservation, activerowindex, active);

            } else swal({
                title: 'Payment is Unsuccessful, You have following errors', icon: "error",
                text: '\n ' + responsePay,
                button: true
            });
        }
    });
}

function fillReceipt() {
    driverPrint.innerHTML = driverReservation.driver_id.calling_name;
    pickUpPrint.innerHTML = driverReservation.pick_up_location;
    dropOffPrint.innerHTML = driverReservation.drop_off_location;
    invoiceNoPrint.innerHTML = cdPayment.invoice_number;
    dateTimePrint.innerHTML = 'Date: ' + sqlDateTimeToLocalC(cdPayment.paid_date_time);
    cashAmountPrint.innerHTML = cdPayment.cash;

}

function paginate(page) {
    var paginate = true;
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
function btnPrintRowMC() {
    var format = printformtable.outerHTML; //outerHTML: Structure of printformtable

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        "<link rel='stylesheet' href='../vendor/bootstrap/css/bootstrap.min.css'></head>" + // use '' in ""
        "<link rel='stylesheet' href='../css/driver_portal.css'></head>" + // use '' in ""
        "<body>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        // newwindow.close();
    }, 100);

    //enable back to table link
    backToTablePayment.classList.remove('d-none');
    backToTableStart.classList.remove('d-none');

    $('#reservationCarousel').carousel('next');
}


//Load Initial Form
function loadForm() {
    onGoing = false;

    fillTable('tblCDReservation', cdReservations, fillForm, btnDeleteMC, viewitem, null, null, moveFirstSide);

    for (index in cdReservations) {

        if (cdReservations[index].reservation_status_id.id == 7) {
            tblCDReservation.children[1].children[index].style.background = update;
        }

    }

}

//Change Color of Attributes
function setStyle(style) {}

//Disable Buttons by privilege and status
function disableButtons(add, upd, del) {}

//Get Errors of Required Fields
function getErrors() {}

//Button Add - Get confirmation on optional empty fields
function btnAddMC() {}

//Get Confirmation & Add
function savedata() {}

function btnClearMC() {}

//Fill Form - Get confirmation on second time update
function fillForm(ctm, rowno) {}

//Fill Data on Update
function filldata(ctm) {}

//Check for Updated Values
function getUpdates() {}

//Get confirmation & Update
function btnUpdateMC() {}

function btnDeleteMC(ctm) {}

//Set the Query & Pass to LoadTable
function loadSearchedTable(color = null) {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=&userid=" + session.getObject("activeuser").employeeId.id

    if (searchtext != "")
        query = "&searchtext=" + searchtext + "&userid=" + session.getObject("activeuser").employeeId.id;
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