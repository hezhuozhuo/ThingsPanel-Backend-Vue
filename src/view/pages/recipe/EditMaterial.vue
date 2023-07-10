<!-- ===================================================================================== -->
<!-- 添加物料 -->
<!-- ===================================================================================== -->
<template>
    <el-dialog class="el-dark-dialog el-dark-input" :visible.sync="dialogVisible" :append-to-body="true"
        @closed="dialogVisible = false" :close-on-click-modal="false" :before-close="() => dialogVisible = false"
        :title="resource==='material' ? '添加物料' : '添加口味物料'" width="600px">

        <el-form ref="formRef" :model="formData" :rules="formRule" label-position="right" label-width="140px"
            :inline="false">

            <!-- 物料名称 下拉列表 可手动输入 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_MATERIAL.MATERIAL')" prop="name">
                <el-select v-model="material" filterable allow-create @change="handleChangeMaterial"
                    placeholder="请输入或选择" value-key="id">
                    <el-option v-for="(item, index) in materialList" :value="item" :key="index"
                        :label="item.name +'(' + item.dosage + item.unit + ')' + item.water_line + 'ML ' + item.station"></el-option>
                </el-select>
            </el-form-item>

            <!-- 用量 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_MATERIAL.DOSAGE')" prop="dosage">
                <el-input-number v-model="formData.dosage" :disabled="editMode !== 'create'">g/克</el-input-number>
            </el-form-item>

            <!-- 单位 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_MATERIAL.UNIT')" prop="unit">
                <el-input v-model="formData.unit" :disabled="editMode !== 'create'"></el-input>
            </el-form-item>

            <!-- 加汤水位线 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_MATERIAL.ADDSOUPWATERLINE')" prop="water_line">
                <el-input-number v-model="formData.water_line" :disabled="editMode !== 'create'"></el-input-number>
                ML
            </el-form-item>

            <!-- 工位 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_MATERIAL.STATION')" style="width: 100%" prop="station">
                <el-select style="width: 100%" :placeholder="$t('RECIPEMANAGEMENT.ADD_MATERIAL.STATION')"
                    v-model="formData.station" :disabled="editMode !== 'create'">
                    <el-option label="不显示" value="不显示">不显示</el-option>
                    <el-option label="所有工位" value="所有工位">所有工位</el-option>
                    <el-option label="鲜料工位" value="鲜料工位">鲜料工位</el-option>
                    <el-option label="传锅工位" value="传锅工位">传锅工位</el-option>
                </el-select>
            </el-form-item>

            <!--  -->
            <div style="display: flex;justify-content: center">
                <el-button type="cancel" @click="dialogVisible = false">{{ $t('SYSTEM_MANAGEMENT.CANCEL') }}</el-button>
                <el-button type="save" @click="onSubmit">{{ $t('SYSTEM_MANAGEMENT.CONFIRM') }}</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<!-- ===================================================================================== -->
<!-- 添加物料 -->
<!-- ===================================================================================== -->
<script>
import RecipeAPI from "@/api/recipe";
const defaultFormData = {
    id: "",
    name: "",
    dosage: 1,
    unit: "",
    water_line: 1,
    station: "不显示",
    resource: "material"
}
export default {
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        resource: {
            type: String,
            default: "material"
        }
    },
    data() {
        return {
            editMode: "create",    // 模式 create: 创建, edit: 编辑
            material: {},
            formData: JSON.parse(JSON.stringify(defaultFormData)),
            formRule: {
                name: [
                    { required: true, message: '请输入物料名称', trigger: 'blur' }
                ],
                dosage: [
                    { required: true, message: '请输入用量', trigger: 'blur' },
                    { type: 'number', message: '请输入数字', trigger: 'blur' }
                ],
                unit: [
                    { required: true, message: '请输入单位', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                water_line: [
                    { required: true, message: '请输入加汤水位线', trigger: 'blur' },
                    { type: 'number', message: '请输入数字', trigger: 'blur' }
                ],
                station: [
                    { required: true, message: '请选择工位', trigger: 'blur' }
                ]
            },
            materialList: [],    // 物料下拉列表
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
                    this.initForm();
                }
            },
            immediate: true
        },
        material: {
            handler(val) {
                console.log("formData.material", typeof val, this.formData)
                if ((typeof val) === "string") {
                    this.editMode = "create";
                    this.formData = JSON.parse(JSON.stringify(defaultFormData))
                    this.formData.name = val;
                } else {
                    this.editMode = "edit";
                    this.formData = { ...val };
                }
                this.formData.resource = this.resource;
            },
            immediate: true
        }
    },
    methods: {
        initForm() {
            this.material = {};
            this.formData = JSON.parse(JSON.stringify(defaultFormData));
            this.formData.resource = this.resource;
            this.getMaterialList();
        },
        /**
         * 获取物料列表
         */
        getMaterialList() {
            const params = { current_page: 1, per_page: 999, resource: this.resource }
            RecipeAPI.getMaterialList(params)
                .then(({ data: result }) => {
                    console.log("getMaterialList", result)
                    if (result.code === 200) {
                        this.materialList = result.data.data || [];
                    }
                })
        },
        onSubmit() {
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    if (this.editMode === 'create') {
                        // RecipeAPI.addMaterial(this.formData).then(res => {
                        this.$emit('submit', this.formData)
                        this.dialogVisible = false
                        // })
                    } else if (this.editMode === 'edit') {
                        // RecipeAPI.editMaterial(this.formData).then(res => {
                        this.$emit('submit', this.formData)
                        this.dialogVisible = false
                        // })
                    }
                }
            })
        },

        handleChangeMaterial(val) {

        }
    }
}
</script>
<style lang="scss" scoped></style>