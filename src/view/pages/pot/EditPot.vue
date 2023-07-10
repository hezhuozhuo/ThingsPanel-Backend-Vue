<template>
    <!-- 创建锅型 start -->
    <el-dialog class="el-dark-dialog el-dark-input" :visible.sync="dialogVisible" @closed="dialogVisible = false"
        :close-on-click-modal="false" :title="$t('POTTYPE.POTTYPE_MANAGEMENT.POTTYPEMANAGEMENT')" width="600px">
        <el-form :model="formData" label-position="right" label-width="140px" :inline="false">

            <!-- 锅型名称 -->
            <el-form-item :label="$t('POTTYPE.POTTYPE_ADD.POTNAME')" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>

            <!-- 锅型ID -->
            <el-form-item :label="$t('POTTYPE.POTTYPE_ADD.POTID')" prop="pot_type_id">
                <el-input v-model="formData.pot_type_id"></el-input>
            </el-form-item>

            <!-- 锅型图片 -->
            <el-form-item :label="$t('POTTYPE.POTTYPE_ADD.POTIMAGE')" prop="image">
                <el-upload class="avatar-uploader" :action="url + 'api/file/up'" :headers="headersObj" :data="{type: 'logo'}"
                    :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="formData.image" :src="formData.image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

            </el-form-item>

            <!-- 加汤水位线标准 -->
            <el-form-item :label="$t('POTTYPE.POTTYPE_ADD.SOUPSTANDARD')" prop="SoupStandard">
                <el-input-number v-model="formData.soup_standard"></el-input-number>
            </el-form-item>


            <div style="display: flex;justify-content: center">
                <el-button type="cancel" @click="dialogVisible = false">{{ $t('SYSTEM_MANAGEMENT.CANCEL') }}</el-button>
                <el-button type="save" @click="onSubmit">{{ $t('SYSTEM_MANAGEMENT.CONFIRM') }}</el-button>
            </div>

        </el-form>
    </el-dialog>
    <!-- 创建锅型 end -->
</template>

<script>
import { local_url } from "@/api/LocalUrl"
import JwtService from "@/core/services/jwt.service";
import PotAPI from "@/api/pot.js"
import { message_success } from "@/utils/helpers"
export default {
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            url: local_url,
            formData: {
                name: "",
                pot_type_id: "",
                image: "",
                soup_standard: "",
            },
            headersObj: {
                Authorization: "Bearer " + JwtService.getToken(),
            },
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
        }
    },
    watch: {
        dialogVisible: {
            handler(val) {
                if (val) {
                    this.initForm(this.id);
                }
            },
            immediate: true
        }
    },
    methods: {
        /**
         * 初始化表单
         */
        initForm(id) {
            if (id) {
                // 编辑
                const params = { current_page: 1, per_page: 1, id }
                PotAPI.getOne(params)
                    .then(({ data: result }) => {
                        console.log('getOne', result)
                        if (result.code === 200) {
                            this.formData = result.data.data[0] || {}
                        }
                    })
            } else {
                // 新增
                this.formData = {
                    name: "",
                    pot_type_id: "",
                    image: "",
                    soup_standard: "",
                }
            }
        },
        handleAvatarSuccess(res, file) {
            this.formData.image = res.data;
            // this.formData.image = URL.createObjectURL(file.raw);
            console.log('handleAvatarSuccess res file', res, file)
            console.log('handleAvatarSuccess formData', this.formData)
        },
        beforeAvatarUpload(file) {
            // 上传前设置请求头，因为 token 会刷新
            this.headersObj.Authorization = "Bearer " + JwtService.getToken()
            // console.log('111',file);
            return true;
        },
        onSubmit() {
            console.log('onSubmit formData', this.formData)
            PotAPI.saveOrUpdate(this.formData.id ? "edit" : "add", this.formData)
                .then(({ data }) => {
                    if (data.code == 200) {
                        this.dialogVisible = false
                        message_success("操作成功")
                        this.$emit("submit")
                    }
                })
        },
    }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    background-color: #212d66;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>