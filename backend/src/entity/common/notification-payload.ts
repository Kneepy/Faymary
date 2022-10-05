import { JoinTable, ManyToMany } from "typeorm";
import { Dialogs } from "../conversation";
import { Comments, Posts } from "../posts";
import { Users } from "../users";
import { Lifetime } from "./lifetime";

export class NotificationPayload extends Lifetime {
    @ManyToMany(() => Comments)
    @JoinTable()
    comment?: Comments

    @ManyToMany(() => Posts)
    @JoinTable()
    post?: Posts

    @ManyToMany(() => Users)
    @JoinTable()
    user?: Users

    @ManyToMany(() => Dialogs)
    @JoinTable()
    dialog?: Dialogs
}