package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "license_plate", unique = true)
    @Basic(optional = false)
    private String license_plate;

    @Column(name = "km_per_liter")
    private Integer km_per_liter;

    @Column(name = "num_of_seats")
    @Basic(optional = false)
    private Integer num_of_seats;

    @Column(name = "passenger_seats")
    @Basic(optional = false)
    private String passenger_seats;

    @Column(name = "num_of_luggage")
    private Integer num_of_luggage;

    @Column(name = "max_weight")
    private Integer max_weight;

    @Column(name = "entry_odometer")
    @Basic(optional = false)
    private Integer entry_odometer;

    @Column(name = "current_odometer")
    @Basic(optional = false)
    private Integer current_odometer;

    @Column(name = "music_player")
    private Boolean music_player;

    @Column(name = "usb_charging")
    private Boolean usb_charging;

    @Column(name = "rearview_camera")
    private Boolean rearview_camera;


    @Column(name = "owner_name")
    private String owner_name;

    @Column(name = "owner_phone")
    private String owner_phone;

    @Column(name = "owner_address")
    private String owner_address;

    @Column(name = "display_photo")
    private byte[] display_photo;

    @Column(name = "revenue_license_exp_date")
    private LocalDate revenue_license_exp_date;

    @Column(name = "insurance_exp_date")
    private LocalDate insurance_exp_date;

    @Column(name = "next_service_date")
    private LocalDate next_service_date;

    @Column(name = "next_service_odometer")
    private Integer next_service_odometer;

    @Column(name = "notes")
    private String notes;

    @Column(name = "added_date")
    @Basic(optional = false)
    private LocalDate added_date;


    @JoinColumn(name = "model_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)

    private VehicleModel model_id;

    @JoinColumn(name = "transmission_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private TransmissionType transmission_type_id;

    @JoinColumn(name = "air_condition_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private AirConditionType air_condition_type_id;

    @JoinColumn(name = "fuel_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private FuelType fuel_type_id;

    @JoinColumn(name = "color_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER) //set optional false
    private Color color_id;

    @JoinColumn(name = "owner_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private OwnerType owner_type_id;

    @JoinColumn(name = "vehicle_status_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private VehicleStatus vehicle_status_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

}
