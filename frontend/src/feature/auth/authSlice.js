import React from 'react'
import {createSlice} from '@reduxjs/toolkit'

const initialState={
    user:{},
    token:null,
    isAuthenticated:false,
    isLoading:false,
    error:null,
    registrationData:{
        username:"",
        email:"",
        password:"",
        fullname:"",
        avatarFile:null,
    }    
}

export const authSlice = createSlice({
    name:'auth',
    initialState,

    reducers:{
        registerStart:(state,action)=>{
            state.isLoading =true
            state.error = false
        },
        registerSuccess:(state,action)=>{
            state.user = action.payload.user
            state.token = action.payload.token
            state.isLoading = false;
            state.error = false
        },
        registerFailure:(state,action)=>{
            state.error = action.payload
            state.isLoading = false
            state.isAuthenticated = false
        },
        setAvatar:(state,action)=>{
            const{file} = action.payload
            state.registrationData.avatarFile = file
        },
        updateRegistrationField:(state,action)=>{
            const {field, value} = action.payload
            state.registrationData[field] = value
        }

    }
})

export const {registerStart,registerSuccess,registerFailure,setAvatar,updateRegistrationField} = authSlice.actions
export default authSlice.reducer