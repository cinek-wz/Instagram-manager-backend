export default class ErrorEx
{
    public code: number;
    public data: any;
    public name: string;

    constructor(code: number, data?: any) 
    {
        this.name = this.constructor.name;

        this.code = code;
        this.data = data;
    }

    toString() {
        return `${this.name} (${this.code})${(this.data == null ? "" : "\n" + this.data)}`;
    }
}