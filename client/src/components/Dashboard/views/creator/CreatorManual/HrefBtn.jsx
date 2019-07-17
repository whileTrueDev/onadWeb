import React from 'react'

// export default class HrefBtn extends React.Component () {
//   handleClick = (e) => {
//     e.preventDefault();
//     console.log('The link was clicked.');
//   };

//   render() {
//     return (
//       <a href="#" onClick={handleClick.bind(this)}>
//         Click me
//       </a>
//     );
//   }
// }

// const HrefBtn = (props) => {
//   const handleClick = (e) => {
//     e.preventDefault();
//     console.log('The link was clicked.');
//   };
//   return(
//   <a href="#" onClick={handleClick}>
//   Click me
// </a>)
// }
class HrefBtn extends React.Component { 
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
 
  }
  render() {
    return (
      <a href="#" onClick={this.handleClick}>Test link</a>
    );
  }
}

export default HrefBtn;