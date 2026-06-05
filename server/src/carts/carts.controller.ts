import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/createCart.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Cart } from './cart.entity';

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

  // @ApiBearerAuth() // this annotation make swagger know that this api need token
  // @UseGuards(AuthGuard('jwt')) // Protect this route with jwt
  @Post('/add-to-cart/') // req: any take any kind of request
  addToCart(
    @Query('userId') userId: string,
    @Body() createCartDto: CreateCartDto,
  ) {
    /**
     * Req user generated after AuthGuard decode access_token successs
     * JWT using userid as jwt payload's subject
     */
    // const userId = req.user.sub;
    return this.cartsService.addToCart(Number(userId), createCartDto);
  }

  @Get()
  findAllCarts() {
    return this.cartsService.findAll();
  }

  @Get('/user-cart/:id')
  findUserCart(@Param('id') id: string) {
    return this.cartsService.findUserCart(Number(id));
  }

  @Patch('/increase-quantity/:id')
  increaseQuantity(@Param('id') id: string) {
    return this.cartsService.increaseQuantity(Number(id));
  }

  @Patch('/decrease-quantity/:id')
  decreaseQuantity(@Param('id') id: string) {
    return this.cartsService.decreaseQuantity(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.removeById(Number(id));
  }
}
