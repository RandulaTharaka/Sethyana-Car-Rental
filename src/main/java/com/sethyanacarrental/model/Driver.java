package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "driver")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "full_name")
    @Basic(optional = false)
    private String full_name;

    @Column(name = "calling_name")
    @Basic(optional = false)
    private String calling_name;

    @Column(name = "driving_license")
    @Basic(optional = false)
    private String driving_license;

    @Column(name = "license_exp_date")
    @Basic(optional = false)
    private LocalDate license_exp_date;

    @Column(name = "level")
    @Basic(optional = false)
    private Integer level;

    @Column(name = "drove_trip_km")
    private Integer drove_trip_km;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)

    private Employee employee_id;

    @JoinColumn(name = "driver_status_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private DriverStatus driver_status_id;
}
