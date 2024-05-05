
function confirmTabCH() {


    //~~ Bindings ~~//
    //bind customer
    if (cmbCustomer.value !== "") {
        sdReservation.customer_id = JSON.parse(cmbCustomer.value);
    }

    //bind package details
    if (sdReservation.package_id != null && sdReservation.package_id != undefined) {
        sdReservation.package_price = sdReservation.package_id.package_price;
        sdReservation.package_km = sdReservation.package_id.package_km;
        sdReservation.package_duration_id = sdReservation.package_id.package_duration_id;
        sdReservation.additional_km_price = sdReservation.package_id.price_per_additional_km;
        sdReservation.additional_hour_price = sdReservation.package_id.price_per_additional_hour;
    }

    //~~ Summary ~~//
    //customer & nic
    if (sdReservation.customer_id != null && sdReservation.customer_id != undefined && sdReservation.customer_id.customer_type_id.name == "Individual") {
        divSumCustomer.innerHTML = sdReservation.customer_id.first_name + " " + sdReservation.customer_id.last_name;
        divSumDLicense.innerHTML = sdReservation.customer_id.license_no;

    } else if (sdReservation.customer_id != null && sdReservation.customer_id != undefined && sdReservation.customer_id.customer_type_id.name == "Company") {
        divSumCustomer.innerHTML = sdReservation.customer_id.company_name;

    } else if (sdReservation.customer_id == null && sdReservation.customer_id == undefined) {
        divSumCustomer.innerHTML = "-";
        divSumNic.innerHTML = "-";
    }

    //Vehicle
    if (sdReservation.vehicle_id != null && sdReservation.vehicle_id != undefined) {
        divSumVModel.innerHTML = sdReservation.vehicle_id.model_id.brand_id.name + " " + sdReservation.vehicle_id.model_id.name;
        divSumLPlate.innerHTML = sdReservation.vehicle_id.license_plate;

    } else if (sdReservation.vehicle_id == null && sdReservation.vehicle_id == undefined) {
        divSumVModel.innerHTML = "-";
        divSumLPlate.innerHTML = "-";
    }

    //Pick Up Date
    if (sdReservation.pick_up_datetime != null && sdReservation.pick_up_datetime != undefined) {
        divSumPickDate.innerHTML = sqlDateTimeToLocalC(sdReservation.pick_up_datetime);

    } else if (sdReservation.pick_up_datetime == null && sdReservation.pick_up_datetime == undefined) {
        divSumPickDate.innerHTML = "-";
    }

    //Return Date
    if (sdReservation.expect_return_datetime != null && sdReservation.expect_return_datetime != undefined) {
        divSumReturnDate.innerHTML = sqlDateTimeToLocalC(sdReservation.expect_return_datetime);

    } else if (sdReservation.expect_return_datetime == null && sdReservation.expect_return_datetime == undefined) {
        divSumReturnDate.innerHTML = "-";
    }

    //Pick Up Location
    if (sdReservation.pick_up_location_id != null && sdReservation.pick_up_location_id.id != 2) {
        divSumPickLocation.innerHTML = sdReservation.pick_up_location_id.name;
    } else if (sdReservation.pick_up_location_id != null && sdReservation.other_pick_up_location != null) {
        divSumPickLocation.innerHTML = sdReservation.other_pick_up_location;
    } else {
        divSumPickLocation.innerHTML = "-";
    }

    //Return Location
    if (sdReservation.return_location_id != null) {
        divSumReturnLocation.innerHTML = sdReservation.return_location_id.name;
    } else {
        divSumReturnLocation.innerHTML = "-";
    }

    //Package Km
    if (sdReservation.package_km != undefined) {
        divSumPackageKm.innerHTML = sdReservation.package_km + " Km";

    } else if (sdReservation.drop_off_location == null && sdReservation.drop_off_location == undefined) {
        divSumPackageKm.innerHTML = "-";
    }

    //Rental Days
    if (sdReservation.required_rental_days != 0 && sdReservation.required_rental_days != undefined) {
        if (sdReservation.required_rental_days > 1) {
            divSumRentalDays.innerHTML = sdReservation.required_rental_days + " Days";
        } else {
            divSumRentalDays.innerHTML = sdReservation.required_rental_days + " Day";
        }

    } else if (sdReservation.required_rental_days == 0 && sdReservation.required_rental_days == undefined) {
        divSumRentalDays.innerHTML = "-";
    }

    //Additional Hours
    if (sdReservation.required_additional_hours != null && sdReservation.required_additional_hours != undefined) {
        if (sdReservation.required_additional_hours > 1) {
            divSumAddHours.innerHTML = sdReservation.required_additional_hours + " Hours";
        } else {
            divSumAddHours.innerHTML = sdReservation.required_additional_hours + " Hour";
        }

        rowDivSumAddHours.style.display = "flex"

    } else if (sdReservation.required_additional_hours == null && sdReservation.required_additional_hours == undefined) {
        divSumAddHours.innerHTML = "-";
        rowDivSumAddHours.style.display = "none"

    }


    //Bind Rental Amount & diveSumTotal (Total Price)

    //if Pick up charge not null
    if (sdReservation.pick_up_charge != null) {
        if (sdReservation.required_rental_days != undefined && sdReservation.package_id != null && sdReservation.package_price != undefined && sdReservation.required_additional_hours != undefined && sdReservation.additional_hour_price != undefined) {
            sdReservation.rental_amount = parseFloat((sdReservation.required_rental_days * sdReservation.package_price) + (sdReservation.required_additional_hours * sdReservation.additional_hour_price) + parseFloat(sdReservation.pick_up_charge)).toFixed(2);
            divSumTotalPrice.innerHTML = sdReservation.rental_amount;
        } else if (sdReservation.required_rental_days != undefined && sdReservation.package_price != undefined) {
            sdReservation.rental_amount = parseFloat((sdReservation.required_rental_days * sdReservation.package_price) + parseFloat(sdReservation.pick_up_charge)).toFixed(2);
            divSumTotalPrice.innerHTML = sdReservation.rental_amount
        } else {
            sdReservation.rental_amount = undefined;
            divSumTotalPrice.innerHTML = "-";
        }
    } else {
        if (sdReservation.required_rental_days != undefined && sdReservation.package_id != null && sdReservation.package_price != undefined && sdReservation.required_additional_hours != undefined && sdReservation.additional_hour_price != undefined) {
            sdReservation.rental_amount = parseFloat((sdReservation.required_rental_days * sdReservation.package_price) + (sdReservation.required_additional_hours * sdReservation.additional_hour_price)).toFixed(2);
            divSumTotalPrice.innerHTML = sdReservation.rental_amount
        } else if (sdReservation.required_rental_days != undefined && sdReservation.package_price != undefined) {
            sdReservation.rental_amount = parseFloat((sdReservation.required_rental_days * sdReservation.package_price)).toFixed(2);
            divSumTotalPrice.innerHTML = sdReservation.rental_amount

        } else {
            sdReservation.rental_amount = undefined;
            divSumTotalPrice.innerHTML = "-";
        }
    }
}

function updateConfirmTab(){
    txtSdrResvCode.innerHTML = oldSDReservation.sd_reservation_code;
    txtReservationNotes.value = oldSDReservation.trip_notes;
    setReservationStatus('update')

    disableButtons(true, false, false);
    setStyle(validF);

    if (txtPickUpCharge.value != "") validF(txtPickUpCharge);
    if (txtReservationNotes.value != "") validF(txtReservationNotes);

    // ~~~~ Check Out  ~~~~ //
    if (oldSDReservation.reservation_status_id.id === 2) { // 2 = reserved
        openCheckOutTab();
    }

    // ~~~~ Check In  ~~~~ //
    if (oldSDReservation.reservation_status_id.id === 7) { // 7 = on rent
        openCheckInTab();
        setReservationStatus('onRent');
        disableElements();
    }
}
