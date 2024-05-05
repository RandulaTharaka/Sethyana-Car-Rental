let reservationCHI = {
    granted_km: 0,
    travelled_km: 0,
    additional_km: 0,

    final_rental_days: 0,
    final_additional_hours: 0
};

let customerPaymentCHI = {
    rental_period_charge: 0,
    additional_hour_charges_total: 0,
    additional_km_charges_total: 0,
    pick_up_charge: 0,

    sub_total: 0,
    discount: 0,
    discount_percentage: 0,

    total_payable: 0,
    cash: 0,
    change_amount: 0,
    paid: 0,
    refund_due: 0,
    due_balance: 0,
};

advancedPaidCHI = 0;


function openCheckInTab() {
    showRentalAgreement();
    loadPaymentCardCHI(oldSDReservation);
    focusCheckInTab();
}

function focusCheckInTab(){
    navCheckOut.classList.remove('d-none'); //display check out tab
    navCheckIn.classList.remove('d-none'); //diaply check in tab
    $(checkInTab).tab('show'); //focus check in tab
}

function loadPaymentCardCHI(oldSDReservation) {
    lblResNoPayCHI.innerHTML = oldSDReservation.sd_reservation_code;

    const nextInvoicePayObj = httpRequest("../customer_payment/next_pay_invoice_no", "GET");
    if (nextInvoicePayObj) {
        customerPaymentCHI.invoice_number = nextInvoicePayObj.invoice_number;
        lblInvoiceNoPayCHI.innerHTML = customerPaymentCHI.invoice_number;
    }

    const customerName = getCustomerNameCHI(oldSDReservation.customer_id);
    lblCustomerPayCHI.innerHTML = customerName;

    lblOdometerOutPayCHI.innerHTML = `${oldSDReservation.pick_up_odometer} Km`;

    lblPickUpDateTimePayCHI.innerHTML = sqlDateTimeToChromeFormat(oldSDReservation.pick_up_datetime);

    customerPaymentCHI.pick_up_charge = oldSDReservation.pick_up_charge !== null ? parseFloat(oldSDReservation.pick_up_charge) : 0;
    lblPickUpChargePayCHI.innerHTML = customerPaymentCHI.pick_up_charge !== 0 ? `Rs ${customerPaymentCHI.pick_up_charge.toFixed(2)}` : '-';

    advancedPaidCHI = parseFloat(oldSDReservation.paid_amount);
    lblPaidAdvanceePayCHI.innerHTML = `Rs ${advancedPaidCHI.toFixed(2)}`;

    lblRefDepositPayCHI.innerHTML += oldSDReservation.package_refundable_deposit !== null ?
        `<br>(Rs ${oldSDReservation.package_refundable_deposit.toFixed(2)})</br>` : '';

    divCheckInPayment.style.display = "block";
}

function onChangeOdometerInCHI() {
    const parsedOdometerIn = parseInt(nmbOdometerInPayCHI.value);

    if (
        oldSDReservation.vehicle_id.current_odometer <= parsedOdometerIn &&
        oldSDReservation.pick_up_odometer < parsedOdometerIn
    ) {
        validF(nmbOdometerInPayCHI);
        oldSDReservation.return_odometer = parsedOdometerIn;

        reservationCHI.travelled_km = oldSDReservation.return_odometer - oldSDReservation.pick_up_odometer;
        lblTravelledKmPayCHI.innerHTML = `${reservationCHI.travelled_km} Km`;

        setAdditionalKmCharge();
        setSubTotal();
        onChangeDiscountCHI();
    } else {
        invalidF(nmbOdometerInPayCHI);
        oldSDReservation.return_odometer = null;

        reservationCHI.travelled_km = 0;
        lblTravelledKmPayCHI.innerHTML = "-";

        resetAdditionalKmCharge();
        resetSubTotal();
        resetDiscount();
        resetTotalPayable();
        resetRefundDue();
        resetCash();
    }
}

function onChangeReturnDateCHI() {
    if (new Date(dateTimeReturnPayCHI.value).getTime() > new Date(oldSDReservation.pick_up_datetime).getTime()) {
        validF(dateTimeReturnPayCHI);
        oldSDReservation.return_datetime = dateTimeReturnPayCHI.value;

        lblRentedPeriodPayCHI.innerHTML = getRentedPeriod(oldSDReservation.pick_up_datetime, oldSDReservation.return_datetime);

        reservationCHI.granted_km = oldSDReservation.package_km * reservationCHI.final_rental_days;
        lblGrantedKmPayCHI.innerHTML = `${reservationCHI.granted_km} Km <span class="fw-4">
        (${oldSDReservation.package_km} Km X ${reservationCHI.final_rental_days} ${(reservationCHI.final_rental_days > 1 ? ' Days' : ' Day')})</span>`;

        //check if package is one day basis, which is used to multiply by
        if (oldSDReservation.package_duration_id.id === 13) {
            customerPaymentCHI.rental_period_charge = oldSDReservation.package_price * reservationCHI.final_rental_days;
            lblRentedDaysChargePayCHI.innerHTML = `Rs ${parseFloat(customerPaymentCHI.rental_period_charge).toFixed(2)}
            <span class="fw-4"> (Rs ${parseFloat(oldSDReservation.package_price).toFixed(2)} X 
            ${reservationCHI.final_rental_days} ${(reservationCHI.final_rental_days > 1 ? ' Days' : ' Day')})</span>`;
        } else {
            customerPaymentCHI.rental_period_charge = 0;
            lblRentedDaysChargePayCHI.innerHTML = 'Error: Package is not One Day basis'
        }

        if (reservationCHI.final_additional_hours >= 1) {
            customerPaymentCHI.additional_hour_charges_total = oldSDReservation.additional_hour_price * reservationCHI.final_additional_hours;
            lblAddHourChargePayCHI.innerHTML = `Rs ${customerPaymentCHI.additional_hour_charges_total.toFixed(2)}
            <span class="fw-4"> (Rs ${parseFloat(oldSDReservation.additional_hour_price).toFixed(2)} X 
            ${reservationCHI.final_additional_hours} ${(reservationCHI.final_additional_hours > 1 ? ' Hours' : ' Hour')})</span>`;
        } else {
            customerPaymentCHI.additional_hour_charges_total = 0;
            lblAddHourChargePayCHI.innerHTML = "-";
        }

        setAdditionalKmCharge();
        setSubTotal();
        onChangeDiscountCHI();
    } else {
        invalidF(dateTimeReturnPayCHI);
        oldSDReservation.return_datetime = null;

        reservationCHI.final_rental_days = 0;
        lblRentedPeriodPayCHI.innerHTML = "-";

        reservationCHI.granted_km = 0;
        lblGrantedKmPayCHI.innerHTML = "-";

        customerPaymentCHI.rental_period_charge = 0;
        lblRentedDaysChargePayCHI.innerHTML = "-";

        customerPaymentCHI.additional_hour_charges_total = 0;
        lblAddHourChargePayCHI.innerHTML = "-";

        resetAdditionalKmCharge();
        resetSubTotal();
        resetDiscount();
        resetTotalPayable();
        resetRefundDue();
        resetCash();
    }
}

function setAdditionalKmCharge() {
    reservationCHI.additional_km = reservationCHI.travelled_km - reservationCHI.granted_km;

    /* To calculate additionalKmCharge, it is required to execute both of odometerIn & returnDate onChange functions
        in order to set travelled_km, granted_km and additional_km */
    if (reservationCHI.travelled_km != 0 && reservationCHI.granted_km != 0 && reservationCHI.additional_km > 0) {
        customerPaymentCHI.additional_km_charges_total = parseFloat(oldSDReservation.additional_km_price * reservationCHI.additional_km);
        lblAddKmChargePayCHI.innerHTML = `Rs ${customerPaymentCHI.additional_km_charges_total.toFixed(2)}<span class="fw-4"> 
        (Rs ${oldSDReservation.additional_km_price.toFixed(2)} X ${reservationCHI.additional_km} Km)</span>`;
    } else {
        reservationCHI.additional_km = 0;
        customerPaymentCHI.additional_km_charges_total = 0;
        lblAddKmChargePayCHI.innerHTML = "-";
    }
}

function resetAdditionalKmCharge() {
    reservationCHI.additional_km = 0;
    customerPaymentCHI.additional_km_charges_total = 0;
    lblAddKmChargePayCHI.innerHTML = "-";
}

function setSubTotal() {
    if (oldSDReservation.return_odometer !== null && oldSDReservation.return_datetime !== null) {
        customerPaymentCHI.sub_total = customerPaymentCHI.rental_period_charge + customerPaymentCHI.additional_hour_charges_total + customerPaymentCHI.additional_km_charges_total + customerPaymentCHI.pick_up_charge;
        lblSubTotalPayCHI.innerHTML = `Rs ${customerPaymentCHI.sub_total.toFixed(2)}`;
    } else {
        customerPaymentCHI.sub_total = 0;
    }
}

function resetSubTotal() {
    customerPaymentCHI.sub_total = 0;
    lblSubTotalPayCHI.innerHTML = "-"
}

function setTotalPayable() {
    if (oldSDReservation.return_odometer !== null && oldSDReservation.return_datetime !== null) {
        customerPaymentCHI.total_payable = customerPaymentCHI.sub_total - (customerPaymentCHI.discount + advancedPaidCHI);

        if (customerPaymentCHI.total_payable < 0) {
            setRefundDue();
        } else {
            lblTotalPayablePayCHI.innerHTML = `Rs ${customerPaymentCHI.total_payable.toFixed(2)}`;
            resetRefundDue();
        }
    } else {
        resetTotalPayable();
        customerPaymentCHI.refund_due = 0;
    }
}

function resetTotalPayable(){
    customerPaymentCHI.total_payable = 0;
    lblTotalPayablePayCHI.innerHTML = `-`;
}

function setRefundDue() {
    divCashPayCHI.classList.add('d-none'); // Hide Cash
    divChangePayCHI.classList.add('d-none'); // Hide Change
    resetCash();

    // Set total_payable Grey
    divTotalPayablePayCHI.classList.remove('text-primary');
    divTotalPayablePayCHI.classList.add('text-secondary');
    lblTotalPayablePayCHI.innerHTML = `Rs 0.00`;

    customerPaymentCHI.refund_due = Math.abs(customerPaymentCHI.total_payable);
    lblRefundDuePayCHI.innerHTML = `Rs ${customerPaymentCHI.refund_due.toFixed(2)}`;
    divRefundDuePayCHI.classList.remove('d-none'); // Display Refund Due
}

function resetRefundDue(){
    customerPaymentCHI.refund_due = 0;

    // Set total_payable color primary
    divTotalPayablePayCHI.classList.remove('text-secondary');
    divTotalPayablePayCHI.classList.add('text-primary');

    divRefundDuePayCHI.classList.add('d-none'); // Hide Refund Due
    divCashPayCHI.classList.remove('d-none'); // Show Cash
}

function onChangeDiscountCHI() {
    if (customerPaymentCHI.sub_total !== 0) {
        const regex = /^(?:[0-9]+(?:\.[0-9]{1,2})?)?$/;
        const inputDiscount = txtDiscountPayCHI.value;

        if (regex.test(inputDiscount)) {
            let floatedDiscount = parseFloat(inputDiscount);
            const allowedMaxDiscount = customerPaymentCHI.sub_total * 0.1; // 10% of sub_total

            // Ensure the discount is within the allowed range (0-10%)
            if (floatedDiscount >= 0 && floatedDiscount <= allowedMaxDiscount) {
                validF(txtDiscountPayCHI);
                customerPaymentCHI.discount = floatedDiscount;

                let discountWithTwoDecimals = floatedDiscount.toFixed(2);
                // Update the field only if it has changed
                if (discountWithTwoDecimals !== inputDiscount) {
                    txtDiscountPayCHI.value = discountWithTwoDecimals;
                }

                customerPaymentCHI.discount_percentage = Number(((customerPaymentCHI.discount / customerPaymentCHI.sub_total) * 100));
                nmbDiscountPercentagePayCHI.value = customerPaymentCHI.discount_percentage.toFixed(2);
            } else {
                // If the field is not empty, calls the resetDiscount(invalidF=true) if not resetDiscount(invalidF=false)
                resetDiscount(inputDiscount !== "");
            }
        } else {
            resetDiscount(true);
        }
    } else {
        resetDiscount();
    }
    setTotalPayable();
    onChangeCashCHI();
}


function onChangeDiscountPercentageCHI() {
    const inputDiscPercentage = nmbDiscountPercentagePayCHI.value;
    let floatedDiscPercentage = parseFloat(inputDiscPercentage);

    if (!isNaN(floatedDiscPercentage) && customerPaymentCHI.sub_total !== 0) {

        // Ensure the value is within the allowed range
        floatedDiscPercentage = Math.min(10, Math.max(0, floatedDiscPercentage));

        let discPercentageWithTwoDecimals = floatedDiscPercentage.toFixed(2);
        // Update the field only if it has changed
        if (discPercentageWithTwoDecimals !== inputDiscPercentage) {
            nmbDiscountPercentagePayCHI.value = discPercentageWithTwoDecimals;
        }

        // Update Discount field
        customerPaymentCHI.discount_percentage = parseFloat(discPercentageWithTwoDecimals);
        customerPaymentCHI.discount = customerPaymentCHI.sub_total * (customerPaymentCHI.discount_percentage / 100);
        txtDiscountPayCHI.value = customerPaymentCHI.discount.toFixed(2);
        validF(txtDiscountPayCHI);
    } else {
        resetDiscount();
        nmbDiscountPercentagePayCHI.value = "0.00";
    }
    setTotalPayable();
    onChangeCashCHI();
}

function resetDiscount(invalidFunction = false) {
    if (invalidFunction) {
        invalidF(txtDiscountPayCHI);
    } else {
        initialF(txtDiscountPayCHI);
        txtDiscountPayCHI.value = "";
    }

    customerPaymentCHI.discount = 0;
    nmbDiscountPercentagePayCHI.value = "";
    customerPaymentCHI.discount_percentage = 0;
}

function onChangeCashCHI() {
    const regex = /^(?:[0-9]+(?:\.[0-9]{1,2})?)?$/;
    const inputCash = txtCashPayCHI.value;
    let floatedCash = parseFloat(parseFloat(inputCash).toFixed(2));

    if (customerPaymentCHI.total_payable > 0 && inputCash !== '') {

        // Check the validity of the input
        if (regex.test(inputCash) && floatedCash >= customerPaymentCHI.total_payable) {
            validF(txtCashPayCHI);
            customerPaymentCHI.cash = floatedCash;
            customerPaymentCHI.due_balance = 0;
            setPaidAmount(true);

            let cashWithTwoDecimals = floatedCash.toFixed(2);
            // Update the field only if it has changed
            if (cashWithTwoDecimals !== inputCash) {
                txtCashPayCHI.value = cashWithTwoDecimals;
            }

            // Check if there is change
            if (floatedCash > customerPaymentCHI.total_payable) {
                customerPaymentCHI.change_amount = floatedCash - customerPaymentCHI.total_payable;
                lblChangePayCHI.innerHTML = `Rs ${customerPaymentCHI.change_amount.toFixed(2)}`;
                divChangePayCHI.classList.remove('d-none'); // Show Change
            } else {
                resetChange();
            }
        } else {
            resetCash(true);
            customerPaymentCHI.due_balance = !isNaN(floatedCash) ? Math.abs(customerPaymentCHI.total_payable - floatedCash) : 0;
        }
    } else {
        resetCash();
        customerPaymentCHI.due_balance = 0;
    }
}

function resetCash(invalidFuntion = false) {
    if (invalidFuntion) {
        invalidF(txtCashPayCHI);
    } else {
        initialF(txtCashPayCHI);
        txtCashPayCHI.value = '';
    }
    customerPaymentCHI.cash = 0;
    resetChange();
    setPaidAmount();
}

function resetChange() {
    divChangePayCHI.classList.add('d-none'); // Hide Change
    lblChangePayCHI.value = '-';
    customerPaymentCHI.change_amount = 0
}

function setPaidAmount(isCashValid = false){
    if(!isCashValid && customerPaymentCHI.refund_due === 0){
        customerPaymentCHI.paid =0;
    }else{
        customerPaymentCHI.paid = customerPaymentCHI.total_payable;
    }
}

function onToggleRefDepositCHI() {
      if (chkRefDepositPayCHI.checked) {
        customerPaymentCHI.refundable_deposit_status_id = refundableDepositStatuses[2];
    } else {
        customerPaymentCHI.refundable_deposit_status_id = refundableDepositStatuses[3];
    }
}

function onClickAddPaymentCHI() {
    //if no errors
    if (getErrorsPayCardCHI() == "") {

        // Bind values to add a customer payment
        customerPaymentCHI.reservation_type_id = getReservationType(2);
        customerPaymentCHI.self_drive_reservation_id = oldSDReservation;
        customerPaymentCHI.payment_status_id = getPaymentStatus(4);
        customerPaymentCHI.paid_date_time = getCurrentDateTime('datetime');
        customerPaymentCHI.employee_id = session.getObject('activeuser').employeeId;

        // Bind values to update self-drive reseravtion
        customerPaymentCHI.self_drive_reservation_id.reservation_status_id.id = 3; // 3 = Completed
        customerPaymentCHI.self_drive_reservation_id.return_odometer = oldSDReservation.return_odometer;
        customerPaymentCHI.self_drive_reservation_id.return_datetime = oldSDReservation.return_datetime;
        customerPaymentCHI.self_drive_reservation_id.final_rental_days = reservationCHI.final_rental_days;
        customerPaymentCHI.self_drive_reservation_id.final_additional_hours = reservationCHI.final_additional_hours;
        customerPaymentCHI.self_drive_reservation_id.granted_km = reservationCHI.granted_km;
        customerPaymentCHI.self_drive_reservation_id.travelled_km = reservationCHI.travelled_km;
        customerPaymentCHI.self_drive_reservation_id.additional_km = reservationCHI.additional_km;
        customerPaymentCHI.self_drive_reservation_id.rental_amount = customerPaymentCHI.total_payable;
        customerPaymentCHI.self_drive_reservation_id.paid_amount = customerPaymentCHI.paid;
        customerPaymentCHI.self_drive_reservation_id.due_balance = customerPaymentCHI.due_balance;
        customerPaymentCHI.self_drive_reservation_id.payment_status_id.id = 4; // 4 = Completed

        // Bind values to update vehicle
        customerPaymentCHI.self_drive_reservation_id.vehicle_id.current_odometer = oldSDReservation.return_odometer;

        let comingUpSDReservation = httpRequest("../sd_reservation/coming_up_reserved_list_by_vehicle_and_returned_time?vehicle_id=" +
            customerPaymentCHI.self_drive_reservation_id.vehicle_id.id + "&returned_datetime=" + customerPaymentCHI.self_drive_reservation_id.return_datetime, "GET");
        let comingUpCDReservation = httpRequest("../cd_reservation/coming_up_reserved_list_by_vehicle_and_returned_time?vehicle_id=" +
            customerPaymentCHI.self_drive_reservation_id.vehicle_id.id + "&returned_datetime=" + customerPaymentCHI.self_drive_reservation_id.return_datetime, "GET");

        // check if there are coming up reserved reservations for the vehicle.
        if(comingUpSDReservation.length === 0 && comingUpCDReservation.length === 0){
            customerPaymentCHI.self_drive_reservation_id.vehicle_id.vehicle_status_id.id = 1; // 1 = Available
        }else{
            customerPaymentCHI.self_drive_reservation_id.vehicle_id.vehicle_status_id.id = 2; // 2 = Reserved
        }

        // Payment confirm message
        swal({
            title: "Please confirm payment",
            text: `Invoice No: ${customerPaymentCHI.invoice_number}
                   Reservation No : ${oldSDReservation.sd_reservation_code}
                   Customer : ${getCustomerNameCHI(oldSDReservation.customer_id)}
                   ------------------------------------------------
                   Odometer In : ${oldSDReservation.return_odometer} Km
                   Return Date : ${sqlDateTimeToChromeFormat(oldSDReservation.return_datetime)}
                   ------------------------------------------------
                   Sub Total : Rs ${customerPaymentCHI.sub_total.toFixed(2)}
                   Paid Advance : Rs ${advancedPaidCHI.toFixed(2)}
                   Discount : Rs ${customerPaymentCHI.discount.toFixed(2)} | ${customerPaymentCHI.discount_percentage.toFixed(2)}% 
                   ------------------------------------------------
                   ${getTotalAndRefundDueForSwalPayConfirmation()}
                   Refundable Deposit : ${customerPaymentCHI.refundable_deposit_status_id.name}
                   ------------------------------------------------
                   Received By : ${customerPaymentCHI.employee_id.callingname}`,
            icon: "warning",
            buttons: {
                cancel: {
                    text: "Cancel",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "Confirm",
                    value: true,
                    visible: true,
                    className: "swl-button-primary",
                    closeModal: true,
                }
            },
            dangerMode: true,
            closeOnClickOutside: false,
        }).then((save) => { //then: if user click 'Yes' then
            if (save) {
                var response = httpRequest("/customer_payment", "POST", customerPaymentCHI);//Post: because it's a Add
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
                    loadReceiptCHI();
                    setReservationStatus('complete');
                } else swal({ // if payment not success
                    title: `Payment not Success...
                            You have following errors`,
                    icon: "error",
                    text: '\n ' + response,
                    buttons: {
                        cancel: "Close"
                    }
                });
            }
        });
    } else { // if has errors
        swal({
            title: "You have following errors",
            text: "\n" + getErrorsPayCardCHI(),
            icon: "error",
            buttons: {
                cancel: "Close"
            },
        });
    }
}

function getErrorsPayCardCHI() {

    let errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

// Check errors by binded reservation's property value
    if (oldSDReservation.return_odometer === null) {
        invalidF(nmbOdometerInPayCHI);
        errors = errors + "\n" + "Odometer In Not Entered.";
    } else addvalue = 1;

    if (oldSDReservation.return_datetime === null) {
        invalidF(dateTimeReturnPayCHI);
        errors = errors + "\n" + "Return Date & Time Not Entered.";
    } else addvalue = 1;

    if ((customerPaymentCHI.total_payable > 0 && customerPaymentCHI.cash === 0) ||
        (oldSDReservation.return_odometer === null || oldSDReservation.return_datetime === null))
    {
        invalidF(txtCashPayCHI);
        errors = errors + "\n" + "Cash Not Entered.";
    } else addvalue = 1;

    if (!chkRefDepositPayCHI.checked) {
        errors = errors + "\n" + "Refundable Deposit Not Returned.";
    } else addvalue = 1;

    return errors;
}

function loadReceiptCHI() {

    //Get Paid Advance Payment Object for current Reservation
    completedPayment = httpRequest("../customer_payment/completed_payment?reservation_id=" + oldSDReservation.id, "GET");
    if(completedPayment != ""){
        //Header
        spnReservationNoPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.sd_reservation_code;
        spnInvoiceNoPrintCHI.innerHTML = completedPayment.invoice_number;
        spnIssuedeNoPrintCHI.innerHTML = sqlDateTimeToLocalC(completedPayment.paid_date_time);

        //Reservation Details
        if (completedPayment.self_drive_reservation_id.customer_id.customer_type_id.id == 1) { // Individual
            spnCustomerNamePrintCHI.innerHTML = completedPayment.self_drive_reservation_id.customer_id.first_name + ' ' + completedPayment.self_drive_reservation_id.customer_id.last_name;
            spnCustomerPhonePrintCHI.innerHTML = completedPayment.self_drive_reservation_id.customer_id.phone;
            divCompanyCusPrintCHI.style.display = "none";
            divIndividualCusPrintCHI.style.display = "block";
        } else if (completedPayment.self_drive_reservation_id.customer_id.customer_type_id.id == 2) { // Company
            spnCompanyNamePrintCHI.innerHTML = oldCDReservation.customer_id.company_name;
            spnCompanyCPPhonePrintCHI.innerHTML = oldCDReservation.customer_id.contact_person_phone;
            divIndividualCusPrintCHI.style.display = "none";
            divCompanyCusPrintCHI.style.display = "block";
        }

        vModelPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.vehicle_id.model_id.brand_id.name + ' ' + completedPayment.self_drive_reservation_id.vehicle_id.model_id.name;
        vLicenseNoPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.vehicle_id.license_plate;

        if (completedPayment.self_drive_reservation_id.pick_up_location_id.id == 1) {
            pickUpLocationPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.pick_up_location_id.name;
        } else if (completedPayment.self_drive_reservation_id.pick_up_location_id.id == 2) {
            pickUpLocationPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.other_pick_up_location;
        }
        returnLocationPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.return_location_id.name;

        pickDateTimePrintCHI.innerHTML = sqlDateTimeToLocalC(completedPayment.self_drive_reservation_id.pick_up_datetime);
        returnDateTimePrintCHI.innerHTML = sqlDateTimeToLocalC(completedPayment.self_drive_reservation_id.return_datetime);
        rentalDaysPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.final_rental_days + ' Day';
        if(completedPayment.self_drive_reservation_id.final_additional_hours !== null && completedPayment.self_drive_reservation_id.final_additional_hours !== 0){
            addHoursPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.final_additional_hours > 1 ? ' Hours' : ' Hour';
        }else{
            addHoursPrintCHI.innerHTML = 'none';
        }

        odometerOutPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.pick_up_odometer + ' Km';
        odometerInPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.return_odometer + ' Km';
        travelledKmPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.travelled_km + ' Km';
        grantedKmPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.granted_km + ' Km';
        if(completedPayment.self_drive_reservation_id.additional_km !== null && completedPayment.self_drive_reservation_id.additional_km !== 0){
            additionalKmPrintCHI.innerHTML = completedPayment.self_drive_reservation_id.additional_km + ' Km';
        }else{
            additionalKmPrintCHI.innerHTML = 'none';
        }

        //Charge Details
        rentalDayChargePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.rental_period_charge).toFixed(2) + '</br>(' + completedPayment.self_drive_reservation_id.final_rental_days + ' Day X Rs ' + parseFloat(completedPayment.self_drive_reservation_id.package_price).toFixed(2) + ')';
        if(completedPayment.additional_hour_charges_total !== 0){
            addHourChargePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.additional_hour_charges_total).toFixed(2) + '</br>(' + completedPayment.self_drive_reservation_id.final_additional_hours + ' Hour X Rs ' + parseFloat(completedPayment.self_drive_reservation_id.additional_hour_price).toFixed(2) + ')';
        }else{
            addHourChargePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.additional_hour_charges_total).toFixed(2);
        }

        if(completedPayment.additional_km_charges_total !== 0){
            addKmChargePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.additional_km_charges_total).toFixed(2) + '</br>(' + completedPayment.self_drive_reservation_id.additional_km + ' Km X Rs ' + parseFloat(completedPayment.self_drive_reservation_id.additional_km_price).toFixed(2) + ')';
        }else{
            addKmChargePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.additional_km_charges_total).toFixed(2);
        }
        pickUpChargePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.pick_up_charge).toFixed(2);
        subTotalPrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.sub_total).toFixed(2);
        discountPrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.discount).toFixed(2) + " | " + completedPayment.discount_percentage + "%";
        advancePaymentforCHIBill = httpRequest("../customer_payment/advance_payment?reservation_id=" + oldSDReservation.id, "GET");
        paidAdvancePrintCHI.innerHTML = "Rs " + parseFloat(advancePaymentforCHIBill.paid).toFixed(2);
        totalChargePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.total_payable).toFixed(2);
        paidAmountPrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.paid).toFixed(2);
        balanceDuePrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.due_balance).toFixed(2);
        if(completedPayment.payment_status_id.id === 4){
            paidStatusPrintCHI.innerHTML = "Paid Fully ";
        }
        refDepositPrintCHI.innerHTML = "Rs " + parseFloat(completedPayment.self_drive_reservation_id.package_refundable_deposit).toFixed(2) + ' (' + completedPayment.refundable_deposit_status_id.name + ')';

        spnAuthorizedByPrintCHI.innerHTML = completedPayment.employee_id.callingname;

        // showcase
        hidePaymentCHI();
        divRecieptCHI.style.display = "block"; //show agreement
        btnPrintCheckInBill.style.visibility = "visible"; //show print button
    }
}

function btnPrintCheckInBillMC() {
      var format = printRecieptCHI.outerHTML; //outerHTML: Structure of printformtable

      var newwindow = window.open();
      newwindow.document.write("<html>" +
          "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
          "<link rel='stylesheet' href='../../vendor/bootstrap/css/bootstrap2.min.css'>" +
          "<link rel='stylesheet' href='../../css/agreement.css'></head>" + // use '' in ""
          "<body>" +
          "<div>" + format + "</div>" +
          "<script>printformtable.removeAttribute('style')</script>" +
          "</body></html>");
      setTimeout(function () {
          newwindow.print();
          // newwindow.close();
      }, 100);
}



function getRentedPeriod(firstDate, secondDate) {
    if (firstDate != "" && secondDate != "") {
        var pickDateTime = new Date(firstDate);
        var returnDateTime = new Date(secondDate);
        var difference = returnDateTime.getTime() - pickDateTime.getTime();

        var numOfDays = Math.floor(difference / day);
        var numOfHours = Math.floor((difference % day) / hour);
        var numOfMinute = Math.floor((difference % hour) / minute);

        reservationCHI.final_rental_days = numOfDays;
        reservationCHI.final_additional_hours = numOfHours;

        if (numOfDays <= 0) {
            numOfDays = "";
        } else if (numOfDays == 1) {
            numOfDays += " Day ";
        } else {
            numOfDays += " Days ";
        }

        if (numOfHours <= 0) {
            numOfHours = "";
        } else if (numOfHours == 1) {
            numOfHours += " Hour ";
        } else {
            numOfHours += " Hours ";
        }

        return (numOfDays + numOfHours);
    }
}

function getCustomerNameCHI(customer_id) {
    if (customer_id.customer_type_id.id == 1) {
        return `${customer_id.first_name} ${customer_id.last_name}`;
    } else if (customer_id.customer_type_id.id == 2) {
        return customer_id.company_name;
    }
}

function getTotalAndRefundDueForSwalPayConfirmation(){
    if(customerPaymentCHI.total_payable >= 0){
        let payStatus = `${customerPaymentCHI.paid === customerPaymentCHI.total_payable ? 'Fully Paid' : 'Not Complete'}`
        return `Total Payable: Rs ${customerPaymentCHI.total_payable.toFixed(2)}
                Pay Status : ${payStatus}`;
    }else{
        return `Total Payable: Rs 0.00
                    Refund Due: Rs ${customerPaymentCHI.refund_due.toFixed(2)}`;
    }
}

function hidePaymentCHI() {
    divCheckInPayment.style.display = "none"; // hide payment
    rowCheckInPayment.classList.remove('justify-content-between');
    rowCheckInPayment.classList.add('justify-content-center'); // center agreement
}

function showPaymentCHI() {
    divRecieptCHI.style.display = "none"; //hide agreement
    btnPrintCheckInBill.style.visibility = "hidden"; //hide print button
    divCheckInPayment.style.display = "block"; //show payment
    rowCheckInPayment.classList.remove('justify-content-center'); //justify content between
    rowCheckInPayment.classList.add('justify-content-between');
}