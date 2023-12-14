import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import userModel from '../models/user.model.js';
import {createHash,isValidPassword} from '../utils.js';
import {Strategy as GithubStrategy} from 'passport-github2';
import config from '../config.js'


const opts = {
    usernameField: 'email', //cambio de nombre del cambio a acceder. Esta vez se accede por email.
    passReqToCallback: true,
}

const githubOptions = {
    clientID: "Iv1.e310e5b3881a4f9d",
    clientSecret:  config.clientSecret,
    callbackURL: "http://localhost:8080/api/session/github-callback" ,
}

export const init = () => {
    passport.use('register', new LocalStrategy(opts, async (req, email,password,done)=>{
        try {
            const user = await userModel.findOne({email});
            if(user){
                return done(new Error('User already register'));
            }
            const newUser = await userModel.create({
                ...req.body,
                password: createHash(password)
            });
            done(null, newUser);
        } catch (error) {
            done(new Error(`Ocurrio un error en la autenticacion: ${error.message}`))
        }

    } ));

    passport.use('login', new LocalStrategy(opts, async (req, email,password,done)=>{
        try {
            const user = await userModel.findOne({email});
            if(!user){
                return done(new Error('Email or password invalided'));
            }
            const isPassValid = isValidPassword(password, user)
            if(!isPassValid){
                return done(new Error('Email or password invalided'));
            }
            done(null, user);
        } catch (error) {
            done(new Error(`Ocurrio un error en la autenticacion: ${error.message}`))
        }

    } ));

    passport.use('github', new GithubStrategy(githubOptions, async (accessToken, refreshToken, profile, done)=>{
        console.log('profile',profile);
        const email = profile._json.email;
        let user = await userModel.findOne({email: email});
        if(user){
            return done(null,user);
        }
        user = {
            first_name: profile._json.name,
            last_name: '',
            email: email,
            age: 18,
            password: '',
            provider:'Github',
        }

        const newUser = await userModel.create(user)
        done(null,newUser)

    } ));

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser( async (uid,done)=>{
        const user = await userModel.findById(uid)
        done(null,user)
    })
        
}

