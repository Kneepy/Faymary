import { Notifications } from "src/common";
import { FindOperator } from "typeorm";

export interface NotificationFindOneInterface extends Partial<Notifications> {
    createdAt?: FindOperator<any> | number | any
}

export interface NotificationFindManyInterface
    extends Omit<Notifications, "id"> {}
