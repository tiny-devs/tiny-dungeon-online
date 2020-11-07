import { AES }  from "https://deno.land/x/god_crypto/aes.ts";

export default class DataManager {
    private aes: AES

    constructor() {
        const aesKey = Deno.env.get('tinyaeskey') // the key must have a length of 16
        const key = aesKey ? aesKey : 'defaultaeskey123'
        this.aes = new AES(key, {
            mode: "cbc",
            iv: "tiny land online",
        });
    }

    public async encryptUserData(userData: string): Promise<string> {
        const encryptedData = await this.aes.encrypt(userData)
        return encryptedData.hex()
    }

    public async decryptUserData(userData: string): Promise<string> {
        const bytes = this.hexToUint8Array(userData)
        const decryptedData = await this.aes.decrypt(bytes)
        return decryptedData.toString()
    }

    private hexToUint8Array(data: string): Uint8Array {
        let bytes = new Uint8Array(Math.ceil(data.length / 2));
        for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(data.substr(i * 2, 2), 16);
        return bytes
    }
}