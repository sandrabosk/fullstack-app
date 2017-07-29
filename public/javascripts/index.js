// $(document).ready(function() {
//
// addLocations();
// });
//
//
//
//
// //Google map things:
//
// //this part works
//     var sol = {
//             lat: 25.761681,
//             lng: -80.191788
//     };
//
//   var geocoder;
//   var map;
//
//
//   function initMap() {
//     geocoder = new google.maps.Geocoder();
//     var mapOptions = {
//       zoom: 8,
//       center: sol,
//   };
//     map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 13,
//           center: sol
//       });
// }
//
// // up to here works
//
//
// function addLocations() {
//   console.log('markerssss');
//     let markers = [];
//     mylocations.forEach(function(location){
//         var address = location.address;
//         geocoder.geocode( { 'address': address}, function(results, status) {
//     if (status == 'OK') {
//             map.setCenter(results[0].geometry.location);
//
//             let title = location.name;
//             let position = results[0].geometry.location;
//
//           var marker = new google.maps.Marker({ position, map, title  });
//           markers.push(marker);
//
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
//
//   });
// }
//
// initMap();
