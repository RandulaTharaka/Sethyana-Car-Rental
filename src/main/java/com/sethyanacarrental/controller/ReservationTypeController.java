package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.ReservationType;
import com.sethyanacarrental.repository.ReservationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/reservation_type")
public class ReservationTypeController {

    @Autowired
    private ReservationTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ReservationType> reservationTypeList() {
        return dao.findAll();
    }
}
