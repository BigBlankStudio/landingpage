/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/

/* 01 - VARIABLES */
/* 02 - WINDOW LOAD */
/* 03 - SWIPER SLIDER */
/* 04 - MOBILE MENU */
/* 05 - WINDOW SCROLL */
/* 06 - IZOTOPE */
/* 07 - CLICK */
/* 08 - VIDEO OPEN */
/* 09 - WOW ANIMATION */
/* 10 - PUSH SCROLL */

jQuery(function($) {
  "use strict";

  /*============================*/
  /* 01 - VARIABLES */
  /*============================*/

  var swipers = [],
    winW, winH, winScr, _isresponsive, $container, smPoint = 768,
    mdPoint = 992,
    lgPoint = 1200,
    addPoint = 1600,
    _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

  function pageCalculations() {
    winW = $(window).width();
    winH = $(window).height();
  }
  pageCalculations();

  $.exists = function(selector) {
    return ($(selector).length > 0);
  }

  if (_ismobile) { $('body').addClass('mobile'); }

  /*============================*/
  /* 02 - WINDOW LOAD */
  /*============================*/

  $(window).on('load', function() {
    $container.isotope({ itemSelector: '.isotope-item', masonry: { gutter: 0, columnWidth: '.grid-sizer' } });
    //izotopInit(); // this is comment
    izotopInit(); // this is uncomment
    $('.loader').hide(200);

  });
  $(window).on('resize', function() {
    izotopInit();
    $container.isotope({ itemSelector: '.isotope-item', masonry: { gutter: 0, columnWidth: '.grid-sizer' } });
  });

  $container = $('.isotope-content');

  /*============================*/
  /* 03 - SWIPER SLIDER */
  /*============================*/

  function updateSlidesPerView(swiperContainer) {
    if (winW >= addPoint) return parseInt(swiperContainer.attr('data-add-slides'), 10);
    else if (winW >= lgPoint) return parseInt(swiperContainer.attr('data-lg-slides'), 10);
    else if (winW >= mdPoint) return parseInt(swiperContainer.attr('data-md-slides'), 10);
    else if (winW >= smPoint) return parseInt(swiperContainer.attr('data-sm-slides'), 10);
    else return parseInt(swiperContainer.attr('data-xs-slides'), 10);
  }

  function resizeCall() {
    pageCalculations();

    $('.swiper-container.initialized[data-slides-per-view="responsive"]').each(function() {
      var thisSwiper = swipers['swiper-' + $(this).attr('id')],
        $t = $(this),
        slidesPerViewVar = updateSlidesPerView($t),
        centerVar = thisSwiper.params.centeredSlides;
      thisSwiper.params.slidesPerView = slidesPerViewVar;
      thisSwiper.reInit();
      if (!centerVar) {
        var paginationSpan = $t.closest('.poind-closest').find('.pagination span');
        var paginationSlice = paginationSpan.hide().slice(0, (paginationSpan.length + 1 - slidesPerViewVar));
        if (paginationSlice.length <= 1 || slidesPerViewVar >= $t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
        else $t.removeClass('pagination-hidden');
        paginationSlice.show();
      }
    });
  }
  if (!_ismobile) {
    $(window).resize(function() {
      resizeCall();
    });
  } else {
    window.addEventListener("orientationchange", function() {
      resizeCall();
    }, false);
  }

  $(document).ready(function() {
    swipeBox();
    qtyStepper();

    function enableFullWidth() {
      initFullWidth();
      $(window).bind('load resize', function() {
        initFullWidth();
      }).trigger('resize');
    }
    enableFullWidth();

    function initFullWidth() {
      $('.fullwidth').each(function() {
        var element = $(this),
          total_padding;

        if ($(window).width() > 1586) {
          total_padding = 200;
        } else if ($(window).width() > 992 && $(window).width() < 1600) {
          total_padding = 120;
        } else {
          total_padding = 0;
        }

        total_padding = (element.hasClass('full_stretch_row_content')) ? 0 : total_padding;

        // Styles
        element.css({ 'margin-left': '', 'width': '' });
        element.css({ 'margin-left': -(element.offset().left - (total_padding / 2)), 'width': ($(window).outerWidth() - total_padding) });

      });

    }
    //initFullWidth();
    initSwiper();
  });

  function qtyStepper() {

    if (typeof $.fn.number != 'function') {
      return;
    }

    if ($('input[type=number]').length) {
      console.log('sfsdf');
      $('input[type=number]').number();
    };
  }

  function initSwiper() {
    var initIterator = 0;
    $('.swiper-container').each(function() {
      var $t = $(this);

      var index = 'swiper-unique-id-' + initIterator;

      $t.addClass('swiper-' + index + ' initialized').attr('id', index);
      $t.closest('.poind-closest').find('.pagination').addClass('pagination-' + index);

      var autoPlayVar = parseInt($t.attr('data-autoplay'), 10);

      var slidesPerViewVar = $t.attr('data-slides-per-view');
      if (slidesPerViewVar == 'responsive') {
        slidesPerViewVar = updateSlidesPerView($t);
      } else slidesPerViewVar = parseInt(slidesPerViewVar, 10);

      var loopVar = parseInt($t.attr('data-loop'), 10);
      var speedVar = parseInt($t.attr('data-speed'), 10);
      var centerVar = parseInt($t.attr('data-center'), 10);
      swipers['swiper-' + index] = new Swiper('.swiper-' + index, {
        speed: speedVar,
        pagination: '.pagination-' + index,
        loop: loopVar,
        paginationClickable: true,
        autoplay: autoPlayVar,
        slidesPerView: slidesPerViewVar,
        keyboardControl: true,
        calculateHeight: true,
        simulateTouch: true,
        roundLengths: true,
        centeredSlides: centerVar,
        onInit: function(swiper) {
          var activeIndex = (loopVar === 1) ? swiper.activeLoopIndex : swiper.activeIndex;
          var sliderLen = $t.find('.swiper-slide').length;
          if (sliderLen <= 9) sliderLen = '0' + sliderLen;
          $t.find('.first-slide').addClass('active');
          $t.parent().find('.slider-number b').text(sliderLen - 2);
          $t.parent().find('.slider-number span').text(activeIndex + 1);
        },
        onSlideChangeEnd: function(swiper) {
          var activeIndex = (loopVar === 1) ? swiper.activeLoopIndex : swiper.activeIndex,
            qVal = $t.find('.swiper-slide-active').attr('data-val'),
            srcNext = $t.find('.swiper-slide-active').next().find('img').attr('src'),
            srcPrev = $t.find('.swiper-slide-active').prev().find('img').attr('src');
          $('.swiper-arrow-left').find('.preiew-img').attr('style', 'background-image:url(' + srcPrev + ')');
          $('.swiper-arrow-right').find('.preiew-img').attr('style', 'background-image:url(' + srcNext + ')');
          $t.find('.swiper-slide[data-val="' + qVal + '"]').addClass('active');
          $t.parent().find('.slider-number span').text(activeIndex + 1);
        },
        onSlideChangeStart: function(swiper) {
          $t.find('.swiper-slide.active').removeClass('active');
        }
      });
      swipers['swiper-' + index].reInit();
      if ($t.attr('data-slides-per-view') == 'responsive') {
        var paginationSpan = $t.closest('.poind-closest').find('.pagination span');
        var paginationSlice = paginationSpan.hide().slice(0, (paginationSpan.length + 1 - slidesPerViewVar));
        if (paginationSlice.length <= 1 || slidesPerViewVar >= $t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
        else $t.removeClass('pagination-hidden');
        paginationSlice.show();
      }
      initIterator++;
    });

  }

  $('.swiper-arrow-left').on('click', function() {
    swipers['swiper-' + $(this).closest('.arrow-closest').find('.swiper-container').attr('id')].swipePrev();
  });
  $('.swiper-arrow-right').on('click', function() {
    swipers['swiper-' + $(this).closest('.arrow-closest').find('.swiper-container').attr('id')].swipeNext();
  });

  /*============================*/
  /* 05 - WINDOW SCROLL */
  /*============================*/

  $(window).on('scroll', function() {

    if ($('.time-line').length) {
      $('.time-line').not('.animated').each(function() {
        if ($(window).scrollTop() >= $(this).offset().top - $(window).height() * 0.5) { $(this).addClass('animated').find('.timer').countTo(); }
      });
    }
    if ($('.start-line').length) {
      if ($(window).scrollTop() >= $('.start-line').offset().top - $('.start-line').height()) {
        $('.skill-line div').each(function() {
          var objel = $(this);
          var pb_width = objel.attr('data-width-pb');
          objel.css({ 'width': pb_width });
        });
      }
    }
  });

  /*============================*/
  /* 06 - IZOTOPE */
  /*============================*/

  function izotopInit() {
    if ($('.izotope-container').length) {
      var $container = $('.izotope-container');
      $container.isotope({
        itemSelector: '.item',
        layoutMode: 'masonry',
        masonry: {
          columnWidth: '.grid-sizer'
        }
      });
      $('.filter-mob-list').on('click', 'li', function() {
        $('.izotope-container').each(function() {
          $(this).find('.item').removeClass('animated');
        });
        $('.filter-mob-list li').removeClass('active');
        $(this).addClass('active');
        var filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });
      });
    }
  }

  $('.ajax-load-more').each(function() {
    var ajaxButton = $(this).find('.portfolio-load-more'),
      postWrapper = $(this).prev().find('.izotope-container'),
      postItem = $(this).prev().find('.item'),
      ajaxButtonOuter = $(this);

    $(ajaxButton).on('click', function(e) {

      e.preventDefault();

      // Variables
      var element = $(this),
        target = element.attr('href'),
        loadingTextOrg = element.html(),
        loadingText = element.data('loading-text'),
        $ajaxButton = $(ajaxButton),
        $postWrapper = $(postWrapper);

      // Loading Text
      if (loadingText == 'spinner') element.addClass('spinner');
      else element.html(loadingText);

      // Run AJAX
      $.ajax({
        type: 'GET',
        url: target,
        success: function(data, textStatus, XMLHttpRequest) {

          // Store New Data
          var newPostItems = $(data).find('.izotope-container' + ' ' + '.item'),
            nextPageUrl = $(data).find(ajaxButton).attr('href');

          newPostItems.imagesLoaded(function() {
            $postWrapper.append(newPostItems).isotope('appended', newPostItems);
            $postWrapper.isotope('layout');

          });

          // Trigger Resize To Fix Responsive Issues
          $(window).trigger('resize');

        },
        complete: function() {
          element.removeClass('spinner');
          console.log(this);
          ajaxButtonOuter.addClass('pagination-executed');
        },
        error: function(MLHttpRequest, textStatus, errorThrown) {
          alert(errorThrown);
        }
      });

    });

  });

  /*============================*/
  /* 07 - CLICK */
  /*============================*/

  if ($(window).width() <= 992) {
    $(document).on('mouseenter', '.nav-list li', function() {
      $(this).removeClass('active');
      $(this).addClass('active');
      $(this).find('.drop-menu').slideDown(300);
    });

    $('.nav-list li').on('mouseleave', function() {
      $(this).removeClass('active');
      $(this).stop(true, true).find('> .drop-menu').slideUp(500);
    });

    $(document).on('mouseenter', '.nav-list > li > ul > li', function() {
      $(this).addClass('active');
      $(this).find('> .drop-menu-next').slideDown(300);
    });

    $(document).on('mouseleave', '.nav-list > li > ul > li', function() {
      $(this).removeClass('active');
      $(this).find('> .drop-menu-next').slideUp(300);
    });
  } else {
    $(document).on('mouseenter', '.style-1 .drop-link', function() {
      $('.style-1 .nav-list li').removeClass('active');
      $(this).parent().addClass('active');
      $(this).parent().find('> .drop-menu').slideDown(300);
    });

    $('.style-1 .nav-list li').on('mouseleave', function() {
      $(this).removeClass('active');
      $(this).stop(true, true).find('> .drop-menu').slideUp(500);
    });

    $(document).on('mouseenter', '.style-1 .drop-link-next', function() {
      $(this).addClass('active');
      $(this).parent().find('.drop-menu-next').slideDown(300);
    });
  }

  /*============================*/
  /* 04 - MOBILE MENU */
  /*============================*/

  $(document).on('click', '.burger-menu', function() {
    $('.nav-menu').toggleClass('slide');
    $('body').toggleClass('fix');
    $(this).toggleClass('active');
    $('body').css('overflowY', 'auto'); 
    return false;
  });

  if ($(window).width() <= 992) {
    $(document).on('click', '.drop-filter', function() {
      $(this).parent().find('.filter-mob-list').slideToggle(300);
    });

    $(document).on('click', '.filter-mob-list li', function() {
      $(this).parent().slideUp(300);
      $('.drop-filter span').text($(this).text());
    });
  }

  /*============================*/
  /* 08 - VIDEO OPEN */
  /*============================*/

  $(function() {
    $(document).on('click', '.play-button', function() {
      var buttonVal = $('.play-button').index(this);
      var vid = $(this).closest('.video-item').find('.bgvid').eq(buttonVal);
      $('.video-item').addClass('act');
      vid.get(0).play();
      return false;
    });

    $('.close-video').on('click', function() {
      var closeVal = $('.close-video').index(this);
      var pauseVid = $(this).closest('.video-item').find('.bgvid').eq(closeVal);
      $('.video-item').removeClass('act');
      pauseVid.get(0).pause();
    });
  });

  /*============================*/
  /* 09 - WOW ANIMATION */
  /*============================*/

  if ($(window).width() > 1200) {
    var wow = new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      scrollContainer: null
    });
    wow.init();
  }

  $('.close-popup').on('click', function() {
    $('.success').removeClass('active');
  });

  function swipeBox() {
    if ($('.swipebox').length) {
      $('.swipebox').swipebox();
    }
  };


  $(function() {
    if ($('.section-scroll').length && !_ismobile) {
      $.scrollify({
        section: ".section-scroll",
        setHeights: false,
        offset: -100
      });
    }
  });

  if ($('.top-baner.video-bg .yt-player').length) {
    if (_ismobile) {
      $('.player-mb').YTPlayer();
    } else {
      $('.player').YTPlayer();
    }
  }

  if ($('.top-baner.video-bg .vm-player').length) {
    if (_ismobile) {
      $('.player-mb').vimeo_player();
    } else {
      $('.player').vimeo_player();
    }
  }

  if ($('.lazy').length) {
    $('img.lazy').lazyload();
  }

  var tabFinish = 0;
  $('.tt-nav-tab-item').on('click', function() {
    var $t = $(this);
    if (tabFinish || $t.hasClass('active')) return false;
    tabFinish = 1;
    $t.closest('.tt-nav-tab').find('.tt-nav-tab-item').removeClass('active');
    $t.addClass('active');
    var index = $t.parent().parent().find('.tt-nav-tab-item').index(this);
    $t.parents('.tt-tab-nav-wrapper').find('.tt-tab-select select option:eq(' + index + ')').prop('selected', true);
    $t.closest('.tt-tab-wrapper').find('.tt-tab-info:visible').fadeOut(500, function() {
      var $tabActive = $t.closest('.tt-tab-wrapper').find('.tt-tab-info').eq(index);
      $tabActive.css('display', 'block').css('opacity', '0');
      // tabReinit($tabActive.parents('.tt-tab-wrapper'));
      $tabActive.animate({ opacity: 1 });
      tabFinish = 0;
    });
  });

});

/*============================*/
/* 10 - PUSH SCROLL */
/*============================*/
jQuery("document").ready(function($){
    
  var hearderpush = $('.bloc-header-home-push');
  var windowWidth= $(window).width();
	if(windowWidth > 992){
    $(window).scroll(function () {
        if ($(this).scrollTop() == 0) {
          hearderpush.slideDown(100);
        } else {
          hearderpush.slideUp(100);
        }
    });
  }

});
