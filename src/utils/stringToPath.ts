import compact from "./compact"

export default (string: string):string[] =>{
    return compact(string.replace(/["|']|\]/g, '').split(/\.|\[/))
}