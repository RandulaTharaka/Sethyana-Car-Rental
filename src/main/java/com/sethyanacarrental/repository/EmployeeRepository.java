package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query(value = "SELECT * FROM Employee e WHERE e.callingname = ?1", nativeQuery = true)
    List<Employee> lists(String caname);


    @Query(value = "SELECT NEW Employee(e.id,e.callingname) FROM Employee e")
    List<Employee> list();

    @Query(value = "SELECT CONCAT('EMP', lpad(substring(max(emp.number), 4, 10) + 1, 7, 0)) " +
            "FROM sethyana_car_rental.employee AS emp;", nativeQuery = true)
    String getNextNumber();

    @Query(value = "SELECT NEW Employee(e.id,e.callingname) FROM Employee e " +
            "WHERE e NOT IN (SELECT u.employeeId FROM User u)")
    List<Employee> listWithoutUsers();

    @Query(value = "SELECT NEW Employee(e.id,e.callingname) FROM Employee e " +
            "WHERE e IN (Select u.employeeId FROM User u)")
    List<Employee> listWithUseraccount();

    @Query("SELECT e FROM Employee e WHERE e.callingname <> 'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(Pageable of);

    @Query("SELECT e FROM Employee e WHERE (e.callingname LIKE CONCAT('%',:searchtext,'%')) AND " +
            "e.callingname<>'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query("SELECT e FROM Employee e WHERE e.nic= :nic")
    Employee findByNIC(@Param("nic") String nic);

    @Query("SELECT e FROM Employee e WHERE e.number= :number")
    Employee findByNumber(@Param("number") String number);


}
