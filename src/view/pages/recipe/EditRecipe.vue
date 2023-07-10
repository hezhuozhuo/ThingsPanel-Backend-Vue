<!-- ===================================================================================== -->
<!-- 创建配方 -->
<!-- ===================================================================================== -->
<template>
    <el-dialog class="el-dark-dialog el-dark-input" :visible.sync="dialogVisible" @closed="dialogVisible = false" :append-to-body="true"
        :close-on-click-modal="false" :before-close="() => dialogVisible = false" :title="$t('RECIPEMANAGEMENT.MATERIAL')" width="600px">
        <el-form ref="formRef" :rules="formRule" :model="formData" label-position="right" label-width="140px" :inline="false">

            <!-- 锅底名称 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.RECIPE_EDIT.BOTTOMPOT')" style="width: 100%" prop="bottom_pot">
                <el-input size="medium" v-model="formData.bottom_pot"></el-input>
            </el-form-item>

            <!-- 锅底ID -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.RECIPE_EDIT.BOTTOMPOTID')" style="width: 100%" prop="bottom_pot_id">
                <el-input size="medium" v-model="formData.bottom_pot_id"></el-input>
            </el-form-item>

            <!-- 锅型名称 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.RECIPE_EDIT.POTTYPE')" style="width: 100%" prop="hdl_pot_type_id">
                <el-select style="width: 100%" :placeholder="$t('RECIPEMANAGEMENT.RECIPE_EDIT.POTTYPE')"
                    v-model="formData.hdl_pot_type_id">
                    <el-option v-for="(item, index) in potTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <!-- 物料 先选锅型再添加物料 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.RECIPE_EDIT.MATERIAL')" style="width: 100%" prop="materials_list">
                <div>
                    <el-button type="save" @click="materialDialogVisible = true" :disabled="!formData.hdl_pot_type_id">添加物料</el-button>
                </div>
                <div class="materials-tag-box" style="text-align: left">
                    <el-tag v-for="(item, index) in formData.materials_list" :key="index" closable :disable-transitions="false"
                    @close="handleDeleteMaterial(item, index)">{{ item.name + item.dosage + item.unit + item.water_line + 'ML ' + item.station }}</el-tag>
                </div>

                <!-- 添加物料 -->
                <EditMaterial :visible.sync="materialDialogVisible" @submit="addMaterialSubmit"/>
            </el-form-item>

            <!-- 口味 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.RECIPE_EDIT.TASTE')" style="width: 100%" prop="taste_list">
                <div>
                    <el-button type="save" @click="tasteDialogVisible = true">添加口味</el-button>
                </div>
                <div>
                    <el-tag v-for="(item, index) in formData.taste_list" :key="index" closable :disable-transitions="false"
                        @close="handleDeleteTaste(item, index)">
                        {{ item.taste_id + ' - ' + item.name }} ：
                        <template v-for="(material, index) in item.materials_list">
                            {{ material.name + material.dosage + material.unit + material.water_line + 'ML ' + material.station }}
                        </template>
                    </el-tag>
                </div>
                

                <!-- 添加口味 -->
                <EditTaste :visible.sync="tasteDialogVisible" @submit="addTasteSubmit"/>
            </el-form-item>

            <!-- 锅底属性 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.RECIPE_EDIT.BOTTOMPROPERTIES')" style="width: 100%" prop="bottom_properties">
                <el-select style="width: 100%" :placeholder="$t('RECIPEMANAGEMENT.RECIPE_EDIT.BOTTOMPROPERTIES')"
                    v-model="formData.bottom_properties">
                    <el-option label="辣" value="辣">辣</el-option>
                    <el-option label="不辣" value="不辣">不辣</el-option>
                </el-select>
            </el-form-item>

            <!-- 加汤水位标准 -->
            <el-form-item :label="$t('RECIPEMANAGEMENT.RECIPE_EDIT.SOUPSTANDARD')" style="width: 100%" prop="soup_standard">
                <el-input-number size="medium" v-model="formData.soup_standard" disabled></el-input-number> ML
            </el-form-item>

            <!-- 按钮 -->
            <div style="display: flex;justify-content: center">
                <el-button type="cancel" @click="dialogVisible = false">{{ $t('SYSTEM_MANAGEMENT.CANCEL') }}</el-button>
                <el-button type="save" @click="onSubmit">{{ $t('SYSTEM_MANAGEMENT.CONFIRM') }}</el-button>
            </div>

        </el-form>

        
        
    </el-dialog>
</template>
<!-- ===================================================================================== -->
<!-- 创建配方 -->
<!-- ===================================================================================== -->
<script>
import PotAPI from "@/api/pot";
import RecipeAPI from "@/api/recipe";
// 物料弹窗
import EditMaterial from "./EditMaterial.vue";
// 口味弹窗
import EditTaste from "./EditTaste.vue";
const defaultData = {
    bottom_pot_id: "",      // 锅底ID
    bottom_pot: "",         // 锅底名称
    bottom_properties: "",  // 锅底属性
    hdl_pot_type_id: "",    // 锅型ID
    remark: "",             // 备注
    materials_list: [],     // 物料列表
    taste_list: [],          // 口味
    soup_standard: 0
}
export default {
    components: { EditMaterial, EditTaste },
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
            formData: JSON.parse(JSON.stringify(defaultData)),          // 表单数据
            formRule: {
                bottom_pot: [
                    { required: true, message: "请输入锅底名称", trigger: "blur" }
                ],
                bottom_pot_id: [
                    { required: true, message: "请输入锅底ID", trigger: "blur" }
                ],
                hdl_pot_type_id: [
                    { required: true, message: "请选择锅型", trigger: "blur" }
                ],
                bottom_properties: [
                    { required: true, message: "请选择锅底属性", trigger: "blur" }
                ],
                materials_list: [
                    { required: true, message: "请添加物料", trigger: "blur" }
                ]
            },
            potTypeList: [],        // 锅型列表
            materialDialogVisible: false,    // 是否显示添加物料弹窗
            tasteDialogVisible: false,       // 是否显示添加口味弹窗
        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
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
        },
        "formData.hdl_pot_type_id": {
            async handler(val) {
                console.log('formData.hdl_pot_type_id', val)
                if (val) {
                    if (!this.potTypeList.length) {
                        await this.getPotList();
                    }
                    const current = this.potTypeList.find(item => item.id === val);
                    console.log('handleChangePotType', this.potTypeList, current);
                    if (current) {
                        this.formData.soup_standard = current.soup_standard;
                    }
                    
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        console.log('Recipe mounted')
    },
    methods: {
        /**
         * 初始化表单
         */
        initForm(id) {
            this.getPotList();
            if (id) {
                // 编辑
                const params = { current_page: 1, per_page: 1, id }
                RecipeAPI.getOne(params)
                    .then(({ data: result}) => {
                        if (result.code === 200) {
                            this.formData = result.data.data[0] || {};
                        }
                        console.log('getOne', this.formData)
                    })
            } else {
                // 新增
                this.formData = JSON.parse(JSON.stringify(defaultData));
            }
        },
        /**
         * 提交
         */
        onSubmit() {
            console.log('onSubmit', this.formData)
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    if (this.formData.id) {
                        RecipeAPI.edit(this.formData)
                            .then(({data: result}) => {
                                if (result.code === 200) {
                                    this.$message.success("修改成功");
                                    this.dialogVisible = false;
                                    this.formData = JSON.parse(JSON.stringify(defaultData));
                                    this.$emit("submit");
                                }
                            })
                    } else {
                        RecipeAPI.add(this.formData)
                            .then(({data: result}) => {
                                if (result.code === 200) {
                                    this.$message.success("添加成功");
                                    this.dialogVisible = false;
                                    this.formData = JSON.parse(JSON.stringify(defaultData));
                                    this.$emit("submit");
                                }
                            })
                    }
                    
                }
            })
        },
        /**
         * 获取锅型列表
         */
        async getPotList() {
            const params = { current_page:1, per_page: 999 }
            let { data } = await PotAPI.page(params);
            if (data.code === 200) {
                this.potTypeList = data.data.data || [];
            }
        },
        /**
         * 添加了一个物料
         * @param {Object} material 物料
         */
        addMaterialSubmit(material) {
            console.log('addMaterialSubmit', material)
            this.formData.materials_list.push({ ...material });
        },
        addTasteSubmit(taste) {
            console.log('addTasteSubmit', taste)
            if (!this.formData.taste_list) {
                this.formData.taste_list = [];
            }
            this.formData.taste_list.push({ ...taste });
            console.log('addTasteSubmit', this.formData)

        },
        handleDeleteMaterial(material, index) {
            console.log('handleDeleteMaterial', material, index)
            this.formData.materials_list.splice(index, 1);
        },
        handleDeleteTaste(taste, index) {
            this.formData.taste_list.splice(index, 1);
        }
    }
}
</script>
<style lang="scss" scoped>
.el-tag {
    margin-right: 4px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>