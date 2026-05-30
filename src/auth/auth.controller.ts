import { Controller,Body,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UseGuards, Get,Request } from '@nestjs/common';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @ApiOperation({ summary: 'Register new user' })
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
       return req.user;
   }

   @ApiBearerAuth()
   @Roles('ADMIN')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get('users')
   getUsers() {
       return this.usersService.findAll();
   }

   @ApiBearerAuth()
   @Roles('ADMIN')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get('admin-only')
   adminOnly() {
     return { 
       message: 'Welcome Admin',
    };
}
}
