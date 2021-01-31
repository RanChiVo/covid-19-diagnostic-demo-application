import React from 'react';
import logo from  '../../image/logo.png'; // Tell webpack this JS file uses this image

console.log(logo); // /logo.84287d09.png

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" width="115px" height="100px"/>;
}
export default Header;