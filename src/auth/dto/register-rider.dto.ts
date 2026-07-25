import { RegisterCustomerDto } from "./register-customer.dto";
import { IsString, IsNotEmpty, MaxLength, MinLength, Matches } from "class-validator";

export class RegisterRiderDto extends RegisterCustomerDto {

    @IsString()
    @IsNotEmpty({ message: 'NID number is required' })
    @Matches(/^\d{10}$/, {
        message: 'NID must be exactly 10 digits long',
    })
    nidNumber: string;
}