


(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-filter li').on('click', function () {
        $("#portfolio-filter li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });

    function skills(skills) {
        let html = (name, strength, strengthName) => `
<div class="skill-name">
    <p>${name}</p><p>${strengthName}</p>
</div>
<div class="progress">
    <div class="progress-bar" role="progressbar"></div>
</div>`


        let skilldetailhtml = (name, description, icon) => `
<div class="service-item">
    <div class="service-icon">
        <i class="${icon}"></i>
    </div>
    <div class="service-text">
        <h3>${name}</h3>
        <p>
            ${description}
        </p>
    </div>
</div>`

        skills.forEach((skill, idx) => {
            let dv = document.createElement("div")
            dv.setHTML(html(skill.skill, skill.strength, skill.strengthDescription))

            let dv2 = document.createElement("div")

            dv2.classList.add("col-lg-6", "wow", "fadeInUp")
            dv2.setAttribute("data-wow-delay", `0.${idx*2}s`)

            dv2.setHTML(skilldetailhtml(skill.skill, skill.description, skill.icon))

            let prog = dv.getElementsByClassName("progress-bar")[0]
            prog.setAttribute("aria-valuenow", skill.strength);
            prog.setAttribute("aria-valuemin", "0");
            prog.setAttribute("aria-valuemax", "10");

            document.getElementsByClassName("skills")[0].append(dv);
            document.getElementsByClassName("js-skill-detail")[0].append(dv2);
        })



        // Skills
        $('.skills').waypoint(function () {
            $('.progress .progress-bar').each(function () {
                $(this).css("width", $(this).attr("aria-valuenow") + '0%');
            });
        }, {offset: '80%'});

        // Typed Initiate
        if ($('.hero .hero-text h2').length == 1) {
            var typed_strings = $('.hero .hero-text .typed-text').text();
            var typed = new Typed('.hero .hero-text h2', {
                strings: typed_strings.split(', '),
                typeSpeed: 100,
                backSpeed: 20,
                smartBackspace: false,
                loop: true
            });
        }
    
    }

    function setData(className, value) {
        let fields = document.getElementsByClassName(className)

        for (var i = 0; i < fields.length; i++) {
            if (fields[i].tagName === "IMG") {
                fields[i].setAttribute("alt", value)
            } else if (fields[i].tagName === "A") {
                fields[i].setAttribute("href", value);
            } else {
                fields[i].innerHTML = value
            }
         }
    }

    function teamProfile(profile, idx) {
        let html = `
<div class="team-item">
    <div class="team-img">
        <img src="${profile.profilePicture}" alt="Image">
    </div>
    <div class="team-text">
        <h2>${profile.name}</h2>
        <h4>${profile.title}</h4>
        <p>
            ${profile.skills.map(sk => sk.skill).join(", ")}
        </p>
        <div class="team-social">
            <a class="btn" href="${profile.url}">View Profile</a>
        </div>
    </div>
</div>
        `;

        let teamContainer = document.getElementsByClassName("js-team-members")[0];

        let dv = document.createElement("div");
        dv.classList.add("col-lg-6", "wow", "fadeInUp")
        dv.setAttribute("data-wow-delay", `0.${idx*2}s`)
        dv.setHTML(html)

        teamContainer.append(dv);
    }

    fetch('./data.json')
        .then((response) => response.json())
        .then((data) => {
            setData("js-name", data.name);
            setData("js-title", data.title);
            setData("js-skills", data.skills.map(sk => sk.skill).join(", "))
            skills(data.skills)
            setData("js-phone", data.phone);
            setData("js-linkedin", data.linkedin);
            setData("js-resume", data.resume);
            setData("js-email", data.email);
            setData("js-years-of-experience", data.yearsOfExperience + "+ Years of Experience");
            setData("js-description", data.description)
        });

    fetch("https://joshatxantie.github.io/portfolios.json")
        .then(response => {
            return response.ok ? response.json() : {portfolios: []}
        })
        .then((data) => {
            if (data.portfolios && data.portfolios.length) {
                debugger;
                const randomPortfolios = data.portfolios
                    .filter(pr => pr !== location.href)
                    .sort(() => 0.5 - Math.random());

                // Get sub-array of first n elements after shuffled
                let selected = randomPortfolios.slice(0, 5);
                
                if (selected.length) {
                    for (let i = 0; i < selected.length; i++) {
                        fetch(selected[i] + "data.json")
                            .then(response => response.ok ? response.json() : {})
                            .then(data => {
                                teamProfile(data, i);
                            })
                    }
                } else {
                    document.getElementById("team").style.display = "none"
                }
            } else {
                document.getElementById("team").style.display = "none"
            }
        })
})(jQuery);



