import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import axios from 'axios';
import apiHOST from '../../config/host';

const Dynamic = (props) => {
  const {
    html, isSSP, name, click_tracking_api
  } = props;
  const [htmlText, setHtml] = useState('<div id="banner-block"/>');

  const markup = val => ({ __html: val });

  useEffect(() => {
    const handleClick = () => {
      axios.post(`${apiHOST}/api/manplus/click`, { name, isSSP });
      if (isSSP) {
        if (click_tracking_api !== null || click_tracking_api !== '' || click_tracking_api !== undefined) {
          if (click_tracking_api.length !== 0) {
            axios.get(click_tracking_api);
          } else {
            console.log('SSP-API-URL IS EMPTY');
          }
        } else {
          console.log('SSP-API-URL ERROR');
        }
      }
    };
    if (html !== null) {
      if (isSSP) {
        $('#banner-block').append(html);
        $('#banner-block iframe').on('load', function () {
          $(this).contents().find('body').on('click', () => {
            handleClick();
          });
        });
      } else {
        const newhtml = html.replace(/<(\/meta|meta)([^>]*)>/gi, '');
        setHtml(newhtml);
      }
    }
  }, [click_tracking_api, html, isSSP, name]);

  return <div dangerouslySetInnerHTML={markup(htmlText)} style={{ width: '95%', height: 'auto' }} id="dynamic-block" />;
};

export default Dynamic;
