import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, MaxLength } from "class-validator";

export class RegisterCustomerDto {
    @IsString()
    @IsNotEmpty({ message: "Name is required" })
    name: string;

    @IsString()
    @IsNotEmpty({ message: "Email is required" })
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(11, { message: 'Phone number must be 11 digits' })
    @MaxLength(11, { message: 'Phone number must be 11 digits' })
    @IsNotEmpty({ message: "Phone is required" })
    @Matches(/^01\d{9}$/)
    phone: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;

}