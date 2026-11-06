
package com.portfolio.photographer.dto;

import com.portfolio.photographer.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BookingResponse(
        Long id,
        String name,
        String email,
        String phone,
        String eventType,
        LocalDate eventDate,
        LocalTime eventTime,
        String packageTitle,
        BigDecimal packagePrice,
        String eventLocation,
        String budget,
        String message,
        BookingStatus status,
        LocalDateTime createdAt
) {
}

