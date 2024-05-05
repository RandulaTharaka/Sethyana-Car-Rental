package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.District;
import com.sethyanacarrental.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/district")
public class DistrictController {

    @Autowired
    private DistrictRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<District> districtList() {
        return dao.findAll();
    }
}
