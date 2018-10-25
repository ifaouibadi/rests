import {ServerClient, ResponseHandlers} from "./server_client";
import {Queryset} from "./queryset";
import {ModelFieldsSchema} from "./field_schema";


// -------------------------
// Model
//
// -------------------------

export class Model {

    public static BASE_URL: string;
    public static PK_FIELD_NAME: string;
    public static FIELDS_SCHEMA: ModelFieldsSchema;

    public static readonly FIELDS: string[];
    public static serverClient: ServerClient;
    public static objects: typeof Queryset;

    constructor(data: object){
        Object.keys(data).map(fieldName => this[fieldName] = data[fieldName])
    }

    public pk(){
        return this[this.constructor['PK_FIELD_NAME']]
    }

    public baseUrl(): string{
        return this.constructor['BASE_URL']
    }

    public serverClient(): ServerClient{
        return this.constructor['serverClient']
    }

    public async delete(responseHandlers: ResponseHandlers={}){
        let response = await this.serverClient().delete(`${this.baseUrl()}/${ this.pk() }/delete/`, responseHandlers)
    }

    public async save(responseHandlers: ResponseHandlers={}){
        let response = await this.serverClient().post(`${this.baseUrl()}/${ this.pk() }/update/`, this._toData(), responseHandlers)
    }

    public toData(): object {
        let data = {};
        this.constructor['FIELDS'].map((fieldName) => {
            data[fieldName] = this[fieldName];
        });
        return data;
    }

    private _toData(): object {
        let data = {};
        this.constructor['FIELDS'].map((fieldName) => {
            if (fieldName !== this.constructor['PK_FIELD_NAME']){
                data[fieldName] = this[fieldName];
            }
        });
        return data;
    }

}