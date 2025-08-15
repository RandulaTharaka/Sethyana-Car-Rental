//package com.sethyanacarrental.controller;
//
//import com.sethyanacarrental.model.SelfDriveReservation;
//import com.sethyanacarrental.model.User;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.core.io.Resource;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//
//import java.io.InputStream;
//import java.math.BigDecimal;
//import java.math.RoundingMode;
//import java.nio.charset.StandardCharsets;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.Arrays;
//import java.util.Base64;
//import java.util.HashMap;
//import java.util.Locale;
//
//public class temporary {
//    @PutMapping
//    public String update(@RequestBody SelfDriveReservation sd_reservation) {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User user = userService.findUserByUserName(auth.getName());
//        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "SDRESERVATION");
//
//        if (user != null && priv != null && priv.get("update")) {
//            try {
//                dao.save(sd_reservation);
//
//                // Sending Confirmation Email
//                try {
//                    String subject = "Your Vehicle Reservation Confirmed! Reservation ID: " + sd_reservation.getSd_reservation_code();
//
//                    Resource resource = new ClassPathResource("static/sdr_confirm_email.html");
//                    InputStream inputStream = resource.getInputStream();
//                    String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
//
//
//                    byte[] encodedVehicleImage = sd_reservation.getVehicle_id().getDisplay_photo();
//                    byte[] decodedVehicleImage = Base64.getDecoder().decode(encodedVehicleImage);
//                    String base64EncodedImage = Base64.getEncoder().encodeToString(decodedVehicleImage);
//                    htmlContent = htmlContent.replace("base64EncodedImage", "data:image/jpeg;base64," + base64EncodedImage);
//
//
//                    emailService.sendHTMLEmail("iamrandula@gmail.com", subject, htmlContent);
//                } catch (Exception ex) {
//                    System.out.println("Email sent unsuccessful..." + ex.getMessage());
//                    return "Email sent unsuccessful..." + ex.getMessage();
//                }
//
//                return "0";
//            } catch (Exception ex) {
//                return "Save Not Completed..." + ex.getMessage();
//            }
//        } else {
//            return "Error in Updating: You have no privilege!";
//        }
//    }
//}
