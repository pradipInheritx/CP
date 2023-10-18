import React, { useContext, useEffect, useState } from 'react'
import COINPARLIAMENT from 'assets/images/COINPARLIAMENT.webp'
import SPORTPARLIAMENT from 'assets/images/SPORTPARLIAMENT.webp'
import STOCKPARLIAMENT from 'assets/images/STOCKPARLIAMENT.webp'
import VOTINGPARLIAMENT from 'assets/images/VOTINGPARLIAMENT.webp'
import styled from 'styled-components'
import { Buttons } from "Components/Atoms/Button/Button";
import UserContext from 'Contexts/User'
import axios from 'axios'
import { auth } from 'firebase'

const Button = styled.a`
  flex-direction: column;
  justify-content: center;
  border:1px solid white;
  border-radius:5px;
  background-color:#160133;
  padding:1em;
  text-decoration: none;
  color:white;
  cursor:pointer;
  text-align:center;
  min-width:9em;
    &:hover {
    background:white;
    color:#160133;
    box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
  }
`;



// const Sites = [
//   {
//     img: COINPARLIAMENT,
//     des: 'Coin Parliament is a web 3-based vote to earn game where you can make better investment decisions, mint NFTs, and earn rewards by voting and following top influencers.',
//     title: 'COIN PARLIAMENT',
//     redirect: 'https://coinparliamentstaging.firebaseapp.com/',
//     // redirect: 'http://localhost:3001/',
//     domain: process.env.REACT_APP_COIN_API,
//     name: 'coin',
//   },
//   {
//     img: SPORTPARLIAMENT,
//     des: 'Sport Parliament is an innovative web 3-based platform that allows sports fans to vote on their favorite teams and athletes while earning rewards and staying up-to-date on the latest news and trends.',
//     title: 'SPORT PARLIAMENT',
//     redirect: 'https://sportparliament.com/',
//     domain: process.env.REACT_APP_SPORT_API,
//     name: 'sport',
//   },
//   {
//     img: STOCKPARLIAMENT,
//     des: 'Stock Parliament is a revolutionary web 3-based platform that combines social voting and investing to help you make better investment decisions, earn rewards, and stay ahead of the curve in the fast-paced world of stocks.',
//     title: 'STOCK PARLIAMENT',
//     redirect: 'https://stockparliament.com/',
//     domain: process.env.REACT_APP_STOCK_API,
//     name: 'stock',
//   },
//   {
//     img: VOTINGPARLIAMENT,
//     des: 'The ultimate voting platform for a wide range of topics, including celebrities, music, politics, religion, world economy, and more. Express your opinions, make your voice heard, and earn rewards for your participation. ',
//     title: 'VOTING PARLIAMENT',
//     redirect: 'https://votingparliament.com/',
//     // redirect: 'http://localhost:3001/',
//     domain: process.env.REACT_APP_VOTING_API,
//     name: 'voting',
//   },
// ];
enum SiteTypes {
  coin = 'coin',
  sport = 'sport',
  stock = 'stock',
  voting = 'voting',
}
function Home() {

  const [sites, setSites] = useState<{ [key: string]: any }>({
    [SiteTypes.coin]: {
      img: COINPARLIAMENT,
      des: 'Coin Parliament is a web 3-based vote to earn game where you can make better investment decisions, mint NFTs, and earn rewards by voting and following top influencers.',
      title: 'COIN PARLIAMENT',
      redirect: 'https://coinparliamentstaging.firebaseapp.com/',
      // redirect: 'http://localhost:3001/',
      domain: process.env.REACT_APP_COIN_API,
      name: 'coin',
    },
    [SiteTypes.sport]: {
      img: SPORTPARLIAMENT,
      des: 'Sport Parliament is an innovative web 3-based platform that allows sports fans to vote on their favorite teams and athletes while earning rewards and staying up-to-date on the latest news and trends.',
      title: 'SPORT PARLIAMENT',
      redirect: 'https://sportparliament.com/',
      domain: process.env.REACT_APP_SPORT_API,
      name: 'sport',
    },
    [SiteTypes.stock]: {
      img: STOCKPARLIAMENT,
      des: 'Stock Parliament is a revolutionary web 3-based platform that combines social voting and investing to help you make better investment decisions, earn rewards, and stay ahead of the curve in the fast-paced world of stocks.',
      title: 'STOCK PARLIAMENT',
      redirect: 'https://stockparliament.com/',
      domain: process.env.REACT_APP_STOCK_API,
      name: 'stock',
    },
    [SiteTypes.voting]: {
      img: VOTINGPARLIAMENT,
      des: 'The ultimate voting platform for a wide range of topics, including celebrities, music, politics, religion, world economy, and more. Express your opinions, make your voice heard, and earn rewards for your participation. ',
      title: 'VOTING PARLIAMENT',
      redirect: 'https://votingparliament.com/',
      // redirect: 'http://localhost:3001/',
      domain: process.env.REACT_APP_VOTING_API,
      name: 'voting',
    },
  })


  const [loading, setLoading] = useState('');
  const redirectUserToSite = (site: { [key: string]: string }) => {
    setLoading(site.name)
    let userIds = JSON.parse(localStorage.getItem('userId') || "{}")
    axios.post(`${site.domain}isLoggedInFromVoteToEarn`, {
      data: {
        userId: userIds[site.name],
        email: auth.currentUser?.email
      }
    }).then((response) => {
      if (response?.data?.result?.token) {
        setSites((prev) => {
          return {
            ...prev,
            [site.name]: { ...site, redirect: `${site.redirect}?token=${response?.data?.result?.token}` }
          }
        })
        // Sites[index].redirect = `${redirectUrl}?token=${response?.data?.result?.token}`
        // window.location.replace(`${redirectUrl}?token=${response?.data?.result?.token}`);
      }
      setLoading('')
    }).catch(() => {
      setLoading('')
    });
  }
  useEffect(() => {
    redirectUserToSite(sites.coin);
    redirectUserToSite(sites.sport);
    redirectUserToSite(sites.stock);
    redirectUserToSite(sites.voting);
  }, []);

  return (
    <div className='d-flex flex-column justify-content-center align-items-center p-5'>
      <h1 className='pb-4'>TOP VTE PLATFORMS</h1>
      <div className='row'>
        {
          Object.keys(sites).map((key: string, index) => {
            return (
              <div key={index} className="card mb-3 col-sm-6" style={{ background: '#160133', color: 'white', textAlign: 'justify' }}>
                <div className="row no-gutters">
                  <div className="col-md-6 p-0">
                    <img src={sites[key].img} className="card-img pt-3" alt="img" />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body">
                      <p className="card-text">{sites[key].des}</p>
                      <div className='d-flex mt-4 align-items-center'>
                        <h6 style={{ marginRight: '1em' }}>{sites[key].title}</h6>
                        <Button  /* disabled={loading === sites[key]?.name} */ onClick={() => window.location.replace(`${sites[key].redirect}`)} >
                          {(loading === sites[key]?.name) ? <span className='loading'>wait...</span> : 'Visit site'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div >
  )
}

export default Home
