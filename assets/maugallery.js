(function($) {
  $.fn.mauGallery = function(options) {
    options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId, options.navigation);
      }
      $.fn.mauGallery.listeners(options);
      $(this).children(".gallery-item").each(function(index) {
        $.fn.mauGallery.methods.responsiveImageItem($(this));
        $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
        $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
        var theTag = $(this).data("gallery-tag");
        if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
          tagsCollection.push(theTag);
        }
      });
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection);
      }
      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 4,
    lightBox: true,
    lightboxId: "galleryLightbox",
    showTags: true,
    tagsPosition: "top",
    navigation: true
  };

  $.fn.mauGallery.listeners = function(options) {
    if (options.lightBox) {
      $(".gallery-item").css("cursor", "pointer").on("click", function() {
        if ($(this).prop("tagName") === "IMG") {
          $(".selected").removeClass("selected");
          $(this).addClass("selected");
          var theSrc = $(this).attr("src");
          $("#galleryLightbox").addClass("open").find(".lightboxImage").attr("src", theSrc);
        }
      });
      $(".lightboxNav").on("click", function() {
        var images = $(".gallery-item");
        var index = $.fn.mauGallery.methods.getCurrentItemIndex(images);
        if ($(this).hasClass("lbPrev")) {
          index = index === 0 ? images.length - 1 : index - 1;
        } else {
          index = index + 1 === images.length ? 0 : index + 1;
        }
        images.eq(index).click();
      });
      $("#galleryLightbox").on("click", function(e) {
        if ($(e.target).hasClass("lightboxImage")) return;
        if ($(e.target).hasClass("lightboxNav")) return;
        $.fn.mauGallery.methods.closeLightBox();
      });
    }
    $(".gallery-tag").on("click", function() {
      $(".gallery-tag").removeClass("active");
      $(this).addClass("active");
      var theTag = $(this).data("gallery-tag");
      $(".gallery-item").parent().hide().filter(function() {
        if (theTag === "all") {
          return true;
        }
        return $(this).children(".gallery-item").data("gallery-tag") === theTag;
      }).fadeIn(400);
    });
  };

  $.fn.mauGallery.methods = {
    getCurrentItemIndex: function(items) {
      return items.index($(".gallery-item.selected"));
    },
    createLightBox: function(gallery, lightboxId, navigation) {
      $("body").append("<div id='" + lightboxId + "' class='gallery-lightbox'><div class='lightbox-container'><span class='lightboxNav lbPrev'><</span><img class='lightboxImage'><span class='lightboxNav lbNext'>></span></div></div>");
      if (!navigation) {
        $(".lightboxNav").hide();
      }
    },
    closeLightBox: function() {
      $(".gallery-lightbox").removeClass("open");
    },
    showItemTags: function(gallery, pos, collection) {
      var tagsDiv = "<div class='gallery-tags'><span class='gallery-tag active' data-gallery-tag='all'>Tous</span>";
      $.each(collection, function(index, value) {
        tagsDiv += "<span class='gallery-tag' data-gallery-tag='" + value + "'>" + value + "</span>";
      });
      tagsDiv += "</div>";
      if (pos === "bottom") {
        $(tagsDiv).insertAfter(gallery);
      } else {
        $(tagsDiv).insertBefore(gallery);
      }
    },
    createRowWrapper: function(gallery) {
      gallery.append("<div class='gallery-items-row'></div>");
    },
    moveItemInRowWrapper: function(item) {
      item.appendTo(".gallery-items-row");
    },
    responsiveImageItem: function(item) {
      item.addClass("img-fluid");
    },
    wrapItemInColumn: function(item, columns) {
      item.wrap("<div class='gallery-column col-md-" + Math.ceil(12 / columns) + "'></div>");
    }
  };
})(jQuery);
