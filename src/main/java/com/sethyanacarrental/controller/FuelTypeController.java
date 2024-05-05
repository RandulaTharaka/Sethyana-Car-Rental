package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.FuelType;
import com.sethyanacarrental.repository.FuelTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/fuel_type")
public class FuelTypeController {

    @Autowired
    private FuelTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<FuelType> fuelTypeList() {
        return dao.findAll();
    }
}
