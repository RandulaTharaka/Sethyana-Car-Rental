package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.PickUpLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickUpLocationRepository extends JpaRepository<PickUpLocation, Integer> {
}
