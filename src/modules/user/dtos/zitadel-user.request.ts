import { ApiProperty } from "@nestjs/swagger";

export class ZitadelUser {
  @ApiProperty({
    description: "Whether this Zitadel user is currently active. If active is true, further information will be provided.",
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: "A whitespace-separated string containing the scopes of the access_token. These scopes might differ from the provided scope parameter.",
    example: "openid profile email",
  })
  scope: string;

  @ApiProperty({
    description: "The client ID of the Zitadel application in the form of <APPLICATION-ID>@p<PROJECT-NAME>.",
    example: "myapp@pmyproject",
  })
  client_id: string;

  @ApiProperty({
    description: 'Type of the access_token. The value is always "Bearer".',
    example: "Bearer",
  })
  token_type: string;

  @ApiProperty({
    description: "The expiration time of the token as a Unix timestamp.",
    example: 1672531199,
  })
  exp: unknown;

  @ApiProperty({
    description: "The time when the token was issued as a Unix timestamp.",
    example: "1672531199",
  })
  iat: string;

  @ApiProperty({
    description: "The time before which the token must not be used as a Unix timestamp.",
    example: "1672531199",
  })
  nbf: string;

  @ApiProperty({
    description: "The subject identifier of the user.",
    example: "1234567890",
  })
  sub: string;

  @ApiProperty({
    description: "The audience of the token, which can be a string or an array of strings.",
    example: ["client1", "client2"],
  })
  aud: string | string[];

  @ApiProperty({
    description: "The issuer of the token.",
    example: "https://issuer.zitadel.com",
  })
  iss: string;

  @ApiProperty({
    description: "The unique identifier of the token.",
    example: "jwt-token-id-123",
  })
  jti: string;

  @ApiProperty({
    description: "The ZITADEL login name of the user, consisting of username@primarydomain.",
    example: "username@zitadel.com",
  })
  username: string;

  @ApiProperty({
    description: "The full name of the user.",
    example: "John Doe",
  })
  name: string;

  @ApiProperty({
    description: "The given name or first name of the user.",
    example: "John",
  })
  given_name: string;

  @ApiProperty({
    description: "The family name or last name of the user.",
    example: "Doe",
  })
  family_name: string;

  @ApiProperty({
    description: "The user's preferred locale.",
    example: "en-US",
  })
  locale: string;

  @ApiProperty({
    description: "The time when the user's information was last updated as a Unix timestamp.",
    example: "1672531199",
  })
  updated_at: string;

  @ApiProperty({
    description: "The preferred username of the user.",
    example: "johndoe",
  })
  preferred_username: string;

  @ApiProperty({
    description: "The user's email address.",
    example: "johndoe@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Indicates whether the user's email has been verified.",
    example: true,
  })
  email_verified: boolean;
}
