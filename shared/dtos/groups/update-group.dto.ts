import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newUserId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  enteringAmount?: number;
}

export class AddMoneyToGroupDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
