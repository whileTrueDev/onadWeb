import { Popper } from '@material-ui/core';
import React from 'react';

export interface UrlInfoPopperProps {
  open: boolean;
  anchorEl: any;
}
export default function UrlInfoPopper({
  open,
  anchorEl
}: UrlInfoPopperProps): JSX.Element {
  return (
    <Popper open={open} anchorEl={anchorEl}>
      url info popper
    </Popper>
  );
}
