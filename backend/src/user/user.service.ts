import userModel from "./user.model";
import token from "../utils/token";
import HttpException from "../utils/http.exception";

class UserService {
    private user = userModel;


    // REgister a User

    public async registerUser(
        name: string, 
        email: string, 
        password: string, 
        ):Promise<string | Error> {
        try {
            const user = await this.user.create({name,email,password});
            const accessToken = token.createToken(user);
            return accessToken;
        } catch (error) {
            throw new Error("Unable To Create User")
        }
    }

    /**
     * Login User
     */
    public async loginUser(
        email: string,
        password: string
    ):Promise<string | Error> {
        try {
            const user = await this.user.findOne({email});

            if(!user){
                throw new Error('User Not Found');
            }
            if(await user.isValidPassword(password)){
                return token.createToken(user);
            }else{
                throw new Error('Wrong Credentials Given');
            }
            
        } catch (error) {
            throw new Error('Unable To Login User');
        }
    }
}

export default UserService;