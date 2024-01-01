import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from: string; // Maybe we need something that will check if the correct "from" user sent the money

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
