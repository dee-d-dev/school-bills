import {IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator'
import { Transform } from 'class-transformer';
export class CreateBillDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    title: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    account_no: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    bank_name: string;

    @IsOptional()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    faculty?: string;

    @IsOptional()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    department?: string;

    // data: {
    //     faculty?: string;
    //     department?: string;
    // }
    // @IsNotEmpty()
    // @IsNumber()
    // admin_id: number

}

export class EditBillDto {
    @IsOptional()
    @IsString()
    @Transform(({value}) => value.toLowerCase())

    title: string;

    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    account_no: string;

    @IsOptional()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    bank_name: string;

    @IsOptional()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    faculty: string;

    @IsOptional()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    department?: string;

    // data: {
    //     faculty?: string;
    //     department?: string;
    // }
    // @IsNotEmpty()
    // @IsNumber()
    // admin_id: number

}
