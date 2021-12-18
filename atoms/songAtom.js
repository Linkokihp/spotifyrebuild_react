import { atom } from "recoil";

export const currentTrackIdState = atom({
    key: "currentTrackIdState",
    //Unique ID with respect tp pther atoms
    default: null,
    //initial value
});

export const isPlaylingState = atom ({
    key: "isPlayingState",
    default: false,
})