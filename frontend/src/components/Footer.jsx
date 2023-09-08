// import React from 'react';

// function Footer() {
//   return (
//     <footer>
//       <div className="maxC">
//         <div className="credits flex section" id="credit-widget">
//           <div className="widget HTML" data-version="2" id="HTML88">
//             <div className="credit fontM ellips">
//               <span className="cd">
//                 <div id="copyright" align="center">Copyright © 2023. By Techreview</div>
//               </span>
//             </div>
//           </div>
//           <div className="widget TextList" data-version="2" id="TextList88">
//             <div className="bT flex fontS noWrap opacity i14 noJava" data-text="Top" onClick={() => window.scrollTo({ top: 0 })}>
//               <svg className="line r" width={"20"} viewBox="0 0 24 24">
//                 <path  d="M19.9201 15.0499L13.4001 8.52989C12.6301 7.75989 11.3701 7.75989 10.6001 8.52989L4.08008 15.0499"></path>
//               </svg>
//             </div>
//             <noscript>
//               <a aria-label='Top' className='bT flex fontS noWrap opacity i14' data-text='Top' href='#nB'>
//                 {/* <svg className='line r' width={20} viewBox='0 0 24 24'>
//                   <path d='M19.9201 15.0499L13.4001 8.52989C12.6301 7.75989 11.3701 7.75989 10.6001 8.52989L4.08008 15.0499'></path>
//                 </svg> */}
//               </a>
//             </noscript>
//           </div>
//           <div className="widget LinkList" data-version="2" id="LinkList88">
//             <div className="socials flex">
//               <a aria-label="Facebook" className="ic op i20" href="https://www.facebook.com/Harsha9680/" rel="noopener" role="button" target="_blank">
//                 <svg viewBox="0 0 32 32" width={20}>
//                   <path
//                     d="M24,3H8A5,5,0,0,0,3,8V24a5,5,0,0,0,5,5H24a5,5,0,0,0,5-5V8A5,5,0,0,0,24,3Zm3,21a3,3,0,0,1-3,3H10a3,3,0,0,1-3-3V10a3,3,0,0,1,3-3H22a3,3,0,0,1,3,3Z"
//                   ></path>
//                 </svg>
//               </a>
//               {/* Add other social media icons and links here */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <span className="footer-text">Copyright © 2023. All rights are reserved</span>
            </div>
            <div className="topsvg" data-text="Top" onClick={() => window.scrollTo({ top: 0 })}>
                <svg className="line r" width={"21"} height={"21"} viewBox="0 0 24 24">
                    <path d="M19.9201 15.0499L13.4001 8.52989C12.6301 7.75989 11.3701 7.75989 10.6001 8.52989L4.08008 15.0499"></path>
                </svg>
            </div>
        </div>
    );
};

export default Footer;