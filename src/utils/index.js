import Cookies from "js-cookie"
export const API_URL = "https://selective-vivacious-tern.glitch.me/api"

export const config = {
    headers: {
        token: `${Cookies.get("AuthToken")}`
    }
}
export const IMAGE_URL = "https://api.cloudinary.com/v1_1/ds9evspym/image/upload"