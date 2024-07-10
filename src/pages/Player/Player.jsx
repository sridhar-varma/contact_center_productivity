import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams } from 'react-router-dom'

const Player = () => {

  const navigate =useNavigate();

  const {id}=useParams();
  const [apiData,setApiData]=useState({name:"",key:"",published_at:"",typeof:""});
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDNjNWM1ZTI3MmI1NDA1YWJjOGU1ODZiMGE3MDBkYiIsIm5iZiI6MTcxOTQ4MzcwNC4yOTM2NDIsInN1YiI6IjY2Nzk4NTYwNzZjNzg4MDZmMDU2NTUwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FucUtyqGKGJ_f7pdUmR0FRAfuZkcIA835MhPbS6RrPk'
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(response => {
        if (response.results && response.results.length > 0) {
          setApiData(response.results[0]);
        } else {
          throw new Error('No video data found');
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        // Handle error state here, e.g., set a default or show a message
      });
  }, []);
  


  return (
    <div className='player'>
      <img src={back_arrow_icon} onClick={()=>{
        navigate(-1)
      }}/>
      <iframe width='90%' height='90%' src={`https://www.youtube.com/embed/${apiData.key}`} title='trailer' frameBorder='0' allowFullScreen></iframe>
      <div className="player-info">
        <p>{apiData.published_at.slice(0,10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  )
}

export default Player
