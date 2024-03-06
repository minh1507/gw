import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PathDto } from 'src/common/base/param.base';
import { ApiTags } from '@nestjs/swagger';
import { TagEnum } from 'src/common/enum/tag.enum';
import { Role } from './entities/role.entity';
import { ResponseShape } from 'src/common/shape/response.shape';

@Controller('role')
@ApiTags(TagEnum.ROLE)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseShape<Role>> {
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<ResponseShape<Role>> {
    return await this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param() path: PathDto): Promise<ResponseShape<Role>> {
    return await this.roleService.findOne(path);
  }

  @Patch(':id')
  async update(
    @Param() path: PathDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseShape<Role>> {
    return await this.roleService.update(path, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param() path: PathDto): Promise<ResponseShape<Role>> {
    return await this.roleService.remove(path);
  }
}
