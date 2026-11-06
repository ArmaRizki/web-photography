package com.portfolio.photographer.dto;

import com.portfolio.photographer.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(
        @NotNull(message = "Status is required") BookingStatus status
) {
}
