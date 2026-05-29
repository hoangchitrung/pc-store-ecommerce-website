import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/createCart.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

// define data type of payload after decode jwt
interface RequestWithUser extends User {
  user: {
    sub: number;
    email: string;
  };
}

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiBearerAuth() // this annotation make swagger know that this api need token
  @UseGuards(AuthGuard('jwt')) // Protect this route with jwt
  @Post('/cart/') // req: any take any kind of request
  addToCart(@Req() req: RequestWithUser, @Body() createCartDto: CreateCartDto) {
    /**
     * Req user generated after AuthGuard decode access_token successs
     * JWT using userid as jwt payload's subject
     */
    const userId = req.user.sub;
    return this.cartsService.addToCart(userId, createCartDto);
  }
}
