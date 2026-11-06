package com.portfolio.photographer.dto;

import jakarta.validation.constraints.NotBlank;

public record VideoRequest(
        @NotBlank(message = "Title is required") String title,
        @NotBlank(message = "Video URL is required") String videoUrl,
        String thumbnailUrl,
        Integer displayOrder
) {
}
