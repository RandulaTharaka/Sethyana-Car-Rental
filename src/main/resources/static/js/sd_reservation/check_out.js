function openCheckOutTab(){     // First Time Paying - Show Payment & Agrement
    navCheckOut.classList.remove('d-none');
    $(checkOutTab).tab('show'); // focus check out tab

    lblRefDepositPayCHO.innerHTML = "Refundable Deposit";

    //Fill Payment Card//
    lblResNoPayCHO.innerHTML = oldSDReservation.sd_reservation_code;

    const nextInvoicePayObj = httpRequest("../customer_payment/next_pay_invoice_no", "GET");
    if (nextInvoicePayObj) {
        customerPayment.invoice_number = nextInvoicePayObj.invoice_number;
        lblInvoiceNoPayCHO.innerHTML = customerPayment.invoice_number;
    }

    if (oldSDReservation.customer_id.customer_type_id.id == 1) {
        lblCustomerPayCHO.innerHTML = oldSDReservation.customer_id.first_name + " " + oldSDReservation.customer_id.last_name;
    } else if (oldSDReservation.customer_id.customer_type_id.id == 2) {
        lblCustomerPayCHO.innerHTML = oldSDReservation.customer_id.company_name;
    }



    requiredRentalDaysChargeCHO = 0.00;
    requiredAdditionalHourChargeCHO = 0.00;
    pickUpChargeCHO = 0.00;
    totalPayableCHO = 0.00;
    minimumAdvance = 0.00;
    cashCHO = 0.00;
    dueBalancePayCHO = 0.00;
    changePayCHO = 0.00;

    //set refundable deposit to not-paid @ Check Out Payment
    if (customerPayment.refundable_deposit_status_id == undefined) {
        customerPayment.refundable_deposit_status_id = refundableDepositStatuses[1]; //1-not paid
    }

    requiredRentalDaysChargeCHO = parseFloat(oldSDReservation.required_rental_days * oldSDReservation.package_price);
    lblRentalDaysChargePayCHO.innerHTML = 'Rs ' + parseFloat(requiredRentalDaysChargeCHO).toFixed(2) + '<br><span class="fw-4">(' + oldSDReservation.required_rental_days + (oldSDReservation.required_rental_days > 1 ? ' Days' : ' Day') + ' X Rs ' + parseFloat(oldSDReservation.package_price).toFixed(2) + ')</span>';

    if (oldSDReservation.required_additional_hours != null) {
        requiredAdditionalHourChargeCHO = parseFloat(oldSDReservation.required_additional_hours * oldSDReservation.additional_hour_price);
        lblAddHourChargePayCHO.innerHTML = 'Rs ' + parseFloat(requiredAdditionalHourChargeCHO).toFixed(2) + '<br><span class="fw-4">(' + oldSDReservation.required_additional_hours + (oldSDReservation.required_additional_hours > 1 ? ' Hours' : ' Hour') + ' X Rs ' + parseFloat(oldSDReservation.additional_hour_price).toFixed(2) + ')</span>';
    } else {
        lblAddHourChargePayCHO.innerHTML = '-';
    }

    if (oldSDReservation.pick_up_charge != null) {
        pickUpChargeCHO = parseFloat(oldSDReservation.pick_up_charge);
        lblPickUpChargePayCHO.innerHTML = 'Rs ' + parseFloat(pickUpChargeCHO).toFixed(2);
    } else {
        lblPickUpChargePayCHO.innerHTML = '-';
    }

    totalPayableCHO = parseFloat(requiredRentalDaysChargeCHO + requiredAdditionalHourChargeCHO + pickUpChargeCHO);
    lblTotalPayablePayCHO.innerHTML = 'Rs ' + parseFloat(totalPayableCHO).toFixed(2);

    // txtAdvancePaidPayCHO.setAttribute('placeholder', 'Rs ' + parseFloat(totalPayableCHO / 2).toFixed(2) + ' minimum');
    minimumAdvance = parseFloat(totalPayableCHO / 2).toFixed(2);
    lblMinimumAdvanceePayCHO.innerHTML = 'Rs ' + minimumAdvance;

    lblRefDepositPayCHO.innerHTML += '<span class="fw-5">(Rs ' + parseFloat(oldSDReservation.package_id.refundable_deposit).toFixed(2) + ')</span>';

    divCheckOutPayment.style.display = "block";

}

// Odometer Out Function
function txtOdometerOutPayCHOCH() {
    if (oldSDReservation.vehicle_id.current_odometer <= parseInt(txtOdometerOutPayCHO.value)) {
        oldSDReservation.pick_up_odometer = parseInt(txtOdometerOutPayCHO.value);
        validF(txtOdometerOutPayCHO);
    } else {
        oldSDReservation.pick_up_odometer = null;
        invalidF(txtOdometerOutPayCHO);
    }
}

// Advance Paid Function
function txtCashPayCHOCH() {
    if (parseFloat(txtCashPayCHO.value) >= minimumAdvance) { // if entered value meeets minimm advance
        cashCHO = parseFloat(txtCashPayCHO.value);
        validF(txtCashPayCHO);
        customerPayment.cash = cashCHO;

        if (parseFloat(txtCashPayCHO.value) < totalPayableCHO) { // if generate arrears
            //set arrears
            dueBalancePayCHO = parseFloat(totalPayableCHO) - parseFloat(cashCHO);
            lblDueBalancePayCHO.innerHTML = 'Rs ' + parseFloat(dueBalancePayCHO).toFixed(2);
            divDueBalancePayCHO.style.display = 'flex';

            //clear change
            divChangePayCHO.style.display = "none";
            changePayCHO = 0.00;
            lblChangePayCHO.innerHTML = '-';

            //set paid
            paidCHO = cashCHO;

        } else if (parseFloat(txtCashPayCHO.value) == totalPayableCHO) { // if equal
            //set both arrears & change
            dueBalancePayCHO = parseFloat(totalPayableCHO) - parseFloat(cashCHO);
            lblDueBalancePayCHO.innerHTML = 'Rs ' + parseFloat(dueBalancePayCHO).toFixed(2);
            divDueBalancePayCHO.style.display = 'flex';

            changePayCHO = parseFloat(txtCashPayCHO.value) - totalPayableCHO;
            lblChangePayCHO.innerHTML = 'Rs ' + parseFloat(changePayCHO).toFixed(2);
            divChangePayCHO.style.display = "flex";

            //set paid
            paidCHO = cashCHO;

        } else { // if generate change
            //set change
            changePayCHO = parseFloat(txtCashPayCHO.value) - totalPayableCHO;
            lblChangePayCHO.innerHTML = 'Rs ' + parseFloat(changePayCHO).toFixed(2);
            divChangePayCHO.style.display = "flex";

            //clear arrears
            divDueBalancePayCHO.style.display = 'none';
            dueBalancePayCHO = 0.00;
            lblDueBalancePayCHO.innerHTML = '-';

            //set paid
            paidCHO = totalPayableCHO;
        }


    } else if (parseFloat(txtCashPayCHO.value) < minimumAdvance) { // doesen't meeets minimm advance
        cashCHO = null;
        invalidF(txtCashPayCHO);
        customerPayment.cash = null;

        //clear both arrears and change
        divDueBalancePayCHO.style.display = 'none';
        divChangePayCHO.style.display = "none";
        dueBalancePayCHO = 0.00;
        changePayCHO = 0.00;
        lblDueBalancePayCHO.innerHTML = '-';
        lblChangePayCHO.innerHTML = '-';

        //set paid
        paidCHO = 0.00;
    }

}

//Refundable Deposit Function
function chkRefundableDepositPayCHOCH() {
    if (chkRefundableDepositPayCHO.checked) {
        customerPayment.refundable_deposit_status_id = refundableDepositStatuses[0];
    } else {
        customerPayment.refundable_deposit_status_id = refundableDepositStatuses[1];
    }
}

//Get Errors : Check Out Payment
function getErrorsPayCHO() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    //check errors by bind item property value
    if (oldSDReservation.pick_up_odometer == null) {
        invalidF(txtOdometerOutPayCHO);
        errors = errors + "\n" + "Odometer Out Not Entered.";
    } else addvalue = 1;

    if (customerPayment.cash == null) {
        invalidF(txtCashPayCHO);
        errors = errors + "\n" + "Paid Amount Not Entered.";
    } else addvalue = 1;

    if (customerPayment.refundable_deposit_status_id.id == 2) {
        errors = errors + "\n" + "Refundable Deposit Not Paid";
    } else addvalue = 1;

    return errors;
}

//Add Payment Check Out
function btnAddPaymentCHOCH() {
    if (getErrorsPayCHO() == "") { //if no errors

        //bind values - customer payment
        customerPayment.reservation_type_id = getReservationType(2);
        customerPayment.self_drive_reservation_id = oldSDReservation;
        customerPayment.required_rental_period_charge = requiredRentalDaysChargeCHO;
        customerPayment.required_additional_hour_charges_total = requiredAdditionalHourChargeCHO;
        customerPayment.pick_up_charge = pickUpChargeCHO;
        customerPayment.total_payable = totalPayableCHO;
        customerPayment.change_amount = changePayCHO;
        customerPayment.paid = paidCHO;
        customerPayment.due_balance = dueBalancePayCHO;
        customerPayment.payment_status_id = getPaymentStatus(2);
        customerPayment.paid_date_time = getCurrentDateTime('datetime');
        customerPayment.employee_id = session.getObject('activeuser').employeeId;

        //update sdreservation details
        customerPayment.self_drive_reservation_id.pick_up_odometer = oldSDReservation.pick_up_odometer; //2-advance paid
        customerPayment.self_drive_reservation_id.reservation_status_id.id = 7; // 7 = on-rent
        customerPayment.self_drive_reservation_id.rental_amount = totalPayableCHO;
        customerPayment.self_drive_reservation_id.paid_amount = customerPayment.paid;
        customerPayment.self_drive_reservation_id.due_balance = customerPayment.due_balance;
        customerPayment.self_drive_reservation_id.payment_status_id.id = 2; //2-advance paid

        //update vehicle details
        customerPayment.self_drive_reservation_id.vehicle_id = oldSDReservation.vehicle_id;
        customerPayment.self_drive_reservation_id.vehicle_id.current_odometer = oldSDReservation.pick_up_odometer;
        customerPayment.self_drive_reservation_id.vehicle_id.vehicle_status_id.id = 3; //3-on rent

        oldSDReservation.reservation_status_id.id = 7;

        swal({
            title: "Please confirm payment...",
            text: "\nInvoice No: " + customerPayment.invoice_number +
                "\nReservation No : " + oldSDReservation.sd_reservation_code +
                "\nOdometer Out : " + oldSDReservation.pick_up_odometer + ' Km' +
                "\nTotal : " + 'Rs ' + parseFloat(customerPayment.total_payable).toFixed(2) +
                "\nPaid Amount: " + 'Rs ' + parseFloat(customerPayment.paid).toFixed(2) +
                "\nRefundable Deposit: " + customerPayment.refundable_deposit_status_id.name +
                "\nPaid Date : " + sqlDateTimeToLocalC(customerPayment.paid_date_time) +
                "\nReceived By : " + customerPayment.employee_id.callingname,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((save) => { //then: if user click 'Yes' then
            if (save) {
                var response = httpRequest("/customer_payment", "POST", customerPayment);//Post: because it's a Add
                if (response == "0") { //message 0: means successful
                    swal({
                        position: 'center',
                        icon: 'success',
                        title: 'Payment Successful!',
                        text: '\n',
                        button: false,
                        timer: 1800
                    });
                    // activepage = 1;
                    // activerowno = 1; //1: highlight added row which is 1 row
                    loadSearchedTable(update);
                    showRentalAgreement();
                    setReservationStatus('onRent');
                    disableElements();
                } else swal({ // if payment not success
                    title: 'Payment not Success... , You have following errors', icon: "error",
                    text: '\n ' + response,
                    button: true
                });
            }
        });
    } else { // if has errors
        swal({
            title: "You have following errors",
            text: "\n" + getErrorsPayCHO(),
            icon: "error",
            button: true,
        });
    }


}

function showRentalAgreement() {

    //Get Paid Advance Payment Object for current Reservation
    advancePayment = httpRequest("../customer_payment/advance_payment?reservation_id=" + oldSDReservation.id, "GET");
    if(advancePayment != ""){
        //Header
        spnReservationNoPrint.innerHTML = advancePayment.self_drive_reservation_id.sd_reservation_code;
        spnInvoiceNoPrint.innerHTML = advancePayment.invoice_number;
        spnIssuedeNoPrint.innerHTML = sqlDateTimeToLocalC(advancePayment.paid_date_time);

        //Customer Details
        if (advancePayment.self_drive_reservation_id.customer_id.customer_type_id.id == 1) { // Individual
            spnCustomerNamePrint.innerHTML = advancePayment.self_drive_reservation_id.customer_id.first_name + ' ' + advancePayment.self_drive_reservation_id.customer_id.last_name;
            spnCustomerPhonePrint.innerHTML = advancePayment.self_drive_reservation_id.customer_id.phone;
            spnCustomerAddressPrint.innerHTML = advancePayment.self_drive_reservation_id.customer_id.address;
            spnCustomerLicensePrint.innerHTML = advancePayment.self_drive_reservation_id.customer_id.license_no;
            spnCustomerLicenseExpireDatePrint.innerHTML = sqlDateTimeToLocalC(advancePayment.self_drive_reservation_id.customer_id.license_exp_date);
            divCompanyCusPrint.style.display = "none";
            divIndividualCusPrint.style.display = "block";
        } else if (advancePayment.self_drive_reservation_id.customer_id.customer_type_id.id == 2) { // Company
            spnCompanyNamePrint.innerHTML = oldCDReservation.customer_id.company_name;
            spnCompanyAddressPrint.innerHTML = oldCDReservation.customer_id.company_address;
            spnCompanyCPPrint.innerHTML = oldCDReservation.customer_id.contact_person_name;
            spnCompanyCPPhonePrint.innerHTML = oldCDReservation.customer_id.contact_person_phone;
            spnCompanyCPNICPrint.innerHTML = oldCDReservation.customer_id.contact_person_nic;
            divIndividualCusPrint.style.display = "none";
            divCompanyCusPrint.style.display = "block";
        }

        //Vehicle Details
        vModelPrint.innerHTML = advancePayment.self_drive_reservation_id.vehicle_id.model_id.brand_id.name + ' ' + advancePayment.self_drive_reservation_id.vehicle_id.model_id.name;
        vLicenseNoPrint.innerHTML = advancePayment.self_drive_reservation_id.vehicle_id.license_plate;
        vSeatsPrint.innerHTML = advancePayment.self_drive_reservation_id.vehicle_id.num_of_seats;
        vLuggagePrint.innerHTML = advancePayment.self_drive_reservation_id.vehicle_id.num_of_luggage + ' Bags';
        vColorPrint.innerHTML = advancePayment.self_drive_reservation_id.vehicle_id.color_id.name;


        //Package  Details
        pkgCodePrint.innerHTML = advancePayment.self_drive_reservation_id.package_id.package_code;
        pkgKmPrint.innerHTML = +advancePayment.self_drive_reservation_id.package_km + ' Km';
        pkgPricePrint.innerHTML = 'Rs ' + parseFloat(advancePayment.self_drive_reservation_id.package_price).toFixed(2);
        pkgAddKmPricePrint.innerHTML = 'Rs ' + parseFloat(advancePayment.self_drive_reservation_id.additional_km_price).toFixed(2);
        pkgAddHourPricePrint.innerHTML = 'Rs ' + parseFloat(advancePayment.self_drive_reservation_id.additional_hour_price).toFixed(2);
        pkgRefDepositPrint.innerHTML = 'Rs ' + parseFloat(advancePayment.self_drive_reservation_id.package_refundable_deposit).toFixed(2);

        //Reservation Details
        if (advancePayment.self_drive_reservation_id.pick_up_location_id.id == 1) {
            pickUpLocationPrint.innerHTML = advancePayment.self_drive_reservation_id.pick_up_location_id.name;
        } else if (advancePayment.self_drive_reservation_id.pick_up_location_id.id == 2) {
            pickUpLocationPrint.innerHTML = advancePayment.self_drive_reservation_id.other_pick_up_location;
        }
        returnLocationPrint.innerHTML = advancePayment.self_drive_reservation_id.return_location_id.name;
        pickDateTimePrint.innerHTML = sqlDateTimeToLocalC(advancePayment.self_drive_reservation_id.pick_up_datetime);
        returnDateTimePrint.innerHTML = sqlDateTimeToLocalC(advancePayment.self_drive_reservation_id.expect_return_datetime);
        rentalDaysPrint.innerHTML = advancePayment.self_drive_reservation_id.required_rental_days + ' Day';
        addHoursPrint.innerHTML = (advancePayment.self_drive_reservation_id.required_additional_hours !== null ? advancePayment.self_drive_reservation_id.required_additional_hours + ' Hour' : 'none') ;
        odometerOutPrint.innerHTML = advancePayment.self_drive_reservation_id.pick_up_odometer + ' Km';

        //Charge Details
        rentalDayChargePrint.innerHTML = "Rs " + parseFloat(advancePayment.required_rental_period_charge).toFixed(2) + '</br>(' + advancePayment.self_drive_reservation_id.required_rental_days + (advancePayment.self_drive_reservation_id.required_rental_days > 1 ? ' Days' : ' Day')+ ' X Rs ' + parseFloat(advancePayment.self_drive_reservation_id.package_price).toFixed(2) + ')';
        if(advancePayment.required_additional_hour_charges_total !== 0){
            addHourChargePrint.innerHTML = "Rs " + parseFloat(advancePayment.required_additional_hour_charges_total).toFixed(2) + '</br>(' + (advancePayment.self_drive_reservation_id.required_additional_hours > 1 ? ' Hours' : ' Hour') + ' X Rs ' + parseFloat(advancePayment.self_drive_reservation_id.additional_hour_price).toFixed(2) + ')';
        }else{
            addHourChargePrint.innerHTML = "Rs " + parseFloat(advancePayment.required_additional_hour_charges_total).toFixed(2);
        }
        pickUpChargePrint.innerHTML = "Rs " + parseFloat(advancePayment.pick_up_charge).toFixed(2);
        totalChargePrint.innerHTML = "Rs " + parseFloat(advancePayment.total_payable).toFixed(2);
        paidAdvancePrint.innerHTML = "Rs " + parseFloat(advancePayment.paid).toFixed(2);
        dueBalancePrint.innerHTML = "Rs " + parseFloat(advancePayment.due_balance).toFixed(2);
        refDepositPrint.innerHTML = "Rs " + parseFloat(advancePayment.self_drive_reservation_id.package_refundable_deposit).toFixed(2) + ' (' + advancePayment.refundable_deposit_status_id.name + ')';

        spnAuthorizedByPrint.innerHTML = advancePayment.employee_id.callingname;

        //showcase
        hidePaymentCHO();
        divAgreement.style.display = "block"; //show agreement
        btnPrintAgreement.style.visibility = "visible"; //show print button
    }
}

function hidePaymentCHO(){
    divCheckOutPayment.style.display = "none"; // hide payment
    rowCheckOutPayment.classList.remove('justify-content-between');
    rowCheckOutPayment.classList.add('justify-content-center'); // center agreement
}

function showPaymentCHO(){
    divAgreement.style.display = "none"; //hide agreement
    btnPrintAgreement.style.visibility = "hidden"; //hide print button
    divCheckOutPayment.style.display = "block"; //show payment
    rowCheckOutPayment.classList.remove('justify-content-center'); //justify content between
    rowCheckOutPayment.classList.add('justify-content-between');
}

//Print Agreement
function btnPrintAgreementMC() {
    var format = printAgreement.outerHTML; //outerHTML: Structure of printformtable
    var format2 = printConditions.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        "<link rel='stylesheet' href='../../vendor/bootstrap/css/bootstrap2.min.css'>" +
        "<link rel='stylesheet' href='../../css/agreement.css'></head>" + // use '' in ""
        "<body>" +
        "<div>" + format + "</div>" +
        "<div>" + format2 + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        // newwindow.close();
    }, 100);
}