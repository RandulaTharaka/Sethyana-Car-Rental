package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.AirConditionType;
import com.sethyanacarrental.repository.AirConditionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/air_condition")
public class AirConditionTypeController {
    @Autowired
    private AirConditionTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<AirConditionType> airConditionTypeList() {
        return dao.findAll();
    }

}
