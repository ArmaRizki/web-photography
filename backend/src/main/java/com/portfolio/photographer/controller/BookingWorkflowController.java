package com.portfolio.photographer.controller;

import com.portfolio.photographer.entity.Booking;
import com.portfolio.photographer.entity.BookingStatus;
import com.portfolio.photographer.repository.BookingRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.portfolio.photographer.service.SmtpMailService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class BookingWorkflowController {
    private final BookingRepository bookingRepository;
    private final SmtpMailService smtpMailService;

    public record RescheduleRequest(@NotNull LocalDate eventDate, @NotNull LocalTime eventTime) {}

    @PostMapping("/{id}/accept")
    @Transactional
    public ResponseEntity<Map<String, Object>> accept(@PathVariable Long id) {
        Booking b = getBooking(id);
        b.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(b);
        sendConfirmation(b);
        return ResponseEntity.ok(Map.of("message", "Booking accepted and confirmation email sent.", "status", b.getStatus()));
    }

    @PatchMapping("/{id}/reschedule")
    @Transactional
    public ResponseEntity<Map<String, Object>> reschedule(@PathVariable Long id, @Valid @RequestBody RescheduleRequest request) {
        Booking b = getBooking(id);
        b.setEventDate(request.eventDate());
        b.setEventTime(request.eventTime());
        b.setStatus(BookingStatus.RESCHEDULE_REQUESTED);
        bookingRepository.save(b);
        sendReschedule(b);
        return ResponseEntity.ok(Map.of("message", "Schedule updated and reschedule email sent.", "status", b.getStatus()));
    }

    @PostMapping("/{id}/resend-email")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, String>> resendEmail(@PathVariable Long id) {
        Booking b = getBooking(id);
        if (b.getStatus() == BookingStatus.ACCEPTED) sendConfirmation(b);
        else if (b.getStatus() == BookingStatus.RESCHEDULE_REQUESTED) sendReschedule(b);
        else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email can only be resent for accepted or reschedule-requested bookings.");
        return ResponseEntity.ok(Map.of("message", "Email sent to " + b.getEmail()));
    }

    private Booking getBooking(Long id) {
        return bookingRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
    }

    private void sendConfirmation(Booking b) {
        send(b, "ELVOVE Photography — Booking Confirmed",
            "Hello " + b.getName() + ",\n\nYour photography booking has been accepted by ELVOVE Photography.\n\n"
            + details(b) + "\n\nPlease contact us if you have any questions.\n\nRegards,\n" + smtpMailService.getSenderName());
    }

    private void sendReschedule(Booking b) {
        send(b, "ELVOVE Photography — Schedule Update",
            "Hello " + b.getName() + ",\n\nELVOVE Photography would like to inform you of the proposed updated schedule:\n\n"
            + details(b) + "\n\nPlease reply to this email to confirm or discuss the proposed schedule.\n\nRegards,\n" + smtpMailService.getSenderName());
    }

    private String details(Booking b) {
        String time = b.getEventTime() == null ? "To be confirmed" : b.getEventTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        return "Event: " + b.getEventType() + "\nDate: " + b.getEventDate() + "\nTime: " + time
            + "\nPackage: " + (b.getPackageTitle() == null ? "-" : b.getPackageTitle())
            + "\nLocation: " + (b.getEventLocation() == null ? "-" : b.getEventLocation());
    }

    private void send(Booking b, String subject, String body) {
        smtpMailService.sendText(b.getEmail(), subject, body);
    }
}
