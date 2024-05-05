
function showPickUpCharge() {
    divPickUpCharge.style.display = "block";
}

function hidePickUpCharge() {
    divPickUpCharge.style.display = "none";
}

function datetimetPickUpCH() {

    //check if pick time greater than current time
    if (new Date(datetimetPickUp.value).getTime() >= new Date(getCurrentDateTime("datetime")).getTime()) {

        //set return day according to selected rental days
        var returnDate = new Date(new Date(datetimetPickUp.value).getTime() + (nmbRequiredRentalDays.value * day));
        datetimeExptReturn.value = setFieldDate(returnDate);

        if (oldSDReservation != null && oldSDReservation.pick_up_datetime != datetimetPickUp.value) {
            sdReservation.pick_up_datetime = datetimetPickUp.value;
            updateF(datetimetPickUp);
            clearPackageVehicleTab();

        } else {
            sdReservation.pick_up_datetime = datetimetPickUp.value;
            validF(datetimetPickUp);
            clearPackageVehicleTab();
        }


        //set min max of return time 31 days from selected pick up date
        datetimeExptReturn.setAttribute("min", datetimetPickUp.value);
        datetimeExptReturn.setAttribute("max", setMaxDate(true, 31));

        //when return date has value
        if (datetimeExptReturn.value != "") {
            ////check if previously selected return date exceed 31 days from pick up date  && check if previously selected return date exceed selecting pick up time
            if (new Date(datetimetPickUp.value).getTime() + (day * 31) < new Date(datetimeExptReturn.value).getTime() || new Date(datetimetPickUp.value).getTime() > new Date(datetimeExptReturn.value).getTime()) {
                invalidF(datetimeExptReturn);
                sdReservation.expect_return_datetime = null;

            } else {
                if (oldSDReservation != null && oldSDReservation.expect_return_datetime != datetimeExptReturn.value) {
                    updateF(datetimeExptReturn);
                } else {
                    validF(datetimeExptReturn);
                }
                sdReservation.expect_return_datetime = datetimeExptReturn.value;
            }
        }

    } else {
        sdReservation.pick_up_datetime = null;
        invalidF(datetimetPickUp);
        enableDisableVehicleTab();
    }

    divAddHours.classList.add('d-none'); // addition hour d-none
    sdReservation.required_additional_hours = null;
}

function datetimeExptReturnCH() {
    //check if return time greater than current time
    if (new Date(datetimeExptReturn.value).getTime() > new Date(getCurrentDateTime("datetime")).getTime()) {

        if (oldSDReservation != null && oldSDReservation.expect_return_datetime != datetimeExptReturn.value) {
            updateF(datetimeExptReturn);
            clearPackageVehicleTab();
        } else {
            validF(datetimeExptReturn);
            clearPackageVehicleTab();
        }
        sdReservation.expect_return_datetime = datetimeExptReturn.value;

        //when pickup date has value
        if (datetimetPickUp.value != "") {

            //check if previsouly selected pick up date exceed selecting return date OR check if the duration is less than one day
            if (new Date(datetimetPickUp.value).getTime() >= new Date(datetimeExptReturn.value).getTime() || (new Date(datetimeExptReturn.value).getTime() - new Date(datetimetPickUp.value).getTime()) < day) {
                invalidF(datetimeExptReturn);
                sdReservation.expect_return_datetime = null;

            } else {

                // set rental days
                nmbRequiredRentalDays.value = getDuration2()[0];
                sdReservation.required_rental_days = nmbRequiredRentalDays.value;
                if (oldSDReservation != null && oldSDReservation.required_rental_days != nmbRequiredRentalDays.value) {
                    updateF(nmbRequiredRentalDays);
                    updateF(datetimeExptReturn);
                } else {
                    validF(nmbRequiredRentalDays);
                    validF(datetimeExptReturn);
                }

                //set additional hours
                if (getDuration2()[1] != "") {
                    divAddHours.innerHTML = 'Additional: ' + getDuration2()[1];
                    sdReservation.required_additional_hours = getDuration2()[2];
                    divAddHours.classList.remove('d-none');
                } else {
                    sdReservation.required_additional_hours = null;
                    divAddHours.classList.add('d-none');
                }

            }
        }

    } else {
        invalidF(datetimeExptReturn);
        sdReservation.expect_return_datetime = null;

    }
}

function nmbRequiredRentalDaysCH() {

    //if rental days not eqal to 0 and not over 31
    if (nmbRequiredRentalDays.value != 0 && nmbRequiredRentalDays.value <= 31) {

        sdReservation.required_rental_days = nmbRequiredRentalDays.value;
        //if pick up date has value
        if (sdReservation.pick_up_datetime != null) {
            //set return date according to selected rental days
            datetimeExptReturn.value = setFieldDate(new Date(new Date(sdReservation.pick_up_datetime).getTime() + (nmbRequiredRentalDays.value * day)));
            sdReservation.expect_return_datetime = datetimeExptReturn.value;
        }

        if (oldSDReservation != null && oldSDReservation.required_rental_days != nmbRequiredRentalDays.value) {
            updateF(nmbRequiredRentalDays);
            if (datetimetPickUp.value != "") {
                updateF(datetimeExptReturn);
            }
        } else {
            validF(nmbRequiredRentalDays);
            if (datetimetPickUp.value != "") {
                validF(datetimeExptReturn);
            }
        }


    } else {
        invalidF(nmbRequiredRentalDays);
    }

    divAddHours.classList.add('d-none'); // addition hour d-none
    sdReservation.required_additional_hours = null;
}

function cmbPickUpLocationCH() {

    //clear fields
    txtOtherPickUpLocation.value = "";
    sdReservation.other_pick_up_location = null;
    initialF(txtOtherPickUpLocation);

    divPickUpCharge.style.display = "none";
    txtPickUpCharge.value = "";
    sdReservation.pick_up_charge = null;
    initialF(txtPickUpCharge);

    chargeDistanceNo.checked = true;

    //show other pick up location div
    if (JSON.parse(cmbPickUpLocation.value).id == 2) {
        divOtherPickUpLocation.style.display = "flex";
    } else {
        divOtherPickUpLocation.style.display = "none";
    }

}

function chargeDistanceNoCH() {
    txtPickUpCharge.value = "";
    initialF(txtPickUpCharge);
}

function getDuration2() {
    if (datetimetPickUp.value != "" && datetimeExptReturn.value != "") {
        var pickDateTime = new Date(datetimetPickUp.value);
        var returnDateTime = new Date(datetimeExptReturn.value);
        var difference = returnDateTime.getTime() - pickDateTime.getTime();

        var numOfDays = Math.floor(difference / day);
        var numOfHours = Math.floor((difference % day) / hour);
        var numOfHoursText = Math.floor((difference % day) / hour);
        var numOfMinute = Math.floor((difference % hour) / minute);

        if (numOfHours <= 0) {
            numOfHoursText = "";
        } else if (numOfHours == 1) {
            numOfHoursText += " Hour ";
        } else {
            numOfHoursText += " Hours ";
        }

        var durationArray = []
        durationArray[0] = numOfDays;
        durationArray[1] = numOfHoursText;
        durationArray[2] = numOfHours;
        return (durationArray);
    }
}

function updateTimeAndLocationTab(){

    datetimetPickUp.value = oldSDReservation.pick_up_datetime;
    txtPickUpCharge.value = oldSDReservation.pick_up_charge;
    datetimeExptReturn.value = oldSDReservation.expect_return_datetime;
    nmbRequiredRentalDays.value = oldSDReservation.required_rental_days;

    if (oldSDReservation.required_additional_hours != null) {
        divAddHours.innerHTML = 'Additional: ' + oldSDReservation.required_additional_hours + 'Hour';
        divAddHours.classList.remove('d-none');

    }

    fillCombo(cmbPickUpLocation, "Nothing selected", pickUpLocations, "name", oldSDReservation.pick_up_location_id.name);
    fillCombo(cmbReturnLocation, "Nothing selected", returnLocations, "name", oldSDReservation.return_location_id.name);

    //if other pick up location selected
    if (oldSDReservation.pick_up_location_id.id == 2) {
        txtOtherPickUpLocation.value = oldSDReservation.other_pick_up_location;
        validF(txtOtherPickUpLocation);
        divOtherPickUpLocation.style.display = "flex";
    }

    //pick up charge Yes
    if (oldSDReservation.pick_up_charge != null) {
        chargeDistanceYes.checked = true;
        showPickUpCharge();
    }

}