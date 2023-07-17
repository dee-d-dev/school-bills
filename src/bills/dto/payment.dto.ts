import {IsNotEmpty, IsNumber, IsString} from "class-validator"
export class paymentDTO {
    @IsNotEmpty()
    @IsString()
    billId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    matric_no: string;
}