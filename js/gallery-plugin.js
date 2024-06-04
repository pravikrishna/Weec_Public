'use strict';
(function ( $ ) {
    var pluginDefault = function(){
        this.popupWrapperClass='gallery-popup-wrapper';
        this.popupContenWidth = '50%';
        this.iframeVideoWidth = '497px';

    };

    var pluginAction = function(){
        this.popupWrapperClass='gallery-popup-wrapper';
        this.currentPopup='';
        this.popupLength='';


    };

    pluginDefault.prototype={
        getImageType:function(types,handler){
            this.addController(handler);
            types.forEach(function(type){
                var images = handler.find("[data-type='" + type + "']");
                var imageHtml = this.filterGallery(images,type);
                handler.find('.image-holder').append(imageHtml);
            },this);
        },
        filterGallery:function(images,type){
            var imageWrapper = $("<div class='"+type+" image-wrapper' data-type='"+type+"'></div>");
            images.css("display","none").addClass("gallery-items");
            images.eq(0).css("display","block");
            imageWrapper.html(images);
            return imageWrapper;
        },
        addController:function(handler){
            handler.append($("<div class='image-holder'></div>"));
            var imagePort=$("<div class='image-view-port'><span class='gallery-go-back'><i class='ml-1 las la-angle-left'></i> Go Back</span></div>")
            imagePort.css('display','none');
            handler.append(imagePort);

            var popupPrev = $('<span><i class="las la-angle-left"></i></span>');
            var popupNext = $('<span><i class="las la-angle-right"></i></span>');
            popupPrev.addClass('gallery-popup-prev');
            popupNext.addClass('gallery-popup-next');
            var popupCloseWrapper = $('<span class="gallery-popup-close"><i class="las la-times"></i></span>');
            this.addPopupCloseCss(popupCloseWrapper);
            var popupContentWrapper = $('<div class="gallery-popup-content"></div>');
            this.addPopupContentCss(popupContentWrapper);
            popupContentWrapper.html(popupCloseWrapper);
            popupContentWrapper.append('<div class="content-holder"></div>');
            var popupWrapper = $("<div></div>");
            this.addPopupWrapperCss(popupWrapper);

            popupWrapper.addClass(this.popupWrapperClass).append(popupPrev).append(popupContentWrapper).append(popupNext);
            $('body').append(popupWrapper);
        },
        addPopupWrapperCss:function(popupWrapper){
            popupWrapper.css({
                'position': 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.88)',
                transition: 'opacity 500ms',
                display: 'none',
                opacity: 1,
            });
        },
        addPopupContentCss:function (popupContentWrapper) {
            var popupContentWidth = this.popupContenWidth;
            popupContentWrapper.css({
                'margin': 'auto',
                'position': 'relative',
                'top': '10%',
                'width': popupContentWidth
            });
        },
        addPopupCloseCss:function (popupCloseWrapper) {
            popupCloseWrapper.css({
                'color': '#ffffff',
                'font-size': '28px',
                'font-weight': 'bold',
                'position': 'absolute',
                'right': '-30px',
                'top': '-24px'

            });
        }
    };
    pluginAction.prototype={
        ShowItems:function(type,images){
            var imageHtml = images.clone();
            this.addGalleryContent(type);

            this.popupLength = imageHtml.length - 1;
            imageHtml.find("[data-type='" + type + "']").css('display','block');
            $('.image-holder').css('display','none');
            $('.image-view-port').append(imageHtml).css('display','block');
            this.popupLength = $('.image-view-port').find('.gallery-items').length - 1;
        },
        addGalleryContent:function(type){
            var galleryContent = $('.gallery-inner-description').find('.'+type).clone().addClass('gallery-description');
            $('.image-view-port').append(galleryContent);
        },
        goBack:function(){
            $('.image-holder').css('display','block');
            $('.image-view-port').find('.image-wrapper').remove();
            $('.image-view-port').find('.gallery-description').remove();
            $('.image-view-port').css('display','none');
        },
        setPopupContentWidth:function(popupItemWidth){
            var pluginSettings = new pluginDefault();
            pluginSettings.popupContenWidth = popupItemWidth;
            var popupContentWrapper = $('.gallery-popup-content');
            pluginSettings.addPopupContentCss(popupContentWrapper);
        },
        ShowPopup:function(popupItem){
            var popupType = popupItem.attr('data-popup');
            var innerHtml =$('.content-holder');
            this.currentPopup = $('.image-view-port').find('.gallery-items').index(popupItem);

            var popupWidth;
            if(popupType=='image'){
                var imageHtml = this.renderImagePopup(popupItem)
                popupWidth = 'fit-content';
                innerHtml.html(imageHtml)
            }else{
                var pluginSettings = new pluginDefault();
                popupWidth=pluginSettings.iframeVideoWidth;
                var videoHtml = this.renderVideoPopup(popupItem,popupWidth);

                innerHtml.html(videoHtml)
            }
            this.setPopupContentWidth(popupWidth);
            this.addPopupCaption(popupItem,innerHtml);
            var popupWrapper ='.'+this.popupWrapperClass;
            $(popupWrapper).css('display','block');
        },
        addPopupCaption:function(popupItem,innerHtml){
            innerHtml.append(popupItem.find('.category-description').clone().addClass('gallery-popup-figcaption'));
        },
        renderImagePopup:function (image) {
            return image.find('img').clone();
        },
        renderVideoPopup:function (video,popupWidth) {
            var pluginSettings = new pluginDefault();
            var iframeSrc= video.attr('data-src').toString();
            iframeSrc = iframeSrc.replace("/watch?v=", "/embed/");
            var iframeWidth = popupWidth;
            var videoHtml = $('<iframe class="gallery-video-popup" frameborder="0" allow="autoplay; encrypted-media" width="'+pluginSettings.iframeVideoWidth+'" height="'+'497px'+'" allowfullscreen></iframe>');
            videoHtml.attr('src',iframeSrc);
            return videoHtml;
        },
        popupClose:function () {
            var popupWrapper ='.'+this.popupWrapperClass;
            $(popupWrapper).css('display','none');
            $('.gallery-video-popup').attr('src','');
        },
        getPrevPopupItem:function(){
            var popupItem = this.currentPopup;
            if(popupItem > 0){
                popupItem = popupItem-1;
                this.ShowPopup($('.image-view-port').find('.gallery-items').eq(popupItem));
            }
        },
        getNextPopupItem:function(){
            var popupItem = this.currentPopup;
            console.log(this.popupLength);
            console.log(popupItem);
            if(this.popupLength > popupItem){
                popupItem +=1;
                this.ShowPopup($('.image-view-port').find('.gallery-items').eq(popupItem));
            }
        }
    };


    if (typeof Object.assign != 'function') {
        Object.assign = function(target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }

    pluginDefault.prototype = Object.assign({},pluginDefault.prototype,pluginAction.prototype);


    $.fn.gallery = function( options ) {
        var settings = $.extend({
            // These are the defaults.
            types: []
        }, options );
        var plugin = new pluginDefault();
        var pluginObject = $(this);
        pluginObject.find('.gallery-inner-description').hide();
        plugin.getImageType(settings.types,pluginObject);
        $('.image-wrapper').click(function(){
            plugin.ShowItems($(this).data('type'),$(this));
        });
        $('.gallery-go-back').click(function(){
            plugin.goBack();
        });
        $('.image-view-port').on('click','.gallery-items',function(){
            plugin.ShowPopup($(this));
        });
        $('.video-popup').on('click', '.gallery-items', function () {
            plugin.ShowPopup($(this));
        });
        $('.gallery-popup-wrapper').on('click','.gallery-popup-close',function () {
            plugin.popupClose($(this));
        });
        $('.gallery-popup-content .content-holder').click(function (e) {
            e.stopPropagation();
        });
        $('.gallery-popup-wrapper').click(function () {
            plugin.popupClose($(this));
        });

        $('.gallery-popup-wrapper').on('click','.gallery-popup-prev',function(e){
            e.stopPropagation();
            plugin.getPrevPopupItem();
        });

        $('.gallery-popup-wrapper').on('click','.gallery-popup-next',function(e){
            e.stopPropagation();
            plugin.getNextPopupItem();
        });

    };

}( jQuery ));


