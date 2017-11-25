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
    //  login button clicked 
      $("#modal-custom").on('click', '#loginButton', function(event) {
          event.preventDefault();
        console.log("login button clicked");
        var loginName = document.getElementById('loginUsername');
        console.log(loginName.value); 
        var loginPswd = document.getElementById('loginPassword'); 
        if(loginName.value.length===0||loginPswd.value.length===0){
            var fx = "wobble",  //wobble shake
            $modal = $(this).closest('.iziModal');
            if( !$modal.hasClass(fx) ){
                $modal.addClass(fx);
                setTimeout(function(){
                    $modal.removeClass(fx);
                }, 1500);
            }
        }else{
            //todo: check if the user's information is stored in the db
            //if it is redirect to their profile page
            //if not then alert them that they need to register as a new user
            console.log("the login fields werent empty!");
        }
      }); 
      //create user button clicked
      $("#modal-custom").on('click', '#createAccountButton', function(event) {
          event.preventDefault();
          console.log("create account button clicked");
            //grab the contents of the input
            var accName = document.getElementById('createAccountUsername');
            var accPswd = document.getElementById('createAccountPassword');
            var accEmail = document.getElementById('createAccountEmail');
            if(accName.value.length===0||accPswd.value.length===0||accEmail.value.length===0){
                var fx = "wobble",  //wobble shake
                $modal = $(this).closest('.iziModal');
                if( !$modal.hasClass(fx) ){
                    $modal.addClass(fx);
                    setTimeout(function(){
                        $modal.removeClass(fx);
                    }, 1500);
                }
            }else{
                //todo: check if the user is already registered
                //if they are then alert them
                //if not then continue with creating and storing their info in the database
                //redirect them to their new profile page
                console.log("the fields were not empty!");
            }
      }); 
      
    })