package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.ReservationStatus;
import com.sethyanacarrental.repository.ReservationStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/reservation_status")
public class ReservationStatusController {

    @Autowired
    private ReservationStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ReservationStatus> reservationStatusList() {
        return dao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @GetMapping(value = "/limited_list", produces = "application/json")
    public List<ReservationStatus> reservationStatusLimitedList() {
        return dao.limitedList();
    }
}
