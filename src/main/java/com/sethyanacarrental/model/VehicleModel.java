package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "model")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", unique = true)
    @Basic(optional = false)
    private String name;

    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private VehicleBrand brand_id;

    @JoinColumn(name = "vehicle_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private VehicleType vehicle_type_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "model_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ModelHasColor> modelHasColorList;
}
