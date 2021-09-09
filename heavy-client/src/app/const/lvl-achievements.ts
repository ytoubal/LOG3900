import { ProfilePic } from "../interfaces/profile-pic";

export interface Achievement {
  level: number;
  border: ProfilePic;
  title: string;
}

export const LVL_ACHIEVEMENTS = [
  {
    level: 1,
    border: {
      name: "border0",
      src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
    },
    title: "none",
  },
  {
    level: 2,
    border: {
      name: "border1",
      src: "assets/images/borders/border1.png",
    },
    title: "Beginner",
  },
  {
    level: 3,
    border: {
      name: "border2",
      src: "assets/images/borders/border2.png",
    },
    title: "Casual",
  },
  {
    level: 4,
    border: {
      name: "border3",
      src: "assets/images/borders/border3.png",
    },
    title: "Aspiring",
  },
  {
    level: 5,
    border: {
      name: "border4",
      src: "assets/images/borders/border4.png",
    },
    title: "Boss",
  },
  {
    level: 6,
    border: {
      name: "border5",
      src: "assets/images/borders/border5.png",
    },
    title: "Amateur",
  },
  {
    level: 7,
    border: {
      name: "border6",
      src: "assets/images/borders/border6.png",
    },
    title: "Emerging",
  },
  {
    level: 8,
    border: {
      name: "border7",
      src: "assets/images/borders/border7.png",
    },
    title: "Pro",
  },
  {
    level: 9,
    border: {
      name: "border8",
      src: "assets/images/borders/border8.png",
    },
    title: "Ancient",
  },
  {
    level: 10,
    border: {
      name: "border9",
      src: "assets/images/borders/border9.png",
    },
    title: "Legend",
  },
] as Achievement[];
