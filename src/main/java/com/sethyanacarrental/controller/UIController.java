package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.User;
import com.sethyanacarrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class UIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ModelAndView error() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error.html");
        return modelAndView;
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET)
    public ModelAndView config() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("config.html");
        return modelAndView;
    }

    @GetMapping(value = {"/employee"})
    public ModelAndView employeeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("employee.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @GetMapping(path = "/employee/{id}")
    public ModelAndView employeessui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("employee.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }


    @GetMapping(value = "/privilege")
    public ModelAndView privilegeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("privilege.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }


    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView user() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("user.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/customer", method = RequestMethod.GET)
    public ModelAndView customer() {
        ModelAndView modelAndView = new ModelAndView(); //ModelAndView type attach a view to the ui and return
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName()); // get logged username and find in db

        if (user != null) { //check user null
            modelAndView.setViewName("customer.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/vehicle", method = RequestMethod.GET)
    public ModelAndView vehicle() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("vehicle.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/package", method = RequestMethod.GET)
    public ModelAndView packages() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("package.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/cd_reservation", method = RequestMethod.GET)
    public ModelAndView cd_reservation() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("cd_reservation.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }


    @RequestMapping(value = "/driverPortal", method = RequestMethod.GET)
    public ModelAndView driverPortal() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("driver_portal.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/sd_reservation", method = RequestMethod.GET)
    public ModelAndView sd_reservation() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("sd_reservation.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/customer_payment", method = RequestMethod.GET)
    public ModelAndView customer_payment() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            modelAndView.setViewName("customer_payment.html");
        } else{
            modelAndView.setViewName("error.html");
        }
        return modelAndView;
    }

    @GetMapping(value = {"/report_revenue"})
    public ModelAndView report_revenue() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if (user != null) {
            modelAndView.setViewName("report_revenue.html");
        } else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }
}