//socket io setup
var socket=io({transports: ['websocket']});
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
     
      // setup autocomplete function pulling from currencies[] array
      $('#searchBar').autocomplete({
        lookup: states,
        onSelect: function (suggestion) {
            console.log(suggestion.value);
        }
      });

    });
    //testing successful connection of socket.io
    socket.on('testConnection',function(returnedData){
        console.log(returnedData.data);
    })
    //validate socket-io connection
