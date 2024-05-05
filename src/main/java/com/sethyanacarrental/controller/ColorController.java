package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.Color;
import com.sethyanacarrental.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/color")
public class ColorController {

    @Autowired
    private ColorRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Color> colorList() {
        return dao.findAll();
    }
}
