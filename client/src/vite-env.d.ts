/// <reference types="vite/client" />


declare interface users {
    _id?:string
    username?:String
    email?:String
    isAdmin?:boolean
    roles?:string[]
    createdAt?:string
    updatedAt?:string
}

declare interface projects {
    _id?:string
    projectTitle?:string
    severity?:string
    startDate?:string
    endDate?:string
    projectStatus?:string
    assignee?:string
    userId?:users
    projectImage?:string
    createdAt?:string
    updatedAt?:string
}