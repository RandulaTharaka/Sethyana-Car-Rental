package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    //extended JpaRepository FROM Spring / more functionalities for crud
    //<Customer: class type, Integer: primary key type>

    //Query Returning Function Mapping
    @Query("SELECT c FROM Customer c WHERE (c.register_no LIKE CONCAT('%', :searchtext, '%') OR " +
            "c.first_name LIKE CONCAT('%', :searchtext, '%') OR c.last_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "c.company_name LIKE CONCAT('%', :searchtext, '%') OR c.customer_type_id.name LIKE CONCAT('%',:searchtext, '%') OR " +
            "c.phone LIKE CONCAT('%', :searchtext, '%') OR c.company_phone LIKE CONCAT('%', :searchtext, '%') OR " +
            "c.contact_person_phone LIKE CONCAT('%', :searchtext, '%') OR " +
            "c.email LIKE CONCAT('%', :searchtext, '%') OR c.company_email LIKE CONCAT('%', :searchtext, '%') OR " +
            "c.customer_status_id.name LIKE CONCAT('%', :searchtext, '%'))")
    Page<Customer> findAll(@Param("searchtext") String searchtext, Pageable of); //@Param to insert searchtext value to @Query

    @Query("SELECT c FROM Customer c WHERE c.customer_type_id='1'")
    List<Customer> listIndividual();

    @Query("SELECT c FROM Customer c WHERE c.customer_type_id='2'")
    List<Customer> listCompany();
    //Customer: model mapped with database customer column // c(2nd): dont need 'as'
    //has used JPA query(has many levels) because return type 'Page' otherwise can use sql Query
    //has written as JPA class level query: table name change into class name
    //this query cant handle objects(properties with foreign key) which are null passing (ex: city_id = null) Although column null passing is ok (ex:city_id.name = null OR first_name = null)

    @Query(value = "SELECT CONCAT('CUS', lpad(substring(max(cus.register_no), 4, 10) + 1, 7, 0)) " +
            "FROM sethyana_car_rental.customer AS cus;", nativeQuery = true)
    String getCustomerRegNo();

    @Query("SELECT c FROM Customer c WHERE c.nic=:nic")
    Customer checkNIC(@Param("nic") String nic);
}