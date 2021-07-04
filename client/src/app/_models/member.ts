import { Photo } from "./photo";


var arr = [1, 2 ,3]
export interface Member {
    id: number
    username: string
    photoUrl: string
    age: number
    knowAs: any
    created: Date
    lastActive: Date
    gender: string
    introduction: string
    lookingFor: string
    interests: string
    city: string
    country: string
    photos: Photo[]
  }
  

  