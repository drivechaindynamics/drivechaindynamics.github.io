// Drivechain Dynamics JavaScript functionality

$(document).ready(function() {
    
    // Pricing Calculator functionality for Gas Engines
    function updatePricing() {
        var engineSize = $('#engineSize').val();
        var fuelSystem = $('#fuelSystem').val();
        var installation = $('#installation').val();
        
        var enginePrices = {
            '80cc': 599,
            '100cc': 899,
            '250w': 799
        };
        
        var fuelSystemPrices = {
            'standard': 149,
            'large': 199,
            'premium': 249,
            'none': 0
        };
        
        var installationPrices = {
            'basic': 299,
            'premium': 449
        };
        
        var total = enginePrices[engineSize] + fuelSystemPrices[fuelSystem] + installationPrices[installation];
        
        $('#totalPrice').text('$' + total.toLocaleString());
    }
    
    // Update fuel system options when engine changes
    $('#engineSize').change(function() {
        var engineSize = $(this).val();
        var fuelSystemSelect = $('#fuelSystem');
        
        if (engineSize === '250w') {
            // Electric motor - no fuel system needed
            fuelSystemSelect.html(
                '<option value="none">No Fuel System (Electric) - $0</option>'
            );
        } else {
            // Gas engines - show fuel system options
            fuelSystemSelect.html(
                '<option value="standard">Standard Tank (1.5L) - $149</option>' +
                '<option value="large">Large Tank (2.4L) - $199</option>' +
                '<option value="premium">Premium Tank (3.0L) - $249</option>'
            );
        }
        updatePricing();
    });
    
    // Update pricing when any dropdown changes
    $('#fuelSystem, #installation').change(updatePricing);
    
    // Initialize pricing on page load
    updatePricing();
    
    // Smooth scrolling for navigation links
    $('.nav-item').click(function(e) {
        var target = $(this).attr('href');
        if (target.startsWith('#')) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top - 70
            }, 800);
        }
    });
    
    // Header scroll arrow click
    $('.header-btns a').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 70
        }, 800);
    });
    
    // Product configuration buttons (placeholder functionality)
    $('.product-card button').click(function() {
        var productName = $(this).closest('.product-card').find('h3').text();
        alert('Configure your ' + productName + ' bike! This would open a detailed configuration page.');
    });
    
    // Schedule consultation button
    $('button:contains("Schedule Consultation")').click(function() {
        alert('Thank you for your interest! This would open a scheduling calendar or contact form.');
    });
    
    // Contact form submission (placeholder)
    $('.contact-us form').submit(function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
    });
    
    // Bike Recommendation System
    $('#bikeRecommendationForm').submit(function(e) {
        e.preventDefault();
        
        var mileage = parseInt($('#mileage').val());
        var height = $('#height').val();
        var weight = $('#weight').val();
        
        if (!mileage || !height || !weight) {
            alert('Please fill in all fields to get your recommendation.');
            return;
        }
        
        var recommendation = calculateBikeRecommendation(mileage, height, weight);
        displayRecommendation(recommendation);
    });
    
    function calculateBikeRecommendation(mileage, height, weight) {
        var bikes = {
            eco: {
                name: "80cc Gas Engine",
                price: "$899",
                range: "200 miles per tank",
                maxWeight: 220,
                idealMileage: 200,
                power: "80cc",
                description: "Perfect for city commuting and casual rides"
            },
            performance: {
                name: "100cc Gas Engine",
                price: "$1,599", 
                range: "450 miles per tank",
                maxWeight: 350,
                idealMileage: 450,
                power: "100cc",
                description: "Maximum power for serious riders"
            },
            electric: {
                name: "250W Electric Motor", 
                price: "$1,299",
                range: "200 miles per charge",
                maxWeight: 250,
                idealMileage: 200,
                power: "250W",
                description: "Silent and eco-friendly for urban commuting"
            }
        };
        
        var score = {eco: 0, performance: 0, electric: 0};
        
        // Mileage scoring based on range
        if (mileage <= 150) {
            score.eco += 3;
            score.electric += 2;
            score.performance += 1;
        } else if (mileage <= 200) {
            score.eco += 3;
            score.electric += 3;
            score.performance += 2;
        } else if (mileage <= 350) {
            score.eco += 1;
            score.electric += 1;
            score.performance += 3;
        } else {
            score.eco += 0;
            score.electric += 0;
            score.performance += 3;
        }
        
        // Weight scoring
        var weightNum = weight === 'light' ? 125 : weight === 'medium' ? 185 : 250;
        
        if (weightNum <= 150) {
            score.eco += 3;
            score.electric += 3;
            score.performance += 1;
        } else if (weightNum <= 220) {
            score.eco += 2;
            score.electric += 2;
            score.performance += 2;
        } else {
            score.eco += 1;
            score.electric += 1;
            score.performance += 3;
        }
        
        // Height consideration (all bikes work, but note for comfort)
        var frameNote = "";
        if (height === 'short') {
            frameNote = " We recommend adjustable components for optimal fit.";
        } else if (height === 'tall') {
            frameNote = " We recommend extended seat post and handlebar adjustments.";
        }
        
        // Determine winner
        var maxScore = Math.max(score.eco, score.performance, score.electric);
        var recommendedBike;
        
        if (score.performance === maxScore) {
            recommendedBike = bikes.performance;
        } else if (score.electric === maxScore) {
            recommendedBike = bikes.electric;
        } else {
            recommendedBike = bikes.eco;
        }
        
        // Generate reason
        var reason = "Based on your " + mileage + " mile daily needs";
        if (recommendedBike === bikes.performance) {
            reason += ", you need maximum range and power";
        } else if (recommendedBike === bikes.electric) {
            reason += ", an electric motor offers silent operation and eco-friendly performance";
        } else {
            reason += ", the 80cc gas engine provides reliable performance";
        }
        reason += " for your riding style." + frameNote;
        
        return {
            bike: recommendedBike,
            reason: reason,
            userMileage: mileage,
            userWeight: weight,
            userHeight: height
        };
    }
    
    function displayRecommendation(recommendation) {
        $('#recommendedBike').text(recommendation.bike.name + ' - ' + recommendation.bike.price);
        $('#recommendationReason').text(recommendation.reason);
        $('#bikeSpecs').html(
            '<strong>Power:</strong> ' + recommendation.bike.power + '<br>' +
            '<strong>Range:</strong> ' + recommendation.bike.range + '<br>' +
            '<strong>Best For:</strong> ' + recommendation.bike.description
        );
        $('#recommendationResult').fadeIn();
        
        // Scroll to show result
        $('html, body').animate({
            scrollTop: $('#recommendationResult').offset().top - 100
        }, 500);
    }
    
    // Add loading animation removal after page loads
    $(window).on('load', function() {
        $('.loading-overlay').fadeOut('slow');
    });
    
    // Navbar background change on scroll
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar-default').addClass('navbar-scrolled');
        } else {
            $('.navbar-default').removeClass('navbar-scrolled');
        }
    });
    
});
