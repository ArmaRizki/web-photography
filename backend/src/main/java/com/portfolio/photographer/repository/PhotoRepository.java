package com.portfolio.photographer.repository;

import com.portfolio.photographer.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByCategoryIdOrderByDisplayOrderAsc(Long categoryId);
    List<Photo> findByFeaturedTrueOrderByDisplayOrderAsc();
    List<Photo> findAllByOrderByDisplayOrderAsc();
    List<Photo> findTop12ByOrderByCreatedAtDesc();
}
