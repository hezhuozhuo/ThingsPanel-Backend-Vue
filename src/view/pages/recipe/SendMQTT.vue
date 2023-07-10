<template>
    <el-dialog class="el-dark-dialog el-dark-input" :visible.sync="dialogVisible" @closed="dialogVisible = false"
        :close-on-click-modal="false" title="下发配置" width="600px">
        <el-form ref="formRef" :rules="formRule" :model="formData" label-position="right" label-width="140px"
            :inline="false">

            <el-form-item label="项目" style="width: 100%" prop="projectId">
                <el-select style="width: 100%" placeholder="请选择项目" v-model="formData.projectId" @change="onChangeProject">
                    <el-option v-for="(item, index) in projectOptions" :key="index" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分组" style="width: 100%" prop="groupId">
                <el-select style="width: 100%" placeholder="请选择分组" v-model="formData.groupId" @change="onChangeGroup">
                    <el-option v-for="(item, index) in groupOptions" :key="index" :label="item.device_group"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="设备" style="width: 100%" prop="deviceId">
                <el-select style="width: 100%" placeholder="请选择设备" v-model="formData.deviceId">
                    <el-option v-for="(item, index) in deviceOptions" :key="index" :label="item.device_name"
                        :value="item.device"></el-option>
                </el-select>
            </el-form-item>

            <div style="display: flex;justify-content: center">
                <el-button type="cancel" @click="dialogVisible = false">{{ $t('SYSTEM_MANAGEMENT.CANCEL') }}</el-button>
                <el-button type="save" @click="onSendToMQTT" :loading="onSendToMQTTLoading">{{ sendText }}</el-button>
                
            </div>
            <div style="display: flex;justify-content: center;margin: 20px" v-if="onSendToMQTTLoading">
                <el-alert style="width: 300px;" effect="dark"
                    title="下发配置大约需要5分钟"
                    type="info"
                    show-icon>
                </el-alert>
            </div>

        </el-form>
    </el-dialog>
</template>

<script>
import { business_index } from "@/api/business";
import { device_group_drop } from "@/api/asset";
import { getDeviceTree } from "@/api/device"
import RecipeAPI from "@/api/recipe"
export default {
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            onSendToMQTTLoading: false,
            formData: {
                projectId: "",
                groupId: "",
                deviceId: ""
            },
            formRule: {
                projectId: [
                    { required: true, message: "请选择项目", trigger: "change" }
                ],
                groupId: [
                    { required: true, message: "请选择分组", trigger: "change" }
                ],
                deviceId: [
                    { required: true, message: "请选择设备", trigger: "change" }
                ]
            },
            projectOptions: [],
            groupOptions: [],
            deviceOptions: [],
            sendText: "下发",
        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(val) {
                if (val) {
                    this.getProjectList()
                }
            },
            immediate: true
        },
    },
    methods: {
        getProjectList() {
            business_index({ limit: 100, page: 1 })
                .then(({ data }) => {
                    if (data.code == 200) {
                        this.projectOptions = data.data?.data || [];
                    }
                })
        },
        getGroupList(id) {
            device_group_drop({ business_id: id })
                .then(({ data }) => {
                    if (data.code == 200) {
                        this.groupOptions = data?.data || [];
                    }
                })
        },
        getDeviceList(id) {
            getDeviceTree({ current_page: 1, per_page: 999, group_id: id })
                .then(({ data }) => {
                    if (data.code == 200) {
                        this.deviceOptions = data.data?.data || [];
                    }
                })
        },
        onChangeProject(val) {
            this.getGroupList(val);
        },
        onChangeGroup(val) {
            this.getDeviceList(val);
        },
        onSendToMQTT() {
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    this.onSendToMQTTLoading = true;
                    this.sendText = "下发中..."
                    RecipeAPI.sendToMQTT({ device_id: this.formData.deviceId })
                        .then(({ data }) => {
                            if (data.code == 200) {
                                this.$message.success("下发成功");
                                this.dialogVisible = false;
                            }
                            this.onSendToMQTTLoading = false;
                            this.sendText = "下发";
                        })
                        .catch(() => {
                            this.$message.error("下发失败");
                            this.onSendToMQTTLoading = false;
                            this.sendText = "下发";
                        })
                }
            })
            
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-icon-loading{
    color: #fff;    
}
</style>