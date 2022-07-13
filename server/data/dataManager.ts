export default class DataManager {
    private aesKey: CryptoKey | undefined
    private iv: Uint8Array
    private aesAlgorithm = "AES-CBC"

    constructor() {
        const aesKey = Deno.env.get('tinyaeskey')
        const key = aesKey ? aesKey : 'defaultaeskey123'
        const encodedKey = new TextEncoder().encode(key)

        this.iv = new TextEncoder().encode("tiny land online")
        
        crypto.subtle.importKey(
            "raw",
            encodedKey,
            this.aesAlgorithm,
            true,
            ["encrypt", "decrypt"],
          ).then((result: CryptoKey) => {
                this.aesKey = result
            }
        )
    }

    public async encryptUserData(userData: string): Promise<string> {
        const encryptedData = await crypto.subtle.encrypt(
            {name: this.aesAlgorithm, iv: this.iv},
            this.aesKey!,
            new TextEncoder().encode(userData),
          )
        return this.arrayBufferToHex(encryptedData)
    }

    public async decryptUserData(userData: string): Promise<string> {
        const bytes = this.hexToUint8Array(userData)
        const decryptedData = await crypto.subtle.decrypt(
            {name: this.aesAlgorithm, iv: this.iv},
            this.aesKey!,
            bytes,
          )
        return new TextDecoder("utf-8").decode(decryptedData)
    }

    private hexToUint8Array(data: string): Uint8Array {
        const bytes = new Uint8Array(Math.ceil(data.length / 2));
        for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(data.substr(i * 2, 2), 16);
        return bytes
    }

    private arrayBufferToHex(buffer: ArrayBuffer) {
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')
    }
}