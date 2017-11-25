console.log("Successfully connected");

$(function(){
    
      /* Instantiating iziModal */
      $("#modal-custom").iziModal({
          overlayClose: false,
          overlayColor: 'rgba(0, 0, 0, 0.6)'
      });
    
      /*$(document).on('click', '.trigger-custom', function (event) {
          event.preventDefault();
          $('#modal-custom').iziModal('open');
      });*/
    
      /* JS inside the modal */
    
      $("#modal-custom").on('click', 'header a', function(event) {
          event.preventDefault();
          var index = $(this).index();
          $(this).addClass('active').siblings('a').removeClass('active');
          $(this).parents("div").find("section").eq(index).removeClass('hide').siblings('section').addClass('hide');
    
          if( $(this).index() === 0 ){
              $("#modal-custom .iziModal-content .icon-close").css('background', '#ddd');
          } else {
              $("#modal-custom .iziModal-content .icon-close").attr('style', '');
          }
      });
    //   
      $("#modal-custom").on('click', '#loginButton', function(event) {
          event.preventDefault();
        console.log("login button clicked");



        //   var fx = "wobble",  //wobble shake
        //       $modal = $(this).closest('.iziModal');
    
        //   if( !$modal.hasClass(fx) ){
        //       $modal.addClass(fx);
        //       setTimeout(function(){
        //           $modal.removeClass(fx);
        //       }, 1500);
        //   }
      }); 
      $("#modal-custom").on('click', '#createAccountButton', function(event) {
          event.preventDefault();
          console.log("create account button clicked");
    
        //   var fx = "wobble",  //wobble shake
        //       $modal = $(this).closest('.iziModal');
    
        //   if( !$modal.hasClass(fx) ){
        //       $modal.addClass(fx);
        //       setTimeout(function(){
        //           $modal.removeClass(fx);
        //       }, 1500);
        //   }
      }); 
      
    })