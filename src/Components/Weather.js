import React, { useState, useRef } from 'react';
import './Weather.css';
import cloud from '../assets/cloud.png';
import wind from '../assets/mist.png';
import humidity from '../assets/mist.png';
import clear from '../assets/clear.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import mist from '../assets/mist.png';
import defaultImage from '../assets/404.png';
import cloudvideo from '../assets/istockphoto-618156794-640_adpp_is.mp4';
import rainvideo from '../assets/Rain.mp4';
import snowfall from '../assets/197213 (720p).mp4';
import mistVideo from '../assets/stream_-_91342 (720p).mp4'
import haze from '../assets/forest_-_49981 (720p).mp4'
import axios from 'axios';

const Weather = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [data, setData] = useState({
        celcius: 10,
        name: "London",
        humidity: 10,
        speed: 2,
        country: 'Eng',
        image: defaultImage,
        Video: ''
    });

    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef(null);

    const handleClick = () => {
        if (name !== "") {
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=66b23e8b7c355a7616f519036550f9dc`;

            axios.get(apiURL)
                .then((res) => {
                    let imgPath = '';
                    let videoPath = '';
                    if (res.data.weather[0].main === "Clouds") {
                        imgPath = cloud;
                        videoPath = cloudvideo;
                    } else if (res.data.weather[0].main === "Rain") {
                        imgPath = rain;
                        videoPath = rainvideo;
                    } else if (res.data.weather[0].main === "Clear") {
                        imgPath = clear;
                    } else if (res.data.weather[0].main === "Snow") {
                        imgPath = snow;
                        videoPath = snowfall;
                    } else if (res.data.weather[0].main === "Mist") {
                        imgPath = mist;
                        videoPath = mistVideo;
                    } else if (res.data.weather[0].main === "Haze") {
                        imgPath = clear;
                        videoPath = haze;
                    } else {
                        imgPath = defaultImage;
                    }

                    setData({
                        celcius: res.data.main.temp - 273.15,
                        name: res.data.name,
                        humidity: res.data.main.humidity,
                        speed: res.data.wind.speed,
                        country: res.data.sys.country,
                        image: imgPath,
                        Video: videoPath
                    });
                    setError('');
                    setShowVideo(false); // Reset the video
                    setTimeout(() => setShowVideo(true), 100); // Start the new video after a short delay
                    console.log(res);
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        setError("Invalid City Name")
                    } else {
                        setError('')
                    }
                    setShowVideo(false);
                    console.log(err)
                })
        }

    }

    // useEffect(() => {
    //     handleClick();
    // }, [])
    return (
        <div className="container">
            <div className="weather">
                <div className="search">
                    <input type="text" placeholder="Search City..." onChange={e => setName(e.target.value)} />
                    <button onClick={handleClick}>Search</button>
                </div>

                <div className="error">
                    <p>{error}</p>
                </div>
                <div className="winfo">
                    <img src={data.image} alt="" className='icon' />
                    <h1>{Math.round(data.celcius)}&deg;C</h1>
                    <h2>{data.name} ,<span>{data.country}</span></h2>
                    <div className="details">
                        <div className="col">
                            <img src={humidity} alt="" />
                            <div className="humidity">
                                <p>{Math.round(data.humidity)}%</p>
                                <p>Humidity</p>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind} alt="" />
                            <div className="wind">
                                <p>{Math.round(data.speed)} km/h</p>
                                <p>Wind</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showVideo &&
                <video ref={videoRef} className="video-bg" loop muted autoPlay>
                    <source src={data.Video} type="video/mp4" />
                </video>
            }
        </div>
    );
};

export default Weather;
