package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.*;
import com.sethyanacarrental.repository.ChauffeurDriveReservationRepository;
import com.sethyanacarrental.repository.DriverRepository;
import com.sethyanacarrental.repository.ReservationStatusRepository;
import com.sethyanacarrental.repository.VehicleRepository;
import com.sethyanacarrental.service.EmailService;
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

import javax.transaction.Transactional;
import java.io.InputStream;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping(value = "/cd_reservation")
public class ChauffeurDriveReservationController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private ChauffeurDriveReservationRepository dao;

    @Autowired
    private ReservationStatusRepository daoStatus;

    @Autowired
    private VehicleRepository daoVehicle;

    @Autowired
    private DriverRepository daoDriver;
    @Autowired
    private EmailService emailService;

    @GetMapping(value = "/next_cdreservation_code", produces = "application/json")
    public ChauffeurDriveReservation listNextCDReservationCode() {
        String nextCDRCode = dao.getNextCDRCode();
        ChauffeurDriveReservation nextCDReservationCode = new ChauffeurDriveReservation(nextCDRCode);
        return nextCDReservationCode;
    }

    @GetMapping(value = "/list_by_vehicle", params = {"vehicle_id"}, produces = "application/json")
    public List<ChauffeurDriveReservation> cdrListByVehicle(@RequestParam("vehicle_id") int vehicle_id) {
        return dao.listByVehicle(vehicle_id);
    }

    @GetMapping(value = "/on_going_list_by_vehicle", params = {"vehicle_id"}, produces = "application/json")
    public List<ChauffeurDriveReservation> chauffeurDriveReservationListByVehicleID(@RequestParam("vehicle_id") int vehicle_id) {
        return dao.listByVehicleID(vehicle_id);
    }

    @GetMapping(value = "/coming_up_reserved_list_by_vehicle_and_returned_time",
            params = {"vehicle_id", "returned_datetime"}, produces = "application/json")
    public List<ChauffeurDriveReservation> chauffeurDriveReservationReservedListByVehicleIDAndReturnedDateTime(
            @RequestParam("vehicle_id") int vehicle_id, @RequestParam("returned_datetime") String returned_datetime) {
        return dao.reservedListByVehicleIDAndReturnedDateTime(vehicle_id, LocalDateTime.parse(returned_datetime));
    }


    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<ChauffeurDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @GetMapping(value = "/findAllByDriver", params = {"page", "size", "searchtext", "userid"}, produces = "application/json")
    public Page<ChauffeurDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size,
                                                   @RequestParam("searchtext") String searchtext, @RequestParam("userid") int userid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext, userid, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<ChauffeurDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size,
                                                   @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "VEHICLE");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @PostMapping
    public ResponseEntity<String> insert(@RequestBody ChauffeurDriveReservation cd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        Response responseCD = new Response();

        if (user != null && priv != null && priv.get("add")) {
            try {
                // If no ongoing reservation (checked at frontend), vehicle status set to reserved
                if (cd_reservation.getVehicle_id().getVehicle_status_id().getId() == 2) {
                    Vehicle vehicle = daoVehicle.getById(cd_reservation.getVehicle_id().getId());
                    vehicle.setVehicle_status_id(cd_reservation.getVehicle_id().getVehicle_status_id());
                    daoVehicle.save(vehicle);
                }

                dao.save(cd_reservation);
                responseCD.setReservation("0");

                // Sent the sms and set the response
                String responseOfSMS = sendConfirmationSMS(cd_reservation);
                responseCD.setSms(responseOfSMS.equals("0") ? "0" : responseOfSMS);

                // Send the email and set the response
                String responseOfEmail = sendConfirmationEmail(cd_reservation);
                responseCD.setEmail(responseOfEmail.equals("0") ? "0" : responseOfEmail);

            } catch (Exception ex) {
                responseCD.setReservation("Save Not Completed..." + ex.getMessage());

            }
        } else {
            responseCD.setReservation("Error in Updating: You have no privilege!");
        }
        String jsonString = responseCD.convertToJSON();
        return ResponseEntity.ok(jsonString);
    }

    @Transactional
    @PutMapping
    public String update(@RequestBody ChauffeurDriveReservation cd_reservation) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("update")) {
            try {
                //@ start of the trip
                if (cd_reservation.getPick_up_odometer() != null && cd_reservation.getDrop_off_odometer() == null) {
                    Vehicle vehicle = daoVehicle.getById(cd_reservation.getVehicle_id().getId());
                    vehicle.setCurrent_odometer(cd_reservation.getPick_up_odometer()); // set vehicle current odometer
                    vehicle.setVehicle_status_id(cd_reservation.getVehicle_id().getVehicle_status_id()); //set vehicle status-ongoing
                    daoVehicle.save(vehicle);

                    Driver driver = daoDriver.getById(cd_reservation.getDriver_id().getId());
                    driver.setDriver_status_id(cd_reservation.getDriver_id().getDriver_status_id()); //set driver status-occupied
                }
                //@ end of the trip
                else if (cd_reservation.getPick_up_odometer() != null && cd_reservation.getDrop_off_odometer() != null) {
                    Vehicle vehicle = daoVehicle.getById(cd_reservation.getVehicle_id().getId());
                    vehicle.setCurrent_odometer(cd_reservation.getDrop_off_odometer()); // set vehicle current odometer
                    daoVehicle.save(vehicle);
                }
                dao.save(cd_reservation);
                return "0";

            } catch (Exception ex) {
                return "Save Not Completed...." + ex.getMessage();
            }
        } else {
            return "Error in Updating: you have no privilege!";
        }
    }

    @DeleteMapping
    public String delete(@RequestBody ChauffeurDriveReservation cd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("delete")) {
            try {
                cd_reservation.setReservation_status_id(daoStatus.getById(6));
                dao.save(cd_reservation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete...." + ex.getMessage();
            }
        } else {
            return "Error in Deleting: You have no privilege!";
        }
    }

    public String sendConfirmationSMS(ChauffeurDriveReservation cd_reservation){
        try{
            String phone = null;
            String firstName;
            String vehicleModel;
            String pickUpDateTime;
            String pickUpDate;

            Integer customerType = cd_reservation.getCustomer_id().getCustomer_type_id().getId();
            if(customerType == 1){ // Individual Customer
                phone = cd_reservation.getCustomer_id().getPhone();
            }else if(customerType == 2){ // Company Customer
                phone = cd_reservation.getCustomer_id().getCompany_phone();
            }

            // Set country code for normal phone numbers
            if(phone != null && phone.charAt(0) == '0'){
                phone = phone.substring(1);
                phone = "+94" + phone;
            }

            // Set values for the sms
            try{
                firstName = cd_reservation.getCustomer_id().getFirst_name();
                vehicleModel = cd_reservation.getVehicle_id().getModel_id().getBrand_id().getName()  + " " + cd_reservation.getVehicle_id().getModel_id().getName();

                pickUpDateTime = cd_reservation.getExpect_pick_up_datetime().toString();
                String[] pickUpDateAndTimeArray = pickUpDateTime.split("T");
                pickUpDate = pickUpDateAndTimeArray[0];
            }catch (Exception ex){
                return "SMS sent failed...\n{Values can not be set for the SMS: \n" + ex.getMessage() + "}";
            }

            SMS sms = new SMS();
//            sms.setTo(phone);  // Commented for twilio trial version
            sms.setTo("+94778719766");
            String message = "Hello " +  firstName + ", your chauffeur-driven reservation for " +  vehicleModel + " on " +  pickUpDate +
                    " is confirmed! Please check your email for further details.";
            sms.setMessage(message);
//                smsService.send(sms); // Uncomment to send the msg.
            return "0";
        }catch (Exception ex){
            return "SMS sent failed...\n{" + ex.getMessage() + "}";
        }
    }

    public String sendConfirmationEmail(ChauffeurDriveReservation cd_reservation){
        try {
            // Set to-email
            if(cd_reservation.getCustomer_id().getCustomer_type_id().getId() == 1){ // Individual Customer
                String toEmail = cd_reservation.getCustomer_id().getEmail();
            }else{ // Company Customer
                String toEmail = cd_reservation.getCustomer_id().getCompany_email();
            }

            // Set email-subject
            String subject = "Your Vehicle Reservation Confirmed! Reservation ID: " + cd_reservation.getCd_reservation_code();

            // Set htmlContent
            Resource resource = new ClassPathResource("static/cdr_confirm_email.html");
            InputStream inputStream = resource.getInputStream();
            String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            try {
                // Email Heading
                String carModel = cd_reservation.getVehicle_id().getModel_id().getBrand_id().getName() + " " + cd_reservation.getVehicle_id().getModel_id().getName();

                String customerName;
                if (cd_reservation.getCustomer_id().getCustomer_type_id().getId() == 1) {
                    customerName = cd_reservation.getCustomer_id().getFirst_name() + " " + cd_reservation.getCustomer_id().getLast_name();
                } else {
                    customerName = cd_reservation.getCustomer_id().getCompany_name();
                }

                DateTimeFormatter formatterDateTime = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy, 'at' hh:mm a", Locale.ENGLISH);
                LocalDateTime originalPickUpDateAndTime = cd_reservation.getExpect_pick_up_datetime();
                String detailedPickUpDateAndTime = originalPickUpDateAndTime.format(formatterDateTime);

                String driverName = cd_reservation.getDriver_id().getCalling_name();
                String driverContactNo = cd_reservation.getDriver_id().getEmployee_id().getMobile();

                // Reservation Details Card
                String pickUpLocation = cd_reservation.getPick_up_location();
                String dropOffLocation = cd_reservation.getDrop_off_location();

                String multipleStops = "No";
                if(cd_reservation.getStop_location_1() != null || cd_reservation.getStop_location_2() != null || cd_reservation.getStop_location_3() != null){
                    multipleStops = "Yes";
                }

                DateTimeFormatter formatterDateTime2 = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a");
                String pickUpDateAndTime = originalPickUpDateAndTime.format(formatterDateTime2);

                LocalDateTime originalReturnDateAndTime = cd_reservation.getExpect_return_datetime();
                String dropOffDateAndTime = originalReturnDateAndTime.format(formatterDateTime2);

                // Vehicle Details Card
                String licensePlate = cd_reservation.getVehicle_id().getLicense_plate();
                String passengerSeats = cd_reservation.getVehicle_id().getPassenger_seats();
                String color = cd_reservation.getVehicle_id().getColor_id().getName();

                // Package Details
                String allocatedDuration = cd_reservation.getPackage_duration_id().getName() + " " +
                                           cd_reservation.getPackage_duration_id().getPackage_duration_type_id().getName();
                String allocatedKM = cd_reservation.getPackage_km().toString();
                String packagePrice = cd_reservation.getPackage_price().setScale(2, RoundingMode.HALF_UP).toString();
                String pricePerAddKm = cd_reservation.getAdditional_km_price().setScale(2, RoundingMode.HALF_UP).toString();
                String pricePerAddHour = cd_reservation.getAdditional_hour_price().setScale(2, RoundingMode.HALF_UP).toString();

                // Estimated Charge Details
                String pickUpCharge = "0.00";
                if (cd_reservation.getPick_up_charge() != null) {
                    pickUpCharge = cd_reservation.getPick_up_charge().setScale(2, RoundingMode.HALF_UP).toString();
                }

                String estimatedTotal = cd_reservation.getRental_amount().setScale(2, RoundingMode.HALF_UP).toString();

                // Replace reservation values for the email
                htmlContent = htmlContent.replace("{{carModel}}", carModel)
                        .replace("{{customerName}}", customerName)
                        .replace("{{detailedPickUpDateAndTime}}", detailedPickUpDateAndTime)
                        .replace("{{driverName}}", driverName)
                        .replace("{{driverContactNo}}", driverContactNo)

                        .replace("{{pickUpLocation}}", pickUpLocation)
                        .replace("{{dropOffLocation}}", dropOffLocation)
                        .replace("{{pickUpDateAndTime}}", pickUpDateAndTime)
                        .replace("{{dropOffDate&Time}}", dropOffDateAndTime)
                        .replace("{{multipleStops}}", multipleStops)

                        .replace("{{licensePlate}}", licensePlate)
                        .replace("{{seats}}", passengerSeats)
                        .replace("{{color}}", color)

                        .replace("{{allocatedDuration}}", allocatedDuration)
                        .replace("{{allocatedKM}}", allocatedKM)
                        .replace("{{packagePrice}}", packagePrice)
                        .replace("{{pricePerAddKm}}", pricePerAddKm)
                        .replace("{{pricePerAddHour}}", pricePerAddHour)

                        .replace("{{packagePrice}}", packagePrice)
                        .replace("{{pickUpCharge}}", pickUpCharge)
                        .replace("{{estimatedTotal}}", estimatedTotal);

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
