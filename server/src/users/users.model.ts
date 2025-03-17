import {Column, DataType, Model, Table} from "sequelize-typescript";

interface UserAttributes {
    email: string;
    password: string;
    isBlocked?: boolean;
}


@Table({tableName: 'users'})
export class User extends Model<User, UserAttributes> {
    @Column({type: DataType.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;
    @Column({type: DataType.STRING, allowNull: false, unique: true, validate: {isEmail: true}})
    email: string;
    @Column({type: DataType.STRING, allowNull: false})
    password: string;
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    isBlocked: boolean;
}