package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.VehicleBrand;
import com.sethyanacarrental.repository.VehicleBrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vehicle_brand")
public class VehicleBrandController {

    @Autowired
    private VehicleBrandRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<VehicleBrand> vehicleBrandList() {
        return dao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
