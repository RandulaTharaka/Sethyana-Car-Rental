
function confirmTabCH() {

    //~~ Bindings ~~//
    //bind customer
    if (cmbCustomer.value !== "") {
        cdReservation.customer_id = JSON.parse(cmbCustomer.value);
    }

    //bind package details
    if(cdReservation.package_id != null && cdReservation.package_id != undefined){
        cdReservation.package_price = cdReservation.package_id.package_price;
        cdReservation.package_km = cdReservation.package_id.package_km;
        cdReservation.package_duration_id = cdReservation.package_id.package_duration_id;
        cdReservation.additional_km_price = cdReservation.package_id.price_per_additional_km;
        cdReservation.additional_hour_price = cdReservation.package_id.price_per_additional_hour;

        //bind rental amount
        if (cdReservation.pick_up_charge !== null && cdReservation.pick_up_charge !== undefined) {
            cdReservation.rental_amount = (parseFloat(cdReservation.package_id.package_price) + parseFloat(cdReservation.pick_up_charge)).toFixed(2)
        } else {
            cdReservation.rental_amount = cdReservation.package_id.package_price;

        }
    }

    //~~ Summary ~~//
    //customer & nic
    if (cdReservation.customer_id != null && cdReservation.customer_id != undefined && cdReservation.customer_id.customer_type_id.name == "Individual") {
        divSumCustomer.innerHTML = cdReservation.customer_id.first_name + " " + cdReservation.customer_id.last_name;
        divSumNic.innerHTML = cdReservation.customer_id.nic;

    } else if (cdReservation.customer_id != null && cdReservation.customer_id != undefined && cdReservation.customer_id.customer_type_id.name == "Company") {
        divSumCustomer.innerHTML = cdReservation.customer_id.company_name;

    } else if (cdReservation.customer_id == null && cdReservation.customer_id == undefined) {
        divSumCustomer.innerHTML = "-";
        divSumNic.innerHTML = "-";
    }

    //Driver & License
    if (cdReservation.driver_id != null && cdReservation.driver_id != undefined) {
        divSumDriver.innerHTML = cdReservation.driver_id.calling_name;
        divSumDLicense.innerHTML = cdReservation.driver_id.driving_license;

    } else if (cdReservation.driver_id == null && cdReservation.driver_id == undefined) {
        divSumDriver.innerHTML = "-";
        divSumDLicense.innerHTML = "-";
    }

    //Vehicle
    if (cdReservation.vehicle_id != null && cdReservation.vehicle_id != undefined) {
        divSumVModel.innerHTML = cdReservation.vehicle_id.model_id.brand_id.name + " " + cdReservation.vehicle_id.model_id.name;
        divSumLPlate.innerHTML = cdReservation.vehicle_id.license_plate;

    } else if (cdReservation.vehicle_id == null && cdReservation.vehicle_id == undefined) {
        divSumVModel.innerHTML = "-";
        divSumLPlate.innerHTML = "-";
    }

    //Pick Up Date
    if (cdReservation.expect_pick_up_datetime != null && cdReservation.expect_pick_up_datetime != undefined) {
        divSumPickDate.innerHTML =  sqlDateTimeToLocalC(cdReservation.expect_pick_up_datetime);

    } else if (cdReservation.expect_pick_up_datetime == null && cdReservation.expect_pick_up_datetime == undefined) {
        divSumPickDate.innerHTML = "-";
    }

    //Return Date
    if (cdReservation.expect_return_datetime != null && cdReservation.expect_return_datetime != undefined) {
        divSumReturnDate.innerHTML =  sqlDateTimeToLocalC(cdReservation.expect_return_datetime);

    } else if (cdReservation.expect_return_datetime == null && cdReservation.expect_return_datetime == undefined) {
        divSumReturnDate.innerHTML = "-";
    }

    //Pick Up Location
    if (cdReservation.pick_up_location != null && cdReservation.pick_up_location != undefined) {
        divSumPickLocation.innerHTML =  cdReservation.pick_up_location;

    } else if (cdReservation.pick_up_location == null && cdReservation.pick_up_location == undefined) {
        divSumPickLocation.innerHTML = "-";
    }

    //Drop Off Location
    if (cdReservation.drop_off_location != null && cdReservation.drop_off_location != undefined) {
        divSumDropLocation.innerHTML =  cdReservation.drop_off_location;

    } else if (cdReservation.drop_off_location == null && cdReservation.drop_off_location == undefined) {
        divSumDropLocation.innerHTML = "-";
    }

    //Package Km
    if (cdReservation.package_km != null && cdReservation.package_km != undefined) {
        divSumPackageKm.innerHTML =  cdReservation.package_km;

    } else if (cdReservation.drop_off_location == null && cdReservation.drop_off_location == undefined) {
        divSumPackageKm.innerHTML = "-";
    }

    //Package Duration
    if (cdReservation.package_duration_id != null && cdReservation.package_duration_id != undefined) {
        divSumPackageDuration.innerHTML =  cdReservation.package_duration_id.name + " " + cdReservation.package_duration_id.package_duration_type_id.name;

    } else if (cdReservation.drop_off_location == null && cdReservation.drop_off_location == undefined) {
        divSumPackageDuration.innerHTML = "-";
    }

    //Total Price
    if (cdReservation.rental_amount != null && cdReservation.rental_amount != undefined) {
        divSumTotalPrice.innerHTML =  cdReservation.rental_amount;

    } else if (cdReservation.rental_amount == null && cdReservation.rental_amount == undefined) {
        divSumTotalPrice.innerHTML = "-";
    }
}

function updateConfirmTab(){
    txtCdrResvCode.innerHTML = oldCDReservation.cd_reservation_code;
    txtReservationNotes.value = oldCDReservation.trip_notes;

    if(oldCDReservation.reservation_status_id.id === 2 || oldCDReservation.reservation_status_id.id === 4 || oldCDReservation.reservation_status_id.id === 5){
        setReservationStatus('update');
    }else if(oldCDReservation.reservation_status_id.id === 7){
        setReservationStatus('onRent');
        disableElements('cd_reservation');
    }else if(oldCDReservation.reservation_status_id.id === 3){
        setReservationStatus('complete');
        disableElements('cd_reservation');
    }
}
