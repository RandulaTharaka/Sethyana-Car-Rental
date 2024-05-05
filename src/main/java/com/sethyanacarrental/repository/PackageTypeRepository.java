package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.PackageType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageTypeRepository extends JpaRepository<PackageType, Integer> {
}
