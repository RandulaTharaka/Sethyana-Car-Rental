package com.sethyanacarrental.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "vehicle_photo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "photo_name")
    @Basic(optional = false)
    private String photo_name;

    @Column(name = "photo")
    @Basic(optional = false)
    private Byte photo;

    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JsonIgnore
    private Vehicle vehicle_id;
}
