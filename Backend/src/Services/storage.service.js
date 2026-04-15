import ImageKit from '@imagekit/nodejs';
import {config} from "../config/config.js";

const client = new ImageKit({
    privateKey: config.imagekit_private_key,
   
});
export async function uploadFile({  buffer , fileName ,folder="Vexto"}){
    try{
        const result = await client.files.upload({
            file: await ImageKit.toFile(buffer),
            fileName,
            folder
        });
        return result;
    }
    catch(error){
        console.log(error);
        return error;
    }
}



export default client;