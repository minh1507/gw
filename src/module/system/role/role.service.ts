import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PathDto } from 'src/common/base/param.base';
import { BaseService } from 'src/common/base/service.base';
import { FieldEnum } from 'src/common/enum/field.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Not, Repository } from 'typeorm';
import { ActionEnum } from 'src/common/enum/action.enum';
import { ResponseShape } from 'src/common/shape/response.shape';
import { ContentEnum } from 'src/common/enum/content.enum';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
    this.name = RoleService.name;
    this.field = FieldEnum.ROLE;
  }

  async create(createRoleDto: CreateRoleDto): Promise<ResponseShape<Role>> {
    this.action = ActionEnum.CREATE;
    // validate
    const nameDublicate = await this.roleRepository.findOne({
      where: {
        name: createRoleDto.name,
      },
    });
    if (nameDublicate) this.reponseCustom(ContentEnum.EXIST, FieldEnum.NAME);

    const codeDublicate = await this.roleRepository.findOne({
      where: {
        code: createRoleDto.code,
      },
    });

    // save into db
    if (codeDublicate) this.reponseCustom(ContentEnum.EXIST, FieldEnum.CODE);
    const result = await this.roleRepository.save(createRoleDto);
    return this.response(result);
  }

  async findAll(): Promise<ResponseShape<Role>> {
    this.action = ActionEnum.VIEW;
    // return many record
    const result = await this.roleRepository.find();
    return this.response(result);
  }

  async findOne(path: PathDto): Promise<ResponseShape<Role>> {
    this.action = ActionEnum.VIEW;
    // check record exist
    const result = await this.roleRepository.findOne({
      where: path,
    });

    // return 1 record
    if (!result) this.reponseCustomWithToast(ContentEnum.NOT_FOUND);
    return this.response(result);
  }

  async update(
    path: PathDto,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseShape<Role>> {
    this.action = ActionEnum.UPDATE;
    // check record exist
    const exist = await this.roleRepository.findOne({
      where: path,
    });
    if (!exist) this.reponseCustomWithToast(ContentEnum.NOT_FOUND);

    // validate
    const nameDublicate = await this.roleRepository.findOne({
      where: {
        name: updateRoleDto.name,
        id: Not(path.id),
      },
    });
    if (nameDublicate) this.reponseCustom(ContentEnum.EXIST, FieldEnum.NAME);

    const codeDublicate = await this.roleRepository.findOne({
      where: {
        code: updateRoleDto.code,
        id: Not(path.id),
      },
    });
    if (codeDublicate) this.reponseCustom(ContentEnum.EXIST, FieldEnum.CODE);

    // update into db
    const result = await this.roleRepository.save({
      id: path.id,
      ...updateRoleDto,
    });
    return this.response(result);
  }

  async remove(path: PathDto): Promise<ResponseShape<Role>> {
    this.action = ActionEnum.DELETE;
    // check record exist
    const exist = await this.roleRepository.findOne({
      where: {
        id: path.id,
        isFixed: false,
      },
    });
    if (!exist) this.reponseCustomWithToast(ContentEnum.NOT_FOUND);

    // delete from db
    await this.roleRepository.softRemove(exist);
    return this.response(exist);
  }
}
