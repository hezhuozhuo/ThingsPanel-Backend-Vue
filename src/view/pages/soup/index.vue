<template>
    <div class="rounded card p-4">
        <el-row type="flex" :gutter="20" class="pt-3 pb-3 px-3">
          <el-col>
            <TableTitle>{{ $t('SOUPDATAMANGEMENT.ADDSOUPDATAMANAGME') }}</TableTitle>
          </el-col>
        </el-row>
      
        <!-- 头 start -->
        <el-row type="flex" :gutter="10" class="pt-3 pb-4 px-3 el-dark-input">  
          <el-col :span="4">
            <el-input
                v-model="params.shop_name"
                :placeholder="$t('SOUPDATAMANGEMENT.SHOPNAMEKEYS')"
                clearable
                @keydown.enter.native="getList()"
                @clear="getList()">
            </el-input>
          </el-col>

          <el-col :span="4">
            <el-input
                v-model="params.table_number"
                :placeholder="$t('SOUPDATAMANGEMENT.SOUPDATALIST.TABLENUMBER')"
                clearable
                @keydown.enter.native="getList()"
                @clear="getList()">
            </el-input>
          </el-col>

          <el-col :span="6">
            <el-date-picker
              class="date-picker w-100"
              v-model="params.order_time"
              :picker-options="DatePickerOptions"
              :clearable="true"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="getList()"
              type="datetimerange"
              start-placeholder="订单开始日期"
              :range-separator="$t('DATA_MANAGEMENT.PLACEHOLDER6')"
              end-placeholder="订单结束日期">
          </el-date-picker>

          </el-col>
      
          <el-col :span="5">
            <div>
              <el-button class="mr-2" type="border" size="medium" @click="getList()">{{ $t('DATA_MANAGEMENT.SEARCH') }}</el-button>
      
              <el-popconfirm :title="`确定导出 ${total} 条数据吗?`" @confirm="handleExport()">
                <el-button slot="reference" type="export" size="medium">{{ $t('DATA_MANAGEMENT.EXPORT') }}</el-button>
              </el-popconfirm>
            </div>
          </el-col>
        </el-row>
        <!-- 头 end -->
      
        <!-- 表 start -->
        <el-table :data="tableData">
          <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.NO')" type="index" width="50"></el-table-column>

          <!-- 店铺名 -->
          <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.SHOPNAME')" prop="shop_name"></el-table-column>
      
          <!-- 订单号 -->
          <!-- <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.ORDERID')" prop="order_sn"></el-table-column> -->

          <!-- 锅底名称 -->
          <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.BOTTOMNAME')"  prop="bottom_pot"></el-table-column>

          <!-- 桌号 -->
          <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.TABLENUMBER')" prop="table_number" width="100"></el-table-column>
      
          <!-- 订单时间 -->
          <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.ORDERTIME')"  prop="order_time"></el-table-column>

          <!-- 开始加汤时间 -->
          <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.STARTADDSOUPTIME')" prop="soup_start_time"></el-table-column>

          <!-- 加汤完成时间 -->
          <el-table-column :label="$t('SOUPDATAMANGEMENT.SOUPDATALIST.ADDSOUPFINISHTIME')" prop="soup_end_time"></el-table-column>
          
          <!-- 传锅完成时间 -->
          <el-table-column label="传锅完成时间" prop="turning_pot_end_time"></el-table-column>
        </el-table>
        <!-- 表 end -->
      
        <div class="text-right py-3">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="params.current_page"
              :page-size="params.per_page"
              @current-change="getList"></el-pagination>
        </div>
      
        <el-dialog
            class="el-dark-dialog el-dark-input"
            width="30%"
            :title="$t('DATA_MANAGEMENT.EXPORT')"
            :visible.sync="exportVisible">
      
          <div class="text-center">
            <p>{{ downloadUrl ? downloadUrl.split('/').pop().toString() : $t('DATA_MANAGEMENT.GENERATE_WAIT') }}</p>
            <p v-if="!exporting">
                <a :href="downloadUrl">{{ $t('DATA_MANAGEMENT.CLICKDOWNLOAD') }}</a>
            </p>
          </div>
      
        </el-dialog>
      </div>
</template>
<!-- ========================================加汤数据管理================================================== -->
<script>
import TableTitle from "@/components/common/TableTitle.vue";
import { soup_index, soup_export } from "@/api/soup";;
import DatePickerOptions from "@/utils/DatePickerOptions";
import { dateFormat } from "@/utils/tool.js";
export default {
  components: {TableTitle},
  props: {},
  data() {
    return {
        tableData: [],
        loading: false,
        total: 0,
        params: {
          current_page: 1,
          per_page: 10,
          shop_name: '',
        },
        exportVisible: false,
        downloadUrl: "",
        exporting: false,
        DatePickerOptions: DatePickerOptions
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
        if(this.loading) return
        this.loading = true
        if (this.params.order_time) {
          this.params.start_time = this.params.order_time[0];
          this.params.end_time = this.params.order_time[1];
        } else {
          this.params.start_time = "";
          this.params.end_time = "";
        }
        soup_index(this.params).then(({data}) => {
            if(data.code === 200) {
                this.tableData = data.data.data || [];
                console.log("==============kvIndex=================")
                console.log(this.tableData)
                console.log("==============kvIndex=================")
                this.total = data.data.total
            }
        }).finally(()=>{
            this.loading = false
        })
    },
    handleSearch() {

    },
    handleExport() {
      this.exportVisible = true;
      const { start_time, end_time } = this.params;
      soup_export({ current_page: 1, per_page: 10, limit: this.total, start_time, end_time })
        .then(({ data: result }) => {
          if (result.code === 200) {
            this.downloadUrl = result.data;
            this.exporting = false;
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>