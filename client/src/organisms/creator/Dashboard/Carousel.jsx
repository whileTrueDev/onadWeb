import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setDirection(e.direction);
  };

  return (
    <Carousel activeIndex={index} direction={direction} onSelect={handleSelect}>
      <Carousel.Item>
        <Grid container direction="row" justify="center">
          <Grid item xs={6}>
            <img
              className="d-block w-100"
              src="/pngs/logo/onad_logo_vertical_black.png"
              alt="First slide"
              height="300hv"
            />
          </Grid>
        </Grid>
        {/* <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item>
        <Grid container direction="row" justify="center">
          <Grid item xs={6}>
            <img
              className="d-block w-100"
              src="/pngs/logo/onad_logo_vertical_black.png"
              alt="First slide"
              height="300hv"
            />
          </Grid>
        </Grid>
        {/* <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption> */}
      </Carousel.Item>
    </Carousel>
  );
}
export default ControlledCarousel;
