package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.ModelHasColor;
import com.sethyanacarrental.repository.ModelHasColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/model_color")
public class ModelHasColorController {

    @Autowired
    private ModelHasColorRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ModelHasColor> modelHasColorList() {
        return dao.findAll();
    }
}
