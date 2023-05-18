import axios from "./interceptor/http"

const BASE_URL = "/v1/recipe"

/**
 * 配方API
 */
export default {

    /**
     * 添加
     * @param data
     * @returns {AxiosPromise}
     */
    add: (data) => {
        return axios({
            url: BASE_URL + "/add",
            method: "post",
            data
        })
    },

    /**
     * 修改
     * @param data
     * @returns {AxiosPromise}
     */
    edit: (data) => {
        return axios({
            url: BASE_URL + "/edit",
            method: "post",
            data
        })
    },

    /**
     * 删除
     * @param data
     * @returns {AxiosPromise}
     */
    del: (data) => {
        return axios({
            url: BASE_URL + "/delete",
            method: "post",
            data
        })
    },

    /**
     * 查询分页列表
     * @param data
     * @returns {AxiosPromise}
     */
    page: (data) => {
        return axios({
            url: BASE_URL + "/index",
            method: "post",
            data
        })
    },

     /**
     * 查询单个
     * @param data
     * @returns {AxiosPromise}
     */
     getOne: (data) => {
        return axios({
            url: BASE_URL +  "/index",
            method: "post",
            data
        })
    },

    /**
     * 新增或修改
     * @param url  add/edit
     * @param data
     * @returns {AxiosPromise}
     */
    saveOrUpdate: (url, data) => {
        return axios({
            url: BASE_URL +"/"+ url,
            method: "post",
            data
        })
    },

    /**
     * 下发配置
     */
    sendToMQTT: (data) => {
        return axios({
            url: BASE_URL + "/send/to/mqtt",
            method: "post",
            data
        })
    },

    /**
     * 搜索物料
     * @param data
     * @returns {AxiosPromise}
     */
    search_index: (data) => {
        return axios({
            url: BASE_URL + "/search/materials",
            method: "post",
            data
        })
    },

    /**
     * 获取物料
     * @param data
     * @returns {AxiosPromise}
     */
    get_material: (data) => {
        return axios({
            url: BASE_URL + "/get/material",
            method: "post",
            data
        })
    },

    /**
     * 物料创建
     * @param data
     * @returns {AxiosPromise}
     */
    create_material: (data) => {
        return axios({
            url: BASE_URL + "/material/create",
            method: "post",
            data
        })
    },

    /**
     * 搜索口味
     * @param data
     * @returns {AxiosPromise}
     */
    search_taste: (data) => {
        return axios({
            url: BASE_URL + "/search/taste",
            method: "post",
            data
        })
    },

     /**
     * 创建口味
     * @param data
     * @returns {AxiosPromise}
     */
     create_taste: (data) => {
        return axios({
            url: BASE_URL + "/taste/create",
            method: "post",
            data
        })
    },

    /**
     * 删除
     * @param data
     * @returns {AxiosPromise}
     */
    delete_materials: (data) => {
        return axios({
            url: BASE_URL + "/delete/materials",
            method: "post",
            data
        })
    },

     /**
     * 删除
     * @param data
     * @returns {AxiosPromise}
     */
     delete_taste: (data) => {
        return axios({
            url: BASE_URL + "/delete/taste",
            method: "post",
            data
        })
    }
}