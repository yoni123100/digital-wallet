import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupDTO {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  firstUsers: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  initAmount?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
