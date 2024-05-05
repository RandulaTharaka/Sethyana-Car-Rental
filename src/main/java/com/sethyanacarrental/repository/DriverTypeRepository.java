package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.OwnerType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverTypeRepository extends JpaRepository<OwnerType, Integer> {
}
