<template>
    <div class="rounded card p-4">
        <el-row type="flex" :gutter="20" class="pt-3 pb-4 px-3">
            <el-col :span="12">
                <TableTitle>{{ $t('POTTYPE.POTTYPE_MANAGEMENT.POTTYPRLIST') }}</TableTitle>
            </el-col>
            <el-col :span="12" class="px-2 text-right">
                <el-button size="medium" type="border" @click="handleCreate">{{
                    $t('POTTYPE.POTTYPE_MANAGEMENT.CREATEPOTTYPE') }}</el-button>
            </el-col>
        </el-row>

        <!-- 表 start -->
        <el-form class="inline-edit">
            <el-table :data="tableData" v-loading="loading">

                <!-- 锅型ID-->
                <el-table-column :label="$t('POTTYPE.POTTYPE_MANAGEMENT.POTTYPEID')" prop="pot_type_id" align="left">
                </el-table-column>

                <!-- 锅型名称-->
                <el-table-column :label="$t('POTTYPE.POTTYPE_MANAGEMENT.POTNAME')" prop="name" align="left">
                </el-table-column>

                <!-- 图片-->
                <el-table-column :label="$t('POTTYPE.POTTYPE_MANAGEMENT.POTIMAGE')" prop="image" align="left">
                    <template v-slot:default="scope">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.image" />
                    </template>
                </el-table-column>

                <!-- 操作列-->
                <el-table-column align="left" :label="$t('POTTYPE.POTTYPE_MANAGEMENT.OPERATION')" width="230">
                    <template v-slot="scope">
                        <div style="text-align: left">
                            <el-button type="indigo" size="mini" class="mr-3" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-popconfirm :title="$t('AUTOMATION.TITLE4')" @confirm="handleDelete(scope.row)">
                                <el-button slot="reference" size="mini" type="danger">{{
                                    $t('POTTYPE.POTTYPE_MANAGEMENT.DELETE') }}</el-button>
                            </el-popconfirm>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <!-- 表 end -->

        <!-- 分页 start -->
        <div class="text-right py-3">
            <el-pagination background layout="prev, pager, next" :total="params.total"
                :current-page.sync="params.current_page" :page-size="params.per_page"
                @current-change="getList"></el-pagination>
        </div>
        <!-- 分页 end -->

        <!-- 创建/编辑锅型 -->
        <EditPot :visible.sync="potDialogVisible" :id="potId" @submit="getList"/>
    </div>
</template>
  
<script>
import TableTitle from "@/components/common/TableTitle.vue"
import PotAPI from "@/api/pot.js"
import { message_success } from "@/utils/helpers";
import { dateFormat } from "@/utils/tool";
import EditPot from "./EditPot.vue"

export default {
    name: "index",
    components: { TableTitle, EditPot },
    data() {
        return {
            tableData: [],
            loading: false,
            params: { 
                total: 0,
                current_page: 1,
                per_page: 10
            },
            potId: "",     
            potDialogVisible: false,   // 是否显示锅型弹窗
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        /**
         * 获取锅型列表
        */
        getList() {
            PotAPI.page(this.params)
                .then(({ data }) => {
                    if (data.code == 200) {
                        this.tableData = data.data.data.map(item => {
                            item.created = dateFormat(item.created_time)
                            return item;
                        })
                        console.log('pot', this.tableData)
                    }
                })
        },
        handleSearch() {
            this.getList();
        },
        /**
         * 打开创建锅型对话框
         */
        handleCreate() {
            this.potId = "";
            this.potDialogVisible = true;
        },
        handleEdit(row) {
            this.potId = row.id;
            this.potDialogVisible = true
        },
        handleDelete(item) {
            PotAPI.del({ id: item.id })
                .then(({ data }) => {
                    if (data.code == 200) {
                        message_success("删除成功");
                        this.getList();
                    }
                })
        },
    }
}
</script>
  
<style scoped>
.el-tag--plain {
    color: #5B92FF !important;
    background-color: transparent !important;
    border-color: #5B92FF !important;
}


</style>