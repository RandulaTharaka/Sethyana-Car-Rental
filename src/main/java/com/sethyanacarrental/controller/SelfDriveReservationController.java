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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

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

    @PostMapping
    public String insert(@RequestBody SelfDriveReservation sd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "SDRESERVATION");

        if (user != null && priv != null && priv.get("add")) {
            try {
                // If no ongoing reservation, vehicle status set to reserved
                if (sd_reservation.getVehicle_id().getVehicle_status_id().getId() == 2) {
                    Vehicle vehicle = daoVehicle.getById(sd_reservation.getVehicle_id().getId());
                    vehicle.setVehicle_status_id(sd_reservation.getVehicle_id().getVehicle_status_id());
                    daoVehicle.save(vehicle);
                }

                dao.save(sd_reservation);

                // Sending Confirmation SMS
                String firstName = sd_reservation.getCustomer_id().getFirst_name();
                String vehicleModel = sd_reservation.getVehicle_id().getModel_id().getBrand_id().getName()  + " " + sd_reservation.getVehicle_id().getModel_id().getName();

                String pickUpDateTime = sd_reservation.getPick_up_datetime().toString();
                String[] pickUpDateAndTimeArray = pickUpDateTime.split("T");
                String pickUpDate = pickUpDateAndTimeArray[0];

                String phone = sd_reservation.getCustomer_id().getPhone();
                if(phone.charAt(0) == '0'){
                    phone = phone.substring(1);
                    phone = "+94" + phone;
                }

                SMS sms = new SMS();
                sms.setTo("+94778719766");
                String message = "Hello " +  firstName + ", your reservation for " +  vehicleModel + " on " +  pickUpDate +
                                 " is confirmed! Please check your email for further details.";
                sms.setMessage(message);
//                smsService.send(sms);

                return "0"; //if successful, return 0
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Saving: You have no Privilege!";
        }
    }

    @PutMapping
    public String update(@RequestBody SelfDriveReservation sd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "SDRESERVATION");

        if (user != null && priv != null && priv.get("update")) {
            try {
                dao.save(sd_reservation);

                // Sending Confirmation Email

                if(sd_reservation.getCustomer_id().getCustomer_type_id().getId() == 1){ // Individual Customer
                    String toEmail = sd_reservation.getCustomer_id().getEmail();
                }else{ // Company Customer
                    String toEmail = sd_reservation.getCustomer_id().getCompany_email();
                }

                try {
                    String subject = "Your Vehicle Reservation Confirmed! Reservation ID: " + sd_reservation.getSd_reservation_code();
//                  String htmlBody = "<div style='background-color:green'><p style='color:blue'>Testing</p><div>";
                  /*  try{
                        String htmlContent = new String(Files.readAllBytes(Paths.get("static/email_reservation_confirm.html")), StandardCharsets.UTF_8);
                        System.out.println("htmlContent: " + htmlContent);
                    }catch(Exception ex){
                        System.out.println("htmlContent unsuccessful..." + ex.getMessage());
                        return "htmlContent unsuccessful..." + ex.getMessage();
                    }*/

                   /* try {
                        Resource resource = new ClassPathResource("static/email_reservation_confirm.html");
                        InputStream inputStream = resource.getInputStream();
                        String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                        System.out.println("htmlContent: " + htmlContent);
                    } catch (IOException ex) {
                        ex.printStackTrace();
                        return "htmlContent unsuccessful..." + ex.getMessage();
                    }*/

                    Resource resource = new ClassPathResource("static/email_reservation_confirm.html");
                    InputStream inputStream = resource.getInputStream();
                    String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);


                    emailService.sendHTMLEmail("iamrandula@gmail.com", subject, htmlContent);
                } catch (Exception ex) {
                    System.out.println("Email sent unsuccessful..." + ex.getMessage());
                    return "Email sent unsuccessful..." + ex.getMessage();
                }

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
}
