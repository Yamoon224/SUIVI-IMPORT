

export const sortObject = (data: Array<any>, name: string) => {
    data.sort(function(a: any, b: any){
        if(a[name] < b[name]){
            return -1;
        }else if(a[name] > b[name]){
            return 1;
        }
        return 0;
    })
}

export const grouping = (data: Array<any>, name: string) => {
    let result: any = [];
    let tmp: any = [];
    let val = "";
    sortObject(data, name);
    data.forEach((item, index) => {
        if(index == 0){
            val = item[name];
        }
        if(val == item[name]){
            tmp.push(item);
        }else{
            result.push(tmp);
            tmp = [item];
            val = item[name];
        }
    });
    result.push(tmp)
    return result;
}

