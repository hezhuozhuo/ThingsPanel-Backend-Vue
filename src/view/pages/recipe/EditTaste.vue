<template>
    <el-dialog class="el-dark-dialog el-dark-input" :visible.sync="dialogVisible" @closed="dialogVisible = false"
        :append-to-body="true" :close-on-click-modal="false" :before-close="() => dialogVisible = false"
        :title="$t('RECIPEMANAGEMENT.ADDTASTE')" width="600px">

        <el-form ref="formRef" :rules="formRule" :model="formData" label-position="right" label-width="140px"
            :inline="false">

            <!-- 添加口味 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_TASTE.TASTE')" prop="name">
                <el-select v-model="taste" value-key="id" filterable allow-create placeholder="请输入或选择"
                    @change="onChangeTaste">
                    <el-option v-for="(item, index) in tasteList" :value="item" :key="index"
                        :label="item.taste_id + ' - ' + item.name"></el-option>
                </el-select>
            </el-form-item>

            <!-- 添加口味ID -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_TASTE.TASTEID')" prop="taste_id">
                <el-input v-model="formData.taste_id" :disabled="editMode === 'edit'"></el-input>
            </el-form-item>

            <!-- 添加口味物料 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.ADD_TASTE.MATRIAL')" style="width: 100%">
                <div>
                    <el-button type="save" @click="materialDialogVisible = true"
                        :disabled="editMode === 'edit'">添加口味物料</el-button>
                </div>
                <div>
                    <el-tag :key="index" v-for="(item, index) in formData.materials_list" :closable="editMode === 'create'"
                        :disable-transitions="false" @close="handleTasteMaterialClose(item, index)">{{ item.name +
                            item.dosage + item.unit }}</el-tag>
                </div>
            </el-form-item>

            <div style="display: flex;justify-content: center">
                <el-button type="cancel" @click="dialogVisible = false">{{ $t('SYSTEM_MANAGEMENT.CANCEL') }}</el-button>
                <el-button type="save" @click="onSubmit">{{ $t('SYSTEM_MANAGEMENT.CONFIRM') }}</el-button>
            </div>
        </el-form>

        <!-- 添加口味物料 -->
        <EditMaterial resource="taste" :visible.sync="materialDialogVisible" @submit="addMaterialSubmit" />
    </el-dialog>
</template>

<script>
import RecipeAPI from "@/api/recipe";
import EditMaterial from "./EditMaterial.vue";
const defaultFormData = {
    name: "",     // 口味名称
    taste_id: "",
    remark: "",
    materials_list: []
};
export default {
    components: { EditMaterial },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            editMode: "create",    // 模式 create: 创建, edit: 编辑
            taste: "",
            formData: JSON.parse(JSON.stringify(defaultFormData)),
            formRule: {
                "name": [
                    { required: true, message: "请选择或输入口味", trigger: "blur" }
                ],
                "taste_id": [
                    { required: true, message: "请输入口味ID", trigger: "blur" }
                ]
            },
            tasteList: [],
            materialDialogVisible: false
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
        dialogVisible(val) {
            if (val) {
                this.initForm();
            }
        },
        taste: {
            handler(val) {
                console.log('taste 1', val)
                if ((typeof val) === "string") {
                    console.log('taste create', val)
                    this.editMode = "create";
                    this.formData = JSON.parse(JSON.stringify(defaultFormData))
                    this.formData.name = val;
                } else {
                    this.editMode = "edit";
                    this.formData = { ...val };
                    console.log('taste edit', val)
                }
                console.log('taste formData', this.formData)

            },
            immediate: true
        }
    },
    methods: {
        /**
         * 初始化表单
         */
        initForm() {
            // 获取口味列表
            this.getTasteList();
            this.taste = "";
            this.formData = {
                name: "",     // 口味名称
                taste_id: "",
                remark: "",
                materials_list: []
            }
        },
        onSubmit() {
            console.log('onSubmit', this.formData, this.taste, this.editMode)
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    this.$emit('submit', this.formData);
                    this.dialogVisible = false;
                }
            })
        },
        /**
         * 获取口味列表
         */
        getTasteList() {
            const params = { current_page: 1, per_page: 999, }
            RecipeAPI.getTasteList(params)
                .then(({ data: result }) => {
                    console.log("口味列表", result);
                    if (result.code === 200) {
                        this.tasteList = result.data.data || [];
                    }
                })
        },
        onChangeTaste(val) {
            console.log('onChangeTaste', val)
            this.formData = { ...val, taste: val };
            if (!this.formData.materials_list) {
                this.formData.materials_list = [];
            }
        },
        addMaterialSubmit(material) {
            console.log('addMaterialSubmit', material)
            this.formData.materials_list.push(material);
        }
    }
}
</script>
<style lang="scss" scoped>
.el-tag {
    margin-right: 4px;
}
</style>