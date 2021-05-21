import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('logout')
export class LogoutController {
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response): void {
    req.logout();
    if (req.session) {
      req.session.destroy(err => {
        console.log('logout error - ', err);
      });
    }
    res.end();
  }
}
