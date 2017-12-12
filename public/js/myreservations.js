var socket=io({transports: ['websocket']});
console.log("connected");
socket.on('reservationAdded',function(data){
    console.log('reservation route hit')
    swal(
        'Success!',
        'Your reservation is confirmed',
        'success'
      )
})
socket.on('userHasNoReservations',function(data){
    console.log("user has no reservations");
})
var typed = new Typed('#searchBar', {
    strings: [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
        ],
    smartBackspace: true,
    loop: true,
    fadeOut: true,
    typeSpeed: 50,
    backSpeed:0
  });


$(function(){
    var states = [
        {value: 'All hotels'},
        { value: 'Alabama'},
        { value: 'Alaska'},
        { value: 'Arizona'},
        { value: 'Arkansas'},
        { value: 'California'},
        { value: 'Colorado'},
        { value: 'Connecticut'},
        { value: 'Delaware'},
        { value: 'Florida'},
        { value: 'Georgia'},
        { value: 'Hawaii'},
        { value: 'Idaho'},
        { value: 'Illinois'},
        { value: 'Indiana'},
        { value: 'Iowa'},
        { value: 'Kansas'},
        { value: 'Kentucky'},
        { value: 'Louisiana'},
        { value: 'Maine'},
        { value: 'Maryland'},
        { value: 'Massachusetts'},
        { value: 'Michigan'},
        { value: 'Minnesota'},
        { value: 'Mississippi'},
        { value: 'Missouri'},
        { value: 'Montana'},
        { value: 'Nebraska'},
        { value: 'Nevada'},
        { value: 'New Hampshire'},
        { value: 'New Jersey'},
        { value: 'New Mexico'},
        { value: 'New York'},
        { value: 'North Carolina'},
        { value: 'North Dakota'},
        { value: 'Ohio'},
        { value: 'Oklahoma'},
        { value: 'Oregon'},
        { value: 'Pennsylvania'},
        { value: 'Rhode Island'},
        { value: 'South Carolina'},
        { value: 'South Dakota'},
        { value: 'Tennessee'},
        { value: 'Texas'},
        { value: 'Utah'},
        { value: 'Vermont'},
        { value: 'Virginia'},
        { value: 'Washington'},
        { value: 'West Virginia'},
        { value: 'Wisconsin'},
        { value: 'Wyoming'}
    ];  
    $('#searchBar:text').on('click',function(event){
        typed.stop();
        $(this).val('');
    })   
     
      // setup autocomplete function pulling from currencies[] array
      $('#searchBar').autocomplete({
        lookup: states,
        onSelect: function (suggestion) {
            console.log(suggestion.value);
        }
      });

    });