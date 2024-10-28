import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { User } from "../../decorators/user.decorator";
import { EmailService } from "../email/email.service";
import { UserDto } from "../user/dtos/User.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dtos/ForgotPassword.dto";
import { LoginDto } from "./dtos/Login.dto";
import { ResetPasswordDto } from "./dtos/ResetPassword.dto";
import { UserRegistrationDto } from "./dtos/UserRegistration.dto";
import { VerifyCodeDto } from "./dtos/VerifyCode.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The user has been successfully registered.",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Email already in use.",
  })
  async register(@Body() body: UserRegistrationDto) {
    await this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post("send-code")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Send confirmation code to user's email" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Confirmation code sent successfully.",
  })
  async sendCode(@User() user: UserDto) {
    const code = await this.authService.createEmailConfirmationCode(user);
    await this.emailService.sendEmailConfirmationCode(code, user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post("verify-code")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Verify user email" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Email verified successfully.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid or expired confirmation code.",
  })
  async verifyCode(@User() user: UserDto, @Body() body: VerifyCodeDto) {
    await this.authService.confirmEmail(user, body.code);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Login successful, cookies set.",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials.",
  })
  async login(@User() user: UserDto, @Res({ passthrough: true }) response: Response) {
    const sessionUuid = await this.authService.createSession(user);
    await this.authService.setResponseCookies(response, user.uuid, sessionUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Logout successful, cookies cleared.",
  })
  async logout(@User() user: UserDto, @Res({ passthrough: true }) response: Response) {
    this.authService.clearCookies(response);
    await this.authService.deleteSessions(user.uuid);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password reset code sent successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Email not found.",
  })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const code = await this.authService.createPasswordResetCode(body.email);
    await this.emailService.sendPasswordRestoreCode(code, body.email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Reset user password" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Password reset successfully.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid or expired password reset code.",
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body.password, body.code);
  }
}
