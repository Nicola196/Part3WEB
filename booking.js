// Booking system functionality
document.addEventListener('DOMContentLoaded', function() {
    initBookingSystem();
});

function initBookingSystem() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    const steps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Initialize date picker
    initDatePicker();
    
    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepId = this.getAttribute('data-next');
            const nextStep = document.getElementById(`step-${nextStepId}`);
            
            if (validateStep(currentStep.id)) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                updateBookingSummary();
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepId = this.getAttribute('data-prev');
            const prevStep = document.getElementById(`step-${prevStepId}`);
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
        });
    });
    
    // Service selection
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBookingSummary);
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

function initDatePicker() {
    const dateInput = document.getElementById('appointment-date');
    if (!dateInput) return;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set min date to tomorrow
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Generate time slots when date is selected
    dateInput.addEventListener('change', generateTimeSlots);
}

function generateTimeSlots() {
    const date = this.value;
    const slotsContainer = document.getElementById('time-slots-container');
    
    if (!date || !slotsContainer) return;
    
    // Clear previous slots
    slotsContainer.innerHTML = '';
    
    // Generate time slots (9 AM to 7 PM)
    const timeSlots = [];
    for (let hour = 9; hour <= 19; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeSlots.push(timeString);
        }
    }
    
    // Create time slot buttons
    timeSlots.forEach(time => {
        const slotButton = document.createElement('button');
        slotButton.type = 'button';
        slotButton.className = 'time-slot';
        slotButton.textContent = time;
        slotButton.addEventListener('click', function() {
            // Remove selected class from all slots
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('selected');
            });
            // Add selected class to clicked slot
            this.classList.add('selected');
            updateBookingSummary();
        });
        
        slotsContainer.appendChild(slotButton);
    });
}

function validateStep(stepId) {
    switch (stepId) {
        case 'step-1':
            return validateServices();
        case 'step-2':
            return validateDateTime();
        case 'step-3':
            return validatePersonalInfo();
        default:
            return true;
    }
}

function validateServices() {
    const selectedServices = document.querySelectorAll('input[name="services"]:checked');
    if (selectedServices.length === 0) {
        alert('Please select at least one service');
        return false;
    }
    return true;
}

function validateDateTime() {
    const date = document.getElementById('appointment-date');
    const selectedTime = document.querySelector('.time-slot.selected');
    
    if (!date || !date.value) {
        alert('Please select a date');
        return false;
    }
    
    if (!selectedTime) {
        alert('Please select a time');
        return false;
    }
    
    return true;
}

function validatePersonalInfo() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    if (!name || !email || !phone) return false;
    
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Name validation
    if (!name.value || name.value.length < 2) {
        showError('name-error', 'Please enter your full name');
        isValid = false;
    }
    
    // Email validation
    if (!email.value) {
        showError('email-error', 'Please enter your email address');
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showError('email-error', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (!phone.value) {
        showError('phone-error', 'Please enter your phone number');
        isValid = false;
    } else if (!validatePhone(phone.value)) {
        showError('phone-error', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
}

function updateBookingSummary() {
    // Update services
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(checkbox => {
            const label = checkbox.nextElementSibling;
            const serviceName = label.querySelector('.service-name').textContent;
            const servicePrice = label.querySelector('.service-price').textContent;
            return { name: serviceName, price: servicePrice };
        });
    
    const servicesSummary = document.getElementById('summary-services');
    if (servicesSummary) {
        if (selectedServices.length > 0) {
            servicesSummary.textContent = selectedServices.map(s => s.name).join(', ');
        } else {
            servicesSummary.textContent = 'None selected';
        }
    }
    
    // Update date and time
    const date = document.getElementById('appointment-date');
    const selectedTime = document.querySelector('.time-slot.selected');
    const datetimeSummary = document.getElementById('summary-datetime');
    
    if (datetimeSummary) {
        if (date && date.value && selectedTime) {
            const formattedDate = new Date(date.value).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            datetimeSummary.textContent = `${formattedDate} at ${selectedTime.textContent}`;
        } else {
            datetimeSummary.textContent = 'Not selected';
        }
    }
    
    // Update duration and total
    const durationSummary = document.getElementById('summary-duration');
    const totalSummary = document.getElementById('summary-total');
    
    if (selectedServices.length > 0) {
        // Calculate total (simplified - in real app, parse prices properly)
        const total = selectedServices.reduce((sum, service) => {
            const price = parseInt(service.price.replace(/[^\d]/g, '')) || 0;
            return sum + price;
        }, 0);
        
        // Calculate duration (simplified)
        const duration = selectedServices.length * 60; // 60 minutes per service
        
        if (durationSummary) durationSummary.textContent = `${duration} min`;
        if (totalSummary) totalSummary.textContent = `R${total}`;
    } else {
        if (durationSummary) durationSummary.textContent = '0 min';
        if (totalSummary) totalSummary.textContent = 'R0';
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    if (validateStep('step-3')) {
        // Show loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Booking...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            alert('Thank you! Your appointment has been booked successfully. We look forward to seeing you!');
            
            // Reset form
            event.target.reset();
            const step1 = document.getElementById('step-1');
            const step3 = document.getElementById('step-3');
            if (step1 && step3) {
                step1.classList.add('active');
                step3.classList.remove('active');
            }
            updateBookingSummary();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}