package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.DriverStatus;
import com.sethyanacarrental.repository.DriverStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/driver_status")
public class DriverStatusController {

    @Autowired
    private DriverStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<DriverStatus> driverStatusList() {
        return dao.findAll();
    }
}
