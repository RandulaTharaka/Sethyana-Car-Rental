package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "package")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "package_code", unique = true)
    @Basic(optional = false)
    private String package_code;

    @Column(name = "passenger_seats_count")
    @Basic(optional = false)
    private Integer passenger_seats_count;

    @Column(name = "package_km")
    @Basic(optional = false)
    private Integer package_km;

    @Column(name = "package_price")
    @Basic(optional = false)
    private BigDecimal package_price;

    @Column(name = "refundable_deposit")
    private BigDecimal refundable_deposit;

    @Column(name = "price_per_additional_km")
    @Basic(optional = false)
    private BigDecimal price_per_additional_km;

    @Column(name = "price_per_additional_hour")
    @Basic(optional = false)
    private BigDecimal price_per_additional_hour;

    @Column(name = "package_name")
    @Basic(optional = false)
    private String package_name;

    @Column(name = "description")
    private Boolean description;

    @Column(name = "added_date")
    @Basic(optional = false)
    private LocalDate added_date;

    @JoinColumn(name = "package_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PackageType package_type_id;

    @JoinColumn(name = "package_category_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)

    private PackageCategory package_category_id;

    @JoinColumn(name = "air_condition_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private AirConditionType air_condition_type_id;

    @JoinColumn(name = "package_duration_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PackageDuration package_duration_id;

    @JoinColumn(name = "package_status_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PackageStatus package_status_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "package_id", fetch = FetchType.LAZY, orphanRemoval = true)
    //orphanRemoval: for update
    private List<PackageHasModel> packageHasModelList;

    //Constructor (Package Id, Package Code, Package Km, Package Name)
    public Package(Integer id, String code, Integer km, String package_name) {
        this.id = id;
        this.package_name = package_name;
        this.package_code = code;
        this.package_km = km;
    }

    public Package(Integer id, String code, Integer km) {
        this.id = id;
        this.package_code = code;
        this.package_km = km;
    }

    public Package(String packageNextNo) {
        this.package_code = packageNextNo;
    }
}


