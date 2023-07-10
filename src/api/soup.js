import axios from "./interceptor/http"

// 加汤数据管理
export function soup_index(data) {
    return axios({
        url: "v1/soup/data/index",
        method: "post",
        data
    })
}

export function soup_export(data) {
    return axios({
        url: "v1/soup/data/export",
        method: "post",
        data
    })
}