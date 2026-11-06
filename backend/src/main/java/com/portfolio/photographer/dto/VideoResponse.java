package com.portfolio.photographer.dto;

public record VideoResponse(
        Long id,
        String title,
        String videoUrl,
        String thumbnailUrl,
        Integer displayOrder
) {
}
