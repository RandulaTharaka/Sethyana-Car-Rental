package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.SMS;
import com.sethyanacarrental.model.SelfDriveReservation;
import com.sethyanacarrental.model.User;
import com.sethyanacarrental.model.Vehicle;
import com.sethyanacarrental.repository.ReservationStatusRepository;
import com.sethyanacarrental.repository.SelfDriveReservationRepository;
import com.sethyanacarrental.repository.VehicleRepository;
import com.sethyanacarrental.service.EmailService;
import com.sethyanacarrental.service.SMSService;
import com.sethyanacarrental.service.UserService;
import com.sethyanacarrental.util.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping(value = "/sd_reservation")
public class SelfDriveReservationController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private SelfDriveReservationRepository dao;

    @Autowired //create vehicleStatus interface instance(object)
    private ReservationStatusRepository daoStatus;

    @Autowired
    private VehicleRepository daoVehicle;

    @Autowired
    private SMSService smsService;

    @Autowired
    private EmailService emailService;

    @GetMapping(value = "/next_sdreservation_code", produces = "application/json")
    public SelfDriveReservation listNextSDReservationCode() {
        String nextSDRCode = dao.getNextSDRCode();
        SelfDriveReservation nextSDReservationCode = new SelfDriveReservation(nextSDRCode);
        return nextSDReservationCode;
    }

    @GetMapping(value = "/on_going_list_by_vehicle", params = {"vehicle_id"}, produces = "application/json")
    public List<SelfDriveReservation> selfDriveReservationListByVehicleID(@RequestParam("vehicle_id") int vehicle_id) {
        return dao.listByVehicleID(vehicle_id);
    }

    @GetMapping(value = "/coming_up_reserved_list_by_vehicle_and_returned_time",
            params = {"vehicle_id", "returned_datetime"}, produces = "application/json")
    public List<SelfDriveReservation> selfDriveReservationReservedListByVehicleIDAndReturnedDateTime(
            @RequestParam("vehicle_id") int vehicle_id, @RequestParam("returned_datetime") String returned_datetime) {
        return dao.reservedListByVehicleIDAndReturnedDateTime(vehicle_id, LocalDateTime.parse(returned_datetime));
    }

    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<SelfDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("select")) {

            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<SelfDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size,
                                              @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "SDRESERVATION");

        if (user != null && priv != null && priv.get("select")) {

            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @PostMapping(produces = "application/json", consumes = "application/json")
    public ResponseEntity<String> insert(@RequestBody SelfDriveReservation sd_reservation) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "SDRESERVATION");

        Response responseSD = new Response();

        if (user != null && priv != null && priv.get("add")) {
            try {
                // If no ongoing reservation for the selected vehicle (checked at frontend), vehicle status set to reserved
                if (sd_reservation.getVehicle_id().getVehicle_status_id().getId() == 2) {
                    Vehicle vehicle = daoVehicle.getById(sd_reservation.getVehicle_id().getId());
                    vehicle.setVehicle_status_id(sd_reservation.getVehicle_id().getVehicle_status_id());
                    daoVehicle.save(vehicle);
                }
                dao.save(sd_reservation);
                responseSD.setReservation("0");

                // Sent the sms and set the response
                String responseOfSMS = sendConfirmationSMS(sd_reservation);
                responseSD.setSms(responseOfSMS.equals("0") ? "0" : responseOfSMS);

                // Send the email and set the response
                String responseOfEmail = sendConfirmationEmail(sd_reservation);
                responseSD.setEmail(responseOfEmail.equals("0") ? "0" : responseOfEmail);

            } catch (Exception ex) {
                responseSD.setReservation("Save Not Completed..." + ex.getMessage());
            }
        } else {
            responseSD.setReservation("Error in Updating: You have no privilege!");
        }
        String jsonString = responseSD.convertToJSON();
        return ResponseEntity.ok(jsonString);
    }

    @PutMapping
    public String update(@RequestBody SelfDriveReservation sd_reservation) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "SDRESERVATION");

        if (user != null && priv != null && priv.get("update")) {
            try {
                dao.save(sd_reservation);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Updating: You have no privilege!";
        }
    }

    @DeleteMapping
    public String delete(@RequestBody SelfDriveReservation sd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "SDRESERVATION");

        if (user != null && priv != null && priv.get("delete")) {
            try {
                sd_reservation.setReservation_status_id(daoStatus.getById(6));
                dao.save(sd_reservation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete...." + ex.getMessage();
            }
        } else {
            return "Error in Deleting: You have no privilege!";
        }
    }

    public String sendConfirmationSMS(SelfDriveReservation sd_reservation){
        try{
            String phone = null;
            String firstName;
            String vehicleModel;
            String pickUpDateTime;
            String pickUpDate;

            Integer customerType = sd_reservation.getCustomer_id().getCustomer_type_id().getId();
            if(customerType == 1){ // Individual Customer
                phone = sd_reservation.getCustomer_id().getPhone();
            }else if(customerType == 2){ // Company Customer
                phone = sd_reservation.getCustomer_id().getCompany_phone();
            }

            // Set country code for normal phone numbers
            if(phone != null && phone.charAt(0) == '0'){
                phone = phone.substring(1);
                phone = "+94" + phone;
            }

            // Set values for the sms
            try{
                firstName = sd_reservation.getCustomer_id().getFirst_name();
                vehicleModel = sd_reservation.getVehicle_id().getModel_id().getBrand_id().getName()  + " " + sd_reservation.getVehicle_id().getModel_id().getName();

                pickUpDateTime = sd_reservation.getPick_up_datetime().toString();
                String[] pickUpDateAndTimeArray = pickUpDateTime.split("T");
                pickUpDate = pickUpDateAndTimeArray[0];
            }catch (Exception ex){
                return "SMS sent failed...\n{Values can not be set for the SMS: \n" + ex.getMessage() + "}";
            }

            SMS sms = new SMS();
//            sms.setTo(phone);  // Commented for twilio trial version
            sms.setTo("+94778719766");
            String message = "Hello " +  firstName + ", your reservation for " +  vehicleModel + " on " +  pickUpDate +
                    " is confirmed! Please check your email for further details.";
            sms.setMessage(message);
//                smsService.send(sms); // Uncomment to send the msg.
            return "0";
        }catch (Exception ex){
            return "SMS sent failed...\n{" + ex.getMessage() + "}";
        }
    }

    public String sendConfirmationEmail(SelfDriveReservation sd_reservation){
        try {
            // Set to-email
            if(sd_reservation.getCustomer_id().getCustomer_type_id().getId() == 1){ // Individual Customer
                String toEmail = sd_reservation.getCustomer_id().getEmail();
            }else{ // Company Customer
                String toEmail = sd_reservation.getCustomer_id().getCompany_email();
            }

            // Set email-subject
            String subject = "Your Vehicle Reservation Confirmed! Reservation ID: " + sd_reservation.getSd_reservation_code();

            // Set htmlContent

            Resource resource = new ClassPathResource("static/sdr_confirm_email.html");
            InputStream inputStream = resource.getInputStream();
            String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            try {
                // Email Heading
                String carModel = sd_reservation.getVehicle_id().getModel_id().getBrand_id().getName() + " " + sd_reservation.getVehicle_id().getModel_id().getName();

                String customerName;
                if (sd_reservation.getCustomer_id().getCustomer_type_id().getId() == 1) {
                    customerName = sd_reservation.getCustomer_id().getFirst_name() + " " + sd_reservation.getCustomer_id().getLast_name();
                } else {
                    customerName = sd_reservation.getCustomer_id().getCompany_name();
                }

                DateTimeFormatter formatterDateTime = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy, 'at' hh:mm a", Locale.ENGLISH);
                LocalDateTime originalPickUpDateAndTime = sd_reservation.getPick_up_datetime();
                String detailedPickUpDateAndTime = originalPickUpDateAndTime.format(formatterDateTime);


                // Reservation Details Card
                String pickUpLocation;
                if (sd_reservation.getPick_up_location_id().getId() == 1) {
                    pickUpLocation = "Office";
                } else {
                    pickUpLocation = sd_reservation.getOther_pick_up_location();
                }
                String returnLocation = sd_reservation.getReturn_location_id().getName();

                DateTimeFormatter formatterDateTime2 = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a");
                String pickUpDateAndTime = originalPickUpDateAndTime.format(formatterDateTime2);

                LocalDateTime originalReturnDateAndTime = sd_reservation.getExpect_return_datetime();
                String returnDateAndTime = originalReturnDateAndTime.format(formatterDateTime2);

                String rentalDays = sd_reservation.getRequired_rental_days().toString();
                rentalDays += (rentalDays.equals("1"))? " Day" : " Days";
                String rentalPeriod = rentalDays;

                if(sd_reservation.getRequired_additional_hours() != null){
                    String addtionalHours = sd_reservation.getRequired_additional_hours().toString();
                    rentalPeriod += (addtionalHours.equals("1"))? " Hour" : " Hours";
                }


                // Vehicle Details Card
                String seats = sd_reservation.getVehicle_id().getNum_of_seats().toString();
                String color = sd_reservation.getVehicle_id().getColor_id().getName();
                String transmission = sd_reservation.getVehicle_id().getTransmission_type_id().getName();

                // Package Details
                String kmPerDay = sd_reservation.getPackage_km().toString();
                String pricePerDay = sd_reservation.getPackage_price().setScale(2, RoundingMode.HALF_UP).toString();
                String pricePerAddKm = sd_reservation.getAdditional_km_price().setScale(2, RoundingMode.HALF_UP).toString();
                String pricePerAddHour = sd_reservation.getAdditional_hour_price().setScale(2, RoundingMode.HALF_UP).toString();

                // Estimated Charge Details
                String rentalDaysCharge = BigDecimal.valueOf(sd_reservation.getRequired_rental_days())
                        .multiply(sd_reservation.getPackage_price()).setScale(2, RoundingMode.HALF_UP)
                        .toString();

                String addHourCharge = "0.00";
                if (sd_reservation.getRequired_additional_hours() != null) {
                    addHourCharge = BigDecimal.valueOf(sd_reservation.getRequired_additional_hours())
                            .multiply(sd_reservation.getAdditional_hour_price()).setScale(2, RoundingMode.HALF_UP)
                            .toString();
                }

                String pickUpCharge = "0.00";
                if (sd_reservation.getPick_up_charge() != null) {
                    pickUpCharge = sd_reservation.getPick_up_charge().setScale(2, RoundingMode.HALF_UP).toString();
                }
                String estimatedTotal = sd_reservation.getRental_amount().setScale(2, RoundingMode.HALF_UP).toString();

                //Payable Upfront Details
                String advance = (sd_reservation.getRental_amount().divide(BigDecimal.valueOf(2))).setScale(2, RoundingMode.HALF_UP).toString();
                String refundableDeposit = sd_reservation.getPackage_refundable_deposit().setScale(2, RoundingMode.HALF_UP).toString();
                String Total = (sd_reservation.getRental_amount().divide(BigDecimal.valueOf(2)).add(sd_reservation.getPackage_refundable_deposit()))
                        .setScale(2, RoundingMode.HALF_UP).toString();

                // Replace reservation values for the email
                htmlContent = htmlContent.replace("{{carModel}}", carModel)
                        .replace("{{customerName}}", customerName)
                        .replace("{{detailedPickUpDateAndTime}}", detailedPickUpDateAndTime)

                        .replace("{{pickUpLocation}}", pickUpLocation)
                        .replace("{{returnLocation}}", returnLocation)
                        .replace("{{pickUpDateAndTime}}", pickUpDateAndTime)
                        .replace("{{returnDateAndTime}}", returnDateAndTime)
                        .replace("{{rentalPeriod}}", rentalPeriod)

                        .replace("{{seats}}", seats)
                        .replace("{{color}}", color)
                        .replace("{{transmission}}", transmission)

                        .replace("{{kmPerDay}}", kmPerDay)
                        .replace("{{pricePerDay}}", pricePerDay)
                        .replace("{{pricePerAddKm}}", pricePerAddKm)
                        .replace("{{pricePerAddHour}}", pricePerAddHour)

                        .replace("{{rentalDaysCharge}}", rentalDaysCharge)
                        .replace("{{addHourCharge}}", addHourCharge)
                        .replace("{{pickUpCharge}}", pickUpCharge)
                        .replace("{{estimatedTotal}}", estimatedTotal)

                        .replace("{{advance}}", advance)
                        .replace("{{refundableDeposit}}", refundableDeposit)
                        .replace("{{Total}}", Total);

            } catch (Exception ex) {
                return "Email sent failed...\n{Values can not be set for the email: \n" + ex.getMessage() + "}";
            }

            emailService.sendHTMLEmail("iamrandula@gmail.com", subject, htmlContent);
            return "0";
        }catch (Exception ex){
            return "Email sent failed...\n{" + ex.getMessage() + "}";
        }
    }


}
