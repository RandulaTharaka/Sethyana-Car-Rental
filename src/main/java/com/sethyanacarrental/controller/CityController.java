package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.City;
import com.sethyanacarrental.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/city")
public class CityController {

    @Autowired
    private CityRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<City> cityList() {
        return dao.findAll();
    }

    @GetMapping(value = "/listbydistrict", params = {"districtid"}, produces = "application/json")
    public List<City> cityListByDistrict(@RequestParam("districtid") int districtid) {
        return dao.cityListByDistrict(districtid);
    }
}
