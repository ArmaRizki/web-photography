
package com.portfolio.photographer.service;

import com.portfolio.photographer.dto.BookingRequest;
import com.portfolio.photographer.dto.BookingResponse;
import com.portfolio.photographer.dto.BookingStatusUpdateRequest;
import com.portfolio.photographer.entity.Booking;
import com.portfolio.photographer.entity.PackageItem;
import com.portfolio.photographer.exception.ResourceNotFoundException;
import com.portfolio.photographer.repository.BookingRepository;
import com.portfolio.photographer.repository.PackageItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PackageItemRepository packageItemRepository;
    private final TermsService termsService;

    public List<BookingResponse> getAll() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse create(BookingRequest request) {
        PackageItem selectedPackage = packageItemRepository.findById(request.packageId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "PackageItem", request.packageId()
                ));

        Booking booking = new Booking();
        booking.setName(request.name());
        booking.setEmail(request.email());
        booking.setPhone(request.phone());
        booking.setEventType(request.eventType());
        booking.setEventDate(request.eventDate());
        booking.setEventTime(request.eventTime());
        booking.setPackageTitle(selectedPackage.getTitle());
        booking.setPackagePrice(selectedPackage.getPrice());
        booking.setEventLocation(request.eventLocation());
        booking.setBudget(request.budget());
        booking.setMessage(request.message());
        termsService.validateVersion(request.termsVersion());

        booking.setTermsAccepted(request.termsAccepted());
        booking.setTermsAcceptedAt(java.time.LocalDateTime.now());
        booking.setTermsVersion(request.termsVersion());

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse updateStatus(Long id, BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));

        booking.setStatus(request.status());

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public void delete(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking", id);
        }

        bookingRepository.deleteById(id);
    }

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getName(),
                b.getEmail(),
                b.getPhone(),
                b.getEventType(),
                b.getEventDate(),
                b.getEventTime(),
                b.getPackageTitle(),
                b.getPackagePrice(),
                b.getEventLocation(),
                b.getBudget(),
                b.getMessage(),
                b.getStatus(),
                b.getCreatedAt()
        );
    }
}

