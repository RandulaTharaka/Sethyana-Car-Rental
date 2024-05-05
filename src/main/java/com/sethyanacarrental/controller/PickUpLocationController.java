package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PickUpLocation;
import com.sethyanacarrental.repository.PickUpLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/pick_up_location")
public class PickUpLocationController {

    @Autowired
    private PickUpLocationRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PickUpLocation> pickUpLocationList() {
        return dao.findAll();
    }
}
