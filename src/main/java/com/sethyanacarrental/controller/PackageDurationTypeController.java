package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PackageDurationType;
import com.sethyanacarrental.repository.PackageDurationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/package_duration_type")
public class PackageDurationTypeController {

    @Autowired
    private PackageDurationTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PackageDurationType> packageDurationTypeList() {
        return dao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
