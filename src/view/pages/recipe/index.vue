<template>
    <div class="rounded card p-4">
        <!-- 头 start -->
        <el-row type="flex" class="pt-3 pb-4 px-3">
            <el-col :span="12">
                <TableTitle>{{ $t('RECIPEMANAGEMENT.RECIPE_LIST.RECIPTLIST') }}</TableTitle>
            </el-col>
            <el-col :span="12" class="text-right">
                <!-- 添加权限按钮 -->
                <el-button size="medium" type="indigo" @click="handleShowAddRecipe">{{ $t('RECIPEMANAGEMENT.CREATERECIPE')
                }}</el-button>
                <el-button size="medium" type="border" @click="sendToMQTTDialogVisible=true">下发配置</el-button>

            </el-col>
        </el-row>
        <!-- 头 end -->

        <!-- 表 start -->
        <el-table :data="tableData" v-loading="loading" row-key="id" default-expand-all fit @sort-change="onSortChange">
            <el-table-column type="index"></el-table-column>
            <el-table-column sortable :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.BOTTOMPOTID')" prop="bottom_pot_id" width="100"></el-table-column>
            <el-table-column :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.BOTTOMPOT')" prop="bottom_pot"></el-table-column>
            <el-table-column :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.POTTYPID')" prop="pot_type_id"></el-table-column>
            <el-table-column :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.POTTYPE')" prop="pot_type_name"></el-table-column>

            <!-- 物料 -->
            <el-table-column :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.MATERIAL')" prop="materials_list" show-overflow-tooltip min-width="200">
                <template v-slot="scope">
                    <template v-for="(item, index) in scope.row.materials_list">
                        <el-tag  size="small" style="margin: 4px">
                            {{ item.name + item.dosage + item.unit + item.water_line + 'ML ' + item.station }}
                        </el-tag>
                        <br>
                    </template>
                    
                </template>
            </el-table-column>

            <!-- 口味 -->
            <el-table-column :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.TASTE')" prop="taste_list" show-overflow-tooltip  min-width="200">
                <template v-slot="scope">
                    <el-tag v-for="(item, index) in scope.row.taste_list" :key="index" size="small" style="margin: 4px">
                            {{ item.taste_id + ' - ' + item.name }} ：
                            <template v-for="(material, index) in item.materials_list">
                                {{ material.name + material.dosage + material.unit + material.water_line + 'ML ' + material.station }}
                            </template>
                    </el-tag>
                </template>
            </el-table-column>

            <!-- 锅底属性 -->
            <el-table-column :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.BOTTOMPROPERTIES')" prop="bottom_properties" width="100">
            </el-table-column>

            <el-table-column label="更新时间" sortable="custom" prop="update_at" width="150">
                <template v-slot="scope">
                    {{ dateFormat(scope.row.update_at) }}
                </template>
            </el-table-column>

            <el-table-column :label="$t('RECIPEMANAGEMENT.RECIPE_LIST.OPERATION')" align="center" width="160">
                <template v-slot="scope">
                    <div class="text-right">

                        <el-button type="indigo" size="mini" class="mr-3" @click="handleShowEditRecipe(scope.row)">
                            {{ $t('RECIPEMANAGEMENT.RECIPE_LIST.EDIT') }}
                        </el-button>

                        <el-popconfirm :title="$t('SYSTEM_MANAGEMENT.PERMISSION_MANAGEMENT.DELETETHISITEM')"
                            @confirm="handleDelete(scope.row)">
                            <el-button slot="reference" type="danger" size="mini">
                                {{ $t('RECIPEMANAGEMENT.RECIPE_LIST.DELETE') }}
                            </el-button>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表 end -->

        <!-- 分页 start -->
        <div class="text-right py-3">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page.sync="params.current_page"
                :page-size="params.per_page" @current-change="getList"></el-pagination>
        </div>

        <!-- 创建物料 start -->
        <EditRecipe :visible.sync="recipeDialogVisible" :id="recipeId" @submit="getList"/>
        <!-- 创建物料 end -->

        <!-- 下发配置 start -->
        <SendMQTT :visible.sync="sendToMQTTDialogVisible" />
        <!-- 下发配置 end -->

    </div>
</template>

<script>
import TableTitle from "@/components/common/TableTitle.vue"
import Recipe from "@/api/recipe"
import EditRecipe from "./EditRecipe.vue"
import SendMQTT from "./SendMQTT.vue"
import { dateFormat } from "@/utils/tool"
export default {
    components: { TableTitle, EditRecipe, SendMQTT },
    props: {},
    data() {
        return {
            dateFormat: dateFormat,
            loading: false,
            total: 10,
            params: {
                current_page: 1,
                per_page: 5,
                order_by: "update_at",
                sort_by: "desc"
            },
            tableData: [],
            // 是否显示创建物料弹窗
            recipeDialogVisible: false,
            // 配方id
            recipeId: "",
            sendToMQTTDialogVisible: false
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        /**
         * 获取配方管理列表
         */
        getList() {
            Recipe.page(this.params)
                .then(({ data }) => {
                    if (data.code == 200) {
                        this.total = data.data.total
                        this.tableData = data.data.data || [];
                        this.tableData.forEach(item => {
                            item.Materials = item.MaterialArr.map(item => item.Name + item.Dosage + item.Unit).join('\n')
                            item.Taste = item.TasteArr.map(item => item.Name).join(',')
                        })
                    }
                })
        },
        /**
         * 创建配方
         */
        handleShowAddRecipe() {
            this.recipeId = "";
            this.recipeDialogVisible = true;
        },
        /**
         * 编辑配方
         */
        handleShowEditRecipe(row) {
            this.recipeId = row.id;
            this.recipeDialogVisible = true;
        },
        handleDelete(row) {
            Recipe.del({ id: row.id })
                .then(({ data: result }) => {
                    if (result.code === 200) {
                        this.$message.success("删除成功");
                        this.getList();
                    }
                    console.log('handleDelete', result)
                })
        },
        onSortChange({ column, prop, order }) {
            this.params.order_by = prop;
            this.params.sort_by = order == 'ascending' ? 'asc' : 'desc';
            this.getList();
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table .cell.el-tooltip  {
    white-space: pre-wrap;
}
::v-deep {
    .el-tag{
        white-space: normal;
        height:auto;
    }
}
</style>