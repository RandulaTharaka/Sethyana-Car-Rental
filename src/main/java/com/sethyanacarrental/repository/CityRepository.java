package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Integer> {

    @Query("SELECT city FROM City city WHERE city.district_id.id=:districtid")
    List<City> cityListByDistrict(@Param("districtid") Integer districtid); // List: Return More than one row //districtid is Integer //@Param send the param to Query
}
