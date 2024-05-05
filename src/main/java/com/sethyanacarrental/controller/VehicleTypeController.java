package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.VehicleType;
import com.sethyanacarrental.repository.VehicleTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vehicle_type")
public class VehicleTypeController {

    @Autowired
    private VehicleTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<VehicleType> customerTypeList() {
        Sort sort = Sort.by(Sort.Order.asc("id"));
        return dao.findAll(sort);
    }
}
