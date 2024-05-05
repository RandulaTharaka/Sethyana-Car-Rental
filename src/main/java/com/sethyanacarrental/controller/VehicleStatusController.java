package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.VehicleStatus;
import com.sethyanacarrental.repository.VehicleStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vehicle_status")
public class VehicleStatusController {

    @Autowired
    private VehicleStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<VehicleStatus> vehicleStatusList() {
        return dao.findAll();
    }
}
