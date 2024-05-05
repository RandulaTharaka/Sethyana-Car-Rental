
function displayStops() {
    rowStops.style.display = "flex";
}

function hideStops() {
    rowStops.style.display = "none";
}

function showPickUpCharge() {
    divPickUpCharge.style.display = "block";
}

function hidePickUpCharge() {
    divPickUpCharge.style.display = "none";
}

function datetimeExptPickUpCH() {

    //check if pick time greater than current time
    if (new Date(datetimeExptPickUp.value).getTime() >= new Date(getCurrentDateTime("datetime")).getTime()) {

        if (oldCDReservation != null && oldCDReservation.expect_pick_up_datetime != datetimeExptPickUp.value) {
            cdReservation.expect_pick_up_datetime = datetimeExptPickUp.value;
            updateF(datetimeExptPickUp);
            clearPackageVehicleDriverTab();

        } else {
            cdReservation.expect_pick_up_datetime = datetimeExptPickUp.value;
            validF(datetimeExptPickUp);
            clearPackageVehicleDriverTab();
        }


        //set min max of return time 5 days from selected pick up date
        datetimeExptReturn.setAttribute("min", datetimeExptPickUp.value);
        datetimeExptReturn.setAttribute("max", setMaxDate(true, 4));

        //when return date has value
        if (datetimeExptReturn.value != "") {
            ////check if previously selected return date exceed 5 days from pick up date  && check if previously selected return date exceed selecting pick up time
            if (new Date(datetimeExptPickUp.value).getTime() + (day * 5) < new Date(datetimeExptReturn.value).getTime() || new Date(datetimeExptPickUp.value).getTime() > new Date(datetimeExptReturn.value).getTime()) {
                invalidF(datetimeExptReturn);
                // cdReservation.expect_return_datetime = null;

            } else {
                if (oldCDReservation != null && oldCDReservation.expect_return_datetime != datetimeExptReturn.value) {
                    updateF(datetimeExptReturn);
                } else {
                    validF(datetimeExptReturn);
                }
            }
        }

    } else {
        cdReservation.expect_pick_up_datetime = null;
        invalidF(datetimeExptPickUp);
        enableDisableVehicleTab();

    }
    divGetDuration.style.display = "none";
}

function datetimeExptReturnCH() {
    //check if pick time greater than current time
    if (new Date(datetimeExptReturn.value).getTime() > new Date(getCurrentDateTime("datetime")).getTime()) {

        if (oldCDReservation != null && oldCDReservation.expect_return_datetime != datetimeExptReturn.value) {
            updateF(datetimeExptReturn);
            clearPackageVehicleDriverTab();
        } else {
            validF(datetimeExptReturn);
            clearPackageVehicleDriverTab();
        }

        //when pickup date has value
        if (datetimeExptPickUp.value != "") {
            //check if previsouly selected pick up date exceed selecting return date
            if (new Date(datetimeExptPickUp.value).getTime() >= new Date(datetimeExptReturn.value).getTime()) {
                invalidF(datetimeExptReturn);

            } else {
                if (oldCDReservation != null && oldCDReservation.expect_return_datetime != datetimeExptReturn.value) {
                    updateF(datetimeExptReturn);
                    clearPackageVehicleDriverTab();

                } else {
                    validF(datetimeExptReturn);
                    clearPackageVehicleDriverTab();
                }
            }
        }

    } else {
        invalidF(datetimeExptReturn);
    }
    divGetDuration.style.display = "none";
}

function txtPickUpLocationCH() {
    // divGetDistance.style.display = "none";
}

function chargeDistanceNoCH() {
    txtPickUpCharge.value = "";
    initialF(txtPickUpCharge);
}

function txtDropOffLocationCH() {
    // divGetDistance.style.display = "none";
}

function radiMStopsNoCH() {
    txtStopLocation1.value = "";
    txtStopLocation2.value = "";
    txtStopLocation3.value = "";
    initialF(txtStopLocation1);
    initialF(txtStopLocation2);
    initialF(txtStopLocation3);
}

function btnGetDurationCH() {
    if (cdReservation.expect_pick_up_datetime != null && datetimeExptPickUp.value != "") {
        divGetDuration.style.display = "block";
        divGetDuration.innerHTML = getDuration();
    }
}

function getDuration() {
    if (datetimeExptPickUp.value != "" && datetimeExptReturn.value != "") {
        var pickDateTime = new Date(datetimeExptPickUp.value);
        var returnDateTime = new Date(datetimeExptReturn.value);
        var difference = returnDateTime.getTime() - pickDateTime.getTime();

        var numOfDays = Math.floor(difference / day);
        var numOfHours = Math.floor((difference % day) / hour);
        var numOfMinute = Math.floor((difference % hour) / minute);

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

        if (numOfMinute <= 0) {
            numOfMinute = "";
        } else if (numOfMinute == 1) {
            numOfMinute += " Minute"
        } else {
            numOfMinute += " Minutes"
        }
        return (numOfDays + numOfHours + numOfMinute);
    }
}

function clearPackageVehicleDriverTab() {
    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    //clear package
    fillCombo(cmbPkCategory, "Nothing selected", packageCategories, "name", "");
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
    fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
    fillTable('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    clearSelection(tblAvPackage);
    pkgCategoryClear();
    initialF(cmbPkCategory);
    btnXPkCategory.style.display = "none";

    //clear vehicle
    fillCombo5(cmbVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    initialF(cmbVModel);
    initialF($(cmbVModel).siblings().children().children('.select2-selection--single'));
    fillTable('tblAvVehicle', vehicles, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list

    //clear driver
    txtDriver.value = "";
    initialF(txtDriver);
}

function btnDateBindingCH() {
    divPick.innerHTML = "Pick DateTime " + cdReservation.expect_pick_up_datetime;
    divReturn.innerHTML = "Return DateTime " + cdReservation.expect_return_datetime;
}

function btnReservationBindingCH() {
}

function updateTimeAndLocationTab(){
    datetimeExptPickUp.value = oldCDReservation.expect_pick_up_datetime;
    txtPickUpLocation.value = oldCDReservation.pick_up_location;
    txtPickUpCharge.value = oldCDReservation.pick_up_charge;
    datetimeExptReturn.value = oldCDReservation.expect_return_datetime;
    txtDropOffLocation.value = oldCDReservation.drop_off_location;
    txtStopLocation1.value = oldCDReservation.stop_location_1;
    txtStopLocation2.value = oldCDReservation.stop_location_2;
    txtStopLocation3.value = oldCDReservation.stop_location_3;

    //pick up charge Yes
    if (oldCDReservation.pick_up_charge != null) {
        chargeDistanceYes.checked = true;
        showPickUpCharge();
    }

    //Multiple Location Yes
    if (oldCDReservation.stop_location_1 != null && oldCDReservation.stop_location_2 != null && oldCDReservation.stop_location_3 != null) {
        radiMStopsYes.checked = true;
        displayStops();
    }

}
