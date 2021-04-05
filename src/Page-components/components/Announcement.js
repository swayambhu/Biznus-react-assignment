import React from 'react';
import {Link} from 'react-router-dom';
import style from '../styles/Announcement.module.css'

const Announcement = () => {
    return ( 

        <Link to="/alert/how-were-responding-to-covid-19"  className = {`${style.announcement}`}>
                <div className={`${style.announcementBtn}`}> Announcement </div>
                <div className = {`${style.announcementTxt}`}>How we're responding to COVID-19</div>
        </Link>
        
     );
}
 
export default Announcement;