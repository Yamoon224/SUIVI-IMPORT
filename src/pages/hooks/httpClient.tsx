import axios from "axios";



export const URI_BASE = 'http://127.0.0.1:8080/api';
// export const URI_BASE = 'http://10.90.9.142:81/api';


const httpClient = axios.create({
    baseURL: URI_BASE,
    headers: {
        "Authorization": localStorage.getItem("authToken") ? "Bearer " + localStorage.getItem("authToken") : "",
    }
});


export const httpHighTraffic = () => {
    return axios.create({
        baseURL: URI_BASE,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        headers: {
            "Authorization": localStorage.getItem("authToken") ? "Bearer " + localStorage.getItem("authToken") : "",
        }
    })

}



export const writeErrors = (state: any, errors: any) => {
    /*for(const key in errors){
        state[key] = errors[key];
    }*/
    for (const key in state) {
        if (errors[key] == undefined) {
            state[key] = undefined;
        } else {
            state[key] = errors[key];
        }
    }
    return state;
}

export const encodeData = (values: any) => {
    const formData = new FormData();

    for (const key in values) {
        if (Object.hasOwnProperty.call(values, key)) {
            formData.append(key, values[key]);
        }
    }
    return formData;
}


export const fetchImgR = (uri: string) => {
    return "/static/" + uri + "R";
}
export const fetchImgV = (uri: string) => {
    return "/static/" + uri + "V";
}
export const fetchData = (uri: string) => {
    return "/static/" + uri + "D";
}

export default httpClient;