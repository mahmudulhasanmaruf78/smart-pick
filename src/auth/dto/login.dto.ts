import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: "Enter email or phone number" })
    identity: string;


}
