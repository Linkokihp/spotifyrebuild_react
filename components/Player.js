import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    VolumeUpIcon,
    RewindIcon,
    SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react/cjs/react.development";
import { useRecoilState } from "recoil";
import SpotifyWebApi from "spotify-web-api-node";
import { currentTrackIdState, isPlaylingState } from "../atoms/songAtom";
import useSonginfo from "../hooks/useSonginfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlaylingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSonginfo();

    const fetchCurrentSong = () => {
        if(!songInfo) {
            spotifyApi.getMyCurrentPlaybackState().then(data => {
                console.log("Now playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    };

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId) {
            //fetch the songinfo
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackIdState, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceAdjustVolume(volume)
        }
    }, [volume])

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {})
        }, 500)
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img  className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt=""/>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
                <HeartIcon className="button"/>
            </div>

            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button"/>
                {/* Is  not working (API broken) */}
                <RewindIcon className="button"/>

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                )}

                {/* Is  not working (API broken) */}
                <FastForwardIcon className="button"/>
                <ReplyIcon className="button"/>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume-10)} className="button"/>
                <input className="w-14 md:w-28" type="range" onChange={(e) => setVolume(Number(e.target.value))} value={volume} min={0} max={100}/>
                <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume+10)} className="button"/>
            </div>
        </div>
    )
}

export default Player