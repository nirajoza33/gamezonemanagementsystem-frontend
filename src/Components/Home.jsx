// import React from 'react';
// import '../css/Home.css';
// import { Carousel } from 'react-bootstrap';
// import Navbar from '../Components/Navbar';
// import AttractionsSection from './AttractionsSection';
// import Footer from './Footer';
// import Chatbot from './ChatBot';

// const HomePage = () => {
//   return (
//     <>
//       <Navbar/>
//       <div className="homepage">
//         <Carousel fade interval={5000}>
//           <Carousel.Item>
//             <img
//               className="d-block w-100"
//               src="/assets/gaming-illustration.jpg"
//               alt="First slide"
//             />
//             <Carousel.Caption>
//               <div className="carousel-caption-text">
//                 <h1>Welcome to <span className="highlight">GameZone Club</span></h1>
//                 <p>Play. Compete. Win. Join the ultimate gaming experience today!</p>
//                 <a href="/registration" className="btn btn-warning btn-lg mt-3">Get Started</a>
//               </div>
//             </Carousel.Caption>
//           </Carousel.Item>
//           <Carousel.Item>
//             <img
//               className="d-block w-100"
//               src="/assets/gaming-illustration2.jpg"
//               alt="Second slide"
//             />
//             <Carousel.Caption>
//               <div className="carousel-caption-text">
//                 <h1>Join the Battle</h1>
//                 <p>Challenge other players in exciting gaming tournaments!</p>
//                 <a href="/signup" className="btn btn-warning btn-lg mt-3">Get Started</a>
//               </div>
//             </Carousel.Caption>
//           </Carousel.Item>
//           <Carousel.Item>
//             <img
//               className="d-block w-100"
//               src="/assets/gaming-illustration3.jpg"
//               alt="Third slide"
//             />
//             <Carousel.Caption>
//               <div className="carousel-caption-text">
//                 <h1>Become a Legend</h1>
//                 <p>Achieve greatness and unlock exclusive rewards!</p>
//                 <a href="/signup" className="btn btn-warning btn-lg mt-3">Get Started</a>
//               </div>
//             </Carousel.Caption>
//           </Carousel.Item>
//         </Carousel>
//       </div>
//       <AttractionsSection/>
//       <Footer/>
//     </>
//   );
// };  

// export default HomePage;


import React from 'react';
import '../css/Home.css';
import { Carousel } from 'react-bootstrap';
import Navbar from '../Components/Navbar';
import AttractionsSection from './AttractionsSection';
import Footer from './Footer';
import Chatbot from './ChatBot';

const HomePage = () => {
  return (
    <>
      <Navbar/>
      <div className="homepage">
        <Carousel fade interval={5000}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/gaming-illustration.jpg"
              alt="First slide"
            />
            <Carousel.Caption>
              <div className="carousel-caption-text">
                <h1>Welcome to <span className="highlight">GameZone Club</span></h1>
                <p>Play. Compete. Win. Join the ultimate gaming experience today!</p>
                <a href="/registration" className="btn btn-warning btn-lg mt-3">Get Started</a>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/gaming-illustration2.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <div className="carousel-caption-text">
                <h1>Join the Battle</h1>
                <p>Challenge other players in exciting gaming tournaments!</p>
                <a href="/signup" className="btn btn-warning btn-lg mt-3">Get Started</a>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/gaming-illustration3.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <div className="carousel-caption-text">
                <h1>Become a Legend</h1>
                <p>Achieve greatness and unlock exclusive rewards!</p>
                <a href="/signup" className="btn btn-warning btn-lg mt-3">Get Started</a>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <AttractionsSection/>
      <Chatbot/> {/* Positioned before Footer to ensure proper stacking */}
      <Footer/>
    </>
  );
};  

export default HomePage;
