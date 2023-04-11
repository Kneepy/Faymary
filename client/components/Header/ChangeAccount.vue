<script lang="ts" setup>
import { Account } from '~~/store/types/user.type';

const emit = defineEmits(["onClose"])
const close = () => emit("onClose")
const userStore = useUserStore()
const appStore = useAppStateStore()
const changeAccount = async (account: Account) => {
    if(account.user.id !== userStore.me.id) {
        try {
            /**
             * Не заносим токены в с стор т.к страница обновляется => состоямние хранилища сбросится
             */
            await userStore.changeAccount(account.id)
            location.reload()
        } catch (e) {
            console.log(e)
        }
    }
}
</script>
<template>
    <ModalBox @onClose="close">
        <div class="change_account">
            <div class="title">Сменить учётную запись</div>
            <div class="accounts">
                <Button v-for="account in userStore.me.profile.accounts" @click="changeAccount(account)" :key="account.id" class="account">
                    <Avatar :href="account.user.file_id" :size=50 />
                    <div class="user_info">
                        <div class="name">{{ account.user.fullName }}</div>
                        <div class="email">{{ account.user.email }}</div>
                    </div>
                    <div v-if="account.user.id === userStore.me.id" class="current_account">
                        <span class="material-symbols-rounded">done</span>
                    </div>
                </Button>
            </div>
        </div>
    </ModalBox>
</template>
<style lang="scss">
.change_account {
    background-color: $primary_content_background;
    width: max-content;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 20px;
    flex-direction: column;
    max-width: 700px;
    .title {
        font-size: 21px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .accounts {
        width: 100%;
        .account {
            min-width: 400px;
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            background-color: $panel_background;
            border-radius: 10px;
            text-align: left;
            font-weight: normal;
            opacity: .8;
            &:hover {
                opacity: 1;
            }
            .user_info {
                margin-left: 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: $white;
                .name {
                    font-size: 17px;
                    font-weight: 400;
                }
                .email {
                    font-size: 14px;
                    font-weight: 600;
                }
            }
            .current_account {
                flex: 1;
                min-width: 50px;
                display: flex;
                justify-content: end;
                span {
                    color: $white;
                    font-size: 24px;
                }
            }
        }
    }
}
</style>