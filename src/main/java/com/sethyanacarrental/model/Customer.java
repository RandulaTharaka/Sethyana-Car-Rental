package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity //identify as a model
@Table(name = "customer") //map with database table
@Data //setters & getters
@NoArgsConstructor //empty constructor
@AllArgsConstructor //all arguments constructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class Customer {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Basic(optional = false) //not null
    @Column(name = "id") //map with database column name
    private Integer id;

    @Column(name = "register_no", unique = true) //, unique=true
    @Basic(optional = false)
    private String register_no;

    @Column(name = "photo")
    @Basic(optional = true)
    private Byte photo;

    @Column(name = "first_name")
    @Basic(optional = true)
    private String first_name;

    @Column(name = "last_name")
    @Basic(optional = true)
    private String last_name;

    @Column(name = "nic")
    @Basic(optional = true)
//    @Pattern(regexp = "", message = "Invalid Reg No") //regexp:use same validation used in front end text binding
    private String nic;

    @Column(name = "address")
    @Basic(optional = true)
    private String address;

    @Column(name = "phone")
    @Basic(optional = true)
    private String phone;

    @Column(name = "email")
    @Basic(optional = true)
    private String email;

    @Column(name = "license_no")
    @Basic(optional = true)
    private String license_no;

    @Column(name = "license_exp_date")
    @Basic(optional = true)
    private LocalDate license_exp_date;

    @Column(name = "company_name")
    @Basic(optional = true)
    private String company_name;

    @Column(name = "company_address")
    @Basic(optional = true)
    private String company_address;

    @Column(name = "company_email")
    @Basic(optional = true)
    private String company_email;

    @Column(name = "company_phone")
    @Basic(optional = true)
    private String company_phone;

    @Column(name = "contact_person_name")
    @Basic(optional = true)
    private String contact_person_name;

    @Column(name = "contact_person_phone")
    @Basic(optional = true)
    private String contact_person_phone;

    @Column(name = "contact_person_nic")
    @Basic(optional = true)
    private String contact_person_nic;

    @Column(name = "added_date")
    @Basic(optional = false)
    private LocalDate added_date;

    @Column(name = "notes")
    @Basic(optional = true)
    private String notes;

    @Column(name = "points")
    @Basic(optional = true)
    private Integer points;

    @JoinColumn(name = "customer_type_id", referencedColumnName = "id") //column name //referenced column name
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    //many to one relationship //'Eager' brings object from the reference where 'Lazy' doesn't
    private CustomerType customer_type_id;

    @JoinColumn(name = "customer_status_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private CustomerStatus customer_status_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    public Customer(String customerRegNo) {
        this.register_no = customerRegNo;
    }
}
