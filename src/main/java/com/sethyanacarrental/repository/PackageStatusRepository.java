package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.PackageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageStatusRepository extends JpaRepository<PackageStatus, Integer> {
}
