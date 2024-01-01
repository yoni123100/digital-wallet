import { Injectable, Logger } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { Group, GroupDocument } from './group.schema';
import { CreateGroupDTO } from 'shared/dtos/groups/create-group.dto';
import { AddMoneyToGroupDTO, UpdateGroupDTO } from 'shared/dtos/groups/update-group.dto';
import { UserService } from '../users/users.service';
import { UserDocument } from '../users/user.schema';

@Injectable()
export class GroupRepository {
  private logger: Logger = new Logger();

  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    private readonly usersService: UserService,
  ) {}

  async checkExists(id: string): Promise<boolean> {
    return !!(await this.groupModel.findById(id).select('_id').lean().exec());
  }

  async get(id: string, lean?: boolean) {
    if (!isValidObjectId(id)) {
      throw new RpcException('Received not a valid group id!');
    }

    return this.groupModel.findById(id, {}, { lean }).exec();
  }

  async create(createGroupDto: CreateGroupDTO): Promise<Group> {
    const createdGroupDoc = new this.groupModel(createGroupDto);

    return await createdGroupDoc.save();
  }

  async delete(id: string) {
    const deletionQuery = this.groupModel.deleteOne({ id });
    const result = await deletionQuery.exec();

    return result;
  }

  async getAll(): Promise<Group[]> {
    return this.groupModel.find().lean().exec();
  }

  /**
   * @returns true if success, otherwise false
   */
  async joinUser({ id, newUserId, enteringAmount }: UpdateGroupDTO): Promise<boolean> {
    const session = await this.groupModel.startSession();

    let hasOperationSucceeded = false;
    try {
      session.startTransaction();

      const userCanEnter = enteringAmount
        ? await this.usersService.withdraw(newUserId, enteringAmount)
        : true;

      if (!userCanEnter)
        throw new RpcException(`User doesnt own ${enteringAmount}$ so he can't enter the group!`);

      const currentGroup = await this.groupModel.findById(id).session(session);
      const newGroupUser = await this.usersService.getOne(newUserId);

      currentGroup.users.push(newGroupUser);
      currentGroup.amount += enteringAmount;

      await currentGroup.save({ session });

      this.logger.log(`Successfully added ${newGroupUser.username} to ${currentGroup.name} group`);

      await session.commitTransaction();

      hasOperationSucceeded = true;
    } catch (error) {
      this.logger.error(`Failed to add ${newUserId} to group ${id}`);
      await session.abortTransaction();

      throw error;
    } finally {
      await session.endSession();
    }

    return hasOperationSucceeded;
  }

  // Add money from one user to other group
  async addMoney({ from, id, amount }: AddMoneyToGroupDTO) {
    const session = await this.groupModel.startSession();
    let status = false;
    try {
      session.startTransaction();

      // Check if user is in group
      const currentGroup = await this.groupModel.findById(id).session(session);
      const userPartOfGroup = await this.checkUserIsMember(from, id);
      if (!userPartOfGroup) {
        throw new RpcException('');
      }

      await this.usersService.withdraw(from, amount);

      currentGroup.amount += amount;

      await currentGroup.save({ session });

      this.logger.log(`Successfully added ${amount} to ${currentGroup.name} group from ${from}!`);

      await session.commitTransaction();

      status = true;
    } catch (error) {
      this.logger.error(`Failed to add money to group ${id} from ${from} (${amount})`);
      await session.abortTransaction();

      throw error; // Pass the RpcException to upper call stack (because of the try/catch)
    } finally {
      await session.endSession();
    }

    return status;
  }

  private async checkUserIsMember(userId: string, groupId: string) {
    // Find a group that has same groupId and his users property contains userId, if not found then his is not a member of the group
    const exists = await this.groupModel.findOne({ _id: groupId, users: { $in: [userId] } }).exec();

    return !!exists;
  }
}
