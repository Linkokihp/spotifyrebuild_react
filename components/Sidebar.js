import React from 'react'
import { 
    HomeIcon,
    SearchIcon,
    LibraryIcon, 
    PlusCircleIcon,
    RssIcon,
 } from '@heroicons/react/outline';
 import { 
    HeartIcon,
 } from '@heroicons/react/solid';
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';

function sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items);
            })
        }
    }, [session, spotifyApi])

    console.log(playlistId)

    return (
        <div className="text-gray-500 p-5 text-xs lg:text-sm border-r 
        border-gray-900 overflow-y-scroll scrollbar-hide h-screen 
        sm:max-w[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
            <div className="space-y-4">
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="w-5 h-5"/>
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="w-5 h-5"/>
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="w-5 h-5"/>
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>

                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="w-5 h-5 text-blue-600"/>
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="w-5 h-5"/>
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="w-5 h-5 text-green-300"/>
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>

                {/* Playlist */}
                {playlists.map((playlist) => (
                    <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)}
                    className='cursor-pointer hover:text-white'>{playlist.name}</p>
                ))}
            </div>
        </div>
    );
}

export default sidebar;